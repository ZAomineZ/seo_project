<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 11/04/19
 * Time: 00:16
 */

namespace App\Actions;

use Goutte\Client;
use Symfony\Component\DomCrawler\Crawler;

class Suggest_Data
{
    private $client;

    /**
     * Suggest_Data constructor.
     * @param Client $client
     */
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * @param $request
     * @return \DOMDocument
     */
    protected function LoadXmlItem ($request)
    {
        if ($request) {
            $response = $this->client->getResponse()->getContent();
            if ($response) {
                $url = utf8_encode($response);
                $domDocument = new \DOMDocument();
                $domDocument->loadXml($url);
                return $domDocument;
            }
        }
        new \Exception("A Request is required for get a result !!!");
    }

    /**
     * @param string $keyword
     * @param array $array
     * @return array|string
     */
    public static function JsonSuggest (string $keyword, array $array = [])
    {
        $data = [];
        if (!empty($array)) {
            foreach ($array as $key => $arr) {
                $data[$key] = "http://google.com/complete/search?output=toolbar&hl=fr&q=$keyword" . '%20' . trim(strip_tags($arr));
            }
            return $data;
        }
        return "http://google.com/complete/search?output=toolbar&hl=fr&q=$keyword";
    }

    /**
     * @param string $keyword
     * @param array $array
     * @return array|\DOMDocument
     */
    protected function DataCrawl (string $keyword, array $array = [])
    {
        if (!empty($array)) {
            $data = [];
            foreach (self::JsonSuggest($keyword, $array) as $key => $arr) {
                $request = $this->client->xmlHttpRequest("GET", $arr);
                $domDocument = $this->LoadXmlItem($request);
                $data[$key] = $domDocument;
            }
            return $data;
        } else {
            $request = $this->client->xmlHttpRequest("GET", self::JsonSuggest($keyword));
            $domDocument = $this->LoadXmlItem($request);
            return $domDocument;
        }
    }

    /**
     * @param string $keyword
     * @param array $array
     * @param bool $alpha
     * @return array
     */
    public function ReqSuggest (string $keyword, array $array = [], bool $alpha = false)
    {
        if (!empty($array)) {
            $req = $this->DataCrawl($keyword, $array);
            $data = [];
            $option = [];
            foreach ($req as $key => $r) {
                $crawler = new Crawler($r);
                $filter = $crawler->filterXpath("//suggestion")->extract(array('data'));
                if (!empty($filter)) {
                    foreach ($filter as $k => $filtre) {
                        $option['key'] = $key;
                        $option['title'] = $filtre;
                        $option['check'] = false;
                        if ($alpha) {
                            $data[$key][] = $option;
                        } else {
                            $data[] = $option;
                        }
                    }
                }
            }
            return $data;
        } else {
            $data = [];
            $option = [];
            $req = $this->DataCrawl($keyword);
            $crawler = new Crawler($req);
            $filter = $crawler->filterXpath("//suggestion")->extract(array('data'));
            foreach ($filter as $key => $val) {
                $option['title'] = $val;
                $option['check'] = false;
                $data[$key] = $option;
            }
            return $data;
        }
    }
}
