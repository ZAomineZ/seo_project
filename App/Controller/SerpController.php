<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 11/03/19
 * Time: 14:01
 */

namespace App\Controller;

use App\Actions\Json_File;
use App\concern\Date_Format;
use App\concern\File_Params;
use App\Http\Controllers\Controller;
use App\Model\Serp;
use App\Table\Website;
use Stillat\Numeral\Numeral;

class SerpController extends Controller
{
    /**
     * @var Serp
     */
    private $serp;
    /**
     * @var Website
     */
    private $table;
    /**
     * @var Json_File
     */
    private $bl;
    /**
     * @var Numeral
     */
    private $format;
    /**
     * @var \App\Model\WebSite
     */
    private $web;
    /**
     * @var WebSiteController
     */
    private $webSiteController;

    /**
     * SerpController constructor.
     * @param Serp $serp
     * @param Website $table
     * @param Json_File $bl
     * @param Numeral $format
     * @param \App\Model\WebSite $web
     * @param WebSiteController $webSiteController
     */
    public function __construct(
        Serp $serp,
        Website $table,
        Json_File $bl,
        Numeral $format,
        \App\Model\WebSite $web,
        WebSiteController $webSiteController
    )
    {
        $this->serp = $serp;
        $this->table = $table;
        $this->bl = $bl;
        $this->format = $format;
        $this->web = $web;
        $this->webSiteController = $webSiteController;
    }

    /**
     * @param string $domain
     * @param $req
     * @return string
     */
    protected function DIRTrust (string $domain, $req) : string
    {
        $domain_up = str_replace('.', '-', $domain);
        if ($req !== false) {
            return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'datas' . DIRECTORY_SEPARATOR . 'website/' . $req->directory . DIRECTORY_SEPARATOR . $domain_up;
        }
        return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'datas' . DIRECTORY_SEPARATOR . 'website/' . date('Y/m') . DIRECTORY_SEPARATOR . $domain_up;
    }

    /**
     * @param string $domain
     * @param $req
     * @param $token
     * @return string
     * @throws \Exception
     */
    protected function FILETrust (string $domain, $req, $token = '') : string
    {
        $domain_up = str_replace('.', '-', $domain);
        if ($req !== false) {
            return $this->DIRTrust($domain, $req) . DIRECTORY_SEPARATOR . $domain_up . '-' . date('Y-m-d') . '-' . $req->token . '.json';
        }
        return $this->DIRTrust($domain, $req) . DIRECTORY_SEPARATOR . $domain_up . '-' . date('Y-m-d') . '-' . $token . '.json';
    }

    /**
     * @param string $domain
     * @param $req
     * @param string $token
     * @return string
     */
    protected function FileDashStat (string $domain, $req, $token = '') : string
    {
        if ($req !== false) {
            return $this->DIRTrust($domain, $req) . DIRECTORY_SEPARATOR . 'dash-stats' . '-' . $req->token . '.json';
        }
        return $this->DIRTrust($domain, $req) . DIRECTORY_SEPARATOR . 'dash-stats' . '-' . $token . '.json';
    }

    /**
     * @param string $domain
     * @param null $option
     * @return string|null
     * @throws \Exception
     */
    protected function JsonWebsite (string $domain, $option = null) : ?string
    {
        return $this->webSiteController->getJsonWebSite($domain, $option);
    }

    /**
     * @param string $domain
     * @param bool $first
     * @param string|null $file
     * @param string|null $dir
     * @return string
     * @throws \Exception
     */
    protected function JsonReferringWeb (string $domain, $first = false, string $file = null, string $dir = null) : string
    {
        return $this->webSiteController->getJsonReferringWeb($domain, $first, $file, $dir);
    }

