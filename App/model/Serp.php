<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 25/04/19
 * Time: 01:15
 */

namespace App\Model;

use App\Actions\Url\Curl_Api;
use App\Actions\Url\Curl_Volume;
use App\Actions\Url\MultiCurlKeywordConcurrent;
use App\concern\Ajax;
use App\concern\Date_Format;
use App\concern\File_Params;
use App\concern\Str_options;
use App\DataTraitement\CrawlerDataSerp;
use App\DataTraitement\FileData;
use App\DataTraitement\SerpData\DataSerp;
use DOMDocument;
use Symfony\Component\DomCrawler\Crawler;

class Serp
{
    /**
     * @var Curl_Api
     */
    private $curl;
    /**
     * @var Str_options
     */
    private $str;
    /**
     * @var DOMDocument
     */
    private $dom;
    /**
     * @var \App\Table\Website
     */
    private $table;
    /**
     * @var Ajax
     */
    private $ajax;
    /**
     * @var Curl_Volume
     */
    private $curl_Volume;

    /**
     * Serp constructor.
     * @param Curl_Api $curl
     * @param Str_options $str
     * @param DOMDocument $dom
     * @param \App\Table\Website $table
     * @param Ajax $ajax
     * @param Curl_Volume $curl_Volume
     */
    public function __construct(
        Curl_Api $curl,
        Str_options $str,
        DOMDocument $dom,
        \App\Table\Website $table,
        Ajax $ajax,
        Curl_Volume $curl_Volume
    )
    {
        $this->curl = $curl;
        $this->str = $str;
        $this->dom = $dom;
        $this->table = $table;
        $this->ajax = $ajax;
        $this->curl_Volume = $curl_Volume;
    }

    /**
     * @var array
     */
    private static $dataSerp = [
        33.25, 16.63, 10.08, 6.68, 4.71,
        3.47, 2.62, 2.07, 1.67, 1.39,
        1.27, 1.52, 1.73, 1.56, 1.38,
        1.26, 1.14, 1.05, 1, 0.9
    ];

    /**
     * @param int $volume
     * @return array
     */
    public static function DataRestultVolume(int $volume): array
    {
        $data = [];
        for ($i = 0; $i < count(self::$dataSerp); $i++) {
            $data[$i]['volume'] = ($volume * self::$dataSerp[$i] / 100);
        }
        return $data;
    }

    /**
     * @param $data
     * @return array|string
     */
    public static function VolumeData($data)
    {
        $data = \GuzzleHttp\json_decode($data);
        if (isset($data->result_code) && $data->result_code === '200') {
            if (isset($data->statistics[0]->Error)) {
                return [
                    'error' => $data->statistics[0]->Error,
                    'keyword' => $data->statistics[0]->Keyword,
                    'result' => self::DataRestultVolume(100, 0)
                ];
            }
            $volume = $data->statistics[0]->{'Search Volume'};
            $cpc = $data->statistics[0]->CPC;
            return [
                'volume' => $data->statistics[0]->{'Search Volume'},
                'cpc' => $data->statistics[0]->CPC,
                'keyword' => $data->statistics[0]->Keyword,
                'result' => self::DataRestultVolume($volume, $cpc)
            ];
        } else {
            if (isset($data)) {
                if (isset($data->error)) {
                    return [
                        'error' => $data->error,
                        'keyword' => isset($data->keyword) ? $data->keyword : '',
                        'result' => self::DataRestultVolume(100, 0)
                    ];
                } elseif (isset($data->keyword)) {
                    $volume = $data->google_volume;
                    $cpc = $data->cpc;

                    if (strpos($volume, ',') !== false || strpos($cpc, ',') !== false) {
                        $volume = (int)str_replace(',', '', $volume);
                        $cpc = (float)str_replace(',', '', $cpc);
                    }

                    if (!is_float($cpc)) {
                        $cpc = 0;
                    }

                    return [
                        'volume' => $volume,
                        'cpc' => $cpc,
                        'keyword' => $data->keyword,
                        'result' => self::DataRestultVolume($volume, $cpc)
                    ];
                }
            }
        }
        return \GuzzleHttp\json_encode(['error' => 'Error Quotas']);
    }

