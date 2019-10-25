<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 15/04/19
 * Time: 20:23
 */

namespace App\Controller;

use App\Actions\Json_File;
use App\Actions\Url\Curl_Keyword;
use App\concern\Ajax;
use App\concern\File_Params;
use App\concern\Str_options;
use App\Model\TopKeyword;
use App\Table\Website;
use Symfony\Component\DomCrawler\Crawler;

class TopKeywordController
{
    /**
     * @var Curl_Keyword
     */
    private $curl;
    /**
     * @var Crawler
     */
    private $crawl;
    /**
     * @var Str_options
     */
    private $str;
    /**
     * @var Json_File
     */
    private $scrap;
    /**
     * @var TopKeyword
     */
    private $model;
    /**
     * @var Website
     */
    private $table;
    /**
     * @var Ajax
     */
    private $ajax;

    /**
     * TopKeywordController constructor.
     * @param Curl_Keyword $curl
     * @param Crawler $crawl
     * @param Str_options $str
     * @param Json_File $scrap
     * @param TopKeyword $model
     * @param Website $table
     */
    public function __construct(
        Curl_Keyword $curl,
        Crawler $crawl,
        Str_options $str,
        Json_File $scrap,
        TopKeyword $model,
        Website $table,
        Ajax $ajax)
    {
        $this->curl = $curl;
        $this->crawl = $crawl;
        $this->str = $str;
        $this->scrap = $scrap;
        $this->model = $model;
        $this->table = $table;
        $this->ajax = $ajax;
    }

    /**
     * @param array $data
     */
    public function CsvDownload(array $data)
    {
        $this->ColCsv("topkeyword.csv");
        foreach ($data as $dt) {
            $json = \GuzzleHttp\json_decode($dt);
            fputcsv(fopen('php://output', 'w'), [$json->domain,
                $json->traffic,
                $json->top_3,
                $json->top_4_10,
                $json->top_11_20,
                $json->top_21_50,
                $json->top_51_100
            ]);
        }
        fclose(fopen('php://output', 'w'));
        exit();
    }

    /**
     * @param string $filename
     * @return bool
     */
    private function ColCsv(string $filename) : bool
    {
        // Format the page Header in CSV !!!
        header('Content-Type: application/csv');
        header('Content-Disposition: attachment; filename=" ' . $filename . '');

        // FLUX php://output, open the file CSV in mode "w" !!!
        $handle = fopen('php://output', 'w');

        // Create the column TITLE CSV file with Function fputcsv !!!
        fputcsv($handle, ["Domain", "Traffic", "Top 3", "Top 4-10", "Top 11-20", "Top 21-50", "Top 51-100"]);

        return true;
    }

    /**
     * @param string $domain
     * @param int $id
     * @throws \Exception
     */
    public function ResultJson(string $domain, int $id)
    {
        // and Use Method SearchData !!!
        $data = [];
        $string = str_replace_last('-', '.', $domain);
        if (strstr($domain, '&')) {
            $explode = explode('&', $domain);
            if (count($explode) <= 5) {
                foreach ($explode as $ex) {
                    $ex = $this->str->searchDoubleString('.', $ex);
                    $this->ajax->VerifValueRegex($ex);
                    $string_ex = str_replace_last('-', '.', $ex);
                    $req_verif = $this->table->SelectToken($string_ex);
                    if ($req_verif && file_exists($this->DirAndFileCall($req_verif->token, str_replace('.', '-', $ex))['file'])) {
                        $data[] = $this->model->CreateJson(File_Params::OpenFile($this->DirAndFileCall($req_verif->token, str_replace('.', '-', $ex))['file'], $this->DirAndFileCall($req_verif->token, str_replace('.', '-', $ex))['dir']), $req_verif->domain);
                    } else {
                        // Recuperate Api_key and Export_Hash with DomCrawler
                        $html = $this->CrawlHtml($this->curl->Curl($string_ex));
                        $data[] = $this->DomainParam($string_ex, $html, $id);
                    }
                }
                echo \GuzzleHttp\json_encode($data);
            } else {
                echo \GuzzleHttp\json_encode("You have enjoyed more to 5 domain, while the limit 5 !!!");
            }
        } else {
            $req_verif = $this->table->SelectToken($string);
            if ($req_verif && file_exists($this->DirAndFileCall($req_verif->token, str_replace('.', '-', $domain))['file'])) {
                echo \GuzzleHttp\json_encode($this->model->CreateJson(File_Params::OpenFile($this->DirAndFileCall($req_verif->token, str_replace('.', '-', $domain))['file'], $this->DirAndFileCall($req_verif->token, str_replace('.', '-', $domain))['dir']), $domain));
            } else {
                // Recuperate Api_key and Export_Hash with DomCrawler
                $html = $this->CrawlHtml($this->curl->Curl($domain));
                $data = $this->DomainParam($string, $html, $id);
                echo \GuzzleHttp\json_encode($data);
            }
        }
    }

