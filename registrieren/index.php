<?php
	include_once "../connectionToDB.php";
	include_once "../verschluesselung.php";
	$conn = new MenuDatabase();
	if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["name"]) && isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["adress"]))
    {	
		$userIsUsed = false;
		try {
			$result = $conn->getDBConnection()->query("SELECT email from users;");
			while ($row = $result->fetch_assoc()) {
				if($row["email"] == $_POST["email"])
				{
					$userIsUsed = true;
				}
			}
			if($userIsUsed === true)
			{
				echo "Email bereits verwendet";
				exit;
			}
			else
			{
				try {
					$passwordToWriteInTheDatabase = encrypt($_POST['password'],$registerationPassword);
					$name = ucwords(strtolower($_POST["name"]));
					$email = strtolower($_POST["email"]);
					$adress = $_POST["adress"];
					$result = $conn->getDBConnection()->query("INSERT INTO users VALUES('','$name','$adress','$email','$passwordToWriteInTheDatabase',0, 0, '', 0);");
					if($result)
					{
						try {
							if (function_exists( 'mail' ))
							{
								$sentMail = mail($email, 'Email Bestätigungslink', "http://localhost/Restaurant/bestaetigung.php?token=".urlencode(encrypt($email,$confirmationEmail)));
								if($sentMail)
								{
									echo "Sie wurden erfolgreich registriert :)";
									exit;
								}
								else
								{
									echo "Email konnte nicht gefunden werden oder ein unerwarteter Fehler ist aufgetreten :(";
									exit;
								}
							}
							else
							{
								echo 'Email konnte aufgrund eines Fehlers im Server nicht gesendet werden :(';
								exit;
							}
							
							
						
						} catch (\Throwable $th) {
							echo "Bestätigungslink konnte leider nicht gesendet werden";
							exit;
						}
						
					}
					else
					{
						echo "Es konnte leider keine Verbindung mit der Datenbank hergestellt werden";
						exit;
					}
				} catch (\Throwable $th) {
					echo "Es ist ein Fehler aufgetreten. Versuchen Sie es später erneut";
					exit;
				}
			}
		} catch (\Throwable $th) {
			echo "Es ist ein unerwarteter Fehler aufgetreten. Versuchen Sie es bitte später erneut!";
			exit;
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

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../css/bootstrap.min.css">    
	<!-- Site CSS -->
    <link rel="stylesheet" href="../css/style.css">    
    <!-- Responsive CSS -->
    <link rel="stylesheet" href="../css/responsive.css">
	
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../css/custom.css">
	<link href='https://unpkg.com/css.gg@2.0.0/icons/css/eye.css' rel='stylesheet'>
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
	<!-- Start header -->
	<header class="top-navbar">
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
			<div class="container" id="header-container">
				<!--Kommt von header-->
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


	<!-- Start Menu -->
	<div class="menu-box">
		<div class="container-login" >
			<h1 style="color: #cfa671; padding-top:5px;">Registrierung</h1>
			<p id="errorMessageRegistration" style="color: red;"></p>
			<!--class of formAnmeldung is needed to have the same style-->
            <form method="POST" class="formAnmeldung" id="formregistrieren" onsubmit="return false">
              
				<div class="txt_field">
                    <input type="text" required name='fullname' id="fullName" placeholder=" ">
                    <span></span>
                    <label>Vor- und Zuname*</label>
                </div>
                <div class="txt_field">
                    <input type="text" required name='username' id="registerUsername" placeholder=" " autocomplete="username">
                    <span></span>
                    <label>E-mail*</label>
                </div>
				<div class="txt_field password-container">
                    <input type="password" required name='firstPassword' id="registerFirstPassword" placeholder=" " autocomplete="new-password">
                    <span></span>
					<i class="gg-eye" id="eye1"></i>
                    <label>Passwort*</label>
					
                </div>
				<div class="txt_field password-container">
					
                    <input type="password" required name='secondPassword' id="registerSecondPassword" placeholder=" " autocomplete="new-password">
                    <span></span>
                    <label>Passwort wiederholen*</label>
					<i class="gg-eye" id="eye2"></i>
                </div>
				<div class="txt_field">
                    <input type="text" id="registerAdress" placeholder=" ">
                    <span></span>
                    <label>Ihre Strassenadresse</label>
                </div>
				<div class="txt_field">
                    <input type="text" name='housenumber' id="houseNumber" placeholder=" ">
                    <span></span>
                    <label>Hausnummer</label>
                </div>
              	<button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="registerButton" type="submit">Registrieren</button>
            </form>
		</div>
	</div>
	<!-- End Menu -->
	
	
	
	
	<!-- Start Contact info -->
	<div class="contact-info-box">
		
	</div>
	<!-- End Contact info -->
	
	<!-- Start Footer -->
	<footer class="footer-area bg-f">
		
	</footer>
	<!-- End Footer -->
	


	<!-- ALL JS FILES -->
	<script src="../js/jquery-3.2.1.min.js"></script>
	<script src="../js/bootstrap.min.js"></script>

	
	<script> 
	let modal;

	var input = document.getElementById("registerAdress");
	var options = {
		componentRestrictions: { country: "DE"}
	};
	window.onload = () => {

		modal = document.getElementById("myModal");
		document.getElementById("closeModal").onclick = ()=>{
            modal.style.display = "none";
            }
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
			modal.style.display = "none";
			}
		}
		
		
    	$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDWYP4eaq8K2LsSL14wLdq3TZWBoSgri00&libraries=places&callback=initAutocomplete");
		
		
		
		document.getElementById("eye1").onclick = changeInputOneType;
		document.getElementById("eye2").onclick = changeInputTwoType;
	}
	function initAutocomplete()
	{
		new google.maps.places.Autocomplete(input, options);
	}
	function changeInputOneType()
	{
		if(document.getElementById("registerFirstPassword").getAttribute("type") == "password")
		{
			document.getElementById("registerFirstPassword").setAttribute("type", "text");
			document.getElementById("eye1").style.color = "lightgrey";
		}
		else
		{
			document.getElementById("registerFirstPassword").setAttribute("type", "password");
			document.getElementById("eye1").style.color = "black";
		}
	}

	function changeInputTwoType()
	{
		if(document.getElementById("registerSecondPassword").getAttribute("type") == "password")
		{
			document.getElementById("registerSecondPassword").setAttribute("type", "text");
			document.getElementById("eye2").style.color = "lightgrey";
		}
		else
		{
			document.getElementById("registerSecondPassword").setAttribute("type", "password");
			document.getElementById("eye2").style.color = "black";
		}
	}
		
		$("#formregistrieren").submit(()=>{
			document.getElementById("errorMessageRegistration").innerText = "";

			var houseNumber = document.getElementById("houseNumber").value;
			var fullName = document.getElementById("fullName").value;
			var registrationEmail = document.getElementById("registerUsername").value;
			var password = document.getElementById("registerFirstPassword").value;
			var secondPassword = document.getElementById("registerSecondPassword").value;

			if(password !== secondPassword)
			{
				window.scrollTo({top: 0, behavior: 'smooth'});
				document.getElementById("errorMessageRegistration").innerText = "Passwörter stimmen nicht überein";
			}
			else if(password.length < 6)
			{
				window.scrollTo({top: 0, behavior: 'smooth'});
				document.getElementById("errorMessageRegistration").innerText = "Passwort darf nicht kürzer als 6 Zeichen sein";
			}
			else if(fullName.length < 5 || fullName.length > 100)
			{
				window.scrollTo({top: 0, behavior: 'smooth'});
				document.getElementById("errorMessageRegistration").innerText = "Name darf nicht kürzer als 5 oder länger als 100 Zeichen sein";
			}
			else if(!validateEmail(registrationEmail))
			{
				window.scrollTo({top: 0, behavior: 'smooth'});
				document.getElementById("errorMessageRegistration").innerText = "Geben Sie eine gültige E-mail Adresse ein";
			} 
			else if(document.getElementById("registerAdress").value != "")
			{
				if(document.getElementById("registerAdress").value.length < 3)
				{
					window.scrollTo({top: 0, behavior: 'smooth'});
					document.getElementById("errorMessageRegistration").innerText = "Adresse darf nicht kleiner als 3 Zeichen sein";
				}
				else if(document.getElementById("houseNumber").value == "")
				{
					window.scrollTo({top: 0, behavior: 'smooth'});
					document.getElementById("errorMessageRegistration").innerText = "Geben Sie bitte Ihre Hausnummer";
				}
				else if(document.getElementById("houseNumber").value.length > 5)
				{
					window.scrollTo({top: 0, behavior: 'smooth'});
					document.getElementById("errorMessageRegistration").innerText = "Hausnummer darf nicht länger als 5 Zeichen sein";
				}
				else
				{
					document.getElementById('registerButton').disabled = true;//deactivate register button
					document.getElementById("registerButton").innerHTML = `<div class='loader' style='position: relative; 
					left: 10%;'></div>`;
					//Just because we need an Element of html sooo it doesn't matter
					var map = new google.maps.Map(document.getElementById('registerAdress'));

					var request = {
					query: document.getElementById('registerAdress').value,
					fields: ['ALL'],
					};

					var service = new google.maps.places.PlacesService(map);

					//stop loading process code has been placed like this because I don't feel like using await
					service.findPlaceFromQuery(request, function(results, status) {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
							var request = {
								placeId: results[0].place_id,
								fields: ['ALL'],
							};
							service.getDetails(request, function(results, status) {
								if (status === google.maps.places.PlacesServiceStatus.OK) {
									if(results.vicinity == "Schweinfurt")
									{
										var registrationAdress = results.formatted_address.substring(0, results.formatted_address.indexOf(", ")) + " " + houseNumber;
										registerUser(fullName , registrationEmail, password, registrationAdress);
									}
									else
									{
										showPopUp("Adresse scheint nicht in Schweinfurt zu sein!");
										stopLoadingProcess();
									}
								}
								else
								{
									showPopUp("Adresse konnte nicht gefunden werden");
									stopLoadingProcess();
								}
							});
						}
						else
						{
							showPopUp("Suche nach Adresse fehlgeschlagen");
							stopLoadingProcess();
						}
					});
				}
			}
			else
			{
				showPopUpWithHTML(`<h3>Ohne Adresse Registrieren?</br>Sie können Die Adresse danach nicht ändern!</h3></br>
				<a class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="backButton">Zurück</a>
				<a class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="registerWithoutAdress">Weiter</a>`);
				document.getElementById("backButton").onclick = () => {
					modal.style.display = "none";
				};

				document.getElementById("registerWithoutAdress").onclick = () => {
					modal.style.display = "none";
					document.getElementById('registerButton').disabled = true;//deactivate register button
					document.getElementById("registerButton").innerHTML = `<div class='loader' style='position: relative; 
					left: 8%;'></div>`;
					
					var registrationAdress = "";
					registerUser(fullName , registrationEmail, password, registrationAdress);
					
				};
				autoComplete = null;
    			autoComplete = new google.maps.places.Autocomplete(input, options);
			}
		});
			function registerUser(fullName , registrationEmail, registerPassword, registrationAdress)
			{
				$.post("",
					{
						name: fullName,
						email: registrationEmail,
						password: registerPassword,
						adress: registrationAdress
					},
					function(data, status){
						
						if(status == "success")
						{
							showPopUp(data);
							if(data == "Sie wurden erfolgreich registriert :)")
							{
								window.onclick = function(event) {
									if (event.target == modal) {
										window.location.href = '../anmeldung';
									}
								}
							}
							stopLoadingProcess();
						}
						else
						{
							showPopUp("Es konnte keine Verbindung mit dem Server hergestellt werden");
							stopLoadingProcess();
						}
					});
				
			}
			
				/*$.post("",
					{
						registerFirstPassword: document.getElementById("registerFirstPassword").value,
					},
					function(data, status){
						
						if(status == "success")
						{
							
						}
					});
				});*/

		function validateEmail(email)
		{
			return String(email)
				.toLowerCase()
				.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
		}
		function stopLoadingProcess()
		{
			document.getElementById("registerButton").innerHTML = "Registrieren";
			document.getElementById('registerButton').disabled = false;
		}

		function showPopUp(message)
		{
			document.getElementById("messageText").innerText = message;
			modal.style.display = "grid";
		}

		function showPopUpWithHTML(htmlMessage)
		{
			document.getElementById("messageText").innerText = "";
			document.getElementById("messageText").innerHTML = htmlMessage;
			modal.style.display = "grid";
		}

		$(function(){
		  $("#header-container").load("../header.html", function() {
			$('#logoContainer').attr("href", "../");
			
			document.getElementById('homeButton').classList.remove("active");

			
		  }); 
		});
		$(".contact-info-box").load("../contactInfos.html");
		$(".footer-area").load("../footer.html");
	</script> 
	
</body>
</html>