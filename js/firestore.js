import {app} from "./app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

export let firestore = null;
const getFirestoreInterval = setInterval(()=>{if(typeof app == "object"){
    getFireStore();
}}, 500);

async function getFireStore(){
    clearInterval(getFirestoreInterval);
    firestore = getFirestore(app);
    
}