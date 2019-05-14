<?php
require '../../vendor/autoload.php';
$header = new \App\concern\Ajax();
$goutte = new \Goutte\Client();
$str = new \App\concern\Str_options();
$pdo = new \App\Model\PDO_Model();
$table = new \App\Table\LinkProfile($pdo);
$profile = new \App\concern\Backlink_Profile($goutte);

$link = new \App\Model\LinkDomain($goutte, $str);
$header->HeaderProtect();

$link_profile = new \App\Controller\LinkProfileController($link, $goutte, $pdo, $table, $profile);
$link_profile->linkProfile($_GET['domain']);
