let currentOrder = getCookie("bestellung");
let modal;
let realPointsOfUser = realPoints;
realPoints = null;
//This is needed so that userSecondCheck can not be changed anymore
const userSecondCheck = userFirstCheck;
delete userFirstCheck;
let ingredientsOfItems = {};
var wholePriceTag = document.createElement("h2");
let wholePrice = 0;

$(wholePriceTag).attr("id", "wholePrice");


if(currentOrder == null || currentOrder == "" || currentOrder == "[]")
{
    $(".cards").replaceWith(`<div class="centered-relative">
        <div class="emailConfirmationInfo" id="emailConfirmationInfo">
            <h3>Sie haben noch nichts zum Warenkorb hinzugefügt</br></br><span>&#9785;</span></h3>
        </div>
    </div>`);
}

else
{
    $(".cards").replaceWith(`<div class="centered-relative">
        <div class="emailConfirmationInfo" id="emailConfirmationInfo">
            <div class="loader"></div>
        </div>
    </div>`);
    
    window.onload = () => {
        //This function is needed to disable other clicks
        
       
        modal = document.getElementById("myModal");
        document.getElementById("closeModal").onclick = ()=>{
            modal.style.display = "none";
        }

        window.onclick = function(event) 
        {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        }

        try 
        {
            currentOrder = JSON.parse(getCookie("bestellung"));
        } 
        catch (error) 
        {
            setCookie("bestellung", "");
        }
        
        if(currentOrder)
        {
            try {
                currentOrder.forEach(element => {
                    if(element.echteAnzahl)
                    {
                        element.anzahl = element.echteAnzahl;
                        element.echteAnzahl = null;
                    }    
                });
    
                setCookie("bestellung", JSON.stringify(currentOrder));
                $(".centered-relative").replaceWith(`<div class="cards"></div>`);
                showPopUp("Lieferkosten in Höhe von 1,50€ werden automatisch zum Preis addiert");

                currentOrder.forEach(element => {
                    var cardDiv = document.createElement("div");
                    $(cardDiv).attr("class", "card");
                    $(cardDiv).attr("id", element.id);
    
    
                    var cardImg = document.createElement("img");
                    $(cardImg).attr("src", "../images/"+element.bild);
                    $(cardImg).attr("alt", "Image");
    
                    var cardH3 = document.createElement("h3");
                    
                    var item = meals[element.id];
                    if(item != undefined)
                    {
                        cardH3.innerHTML = element.id + " <sub style='font-size: 10px'>"+item.points_to_buy+" zum Kaufen einer Portion</sub>";
                    }
                    var cardQuantityDiv = document.createElement("div");
                    $(cardQuantityDiv).attr("class", "quantityOfItem");
                    cardQuantityDiv.innerText = "Anzahl: ";

                    var cardPriceDiv = document.createElement("div");
                    $(cardPriceDiv).attr("class", "price");
                    $(cardPriceDiv).attr("id", "priceOfOnly"+element.id);

                    var priceOfItem = meals[element.id].price;
                    cardPriceDiv.innerHTML = "Preis: <p id='priceShowOf"+element.id+"'>€" + getNumberFormat(priceOfItem*element.anzahl) + "</p>";
                    
    
                    var inputOfQuantity = document.createElement("input");
                    $(inputOfQuantity).attr("class", "quantityInput");
                    $(inputOfQuantity).attr("min", "1");
                    $(inputOfQuantity).attr("type", "number");
                    $(inputOfQuantity).attr("id", "quantityOf"+element.id);
                    $(inputOfQuantity).attr("value", element.anzahl);
                    inputOfQuantity.readOnly = true;

                    var minusButton = document.createElement("button");
                    $(minusButton).attr("class", "minusOneButton change-quantity-button");
                    $(minusButton).attr("id", "minusFor"+element.id);
                    minusButton.innerText = "-";
                    $(minusButton).click(()=>{
                        if(inputOfQuantity.value > 1)
                        {
                            if(meals[element.id])
                            {
                                changePrice(inputOfQuantity, cardPriceDiv, meals[element.id], -1, null);
                            }
                            
                        }
                    });
                    var plusButton = document.createElement("button");
                    $(plusButton).attr("class", "plusOneButton change-quantity-button");
                    $(plusButton).attr("id", "plusFor"+element.id);
                    plusButton.innerText = "+";
                    $(plusButton).click(()=>{
                        if(inputOfQuantity.value >= 1)
                        {
                            if(meals[element.id])
                            {
                                changePrice(inputOfQuantity, cardPriceDiv, meals[element.id], 1, null);
                            }
                            
                        }
                    });

                    var ingredientsChanges = document.createElement("h2");
                    $(ingredientsChanges).attr("class", "ingredientsChanges");
                    ingredientsChanges.innerText = "Zutaten bearbeiten";
                    $(ingredientsChanges).click(()=>{
                        

                        let bufferOrder;
                        try 
                        {
                            bufferOrder = JSON.parse(getCookie("bestellung"));
                        } 
                        catch (error) 
                        {
                            setCookie("bestellung", "");
                        }
                        let realAmount;
                        if(bufferOrder.find(x => x.id == element.id).echteAnzahl)
                        {
                            realAmount = bufferOrder.find(x => x.id == element.id).echteAnzahl;
                        }
                        else
                        realAmount = bufferOrder.find(x => x.id == element.id).anzahl;

                        

                        var flippingCardsForIngredients = document.createElement("div");
                        $(flippingCardsForIngredients).attr("class", "flippingCardsForIngredients withBoxShadowForFlippingCardsForIngredients");
                        $(flippingCardsForIngredients).attr("id", "ingredientsCards");

                        var divToClickAndHideCards = document.createElement("div");
                        $(divToClickAndHideCards).attr("class", "hideCardsDiv");
                        $("body").append(divToClickAndHideCards);
                        $(divToClickAndHideCards).click(()=>{
                            $(divToClickAndHideCards).css("display", "none");
                            $(flippingCardsForIngredients).animate({
                                top: '-10%',
                                opacity: '0'
                            }, 500, ()=>{$(flippingCardsForIngredients).remove();});
                        });


                        $("body").append(flippingCardsForIngredients);
                        
                        
                        for(var i = 1; i <= realAmount; i++)
                        {
                            let ingredientsCard = document.createElement("div");
                            $(ingredientsCard).attr("id", i+"."+element.id);
                            $(ingredientsCard).attr("class","ingredientCard flipped");

                            if(realAmount > 1)
                            {
                                let previousButton = document.createElement("div");
                                $(previousButton).attr("class","previousButton arrow");
                                let arrowLeft = document.createElement("i");
                                $(arrowLeft).attr("class","gg-arrow-left");
    
                                $(previousButton).append(arrowLeft);
                                
    
                                let nextButton = document.createElement("div");
                                $(nextButton).attr("class","nextButton arrow");
                                let arrowRight = document.createElement("i");
                                $(arrowRight).attr("class","gg-arrow-right");
    
                                $(nextButton).append(arrowRight);
                                const currentNumber = i;
                                if(currentNumber == 1)
                                {
                                    let loader = document.createElement("div");
                                    $(loader).attr("class", "loader");
                            
                                    $(ingredientsCard).append(loader);

                                    $(ingredientsCard).removeClass("flipped");
                                    nextButton.addEventListener('click',()=>{handleFlip(element.id, currentNumber+1, 1)} );
                                }
                                else if(currentNumber == realAmount)
                                {
                                    previousButton.addEventListener('click',()=>{handleFlip(element.id, currentNumber-1, -1)});
                                }
                                else
                                {
                                    previousButton.addEventListener('click',()=>{handleFlip(element.id, currentNumber-1, -1)});
                                    nextButton.addEventListener('click',()=>{handleFlip(element.id, currentNumber+1, 1)} );
                                }
    
                                let title = document.createElement("h3");
                                title.innerText = $(ingredientsCard).attr("id");
                                $(title).attr("class", "itemNameForIngredients");

                                

                                $(ingredientsCard).append(previousButton);
                                $(ingredientsCard).append(title);
                                $(ingredientsCard).append(nextButton);
                                
    
                                $(flippingCardsForIngredients).append(ingredientsCard);
                            }
                           
                            else
                            {
                                let loader = document.createElement("div");
                                    $(loader).attr("class", "loader");
                            
                                    $(ingredientsCard).append(loader);
                                let title = document.createElement("h3");
                                title.innerText = element.id;
                                $(title).attr("class", "itemNameForIngredients");
                                $(ingredientsCard).append(title);
                                $(flippingCardsForIngredients).append(ingredientsCard);
                                $(ingredientsCard).removeClass("flipped");

                                
                            }

                            
                            
                           
                        }
                        getIngredientsFromBackend(element.id);

                        document.getElementById("ingredientsCards").style.display="flex";
                        $("#ingredientsCards").animate({
                            top: '55vh',
						    opacity: '1'
                        }, 500);
                    })

                    var buttonOfPoints = document.createElement("button");
                    $(buttonOfPoints).attr("class", "pointsOfUser");
                    buttonOfPoints.innerText =  realPointsOfUser + " verfügbare Punkte";
                    $(buttonOfPoints).click(()=>{
                        if(userSecondCheck)
                        {
                            
                            showPopUpWithHTML(`<p id="errorPointsNumber" style="color: red;"></p>
                            <div class="txt_field" id="emailToResetPassword">
                            <input id="anzahlPunkteInput" placeholder=' ' type="number">
                            <span></span>
                            <label>Anzahl der Punkte zu verwenden</label>
                            </div>
                            <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="anzahlPunkteButton">Preis abziehen</button>`);

                            document.getElementById("anzahlPunkteButton").onclick = function getPointsLogic(){
                                document.getElementById("errorPointsNumber").innerText = "";
                                
                                if(isNaN(document.getElementById("anzahlPunkteInput").value) || document.getElementById("anzahlPunkteInput").value == "")
                                {
                                    document.getElementById("errorPointsNumber").innerText = "Geben Sie bitte ein Zahl ein";
                                }
                                else
                                {
                        
                                    $("#anzahlPunkteButton").click(()=>{});
                                    const pointsOfItem = item.points_to_buy;
                                    
                                    if(document.getElementById("anzahlPunkteInput").value % pointsOfItem != 0 || document.getElementById("anzahlPunkteInput").value <= 0)
                                    {
                                        document.getElementById("errorPointsNumber").innerText = "Geben Sie nur ein Vielfaches von " + pointsOfItem + " ein";
                                    }
                                    else if(document.getElementById("anzahlPunkteInput").value > realPointsOfUser)
                                    {
                                        document.getElementById("errorPointsNumber").innerText = "Sie haben nicht genug Punkte";
                                    }
                                    else
                                    {
                                        var currentOrder = JSON.parse(getCookie("bestellung"));
                                        
                                        const maxPossiblePoints = currentOrder.find(x => x.id === element.id).anzahl * pointsOfItem;
                                        
                                        if(document.getElementById("anzahlPunkteInput").value > maxPossiblePoints)
                                        {
                                            document.getElementById("errorPointsNumber").innerText = "Sie können nicht mehr Punkte benutzen als Ihre Bestellung";
                                        }
                                        else
                                        {
                                            if(meals[element.id])
                                            {
                                                changePrice(inputOfQuantity, cardPriceDiv, meals[element.id], 0, document.getElementById("anzahlPunkteInput").value/meals[element.id].points_to_buy);
                                                realPointsOfUser = realPointsOfUser - Number.parseInt(document.getElementById("anzahlPunkteInput").value);
                                                showPopUp("Punkte erfolgreich mitgezählt. Aktualisieren Sie die Seite, falls Sie doch bezahlen möchten");
                                                refreshPoints();
                                            }
                                            
                                        }
                                        
                                    }
                                }
                            }
                        }
                        else
                        {
                            showPopUp("Anscheinend sind Sie nicht angemeldet :(");
                        }
                        
                    });

                    var trashIcon = document.createElement("i");
                    $(trashIcon).attr("class", "gg-trash");
                    $(trashIcon).click(()=>{
                        removeItem(cardDiv, element.id);
                    });
    
                    $(cardQuantityDiv).append(minusButton);
                    $(cardQuantityDiv).append(inputOfQuantity);
                    $(cardQuantityDiv).append(plusButton);
                    
                    $(cardDiv).append(cardImg);
                    $(cardDiv).append(cardH3);
                    $(cardDiv).append(cardQuantityDiv);
                    $(cardDiv).append(ingredientsChanges);
                    $(cardDiv).append(cardPriceDiv);
                    $(cardDiv).append(buttonOfPoints);
                    $(cardDiv).append(trashIcon);
                    $(".cards").append(cardDiv);
                });
                removePointsButtonIfNeeded();
                var giveOrderAwayButton = document.createElement("button");
                $(giveOrderAwayButton).text("Bestellen");
                $(giveOrderAwayButton).attr("id", "sendOrderButton");
                $(".cards").append(giveOrderAwayButton);

                giveOrderAwayButton.onclick = makeOrderReady;

                calculateNetWholePrice();
                $(".cards").append(wholePriceTag);
            } catch (error) {
                deleteCookie("bestellung");
                showPopUp("Starten Sie den Bestellungsprozess neu bitte :)");
            }
            

           
        }    
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
const front = document.getElementById('front');
const back = document.getElementById('back');
const btn = document.getElementById('flip-btn');


function handleFlip(nameOfItemOfCard, cardNumber, process) {
    /*This function is kinda complicated although it looks simple
    To understand this let's imagine the following:
    The card without the classes "flipped" and "flippedBackwards" is at 0 degrees which makes the card visible to the viewer.
    With the class "flipped" the card is flipped to 180 degrees which means the cards is flipped clock wise (to the right)
    With the class "flippedBackwards" the card is flipped -180 degrees which is basically the opposite.
    Now for a smooth animation we need to do the following:
    We always start with the first card which means it starts at 0 degrees. All other cards have the class "flipped" at first
    which means they are flipped at a 180 degress.
    Since the user can't press the "previousButton" because it's the first card he will have to press the "nextButton".
    In that case we remove the "flipped" class from the targeted card, which is the "next card" which is number 2 for example
    this way the card moves back to 0 degrees which means it moves to the left.
    The first card (the one we are moving from which is number 1 for example) should flip back to the same direction as the second card
    so that a smooth animation is built. That's why we are using the "flippedBackwards" class for the first card.
    This class makes the card flip to the left just like the second card.
    From here on the whole process is simply reversed.
    When we want to go back to the previous card we add the "flipped" class to the card that we want to move from
    and remove the class "flippedBackwards" from the card that we want to move to.
    This way both cards move in the same way an generate a smooth animation
    */ 
    var idOfCard = cardNumber+"."+nameOfItemOfCard;
    
    document.getElementById('ingredientsCards').classList.toggle('withBoxShadowForFlippingCardsForIngredients');

    if(process == -1)
    {  
        document.getElementById(idOfCard).classList.remove("flippedBackwards");
        document.getElementById(cardNumber+1+"."+nameOfItemOfCard).classList.add("flipped");
    }
    else
    {  
        document.getElementById(cardNumber-1+"."+nameOfItemOfCard).classList.add("flippedBackwards");
        document.getElementById(idOfCard).classList.remove("flipped");
        document.getElementById(idOfCard).classList.remove("flippedBackwards");
    }

    //Time out is needed because other wise the shadow would disappear and reappear without waiting for the cards to finish the flipping motion
    setTimeout(()=>{document.getElementById('ingredientsCards').classList.toggle('withBoxShadowForFlippingCardsForIngredients');},500);
}

function makeOrderReady()
{
    document.getElementById("sendOrderButton").innerHTML = `
        <div class="loader" style='position: relative; 
        left: 35%;'
        ></div>
    `;
    disableClicks();
    $.post("",
    {
        getRestaurantInfo: ""
    },
    function(data, status){
       enableClicks();
        document.getElementById("sendOrderButton").innerHTML = "Bestellen";
        if(status == "success")
        {
            
            data = JSON.parse(data);
            if(data.geoeffnet && data.lieferung)
            {
                
                if(data.geoeffnet != "true")
                {
                    showPopUp("Leider haben wir momentan geschlosen :(");
                }
                else if(data.lieferung != "true")
                {
                    if(userSecondCheck == null)
                    {
                        showPopUpWithHTML(`
                        Sie sind leider nicht angemeldet. So können Sie keine Punkte Sammeln :(<br>
                           <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="goToLogInButton" style='width:100% !important; '>Anmelden</button>
                           <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="orderWithNoAccountButton"style='width:100% !important; margin-top:2px;'>Bestellen</button>   
                       `); 
                        document.getElementById("goToLogInButton").onclick = ()=>{
                            window.location.href = '../anmeldung';
                        };
                        document.getElementById("orderWithNoAccountButton").onclick = ()=>{
                            showPopUpWithHTML(`
                            Leider ist die Lieferung im Moment nicht möglich :(<br>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="setOrderToGoButton">Selbst Abholen</button>   
                            `);
                            document.getElementById("setOrderToGoButton").onclick = ()=>{
                               
                                document.getElementById("setOrderToGoButton").innerHTML = `
                                    <div class="loader" style='position: relative; 
                                    left: 0%;'
                                    ></div>
                                `;
                                setUpOrder('toGo');
                            }
                        };
                    }
                    else
                    {
                        showPopUpWithHTML(`
                            Leider ist die Lieferung im Moment nicht möglich :(<br>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="setOrderToGoButton">Selbst Abholen</button>   
                        `);
                        document.getElementById("setOrderToGoButton").onclick = ()=>{
                           
                            document.getElementById("setOrderToGoButton").innerHTML = `
                                <div class="loader" style='position: relative; 
                                left: 0%;'
                                ></div>
                            `;
                            setUpOrder('toGo');
                        }
                    }
                }
                else
                {
                    if(userSecondCheck == null)
                    {
                        showPopUpWithHTML(`
                        Sie sind leider nicht angemeldet. So können Sie keine Punkte Sammeln :(<br>
                           <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="goToLogInButton" style='width:100% !important; '>Anmelden</button>
                           <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="orderWithNoAccountButton"style='width:100% !important; margin-top:2px;'>Trotzdem Bestellen</button>   
                       `); 
                       document.getElementById("goToLogInButton").onclick = ()=>{
                        window.location.href = '../anmeldung';
                        };
                        document.getElementById("orderWithNoAccountButton").onclick = ()=>{
                            showPopUpWithHTML(`
                                Möchten Sie die Bestellung abholen oder lieber liefern lassen?<br>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="orderAsDeliveryButton" style='width:100% !important; '>Liefern lassen</button>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="orderAsToGoButton"style='width:100% !important; margin-top:2px;'>Abholen</button>   
                            `); 
                            document.getElementById("orderAsToGoButton").onclick = ()=>{
                              
                                showPopUpWithHTML(`
                                <p id="errorMessageNewAdressForDelivery" style="color: red;"></p>
                                <!--class of formAnmeldung is needed to have the same style-->
                                <form method="POST" class="formAnmeldung" id="formOfNewAdress" onsubmit="return false">
                                
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required name='fullname' id="fullNameForNewAdress" placeholder=" ">
                                        <span></span>
                                        <label>Vor- und Zuname*</label>
                                    </div>
                                    <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="orderToGoWithNoAccountButton" type="button">Bestellen</button>
                                </form>   
                                `);
                                document.getElementById("orderToGoWithNoAccountButton").onclick = ()=>{
                          
                                    document.getElementById("errorMessageNewAdressForDelivery").innerText = "";
                                    if(document.getElementById("fullNameForNewAdress").value.length < 5)
                                    {
                                        document.getElementById("errorMessageNewAdressForDelivery").innerText = "Name darf nicht kürzer als 5 Zeichen sein";
                                        
                                    }
                                    else
                                    {
                                        
                                        document.getElementById("orderToGoWithNoAccountButton").innerHTML = `
                                        <div class="loader" style='position: relative; 
                                        left: 0%;'
                                        ></div>
                                        `;
                                        setUpOrder('toGo', undefined, document.getElementById("fullNameForNewAdress").value); 
                                    }
                                }
                            }
                            document.getElementById("orderAsDeliveryButton").onclick = ()=>{
                                showPopUpWithHTML(`
                                <p id="errorMessageNewAdressForDelivery" style="color: red;"></p>
                                <!--class of formAnmeldung is needed to have the same style-->
                                <form method="POST" class="formAnmeldung" id="formOfNewAdress" onsubmit="return false">
                                
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required name='fullname' id="fullNameForNewAdress" placeholder=" ">
                                        <span></span>
                                        <label>Vor- und Zuname*</label>
                                    </div>
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required name='username' id="emailForNewAdress" placeholder=" ">
                                        <span></span>
                                        <label>E-mail*</label>
                                    </div>
                                    
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required id="newAdressForDelivery" placeholder=" ">
                                        <span></span>
                                        <label>Strassenadresse*</label>
                                    </div>
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required name='housenumber' id="newHouseNumberForDelivery" placeholder=" ">
                                        <span></span>
                                        <label>Hausnummer*</label>
                                    </div>
                                    <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="deliverToAdressWithNoAccountButton" type="button">Liefern</button>
                                </form>   
                            `); 
                            addSettingsForDeliveryForNewAdress();
                            
                        };
                    };
                    }
                    else
                    {
                        showPopUpWithHTML(`
                                Möchten Sie die Bestellung abholen oder lieber liefern lassen?<br>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="orderAsDeliveryButton" style='width:100% !important; '>Liefern lassen</button>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="orderAsToGoButton"style='width:100% !important; margin-top:2px;'>Abholen</button>   
                            `); 
                        document.getElementById("orderAsToGoButton").onclick = ()=>{
                            document.getElementById("orderAsToGoButton").innerHTML = `
                                <div class="loader" style='position: relative; 
                                left: 43%;'
                                ></div>
                            `;
                            setUpOrder('toGo');
                        }
                        document.getElementById("orderAsDeliveryButton").onclick = ()=>{
                            showPopUpWithHTML(`
                                Möchten Sie zu Ihrer gespeicherten Adresse liefern lassen?<br>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="toTheSavedAdressButton" style='width:100% !important; '>Ja</button>
                                <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="toNewAdressButton"style='width:100% !important; margin-top:2px;'>Nein</button>   
                            `);
                            document.getElementById("toTheSavedAdressButton").onclick = ()=>{
                                if(userSecondCheck.userAdress == "")
                                {
                                    showPopUpWithHTML("Sie haben leider keine Adress hinterlegt :(<br>Ändern Sie Ihre Adresse unter <a href='../profile' style='color:#d0a772;text-decoration: underline !important;text-decoration-color: #d0a772;'>MEIN PROFILE</a>");
                                }
                                else
                                {
                                
                                    document.getElementById("toTheSavedAdressButton").innerHTML = `
                                    <div class="loader" style='position: relative; 
                                    left: 41.5%;'
                                    ></div>
                                    `;
                                    setUpOrder("delivery",userSecondCheck.userAdress)
                                }
                            }
                            document.getElementById("toNewAdressButton").onclick = ()=>{
                                showPopUpWithHTML(`
                                <p id="errorMessageNewAdressForDelivery" style="color: red;"></p>
                                <!--class of formAnmeldung is needed to have the same style-->
                                <form method="POST" class="formAnmeldung" id="formOfNewAdress" onsubmit="return false">
                                
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required name='fullname' id="fullNameForNewAdress" placeholder=" ">
                                        <span></span>
                                        <label>Vor- und Zuname*</label>
                                    </div>
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required id="newAdressForDelivery" placeholder=" ">
                                        <span></span>
                                        <label>Strassenadresse*</label>
                                    </div>
                                    <div class="txt_field" style="margin-bottom:15px;">
                                        <input type="text" required name='housenumber' id="newHouseNumberForDelivery" placeholder=" ">
                                        <span></span>
                                        <label>Hausnummer*</label>
                                    </div>
                                    <button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="deliverToAdressWithNoAccountButton" type="button">Liefern</button>
                                </form>   
                                `); 
                                addSettingsForDeliveryForNewAdress();
                            }
                        }
                    }
                }
            }
        }
    });
}   

function setUpOrder(delivery_method, adress, name, email)
{
    disableClicks();
    if(getCookie("bestellung") != null && getCookie("bestellung") != "")
    {
        
        $.post("",
            {
                name: name,
                email: email,
                newOrder: getCookie("bestellung"),
                modifiedIngredients: ingredientsOfItems,
                adress: adress,
                method: delivery_method
            },
            function(data, status){
                enableClicks();
                if(status == "success")
                {
                    
                    if(data == "success")
                    {
                        modal.style.display = "none";
                        $(".cards").fadeOut( "slow", function() {
                            $(".cards").replaceWith(`<div class="centered-relative">
                                <div class="emailConfirmationInfo" id="emailConfirmationInfo">
                                    <h3>Ihre Bestellung wurde erfolgreich gesendet</br></br><span>&#9786;</span></h3>
                                </div>
                            </div>`);
                        });
                        deleteCookie("bestellung");
                    }
                    else
                    {
                        showPopUp(data);
                    }
                }
                else
                {
                    showPopUp("Es konnte keine Verbindung zum Server hergestellt werden :(");
                }
            }
        );
    }
    else
    {
        enableClicks();
        showPopUp("Starten Sie bitte neu an :(");
        try {
            deleteCookie("bestellung");
        } catch (error) {
            
        }
        
    }

   
}
function disableClicks()
{
    document.getElementById("disableClicks").style.display = "flex";
}
function enableClicks()
{
    document.getElementById("disableClicks").style.display = "none";
}
function initAutocomplete()
{
    new google.maps.places.Autocomplete(document.getElementById("newAdressForDelivery"), { componentRestrictions: { country: "DE"}});
}
function addSettingsForDeliveryForNewAdress()
{
    
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDWYP4eaq8K2LsSL14wLdq3TZWBoSgri00&libraries=places&callback=initAutocomplete");
    document.getElementById("deliverToAdressWithNoAccountButton").onclick = () => {
        document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "";
        document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = `
        <div class="loader" style='position: relative; 
        left: 0%;'
        ></div>
    `;
    if(document.getElementById("fullNameForNewAdress").value.length < 5 || document.getElementById("fullNameForNewAdress").value.length > 100)
    {
        document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "Name darf nicht kürzer als 5";
        document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = "Liefern";
    }
    else if(document.getElementById("emailForNewAdress") && !validateEmail(document.getElementById("emailForNewAdress").value))
    {
        document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "Geben Sie eine gültige E-mail<br> Adresse ein";
        document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = "Liefern";
    }
    else if(document.getElementById("newAdressForDelivery").value.length == 0 || document.getElementById("newHouseNumberForDelivery").value.length == 0)
    {
        document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "Geben Sie Adresse ein";
        document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = "Liefern";
    }
    else if(document.getElementById("newHouseNumberForDelivery").value.length >4)
    {
        document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "Hausnummer ist zu lang";
        document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = "Liefern";
    }
    else
    {
        
        var map = new google.maps.Map(document.getElementById('newAdressForDelivery'));

        var request = {
        query: document.getElementById('newAdressForDelivery').value,
        fields: ['ALL'],
        };

        var service = new google.maps.places.PlacesService(map);
        disableClicks();
        //stop loading process code has been placed like this because I don't feel like using await
        service.findPlaceFromQuery(request, function(results, status) 
        {
            let email = undefined;
            if(document.getElementById("emailForNewAdress"))
            {
                email = document.getElementById("emailForNewAdress").value;
            }
            if (status === google.maps.places.PlacesServiceStatus.OK) 
            {
                
                var request = {
                    placeId: results[0].place_id,
                    fields: ['ALL'],
                };
                service.getDetails(request, function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        enableClicks();
                        if(results.vicinity == "Schweinfurt")
                        {
                            //var registrationAdress = results.formatted_address.substring(0, results.formatted_address.indexOf(", ")) + " " + houseNumber;
                            let postalCode = document.createElement('div');
                            postalCode.innerHTML = results.adr_address;
                            postalCode = postalCode.childNodes[2].innerText
                            
                            setUpOrder("delivery", results.formatted_address.substring(0, results.formatted_address.indexOf(", ")) + " " + document.getElementById("newHouseNumberForDelivery").value + ", " + postalCode + " Schweinfurt", document.getElementById("fullNameForNewAdress").value, email);
                        }
                        else
                        {
                            document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "Adresse scheint nicht<br>in Schweinfurt zu sein";
                            document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = "Liefern";
                        }
                    }
                    else
                    {
                        document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "Adresse konnte nicht gefunden<br>werden";
                        document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = "Liefern";
                    }
                    
                });
            }
            else
            {
                enableClicks();
                document.getElementById("errorMessageNewAdressForDelivery").innerHTML = "Suche nach Adresse fehlgeschlagen";
                document.getElementById("deliverToAdressWithNoAccountButton").innerHTML = "Liefern";
            }
        });
    }

    }
    
}
function validateEmail(email)
{
    return String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}
