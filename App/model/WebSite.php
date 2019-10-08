<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 21/03/19
 * Time: 22:56
 */

namespace App\Model;

use App\Actions\Json_File;
use App\Actions\Url\Curl_Keyword;
use App\concern\File_Params;
use App\concern\Str_options;
use App\Controller\TopKeywordController;
use Goutte\Client;

class WebSite
{
    /**
     * Url Alexa Rank !!!
     */
    CONST URL = "https://www.alexa.com/siteinfo/";

    /**
     * @var Client
     */
    private $crawl;
    /**
     * @var TopKeywordController
     */
    private $controller;
    /**
     * @var Curl_Keyword
     */
    private $curl_keyword;
    /**
     * @var Json_File
     */
    private $json;

    /**
     * WebSite constructor.
     * @param Client $crawl
     * @param TopKeywordController $controller
     * @param Curl_Keyword $curl_keyword
     * @param Json_File $bl
     */
    public function __construct(Client $crawl, TopKeywordController $controller, Curl_Keyword $curl_keyword, Json_File $bl)
    {
        $this->crawl = $crawl;
        $this->controller = $controller;
        $this->curl_keyword = $curl_keyword;
        $this->json = $bl;
    }

    /**
     * @param string $date_create
     * @param string $date_now
     * @return bool|\DateInterval
     * @throws \Exception
     */
    private function DateDiff (string $date_create, string $date_now)
    {
        $date_create = new \DateTime($date_create);
        $date_now = new \DateTime($date_now);
        $diff = $date_create->diff($date_now);
        return $diff;
    }

    /**
     * @param string $domain
     * @return string
     */
    protected function JsonTrafic (string $domain) : string
    {
        $html = $this->controller->CrawlHtml($this->curl_keyword->Curl($domain));
        $key = $html['api_key'];
        $exportHash = $html['export_hash'];
        $traffic = $this->json->ReqTrafficKeyword("https://www.semrush.com/dpa/api?database=fr&amp;export=json&key=$key&domain=$domain&display_hash=$exportHash&currency=usd&action=report&type=domain_rank_history&display_sort=dt_asc&_=1555332238625");
        return \GuzzleHttp\json_encode(['data' => $traffic->rank_history->data]);
    }

    /**
     * @param string $domain
     * @return array
     */
    public function FilterRank (string $domain) : array
    {
        $crawl = $this->crawl->request("GET", self::URL . $domain);
        $find = $crawl->filter("body section.rank div.rank-global p.big.data")->each(function ($node) {
          return $node->html();
        });
        return $find;
    }

    /**
     * @param array $find
     * @return string|null
     */
    public function FindRank (array $find) : ?string
    {
        if (!empty($find)) {
            $explode = explode("\n", $find[0]);
            $explode_strip = explode('span', $explode[1]);
            $explode_int = explode('>', $explode_strip[2]);
            return strip_tags(trim($explode_int[1]));
        }
        return null;
    }

    /**
     * @param string $file
     * @return string
     */
    public static function FindDateFile (string $file) : string
    {
        $explode = explode('/', $file);
        $date_ex = explode('-', $explode[11]);
        return $date_ex[2] . '-' . $date_ex[3] . '-' . $date_ex[4];
    }

    /**
     * @param $data
     * @return string|null
     */
    public function JsonReturn ($data) : ?string
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
    public function unique_multidim_array($array, $key) : array
    {
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
    public function DataDefault ($data, $type = '') : array
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
     * @param $data_traffic_now
     * @return array
     */
    public function ForData ($data_traffic, $data_traffic_now) : array
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
            $data_end[strtotime($dt->Dt)] = $data;
        }
        // Data Traffic Now : We Create an array similar !!!
        $dataWithNowTraffic =  $this->DataNowTraffic($data_traffic_now, $data_end);
        // Change order Array by Years !!!
        usort($dataWithNowTraffic, function($v1, $v2) {
            $date_1 = strtotime($v1['date']);
            $date_2 = strtotime($v2['date']);
            return $date_1 - $date_2;
        });

