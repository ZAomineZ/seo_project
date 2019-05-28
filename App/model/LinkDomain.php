<?php

namespace App\Model;

use App\concern\Date_Format;
use App\concern\Str_options;
use Goutte\Client;

class LinkDomain extends \Illuminate\Database\Eloquent\Model
{
    private $goutte;
    private $str;

    /**
     * LinkDomain constructor.
     * @param Client $goutte
     * @param Str_options $str
     */
    public function __construct(Client $goutte, Str_options $str)
    {
        $this->goutte = $goutte;
        $this->str = $str;
    }

    /**
     * @return string
     * @throws \Exception
     * Create a token !!!
     */
    public function TokenImg(): string
    {
        return bin2hex(random_bytes(16));
    }

    /**
     * @param string $file
     * @return string
     * Replace "." by "/" for recuperate the token ($file) !!!
     */
    public function TokenImgExplode(string $file): string
    {
        $explode = explode('/', $file);
        $explode_domain = explode('-', $explode[9]);
        $explode_token = explode('.', $explode_domain[count($explode_domain) - 1]);
        return $explode_token[0];
    }

    /**
     * @param $crawl
     * @param string $params
     * @param bool $replace
     * @return mixed
     * Use OBJECT Crawl with the method $node->html() for scrolling the page !!!
     */
    private function FilterCrawl($crawl, string $params, $replace = FALSE)
    {
        return $crawl_clss = $crawl->filter($params)->each(function ($node, $i) use ($replace) {
            if ($replace) {
                return $node->html();
            }
            return $this->str->str_replace_crawl($node->html());
        });
    }

    /**
     * @param string $params
     * @param string $str_update
     * @param string $params_second
     * @return array
     * Return string with two explode by $params and $params_second and use the delimiter !!!
     */
    private function ExplodeHtmlTwo(string $params, string $str_update, string $params_second)
    {
        $explode = explode($params, $str_update);
        $explode_end = explode($params_second, $explode[0]);
        return $explode_end;
    }

    /**
     * @param $crawl
     * @param string $params
     * @param string $explode_second
     * @param string $search
     * @param bool $replace
     * @return array
     */
    private function FilterUrlHtml($crawl, string $params, string $explode_second, string $search, bool $replace)
    {
        $crawl_clss = $this->FilterCrawl($crawl, $search, $replace);
        if (isset($crawl_clss[1])) {
            if (stripos($crawl_clss[1], 'font')) {
                if (isset($crawl_clss[3]) && stripos($crawl_clss[3], 'font')) {
                    $explode = $this->ExplodeHtmlTwo($params, $crawl_clss[1], $explode_second);
                    $explode1 = $this->ExplodeHtmlTwo($params, $crawl_clss[3], $explode_second);
                    return [$explode[1], $explode1[1]];
                } else {
                    $explode = $this->ExplodeHtmlTwo($params, $crawl_clss[1], $explode_second);
                    return [$explode[1], ''];
                }
            }
            return [$crawl_clss[0], $crawl_clss[1]];
        }
        if ($params && $explode_second !== '') {
            if (isset($crawl_clss[3])) {
                $explode = $this->ExplodeHtmlTwo($params, $crawl_clss[1], $explode_second);
                $explode1 = $this->ExplodeHtmlTwo($params, $crawl_clss[3], $explode_second);
                return [$explode[1], $explode1[1]];
            }
            $explode = $this->ExplodeHtmlTwo($params, $crawl_clss[2], $explode_second);
            return [isset($explode[1]) ? $explode[1] : '', ''];
        }
        return [$crawl_clss[0], ''];
    }

    /**
     * @param $power
     * @return array
     * Recuperate all the power to FetchAll Table link_profile for implode in the array !!!
     */
    protected static function ForPower($power): array
    {
        $power_end = [];
        foreach ($power as $puissance) {
            $power_end[] = $puissance->power;
        }
        return $power_end;
    }

    /**
     * @param $power
     * @return array
     * Recuperate all the date to FetchAll and Format DateTime in Table link_profile for implode in the array !!!
     */
    protected static function ForDate($power)
    {
        $power_end = [];
        foreach ($power as $puissance) {
            $power_end[] = $puissance->date;
        }
        $date = Date_Format::DateDayAndMonth($power_end);
        return $date;
    }