function getIngredientsFromBackend(itemName)
{
    let currentNumberOfCard = document.getElementsByClassName("ingredientCard");

    $.post("",
    {
        ingredientsRequest: itemName
    },
    function(data, status){

        if(status == "success")
        {

            if(isJSONString(data))
            {
                
                data = JSON.parse(data);
                
                for(const card of currentNumberOfCard)
                {
                    const ingredientGroupDiv = document.createElement("div");
                    $(ingredientGroupDiv).attr("class", "ingredientsGroup");
                    for (const key in data) {
                    
                        if (data.hasOwnProperty(key)) {
                          const value = data[key];
                       
                          
                          /*This is required so that the user can see the ingredient when he wants to add the
                          item to the cart but he can't change it when ordering*/
                          if(isBoolean(value.quantity) && value.quantity == false)
                          {
    
                          }
                          else 
                          {
                            const spanOfIngredientName = document.createElement("span");
                            spanOfIngredientName.innerText = key;
                            $(spanOfIngredientName).attr("id", "ingredient"+key+"For"+card.id);
    
                            const spanForPriceToAdd = document.createElement("span");
                            $(spanForPriceToAdd).attr("id", "priceToAddFor"+key+"For"+card.id);
                            $(spanForPriceToAdd).attr("class", "addedPriceForIngredient");
    
                            const quantityOfIngredient = document.createElement("div");
                            $(quantityOfIngredient).attr("class", "qunatityOfIngredient");
    
                            $(ingredientGroupDiv).append(spanOfIngredientName);
                            $(ingredientGroupDiv).append(spanForPriceToAdd);
                            $(ingredientGroupDiv).append(quantityOfIngredient);
    
    
                            if(isBoolean(value.quantity) && value.quantity == true)
                            {
    
                                const inputOfIngredient = document.createElement("input");
                                inputOfIngredient.type = "text";
                                inputOfIngredient.readonly = true;
                                $(inputOfIngredient).attr("class", "quantityInput");
                                $(inputOfIngredient).attr("id", "inputOf"+key+"For"+card.id);
                                $(inputOfIngredient).attr("value", "Standard");
    
    
                                const lessButton = document.createElement("button");
                                $(lessButton).attr("id", "lessOf"+key);
                                $(lessButton).attr("class", "ingredientLessButton");
                                lessButton.innerText = "-";
                                $(lessButton).click(()=>{
                                    let newValue;
                                    if(inputOfIngredient.value == "Standard")
                                    {
                                        inputOfIngredient.value = "Ohne";
                                        newValue = "Ohne";
                                    }
                                    else if(inputOfIngredient.value == "Extra" || inputOfIngredient.value != "Ohne")
                                    {
                                        inputOfIngredient.value = "Standard";
                                        newValue = "Standard";
                                    }          
                                    saveIngredientToItem(card.id,key,newValue, itemName);
                                    getPlusPriceForIngredients(data);
                                });
    
                               
    
                                const moreButton = document.createElement("button");
                                $(moreButton).attr("id", "moreOf"+key);
                                $(moreButton).attr("class", "ingredientMoreButton");
                                moreButton.innerText = "+";
                                $(moreButton).click(()=>{
                                    let newValue;
                                    if(inputOfIngredient.value == "Standard")
                                    {
                                        inputOfIngredient.value = "Extra";
                                        newValue = "Extra";
                                    }
                                    else if(inputOfIngredient.value == "Ohne" || inputOfIngredient.value != "Extra")
                                    {
                                        inputOfIngredient.value = "Standard";
                                        newValue = "Standard";
                                    }     
                                    //This is needed because a bug would occur if the input already at "Extra" and the user presses the + button     
                                    if(inputOfIngredient.value == "Extra")
                                    {
                                        newValue = "Extra";
                                    }
                                    saveIngredientToItem(card.id,key,newValue, itemName);
                                    getPlusPriceForIngredients(data);
                                });
                                
                                $(quantityOfIngredient).append(lessButton);
                                
                                $(quantityOfIngredient).append(inputOfIngredient);
                                $(quantityOfIngredient).append(moreButton);
                            }
                            else
                            {
                              
                                const inputOfIngredient = document.createElement("input");
                                inputOfIngredient.type = "number";
                                inputOfIngredient.readonly = true;
                                $(inputOfIngredient).attr("class", "quantityInput");
                                $(inputOfIngredient).attr("id", "inputOf"+key+"For"+card.id);
                                $(inputOfIngredient).attr("value", value.quantity);
                                $(inputOfIngredient).attr("min", value.minQuantity);
                                $(inputOfIngredient).attr("max", value.maxQuantity);

                                const moreButton = document.createElement("button");
                                $(moreButton).attr("id", "moreOf"+key);
                                $(moreButton).attr("class", "ingredientMoreButton");
                                moreButton.innerText = "+";
                                $(moreButton).click(()=>{
                                    //parseInt is needed because the very clever javascript takes the value as a string when we use "+" but as a number when we use "-"
                                    if(parseInt(inputOfIngredient.value)+1 <= value.maxQuantity)
                                    {
                                        inputOfIngredient.stepUp();
                                        saveIngredientToItem(card.id,key,inputOfIngredient.value, itemName, value.quantity);
                                        getPlusPriceForIngredients(data);
                                    }
                                    
                                });
    
    
                                const lessButton = document.createElement("button");
                                $(lessButton).attr("id", "lessOf"+key);
                                $(lessButton).attr("class", "ingredientLessButton");
                                lessButton.innerText = "-";
                                $(lessButton).click(()=>{
                                    if(inputOfIngredient.value-1 >= value.minQuantity)
                                    {
                                        inputOfIngredient.stepDown();
                                        saveIngredientToItem(card.id,key,inputOfIngredient.value, itemName, value.quantity);
                                        getPlusPriceForIngredients(data);
                                    }
                                    
                                });
    
                                $(quantityOfIngredient).append(lessButton);
                                $(quantityOfIngredient).append(inputOfIngredient);
                                $(quantityOfIngredient).append(moreButton);
                                
                            }
                            
                          }
                          
                          
                        }
                        
                    }
                    $(card).append(ingredientGroupDiv);
                }
                
                $(".loader").remove();     
                getSavedIngredients();
                getPlusPriceForIngredients(data);
            }
            else
            {
                alert(data);
            }
        }
        else
        {
            showPopUp("Es konnte keine Verbindung zum Server hergestellt werden!");
            
        }
    });
}

