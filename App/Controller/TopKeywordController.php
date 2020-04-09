<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 15/04/19
 * Time: 20:23
 */

namespace App\Controller;

use App\Actions\Json_File;
use App\Actions\Url\Curl_CsvKeywords;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
use App\concern\Ajax;
use App\concern\File_Params;
use App\concern\Str_options;
use App\DataTraitement\KeywordsCsv;
use App\DataTraitement\KeywordsFilter;
use App\DataTraitement\TraitementCsv\DownloadCsv;
use App\DataTraitement\TraitementCsv\RenderCsvDomain;
use App\DataTraitement\TraitementString\DomainsData;
use App\Helpers\RenderMessage;
use App\Model\TopKeyword;
use App\Table\Website;
use League\Csv\Statement;
use Symfony\Component\DomCrawler\Crawler;

class TopKeywordController
{
    /**
     * @var MultiCurl_UrlTrafficAndKeyword
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
     * @param MultiCurl_UrlTrafficAndKeyword $curl
     * @param Crawler $crawl
     * @param Str_options $str
     * @param Json_File $scrap
     * @param TopKeyword $model
     * @param Website $table
     * @param Ajax $ajax
     */
    public function __construct(
        MultiCurl_UrlTrafficAndKeyword $curl,
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
        $downloadCsv = new DownloadCsv([
            "Domain",
            "Traffic",
            "Top 3",
            "Top 4-10",
            "Top 11-20",
            "Top 21-50",
            "Top 51-100"
        ], 'topkeyword.csv');
        $downloadCsv->CsvDownload($data);
    }

