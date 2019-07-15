<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $goutte = new \Goutte\Client();
    $crawl_model = new \App\Model\Crawl();

    $crawl = new \App\Controller\CrawlController($goutte, $crawl_model);
    $crawl->ResultCrawl($_GET['url']);
} else {
    die('Invalid Token !!!');
}
