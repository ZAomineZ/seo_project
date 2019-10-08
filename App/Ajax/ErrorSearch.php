<?php
require '../../vendor/autoload.php';

use App\Actions\Error_ajax;
use App\Actions\Json_File;
use App\Model\PDO_Model;
use App\Table\Website;
use Goutte\Client;

$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['domain']) && $_GET['domain'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);

                    $goutte = new Client();
                    $json = new Json_File($goutte);

                    $pdo = new PDO_Model();
                    $website = new Website($pdo);

                    $Actions = new Error_ajax($json, $website);
                    $Actions->Error_Search($_GET['domain']);
                } else {
                    echo 'Invalid Token !!!';
                }
            } else {
                echo 'Invalid Token !!!';
            }
        } catch (Exception $exception) {
            echo  'Invalid Token !!!';
        }
    } else {
        echo  'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}
