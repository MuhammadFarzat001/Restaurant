<?php
//RULE: ob_start, ob_get_contents and ob_end_flush are needed because every time a request is received the site return the whole html code 
//of the current side. To avoid that we add the mentioned function in the order that we used.
	require "../user.php";
	require "order.php";
	$user = new User();
	$result_of_meals = $user->getDB()->getDBConnection()->query("SELECT * FROM meals;");
	$result_of_restaurant_info = $user->getDB()->getDBConnection()->query("SELECT * FROM restaurant_infos;");
	$meals = [];
	$infos = [];
	//saving the restaurant info
	if($result_of_restaurant_info->num_rows > 0)
	{
		while ($row = $result_of_restaurant_info->fetch_assoc()) {
			$infos[$row["info_name"]] = $row["value_of_info_name"];
		}
	}

	//saving the meals
	if($result_of_meals->num_rows > 0)
	{
		//an array with the key of the name of each meal including an array of the informations of the meal
		while ($row = $result_of_meals->fetch_assoc()) {
			$meals[$row["name"]] = array(
				"ID" => $row['ID'],
				'name' => $row["name"],
				'name_of_pic' => $row["name_of_pic"],
				'price' => $row["price"],
				'ingredients' => $row["ingredients_json"],
				'points_to_buy' => $row["points_to_buy"],
				'category_id' => $categories[$row["category_id"]]
				//We are giving the name of the category to the meal by finding the category in the array using the foreign key that is saved in the database
			);
		}
		
	}
	//This should be called whenever "zutaten bearbeiten" is clicked to get the ingredients of a certain item
	if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["ingredientsRequest"]) )
	{
		
		if(isset($meals[$_POST["ingredientsRequest"]]))
		{
			ob_start();
			echo $meals[$_POST["ingredientsRequest"]]["ingredients"];
			$result = ob_get_contents();
			return $result;
		}
		else
		{
			ob_start();
			echo "Menü nicht gefunden";
			$result = ob_get_contents();
			return $result;
		}
		
	}
	//We need this in order to know if the delivery is available and if the restaurant is opened
	if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["getRestaurantInfo"]))
	{
		ob_start();
		echo json_encode($infos);
		$result = ob_get_contents();
		return $result;
	}
	//Here is where the magic happens. We take in the order here
	if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["newOrder"]))
	{	
		$order = new Order(($user->getUser() == "undefined") ? null : $user->getUser(), (isset($_POST["adress"]) && $_POST["adress"] != "") ? $_POST["adress"] : null, $_POST["newOrder"], (isset($_POST["modifiedIngredients"]) && $_POST["modifiedIngredients"] != "") ? $_POST["modifiedIngredients"] : null, (isset($_POST["name"]) && $_POST["name"] != "") ? $_POST["name"] : null, (isset($_POST["email"]) && $_POST["email"] != "") ? $_POST["email"] : null, $meals, ($_POST["method"] == "toGo" || $_POST["method"] == "delivery") ? $_POST["method"] : null, $infos);
		$order->checkRestaurantCondition();
		$order->checkOrderStringFormation();
		$order->checkForValidationOfOrder();
		$order->checkForUserLoggedInConditions();
		ob_start();
		
		if(count($order->getErrorsArray()) > 0)
		{
			echo $order->getErrorsArray()[0];
		}
		else echo "success";
		
		$result = ob_get_contents();
		return $result;
		
		
	}
	else if($_SERVER["REQUEST_METHOD"] === "POST")
	{
		ob_start();
		echo "Was brauchst du denn genau?? :). Benutz die Seite doch einfach weißt";
		$result = ob_get_contents();
		return $result;
	}
	ob_end_flush();


	function checkForIngredients($ingredientsForOrder)
	{
		global $meals;
		if($ingredientsForOrder != "")
		{
			if(!json_validator($ingredientsForOrder))
			{
				return false;
			}
			else
			{
				//$key = Cheese Burger 
				foreach($ingredientsForOrder as $key => $value) 
				{
					if(!isset($meals[$key]))
					{
						return false;
					}
					//$key2 = 1.Cheese Burger etc. and $value2 is the json object of the ingredients
					foreach($ingredientsForOrder[$key] as $key2 => $value2) 
					{
						if(!json_validator($value2))
						{
							return false;
						}
						else
						{
							//$key3 = patty etc and $value3 = 3 or 1 etc
							foreach($value2 as $key3 => $value3)
							{

							}
						}
					}
				}

			}
		}
		return true;
	}

	function json_validator($data) { 
        if (!empty($data)) { 
            @json_decode($data); 
            return (json_last_error() === JSON_ERROR_NONE); 
        } 
        return false; 
    } 
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farzat Restaurant</title>   
 
     <!-- Bootstrap CSS -->
     <link rel="stylesheet" href="../css/bootstrap.min.css">    
     <!-- Site CSS -->
     <link rel="stylesheet" href="../css/style.css">    
     <!-- Responsive CSS -->
     <link rel="stylesheet" href="../css/responsive.css">
     <!-- Custom CSS -->
     <link rel="stylesheet" href="../css/custom.css">