    /**
     * @param $anchor
     * @return array
     */
    protected static function ForAnchors($anchor)
    {
        $anchor_end = [];
        foreach ($anchor as $anchors) {
            $anchor_end[] = $anchors->backlinks_num;
        }
        return $anchor_end;
    }

    /**
     * @param $label
     * @return array
     */
    protected static function ForLabelsAnchor($label)
    {
        $labels_end = [];
        foreach ($label as $labels) {
            $labels_end[] = $labels->anchor;
        }
        return $labels_end;
    }

    /**
     * @param $date
     * @return float
     */
    protected static function DiffDate($date)
    {
        $date_two = [];
        foreach ($date as $dt) {
            $date_two[] = $dt->power;
        }
        $date_diff = count($date_two) === 1 ? 0 : $date_two[0] - $date_two[1];
        return round($date_diff, 2);
    }

    /**
     * @param $crawl
     * @return array
     * Implode two $this->FilterUrlHtml() in the array for use in the method $this->>FilterReturnResult !!!
     */
    protected function FilterReturnResult($crawl): array
    {
        $filter1 = $this->FilterUrlHtml($crawl, '', '', "tr.highlight > td[align=\"right\"] font", FALSE);
        $filter2 = $this->FilterUrlHtml($crawl, ">", '"', "tr.highlight > td[align=\"right\"] span", TRUE);
        $arr_filter = [$filter1, $filter2];
        return $arr_filter;
    }

