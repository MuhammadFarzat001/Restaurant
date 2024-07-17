<?php
    include_once "connectionToDB.php";
    include_once "verschluesselung.php";
    $conn = new MenuDatabase();
    if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["newPasswordToReset"]))
    {
        if(isset($_GET["token"]))
        {
            $emailDecrypted = decrypt($_GET["token"],$newPassword);
            $passwordDecrypted = decrypt(decrypt($_GET["token2"],$newPassword), $registerationPassword);
            $passwordDecryptedFromDatabase;
            
            if($emailDecrypted != null && $passwordDecrypted != null)
            {
                $result = $conn->getDBConnection()->query("SELECT * FROM users WHERE email='$emailDecrypted' AND confirmed=1");
                if($result)
                {
                    if($result->num_rows > 1)
					{
						echo "Registrieren Sie sich bitte mit einem neuen Email";
						exit;
					}
					else if($result->num_rows == 1)
					{
                        while($row = $result->fetch_assoc())
                        {
                            $passwordDecryptedFromDatabase = decrypt($row["password"],$registerationPassword);
                        }
                        if($passwordDecryptedFromDatabase == null || $passwordDecrypted != $passwordDecryptedFromDatabase)
                        {
                            echo "Kommen Sie bitte durch den Ihnen gesendeten Link!";
                            exit;
                        }
                        else
                        {
                            $encryptedNewPassword = encrypt($_POST["newPasswordToReset"], $registerationPassword);
                            $result = $conn->getDBConnection()->query("UPDATE users SET password='$encryptedNewPassword';");
                            if($result)
                            {
                                echo "Das Kennwort wurde erfolgreich geändert :)";
                                exit;
                            }
                            else
                            {
                                echo "Kennwort konnte leider nicht geändert werden :(. Fordern Sie bitte einen neuen Link an!";
                                exit;
                            }
                        }
                       
					}
                    else
                    {
                        echo "Konto nicht gefunden :(";
                        exit;
                    }
                }
            }
            else
            {
                echo "Kommen Sie bitte durch den Ihnen gesendeten Link!";
                exit;
            }
        }
        else
        {
            echo "Kommen Sie bitte durch den Ihnen gesendeten Link!";
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
    <link rel="stylesheet" href="css/bootstrap.min.css">    
	<!-- Site CSS -->
    <link rel="stylesheet" href="css/style.css">    
    <!-- Responsive CSS -->
    <link rel="stylesheet" href="css/responsive.css">
	
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/custom.css">
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
			<h1 style="color: #cfa671; padding-top:5px;">Neues Passwort</h1>
			<p id="errorMessageNewLink" style="color: red;"></p>
			<!--class of formAnmeldung is needed to have the same style-->
            <form method="POST" class="formAnmeldung" id="formNewPassword" onsubmit="return false">
              
				
				<div class="txt_field password-container">
                    <input type="password" required name='firstPassword' id="newLinkFirstPassword" placeholder=" ">
                    <span></span>
					<i class="gg-eye" id="eye1"></i>
                    <label>Passwort*</label>
					
                </div>
				<div class="txt_field password-container">
                    <input type="password" required name='secondPassword' id="newLinkSecondPassword" placeholder=" ">
                    <span></span>
                    <label>Passwort wiederholen*</label>
					<i class="gg-eye" id="eye2"></i>
                </div>
				
              	<button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="newPasswordButton" type="submit">Zurücksetzen</button>
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
		<!--footer Datei kommt hier-->
	</footer>
	<!-- End Footer -->
	

	<!-- ALL JS FILES -->
	<script src="js/jquery-3.2.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
    <script>
        let modal;
        
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
            
            document.getElementById("eye1").onclick = changeInputOneType;
            document.getElementById("eye2").onclick = changeInputTwoType;


            $("#newPasswordButton").click(function(){
                document.getElementById("newPasswordButton").innerHTML = `<div class='loader' style='position: relative; 
				left: 0%;'></div>`;
                document.getElementById("errorMessageNewLink").innerHTML = "";
                document.getElementById('newPasswordButton').disabled = true;

                let password1 = document.getElementById("newLinkFirstPassword").value;
                let password2 = document.getElementById("newLinkSecondPassword").value;

                if(password1.length<6)
                {
                    document.getElementById("errorMessageNewLink").innerText = "Kennwort darf nicht kürzer als 6 Zeichen sein";
                    document.getElementById('newPasswordButton').disabled = false;
                    document.getElementById("newPasswordButton").innerText = "Zurücksetzen";
                }
                else if(password1 != password2)
                {
                    document.getElementById("errorMessageNewLink").innerText = "Passwörter stimmen nicht überein";
                    document.getElementById('newPasswordButton').disabled = false;
                    document.getElementById("newPasswordButton").innerText = "Zurücksetzen";
                }
                else
                {
                    $.post("",
					{
						newPasswordToReset: password1
					},
					function(data, status){
		
						if(status == "success")
						{
							showPopUp(data);
							document.getElementById("newPasswordButton").innerText = "Zurücksetzen";
							document.getElementById('newPasswordButton').disabled = false;
						}
						else
						{
							showPopUp("Es gab ein unerwarteter Fehler bei der Zurücksetzung des Kennworts!");
							document.getElementById("newPasswordButton").innerText = "Zurücksetzen";
							document.getElementById('newPasswordButton').disabled = false;
						}
					});
                }
                
            });
        }
        function changeInputOneType()
        {
            if(document.getElementById("newLinkFirstPassword").getAttribute("type") == "password")
            {
                document.getElementById("newLinkFirstPassword").setAttribute("type", "text");
                document.getElementById("eye1").style.color = "lightgrey";
            }
            else
            {
                document.getElementById("newLinkFirstPassword").setAttribute("type", "password");
                document.getElementById("eye1").style.color = "black";
            }
        }

        function changeInputTwoType()
        {
            if(document.getElementById("newLinkSecondPassword").getAttribute("type") == "password")
            {
                document.getElementById("newLinkSecondPassword").setAttribute("type", "text");
                document.getElementById("eye2").style.color = "lightgrey";
            }
            else
            {
                document.getElementById("newLinkSecondPassword").setAttribute("type", "password");
                document.getElementById("eye2").style.color = "black";
            }
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
		  $("#header-container").load("header.html", function() {
			$('#logoContainer').attr("href", "./");
			
			document.getElementById('homeButton').classList.remove("active");

			
		  }); 
		});
		$(".contact-info-box").load("contactInfos.html");
		$(".footer-area").load("footer.html");
    </script>
    
</body>
</html>