    /**
     * @param string $value
     * @return string
     */
    public function CreateUrlG(string $value): string
    {
        return "https://www.google.com/search?num=100&pws=0&client=ms-google-coop&q=$value&oq=$value&gl=fr&hl=fr";
    }

    /**
     * @param string $url
     * @return string
     */
    public function CreateUrlScrapperApi(string $url): string
    {
        return "http://api.scraperapi.com/?api_key=YOUR_KEY&url=$url";
    }

    /**
     * @param string $keyword
     * @return bool
     */
    public function existFileVolume(string $keyword): bool
    {
        $directory = $this->DIRLoad(str_replace('%20', '-', $keyword));
        if (file_exists($directory . 'insights.json')) {
            return true;
        }
        return false;
    }

    /**
     * @param string $keyword
     * @return mixed
     */
    public function RenderVolume(string $keyword)
    {
        $directory = $this->DIRLoad(str_replace('%20', '-', $keyword));
        if ($this->existFileVolume($keyword)) {
            return File_Params::OpenFile($directory . 'insights.json', $directory, TRUE);
        }
        return null;
    }

    /**
     * Method Sleep allowing to sleeping our Request !!!
     * @param $start
     * @param $end
     * @return int
     */
    private function SleepApi($start, $end): int
    {
        return sleep(rand($start, $end));
    }

    /**
     * @param $req_file
     * @param string $keyword
     * @param string $date_start
     * @param string $date_end
     * @param $dataVolume
     * @param bool $compar
     * @return array
     */
    public function LoadReqCrawler($req_file, string $keyword, string $date_start, string $date_end, $dataVolume, bool $compar = false): array
    {
        // Load Html to the Req $req_file
        $load = $this->LoadHtmlDom($req_file);
        $crawler = new Crawler($load);

        // Filter Data need !!!
        // Description Data !!!
        $serp_desc = $crawler->filter('div.r > a > h3')->each(function ($node) {
            return $node->html();
        });

        // Url Data !!!
        $serp_url = $crawler->filter('div.r > a')->extract(array('href'));

        // Data Update Filter Array
        $url = $this->SerpNoUrl($serp_url);
        $desc = $this->SerpDesc($serp_desc, $url);

        // Data Volume for the 20 first results !!!
        $dataVolume = \GuzzleHttp\json_decode($dataVolume);
        $dataVl = ['volume' => self::DataRestultVolume($dataVolume->{'volume'})];

        // Rank and Date Data !!!
        $data = $this->DataDateRank(scandir($this->DIRLoad(str_replace('%20', '-', $keyword))), $this->DIRLoad(str_replace('%20', '-', $keyword)), $date_start, $date_end);
        if ($compar) {
            return ["url" => $url, "rank" => $data['rank']];
        }

        // Feature Icon !!!
        $features = (new CrawlerDataSerp($crawler))->dataCrawlerSearch([
            'e2BEnf U7izfe' =>
                [
                    'name' => ['Vidéos', 'À la une', 'Recettes'],
                    'balise' => 'h3'
                ],
            'jOmXmb rhsg4' =>
                [
                    'name' => ['Résultats Shopping'],
                    'balise' => 'h3'
                ],
            'kp-header' => 'Knowledge Panel',

            'a-no-hover-decoration' =>
                [
                    'name' => ['Signaler des images inappropriées'],
                    'balise' => 'a'
                ],
            'ads-visurl' => [
                'name' => ['Annonce'],
                'balise' => 'span'
            ],

            'ifM9O' => [
                'name' => ['Autres questions posées'],
                'balise' => 'h2'
            ],
            'nrgt' => [
                'name' => ['Site Links'],
                'balise' => 'table'
            ],
            'Vjjrtb' => 'Knowledge Card',

            'H93uF' => [
                'name' => ['Autres adresses'],
                'balise' => 'a'
            ],
            'UCu2Hb' => [
                'name' => ['Image map'],
                'balise' => 'img'
            ],
            'a' => [
                'name' => ['À propos des extraits optimisés'],
                'balise' => 'a'
            ]
        ]);

        return [
            "description" => $this->descAntiBasise($desc),
            "url" => $this->FilterArray($url, function ($url) {
                return $url !== null;
            }),
            "date_format" => $this->DateFormat($data['date_format']),
            "date" => $data['date'],
            "rank" => $data['rank'],
            "serpFeature" => $features,
            "dataVolume" => $dataVl
        ];
    }

