<?php
require '../../../vendor/autoload.php';

// Initialise Ajax Class for call Method HeaderProtect to Protect request Ajax !!!
$header = new \App\concern\Ajax();
$header->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['username']) && $_GET['username'] !== '' && isset($_GET['email']) && $_GET['email'] !== '' && isset($_GET['password']) && $_GET['password'] !== '') {
        // Initialise Register Model and Register Class use in the construct RegisterController Controller !!!
        $phpmailer = new \PHPMailer\PHPMailer\PHPMailer();
        $pdo_model = new \App\Model\PDO_Model();
        $register = new \App\Model\Auth\Register($phpmailer);
        $table = new \App\Table\Auth\Register($pdo_model);

        // Request Method Register Data !!!
        $auth = new \App\Controller\Auth\RegisterController($register, $table);
        $auth->RegisterData($_GET['username'], $_GET['email'], $_GET['password']);
    } else {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
