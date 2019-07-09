<?php
require '../../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

// Initialise Table PasswordForgot for do requests !!!
// Initialise Model Password for return the data Email !!!
// Initialise PHPMailer for enjoyed email Confirmation !!!
$php_mailer = new \PHPMailer\PHPMailer\PHPMailer();
$mail = new \App\concern\Mail($php_mailer);
$model = new \App\Model\Auth\PasswordForgot();
$pdo = new \App\Model\PDO_Model();
$table = new \App\Table\Auth\PasswordForgot($pdo);

$forgot_password = new \App\Controller\Auth\PasswordForgotController($table, $model, $mail);
$forgot_password->NewReqPassword($_GET['token'], $_GET['password'], $_GET['password_confirm']);
