<?php
require_once dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Volume;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
use App\concern\Ajax;
use App\concern\Backlink_Profile;
use App\concern\Str_options;
use App\Controller\CorrelationController;
use App\Controller\LinkProfileController;
use App\Controller\TopKeywordController;
use App\Controller\WebSiteController;
use App\Model\Correlation;
use App\Model\LinkDomain;
use App\Model\PDO_Model;
use App\Model\RankModel;
use App\Model\Serp;
use App\Model\TopKeyword;
use App\Model\WebSite;
use App\Table\LinkProfile;
use App\Table\Rank;
use App\Table\Website as WebsiteTable;
use Goutte\Client;
use Stillat\Numeral\Languages\LanguageManager;
use Stillat\Numeral\Numeral;
use Symfony\Component\DomCrawler\Crawler;

$header = new Ajax();
$header->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

    // GET PARAMS BODY
    $keyword = htmlspecialchars($_POST['keyword']);

    if (isset($keyword) && !empty($keyword)) {
        if (isset($_POST['auth']) && $_POST['auth'] !== '') {
            try {
                $auth = \GuzzleHttp\json_decode($_POST['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_POST['cookie']) && $_POST['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $header->VerifAuthMe((int)$auth->id, $_POST['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    // Dependencies used: Correlation Model, Str_Options, WebSite Controller !!!

                    // Dependencies for WebsiteController :
                    $pdoModel = new PDO_Model();
                    $strOptions = new Str_options();
                    $goutte = new Client();
                    $jsonFile = new Json_File($goutte);
                    $website = new WebsiteTable($pdoModel);

                    // Dependencies for TopControllerKeyword :
                    $multicurl = new MultiCurl_UrlTrafficAndKeyword();
                    $crawler = new Crawler();
                    $topControllerModel = new TopKeyword($website, $header);

                    // TopControllerKeyword
                    $topControllerKeyword = new TopKeywordController(
                        $multicurl,
                        $crawler,
                        $strOptions,
                        $jsonFile,
                        $topControllerModel,
                        $website,
                        $header
                    );

                    // Dependencies for LinkController !!!
                    $linkModel = new LinkDomain($goutte, $strOptions);
                    $linkTable = new LinkProfile($pdoModel);
                    $blProfile = new Backlink_Profile($goutte);

                    // LinkController !!!
                    $linkController = new LinkProfileController(
                        $linkModel,
                        $goutte,
                        $pdoModel,
                        $linkTable,
                        $blProfile
                    );

                    // WebSite Dependencies !!!
                    $formatNumeral = new Numeral();
                    $formatNumeral->setLanguageManager(new LanguageManager());
                    $websiteModel = new WebSite($goutte, $topControllerKeyword, $multicurl, $jsonFile);
                    $websiteController = new WebSiteController(
                        $website,
                        $jsonFile,
                        $websiteModel,
                        $formatNumeral,
                        $multicurl,
                        $topControllerKeyword,
                        $header,
                        $linkTable,
                        $linkController,
                        $linkModel
                    );

                    // SerpModel and this Dependencies :
                    $curlApi = new Curl_Api();
                    $curlVolume = new Curl_Volume();
                    $domDocument = new DOMDocument();
                    $serp = new Serp(
                        $curlApi,
                        $strOptions,
                        $domDocument,
                        $website,
                        $header,
                        $curlVolume
                    );

                    // RankModel and This dependencies :
                    $rankTable = new Rank($pdoModel);
                    $rankModel = new RankModel($rankTable, $serp);


                    // Controller Correlation for send Data Result !!!
                    $correlation = new Correlation($websiteController, $website, $websiteModel);
                    $correlationController = new CorrelationController($correlation, $strOptions, $rankModel);
                    $correlationController->getDataWithWebsites($_POST['websiteData'], $keyword, $auth);
                } else {
                    echo 'Invalid Token !!!';
                }
            } catch (Exception $exception) {
                dd($exception);
                echo 'Invalid Token !!!';
            }
        } else {
            echo 'Invalid Token !!!';
        }
    } else {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
