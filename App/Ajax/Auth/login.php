<?php
require '../../../vendor/autoload.php';

// Initialise Ajax Class for call Method HeaderProtect to Protect request Ajax !!!
$header = new \App\concern\Ajax();
$header->HeaderProtect();

// Initialise Register Model and Register Class use in the construct RegisterController Controller !!!
// Initialise too PDO_MODEL for REQUEST MYSQL !!!
$pdo_model = new \App\Model\PDO_Model();
$login = new \App\Model\Auth\LogIn();
$table = new \App\Table\Auth\LogIn($pdo_model);

// Request Method LogInData !!!
$auth = new \App\Controller\Auth\LogInController($login, $table);
$auth->LoginData($_GET['username'], $_GET['password']);
