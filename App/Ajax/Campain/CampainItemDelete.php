<?php
require '../../../vendor/autoload.php';

use App\concern\Ajax;
use App\Controller\CampainController;
use App\Model\PDO_Model;
use App\Table\Campain as CampainTable;
use App\Model\Campain as CampainModel;
use Goutte\Client;

$ajax = new Ajax();
$ajax->HeaderProtect();

if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            $pdo = new PDO_Model();
            $table_campain = new CampainTable($pdo);
            $goutte = new Client();
            $campain_model = new CampainModel($table_campain, $goutte);

            $auth = \GuzzleHttp\json_decode($_GET['auth']);
            if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);

                $campain = new CampainController($table_campain, $campain_model);
                $campain->DeleteItemCampain($_GET['id'], $_GET['slug'], $auth);
            } else {
                echo 'Invalid Token !!!';
            }
        } catch (Exception $exception) {
            echo 'Invalid Token !!!';
        }
    } else {
        echo \GuzzleHttp\json_encode(['error' => 'Error Auth, reload the page !!!']);
    }
} else {
    die('Invalid Token !!!');
}
