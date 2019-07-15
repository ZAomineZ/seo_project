<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['domain']) && $_GET['domain'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);

                    $goutte = new \Goutte\Client();
                    $json = new \App\Actions\Json_File($goutte);

                    $Actions = new \App\Actions\Error_ajax($json);
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
