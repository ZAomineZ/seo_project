<?php
require '../../vendor/autoload.php';

use App\concern\Backlink_Profile;
use App\concern\Str_options;
use App\Controller\LinkProfileController;
use App\ErrorCode\ErrorArgument;
use App\Model\LinkDomain;
use App\Model\PDO_Model;
use App\Table\LinkProfile;
use Goutte\Client;

$header = new \App\concern\Ajax();
$header->HeaderProtect();
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['domain']) && $_GET['domain'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $header->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $header->VerifValueRegex($_GET['domain']);

                    $goutte = new Client();
                    $str = new Str_options();
                    $pdo = new PDO_Model();
                    $table = new LinkProfile($pdo);
                    $profile = new Backlink_Profile($goutte);

                    $link = new LinkDomain($goutte, $str);

                    $link_profile = new LinkProfileController($link, $goutte, $pdo, $table, $profile);
                    $link_profile->linkProfile($_GET['domain']);
                } else {
                    echo 'Invalid Token !!!';
                }
            } else {
                echo 'Invalid Token !!!';
            }
        } catch (Exception $exception) {
            if ($exception instanceof InvalidArgumentException) {
                ErrorArgument::errorCode();
            }
            echo 'Invalid Token !!!';
        }
    } else {
        echo 'Invalid Token !!!';
    }
} else {
    die('Invalid Token !!!');
}




