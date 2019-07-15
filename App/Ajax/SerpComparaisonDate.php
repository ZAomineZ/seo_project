<?php
require '../../vendor/autoload.php';
$ajax = new \App\concern\Ajax();
$ajax->HeaderProtect();

if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{
    if (isset($_GET['auth']) && $_GET['auth'] !== '') {
        try {
            if (isset($_GET['keyword']) && $_GET['keyword'] !== '' && isset($_GET['StartDate']) && $_GET['StartDate'] !== '' && isset($_GET['EndDate']) && $_GET['EndDate'] !== '' && isset($_GET['value']) && $_GET['value'] !== '') {
                $auth = \GuzzleHttp\json_decode($_GET['auth']);
                if (isset($auth->id) && isset($auth->username) && isset($auth->email) && isset($_GET['cookie']) && $_GET['cookie'] !== '' && $auth->id !== '' && $auth->username !== '' && $auth->email !== '') {
                    $ajax->VerifAuthMe((int)$auth->id, $_GET['cookie'], ['username' => $auth->username, 'email' => $auth->email]);
                    $ajax->VerifValueRegex($_GET['keyword']);

                    $curl = new \App\Actions\Url\Curl_Api();
                    $str = new \App\concern\Str_options();
                    $dom = new DOMDocument();
                    $pdo = new \App\Model\PDO_Model();
                    $table = new \App\Table\Website($pdo);
                    $model = new \App\Model\Serp($curl, $str, $dom, $table, $ajax);
                    $goutte = new \Goutte\Client();
                    $bl = new \App\Actions\Json_File($goutte);
                    $crawl = new \Symfony\Component\DomCrawler\Crawler();
                    $curl_keyword = new \App\Actions\Url\Curl_Keyword();
                    $str = new \App\concern\Str_options();
                    $top = new \App\Model\TopKeyword($table, $ajax);
                    $controller = new \App\Controller\TopKeywordController($curl_keyword, $crawl, $str, $bl, $top, $table, $ajax);
                    $website = new \App\Model\WebSite($goutte, $controller, $curl_keyword, $bl);

                    $format = new \Stillat\Numeral\Numeral();
                    $format->setLanguageManager(new \Stillat\Numeral\Languages\LanguageManager());

                    $serp = new \App\Controller\SerpController($model, $table, $bl, $format, $website);
                    $serp->ResultTopAndLoseDate(\Illuminate\Support\Str::slug($_GET['keyword']), $_GET['StartDate'], $_GET['EndDate']);
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