    /**
     * @param string $domains
     * @throws \League\Csv\Exception
     */
    public function CsvDownloadKeywords(string $domains)
    {
        $statementCsv = new Statement();
        $keywordCsv = new KeywordsCsv($this->table, $statementCsv);
        $domainsData = new DomainsData($keywordCsv, $this->table);

        $renderCsv = new RenderCsvDomain($domainsData);
        $renderCsv->renderCSV($domains);
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
                    if ($req_verif && file_exists($this->DirAndFileCall($req_verif, str_replace('.', '-', $ex))['file'])) {
                        $data = $this->model->CreateJson(
                            File_Params::OpenFile($this->DirAndFileCall($req_verif, str_replace('.', '-', $ex))['file'],
                                $this->DirAndFileCall($req_verif, str_replace('.', '-', $ex))['dir']), $req_verif->domain);
                    } else {
                        // Recuperate Api_key and Export_Hash with DomCrawler
                        $data = $this->DomainParam($string_ex, $id);
                    }
                }
                echo \GuzzleHttp\json_encode($data);
            } else {
                echo \GuzzleHttp\json_encode("You have enjoyed more to 5 domain, while the limit 5 !!!");
            }
        } else {
            $req_verif = $this->table->SelectToken($string);
            if ($req_verif && file_exists($this->DirAndFileCall($req_verif, str_replace('.', '-', $domain))['file'])) {
                echo \GuzzleHttp\json_encode(
                    $this->model->CreateJson(
                        File_Params::OpenFile($this->DirAndFileCall($req_verif, str_replace('.', '-', $domain))['file'],
                            $this->DirAndFileCall($req_verif, str_replace('.', '-', $domain))['dir']), $domain));
            } else {
                // Recuperate Api_key and Export_Hash with DomCrawler
                $data = $this->DomainParam($string, $id);
                echo \GuzzleHttp\json_encode($data);
            }
        }
    }

    /**
     * @param string $domain
     * @return mixed
     */
    protected function getResponseKeywords(string $domain)
    {
        $curlCSVKeywords = (new Curl_CsvKeywords())
            ->run($domain);
        return \GuzzleHttp\json_decode($curlCSVKeywords);
    }

    /**
     * @param string|null $domain
     * @return void
     * @throws \League\Csv\Exception
     */
    public function keywordsPaginate(?string $domain): void
    {
        $website = $this->table->SelectToken($domain);

        if ($website) {
            $response = $this->getResponseKeywords($domain);

            while ($response->status === 'wait' || $response->status === 'is_generate') {
                $response = $this->getResponseKeywords($domain);
            }
            if ($response && $response->status && $response->status === 'wait') {
                (new RenderMessage())->messageError('An problem is occurence !!!');
            }
            if ($response && $response->status && $response->status === 'error') {
                (new RenderMessage())->messageError('Any keywords enregistred on the Website');
            }

            $statementLeague = new Statement();
            [$keywords, $pages, $intervalElement, $paginationNumber] = (new KeywordsCsv($website, $statementLeague))
                ->all($response);

            echo \GuzzleHttp\json_encode([
                'success' => true,
                'data' => $keywords,
                'pages' => $pages,
                'currentPage' => 1,
                'intervalElement' => $intervalElement,
                'paginationNumber' => $paginationNumber
            ]);
            die();
        }

        (new RenderMessage())->messageError('This webiste isn\'t present in our database !!!');
    }

    /**
     * @param string|null $domain
     * @param int|null $page
     * @param int|null $offset
     * @param string $pageRemoveIndex
     * @throws \League\Csv\Exception
     */
    public function paginateKeywords(?string $domain, ?int $page, ?int $offset, string $pageRemoveIndex = 'false')
    {
        $website = $this->table->SelectToken($domain);

        if ($website) {
            $statement = new Statement();
            $keywordsCsv = new KeywordsCsv($website, $statement);
            [$keywords, $pages, $intervalElement, $paginationNumber] = $keywordsCsv->pagination($page, $offset, $pageRemoveIndex);

            echo \GuzzleHttp\json_encode([
                'success' => true,
                'data' => $keywords,
                'pages' => $pages,
                'currentPage' => $page,
                'intervalElement' => $intervalElement,
                'paginationNumber' => $paginationNumber
            ]);
            die();
        }

        echo \GuzzleHttp\json_encode([
            'success' => false,
            'error' => 'This webiste isn\'t present in our database !!!'
        ]);
        die();
    }

    /**
     * @param string $domain
     * @param string $filter
     * @throws \League\Csv\Exception
     */
    public function keywordsFilterByRank(string $domain, string $filter)
    {
        $website = $this->table->SelectToken($domain);

        if ($website) {
            $statement = new Statement();
            $filterKeyword = new KeywordsFilter($website, $statement);
            [$keywords, $pages, $intervalElement, $paginationNumber] = $filterKeyword->filterCsv($filter, 'Position');

            echo \GuzzleHttp\json_encode([
                'success' => true,
                'data' => $keywords,
                'pages' => $pages,
                'currentPage' => 1,
                'intervalElement' => $intervalElement,
                'paginationNumber' => $paginationNumber,
                'filter' => $filter,
                'filterKey' => 'Position'
            ]);
            die();
        }

        echo \GuzzleHttp\json_encode([
            'success' => false,
            'error' => 'This webiste isn\'t present in our database !!!'
        ]);
        die();
    }

    /**
     * @param string $domain
     * @param string $filter
     * @throws \League\Csv\Exception
     */
    public function keywordsFilterByVolume(string $domain, string $filter)
    {
        $website = $this->table->SelectToken($domain);

        if ($website) {
            $statement = new Statement();
            $filterKeyword = new KeywordsFilter($website, $statement);
            [$keywords, $pages, $intervalElement, $paginationNumber] = $filterKeyword->filterCsv($filter, 'Volume de recherche.');

            echo \GuzzleHttp\json_encode([
                'success' => true,
                'data' => $keywords,
                'pages' => $pages,
                'currentPage' => 1,
                'intervalElement' => $intervalElement,
                'paginationNumber' => $paginationNumber,
                'filter' => $filter,
                'filterKey' => 'Volume de recherche.'
            ]);
            die();
        }

        echo \GuzzleHttp\json_encode([
            'success' => false,
            'error' => 'This webiste isn\'t present in our database !!!'
        ]);
        die();
    }

    /**
     * @param string $domain
     * @param string $filter
     * @throws \League\Csv\Exception
     */
    public function keywordsFilterByUrl(string $domain, string $filter)
    {
        $website = $this->table->SelectToken($domain);

        if ($website) {
            $statement = new Statement();
            $filterKeyword = new KeywordsFilter($website, $statement);
            [$keywords, $pages, $intervalElement, $paginationNumber] = $filterKeyword->filterCsv($filter, 'URL');

            echo \GuzzleHttp\json_encode([
                'success' => true,
                'data' => $keywords,
                'pages' => $pages,
                'currentPage' => 1,
                'intervalElement' => $intervalElement,
                'paginationNumber' => $paginationNumber,
                'filter' => $filter,
                'filterKey' => 'URL'
            ]);
            die();
        }

        echo \GuzzleHttp\json_encode([
            'success' => false,
            'error' => 'This webiste isn\'t present in our database !!!'
        ]);
        die();
    }

    /**
     * @param string|null $domain
     * @param int|null $page
     * @param int|null $offset
     * @param string $filter
     * @param string $keyFilter
     * @param string $pageRemoveIndex
     * @throws \League\Csv\Exception
     */
    public function paginateKeywordsFilter(
        ?string $domain,
        ?int $page,
        ?int $offset,
        string $filter,
        string $keyFilter,
        string $pageRemoveIndex = 'false'
    )
    {
        $website = $this->table->SelectToken($domain);

        if ($website) {
            $statement = new Statement();
            $keywordsFilter = new KeywordsFilter($website, $statement);
            [$keywords, $pages, $intervalElement, $paginationNumber] = $keywordsFilter->paginationFilter($page, $offset, $filter, $keyFilter, $pageRemoveIndex);

            echo \GuzzleHttp\json_encode([
                'success' => true,
                'data' => $keywords,
                'pages' => $pages,
                'currentPage' => $page,
                'intervalElement' => $intervalElement,
                'paginationNumber' => $paginationNumber
            ]);
            die();
        }

        echo \GuzzleHttp\json_encode([
            'success' => false,
            'error' => 'This webiste isn\'t present in our database !!!'
        ]);
        die();
    }

    /**
     * @param $dataWebsite
     * @param string $domain
     * @return array
     */
    private function DirAndFileCall(object $dataWebsite, string $domain): array
    {
        $directoryDate = explode('/', $dataWebsite->directory);
        $dateM = $directoryDate[1] ?: date('m');
        $dateY = $directoryDate[0] ?: date('Y');

        $dir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'datas' . DIRECTORY_SEPARATOR . 'website' . DIRECTORY_SEPARATOR . $dateY . DIRECTORY_SEPARATOR . $dateM . DIRECTORY_SEPARATOR . $domain;
        return ['dir' => $dir, 'file' => $dir . DIRECTORY_SEPARATOR . 'traffic-' . $dataWebsite->token . '.json'];
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
     * @param int $id
     * @return array
     * @throws \Exception
     */
    protected function DomainParam(string $domain, int $id): array
    {
        $domain = $this->str->searchDoubleStringDomainNotExist('.', $domain);

        // Create Data new Traffic and Keyword to Domain Website !!!
        $dataTraffic = $this->dtTrafficKeyword($domain);

        // Scrap Url and Create a json with the result Traffic Keyword !!!
        // We create a file to save the results Traffic by Domain !!!
        $result = $this->model->FileTrafficByKeyword($dataTraffic, $domain, $id);

        // Create Data with the result $result to render data in the JSON !!!
        // We are use the model TopKeyword with Method CreateJson !!!
        $data = $this->model->CreateJson($result, $domain);

        return $data;
    }

    /**
     * @param string $domain
     * @return array
     */
    private function dtTrafficKeyword(string $domain): array
    {
        $curlKeyword = $this->curl->run($domain)['keyword'] ?: null;
        $curlTraffic = $this->curl->run($domain)['traffic'] ?: null;

        $keywordJson = $curlKeyword !== null ? \GuzzleHttp\json_decode($curlKeyword) : [];
        $trafficJson = $curlTraffic !== null ? \GuzzleHttp\json_decode($curlTraffic) : [];

        return [
            'traffic' => empty($trafficJson) ? [] : $trafficJson,
            'keywordAndTop' => empty($keywordJson) ? [] : $keywordJson
        ];
    }
}
