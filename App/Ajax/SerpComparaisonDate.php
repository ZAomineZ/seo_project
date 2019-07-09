<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

$curl = new \App\Actions\Url\Curl_Api();
$str = new \App\concern\Str_options();
$dom = new DOMDocument();
$pdo = new \App\Model\PDO_Model();
$table = new \App\Table\Website($pdo);
$model = new \App\Model\Serp($curl, $str, $dom, $table);
$goutte = new \Goutte\Client();
$bl = new \App\Actions\Json_File($goutte);
$crawl = new \Symfony\Component\DomCrawler\Crawler();
$curl_keyword = new \App\Actions\Url\Curl_Keyword();
$str = new \App\concern\Str_options();
$top = new \App\Model\TopKeyword($table);
$controller = new \App\Controller\TopKeywordController($curl_keyword, $crawl, $str, $bl, $top);
$website = new \App\Model\WebSite($goutte, $controller, $curl_keyword, $bl);

$format = new \Stillat\Numeral\Numeral();
$format->setLanguageManager(new \Stillat\Numeral\Languages\LanguageManager());

$serp = new \App\Controller\SerpController($model, $table, $bl, $format, $website);
$serp->ResultTopAndLoseDate($_GET['keyword'], $_GET['StartDate'], $_GET['EndDate']);



