<?php
	//include_once "../connectionToDB.php";
	//include_once "../verschluesselung.php";
	require_once "../checkUser.php";
	
	//$conn = new MenuDatabase();
	if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["loginPassword"]) && isset($_POST["email"]))
    {
		
		if (isset($_COOKIE['consent']) && $_COOKIE['consent'] == "true") {
			if($usersFound > 1 || $couldUpdateDatabase == false)
			{
				echo "Aktualisieren Sie bitte die Seite und loggen Sie sich erneut an!";
				exit;
			}
			else if($user == true)
			{
				echo "Sie sind bereits als ".$username." angemeldet";
				exit;
			}
			else if($couldReadFromDatabase == false)
			{
				echo "Es konnte kein Zugriff auf die Datenbank hergestellt werden :(";
				exit;
			}
			else {
				$email = strtolower($_POST["email"]);
				$result = $conn->getDBConnection()->query("SELECT * FROM users WHERE email='$email' AND confirmed=1");
				if($result == false)
				{
					echo "Es konnte kein Zugriff auf die Datenbank hergestellt werden :(";
					exit;
				}
				else if($result->num_rows == 1)
				{
					while ($row = $result->fetch_assoc()) {
						$password_from_databse_encrypted = $row["password"];
						if(decrypt($password_from_databse_encrypted, $registerationPassword) == $_POST["loginPassword"])
						{
							$randomID = guidv4();
							$result = $conn->getDBConnection()->query("UPDATE users SET session_key='$randomID' WHERE email='$email';");
							if($result == false)
							{
								echo "Es konnte kein Zugriff auf die Datenbank hergestellt werden :(";
								exit;
							}
							else
							{
								setcookie('loginCookie', $randomID, time() + (86400 * 3), '/');
								echo "Sie sind jetzt als ".$row["name"]." angemeldet :)";
								exit;
							}
							
						}
						else
						{
							echo "Falsches Kennwort";
							exit;
						}
					}
				}
				else
				{
					echo "Benutzer nicht gefunden";
					exit;
				}
			}
			/*if(isset($_COOKIE['loginCookie']) && $_COOKIE['loginCookie'] != "")
			{
				$loginStringFromCookie = $_COOKIE['loginCookie'];
				$result = $conn->getDBConnection()->query("SELECT * FROM users WHERE session_key='$loginStringFromCookie';");
				if($result->num_rows > 1)
				{
					$result = $conn->getDBConnection()->query("UPDATE users SET session_key='' WHERE session_key='$loginStringFromCookie'");
					echo "Aktualisieren Sie bitte die Seite und loggen Sie sich erneut an!";
					exit;
				}
				else if($result->num_rows == 1)
				{
					while ($row = $result->fetch_assoc()) {
						$username = $row["name"];
					}
					echo "Sie sind bereits als ".$username." angemeldet";
					exit;
				}
				else
				{
					$email = strtolower($_POST["email"]);
					$result = $conn->getDBConnection()->query("SELECT * FROM users WHERE email='$email' AND confirmed=1");
					if($result->num_rows == 1)
					{
						while ($row = $result->fetch_assoc()) {
							$password_from_databse_encrypted = $row["password"];
							if(decrypt($password_from_databse_encrypted, $registerationPassword) == $_POST["loginPassword"])
							{
								$randomID = guidv4();
								$conn->getDBConnection()->query("UPDATE users SET session_key='$randomID' WHERE email='$email';");
								setcookie('loginCookie', $randomID, time() + (86400 * 3), '/');
								echo "Sie sind jetzt als ".$row["name"]." angemeldet :)";
								exit;
							}
							else
							{
								echo "Falsches Kennwort";
								exit;
							}
						}
					}
					else
					{
						echo "Benutzer nicht gefunden";
						exit;
					}
				}
			}
			else
			{
				//Same code as the code in the previous else but too lazy too put it in a function
				$email = strtolower($_POST["email"]);
				$result = $conn->getDBConnection()->query("SELECT * FROM users WHERE email='$email' AND confirmed=1");
				if($result->num_rows == 1)
				{
					while ($row = $result->fetch_assoc()) {
						$password_from_databse_encrypted = $row["password"];
						if(decrypt($password_from_databse_encrypted, $registerationPassword) == $_POST["loginPassword"])
						{
							$randomID = guidv4();
							$conn->getDBConnection()->query("UPDATE users SET session_key='$randomID' WHERE email='$email';");
							setcookie('loginCookie', $randomID, time() + (86400 * 3), '/');
							echo "Sie sind jetzt als ".$row["name"]." angemeldet :)";
							exit;
						}
						else
						{
							echo "Falsches Kennwort";
							exit;
						}
					}
				}
				else
				{
					echo "Benutzer nicht gefunden";
					exit;
				}
			}*/
		}
		else
		{
			echo "Sie haben Cookies nicht akzeptiert :(";
			exit;
		}
		//$loginString = guidv4();
		//setcookie('loginCookie', $loginString, time() + (86400 * 3), '/'); // Cookie will expire in 3 days (86400 seconds per day)

		
    }
	if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["newPasswordEmail"]))
	{
		$resettingEmail = strtolower($_POST["newPasswordEmail"]);
		$result = $conn->getDBConnection()->query("SELECT * FROM users WHERE email='$resettingEmail';");
		if($result)
		{
			if($result->num_rows > 1)
			{
				echo "Registrieren Sie sich bitte mit einer neuen Email-Adresse";
				exit;
			}
			else if($result->num_rows == 0)
			{
				echo "Email konnte nicht gefunden werden";
				exit;
			}
			else
			{
				$encryptedMail;
				$encryptedPassword;
				while ($row = $result->fetch_assoc()) {
					$encryptedMail = encrypt($row["email"],$newPassword);
					$encryptedPassword = encrypt($row["password"],$newPassword);
				}
				try {
					if (function_exists( 'mail' ))
					{
						$sentMail = mail($resettingEmail, 'Neues Passwort Erstellen', "http://localhost/Restaurant/newPassword.php?token=".urlencode($encryptedMail)."&token2=".urlencode($encryptedPassword));
						if($sentMail)
						{
							echo "Link erfolgreich gesendet :)";
							exit;
						}
						else
						{
							echo "Es ist ein unerwarteter Fehler aufgetreten :(";
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
					exit;//throw $th;
				}
			}
		}
		else
		{
			echo "Es konnte keine Verbindung mit der Datenbank hergestellt werden :(";
			exit;
		}

	}
	function guidv4($data = null) {
		// Generate 16 bytes (128 bits) of random data or use the data passed into the function.
		$data = $data ?? random_bytes(16);
		assert(strlen($data) == 16);
	
		// Set version to 0100
		$data[6] = chr(ord($data[6]) & 0x0f | 0x40);
		// Set bits 6-7 to 10
		$data[8] = chr(ord($data[8]) & 0x3f | 0x80);
	
		// Output the 36 character UUID.
		return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
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

	<!-- Start Menu -->
	<div class="menu-box">
		<div class="container-login" >
			<h1 style="color: #cfa671; padding-top:5px;">Anmeldung</h1>
			<p id="errorMessage" style="color: red;"></p>
            <form method="POST" class="formAnmeldung" id="formAnmeldung" onsubmit="return false">
              
                <div class="txt_field">
                    <input type="text" required name='username' id="loginUsername" placeholder=" ">
                    <span></span>
                    <label>E-mail</label>
                </div>
                <div class="txt_field password-container" id="password_txt_field">
                    <input type="password" required name='kennwort' id="loginPassword" placeholder=" ">
                    <span></span>
					<i class="gg-eye" id="eye"></i>
                    <label>Passwort</label>
                </div>
                <div class = 'pass' id="sendNewPasswordRequest">Passwort vergessen?</div>
              	<button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="loginButton" type="submit" style="width:10rem !important;">Anmelden</button>
				<button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="goToRegister" type="button" style="margin-top:5px; width:10rem !important;">Registrieren</button>
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
	<!--This is only for the cookies banner-->
	<link rel="stylesheet" href="../css/cookies_banner.css"> 
		
		
	
	<!--<script src="../js/login.js" type="module"></script>-->
	<script> 
	$("#goToRegister").click(function(){
		window.location.href = "../registrieren";
	});
	let modal;
	let cookiesAccepted;
	if(getCookie("consent") == "true")
	{
		cookiesAccepted = true;
		$(".cookie-consent-banner").css("display", "none");
	}
	else
	{
		cookiesAccepted = false;
	}
	
	window.onload = function()
	{
		document.getElementById("sendNewPasswordRequest").onclick = function()
		{
			showPopUpWithHTML(`<p id="errorMessageNewPassword" style="color: red;"></p>
			<div class="txt_field" id="emailToResetPassword">
			<input type="text" id="emailNewPassword" placeholder=' '>
			<span></span>
			<label>Email eingeben</label>
			</div>
			<button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none   " id="newLinkButton">Link Senden</button>`);
			document.getElementById("newLinkButton").onclick = startResettingProcess;
		}

		$(".cookie-consent-banner__actions").click(function(){
			cookiesAccepted = true;
			setCookie("consent", true, 365);
			$(".cookie-consent-banner").css("display", "none");
		});
		document.getElementById("eye").onclick = changeInputType;
		document.getElementById("errorMessage").innerText = "";

		modal = document.getElementById("myModal");
		document.getElementById("closeModal").onclick = ()=>{
            modal.style.display = "none";
            }
		window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    	}
		$("#formAnmeldung").submit(()=>{
				if(cookiesAccepted == false)
				{
					showPopUp("Sie haben Cookies noch nicht akzeptiert :(");
				}
				else
				{
					document.getElementById('loginButton').disabled = true;
				document.getElementById("loginButton").innerHTML = `<div class='loader' style='position: relative; 
				left: 35%;'></div>`;
				if(!validateEmail(document.getElementById("loginUsername").value))
				{
					document.getElementById("errorMessage").innerText = "Geben Sie bitte eine gültige Email-Adresse ein";
					document.getElementById("loginButton").innerHTML = "Anmelden";
					document.getElementById('loginButton').disabled = false;
				}
				else
				{
					$.post("",
					{
						loginPassword: document.getElementById("loginPassword").value,
						email:document.getElementById("loginUsername").value
					},
					function(data, status){
		
						if(status == "success")
						{
							showPopUp(data);
							document.getElementById("loginButton").innerHTML = "Anmelden";
							document.getElementById('loginButton').disabled = false;
						}
						else
						{
							showPopUp("Es gab ein unerwarteter Fehler bei der Anmeldung!");
							document.getElementById("loginButton").innerHTML = "Anmelden";
							document.getElementById('loginButton').disabled = false;
						}
					});
				}
				}
				
				
			});
	}
	

		function validateEmail(email)
		{
			return String(email)
				.toLowerCase()
				.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
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
		function changeInputType()
		{
			if(document.getElementById("loginPassword").getAttribute("type") == "password")
			{
				document.getElementById("loginPassword").setAttribute("type", "text");
				document.getElementById("eye").style.color = "lightgrey";
			}
			else
			{
				document.getElementById("loginPassword").setAttribute("type", "password");
				document.getElementById("eye").style.color = "black";
			}
		}
		function setCookie(name, value, days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		const expires = "expires=" + date.toUTCString();
		document.cookie = name + "=" + value + ";" + expires + ";path=/";
		}
		function getCookie(name) {
		const decodedCookie = decodeURIComponent(document.cookie);
		const cookieArray = decodedCookie.split(';');
		for (let i = 0; i < cookieArray.length; i++) {
			let cookie = cookieArray[i];
			while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1);
			}
			if (cookie.indexOf(name + "=") === 0) {
			return cookie.substring(name.length + 1);
			}
		}
		return null;
		}
		function deleteCookie(name) {
		document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		}
		async function startResettingProcess()
		{
			if(document.getElementById("emailNewPassword").value != "")
			{
				
				document.getElementById("errorMessageNewPassword").innerText = "";
				//start loading process
				document.getElementById("newLinkButton").innerHTML = `<div class='loader' style='position: relative; 
				left: 5%;'></div>`;
				document.getElementById('newLinkButton').disabled = true;
				//end of loading process
				//start of logic
				$.post("",
					{
						newPasswordEmail:document.getElementById("emailNewPassword").value
					},
					function(data, status){
		
						if(status == "success")
						{
							showPopUp(data);
						}
						else
						{
							showPopUp("Es gab ein unerwarteter Fehler bei der Anmeldung!");
						}
				});
				//end of logic
			}    
			else
			{
				document.getElementById("errorMessageNewPassword").innerText = "Geben Sie bitte ein E-mail ein";
			}    
		}
		$(function(){
		  $("#header-container").load("../header.html", function() {
			$('#logoContainer').attr("href", "../");
			
			document.getElementById('homeButton').classList.remove("active");

			document.getElementById('anmeldenButton').classList.add("active");

			//This string is needed to be saved in a variable else it gets to complicated 
			const profileButton = '<li class="nav-item" id="profileButton"><a class="nav-link" href="http://localhost/Restaurant/profile">Profile</a></li>';
			<?php 
			if($user == true)
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
	
</body>
</html>