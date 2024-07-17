import { sendEmailVerification, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import {app, auth} from "./app.js";
import {firestore} from "./firestore.js";
import {setDoc, doc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

var modal;
var autoComplete;
var checkingOnApp;
var input = document.getElementById("registerAdress");
var options = {
    componentRestrictions: { country: "DE"}
};

window.onload = () => {
    checkingOnApp = setInterval(function(){if(typeof app == "object"){setUpLogic()}}, 500);

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
    // ...


    
}



function setUpLogic()
{
    clearInterval(checkingOnApp);

    /*$("#formregistrieren").submit(function(e)
    {
        startRegistrationProcess(e)
    });*/

}

async function registerUser(fullName, email, password, adress)
{
    try {
        const creatingUser = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(creatingUser.user);
        await setDoc(doc(firestore, "users", creatingUser.user.uid), {
            name: fullName,
            email: email,
            adress: adress,
            points: 0
        });
        stopLoadingProcess();
        showPopUpWithHTML("Sie wurden erfolgreich registriert :)</br>Bestätigen Sie bitte Ihre Email mit dem Ihnen gesendeten Link");
    } catch (error) {
        const errorMessage = error.message;
        if(errorMessage.includes("auth/email-already-in-use"))
        {
            window.scrollTo({top: 0, behavior: 'smooth'});
            document.getElementById("errorMessageRegistration").innerText = "E-mail bereits registriert";
        }
        else
        {
            window.scrollTo({top: 0, behavior: 'smooth'});
            document.getElementById("errorMessageRegistration").innerHTML = "Ein Fehler ist aufgetreten.</br>Prüfen Sie Ihre Angaben und Verbindung";
        }
        stopLoadingProcess();
    }
}


function startRegistrationProcess(e)  
{
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
    else if(fullName.length < 5)
    {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.getElementById("errorMessageRegistration").innerText = "Name darf nicht kürzer als 5 Zeichen sein";
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
            //deactivate register button
            $("#formregistrieren").unbind("submit");;
            //start loading process
            document.getElementById("registerButton").innerHTML = `<div class="loader" style='position: relative; 
            left: 50%;
            transform: translateX(-50%);'></div>`;

            //Just because we need an Element of html sooo it doesn't matter
          

            var request = {
                query: document.getElementById('registerAdress').value,
                fields: ['ALL'],
            };

        

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
        //deactivate register button
        $("#formregistrieren").unbind("submit");
        //start loading process
        document.getElementById("registerButton").innerHTML = `<div class="loader" style='position: relative; 
        left: 25%;
        transform: translateX(-50%);'></div>`;
        var registrationAdress = "";
        registerUser(fullName , registrationEmail, password, registrationAdress);

        modal.style.display = "none";
        
       };
    }
    
    e.preventDefault();
}

function stopLoadingProcess()
{
    $("#formregistrieren").submit(function(e)
    {
        startRegistrationProcess(e)
    });
    document.getElementById("registerButton").innerHTML = 'Registrieren';
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