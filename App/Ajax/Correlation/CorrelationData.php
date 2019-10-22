<?php
require_once dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Keyword;
use App\Actions\Url\Curl_Url;
use App\Actions\Url\Curl_Volume;
use App\concern\Ajax;
use App\concern\Backlink_Profile;
use App\concern\Str_options;
use App\Controller\CorrelationController;
use App\Controller\LinkProfileController;
use App\Controller\RankController;
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
    $keyword = htmlspecialchars($_GET['keyword']);

    if (isset($keyword) && !empty($keyword)) {
        // Keyword Regex !!!
        $header->regexKeyword($keyword);
        if (isset($_GET['auth']) && $_GET['auth'] !== '') {
            try {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $header->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    // Dependencies used: Correlation Model, Str_Options, WebSite Controller !!!

                    // Dependencies for WebsiteController :
                    $pdoModel = new PDO_Model();
                    $strOptions = new Str_options();
                    $goutte = new Client();
                    $jsonFile = new Json_File($goutte);
                    $website = new WebsiteTable($pdoModel);

                    // Dependencies for TopControllerKeyword :
                    $curlKeyword = new Curl_Keyword();
                    $curlUrl = new Curl_Url();
                    $crawler = new Crawler();
                    $topControllerModel = new TopKeyword($website, $header);

                    // TopControllerKeyword
                    $topControllerKeyword = new TopKeywordController(
                        $curlKeyword,
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
                    $websiteModel = new WebSite($goutte, $topControllerKeyword, $curlKeyword, $jsonFile);
                    $websiteController = new WebSiteController(
                        $website,
                        $jsonFile,
                        $websiteModel,
                        $formatNumeral,
                        $curlUrl,
                        $curlKeyword,
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
                    $correlationController->dataCorrelation($keyword, $auth);
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
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
