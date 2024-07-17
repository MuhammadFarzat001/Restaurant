<?php
    require_once "connectionToDB.php";
	require_once "verschluesselung.php";
    $conn = new MenuDatabase();
    $user = false;
    $usersFound = 0;
    $userID = null;
    $username = null;
    $usermail = null;
    $useradress = null;
    $userPoints = null;
    $cookiesAccepted = true;
    //This is needed because the variable result is being declared in an if statement and we don't want to
    //declare it here because we want to have a better description of every error that might occur
    $couldReadFromDatabase = true;
    $couldUpdateDatabase = true;
    
    if (isset($_COOKIE['consent']) && $_COOKIE['consent'] == "true") {
        
        if(isset($_COOKIE['loginCookie']) && $_COOKIE['loginCookie'] != "")
        {
            $loginStringFromCookie = $_COOKIE['loginCookie'];
            $result = $conn->getDBConnection()->query("SELECT * FROM users WHERE session_key='$loginStringFromCookie';");
            if($result == false)
            {
                $couldReadFromDatabase = false;
            }
            else if($result->num_rows > 1)
            {
                $result = $conn->getDBConnection()->query("UPDATE users SET session_key='' WHERE session_key='$loginStringFromCookie'");
                if($result == false)
                {
                    $couldUpdateDatabase = false;
                }
                else
                {
                    $usersFound = $result->num_rows;
                }
                
            }
            else if($result->num_rows == 1)
            {
                $user = true;
                while ($row = $result->fetch_assoc()) {
                    $userID = $row["ID"];
                    $username = $row["name"];
                    $useradress = $row["adress"];
                    $usermail = $row["email"];
                    $userPoints = $row["points"];
                }
                
            }
        }
        
    }
    else
    {
        $cookiesAccepted = false;
    }
?>