    /**
     * @param string $url
     * @param $power
     * @param $power_last
     * @param string $domain
     * @param $date
     * @param $json
     * @return false|string
     * Method Public, echo json_encode and Scrolling the data !!!
     */
    public function UrlHtml(string $url, $power, $power_last, $date, $json)
    {
        $crawl = $this->goutte->request("GET", $url);
        $json_encode_tab = [];
        if ($json->status === "Not Found" || $json->status === "Validation Error : target") {
            echo \GuzzleHttp\json_encode(["error" => "This Url is invalid !!!"]);
        } else {
            if (!empty($this->FilterCrawl($crawl, 'tr.highlight > td[align="right"] > span.table-number'))) {
                $filter = $this->FilterUrlHtml($crawl, '', '', "tr.highlight > td[align=\"right\"] > span.table-number", FALSE);
                $filter_number = $this->FilterCrawl($crawl, "tr.highlight > td[align=\"right\"]", FALSE);
                if (stristr($filter_number[1], 'IP de moins recensée(s)') && stristr($filter_number[0], 'referring subnets (x)') === FALSE) {
                    $ip = $this->FilterReturnResult($crawl);
                    $json_encode_tab = [
                        'referring' => $filter[0],
                        'ip_referring' => $filter[1],
                        'authority' => $json->data->trust_score,
                        'authority_diff' => $json->data->trust_score_prev,
                        'backlink_total' => $json->data->backlinks->total,
                        'referring_total' => $json->data->refdomains->total,
                        'bl_data' => $json->data->backlinks->data,
                        'page_data' => $json->data->pages->data,
                        'referring_data' => $json->data->refdomains->data,
                        'follow' => $json->data->follow,
                        'nofollow' => $json->data->nofollow,
                        'text' => $json->data->text,
                        'image' => $json->data->image,
                        'anchor_data' => self::ForAnchors($json->data->anchors->data),
                        'anchor_label' => self::ForLabelsAnchor($json->data->anchors->data),
                        'place_reffering' => '',
                        'place_ip_referring' => $ip ? $ip[0][0] : '',
                        'color_referring' => '',
                        'color_ip_referring' => $ip ? $ip[1][0] : '',
                        'power' => self::ForPower($power),
                        'date' => self::ForDate($power),
                        'power_last' => $power_last->power,
                        'date_diff' => self::DiffDate($date),
                        'error' => ''
                    ];
                } elseif (stristr($filter_number[1], 'referring subnets (x)') && stristr($filter_number[0], 'IP de moins recensée(s)') === FALSE) {
                    $referring = $this->FilterReturnResult($crawl);
                    $json_encode_tab = [
                        'referring' => $filter[0],
                        'ip_referring' => $filter[1],
                        'authority' => $json->data->trust_score,
                        'authority_diff' => $json->data->trust_score_prev,
                        'backlink_total' => $json->data->backlinks->total,
                        'referring_total' => $json->data->refdomains->total,
                        'bl_data' => $json->data->backlinks->data,
                        'page_data' => $json->data->pages->data,
                        'referring_data' => $json->data->refdomains->data,
                        'follow' => $json->data->follow,
                        'nofollow' => $json->data->nofollow,
                        'text' => $json->data->text,
                        'image' => $json->data->image,
                        'anchor_data' => self::ForAnchors($json->data->anchors->data),
                        'anchor_label' => self::ForLabelsAnchor($json->data->anchors->data),
                        'place_reffering' => $referring ? $referring[0][0] : '',
                        'place_ip_referring' => '',
                        'color_referring' => $referring ? $referring[1][0] : '',
                        'color_ip_referring' => '',
                        'power' => self::ForPower($power),
                        'date' => self::ForDate($power),
                        'power_last' => $power_last->power,
                        'date_diff' => self::DiffDate($date),
                        'error' => ''
                    ];
                } else {
                    $normal = $this->FilterReturnResult($crawl);
                    $json_encode_tab = [
                        'referring' => $filter[0],
                        'ip_referring' => $filter[1],
                        'authority' => $json->data->trust_score,
                        'authority_diff' => $json->data->trust_score_prev,
                        'backlink_total' => $json->data->backlinks->total,
                        'referring_total' => $json->data->refdomains->total,
                        'bl_data' => $json->data->backlinks->data,
                        'page_data' => $json->data->pages->data,
                        'referring_data' => $json->data->refdomains->data,
                        'follow' => $json->data->follow,
                        'nofollow' => $json->data->nofollow,
                        'text' => $json->data->text,
                        'image' => $json->data->image,
                        'anchor_data' => self::ForAnchors($json->data->anchors->data),
                        'anchor_label' => self::ForLabelsAnchor($json->data->anchors->data),
                        'place_reffering' => $normal ? $normal[0][0] : '',
                        'place_ip_referring' => $normal ? $normal[0][1] : '',
                        'color_referring' => $normal ? $normal[1][0] : '',
                        'color_ip_referring' => $normal ? $normal[1][1] : '',
                        'power' => self::ForPower($power),
                        'date' => self::ForDate($power),
                        'power_last' => $power_last->power,
                        'date_diff' => self::DiffDate($date),
                        'error' => ''
                    ];
                }
                echo \GuzzleHttp\json_encode($json_encode_tab);
            } else {
                echo \GuzzleHttp\json_encode([
                    'referring' => $json->data->domains,
                    'ip_referring' => $json->data->ipclassc,
                    'authority' => $json->data->trust_score,
                    'authority_diff' => $json->data->trust_score_prev,
                    'backlink_total' => $json->data->backlinks->total,
                    'referring_total' => $json->data->refdomains->total,
                    'bl_data' => $json->data->backlinks->data,
                    'page_data' => $json->data->pages->data,
                    'referring_data' => $json->data->refdomains->data,
                    'follow' => $json->data->follow,
                    'nofollow' => $json->data->nofollow,
                    'text' => $json->data->text,
                    'image' => $json->data->image,
                    'anchor_data' => self::ForAnchors($json->data->anchors->data),
                    'anchor_label' => self::ForLabelsAnchor($json->data->anchors->data),
                    'power' => self::ForPower($power),
                    'date' => self::ForDate($power),
                    'power_last' => $power_last->power,
                    'date_diff' => self::DiffDate($date),
                    'error' => ''
                ]);
            }
        }
    }

    /**
     * @param string $url
     * @return mixed
     */
    public function ExplodeUrl(string $url)
    {
        $Referer = $url;
        $new_domain = explode("/", $Referer);
        return str_replace('-', '.', $new_domain[5]);
    }
}