    /**
     * @param string $domain
     * @param string $token
     * @return mixed|null
     */
    public function ReqDataDomain(string $domain, string $token)
    {
        $insert = $this->table->InsertDomain([
            'domain' => $domain,
            'token' => $token,
            'date' => date("Y-m-d H:i:s"),
            'directory' => date("Y") . '/' . date("m")
        ]);
        if ($insert) {
            return $this->table->SelectToken($domain);
        }
        return null;
    }

    /**
     * @param string $dir
     * @return string
     */
    public function FILELoad(string $dir): string
    {
        $file = $dir . date("Y-m-d") . '.html';
        return $file;
    }

    /**
     * @param string $name
     * @return string
     */
    public function DIRLoad(string $name): string
    {
        $letter = $this->str->str_substr($name, 0, 1);
        $letter_3 = $this->str->str_substr($name, 0, 3);
        return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'datas' . DIRECTORY_SEPARATOR . 'serptime/' . $letter . DIRECTORY_SEPARATOR . $letter_3 . DIRECTORY_SEPARATOR . $name . DIRECTORY_SEPARATOR;
    }

    /**
     * @param string $date
     * @param string $dir
     * @return string
     */
    public function DateFile(string $date, string $dir): string
    {
        return $dir . $date . '.html';
    }

    /**
     * @param string $keyword
     * @param string $value
     * @param int|null $id
     * @param bool $concurrentResquest
     * @param bool $noCheckedRateUSer
     * @return mixed
     */
    public function FileData(
        string $keyword,
        string $value,
        int $id = null,
        bool $concurrentResquest = false,
        bool $noCheckedRateUser = false
    )
    {
        $name = str_replace('%20', '-', $keyword);

        if (!empty($name)) {
            if (!is_dir($this->DIRLoad($name))) {
                $file = $this->FILELoad($this->DIRLoad($name));
                $mkdir = mkdir($this->DIRLoad($name), 0777, true);
                if ($mkdir && !file_exists($file)) {
                    if (!is_null($id) && $noCheckedRateUser !== true) {
                        $this->ajax->UserRate((int)$id);
                    }
                    $data = $this->ScrapData($value, $concurrentResquest);

                    if ($concurrentResquest) {
                        return [$data, $name];
                    }
                    if ($data) {
                        if (strstr($data, '<!doctype html>') !== false && strstr($data, '// Google Inc.') !== false) {
                            File_Params::CreateParamsFile($file, $this->DIRLoad($name), $data, TRUE);
                        } else {
                            $new_data = $this->ScrapData($value);
                            File_Params::CreateParamsFile($file, $this->DIRLoad($name), $new_data, TRUE);
                        }

                        return $this->getSerpDoctype($name);
                    }
                }
            } else {
                if (!file_exists($this->FILELoad($this->DIRLoad($name)))) {
                    if (!is_null($id) && $noCheckedRateUser !== true) {
                        $this->ajax->UserRate((int)$id);
                    }
                    $data = $this->ScrapData($value, $concurrentResquest);

                    if ($concurrentResquest) {
                        return [$data, $name];
                    }
                    if ($data) {
                        if (strstr($data, '<!doctype html>') !== false && strstr($data, '// Google Inc.') !== false) {
                            File_Params::CreateParamsFile($this->FILELoad($this->DIRLoad($name)), $this->DIRLoad($name), $data, TRUE);
                        } else {
                            $new_data = $this->ScrapData($value);
                            File_Params::CreateParamsFile($this->FILELoad($this->DIRLoad($name)), $this->DIRLoad($name), $new_data, TRUE);
                        }
                    }
                }
                return $this->getSerpDoctype($name);
            }
        }
    }

