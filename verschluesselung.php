<?php
    error_reporting(0);
    $registerationPassword = 'nur Ich kann das wissen';
    $confirmationEmail = "das IsT die zweite Version von meinen Gedanken";
    $newPassword = "das IsT die dritte und anscheinend letzte Version von meinen Gedanken";
    function encrypt($plaintext, $password) {
        $method = "AES-256-CBC";
        $key = hash('sha256', $password, true);
        $iv = openssl_random_pseudo_bytes(16);
    
        $ciphertext = openssl_encrypt($plaintext, $method, $key, OPENSSL_RAW_DATA, $iv);
        $hash = hash_hmac('sha256', $ciphertext . $iv, $key, true);
    
        return base64_encode($iv . $hash . $ciphertext);
    }
    
    function decrypt($encryptedText, $password) {
        $encryptedText = base64_decode($encryptedText);
    
        $method = "AES-256-CBC";
        $iv = substr($encryptedText, 0, 16);
        $hash = substr($encryptedText, 16, 32);
        $ciphertext = substr($encryptedText, 48);
        $key = hash('sha256', $password, true);
    
        if (!hash_equals(hash_hmac('sha256', $ciphertext . $iv, $key, true), $hash)) return null;
    
        return openssl_decrypt($ciphertext, $method, $key, OPENSSL_RAW_DATA, $iv);
    }
?>