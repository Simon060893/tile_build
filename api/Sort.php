<?php
require_once("config.php");

class Sort
{
    private $filepath;
    private $db;

    function __construct($filepath = 'data/img/temp')
    {
        $this->filepath = $filepath;
        $this->db = $this->db();
    }

    private function db()
    {
        $conn = new mysqli(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_NAME);
        if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);
        return $conn;
    }

    public function saveUser($user)
    {
        return array('error' => "could'nt save user");
    }

    public function getUser($data)
    {
        return array('error' => "did'nt find such");
    }

}