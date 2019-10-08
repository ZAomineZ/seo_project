<?php
require '../../vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Keyword;
use App\Actions\Url\Curl_Url;
use App\Actions\Url\Curl_Volume;
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
use Illuminate\Support\Str;
use Stillat\Numeral\Languages\LanguageManager;
use Stillat\Numeral\Numeral;
use Symfony\Component\DomCrawler\Crawler;

$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['keyword']) && $_GET['keyword'] !== '' && isset($_GET['StartDate']) && $_GET['StartDate'] !== '' && isset($_GET['EndDate']) && $_GET['EndDate'] !== '' && isset($_GET['value']) && $_GET['value'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $ajax->VerifValueRegex($_GET['keyword']);

                    $curl = new Curl_Api();
                    $curlVolume = new Curl_Volume();
                    $curl_keyword = new Curl_Keyword();
                    $curlUrl = new Curl_Url();

                    $str = new Str_options();
                    $dom = new DOMDocument();
                    $pdo = new PDO_Model();

                    $table = new WebSiteTable($pdo);
                    $model = new Serp($curl, $str, $dom, $table, $ajax, $curlVolume);

                    $goutte = new Client();
                    $bl = new Json_File($goutte);
                    $crawl = new Crawler();
                    $str = new Str_options();
                    $blProfile = new Backlink_Profile($goutte);

                    $top = new TopKeyword($table, $ajax);
                    $controller = new TopKeywordController($curl_keyword, $crawl, $str, $bl, $top, $table, $ajax);
                    $website = new WebsiteModel($goutte, $controller, $curl_keyword, $bl);

                    $format = new Numeral();
                    $format->setLanguageManager(new LanguageManager());

                    $linkTable = new LinkProfile($pdo);
                    $linkModel = new LinkDomain($goutte, $str);
                    $linkController = new LinkProfileController($linkModel, $goutte, $pdo, $linkTable, $blProfile);

                    $websiteController = new WebSiteController($table, $bl, $website, $format, $curlUrl, $curl_keyword, $controller, $ajax, $linkTable, $linkController, $linkModel);

                    $serp = new SerpController($model, $table, $bl, $format, $website, $websiteController);
                    $serp->ResultTopAndLoseDate(Str::slug($_GET['keyword']), $_GET['StartDate'], $_GET['EndDate']);
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



