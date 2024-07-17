import { doc, onSnapshot, setDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";
import { firestore } from "./firestore.js";

const firestoreInterval = setInterval(() => {
   if(typeof firestore == "object")
   {
        clearInterval(firestoreInterval);
        const deliveryPossibleListener = onSnapshot(doc(firestore, "Informationen", "Lieferung"), (doc) => {
            try {
              
                document.getElementById("deliverButton").checked = doc.data().moeglich;
            } catch (error) {
             
            }
        });
        const openedListener = onSnapshot(doc(firestore, "Informationen", "Oeffnung"), (doc) => {
            try {
              
                document.getElementById("openedButton").checked = doc.data().geoeffnet;
            } catch (error) {
               
            }
        });
   } 
}, 500);


let modal;
const urlParams = new URLSearchParams(window.location.search);
window.onload = () =>{
    if(urlParams.get("key") == null)
    {
        $("#formAnmeldungAdmin").submit(()=>{
            document.getElementById("loginButton").innerHTML = `<div class='loader' style='position: relative; 
            left: 25%;
            transform: translateX(-50%);'></div>`;
            $.post("http://localhost/Restaurant/php/admin-login.php",
                {
                    admin_login_password: document.getElementById("loginPassword").value,
                },
                function(data, status){
    
                    if(status == "success")
                    {
                        if(data != "")
                        {
                            window.open("http://localhost/Restaurant/Admin/?key="+data, "_self");
                        }
                        else
                        {
                            console.log(data);
                            $("body").append(`<div id="myModal" class="modal" style="display:grid !important;">
                           <div class="modal-content">
                           <div id="closeModal">+</div>
                             <p id="messageText">Falsches Kennwort</p>
                           </div>
                         
                            </div>`);
                            document.getElementById("loginButton").innerHTML = "Anmelden";
                        }
                    }
                    else
                    {
                        console.log(status);
                    }
                    modal = document.getElementById("myModal");
                    if(document.getElementById("messageText").innerText == "")
                    {
                        $(".menu-box").remove();
                    }
                    window.onclick = function(event) {
                        if (event.target == modal) {
                            if(document.getElementById("messageText").innerText == "Falsches Kennwort")
                            {
                                $("#myModal").remove();
                            }
                            else
                            {
                                modal.style.display="grid";
                            } 
                        }
                    }
                    
            });
            
        });
        document.getElementById("eye").onclick = changeInputType;
    }
    else
    {
        $.post("http://localhost/Restaurant/php/admin-login.php",
        {
            checkSession: urlParams.get("key"),
        },
        function(data, status){

            if(status == "success")
            {
                if(data == "true")
                {
                    loadDoc();
                }
                else
                {
                    window.open("http://localhost/Restaurant/Admin", "_self");
                }
            }
        });
        
    }
}

function loadDoc()
{
    $(".menu-box").remove();
    $("body").append(`
    <style>
        #navbars-rs-food
        {
            position: absolute;
            display: flex;
            right: 0;
        }
        .switch {
          position: relative;
          margin-inline: 5px;
          z-index: 100;
          width: 60px;
          height: 34px;
        }
        
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #d0a772;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #d0a772;
        }
        
        input:checked + .slider:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
        
        /* Rounded sliders */
        .slider.round {
          border-radius: 34px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }

        .orderCard
        {
            height: auto !important;
            padding: 10px 10px;
        }
        .orderCard h3
        {
            left: 10px !important;
        }
        .orderReadyButton
        {
            -moz-transition: all .1s ease-in;
            -o-transition: all .1s ease-in;
            -webkit-transition: all .1s ease-in;
            transition: all .1s ease-in;
            background-color: white;
            width: 5rem;
            position: absolute;
            height: 3rem;
            right: 10px;
            top: 5px;
            border: 1px solid #d0a772;
            border-radius: 5px;
            cursor: pointer;
        }
        .orderReadyButton:hover
        {   
            background: #d0a772; 
        }

        </style>
    <!-- Start header -->
    <header class="top-navbar">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container" id="header-container">
                <a class="navbar-brand"  id="logoContainer">
                <h3 id="logo">Farzat Restaurant</h3>
                </a>

                <div class="navbar-collapse" id="navbars-rs-food">
                    <h3>Lieferung </h3> 
                    <label class="switch">
                        
                        <input type="checkbox" checked id="deliverButton" onclick="return false;">
                        <span class="slider round"></span>
                    </label>
                    <h3>Geöffnet </h3> 
                    <label class="switch">
                        
                        <input type="checkbox" checked id="openedButton" onclick="return false;">
                        <span class="slider round"></span>
                    </label>
                </div>
               
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


    <div class="cards" id="cards">
        <div class="loader" style='position: relative; 
        left: 50%;
        transform: translateX(-50%);'></div>
	</div>
    
    `);
    modal = document.getElementById("myModal");
    document.getElementById("closeModal").onclick = ()=>{
        modal.style.display = "none";
        }
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }

    const checkboxDelivery = document.getElementById('deliverButton');
    const checkboxOpened = document.getElementById('openedButton');

    checkboxDelivery.addEventListener('click', async (event) => {

        var currentState;
      
        try {
            const docu = await getDoc(doc(firestore, "Informationen", "Lieferung"));
            if(docu)
            {
                currentState = docu.data().moeglich;
                if(currentState == false)
                {
                    currentState = true;
                }
                else
                {
                    currentState = false;
                }
                await setDoc(doc(firestore, "Informationen", "Lieferung"),{
                    moeglich:currentState
                });
            }
            
        } catch (error) {
            console.log(error);
        }
        
      });

      checkboxOpened.addEventListener('click', async (event) => {

        var currentState;
      
        try {
            const docu = await getDoc(doc(firestore, "Informationen", "Oeffnung"));
            if(docu)
            {
                currentState = docu.data().geoeffnet;
                if(currentState == false)
                {
                    currentState = true;
                }
                else
                {
                    currentState = false;
                }
                await setDoc(doc(firestore, "Informationen", "Oeffnung"),{
                    geoeffnet:currentState
                });
            }
            
        } catch (error) {
            console.log(error);
        }
        
      });
      const waitingForFirestore = setInterval(() => {
        if(typeof firestore == "object")
        {
            clearInterval(waitingForFirestore);
            deleteSession();
        }
    }, 500);
     
}