function saveIngredientToItem(nameOfItem, nameOfIngredient, newValue, itemName, normalAmount)
{
    /*The process is as follows
        we have a json object with the name of the item as the first key
        which is "ingredientsOfItems[itemName]" as Cheese Burger For example
        this key is needed to easily delete it when the user deletes the item from the order
        Now this key contains another json object that can contain multiple cards
        for example "1.Cheese Burger" and "2.Cheese Burger". This is needed because the user 
        should be able to change the ingredients of each element individually
        Now every card has another json object with the ingredients such as patty, cheese etc...
        The first 2 if statements are clear enough after some logical thinking
        But the third is for the ingredients that are booleans.
        the ingredient gets deleted if it gets changed to it's normal amount to make it easier to manipulate the json object afterwards
        "normalAmount" should only not be undefined when the ingredient is not a boolean and in this case we 
        are deleting it if the user resets it to the normal amount once again
        At last we delete the whole card or even the whole item if it gets empty to keep the work clean
    */ 
    if(!ingredientsOfItems[itemName])
    {
        ingredientsOfItems[itemName] = {};
    }

    if(!ingredientsOfItems[itemName][nameOfItem])
    {
        ingredientsOfItems[itemName][nameOfItem] = {};
    }

    ingredientsOfItems[itemName][nameOfItem][nameOfIngredient] = newValue;

    if(ingredientsOfItems[itemName][nameOfItem][nameOfIngredient] == "Standard")
    {
        delete ingredientsOfItems[itemName][nameOfItem][nameOfIngredient];
    }

    else if(normalAmount != undefined)
    {
        if(normalAmount == ingredientsOfItems[itemName][nameOfItem][nameOfIngredient])
        {
            delete ingredientsOfItems[itemName][nameOfItem][nameOfIngredient];
        }
    }

    if(Object.keys(ingredientsOfItems[itemName][nameOfItem]).length == 0)
    {
        delete ingredientsOfItems[itemName][nameOfItem];
    }
    if(Object.keys(ingredientsOfItems[itemName]).length == 0)
    {
        delete ingredientsOfItems[itemName];
    }
    
}

