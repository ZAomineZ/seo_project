<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$curl = new \App\Actions\Url\Curl_Keyword();
$crawl = new \Symfony\Component\DomCrawler\Crawler();
$str = new \App\concern\Str_options();
$client = new \Goutte\Client();
$scrap = new \App\Actions\Json_File($client);
$pdo = new \App\Model\PDO_Model();
$table = new \App\Table\Website($pdo);
$model = new \App\Model\TopKeyword($table);
$ajax->HeaderProtect();

$keyword = new \App\Controller\TopKeywordController($curl, $crawl, $str, $scrap, $model, $table);
$keyword->CsvDownload($_GET['data']);
