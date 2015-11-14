<?php
$dbType = "local";

switch($dbType) {
    case 'local':
        define('DB_NAME', 'sort');
        define('DB_HOSTNAME', 'localhost');
        define('DB_USERNAME', 'root');
        define('DB_PASSWORD', '');
        break;
}