function getSavedIngredients()
{
    try {
        for (const key in ingredientsOfItems) {
            if (ingredientsOfItems.hasOwnProperty(key)) {
                for(const secondKey in ingredientsOfItems[key])
                {
                    const itemNameAndNumber = secondKey;
                    const objectOfIngredientsForItem = ingredientsOfItems[key][secondKey];
                    for (const key in objectOfIngredientsForItem) {
                        if(document.getElementById("inputOf"+key+"For"+itemNameAndNumber))
                        {
                            document.getElementById("inputOf"+key+"For"+itemNameAndNumber).value = objectOfIngredientsForItem[key];
                        }
                        
                    }
                }
                
               
             
            }
        }
    } catch (error) {
        console.log(error);
        $("#ingredientsCards").animate({
            top: '-10%',
            opacity: '0'
        }, 500, ()=>{
            $("#ingredientsCards").remove();
            ingredientsOfItems = {};
            
            showPopUp("Zutaten wurden zu den Standardeinstellungen zurückgesetzt!");
        });
    }
}
function getPlusPriceForIngredients(itemDataFromBackEnd)
{
    $(".addedPriceForIngredient").text("");
    for (const key in ingredientsOfItems) {
        for(const secondKey in ingredientsOfItems[key])
        {
            const itemNameAndNumber = secondKey;
            const objectOfIngredientsForItem = ingredientsOfItems[key][secondKey];
            for (const key in objectOfIngredientsForItem) {
                if(document.getElementById("priceToAddFor"+key+"For"+itemNameAndNumber))
                {
                    //document.getElementById("inputOf"+key+"For"+itemNameAndNumber).value = objectOfIngredientsForItem[key];
                    if(isBoolean(itemDataFromBackEnd[key].quantity) && itemDataFromBackEnd[key].quantity == true && itemDataFromBackEnd[key].priceProAdd)
                    {
                        if(objectOfIngredientsForItem[key] == "Extra")
                        {
                            document.getElementById("priceToAddFor"+key+"For"+itemNameAndNumber).innerText =  "€"+getNumberFormat(itemDataFromBackEnd[key].priceProAdd);
                        }
                    }
                    else
                    {
                        if(objectOfIngredientsForItem[key]>=itemDataFromBackEnd[key].amountToAddPriceFrom)
                        {
                            let multiplier = objectOfIngredientsForItem[key] - itemDataFromBackEnd[key].amountToAddPriceFrom + 1;
                            
                            document.getElementById("priceToAddFor"+key+"For"+itemNameAndNumber).innerText =  "€"+getNumberFormat(itemDataFromBackEnd[key].priceProAdd*multiplier);
                            
                        }
                    }
                    
                } 
            }
        }
       
      
    }
   
    calculateNetWholePrice();
}
function getExtraPriceForIngredients()
{   
    
    let extraPrice = 0;
    try {
        
        for(const firstKey in ingredientsOfItems)
        {
            let priceToAddProWholeItem = 0;
            //meals is where all menus are saved
            if (meals.hasOwnProperty(firstKey)) {
                for(const secondKey in ingredientsOfItems[firstKey])
                {
                  
                    
                    for(const ingredientOfItem in ingredientsOfItems[firstKey][secondKey])
                    {
                        if(meals[firstKey].ingredients.hasOwnProperty(ingredientOfItem))
                        {
                            /*
                                This if statement is kinda complicated so I'm gonna explain it
                                It means if the ingredient has a price to be added and if the chosen ingredient
                                meets the condition of having the extra charge
                            */
                           if(isBoolean(meals[firstKey].ingredients[ingredientOfItem].quantity) && meals[firstKey].ingredients[ingredientOfItem].quantity == true && meals[firstKey].ingredients[ingredientOfItem].priceProAdd && ingredientsOfItems[firstKey][secondKey][ingredientOfItem] == "Extra")
                           {
                                extraPrice += meals[firstKey].ingredients[ingredientOfItem].priceProAdd;
                                priceToAddProWholeItem += meals[firstKey].ingredients[ingredientOfItem].priceProAdd;
                           }
                           else if(meals[firstKey].ingredients[ingredientOfItem].priceProAdd && ingredientsOfItems[firstKey][secondKey][ingredientOfItem] >= meals[firstKey].ingredients[ingredientOfItem].amountToAddPriceFrom)   
                            {
                                const difference = parseInt(ingredientsOfItems[firstKey][secondKey][ingredientOfItem] - meals[firstKey].ingredients[ingredientOfItem].amountToAddPriceFrom) + 1;
                                extraPrice += difference * meals[firstKey].ingredients[ingredientOfItem].priceProAdd;
                                priceToAddProWholeItem += difference * meals[firstKey].ingredients[ingredientOfItem].priceProAdd;
                            }
                        }
                        else 
                        {
                            alert("Mit der Verarbeitung der Zutaten ist ein Fehler aufgetreten! Rufen Sie das Restaurant an");
                            return null;
                        }
                    }
                }
            
            }
          
            
            if(document.getElementById("extraIngredientsPriceFor"+firstKey))
            {
                if(priceToAddProWholeItem <= 0)
                {
                    document.getElementById("extraIngredientsPriceFor"+firstKey).remove();
                }
                else
                {
                    document.getElementById("extraIngredientsPriceFor"+firstKey).innerText = " +"+getNumberFormat(priceToAddProWholeItem)+"€";
                }
                
            }
            else
            {   
                if(priceToAddProWholeItem > 0)
                {
                    const spanOfExtraPrice = document.createElement("span");
                    $(spanOfExtraPrice).attr("class", "addedPriceForIngredient");
                    $(spanOfExtraPrice).attr("id", "extraIngredientsPriceFor"+firstKey);
                    spanOfExtraPrice.innerText = " +"+getNumberFormat(priceToAddProWholeItem)+"€";
                    document.getElementById("priceOfOnly"+firstKey).appendChild(spanOfExtraPrice);
                }
                
            }
        }
    } 
    catch (error) {
        console.log(error);
    }
  
    
    //This is needed because to fixed method converts it to a string
    
    return parseFloat(parseFloat(extraPrice).toFixed(2));
}

