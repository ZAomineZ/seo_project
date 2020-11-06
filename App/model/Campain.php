<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 05/04/19
 * Time: 02:58
 */

namespace App\Model;

use Goutte\Client;

class Campain
{
    /**
     * @var \App\Table\Campain
     */
    private $table;
    /**
     * @var Client
     */
    private $crawler;
    /**
     * @var string
     */
    private $url = '';

    /**
     * Campain constructor.
     * @param \App\Table\Campain $table
     * @param Client $crawler
     */
    public function __construct(\App\Table\Campain $table, Client $crawler)
    {
        $this->table = $table;
        $this->crawler = $crawler;
    }

    /**
     * @param $cost
     * @return int
     */
    private function CostAdd($cost) : int
    {
        $add = 0;
        foreach ($cost as $c) {
            $add += $c->cost;
        }
        return $add;
    }

    /**
     * @param string $message
     * @param string $type
     * @return array
     */
    public function MessageError (string $message, string $type) : array
    {
        return [$type => $message];
    }

    /**
     * @param string $date_asc
     * @param string $id
     * @return array
     * @throws \Exception
     */
    public function ChartData(string $date_asc, string $id) : array
    {
        $array = [];
        if (!empty($date_asc)) {
            if ($date_asc !== date('Y-m-d')) {

                // System Date Period with DateTime and DatePeriod
                $date_format = new \DateTime($date_asc);
                $date_interval = new \DateInterval("P1M");
                $date_end = new \DateTime(date('Y-m-d'));
                $period = new \DatePeriod($date_format, $date_interval, $date_end);

                // Loop on the period Date and add cost and Date on each data !!!
                foreach ($period as $dt_p) {
                    $prd_start = $dt_p->format("Y-m") . '-01';
                    $prd_end = $dt_p->format("Y-m") . '-30';
                    $array[] = [
                        'cost' => $this->CostAdd($this->table->SelectCostByDate('list_campaign', $id, $prd_start, $prd_end)),
                        'date' => $dt_p->format("F Y")
                    ];
                }
            } else {
                $array[] = [
                    'cost' => $this->CostAdd($this->table->SelectCost('list_campaign', $id)),
                    'date' => date('F Y', strtotime(date('Y-m-d')))
                ];
            }
            return $array;
        }
    }

    /**
     * @param string $bl
     * @param string $value
     * @param string $id
     * @return bool|null
     */
    public function CrawlBl(string $bl, string $value, string $id)
    {
        $request = $this->crawler->request("GET", $value);
        $links = $request->filterXPath("//a")->extract(array('href'));
        foreach ($links as $key => $link) {
            if (strstr($link, strtolower(trim($bl)))) {
                $followBl = $request->filterXPath("//a")->extract(['rel']);
                if (isset($followBl[$key]) &&
                    strtolower($followBl[$key]) === 'follow' &&
                    strtolower($followBl[$key]) !== 'nofollow' ||
                    strtolower($followBl[$key]) === '')
                {
                    $follow = 1;
                } else {
                    $follow = 0;
                }
                $this->url = $request->getUri();
                $indexable = $this->indexableBl($id);
                return $this->table->UpdateDataBlFound("list_campaign", $id, $follow, $indexable);
            }
        }
        return null;
    }

    /**
     * @param $select
     */
    public function ReturnJson($select)
    {
        $array = [];
        foreach ($select as $data) {
            $data->campain = $this->table->SelectBlLink("list_campaign", $data->id);
            $data->cost = $this->CostAdd($this->table->SelectCost("list_campaign", $data->id));
            $array[] = $data;
        }
        echo \GuzzleHttp\json_encode($array);
    }

    /**
     * @param string $id
     * @return int
     */
    private function indexableBl(string $id): int
    {
        // Request Uri, Recuperate Url Backlink in Google with Crawler !!!
        $uri = 'http://api.scraperapi.com/?api_key=YOUR_KEY&url=https://www.google.com/search?num=1&lr=&hl=fr&gl=fr&as_qdr=all&q=allinurl%3A++%22' . $this->url . '&oq=allinurl%3A++%22' . $this->url;
        $crawlBl = $this->crawler->
        request('GET', $uri);

        // Filter with Crawler the link href !!!
        $uriBl = $crawlBl->filter('div.r > a')
            ->extract(['href']);

        if (isset($uriBl[0])) {
            if ($uriBl[0] !== '' && $this->url !== '') {
                // Verify if last character get '/', and if yes the delete !!!
                $uriBlSearch = $this->url[-1] === '/' ?
                    substr_replace($this->url, '', -1)
                    : $this->url;
                $uriBlFound = $uriBl[0][-1] === '/' ?
                    substr_replace($uriBl[0], '', -1)
                    : $uriBl[0];

                // Verify If uri backlink Search is equal to uri backlink found !!!
                if ($uriBlSearch === $uriBlFound) {
                    $this->table->UpdateDataBl('list_campaign', $id, $this->url);
                    $index = 1;
                } else {
                    $index = 0;
                }
            } else {
                $index = 0;
            }
        } else {
            $index = 0;
        }
        return $index;
    }
}
