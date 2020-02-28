<?php
require '../../vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Volume;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
use App\concern\Ajax;
use App\concern\Backlink_Profile;
use App\concern\Str_options;
use App\Controller\LinkProfileController;
use App\Controller\SerpController;
use App\Controller\TopKeywordController;
use App\Controller\WebSiteController;
use App\Model\LinkDomain;
use App\Model\PDO_Model;
use App\Model\Serp;
use App\Model\TopKeyword;
use App\Table\LinkProfile;
use App\Table\Website as WebSiteTable;
use App\Model\WebSite as WebsiteModel;
use Goutte\Client;
use Stillat\Numeral\Languages\LanguageManager;
use Stillat\Numeral\Numeral;
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

                    $curl = new Curl_Api();
                    $curlVolume = new Curl_Volume();
                    $multicurl = new MultiCurl_UrlTrafficAndKeyword();

                    $str = new Str_options();
                    $dom = new DOMDocument();
                    $pdo = new PDO_Model();

                    $table = new WebSiteTable($pdo);
                    $model = new Serp($curl, $str, $dom, $table, $ajax, $curlVolume);

                    $goutte = new Client();
                    $bl = new Json_File($goutte);
                    $crawl = new Crawler();
                    $blProfile = new Backlink_Profile($goutte);

                    $top = new TopKeyword($table, $ajax);
                    $controller = new TopKeywordController($multicurl, $crawl, $str, $bl, $top, $table, $ajax);
                    $website = new WebsiteModel($goutte, $controller, $multicurl, $bl);

                    $format = new Numeral();
                    $format->setLanguageManager(new LanguageManager());

                    $linkTable = new LinkProfile($pdo);
                    $linkModel = new LinkDomain($goutte, $str);
                    $linkController = new LinkProfileController($linkModel, $goutte, $pdo, $linkTable, $blProfile);

                    $websiteController = new WebSiteController($table, $bl, $website, $format, $multicurl, $controller, $ajax, $linkTable, $linkController, $linkModel);

                    $serp = new SerpController($model, $table, $bl, $format, $website, $websiteController);
                    $serp->ResultTrust($_GET['domain']);
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
} else {
    die('Invalid Token !!!');
}