        // We continued and use foreach for create a new array !!!
        foreach ($dataWithNowTraffic as $data_e) {
            $data_asort['years'] = $data_e['years'];
            $data_asort['date'] = $data_e['date'];
            $data_asort['keyword'] = $data_e['keyword'];
            $data_asort['traffic'] = $data_e['traffic'];
            $data_end_asort[] = $data_asort;
        }
        return $data_end_asort;
    }

    /**
     * Change date with the Format corresponding !!!
     * @param $data
     * @param $format
     * @return array
     */
    public function ChangeData ($data, $format) : array
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
    public function ChangeDataItem ($data, $format) : array
    {
        $data_end = [];
        foreach ($data as $item => $dt) {
            $dt->date = date($format, $item);
            $data_end[] = $dt;
        }
        return $data_end;
    }

    /**
     * @param string $file
     * @param string $dir
     * @param string $domain
     * @return bool|null
     * @throws \Exception
     */
    public function CronTraffic (string $file, string $dir, string $domain)
    {
        $date_strtotime = filemtime($file);
        $date = date('Y-m-d', $date_strtotime);
        $date_diff = $this->DateDiff(date('Y-m-d'), $date);
        if ($date_diff && $date_diff->m !== 0) {
            unlink($file);
            return File_Params::CreateParamsFile($file, $dir, $this->JsonTrafic($domain), TRUE);
        }
        return null;
    }

    /**
     * @param string $dir
     * @param string $domain
     * @return bool|string
     */
    public function ChangeDir(string $dir, string $domain)
    {
        if ($dir) {
            $dirArray = explode('datas/', $dir)[0];
            $dirNew = $dirArray . 'datas/imastic/' . 'LinkProfile-' .
                Str_options::str_replace_domain($domain) . '/';
            return $dirNew;
        }
        return false;
    }

    /**
     * @param float|int $powerSize
     * @param  float|int $trust_rank
     * @param int $scoreRank
     * @return int
     */
    public function ChangePowerSize($powerSize, $trust_rank, int $scoreRank)
    {
        if (!is_null($powerSize) && !is_null($trust_rank)) {
            $powerRound = round($powerSize);
            if ($trust_rank > 30) {
                return call_user_func([$this, 'TrustPower'], $powerRound, $trust_rank);
            } elseif ($trust_rank <= 20 && $trust_rank >= 15 && $scoreRank < 20) {
                return $trust_rank / 2;
            } elseif ($trust_rank >= 21 && $trust_rank < 30) {
                if ($powerSize >= 1 && $powerSize <= 3) {
                    return $trust_rank - 4;
                } elseif ($powerSize >= 4 && $powerSize <= 6) {
                    return $trust_rank - 2;
                } elseif ($powerSize >= 7 && $powerSize <= 9){
                    return $trust_rank - 1;
                }
            }
            return 0;
        }
    }

    /**
     * @param string $domain
     * @param string $dir
     * @param string $token
     * @return string
     */
    public function SaveImgPower(string $domain, string $dir, string $token)
    {
        $ImgMajestic = "https://majestic.com/charts/linkprofile/2/?target=$domain&datatype=1&IndexDataSource=F";
        $fileCreate = $this->ChangeDir($dir, $domain) .
            Str_options::str_replace_domain($domain) . '-' .
            $token . '-domain.png';
        if (!is_dir($this->ChangeDir($dir, $domain))) {
            $mkdir = mkdir($this->ChangeDir($dir, $domain), 0777, true);
            if ($mkdir && !file_exists($fileCreate)) {
                File_Params::CreateParamsFile($fileCreate, $this->ChangeDir($dir, $domain), $ImgMajestic);
                return $fileCreate;
            }
        } else {
            if (!file_exists($fileCreate)) {
                File_Params::CreateParamsFile($fileCreate, $this->ChangeDir($dir, $domain), $ImgMajestic);
            }
        }
        return $fileCreate;
    }

    /**
     * @param $data_traffic_now
     * @param array $data
     * @return array
     */
    private function DataNowTraffic($data_traffic_now, array $data): array
    {
        $data_traffic = [];
        foreach ($data_traffic_now as $dt) {
            $data_traffic['years'] = date("Y",  strtotime($dt->Dt));
            $data_traffic['date'] = date("F Y",  strtotime($dt->Dt));
            $data_traffic['keyword'] = $dt->Oc;
            $data_traffic['traffic'] = $dt->Ot;
            $data[strtotime($dt->Dt)] = $data_traffic;
        }
        return $data;
    }

    /**
     * @param int $powerRound
     * @param int $trustRank
     * @return int
     */
    private function TrustPower(int $powerRound, int $trustRank): int
    {
        if ($powerRound === 1) {
            return $trustRank - 26;
        } elseif ($powerRound === 2) {
            return $trustRank - 24;
        } elseif ($powerRound === 3) {
            return $trustRank - 22;
        } elseif ($powerRound === 4) {
            return $trustRank - 20;
        } elseif ($powerRound === 5) {
            return $trustRank - 17;
        } elseif ($powerRound === 6) {
            return $trustRank - 15;
        } elseif ($powerRound === 7) {
            return $trustRank - 13;
        } elseif ($powerRound === 8) {
            return $trustRank - 10;
        } elseif ($powerRound === 9) {
            return $trustRank - 6;
        } elseif ($powerRound > 20 && $powerRound < 55) {
            return $trustRank + 8;
        }
        return 0;
    }
}
