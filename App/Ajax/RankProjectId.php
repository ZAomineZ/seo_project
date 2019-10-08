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
    $id = htmlentities($_GET['id']);
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($id) && !empty($id)) {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
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
                    $rankController->DataIdProject($id);
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
