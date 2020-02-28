<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 22/03/19
 * Time: 04:07
 */

namespace App\Actions;

use Goutte\Client;
use Symfony\Component\DomCrawler\Crawler;

class Json_File
{
    CONST KEY = "6a3c7d6a8c0f8d58b973249472a29ae8";
    CONST KEY_NUM = 1542889112858;

    /**
     * @var Client
     * Initialise Client with the @var $goutte !!!
     */
    private $goutte;

    /**
     * Backlink_Profile constructor.
     * @param Client $goutte
     */
    public function __construct(Client $goutte)
    {
        $this->goutte = $goutte;
    }

    /**
     * @param string $domain
     * @return string
     */
    public static function JsonTrafic (string $domain) : string
    {
        $link = "https://online.seranking.com/research.organic.html?ajax=Chart&source=fr&engine=google&input=$domain&filter=base_domain&type=traffic_sum&line=both";
        return $link;
    }

    /**
     * @param string $domain
     * @return string
     */
    public static function JsonKeyword (string $domain) : string
    {
        $link = "https://online.seranking.com/research.organic.html?ajax=Chart&source=fr&engine=google&input=$domain&filter=base_domain&type=keywords_count&line=both";
        return $link;
    }

    /**
     * @param string $domain
     * @return string
     */
    public static function JsonBacklink (string $domain) : string
    {
        return "https://bl.backend.semrush.com/?key=_&type=backlinks_overview&export_columns=backlinks_anchors%2Cdomains_num%2Chosts_num%2Ctexts_num%2Curls_num%2Cips_num%2Cipclassc_num%2Cgeodomains%2Czones%2Cfollows_num%2Cforms_num%2Cframes_num%2Cimages_num%2Cbacklinks_historical%2Cscores%2Ctopics&display_limit=100&target_type=root_domain&target=$domain&_=" . self::KEY_NUM;
    }

    /**
     * @param string $domain
     * @return string
     */
    public static function JsonTopBl (string $domain) : string
    {
        return "https://bl.backend.semrush.com/?key=_&type=backlinks_overview&target_type=root_domain&target=$domain&export_columns=backlinks&_=" . self::KEY_NUM;
    }

    /**
     * @param Client $goutte
     * @param string $url
     * @return \Symfony\Component\DomCrawler\Crawler
     */
    protected function FileOpenJson (Client $goutte, string $url) : Crawler
    {
        sleep(2);
        $gt = $goutte->request("GET", $url);
        $gt_response = $goutte->getResponse()->getContent();
        $gt->add($gt_response);
        return $gt;
    }

    /**
     * @param $json
     * @return mixed
     */
    protected static function DataReq ($json)
    {
        $json_search = $json->filter("body > p")->each(function ($node){
            return $node->html();
        });
        return json_decode($json_search[0]);
    }

    /**
     * @param string $domain
     * @return array|string
     */
    public function ReqBl (string $domain)
    {
        $link = self::JsonBacklink($domain);
        $open_link = $this->FileOpenJson($this->goutte, $link);
        return self::DataReq($open_link);
    }

    /**
     * @param string $domain
     * @return mixed
     */
    public function ReqTraffic (string $domain)
    {
        $link = self::JsonTrafic($domain);
        $open_link = $this->FileOpenJson($this->goutte, $link);
        return self::DataReq($open_link);
    }

    /**
     * @param string $domain
     * @return mixed
     */
    public function ReqKeyword (string $domain)
    {
        $link = self::JsonKeyword($domain);
        $open_link = $this->FileOpenJson($this->goutte, $link);
        return self::DataReq($open_link);
    }

    /**
     * @param string $domain
     * @return array|string
     */
    public function ReqTopBl (string $domain)
    {
        $link = self::JsonTopBl($domain);
        $open_link = $this->FileOpenJson($this->goutte, $link);
        return self::DataReq($open_link);
    }

    /**
     * @param string $url
     * @return mixed
     */
    public function ReqTrafficKeyword (string $url)
    {
        $open_link = $this->FileOpenJson($this->goutte, $url);
        return self::DataReq($open_link);
    }
}
