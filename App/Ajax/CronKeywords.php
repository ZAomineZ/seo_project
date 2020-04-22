<?php
use App\Actions\Cron\CronKeywords;
use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Volume;
use App\concern\Ajax;
use App\concern\Str_options;
use App\Model\PDO_Model;
use App\Model\RankModel;
use App\Model\Serp;
use App\Table\Rank;
use App\Table\Website;

require_once '../../vendor/autoload.php';

    $remoteIp = '192.168.1.8';

    $header = new Ajax();

    $pdo = new PDO_Model();

    $curl = new Curl_Api();
    $str = new Str_options();
    $dom = new DOMDocument();
    $websiteTable = new Website($pdo);
    $curlVolume = new Curl_Volume();
    $serpModel = new Serp($curl, $str, $dom, $websiteTable, $header, $curlVolume);

    $rankTable = new Rank($pdo);
    $rankModel = new RankModel($rankTable, $serpModel);

    $cronController = new CronKeywords($rankTable, $rankModel);
    $cronController->CronKeywords();