    /**
     * @param string $name
     * @return mixed
     */
    public function getSerpDoctype(string $name)
    {
        return File_Params::OpenFile($this->FILELoad($this->DIRLoad($name)), $this->DIRLoad($name), TRUE);
    }

    /**
     * @param string $data
     * @param string $name
     */
    public function createDataSerp(string $data, string $name): void
    {
        if ($data) {
            if (!file_exists($this->FILELoad($this->DIRLoad($name)))) {
                File_Params::CreateParamsFile($this->FILELoad($this->DIRLoad($name)), $this->DIRLoad($name), $data, TRUE);
            }
        }
    }

    /**
     * @param string $value
     * @param string $name
     */
    public function newScrapBadResponse(string $value, string $name)
    {
        $type = false;

        while ($type === false) {
            $data = \GuzzleHttp\json_encode($this->ScrapData($value));
            if (strpos($data, '<!doctype html>') !== 0 && strpos($data, '// Google Inc.') !== 0) {
                File_Params::CreateParamsFile($this->FILELoad($this->DIRLoad($name)), $this->DIRLoad($name), \GuzzleHttp\json_decode($data), TRUE);
                $type = true;
            }
        }
    }

    /**
     * @param $keyword
     * @return mixed
     */
    public function FileVolumeData($keyword)
    {
        $name = $this->str->strReplaceString('%20', '-', $keyword);
        $dir = $this->DIRLoad($name);
        $file = $dir . 'Volume.json';
        if (!file_exists($file)) {
            if (strpos($keyword, ' ') !== false) {
                $keyword = $this->str->strReplaceString(' ', '+', $keyword);
            } elseif (strpos($keyword, '-') !== false) {
                $keyword = $this->str->strReplaceString('-', '+', $keyword);
            }
            $volumeCurl = $this->curl_Volume->CurlVolume($keyword);
            $response = $this->responseVolume($volumeCurl);
            $jsonResponse = str_replace(';', '', $response);
            $jsonDecode = \GuzzleHttp\json_decode($jsonResponse);
            File_Params::CreateParamsFile($file, $dir, \GuzzleHttp\json_encode($jsonDecode), TRUE);
        }
        return File_Params::OpenFile($file, $dir, TRUE);
    }

    /**
     * @param array $data
     * @param string $keyword
     * @return mixed
     */
    public function extractResultData(array $data, string $keyword)
    {
        // Keyword property, for recuperate the data to trends and volume !!!
        $keywordProperty = (new Str_options())->strReplaceString('-', ' ', $keyword);

        $serpAnalysiseDecode = !empty($data['serpAnalysis']) ? \GuzzleHttp\json_decode($data['serpAnalysis']) : null;
        // $seoKeywordsDecode = !empty($data['seoKeywords']) ? \GuzzleHttp\json_decode($data['seoKeywords']) : null;

        $trends = !is_null($serpAnalysiseDecode) ? $serpAnalysiseDecode->data_header->trends : null;
        $volume = !is_null($serpAnalysiseDecode) ? (int)$serpAnalysiseDecode->data_header->vlm : null;
        // $volume = !is_null($seoKeywordsDecode) ? $seoKeywordsDecode->{$keywordProperty}->fr->searchVolume : 0;

        $directory = $this->DIRLoad($keyword);
        return (new FileData())
            ->createFileTrendsAndVolume($trends, $volume, $directory);
    }

    /**
     * @param bool $bool
     * @return bool
     */
    private function InternalError(bool $bool = true)
    {
        return libxml_use_internal_errors($bool);
    }

