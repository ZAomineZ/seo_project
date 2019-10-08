<?php
require '../../../vendor/autoload.php';

use App\concern\Ajax;
use App\Controller\Auth\LogInController;
use App\Model\Auth\LogIn as LogInModelAuth;
use App\Table\Auth\LogIn as LogInTableAuth;
use App\Model\PDO_Model;

// Initialise Ajax Class for call Method HeaderProtect to Protect request Ajax !!!
$header = new Ajax();
$header->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    try {
        // Initialise Register Model and Register Class use in the construct RegisterController Controller !!!
        // Initialise too PDO_MODEL for REQUEST MYSQL !!!
        // Verif Cookie User !!!
        if (isset($_GET['id']) && isset($_GET['cookie']) && $_GET['id'] !== '' && $_GET['cookie'] !== '') {
            $header->VerifAuthMe((int)$_GET['id'], $_GET['cookie']);

            $pdo_model = new PDO_Model();
            $login = new LogInModelAuth();
            $table = new LogInTableAuth($pdo_model);

            // Request Method LogInData !!!
            $auth = new LogInController($login, $table);
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
