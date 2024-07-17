<?php
	header("Cache-Control: no-store");
	require "user.php";
	$user = new User();


	$result_of_meals = $user->getDB()->getDBConnection()->query("SELECT * FROM meals;");
	$result_of_categories = $user->getDB()->getDBConnection()->query("SELECT * FROM category;");

	$meals = [];
	$categories = [];
	if($result_of_categories->num_rows > 0)
	{
		//fill the array with all categories to create the button of the categories and to add classes of the right category to each item
		while ($row = $result_of_categories->fetch_assoc()) {
			$categories[$row["ID"]] = $row["name"];
		}
	}
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

?>

<!DOCTYPE html>
<html lang="de"><!-- Basic -->
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">   
   
    <!-- Mobile Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
 
     <!-- Site Metas -->
	 <title>Farzat Restaurant</title>   
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Site Icons -->

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">    
	<!-- Site CSS -->
    <link rel="stylesheet" href="css/style.css">   
	<!--for Cookies banner only-->
	<link rel="stylesheet" href="css/cookies_banner.css">  
    <!-- Responsive CSS -->
    <link rel="stylesheet" href="css/responsive.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/custom.css">

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
	<!-- End header -->
	<div id="myModal" class="modal">

		<!-- Modal content -->
		<div class="modal-content">
			<div id="closeModal">+</div>
		  <p id="messageText"></p>
		</div>
	  
	</div>
	<div class="cookie-consent-banner">
  <div class="cookie-consent-banner__inner">
    <div class="cookie-consent-banner__copy">
      <div class="cookie-consent-banner__header">DIESE WEBSEITE BENUTZT COOKIES</div>
      <div class="cookie-consent-banner__description">Wir benutzen Cookies, um die Funktionen der Website am effizientesten zu erstellen. Ihre Daten werden nicht an dritte Parteien weitergegeben!</div>
    </div>

    <div class="cookie-consent-banner__actions">
      <a class="cookie-consent-banner__cta">
        OK
      </a>
    </div>
  </div>
</div>
	<!-- Start slides -->
	<div id="slides" class="cover-slides">
		<ul class="slides-container">
			<li class="text-center">
				<img src="images/slider-01.jpg" alt="">
				<div class="container">
					<div class="row">
						<div class="col-md-12">
							<h1 class="m-b-20"><strong>Willkommen zum <br> Farzat Restaurant</strong></h1>
							<p class="m-b-40">Leckere Gerichte genau zu Ihrem Geschmack </p>
							<p><a class="btn btn-lg btn-circle btn-outline-new-white zurSpeisekarte">Speisekarte</a></p>
						</div>
					</div>
				</div>
			</li>
			<li class="text-center">
				<img src="images/slider-02.jpg" alt="">
				<div class="container">
					<div class="row">
						<div class="col-md-12">
							<h1 class="m-b-20"><strong>Willkommen zum <br> Farzat Restaurant</strong></h1>
							<p class="m-b-40">Leckere Gerichte genau zu Ihrem Geschmack </p>
							<p><a class="btn btn-lg btn-circle btn-outline-new-white zurSpeisekarte">Speisekarte</a></p>
						</div>
					</div>
				</div>
			</li>
			<li class="text-center">
				<img src="images/slider-03.jpg" alt="">
				<div class="container">
					<div class="row">
						<div class="col-md-12">
							<h1 class="m-b-20"><strong>Willkommen zum <br> Farzat Restaurant</strong></h1>
							<p class="m-b-40">Leckere Gerichte genau zu Ihrem Geschmack </p>
							<p><a class="btn btn-lg btn-circle btn-outline-new-white zurSpeisekarte">Speisekarte</a></p>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
	<!-- End slides -->
	
	<!-- Start About -->
	<div class="about-section-box">
		<div class="container">
			<div class="row">
				<div class="col-lg-6 col-md-6 col-sm-12">
					<img src="https://cdn.winsightmedia.com/platform/files/public/800x420/chef-demo-cooking-saucing-dish.jpg" alt="" class="img-fluid">
				</div>
				<div class="col-lg-6 col-md-6 col-sm-12 text-center">
					<div class="inner-column">
						<h1>Willkommen<?php if($user->getUser() != "undefined"):$userName = $user->getUser()["username"]; echo "<span> $userName</span>"?><?php endif;?> zum <span>Farzat Restaurant</span></h1>
						<h4>Kurz über uns</h4>
						<p>Hier können Sie die Gerichte probieren, die aus einer Kultur, die hunderte von Jahren alt ist, kommen</p>
						<p>Die von uns gesammelte Erfahrung hat sich weiter und stark über 10 Jahre genau für den Zweck entwickelt, um Ihnen das leckerste Essen anbieten zu können</p>
					</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- End About -->
	
	<!-- Start QT -->
	<div class="qt-box qt-background">
		<div class="container">
			<div class="row">
				<div class="col-md-8 ml-auto mr-auto text-left">
					<p class="lead ">
						" If you're not the one cooking, stay out of the way and compliment the chef. "
					</p>
					<span class="lead">Michael Strahan</span>
				</div>
			</div>
		</div>
	</div>
	<!-- End QT -->
	
	<!-- Start Menu -->
	<div class="menu-box">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="heading-title text-center">
						<h2>Speisekarte</h2>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="special-menu text-center">
						<div class="button-group filter-button-group"  id="speisekarte">
							
						</div>
					</div>
				</div>
			</div>
				
			<div class="row special-list">
				
				
			</div>
		</div>
	</div>
	<!-- End Menu -->
	
	
	
	
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
	
	<a href="#" id="back-to-top" title="Back to top" style="display: none;">&uarr;</a>

	<!-- ALL JS FILES -->
	<script src="js/jquery-3.2.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<!-- ALL PLUGINS -->
	<script src="js/jquery.superslides.min.js"></script>
	<script src="js/images-loded.min.js"></script>
	<script src="js/isotope.min.js"></script>
	<script>
		var meals = <?php echo json_encode($meals); ?>;
	function loadCategoriesButtons()
		{
			var newCatButton = document.createElement("button");
			$(newCatButton).attr("data-filter", "*");
			newCatButton.innerText = "Alles";
			newCatButton.classList.add("active");
			$(".button-group").append(newCatButton);

			var categories = <?php echo json_encode($categories); ?>;

			//adding buttons of categories to the dom
			for (var key in categories) {
				if (categories.hasOwnProperty(key)) {
					var value = categories[key];
					var newCatButton = document.createElement("button");
						$(newCatButton).attr("data-filter", "."+value);
						newCatButton.innerText = value;
						$(".button-group").append(newCatButton);
						
				}
			}
			
		}
		const profileButton = '<li class="nav-item" id="profileButton"><a class="nav-link" href="http://localhost/Restaurant/profile">Profile</a></li>';
		var user = <?php 
			if($user->getUser() == "undefined")
			{
				echo "undefined";
			}
			else
			{
				echo json_encode($user->getUser());
			}
		
		?>;
		
		</script>
	<script src="js/custom.js"></script>
	
    
    <!--<script src="js/custom.js" type="module"></script>-->

</body>
</html>


