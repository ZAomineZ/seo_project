<?php
require '../../vendor/autoload.php';
$goutte = new \Goutte\Client();
$crawl = new \Symfony\Component\DomCrawler\Crawler();
$pdo = new \App\Model\PDO_Model();
$table = new \App\Table\Website($pdo);
$bl = new \App\Actions\Json_File($goutte);
$curl = new \App\Actions\Url\Curl_Url();
$curl_keyword = new \App\Actions\Url\Curl_Keyword();
$str = new \App\concern\Str_options();
$top = new \App\Model\TopKeyword($table);
$controller = new \App\Controller\TopKeywordController($curl_keyword, $crawl, $str, $bl, $top, $table);
$model = new \App\Model\WebSite($goutte, $controller, $curl_keyword, $bl);

$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

$format = new \Stillat\Numeral\Numeral();
$format->setLanguageManager(new \Stillat\Numeral\Languages\LanguageManager());

$website = new \App\Controller\WebSiteController($table, $bl, $model, $format, $curl, $curl_keyword, $controller);
$website->WebSite($_GET['domain']);
