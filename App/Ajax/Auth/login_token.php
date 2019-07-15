<?php
require '../../../vendor/autoload.php';

// Initialise Ajax Class for call Method HeaderProtect to Protect request Ajax !!!
$header = new \App\concern\Ajax();
$header->HeaderProtect();
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['token']) && $_GET['token'] !== '') {
        // Initialise Register Model and Register Class use in the construct RegisterController Controller !!!
        // Initialise too PDO_MODEL for REQUEST MYSQL !!!
        $pdo_model = new \App\Model\PDO_Model();
        $login = new \App\Model\Auth\LogIn();
        $table = new \App\Table\Auth\LogIn($pdo_model);

        // Request Method Token Data !!!
        $auth = new \App\Controller\Auth\LogInController($login, $table);
        $auth->TokenData($_GET['token']);
    } else {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
