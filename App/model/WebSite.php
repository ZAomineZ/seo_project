<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 21/03/19
 * Time: 22:56
 */

namespace App\Model;

use Goutte\Client;

class WebSite
{
    /**
     * Url Alexa Rank !!!
     */
    CONST URL = "https://www.alexa.com/siteinfo/";

    private $crawl;

    /**
     * WebSite constructor.
     * @param Client $crawl
     */
    public function __construct(Client $crawl)
    {
        $this->crawl = $crawl;
    }

    /**
     * @param string $domain
     * @return array
     */
    public function FilterRank (string $domain)
    {
        $crawl = $this->crawl->request("GET", self::URL . $domain);
        $find = $crawl->filter("body section.rank div.rank-global p.big.data")->each(function ($node) {
          return $node->html();
        });
        return $find;
    }

    /**
     * @param array $find
     * @return string
     */
    public function FindRank (array $find)
    {
        $explode = explode("\n", $find[0]);
        $explode_strip = explode('span', $explode[1]);
        $explode_int = explode('>', $explode_strip[2]);
        return strip_tags(trim($explode_int[1]));
    }

    /**
     * @param string $file
     * @return string
     */
    public static function FindDateFile (string $file)
    {
        $explode = explode('/', $file);
        $date_ex = explode('-', $explode[11]);
        return $date_ex[2] . '-' . $date_ex[3] . '-' . $date_ex[4];
    }

    /**
     * @param $data
     * @return string
     */
    public function JsonReturn ($data)
    {
        return $this->FindRank($data);
    }

    /**
     * @return string
     * @throws \Exception
     * Create a token !!!
     */
    public static function Token () : string
    {
        return bin2hex(random_bytes(16));
    }

    /**
     * @param $array
     * @param $key
     * @return array
     */
    public function unique_multidim_array($array, $key) {
        $temp_array = [];
        $i = 0;
        $key_array = [];

        foreach($array as $val) {
            if (!in_array($val->$key, $key_array)) {
                $key_array[$i] = $val->$key;
                $temp_array[$i] = $val;
            }
            $i++;
        }
        return $temp_array;
    }

    /**
     * @param $data
     * @param $type = ''
     * @return array
     */
    public function DataDefault ($data, $type = '')
    {
        $data_end = [];
        foreach ($data as $key => $item) {
            if ($item === null) {
                //
            } else {
                $data_end[$key] = $item;
            }
        }
        return $type === 'UNIQUE' ? $this->unique_multidim_array($data_end, 'url') : $data_end;
    }

    /**
     * @param $data_traffic
     * @return array
     */
    public function ForData ($data_traffic)
    {
        $data_end = [];
        $data_end_asort = [];
        $data = [];
        $data_asort = [];
        foreach ($data_traffic as $key => $dt) {
            $data['years'] = date("Y",  strtotime($dt->Dt));
            $data['date'] = date("F Y",  strtotime($dt->Dt));
            $data['keyword'] = $dt->Oc;
            $data['traffic'] = $dt->Ot;
            $data_end[] = $data;
        }
        // Change order Array by Years !!!
        asort($data_end);

        // We continued and use foreach for create a new array !!!
        foreach ($data_end as $data_e) {
            $data_asort['years'] = $data_e['years'];
            $data_asort['date'] = $data_e['date'];
            $data_asort['keyword'] = $data_e['keyword'];
            $data_asort['traffic'] = $data_e['traffic'];
            $data_end_asort[] = $data_asort;
        }
        return $data_end_asort;
    }

    /**
     * @param $data
     * @param $format
     * @return array
     */
    public function ChangeData ($data, $format)
    {
        $data_end = [];
        foreach ($data as $dt) {
            $date = date_create($dt->date);
            $dt->date = date_format($date, $format);
            $data_end[] = $dt;
        }
        return $data_end;
    }

    /**
     * @param $data
     * @param $format
     * @return array
     */
    public function ChangeDataItem ($data, $format)
    {
        $data_end = [];
        foreach ($data as $item => $dt) {
            $dt->date = date($format, $item);
            $data_end[] = $dt;
        }
        return $data_end;
    }
}
