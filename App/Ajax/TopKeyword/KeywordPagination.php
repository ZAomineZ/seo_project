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
    if (isset($_POST['auth']) && $_POST['auth'] !== '') {
        dd('lol');
        try {
            if (isset($_POST['domain']) && $_POST['domain'] !== '') {
                $auth = \GuzzleHttp\json_decode($_POST['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_POST['cookie']) && $_POST['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_POST['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $ajax->VerifValueRegex($_POST['domain']);

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
                    $keyword->paginateKeywords($_POST['domain'], $_POST['page'], $_POST['offset']);
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
