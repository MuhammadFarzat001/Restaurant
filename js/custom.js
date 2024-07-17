$(function(){
$("#header-container").load("header.html", ()=>{
	
	if(user != undefined)
	{
		
		$("#anmeldenButton").replaceWith(profileButton);
	}
}); 
$(".contact-info-box").load("contactInfos.html");
$(".footer-area").load("footer.html");




});
//const profileButton = '<li class="nav-item" id="profileButton"><a class="nav-link" href="http://localhost/Restaurant/profile">Profile</a></li>';
		


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
			modal = document.getElementById("myModal");
			document.getElementById("closeModal").onclick = ()=>{
				modal.style.display = "none";
				}
			window.onclick = function(event) {
				if (event.target == modal) {
				modal.style.display = "none";
				}
			}
			$(".cookie-consent-banner__actions").click(function(){
				cookiesAccepted = true;
				setCookie("consent", true, 365);
				$(".cookie-consent-banner").css("display", "none");
			});
		}
		//load menus and style
		loadCategoriesButtons();
		loadMeals();
		



		

		function loadMeals()
		{
			

			var lengthOfMealsObject = Object.keys(meals).length;
			let tries = 0;
			for(const nameOfMeal in meals)
			{
				
				var firstDiv = document.createElement("div");
				$(firstDiv).attr("class", "col-lg-6 special-grid " + meals[nameOfMeal].category_id.toLowerCase());

				var secondDiv = document.createElement("div");
				$(secondDiv).attr("class", "gallery-single fix");

				var image = document.createElement("img");
				$(image).attr("class", "img-fluid");
				$(image).attr("src", "./images/"+meals[nameOfMeal].name_of_pic);
				$(image).attr("alt", "Image");

				var thirdDiv = document.createElement("div");
				$(thirdDiv).attr("class", "why-text");

				var h4 = document.createElement("h4");
				h4.innerHTML = nameOfMeal + ' <sub style="font-size:10px">'+meals[nameOfMeal].points_to_buy+' Punkte zum kostenlosen Kaufen</sub>';

				var p = document.createElement("p");
				p.innerText = "Klicken für Zutaten";
				$(p).attr("class", "zutaten");
				$(p).click(()=>{
					
					var windowForIngredients = document.createElement("div");
					$(windowForIngredients).attr("class", "zutatenContainer");
					var headerOfwindow = document.createElement("h3");
					$(headerOfwindow).attr("class", "zutatenVomPopUp");
					headerOfwindow.innerText = "Zutaten von " + nameOfMeal;
					var ingredients = document.createElement("p");
					$(ingredients).attr("style", "margin-top:10px;");

					try {
						//This is needed because the data is being read as a string from the database
						meals[nameOfMeal].ingredients = JSON.parse(meals[nameOfMeal].ingredients);
					} catch (error) {
						console.log(error);
					}
					for(var key in meals[nameOfMeal].ingredients){
						if(meals[nameOfMeal].ingredients.hasOwnProperty(key)){
							var lastKey = key;
						}
					}
					for (const key in meals[nameOfMeal].ingredients) {
						
						if (meals[nameOfMeal].ingredients.hasOwnProperty(key)) {
							ingredients.innerText += key;
							
							if(key !== lastKey)
							{
								ingredients.innerText += ", ";
							}
							const value = meals[nameOfMeal].ingredients[key];
							
						}
					}
			
					
			
					//ingredients.innerText = meals[nameOfMeal].ingredients;

				
					$(windowForIngredients).append(headerOfwindow);
					$(windowForIngredients).append(ingredients);

					$("body").append(windowForIngredients);
					$(windowForIngredients).animate({
						top: '60%',
						opacity: '1'
					}, 500, () => {
						window.onclick = function(event) {
							if (event.target != windowForIngredients && event.target != headerOfwindow && event.target != ingredients) {
								$(windowForIngredients).animate({
									top: '10%',
									opacity: '0'
								}, 500, () => {
									$(windowForIngredients).remove();
								});
							}
						}
					});
					
				});
				var h5 = document.createElement("h5");
				h5.innerText = "€" + getNumberFormat(meals[nameOfMeal].price);

				const addButton = document.createElement("div");
				addButton.innerHTML = "+";
				$(addButton).attr("class", "addButton");
				$(addButton).click(()=> {
					if(!getCookie("consent") || getCookie("consent") != "true")
					{
						showPopUp("Sie haben Cookies leider nicht akzeptiert");
					}
					else
					{
						var pos = $(addButton).offset();
						var picOfOrder = document.createElement("img");
						$(picOfOrder).attr("src", "./images/"+meals[nameOfMeal].name_of_pic);
						$(picOfOrder).attr("class", "picToOrder");

						picOfOrder.style.top = pos.top + "px";
						picOfOrder.style.left = pos.left + "px";
						
						//For the Animation of the pic when added to cart
						if(window.innerWidth > 991)
						{
							var bestellungButton = document.getElementById("bestellungButton");		
						}
						else
						{
							var bestellungButton = document.getElementById("navbarToggler");
						}
						var animateTo = $(bestellungButton).offset();
						//add Item to order
						var currentOrder = getCookie("bestellung");
						if(currentOrder == null || currentOrder == "" || currentOrder == "[]")
						{
							var newOrder = [];
							var firstItem = {id: nameOfMeal,anzahl:1, bild: meals[nameOfMeal].name_of_pic}
							newOrder.push(firstItem);
							setCookie("bestellung", JSON.stringify(newOrder));
						}
						else
						{
							var currentOrder = JSON.parse(getCookie("bestellung"));
							var newItem = true;
							currentOrder.forEach(element => {
								
								if(element.id == nameOfMeal)
								{
									
									element.anzahl++;
									newItem = false;
								}
							});
							if(newItem == true)
							{
								var itemToAdd = {id: nameOfMeal,anzahl:1, bild: meals[nameOfMeal].name_of_pic};
								currentOrder.push(itemToAdd);
							}
							setCookie("bestellung", JSON.stringify(currentOrder));
						}
					
						
						//finished
						$("body").append(picOfOrder);
						
						$(picOfOrder).animate({
							top:animateTo.top+"px",
							left:animateTo.left+"px",
							opacity: "0.2"

						}, 1000, ()=>{$(picOfOrder).remove();});

					}
					
				});

				$(thirdDiv).append(h4);
				$(thirdDiv).append(p);
				$(thirdDiv).append(h5);
				$(thirdDiv).append(addButton);

				$(secondDiv).append(image);
				$(secondDiv).append(thirdDiv);
				$(firstDiv).append(secondDiv);

				tries++;

				if(tries == lengthOfMealsObject)
				{
					//Is needed because we need to wait until all cards are added to add the isotope, else it will 
					//only be added to the card that are manually added to the dom at the beginning
					$(".special-list").append(firstDiv).ready(function() {
						setTimeout(function(){
							var portfolio = $('.special-menu');
							portfolio.on('click', 'button', function () {
								$(this).addClass('active').siblings().removeClass('active');
								var filterValue = $(this).attr('data-filter');
								$grid.isotope({
									filter: filterValue
								});
							});
							var $grid = $('.special-list').isotope({
								itemSelector: '.special-grid'
							});
						}, 1000);
						
					});
				}
				else
				{
					$(".special-list").append(firstDiv);
				}
			}
		}

		function getNumberFormat(number)
		{
			var result;
			if(Number.isInteger(number))
			{
				result = number.toString() + ",00";
			}
			else
			{
				result = number.toString().replace(".", ",");
			var posOfKomma = result.indexOf(",");
			if(result.substring(posOfKomma+1).length < 2)
			{
				result = result + "0";
			}
			
			}
			return result;
		}
		function showPopUp(message)
		{
			document.getElementById("messageText").innerText = message;
			modal.style.display = "grid";
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
		//style
		(function($) {
    
	

	//Position of menu	
	$('#slides').superslides({
		inherit_width_from: '.cover-slides',
		inherit_height_from: '.cover-slides',
		play: 5000,
		animation: 'fade',
	});
	
	$( ".cover-slides ul li" ).append( "<div class='overlay-background'></div>" );
	
	/* ..............................................
    Map Full
    ................................................. */

	$(document).ready(function(){ 

		
		$(window).on('scroll', function () {
			if ($(this).scrollTop() > 100) { 
				$('#back-to-top').fadeIn(); 
			} else { 
				$('#back-to-top').fadeOut(); 
			} 
		}); 
		$('#back-to-top').click(function(){ 
			$("html, body").animate({ scrollTop: 0 }, 600); 
			return false; 
		}); 
		$('.zurSpeisekarte').click(async function(){
			$("html, body").animate({ scrollTop: document.getElementById('speisekarte').getBoundingClientRect().top}, 600); 
			return false;
		}); 
	});
	

}(jQuery));