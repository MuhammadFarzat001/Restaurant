<?php
    error_reporting(1);
    class Order
    {
        private $user;
        private $adress;
        public $order;
        private $ingredients;
        private $name;
        private $email;
        private $mealsFromDatabase;
        private $delivery_method;
        private $restaurant_infos;
        private $errors_array = array();
        private $wholePrice = 0;

        public function __construct($userLoggedIn, $adress, $order, $ingredients, $name, $email, $meals, $delivery_method, $restaurant_infos)
        {
            $this->user = $userLoggedIn;
            $this->adress = $adress;
            $this->order = $order;
            $this->ingredients = $ingredients;
            $this->name = $name;
            $this->email = $email;
            $this->mealsFromDatabase = $meals;
            $this->delivery_method = $delivery_method;
            $this->restaurant_infos = $restaurant_infos;
            foreach ($this->mealsFromDatabase as $key => $value) {
                $this->mealsFromDatabase[$key]["ingredients"] = json_decode($this->mealsFromDatabase[$key]["ingredients"], true);
            }
        }

        public function checkForUserLoggedInConditions()
        {
            if($this->user == null)
            {
                for ($i=0; $i < count($this->order); $i++) { 
                    if(isset($this->order[$i]->echteAnzahl) && $this->order[$i]->echteAnzahl != null)
                    {
                        array_push($this->errors_array,"Sie sind nicht angemeldet und wollen Punkte benutzen?? Was soll denn des????");
                    }
                }
                if($this->delivery_method == "delivery" && $this->adress == null)
                {
                    array_push($this->errors_array,"Sie können leider nicht ohne Adresse liefern lassen :(");
                }
                else if($this->delivery_method == "delivery" && $this->name == null || $this->delivery_method == "delivery" && $this->email == null)
                {
                    array_push($this->errors_array,"Sie haben leider keinen Namen/Email eingegeben :(");
                }
                else if($this->name == null)
                {
                    array_push($this->errors_array,"Sie haben leider keinen Namen eingegeben :(");
                }
                else
                {
                    $this->checkIngredientsValidation();
                    $this->calculatePrice();
                    $this->saveOrder();
                }
            }
            else
            {
                //It could be the a user is logged in and orders with another name in case he wants to order to his friend or something
                if($this->name == null)
                {
                    $this->name = $this->user["username"];
                }
                //But email is also the emal of the logged in user
                $this->email = $this->user["userMail"];
                if($this->delivery_method == "delivery" && $this->adress == null && $this->user["userAdress"] == "")
                {
                    array_push($this->errors_array,"Sie haben leider keine Adresse gespeichert :(");
                }
                if($this->delivery_method == "delivery" && $this->adress == null && $this->user["userAdress"] != "")
                {
                    $this->adress = $this->user["userAdress"];
                }
                else
                {
                    $this->checkIngredientsValidation();
                    $this->calculatePrice();
                    $this->saveOrder();
                }
            }
            

        }
        /*We check if the restaurant is opened or not and if the delivery is possible*/
        public function checkRestaurantCondition()
        {
            if($this->delivery_method == null)
            {
                array_push($this->errors_array,"Ungültige Liefermethode :(");
            }
            else if($this->delivery_method == "delivery" && $this->restaurant_infos["lieferung"] != "true")
            {
                array_push($this->errors_array,"Lieferung ist im Moment nicht möglich :(");
            }
            else if($this->restaurant_infos["geoeffnet"] != "true")
            {
                array_push($this->errors_array,"Leider haben wir im Moment geschlossen :(");
            }
            
        }
        //We check if the order as a string is messed with or not
        public function checkOrderStringFormation()
        {
            if(substr($this->order, 0,1) == "[" && substr($this->order,-1) == "]")
		    {
                //needed because we are converting for an array to json because we want to check for any unwanted changes from the client side 
                $this->order = substr($this->order, 1, -1);
                $this->order = explode(",{", $this->order);
                //We start from 1 because the 0 item is done correctly
                for ($i=1; $i < count($this->order); $i++) { 
                    $this->order[$i] = "{".$this->order[$i];
                }
                //All items should be json objects or else the order was messed with
                foreach ($this->order as &$value) {
                    if(!$this->json_validator($value))
                    {	
                        array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                        
                    }
                }
                //Since the items are strings we need to convert them to json objects
                for ($i=0; $i < count($this->order); $i++) { 
                    $this->order[$i] = json_decode($this->order[$i]);
                }
                
            }
            else
            {
                array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                
            }
        }
        //We check if the needed information are present or not
        public function checkForValidationOfOrder()
        {
            /*Here we check if the json objects that we received have the id attibute
			If yes then we check if this item is in the database*/
			for ($i=0; $i < count($this->order); $i++) { 
				if(isset($this->order[$i]->id))
				{
					if(!isset($this->mealsFromDatabase[$this->order[$i]->id]))
					{
						array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
					}
				}
				else
				{
					array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
				}
			}
            
        }
        public function getErrorsArray()
        {
            return $this->errors_array;
        }
        public function getPrice()
        {
            return $this->wholePrice;
        }
        private function json_validator($data) { 
            if (!empty($data)) { 
                @json_decode($data); 
                return (json_last_error() === JSON_ERROR_NONE); 
            } 
            return false; 
        }
        private function calculatePrice()
        {
            if(count($this->errors_array) == 0)
            {
                if($this->delivery_method == "delivery")
                {
                    $this->wholePrice += 1.5;
                }
                for($i=0;$i<count($this->order);$i++)
                {
                    //anzahl must exist and must be more than 0
                    if(!isset($this->order[$i]->anzahl) || !is_numeric($this->order[$i]->anzahl) || $this->order[$i]->anzahl <= 0)
                    {
                        array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                    }
                    else
                    {
                        $this->wholePrice += $this->order[$i]->anzahl * $this->mealsFromDatabase[$this->order[$i]->id]["price"];
                    }
                }
            }
        }
        private function saveOrder()
        {
            global $user;
            if(count($this->errors_array) == 0)
            {
                try {
                    //We need to do it this way because it doesn't work otherwise
                    $ID = ($this->user == null) ? "NULL" : $this->user['ID'];
                    //This is needed because somehow the order has [ at first and  ] at last. Don't ask me why php sucks and it's not my favourite programming language anymore. I'm gonna switch to nodejs is future projects
                    $this->order = json_encode($this->order,JSON_UNESCAPED_UNICODE);
                    $this->order[strlen($this->order)-1] = "}";
                    $this->order[0] = "{";
                    $dot = "'";
                    $ingredients = ($this->ingredients == null) ? "NULL" : $dot.json_encode($this->ingredients, JSON_UNESCAPED_UNICODE).$dot;
                    $query = "INSERT INTO orders VALUES('', '".$this->order."', ".$ingredients.", '".$this->wholePrice."', ".$ID.", '".$this->name."', '".$this->email."', '".$this->adress."','".$this->delivery_method."', CURRENT_TIMESTAMP);";
                   
                    $result = $user->getDB()->getDBConnection()->query($query);
                    if(!$result)
                    {
                        array_push($this->errors_array,"Fehler Beim Speichern der Bestellung");
                    }

                } catch (\Throwable $th) {
                    array_push($this->errors_array,"Fehler in der Datenbank");
                }
            }
        }
        private function checkIngredientsValidation()
        {
            if($this->ingredients != null)
            {
                if(!$this->json_validator($this->ingredients))
                {
                    array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                }
                else
                {
                    //$key = Cheese Burger 
                    foreach($this->ingredients as $key => $value) 
				    {
                        if(!isset($this->mealsFromDatabase[$key]))
                        {
                            array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                        }
                        //$key2 = 1.Cheese Burger etc. and $value2 is the json object of the ingredients
                        foreach($this->ingredients[$key] as $key2 => $value2) 
                        {
                            if(!$this->json_validator($value2))
                            {
                                array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                            }
                            else
                            {
                                //$key3 = patty etc and $value3 = 3 or 1 etc
                                foreach($value2 as $key3 => $value3)
                                {
                                    if(!isset($this->mealsFromDatabase[$key]["ingredients"][$key3]))
                                    {
                                        array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                                    }
                                    else if($this->mealsFromDatabase[$key]["ingredients"][$key3]["quantity"] === false)
                                    {
                                        array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                                    }
                                    else if($this->mealsFromDatabase[$key]["ingredients"][$key3]["quantity"] === true)
                                    {
                                        $value3 = strtolower($value3);
                                        if($value3 != "standard" && $value3 != "extra" && $value3 != "ohne")
                                        {
                                            array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                                        }
                                        else if($value3 == "extra" && isset($this->mealsFromDatabase[$key]["ingredients"][$key3]["priceProAdd"]))
                                        {
                                            $this->wholePrice += $this->mealsFromDatabase[$key]["ingredients"][$key3]["priceProAdd"];
                                        }
                                    }
                                    else if($value3 < $this->mealsFromDatabase[$key]["ingredients"][$key3]["minQuantity"] || $value3 > $this->mealsFromDatabase[$key]["ingredients"][$key3]["maxQuantity"])
                                    {
                                        array_push($this->errors_array,"Starten Sie den Bestellungsprozess neu an :)");
                                    }
                                    else if(isset($this->mealsFromDatabase[$key]["ingredients"][$key3]["amountToAddPriceFrom"]) && $value3 >= $this->mealsFromDatabase[$key]["ingredients"][$key3]["amountToAddPriceFrom"])
                                    {
                                        for($i = $this->mealsFromDatabase[$key]["ingredients"][$key3]["amountToAddPriceFrom"]; $i <= $value3; $i++)
                                        {
                                            $this->wholePrice += $this->mealsFromDatabase[$key]["ingredients"][$key3]["priceProAdd"];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
   
?>