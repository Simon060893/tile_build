<?php

require_once(__DIR__ . "/Sort.php");

global $config;
$request = (object)$_REQUEST;
$post = json_decode(file_get_contents("php://input"));
$get = (object)$_GET;

if (!empty($request->method) || !empty($post->method)) {
    $fgr = new Sort();
    $method = empty($request->method) ? $post->method : $request->method;
    switch ($method) {
        case "saveUser":
            $data = $fgr->saveUser($request->user);
            die(json_encode($data));
            break;
        case "getUser":
            $data = $fgr->getUser($request->user);
            die(json_encode($data));
            break;
        default:
            die(json_encode(array(
                'error' => "false request"
            )));
            break;
    }
}else{
    die(json_encode(array(
        'error' => "Empty request method!"
    )));
}
