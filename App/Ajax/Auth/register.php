<?php
require '../../../vendor/autoload.php';

use App\concern\Ajax;
use App\Controller\Auth\RegisterController;
use App\Table\Auth\Register as RegisterAuth;
use App\Model\Auth\Register as RegisterModel;
use App\Model\PDO_Model;
use PHPMailer\PHPMailer\PHPMailer;

// Initialise Ajax Class for call Method HeaderProtect to Protect request Ajax !!!
$header = new Ajax();
$header->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['username']) && $_GET['username'] !== '' && isset($_GET['email']) && $_GET['email'] !== '' && isset($_GET['password']) && $_GET['password'] !== '') {
        // Initialise Register Model and Register Class use in the construct RegisterController Controller !!!
        $phpmailer = new PHPMailer();
        $pdo_model = new PDO_Model();
        $register = new RegisterModel($phpmailer);
        $table = new RegisterAuth($pdo_model);

        // Request Method Register Data !!!
        $auth = new RegisterController($register, $table);
        $auth->RegisterData($_GET['username'], $_GET['email'], $_GET['password']);
    } else {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
