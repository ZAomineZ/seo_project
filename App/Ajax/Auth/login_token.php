<?php
require '../../../vendor/autoload.php';

use App\concern\Ajax;
use App\Controller\Auth\LogInController;
use App\Model\Auth\LogIn as LogInModel;
use App\Table\Auth\LogIn as LogInTable;
use App\Model\PDO_Model;

// Initialise Ajax Class for call Method HeaderProtect to Protect request Ajax !!!
$header = new Ajax();
$header->HeaderProtect();
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['token']) && $_GET['token'] !== '') {
        // Initialise Register Model and Register Class use in the construct RegisterController Controller !!!
        // Initialise too PDO_MODEL for REQUEST MYSQL !!!
        $pdo_model = new PDO_Model();
        $login = new LogInModel();
        $table = new LogInTable($pdo_model);

        // Request Method Token Data !!!
        $auth = new LogInController($login, $table);
        $auth->TokenData($_GET['token']);
    } else {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