    /**
     * @param string $result
     * @param bool $multiKeywords
     * @return DOMDocument
     */
    public function LoadHtmlDom(?string $result, bool $multiKeywords = false)
    {
        if (!empty($result) && !is_null($result)) {
            $this->InternalError(true);
            $this->dom->loadHTML($result);
            return $this->dom;
        }
        if (is_null($result)) {
            return $this->dom;
        }

        if ($multiKeywords === false) {
            echo \GuzzleHttp\json_encode(['error' => 'Any Result found !!!']);
            die();
        } else {
            echo \GuzzleHttp\json_encode(['error' => 'Any Result found !!!']);
        }
    }

    /**
     * @param array $data
     * @return array
     */
    public function DateFormat(array $data)
    {
        $data_end = [];
        foreach ($data as $dt) {
            $date = date_create($dt);
            $dt = date_format($date, "M j, Y");
            $data_end[] = $dt;
        }
        return $data_end;
    }

    /**
     * @param array $url
     * @return array|null
     */
    public function SerpNoUrl(array $url)
    {
        $data = [];
        foreach ($url as $u) {
            if ($u) {
                if (strstr($u, 'https://translate.google.com/translate')) {
                    $u = false;
                }
                $data[] = $u;
            }
        }
        return $data;
    }

    /**
     * @param array $result
     * @param string $dir
     * @param string $date_start
     * @param string $date_end
     * @return array
     */
    public function DataDateRank(array $result, $dir, string $date_start = '', string $date_end = '')
    {
        $date = [];
        $date_format = [];
        $url = [];
        $title = [];

        foreach ($result as $res) {
            if (stripos($res, '.html')) {
                $explode = explode('.html', $res);
                $date_ = $explode[0];
                $date_format[] = $date_;
                if ($date_end && $date_end !== '') {
                    if ($res === $date_start . '.html' || $res === $date_end . '.html') {
                        $file = File_Params::OpenFile($dir . $date_ . '.html', $dir, true);
                        $crawler = new Crawler($file);

                        $serp_url = $crawler->filter('div.r > a')->extract(array('href'));
                        $serpTitle = $crawler->filter('div.r > h3')->each(function ($node) {
                            return $node->html();
                        });

                        $url[$date_] = $this->FilterArray($this->SerpNoUrl($serp_url), function ($url) {
                            return $url !== false;
                        });
                        $title[$date_] = $this->SerpDesc($serpTitle, $this->SerpNoUrl($serp_url));
                        $date[] = $date_;
                    }
                } else {
                    $explode = explode('.html', $res);
                    $date_ = $explode[0];

                    $file = File_Params::OpenFile($dir . $date_ . '.html', $dir, true);

                    $crawler = new Crawler($file);
                    $serp_url = $crawler->filter('div.r > a')->extract(array('href'));
                    $serpTitle = $crawler->filter('div.r > a > h3')->each(function ($node) {
                        return $node->html();
                    });

                    $url[$date_] = $this->FilterArray($this->SerpNoUrl($serp_url), function ($url) {
                        return $url !== false;
                    });
                    $title[$date_] = $this->SerpDesc($serpTitle, $this->SerpNoUrl($serp_url));
                    $date[] = $date_;
                }
            }
        }
        return ["date" => $date, "date_format" => $date_format, "rank" => $url, "title" => $title];
    }

    /**
     * @param string $dir
     * @return array
     */
    public function DataTodayYesterday(string $dir)
    {
        $result = scandir($dir);
        $date = [];
        $data = [];
        $option = [];
        foreach ($result as $res) {
            if (stripos($res, '.html')) {
                $explode = explode('.html', $res);
                $date_ = $explode[0];
                $file = File_Params::OpenFile($dir . $date_ . '.html', $dir, true);
                $crawler = new Crawler($file);
                $serp_url = $crawler->filter('div.r > a')->extract(array('href'));
                $serp_desc = $crawler->filter('div.r > a > h3 > div')->each(function ($node) {
                    return $node->html();
                });
                $option["url"] = $this->FilterArray($this->SerpNoUrl($serp_url), function ($url) {
                    return $url !== false;
                });
                $option["description"] = $this->SerpDesc($serp_desc, $this->SerpNoUrl($serp_url));
                $data[] = $option;
                $date[] = $date_;
            }
        }
        return ["date" => $date, "data" => $data];
    }

