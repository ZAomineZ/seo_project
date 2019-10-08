<?php
require '../../vendor/autoload.php';

use App\Actions\Json_File;
use App\Actions\Url\Curl_Backlink;
use App\Actions\Url\Curl_Keyword;
use App\Actions\Url\Curl_Url;
use App\concern\Ajax;
use App\concern\Backlink_Profile;
use App\concern\Str_options;
use App\Controller\LinkProfileController;
use App\Controller\TopKeywordController;
use App\Controller\WebSiteController;
use App\Model\LinkDomain;
use App\Model\PDO_Model;
use App\Model\TopKeyword;
use App\Table\LinkProfile;
use App\Table\Website as WebsiteTable;
use App\Model\WebSite as WebsiteModel;
use Goutte\Client;
use Stillat\Numeral\Languages\LanguageManager;
use Stillat\Numeral\Numeral;
use Symfony\Component\DomCrawler\Crawler;

$ajax = new Ajax();
$ajax->HeaderProtect();
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['domain']) && $_GET['domain'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $ajax->VerifValueRegex($_GET['domain']);

                    $goutte = new Client();
                    $crawl = new Crawler();

                    $pdo = new PDO_Model();
                    $table = new WebsiteTable($pdo);
                    $linkTable = new LinkProfile($pdo);

                    $bl = new Json_File($goutte);
                    $curl = new Curl_Url();
                    $curl_keyword = new Curl_Keyword();

                    $str = new Str_options();
                    $top = new TopKeyword($table, $ajax);

                    $controller = new TopKeywordController($curl_keyword, $crawl, $str, $bl, $top, $table, $ajax);
                    $model = new WebsiteModel($goutte, $controller, $curl_keyword, $bl);

                    $format = new Numeral();
                    $format->setLanguageManager(new LanguageManager());

                    $backlink_profile = new Backlink_Profile($goutte);
                    $linkDomain = new LinkDomain($goutte, $str);
                    $linkController = new LinkProfileController($linkDomain, $goutte, $pdo, $linkTable, $backlink_profile);

                    $website = new WebSiteController($table, $bl, $model, $format, $curl, $curl_keyword, $controller, $ajax, $linkTable, $linkController, $linkDomain);
                    $website->WebSite($str->searchDoubleString('.', $_GET['domain']), (int)$auth->id);
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
