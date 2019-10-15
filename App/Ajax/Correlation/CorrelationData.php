<?php
require_once dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

use App\concern\Ajax;

$header = new Ajax();
$header->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

    // GET PARAMS BODY
    $project = htmlspecialchars($_GET['keyword']);

    if (isset($project) && !empty($project)) {
        if (isset($_GET['auth']) && $_GET['auth'] !== '') {
            try {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    // CODE ...
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
