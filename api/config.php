<?php
$dbType = "local";

switch($dbType) {
    case 'local':
        define('DB_NAME', 'sort');
        define('DB_HOSTNAME', 'localhost');
        define('DB_USERNAME', 'root');
        define('DB_PASSWORD', '');
        break;
    case 'product':
        define('DB_NAME', 'sort');
        define('DB_HOSTNAME', 's16.thehost.com.ua');
        define('DB_USERNAME', 'simon060893');
        define('DB_PASSWORD', '9fOEtwTE');
        break;
}


