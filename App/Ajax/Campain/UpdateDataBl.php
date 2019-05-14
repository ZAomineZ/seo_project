<?php
require '../../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$pdo = new \App\Model\PDO_Model();
$table_campain = new \App\Table\Campain($pdo);
$goutte = new \Goutte\Client();
$campain_model = new \App\Model\Campain($table_campain, $goutte);
$ajax->HeaderProtect();

$campain = new \App\Controller\CampainController($table_campain, $campain_model);
$campain->UpdateDataBl($_GET['id'], $_GET['value'], $_GET['slug'], $_GET['bl']);
