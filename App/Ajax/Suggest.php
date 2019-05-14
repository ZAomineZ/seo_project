<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$goutte = new \Goutte\Client();
$json = new \App\Actions\Suggest_Data($goutte);
$ajax->HeaderProtect();

$suggest = new \App\Controller\SuggestController($json);
$suggest->JsonData($_GET['keyword']);
