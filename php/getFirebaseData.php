<?php
    header("Access-Control-Allow-Headers: *");
    header('Content-Type: application/json; charset=utf-8');

    $response;

    if(isset($_POST["get_project_data"]))
    {
        $response["apiKey"] = "AIzaSyDuKgWfSZEe2L0oN2LSKcOEFEOq3-zHddM";
        $response["authDomain"] = "sirindamaskinorestaurant.firebaseapp.com";
        $response["databaseURL"] = "https://sirindamaskinorestaurant-default-rtdb.europe-west1.firebasedatabase.app";
        $response["projectId"] = "sirindamaskinorestaurant";
        $response["storageBucket"] = "sirindamaskinorestaurant.appspot.com";
        $response["messagingSenderId"] = "144020348451";
        $response["appId"] = "1:144020348451:web:c6b0c220a608483e7b5b96";
        $response["measurementId"] = "G-J3VYMSFXRJ";
        echo json_encode($response);
    }

?>