function calculateNetWholePrice()
{
    try {
        const currentOrder = JSON.parse(getCookie("bestellung"));
        wholePrice = 0;
        currentOrder.forEach(element => {
            if(meals[element.id])
            {
                wholePrice += meals[element.id].price * element.anzahl;
            }
        });
        if(Object.keys(currentOrder).length == 0)
        {
            wholePriceTag.innerHTML = "Gesamt Preis: €" + getNumberFormat(0);
            return;
        }
        wholePrice += getExtraPriceForIngredients();
        wholePriceTag.innerHTML = "Gesamt Preis: €" + getNumberFormat(wholePrice) + "<span style='font-size:small'>+1,50</span>";
    } catch (error) {
        console.log(error);
        deleteCookie("bestellung");
    }
    
}
function isBoolean(variable) {
    return typeof variable === 'boolean';
}
function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
window.onclick = function(event) 
{
    if (event.target == modal) 
    {
        modal.style.display = "none";
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
function changePrice(targetedInput, priceDiv, item, operation, numberOfItemToDiscount)
{
    try 
    {
        
        var currentOrder = JSON.parse(getCookie("bestellung"));
        
        var newQuant = 0;
        var canGo = true;
        let extraAddedPriceFromIngredients = null;
    
        currentOrder.forEach(element => {
            if(document.getElementById("extraIngredientsPriceFor"+item.name))
            {
                
                extraAddedPriceFromIngredients = document.getElementById("extraIngredientsPriceFor"+item.name).innerText;
                document.getElementById("extraIngredientsPriceFor"+item.name).remove();
            }
            if(element.id == item.name)
            {
                if(element.echteAnzahl)
                {
                    if(element.anzahl <= 0)
                    {
                        canGo = false;
                    }
                }
            }
        });
        
        if(operation === 1)
        {
            targetedInput.stepUp(1);   
            
            currentOrder.forEach(element => {
                if(element.id == item.name)
                {
                    element.anzahl++;
                    newQuant = element.anzahl;
                    priceDiv.innerHTML = "Preis: <p id='priceShowOf"+element.id+"'>€" + getNumberFormat(item.price*newQuant) + "</p>";
                    if(element.echteAnzahl)
                    {
                        element.echteAnzahl++;
                        if(element.echteAnzahl > element.anzahl)
                        {
                            priceDiv.innerHTML = "Preis: <p id='priceShowOf"+element.id+"'>€" + getNumberFormat(item.price*element.echteAnzahl) + "</p> <p id='newPriceOf"+element.id+"'>€" + getNumberFormat(item.price*element.anzahl)+"</p>";
                            document.getElementById("priceShowOf"+element.id).style.textDecoration = "line-through";
                        }
                    }
                    
                }
            }); 
        }
        else if(operation === -1)
        {
            if(canGo == true)
            {
                targetedInput.stepDown(1);
                currentOrder.forEach(element => {
                    if(element.id == item.name)
                    {
                        element.anzahl--;
                        newQuant = element.anzahl;
                        priceDiv.innerHTML = "Preis: <p id='priceShowOf"+element.id+"'>€" + getNumberFormat(item.price*newQuant) + "</p>";
                        if(element.echteAnzahl)
                        {
                            element.echteAnzahl--;
                            if(element.echteAnzahl > element.anzahl)
                            {
                                priceDiv.innerHTML = "Preis: <p id='priceShowOf"+element.id+"'>€" + getNumberFormat(item.price*element.echteAnzahl) + "</p> <p id='newPriceOf"+element.id+"'>€" + getNumberFormat(item.price*element.anzahl)+"</p>";
                                document.getElementById("priceShowOf"+element.id).style.textDecoration = "line-through";
                            }
                        }
                        
                    }
                }); 
            }
            
            
        }
        //This is for when the points get used
        else if(operation === 0)
        {
            currentOrder.forEach(element => {
                if(element.id == item.name)
                {
                    if(element.echteAnzahl == 0 || !element.echteAnzahl)
                    {
                        element.echteAnzahl = element.anzahl;
                    }
                    element.anzahl = element.anzahl - numberOfItemToDiscount;
                    newQuant = element.echteAnzahl;
                    priceDiv.innerHTML = "Preis: <p id='priceShowOf"+element.id+"'>€" + getNumberFormat(item.price*element.echteAnzahl) + "</p> <p id='newPriceOf"+element.id+"'>€" + getNumberFormat(item.price*element.anzahl)+"</p>";
                    document.getElementById("priceShowOf"+element.id).style.textDecoration = "line-through";
                }
            }); 
        }
        else
        {
            return;
        }

        if(extraAddedPriceFromIngredients != null)
        {
            const spanOfExtraPrice = document.createElement("span");
            $(spanOfExtraPrice).attr("class", "addedPriceForIngredient");
            $(spanOfExtraPrice).attr("id", "extraIngredientsPriceFor"+item.name);
            spanOfExtraPrice.innerText = " "+extraAddedPriceFromIngredients;
            document.getElementById("priceOfOnly"+item.name).appendChild(spanOfExtraPrice);
        }

        setCookie("bestellung", JSON.stringify(currentOrder));

       calculateNetWholePrice();
    
    } 
    catch (error) 
    {
        setCookie("bestellung", "");
        console.log(error);
    }

}
function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }
function removeItem(card, idOfItem)
{
    try 
    {
        var currentOrder = JSON.parse(getCookie("bestellung"));

        var itemToRemove = currentOrder.find(x => x.id == idOfItem);
       
        if(itemToRemove)
        {
            for(const key in ingredientsOfItems)
            {
                if(key == itemToRemove.id)
                {
                    delete ingredientsOfItems[key];
                }
            }
            //Getting how many points should be added again to the balance
            if(itemToRemove.echteAnzahl && itemToRemove.echteAnzahl > 0)
            {
                var pointsToAdd = ((itemToRemove.echteAnzahl - itemToRemove.anzahl) * meals[idOfItem].points_to_buy);
                realPointsOfUser += pointsToAdd;
                refreshPoints();
            }
            
        }

        currentOrder = currentOrder.filter(item => item.id != idOfItem);

        newWholePrice = 0;

        setCookie("bestellung", JSON.stringify(currentOrder));
        $(card).animate({
            margin: "-50px 0px",
            opacity: "0"
        }, 750, () => {$(card).remove();});

    
        currentOrder.forEach(element => {
            
            newWholePrice += meals[idOfItem].price * element.anzahl;
            
        });
    
        calculateNetWholePrice();
    } 
    catch (error) 
    {
        setCookie("bestellung", "");
        console.log(error);
    }
}
function refreshPoints()
{   
    $(".pointsOfUser").text(realPointsOfUser + " verfügbare Punkte");
}   