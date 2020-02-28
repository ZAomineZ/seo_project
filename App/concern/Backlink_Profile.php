<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 19/03/19
 * Time: 04:22
 */

namespace App\concern;

use Goutte\Client;
use Symfony\Component\DomCrawler\Crawler;

class Backlink_Profile
{
    CONST KEY = "f5a954a5f2655908727712e3a29e109c";

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
    public static function Backlink (string $domain) : string
    {
        $backlink = "https://bl.backend.semrush.com/?key=" . self::KEY . "&target=$domain&type=backlinks_overview&method=nojsonp&target_type=root_domain&export_columns=backlinks_anchors%2Cdomains_num%2Chosts_num%2Ctexts_num%2Curls_num%2Cips_num%2Cipclassc_num%2Cgeodomains%2Czones%2Cfollows_num%2Cforms_num%2Cframes_num%2Cimages_num%2Cbacklinks%2Cbacklinks_pages%2Cbacklinks_refdomains";
        return $backlink;
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
        $gt->addContent($gt_response);
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
    public function ReqIpRef (string $domain)
    {
        $link = self::Backlink($domain);
        $open_link = $this->FileOpenJson($this->goutte, $link);
        return self::DataReq($open_link);
    }
}
