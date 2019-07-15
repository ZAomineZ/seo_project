<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['domain']) && $_GET['domain'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $ajax->VerifValueRegex($_GET['domain']);

                    $goutte = new \Goutte\Client();
                    $crawl = new \Symfony\Component\DomCrawler\Crawler();
                    $pdo = new \App\Model\PDO_Model();
                    $table = new \App\Table\Website($pdo);
                    $bl = new \App\Actions\Json_File($goutte);
                    $curl = new \App\Actions\Url\Curl_Url();
                    $curl_keyword = new \App\Actions\Url\Curl_Keyword();
                    $str = new \App\concern\Str_options();
                    $top = new \App\Model\TopKeyword($table, $ajax);
                    $controller = new \App\Controller\TopKeywordController($curl_keyword, $crawl, $str, $bl, $top, $table, $ajax);
                    $model = new \App\Model\WebSite($goutte, $controller, $curl_keyword, $bl);


                    $format = new \Stillat\Numeral\Numeral();
                    $format->setLanguageManager(new \Stillat\Numeral\Languages\LanguageManager());

                    $website = new \App\Controller\WebSiteController($table, $bl, $model, $format, $curl, $curl_keyword, $controller, $ajax);
                    $website->WebSite($_GET['domain'], (int)$auth->id);
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