    /**
     * @param string $domain
     * @return mixed
     * @throws \Exception
     */
    private function TrustRankScore (string $domain)
    {
        $req = $this->table->SelectToken($domain);
        if ($req !== false) {
            if (is_file($this->FILETrust($domain, $req))) {
                return File_Params::OpenFile($this->FILETrust($domain, $req), $this->DIRTrust($domain, $req));
            } else {
                $filter = $this->web->FilterRank($domain);
                $json = $this->web->JsonReturn($filter);
                File_Params::CreateParamsFile($this->FILETrust($domain, $req), $this->DIRTrust($domain, $req), $this->JsonWebsite($domain, $json), TRUE);
                File_Params::UpdateFile($this->FILEDashStat($domain, $req), $this->DIRTrust($domain, $req), $this->JsonReferringWeb($domain, false, $this->FILETrust($domain, $req), $this->DIRTrust($domain, $req)));
                return File_Params::OpenFile($this->FILETrust($domain, $req), $this->DIRTrust($domain, $req));
            }
        } else {
            if (!is_dir($this->DIRTrust($domain, $req))) {
                mkdir($this->DIRTrust($domain, $req), 0777, true);
                $file = $this->FILETrust($domain, $req, \App\Model\WebSite::Token());
                $request = $this->serp->ReqDataDomain($domain, File_Params::TokenImgExplode($file));
                $filter = $this->web->FilterRank($domain);
                $json = $this->web->JsonReturn($filter);
                File_Params::CreateParamsFile($this->FILETrust($domain, $req, $request->token), $this->DIRTrust($domain, $req), $this->JsonWebsite($domain, $json), TRUE);
                File_Params::CreateParamsFile($this->FileDashStat($domain, $req, $request->token), $this->DIRTrust($domain, $req), $this->JsonReferringWeb($domain, TRUE, $this->FILETrust($domain, $req, $request->token), $this->DIRTrust($domain, $req)), TRUE);
                return File_Params::OpenFile($this->FILETrust($domain, $request), $this->DIRTrust($domain, $request));
            }
        }
    }

    /**
     * @param string $domain
     * @throws \Exception
     */
    public function ResultTrust (string $domain)
    {
        $trust = $this->TrustRankScore($domain);
        echo \GuzzleHttp\json_encode([
            'trust_rank' => $trust->trust_rank,
            'score_rank' => $trust->score_rank,
            'ip_subnets' => $trust->ip_subnets
        ]);
    }

    /**
     * @param string $keyword
     * @param string $value
     * @param int $id
     */
    public function ResultTop (string $keyword, string $value, int $id)
    {
        // Replace keyword character by an espace
        // And we create the file html Google SERP !!!
        $keyword = str_replace('-', '%20', $keyword);
        $create_file = $this->serp->FileData($keyword, $value, $id);

        // We created now a new file with Curl_Volume class
        // If File Exist we retuned the result in JSON !!!
        // Statistic Volume And ...
        $DataFileVolume = $this->serp->FileVolumeData($keyword);

        // We return the result with DomCrawler in the body !!!
        $dom_result = $this->serp->DomResultSerp($create_file, $DataFileVolume, $keyword);
        echo \GuzzleHttp\json_encode($dom_result);
    }

    /**
     * @param string $keyword
     * @param array $state
     */
    public function ResultDate (string $keyword, array $state)
    {
        $state_json = \GuzzleHttp\json_decode($state[0]);
        $dom_result = $this->serp->DomResultSerpDate($state_json->StartDate, $state_json->EndDate, $keyword);
        echo \GuzzleHttp\json_encode($dom_result);
    }

    /**
     * @param string $keyword
     * @param string $value
     * @param int $id
     */
    public function ResultTopAndLose (string $keyword, string $value, int $id)
    {
        // We created File Data Rank to Serp !!!
        // We Ranked Data Url by Site Web
        $dir = $this->serp->DIRLoad($keyword);
        $rank_data = $this->serp->DataDateRank(scandir($dir), $dir);
        $create_file = $this->serp->FileData($keyword, $value, $id);

        // We created now a new file with Curl_Volume class
        // If File Exist we returned the result in JSON !!!
        // Statistic Volume And CPC
        $DataFileVolume = $this->serp->FileVolumeData($keyword);

        // We returned The result in th body FRONT !!!
        $dom_result = $this->serp->DomResultSerp($create_file, $DataFileVolume, $keyword);
        echo \GuzzleHttp\json_encode([
            'rank' => count($rank_data['rank']) > 7
                ? array_slice($rank_data['rank'], count($rank_data['rank']) - 2, count($rank_data['rank']))
                : $rank_data['rank'], "url" => $dom_result['url']
        ]);
    }

    /**
     * @param string $keyword
     * @param string $StartDate
     * @param string $EndDate
     */
    public function ResultTopAndLoseDate (string $keyword, string $StartDate, string $EndDate)
    {
        // Format date_start in the Format "Y-m-d" for recuperate file to the date !!!
        $date_start_format = Date_Format::DateFormatReq($StartDate, 'Y-m-d');
        $date_end_format = Date_Format::DateFormatReq($EndDate, 'Y-m-d');

        // Load File Date_start
        $file = $this->serp->DateFile($date_end_format, $this->serp->DIRLoad($keyword));
        $open = File_Params::OpenFile($file, $this->serp->DIRLoad($keyword), TRUE);

        // Load Data With Filter Crawler, we use Method $this->LoadReqCrawler() !!!
        echo \GuzzleHttp\json_encode($this->serp->LoadReqCrawler($open, $keyword, $date_start_format, $date_end_format, TRUE));
    }
}
