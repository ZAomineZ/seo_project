<?php
require '../../vendor/autoload.php';

use App\Actions\Suggest_Data;
use App\Controller\SuggestController;
use Goutte\Client;

$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

if (isset($_GET['auth']) && $_GET['auth'] !== '') {
    try {
        if (isset($_GET['keyword']) && $_GET['keyword'] !== '' && isset($_GET['value']) && $_GET['value'] !== '') {
            $auth = \GuzzleHttp\json_decode($_GET['auth']);
            if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                $ajax->VerifValueRegex($_GET['keyword']);

                $goutte = new Client();
                $json = new Suggest_Data($goutte);

                $suggest = new SuggestController($json);
                $suggest->suggestCSV($_GET);
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