</head>
<body>
    <!-- Start header -->
	<header class="top-navbar">
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
			<div class="container" id="header-container">
				<!--kommt von datei header-->
			</div>
		</nav>
	</header>
	<div id="disableClicks"></div>
	<!-- End header -->
    <div id="myModal" class="modal">
        
		<!-- Modal content -->
		<div class="modal-content">
			<div id="closeModal">+</div>
		    <p id="messageText"></p>
		</div>
	  
	</div>
    <div class="cards">
        
	</div>
		
  
    <!-- Start Contact info -->
	<div class="contact-info-box">
		<!--contactInfos Datei kommt hier-->
	</div>
	<!-- End Contact info -->
	
	<!-- Start Footer -->
	<footer class="footer-area bg-f">
		<!--footer Datei kommt hier-->
	</footer>
	<!-- End Footer -->

    <script src="../js/jquery-3.2.1.min.js"></script>
	<script> 
		var meals = <?php echo json_encode($meals); ?>;
		/*Bruh I don't know why but this is needed so that the ingredients are actually a json object*/
		for(const key in meals)
		{
			meals[key]["ingredients"] = JSON.parse(meals[key]["ingredients"]);
		}
		var realPoints = 
		<?php if($user->getUser() == "undefined")
		{
			echo 0;
		}
		else {
			echo $user->getUser()["userPoints"];
		}?>;
		var userFirstCheck = <?php if($user->getUser() == "undefined")
		{
			echo "undefined";
		}
		else {
			echo json_encode($user->getUser());
		}?>;
		if(userFirstCheck == "undefined")
		{
			userFirstCheck = null;
		}
		
				
		
		$(function(){
			
		  $("#header-container").load("../header.html", function() {
			$('#logoContainer').attr("href", "../");
			
			document.getElementById('homeButton').classList.remove("active");

			document.getElementById('bestellungButton').classList.add("active");
			const profileButton = '<li class="nav-item" id="profileButton"><a class="nav-link" href="http://localhost/Restaurant/profile">Profile</a></li>';
			<?php 
			if($user->getUser() != "undefined")
			{
				echo '
				$("#anmeldenButton").replaceWith(profileButton);
					'
				;
			}
			?>
		  }); 
		});
		$(".contact-info-box").load("../contactInfos.html");
		$(".footer-area").load("../footer.html");
	</script> 
	
	<script>
		function removePointsButtonIfNeeded()
		{
			<?php
			if($user->getUser() == "undefined")
			{
				echo "$('.pointsOfUser').remove();";
			}
			?>
		}
		
	</script>
	
	<script src="../js/order.js"></script>
	<script src="../js/bootstrap.min.js"></script>
    
	
    <!--<script src="../js/order.js" type="module"></script>-->
    
</body>
</html>