import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";


var modal = document.getElementById("myModal");
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

export var app;
export var auth;


$.post("http://localhost/Abschlussprojekt/php/getFirebaseData.php",
    {
        get_project_data: "get_project_data",
    },
    function(data, status){

        if(status == "success")
        {
            app = initializeApp(data);
            auth = getAuth(app);
        }
        else
        {
            showPopUp("Verbindung zum Server konnte nicht hergestellt werden!");
        }
        
});

function showPopUp(message)
{
    document.getElementById("messageText").innerText = message;
    modal.style.display = "grid";
}

