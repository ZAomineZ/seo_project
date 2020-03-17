<?php
require '../../vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Volume;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
use App\Actions\Url\MultiCurl_VolumeResult;
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
use App\Table\Website as WebsiteTable;
use App\Model\WebSite as WebsiteModel;
use Goutte\Client;
use Stillat\Numeral\Languages\LanguageManager;
use Stillat\Numeral\Numeral;
use Symfony\Component\DomCrawler\Crawler;

$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['keyword']) && $_GET['keyword'] !== '' && isset($_GET['value']) && $_GET['value'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $ajax->VerifValueRegex($_GET['keyword']);

                    $curl = new Curl_Api();
                    $curlVolume = new Curl_Volume();
                    $multiCurl = new MultiCurl_UrlTrafficAndKeyword();

                    $str = new Str_options();
                    $dom = new DOMDocument();
                    $pdo = new PDO_Model();

                    $table = new WebsiteTable($pdo);
                    $model = new Serp($curl, $str, $dom, $table, $ajax, $curlVolume);

                    $goutte = new Client();
                    $bl = new Json_File($goutte);
                    $blProfile = new Backlink_Profile($goutte);
                    $crawl = new Crawler();

                    $top = new TopKeyword($table, $ajax);
                    $controller = new TopKeywordController($multiCurl, $crawl, $str, $bl, $top, $table, $ajax);
                    $website = new WebsiteModel($goutte, $controller, $multiCurl, $bl);

                    $linkTable = new LinkProfile($pdo);
                    $linkModel = new LinkDomain($goutte, $str);
                    $linkController = new LinkProfileController($linkModel, $goutte, $pdo, $linkTable, $blProfile);

                    $format = new Numeral();
                    $format->setLanguageManager(new LanguageManager());

                    $websiteController = new WebSiteController($table, $bl, $website, $format, $multiCurl, $controller, $ajax, $linkTable, $linkController, $linkModel);

                    $multiCurl = new MultiCurl_VolumeResult();
                    $serp = new SerpController($model, $table, $bl, $format, $website, $websiteController, $multiCurl);
                    $serp->volumeSearchResult($_GET['keyword']);
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

