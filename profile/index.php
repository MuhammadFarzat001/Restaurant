<?php
require_once "../checkUser.php";
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
	<?php /*$condition=true;if($condition) : ?>
    <a href="http://yahoo.com" style="position:absolute;left:25px;top:30vh;z-index:100;">This will only display if <?php echo $condition;?> is true</a>
<?php endif; *///This is only a test and it works?>

   
        <?php if($user == false) : ?>
			<div class="centered-relative">
        		<div class="emailConfirmationInfo" id="emailConfirmationInfo">
           			<h3>Sie sind leider nicht angemeldet</br></br><span>&#9785;</span></h3>
		   		</div>
    		</div>
        <?php else: ?>
			<!--Code of user profile-->
		<?php endif;?>
	
	
	
	
	<!-- Start Contact info -->
	<div class="contact-info-box">
		
	</div>
	<!-- End Contact info -->
	
	<!-- Start Footer -->
	<footer class="footer-area bg-f">
		
	</footer>
    <!-- ALL JS FILES -->
	<script src="../js/jquery-3.2.1.min.js"></script>

    <script src="../js/bootstrap.min.js"></script>

    <script>
    $(function(){
		  $("#header-container").load("../header.html", function() {
			$('#logoContainer').attr("href", "../");
			
			document.getElementById('homeButton').classList.remove("active");

			//document.getElementById('anmeldenButton').classList.add("active");

			//This string is needed to be saved in a variable else it gets to complicated 
			const profileButton = '<li class="nav-item active" id="profileButton"><a class="nav-link" href="http://localhost/Restaurant/profile">Profile</a></li>';
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