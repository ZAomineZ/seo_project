<?php
require '../../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$pdo = new \App\Model\PDO_Model();
$table_campain = new \App\Table\Campain($pdo);
$goutte = new \Goutte\Client();
$campain_model = new \App\Model\Campain($table_campain, $goutte);
$ajax->HeaderProtect();

$auth = \GuzzleHttp\json_decode($_GET['auth']);

$campain = new \App\Controller\CampainController($table_campain, $campain_model);
$campain->DeleteItemCampain($_GET['id'], $_GET['slug'], $auth);
