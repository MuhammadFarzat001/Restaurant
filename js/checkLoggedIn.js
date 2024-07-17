import {auth} from "./app.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";

const checkingOnAuth = setInterval(function(){if(typeof auth == "object"){setUpLogic();}}, 500);

export let currentUser = null;

function setUpLogic()
{
    clearInterval(checkingOnAuth);
    onAuthStateChanged(auth, (user)=>{
        if(user)
        {
            if(user.emailVerified === true)
            {
                currentUser = user;
            }
            else
            {
                currentUser = null;
            }
        }
        else
        {
            currentUser = null;
        }
    });
}