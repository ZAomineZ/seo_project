<?php
require '../../../vendor/autoload.php';

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

if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['domain']) && $_GET['domain'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $ajax->VerifValueRegex($_GET['domain']);

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
                    $keyword->keywordsFilterByVolume($_GET['domain'], $_GET['filter']);
                } else {
                    echo 'Invalid Token !!!';
                }
            } else {
                echo 'Invalid Token !!!';
            }
        } catch (Exception $exception) {
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
} else {
    die('Invalid Token !!!');
}
