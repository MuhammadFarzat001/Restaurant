<?php
    include_once "connectionToDB.php";
    include_once "verschluesselung.php";
    if(isset($_GET["token"]))
    {
      
        if(decrypt($_GET["token"], $confirmationEmail) != null)
        {
            $email = decrypt($_GET["token"], $confirmationEmail);
            $conn = new MenuDatabase();
            
            $result = $conn->getDBConnection()->query("UPDATE users set confirmed=1 WHERE email='$email';");
            if($result)
            {
                ?>
                    <script>
                         window.onload = function () {
                            document.getElementById("emailConfirmationInfo").innerHTML=`<label class="container">Email erfolgreich bestätigt
                            <input checked="checked" type="checkbox" disabled>
                            <div class="checkmark"></div>
                            </label>`;
                        }
                    </script>
                <?php
            }
            else
            {
                ?>
                    <script>
                         window.onload = function () {
                            document.getElementById("emailConfirmationInfo").innerHTML="<h3>Kommen Sie bitte durch den Ihnen gesendeten Link</br></br><span>&#9785;</span></h3>";
                        }
                    </script>
                <?php
            }
            
        }
        else
        {
            ?>
            <script>
                 window.onload = function () {
                    document.getElementById("emailConfirmationInfo").innerHTML="<h3>Kommen Sie bitte durch den Ihnen gesendeten Link</br></br><span>&#9785;</span></h3>";
                }
            </script>
        <?php
        }
    }
    else
    {
        ?>
                    <script>
                         window.onload = function () {
                            document.getElementById("emailConfirmationInfo").innerHTML="<h3>Kommen Sie bitte durch den Ihnen gesendeten Link</br></br><span>&#9785;</span></h3>";
                        }
                    </script>
                <?php
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
    <link rel="stylesheet" href="css/bootstrap.min.css">    
	<!-- Site CSS -->
    <link rel="stylesheet" href="css/style.css">    
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
    <div class="centered-relative">
        <div class="emailConfirmationInfo" id="emailConfirmationInfo"></div>
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
</body>
<script src="js/jquery-3.2.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script> 
		$(function(){
		  $("#header-container").load("header.html"); 
		  $(".contact-info-box").load("contactInfos.html");
		  $(".footer-area").load("footer.html");
		});
	</script> 
</html>