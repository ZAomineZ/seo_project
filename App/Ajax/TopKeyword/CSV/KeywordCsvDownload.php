<?php
require dirname(__DIR__, 4) . '/vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
use App\concern\Ajax;
use App\concern\Str_options;
use App\Controller\TopKeywordController;
use App\ErrorCode\ErrorArgument;
use App\Model\PDO_Model;
use App\Model\TopKeyword;
use App\Table\Website;
use Goutte\Client;
use League\Csv\SyntaxError;
use Symfony\Component\DomCrawler\Crawler;

$ajax = new Ajax();
$ajax->HeaderProtect();

if (isset($_GET['auth']) && $_GET['auth'] !== '') {
    try {
        if (isset($_GET['domains']) && $_GET['domains'] !== '') {
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
                $website_table = new Website($pdo);

                $keyword = new TopKeywordController($multicurl, $crawl, $str, $scrap, $model, $website_table, $ajax);
                $keyword->CsvDownloadKeywords($_GET['domains']);
            } else {
                echo 'Invalid Token !!!';
            }
        } else {
            echo 'Invalid Token !!!';
        }
    } catch (Exception $exception) {
        dd($exception);
        if ($exception instanceof InvalidArgumentException) {
            ErrorArgument::errorCode();
        } elseif ($exception instanceof SyntaxError) {
            ErrorArgument::errorSyntaxCode($exception->getMessage());
        }
        echo 'Invalid Token !!!';
    }
} else {
    echo 'Invalid Token !!!';
}
