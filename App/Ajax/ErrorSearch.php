<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$goutte = new \Goutte\Client();
$json = new \App\Actions\Json_File($goutte);

$ajax->HeaderProtect();

$Actions = new \App\Actions\Error_ajax($json);
$Actions->Error_Search($_GET['domain']);
