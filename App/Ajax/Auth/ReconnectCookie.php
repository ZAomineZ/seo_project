<?php
require '../../../vendor/autoload.php';

// Initialise Ajax Class for call Method HeaderProtect to Protect request Ajax !!!
$header = new \App\concern\Ajax();
$header->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    try {
        // Initialise Register Model and Register Class use in the construct RegisterController Controller !!!
        // Initialise too PDO_MODEL for REQUEST MYSQL !!!
        // Verif Cookie User !!!
        if (isset($_GET['id']) && isset($_GET['cookie']) && $_GET['id'] !== '' && $_GET['cookie'] !== '') {
            $header->VerifAuthMe((int)$_GET['id'], $_GET['cookie']);

            $pdo_model = new \App\Model\PDO_Model();
            $login = new \App\Model\Auth\LogIn();
            $table = new \App\Table\Auth\LogIn($pdo_model);

            // Request Method LogInData !!!
            $auth = new \App\Controller\Auth\LogInController($login, $table);
            $auth->ReconnectCookieData((int)$_GET['id']);
        } else {
            echo 'Invalid Token !!!';
        }
    } catch (Exception $exception) {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
