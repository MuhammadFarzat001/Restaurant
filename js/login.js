import {signInWithEmailAndPassword, sendPasswordResetEmail, signOut} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import {app, auth} from "./app.js";
import {currentUser} from "./checkLoggedIn.js";

var checkingOnApp;
var modal;

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
    document.getElementById("eye").onclick = changeInputType;
    // ...v
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

function setUpLogic()
{
    clearInterval(checkingOnApp);

    document.getElementById("sendNewPasswordRequest").onclick = passwortResten;  

    /*$("#formAnmeldung").submit(function(e){
        startLoginProcess(e);
    });*/

    $("#logoutButton").click(()=>{
        if(currentUser)
        {
            
            if(confirm("Möchten Sie sich wirklich ausloggen?"))
            {
                document.getElementById("logoutButton").innerHTML = `<div class='loader' style='position: relative; 
                left: 25%;
                transform: translateX(-50%);'></div>`;
                signOut(auth).then(() => {
                    document.getElementById("logoutButton").innerText = "Ausloggen";
                    showPopUp("Erfolgreich abgemeldet! Sie können sich jetzt mit einem anderen Account anmelden");
                }).catch((error) => {
                    document.getElementById("logoutButton").innerText = "Ausloggen";
                    showPopUp("Ein Fehler ist aufgetreten versuchen Sie es später noch mal");
                });  
            }
        }
        else
        {
            showPopUp("Sie sind noch nicht angemeldet!");
        }
    });
}


async function startLoginProcess(e)
{
    document.getElementById("errorMessage").innerText = "";
    if(currentUser == null || currentUser == undefined)
    {
        //deactivate login button
        $("#formAnmeldung").unbind("submit");
        
        //start loading process
        document.getElementById("loginButton").innerHTML = `
        <div class="loader" 
        style='position: relative; 
        left: 25%;
        transform: translateX(-50%);'></div>`;

        var email = document.getElementById("loginUsername").value;
        var password = document.getElementById("loginPassword").value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if(userCredential.user.emailVerified)
            {
                //set up popup content
                showPopUpWithHTML("Sie wurden erfolgreich angemeldet :)</br>Punkte werden automatisch gesammelt bei einer neuen Bestellung");
                window.onclick = function(event) {
                    if (event.target == modal) {
                        window.location.href = 'http://localhost/Abschlussprojekt';
                    }
                }
            }
            else
            {
                signOut(auth).then(() => {
                    
                }).catch((error) => {
                    console.log(error);
                });  
                showPopUp("Bestätigen Sie bitte Ihre E-mail Adresse!");
            }
            // Signed in 
            document.getElementById("loginButton").innerHTML = "Anmelden";

            $("#formAnmeldung").submit(function(e){
                startLoginProcess(e);
            });
           
        })
        .catch((error) => {
            document.getElementById("loginButton").innerHTML = "Anmelden";
            
            $("#formAnmeldung").submit(function(e){
                startLoginProcess(e);
            });
            
            window.scrollTo({top: 0, behavior: 'smooth'});
            if(error.message.includes("auth/invalid-email"))
            {
                document.getElementById("errorMessage").innerText = "Email konnte nicht gefunden werden";
            }
            else if(error.message.includes("auth/user-disabled"))
            {
                document.getElementById("errorMessage").innerText = "Dieser Benutzer wurde deaktiviert";
            }
            else if(error.message.includes("auth/user-not-found"))
            {
                document.getElementById("errorMessage").innerText = "Dieser Benutzer konnte nicht gefunden werden";
            }
            else if(error.message.includes("auth/wrong-password"))
            {
                document.getElementById("errorMessage").innerText = "Falsches Kennwort";
            }
            else if(error.message.includes("auth/internal-error"))
            {
                document.getElementById("errorMessage").innerText = "Geben Sie bitte ein Passwort ein";
            }
            else
            {
                document.getElementById("errorMessage").innerText = "Prüfen Sie bitte Ihre Internetverbindung";
            }
        });
        
    }
    else
    {
        showPopUpWithHTML("Sie sind bereits angemeldet!</br>Möchten Sie sich abmelden?</br>"+
        '<button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="logOut">Ja</button>  '+
        '<button class="btn btn-lg btn-circle btn-outline-new-white allButtons shadow-none" id="stayLoggedIn">Nein</button>');
        document.getElementById("logOut").onclick = async() => {
            signOut(auth).then(() => {
                showPopUp("Erfolgreich abgemeldet! Sie können sich jetzt mit einem anderen Account anmelden");
            }).catch((error) => {
                console.log(error);
                showPopUp("Ein Fehler ist aufgetreten versuchen Sie es später noch mal");
            });  
        };
        document.getElementById("stayLoggedIn").onclick = () => {
            modal.style.display = "none";
        };
    }
    e.preventDefault();
}

async function passwortResten()
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

async function startResettingProcess()
{
    if(document.getElementById("emailNewPassword").value != "")
    {
        document.getElementById("errorMessageNewPassword").innerText = "";
        //start loading process
        document.getElementById("newLinkButton").innerHTML = `<div class='loader' style='position: relative; 
        left: 5%;'></div>`;
        document.getElementById('newLinkButton').removeAttribute("onclick");

        sendPasswordResetEmail(auth, document.getElementById("emailNewPassword").value)
        .then(() => {
            showPopUp("Email erfolgreich gesendet");
        })
        .catch((error) => {
            console.log(error.message);
            if(error.message.includes("auth/invalid-email"))
            {
                document.getElementById("errorMessageNewPassword").innerText = "Ungültige Email-Adresse";
            }
            else if(error.message.includes("user-not-found"))
            {
                document.getElementById("errorMessageNewPassword").innerText = "Email konnte nicht gefunden werden";
            }
            document.getElementById("emailNewPassword").value = "";
            document.getElementById("newLinkButton").innerHTML = "Link Senden";
            document.getElementById('newLinkButton').onclick = startResettingProcess;
        });
    }    
    else
    {
        document.getElementById("errorMessageNewPassword").innerText = "Geben Sie bitte ein E-mail ein";
    }    
}