    /**
     * @param $result
     * @param $dataVolume
     * @param string $keyword
     * @return array
     */
    public function DomResultSerp($result, $dataVolume, string $keyword)
    {

        // Request Html DomCrawler
        $req = $this->LoadHtmlDom($result);
        $crawler = new Crawler($req);

        // Recuperate Desc Serp with Crawler
        $serp_desc = $crawler->filter('div.r > a > h3')->each(function ($node) {
            return $node->html();
        });

        // Recuperate Url Serp with Crawler
        $serp_url = $crawler->filter('div.r > a')->extract(array('href'));

        // Convert Url and Desc SERP int the an array !!!
        $url = $this->SerpNoUrl($serp_url);
        $desc = $this->SerpDesc($serp_desc, $url);
        $data = $this->DataDateRank(scandir($this->DIRLoad(str_replace('%20', '-', $keyword))), $this->DIRLoad(str_replace('%20', '-', $keyword)));

        // Data Volume for the 20 first results !!!
        $dataVolume = \GuzzleHttp\json_decode($dataVolume);
        $dataVl = ['volume' => self::DataRestultVolume($dataVolume->{'volume'})];

        // Feature Icon !!!
        $features = (new CrawlerDataSerp($crawler))->dataCrawlerSearch([
            'e2BEnf U7izfe' =>
                [
                    'name' => ['Vidéos', 'À la une', 'Recettes'],
                    'balise' => 'h3'
                ],
            'jOmXmb rhsg4' =>
                [
                    'name' => ['Résultats Shopping'],
                    'balise' => 'h3'
                ],
            'kp-header' => 'Knowledge Panel',

            'a-no-hover-decoration' =>
                [
                    'name' => ['Signaler des images inappropriées'],
                    'balise' => 'a'
                ],
            'ads-visurl' => [
                'name' => ['Annonce'],
                'balise' => 'span'
            ],

            'ifM9O' => [
                'name' => ['Autres questions posées'],
                'balise' => 'h2'
            ],
            'nrgt' => [
                'name' => ['Site Links'],
                'balise' => 'table'
            ],
            'g mnr-c g-blk' => 'Knowledge Card',

            'H93uF' => [
                'name' => ['Autres adresses'],
                'balise' => 'a'
            ],
            'UCu2Hb' => [
                'name' => ['Image map'],
                'balise' => 'img'
            ],
            'a' => [
                'name' => ['À propos des extraits optimisés'],
                'balise' => 'a'
            ]
        ]);

        // Return Array Result Data for the Front !!!
        return [
            "description" => $this->descAntiBasise($desc),
            "url" => $this->FilterArray($url, function ($url) {
                return $url !== false;
            }),
            "date_format" => $this->DateFormat($data['date']),
            "date" => DataSerp::sliceData($data, 'date'),
            "rank" => DataSerp::sliceData($data, 'rank'),
            "serpFeature" => $features,
            'dataVolume' => $dataVl
        ];
    }

    /**
     * @param string $date_start
     * @param string $date_end
     * @param string $keyword
     * @return array
     */
    public function DomResultSerpDate(string $date_start, string $date_end, string $keyword)
    {
        // Format date_start in the Format "Y-m-d" for recuperate file to the date !!!
        $date_start_format = Date_Format::DateFormatReq($date_start, 'Y-m-d');
        $date_end_format = Date_Format::DateFormatReq($date_end, 'Y-m-d');

        // Load File Date_start
        $file = $this->DateFile($date_end_format, $this->DIRLoad($keyword));
        $open = File_Params::OpenFile($file, $this->DIRLoad($keyword), TRUE);

        // If File Exist we returned the result in JSON !!!
        // Statistic Volume And CPC
        $DataFileVolume = $this->RenderVolume($keyword);

        // Load Data With Filter Crawler, we use Method $this->LoadReqCrawler() !!!
        return $this->LoadReqCrawler($open, $keyword, $date_start_format, $date_end_format, $DataFileVolume);
    }

