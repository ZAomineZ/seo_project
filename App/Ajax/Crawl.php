<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$goutte = new \Goutte\Client();
$crawl_model = new \App\Model\Crawl();
$ajax->HeaderProtect();

$crawl = new \App\Controller\CrawlController($goutte, $crawl_model);
$crawl->ResultCrawl($_GET['url']);
