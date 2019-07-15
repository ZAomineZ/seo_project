<?php
require '../../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            $pdo = new \App\Model\PDO_Model();
            $table_campain = new \App\Table\Campain($pdo);
            $goutte = new \Goutte\Client();
            $campain_model = new \App\Model\Campain($table_campain, $goutte);

            $auth = \GuzzleHttp\json_decode($_GET['auth']);
            if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);

                $campain = new \App\Controller\CampainController($table_campain, $campain_model);
                $campain->UpdateDataBl($_GET['id'], $_GET['value'], $_GET['slug'], $_GET['bl'], $auth);
            } else {
                echo 'Invalid Token !!!';
            }
        } catch (Exception $exception) {
            echo 'Invalid Token !!!';
        }
    } else {
        echo json_encode(['error' => 'Error Auth, reload the page !!!']);
    }
} else {
    die('Invalid Token !!!');
}
