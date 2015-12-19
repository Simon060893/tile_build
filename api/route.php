<?php

require_once("Sort.php");

global $config;
$request = (object)$_REQUEST;
$post = json_decode(file_get_contents("php://input"));
$get = (object)$_GET;
if (!isset($_SESSION)) {
    session_start();
}

if (!empty($request->method) || !empty($post->method)) {
    $fgr = new Sort();
    $method = empty($request->method) ? $post->method : $request->method;
    switch ($method) {
        case "saveUser":
           $data = $fgr->saveUser($post->data);
            if (!$data['error']) {
                $_SESSION['user'] = $data['data'];
            }
            die(json_encode($data));
            break;
        case "getUser":
            $data = $fgr->getUser($post->data);
            if (!$data['error']) {
                $_SESSION['user'] = $data['data'];
            }
            die(json_encode($data));
            break;
        case "saveSort":
            $data = $fgr->saveSort($post->data);
            die(json_encode($data));
            break;
        case "getSorts":
            $data = $fgr->getSorts($post->data);
            die(json_encode($data));
            break;
        case "editSort":
            $data = $fgr->editSort($post->data);
            die(json_encode($data));
            break;
        case "getProducts":
            $data = $fgr->getProducts();
            die(json_encode($data));
            break;
        case "getSession":
            die(json_encode(array('session'=>$_SESSION)));
            break;
        case "clearSession":
            session_destroy();
            die(json_encode(array('session'=>array())));
            break;
        default:
            die(json_encode(array(
                'error' => "false request"
            )));
            break;
    }
} else {
    die(json_encode(array(
        'error' => "Empty request method!"
    )));
}
