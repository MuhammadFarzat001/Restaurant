<?php
error_reporting(0);
    class MenuDatabase
    {
        private $servername = '127.0.0.1';
        private $username = 'root';
        private $password = '';
        private $dbname = 'restaurant_menu';
        private $db;

        public function __construct()
        {
            $this->db = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        }
        
        public function getDBConnection()
        {
            return $this->db;
        }
    }
?>