    /**
     * @param string $token
     * @param string $domain
     * @return array
     */
    private function DirAndFileCall(string $token, string $domain) : array
    {
        $dir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'datas' . DIRECTORY_SEPARATOR . 'website' . DIRECTORY_SEPARATOR . date('Y') . DIRECTORY_SEPARATOR . date('m') . DIRECTORY_SEPARATOR . $domain;
        return ['dir' => $dir, 'file' => $dir . DIRECTORY_SEPARATOR . 'traffic-' . $token . '.json'];
    }

    /**
     * Search all tag Script !!!
     * @param $response
     * @return array
     */
    public function CrawlHtml($response) : array
    {
        //Crawl the Response $response !!!
        $crawl = new Crawler($response);
        $filter = $crawl->filterXPath('//script')->each(function ($node) {
            return $node->html();
        });
        // Explode for recuperate the element required !!!
        $api_key = $this->SearchData($filter[$this->str->array_find(
            '"apiKey":', $filter)],
            '"apiKey":');
        $exportHashH = $this->SearchData(
            $filter[$this->str->array_find('"exportHashH":', $filter)],
            '"exportHashH":');
        if (isset($filter['55']) && !empty($filter['55'])) {
            $arrayExplode = explode('"exportHash":', $filter['55']);
            if (isset($arrayExplode[23])) {
                $exportHashHCut = $arrayExplode[23];
            } else {
                $arrayHash = explode('"exportHash":', $filter['57']);
                if (isset($arrayHash[1])) {
                    $exportHashHCut = $arrayHash[2];
                }
            }
        } else {
            $exportHashHCut = explode('"exportHash":', $filter['53'])[23];
        }
        $exportHashHTraffic = $this->str->strReplaceString(
            '"',
            '',
            explode(',', $exportHashHCut)[0]
        );
        return ["api_key" => $api_key, "export_hash" => $exportHashH, "export_hash_traffic" => $exportHashHTraffic];
    }

    /**
     * Method Created for Search $search to recuperate Element required !!!
     * @param string $filter
     * @param $search
     * @return mixed
     */
    private function SearchData(string $filter, $search)
    {
        if ($filter !== '') {
            $json = str_replace(' ', '', $this->str->str_replace_crawl($filter));
            $explode = explode($search, $json);
            if ($explode && isset($explode[1])) {
                $explode_key = explode(',', $explode[1]);
                return str_replace('"', '', $explode_key[0]);
            }
            return '';
        }
    }

    /**
     * @param string $domain
     * @param array $html
     * @param int $id
     * @return array
     * @throws \Exception
     */
    protected function DomainParam(string $domain, array $html, int $id) : array
    {
        // Create Url with the results to Method CrawlHtml !!!
        if (!is_string($html['api_key']) || !is_string($html['export_hash'])) {
            echo json_encode(['error' => 'Domain Name does not exist !!!']);
            die();
        }
        $domain = $this->str->searchDoubleStringDomainNotExist('.', $domain);

        $url = $this->UrlTraffic($domain, $html['api_key'], $html['export_hash']);

        // Scrap Url and Create a json with the result Traffic Keyword !!!
        // We create a file to save the results Traffic by Domain !!!
        $result = $this->model->FileTrafficByKeyword($this->scrap->ReqTrafficKeyword($url), $domain, $id);

        // Create Data with the result $result to render data in the JSON !!!
        // We are use the model TopKeyword with Method CreateJson !!!
        $data = $this->model->CreateJson($result, $domain);

        return $data;
    }

    /**
     * We create the Url to Crawl this one !!!
     * @param string $domain
     * @param string $key
     * @param string $exportHash
     * @return string
     */
    protected function UrlTraffic(string $domain, string $key, string $exportHash) : string
    {
        return "https://www.semrush.com/dpa/api?database=fr&export=json&key=$key&domain=$domain&display_hash=$exportHash&action=report&type=domain_rank_history&display_sort=dt_asc&_=1558542130813";
    }
}