    /**
     * @param array $rankByDates
     * @param string|null $keyword
     * @return void
     */
    public function deleteFileRankEmpty(array $rankByDates, ?string $keyword): void
    {
        if (is_null($keyword)) {
            echo \GuzzleHttp\json_encode([
                'data' => 'An keyword is required !!!!'
            ]);
            die();
        }
        foreach ($rankByDates as $key => $value) {
            unlink($this->DIRLoad($keyword) . $value . '.html');
        }
    }

    /**
     * @param string $value
     * @param bool $concurrentRequest
     * @return bool|string
     */
    public function ScrapData(string $value, bool $concurrentRequest = false)
    {
        $value = str_replace('-', ' ', $value);
        $Api = $this->CreateUrlScrapperApi($this->CreateUrlG(rawurlencode($value)));

        if ($concurrentRequest) {
            return rawurlencode($Api);
        }

        return $this->curl->CurlApi($Api);
    }

    /**
     * @param array $desc
     * @param array $url
     * @return array
     */
    public function SerpDesc(array $desc, array $url): array
    {
        foreach ($desc as $key => $value) {
            if ($url[$key] === null) {
                $key = array_keys($url, $url[$key]);
                foreach ($key as $k => $v) {
                    if (isset($desc[$v])) {
                        $desc[$v] = false;
                    }
                }
            }
        }
        return $this->FilterArray($desc, function ($desc) {
            return $desc !== false;
        });
    }

    /**
     * @param array $input
     * @param callable $callback
     * @return array
     */
    public function FilterArray(array $input, callable $callback): array
    {
        $data = [];
        $data_filter = array_filter($input, $callback);
        foreach ($data_filter as $dt) {
            $data[] = $dt;
        }
        return $data;
    }

    /**
     * @param $volumeCurl
     * @return mixed|string
     */
    private function responseVolume($volumeCurl)
    {
        // We used Crawler for crawler the result $volume Curl
        // Recuperate all script to the page !!!
        $crawler = new Crawler($volumeCurl, 'GET');
        $script = $crawler->filter('script')->each(function ($node) {
            return $node->html();
        });

        // Take the script json Data !!!
        $keyData = $this->str->array_find('statisticData', $script);
        if ($keyData !== false) {
            $data = $script[$keyData];
            $filterData = explode('=', $data);
            // Delete var to script !!!
            if (isset($filterData[1])) {
                $exceptVar = explode('var', $filterData[1]);
                return $this->str->strReplaceString(' ', '', $this->str->str_replace_crawl($exceptVar[0]));
            }
            return \GuzzleHttp\json_encode(['error' => 'Stats not found']);
        }
        return \GuzzleHttp\json_encode(['error' => 'Stats not found']);
    }

    /**
     * @param array $desc
     * @return array
     */
    private function descAntiBasise(array $desc): array
    {
        $arrayDesc = [];
        foreach ($desc as $key => $value) {
            if (strstr($value, '<span') !== false) {
                $valueCutClassBalise = $this->baliseCut('<span', $value);
                $arrayDesc[] = $valueCutClassBalise;
            } elseif (strstr($value, '<div') !== false) {
                $valueCutClassBalise = $this->baliseCut('<div', $value);
                $arrayDesc[] = $valueCutClassBalise;
            } else {
                $arrayDesc[] = $value;
            }
        }
        return $arrayDesc;
    }

    /**
     * @param string $search
     * @param string $value
     * @return string
     */
    private function baliseCut(string $search, string $value): string
    {
        $valueCut = explode($search, $value)[1] ?? '';
        $valueCutClass = explode('>', $valueCut)[1] ?? '';
        $valueCutClassBalise = explode('<', $valueCutClass)[0] ?? '';
        return $valueCutClassBalise;
    }
}