async function deleteSession()
{
    $.post("http://localhost/Abschlussprojekt/php/admin-login.php",
    {
        deleteSession: urlParams.get("key"),
    },
    function(data, status){

        if(status == "success")
        {
            if(data == "deleted")
            {
                getAllOrders();
            }
            else
            {
                window.open("http://localhost/Abschlussprojekt/Admin", "_self");
            }
        }
        else
        {
            window.open("http://localhost/Abschlussprojekt/Admin", "_self");
        }
    });
    
}
async function getAllOrders()
{
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var newdate = year + "/" + month + "/" + day;

    let allOrders =  await getDocs(collection(firestore, "bestellungen"));
    $(".loader").remove();
    
    allOrders.forEach(element => {


        if(element.data().date == newdate)
        {
            if(element.data().finished == false)
            {
                const cardDiv = document.createElement("div");
                $(cardDiv).attr("class", "card orderCard");
                $(cardDiv).attr("id", element.id);
    
                const readyButton = document.createElement("button");
                $(readyButton).attr("class", "orderReadyButton allButtons shadow-none");
                $(readyButton).attr("id", element.data().email);
                readyButton.innerText = "Bereit";
                readyButton.addEventListener('click', async (event) => {
                    console.log("bruh");
                    if(confirm("Ist die Bestellung fertig"))
                    {
                        readyButton.disabled = true; 
                        readyButton.innerHTML = `<div class="loader" style="position: relative; 
                        left: 25%;
                        transform: translateX(-50%);"></div>`;
                        $.post("http://localhost/Abschlussprojekt/php/admin-login.php", {
                            email: element.data().email
                        },
                        function(data, status){
                    
                            if(status == "success")
                            {
                                if(data == "sent")
                                {
                                    const document = allOrders.find(x=>x.id == cardDiv.id);
                                    setDoc(doc(firestore, "bestellungen", cardDiv.id), {
                                        adress: document.data().adress,
                                        customer: document.data().customer,
                                        date: document.data().date,
                                        email: document.data().email,
                                        finished: true,
                                        items: document.data().items,
                                        name: document.data().name,
                                        price: document.data().price
                                    }).then(()=>{
                                        $(cardDiv).remove();
                                        refreshNumbers();
                                        showPopUp("Email erfolgreich gesendet");
                                    }).catch((error)=>{
                                        console.log(error);
                                    });
                                }
                                else
                                {
                                    showPopUp("Email konnte nicht gesendet werden");
                                }
                            }
                            else
                            {
                                showPopUp("Es ist ein Fehler in der Verbindung aufgetreten");
                            }
                            readyButton.innerText = "Bereit";
                            readyButton.disabled = false; 
                        });
                    }
                });
    
                const h3 = document.createElement("h3");
                $(h3).attr("class", "h3OfCard");
                $(h3).attr("id", element.data().name);
    
                const h4 = document.createElement("h4");
                $(h4).attr("style", "font-weight: bold;color:#d0a772;");
                h4.innerText = element.data().adress;
    
                const orderedMealsDiv = document.createElement("div");
                $(orderedMealsDiv).attr("class", "orderedMeals");
                const lenghtOfItems = element.data().items.length;
                for (let index = 0; index < lenghtOfItems; index++) {
                    if((index + 1) == lenghtOfItems)
                    {
                        if(element.data().items[index].echteAnzahl)
                        {
                            orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].echteAnzahl + ".";
                        }
                        else
                        {
                            orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].anzahl + ".";
                        }
                    }
                    else
                    {
                        if(element.data().items[index].echteAnzahl)
                        {
                            orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].echteAnzahl + ", ";
                        }
                        else
                        {
                            orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].anzahl + ", ";
                        }
                    }
                    
                }
                $(cardDiv).append(readyButton);
                $(cardDiv).append(h3);
                $(cardDiv).append("</br>");
                $(cardDiv).append(h4);
                $(cardDiv).append(orderedMealsDiv);
                $(".cards").append(cardDiv);
    
             
            }
           
        }
    });

    refreshNumbers();

    const unsubscribe = onSnapshot(collection(firestore, "bestellungen"), (newDocs) => {

       let docsToAdd = newDocs.docs;
        allOrders.forEach(element => {
            docsToAdd = docsToAdd.filter(x=>x.id != element.id);
        });
        allOrders = newDocs.docs;

        docsToAdd.forEach(element => {
            const cardDiv = document.createElement("div");
            $(cardDiv).attr("class", "card orderCard");
            $(cardDiv).attr("id", element.id);

            const readyButton = document.createElement("button");
            $(readyButton).attr("class", "orderReadyButton allButtons shadow-none");
            $(readyButton).attr("id", element.data().email);
            readyButton.innerText = "Bereit";
            readyButton.addEventListener('click', async (event) => {
                if(confirm("Ist die Bestellung fertig"))
                {
                    readyButton.disabled = true; 
                    readyButton.innerHTML = `<div class="loader" style="position: relative; 
                    left: 25%;
                    transform: translateX(-50%);"></div>`;
                    $.post("http://localhost/Abschlussprojekt/php/admin-login.php", {
                        email: element.data().email
                    },
                    function(data, status){
                
                        if(status == "success")
                        {
                            if(data == "sent")
                            {
                                const document = allOrders.find(x=>x.id == cardDiv.id);
                                setDoc(doc(firestore, "bestellungen", cardDiv.id), {
                                    adress: document.data().adress,
                                    customer: document.data().customer,
                                    date: document.data().date,
                                    email: document.data().email,
                                    finished: true,
                                    items: document.data().items,
                                    name: document.data().name,
                                    price: document.data().price
                                }).then(()=>{
                                    $(cardDiv).remove();
                                    refreshNumbers();
                                    showPopUp("Email erfolgreich gesendet");
                                }).catch((error)=>{
                                    console.log(error);
                                });
                            }
                            else
                            {
                                showPopUp("Email konnte nicht gesendet werden");
                            }
                        }
                        else
                        {
                            showPopUp("Es ist ein Fehler in der Verbindung aufgetreten");
                        }
                        readyButton.innerText = "Bereit";
                        readyButton.disabled = false; 
                    });
                }
            });

            const h3 = document.createElement("h3");
            $(h3).attr("class", "h3OfCard");
            $(h3).attr("id", element.data().name);

            const h4 = document.createElement("h4");
            $(h4).attr("style", "font-weight: bold;color:#d0a772;");
            h4.innerText = element.data().adress;

            const orderedMealsDiv = document.createElement("div");
            $(orderedMealsDiv).attr("class", "orderedMeals");
            const lenghtOfItems = element.data().items.length;
            for (let index = 0; index < lenghtOfItems; index++) {
                if((index + 1) == lenghtOfItems)
                {
                    if(element.data().items[index].echteAnzahl)
                    {
                        orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].echteAnzahl + ".";
                    }
                    else
                    {
                        orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].anzahl + ".";
                    }
                }
                else
                {
                    if(element.data().items[index].echteAnzahl)
                    {
                        orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].echteAnzahl + ", ";
                    }
                    else
                    {
                        orderedMealsDiv.innerText += element.data().items[index].id + ": " + element.data().items[index].anzahl + ", ";
                    }
                }
                
            }
            $(cardDiv).append(readyButton);
            $(cardDiv).append(h3);
            $(cardDiv).append("</br>");
            $(cardDiv).append(h4);
            $(cardDiv).append(orderedMealsDiv);

            const cardsDiv = document.getElementById("cards");

            cardsDiv.insertBefore(cardDiv, cardsDiv.children[0]);
            refreshNumbers();
        });
      });

    
}

function refreshNumbers()
{
    for (let index = 0; index < $(".h3OfCard").length; index++) {
        const h3Element = $(".h3OfCard")[index];
        h3Element.innerText = ($(".h3OfCard").length-index)+". "+h3Element.id;
    }
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

function showPopUp(message)
{
    document.getElementById("messageText").innerText = message;
    modal.style.display = "grid";
}