<?php
require '../../vendor/autoload.php';

use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Volume;
use App\concern\Ajax;
use App\concern\Str_options;
use App\Controller\RankController;
use App\Model\PDO_Model;
use App\Model\RankModel;
use App\Model\Serp;
use App\Table\Rank;
use App\Table\Website;

$header = new Ajax();
$header->HeaderProtect();
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{
    // Get Params Body
    $id = htmlspecialchars($_POST['id']);
    $project = htmlspecialchars($_POST['project']);
    $website = htmlspecialchars($_POST['website']);
    $content = htmlspecialchars($_POST['content']);
    $keywords = $_POST['keywords'];
    if (isset($_POST['auth']) && $_POST['auth'] !== '') {
        try {
            if (isset($id) && !empty($id) && isset($project) && $project !== '' && isset($website) && $website !== '' && isset($content) && $content !== '' && isset($keywords)) {
                $auth = \GuzzleHttp\json_decode($_POST['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_POST['cookie']) && $_POST['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $header->VerifAuthMe((int)$auth->id, $_POST['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    // Instance Controller RankController For tools RankTo !!!
                    // Dependencies used : RankModel, RankTable, PDO_Model
                    $pdoModel = new PDO_Model();

                    $curl = new Curl_Api();
                    $str = new Str_options();
                    $dom = new DOMDocument();
                    $websiteTable = new Website($pdoModel);
                    $curlVolume = new Curl_Volume();
                    $serpModel = new Serp($curl, $str, $dom, $websiteTable, $header, $curlVolume);

                    $rankTable = new Rank($pdoModel);
                    $rankModel = new RankModel($rankTable, $serpModel);
                    $rankController = new RankController($rankModel, $rankTable);
                    $rankController->UpdateProject($id, $project, $website, $content, $keywords, $_POST['auth']);
                } else {
                    echo 'Invalid Token !!!';
                }
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
    die('Invalid Token !!!');
}
