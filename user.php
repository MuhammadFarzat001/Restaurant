<?php
    require_once "connectionToDB.php";
    
   error_reporting(1);
   class User
   {
        private $conn;
        private $usersFound = 0;
        private $userIsFound = false;
        private $userID = null;
        private $username = null;
        private $usermail = null;
        private $useradress = null;
        private $userPoints = null;
        private $cookiesAccepted = true;
        private $couldReadFromDatabase = true;
        private $couldUpdateDatabase = true;

       public function __construct()
       {
            $this->conn = new MenuDatabase();
            if (isset($_COOKIE['consent']) && $_COOKIE['consent'] == "true") {
            
                if(isset($_COOKIE['loginCookie']) && $_COOKIE['loginCookie'] != "")
                {
                    
                    $loginStringFromCookie = $_COOKIE['loginCookie'];
                    $result = $this->conn->getDBConnection()->query("SELECT * FROM users WHERE session_key='$loginStringFromCookie';");
                    if($result == false)
                    {
                        $this->couldReadFromDatabase = false;
                    }
                    else if($result->num_rows > 1)
                    {
                        $result = $this->conn->getDBConnection()->query("UPDATE users SET session_key='' WHERE session_key='$loginStringFromCookie'");
                        if($result == false)
                        {
                            $this->couldUpdateDatabase = false;
                        }
                        else
                        {
                            $this->usersFound = $result->num_rows;
                        }
                        
                    }
                    else if($result->num_rows == 1)
                    {
                        $this->userIsFound = true;
                        while ($row = $result->fetch_assoc()) {
                            $this->userID = $row["ID"];
                            $this->username = $row["name"];
                            $this->useradress = $row["adress"];
                            $this->usermail = $row["email"];
                            $this->userPoints = $row["points"];
                        }
                        
                    }
                }
                
            }
            else
            {
                $this->cookiesAccepted = false;
            }
       }
       
       public function getUser()
       {
           
            if($this->userIsFound == true)
            {
                $result = [];
                $result['ID'] = floatval($this->userID);
                $result['username'] = $this->username;
                $result['userAdress'] = $this->useradress;
                $result['userMail'] = $this->usermail;
                $result['userPoints'] = floatval($this->userPoints);
                return $result;
            }
            else
            {
                return "undefined";
            }
       }

       public function getDB()
       {
        return $this->conn;
       }
   }
?>