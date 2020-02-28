<?php
require '../../vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\Curl_Keyword;
use App\Actions\Url\Curl_Traffic;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
use App\concern\Str_options;
use App\Controller\TopKeywordController;
use App\Model\PDO_Model;
use App\Model\TopKeyword;
use App\Table\Website;
use Goutte\Client;
use Symfony\Component\DomCrawler\Crawler;

$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

if (isset($_GET['auth']) && $_GET['auth'] !== '') {
    try {
        if (isset($_GET['data']) && $_GET['data'] !== []) {
            $auth = \GuzzleHttp\json_decode($_GET['auth']);
            if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);

                $multicurl = new MultiCurl_UrlTrafficAndKeyword();
                $crawl = new Crawler();
                $str = new Str_options();
                $client = new Client();
                $scrap = new Json_File($client);
                $pdo = new PDO_Model();
                $table = new Website($pdo);
                $model = new TopKeyword($table, $ajax);

                $keyword = new TopKeywordController($multicurl, $crawl, $str, $scrap, $model, $table, $ajax);
                $keyword->CsvDownload($_GET['data']);
            } else {
                echo 'Invalid Token !!!';
            }
        } else {
            echo 'Invalid Token !!!';
        }
    } catch (Exception $exception) {
        echo 'Invalid Token !!!';
    }
} else {
    echo 'Invalid Token !!!';
}
