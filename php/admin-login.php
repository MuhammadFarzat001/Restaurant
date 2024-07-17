<?php

    $sessions = [];
    $password = "bestRestaurantSite";
    header("Access-Control-Allow-Headers: *");
    header('Content-Type: text/html; charset=utf-8');
    if ($myfile = fopen("sessions.txt", "r")) {
        while(!feof($myfile)) {
            $line = fgets($myfile);
            array_push($sessions, $line);
        }
        fclose($myfile);
    }
    $response;

    if(isset($_POST["admin_login_password"]))
    {
        if($_POST["admin_login_password"] == $password)
        {
            $key = generateRandomString();
            $myfile = fopen("sessions.txt", "a+") or die("Unable to open file!");
            fwrite($myfile,$key."\n");
            fclose($myfile);
            echo $key;
        }
        else
        {
            echo "";
        }
         
    }
    if(isset($_POST["checkSession"]))
    {
        $result = "false";
        foreach ($sessions as $session) {
            if($session == $_POST["checkSession"]."\n")
            {
                $result = "true";
            }
        }
        echo $result;
    }
    if(isset($_POST["deleteSession"]))
    {
        $data = file("./sessions.txt");

        $out = array();

        foreach($data as $line) {
            if(trim($line) != $_POST["deleteSession"]) {
                $out[] = $line;
            }
        }

        $fp = fopen("./sessions.txt", "w+");
        flock($fp, LOCK_EX);
        foreach($out as $line) {
            fwrite($fp, $line);
        }
        flock($fp, LOCK_UN);
        fclose($fp);  
        echo "deleted"; 
    }

    if(isset($_POST["email"]))
    {
        try {
            mail($_POST["email"], "Bestellung status", "Ihre Bestellung ist gerade auf dem Weg");
            echo "sent";
        } catch (\Throwable $th) {
            echo "";
        }
    }

    function generateRandomString($length = 20) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
?>