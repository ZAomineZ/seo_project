<?php
require '../../../vendor/autoload.php';

use App\concern\Ajax;
use App\concern\Mail;
use App\Controller\Auth\PasswordForgotController;
use App\Model\Auth\PasswordForgot as PasswordForgotModel;
use App\Table\Auth\PasswordForgot as PasswordForgotTable;
use App\Model\PDO_Model;
use PHPMailer\PHPMailer\PHPMailer;

$ajax = new Ajax();
$ajax->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['email']) && $_GET['email'] !== '') {
        // Initialise Table PasswordForgot for do requests !!!
        // Initialise Model Password for return the data Email !!!
        // Initialise PHPMailer for enjoyed email Confirmation !!!
        $php_mailer = new PHPMailer();
        $mail = new Mail($php_mailer);
        $model = new PasswordForgotModel();
        $pdo = new PDO_Model();
        $table = new PasswordForgotTable($pdo);

        $forgot_password = new PasswordForgotController($table, $model, $mail);
        $forgot_password->DataPassword(htmlspecialchars($_GET['email']));
    } else {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
