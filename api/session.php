<?php
require_once("route.php");
if (!isset($_SESSION))
{
    session_start();
}

$sessions = array();
foreach ($_SESSION as $key ){
    $sessions[$key] = $_SESSION[$key];
}
header('Content-Type: application/json');
echo json_encode($sessions);