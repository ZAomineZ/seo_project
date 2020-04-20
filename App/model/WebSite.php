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
use App\Actions\Url\Curl_Traffic;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
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
     * @var MultiCurl_UrlTrafficAndKeyword
     */
    private $curl;
    /**
     * @var Json_File
     */
    private $json;

    /**
     * WebSite constructor.
     * @param Client $crawl
     * @param TopKeywordController $controller
     * @param MultiCurl_UrlTrafficAndKeyword $curl
     * @param Json_File $bl
     */
    public function __construct(
        Client $crawl,
        TopKeywordController $controller,
        MultiCurl_UrlTrafficAndKeyword $curl,
        Json_File $bl
    )
    {
        $this->crawl = $crawl;
        $this->controller = $controller;
        $this->curl = $curl;
        $this->json = $bl;
    }

    /**
     * @param string $date_create
     * @param string $date_now
     * @return bool|\DateInterval
     * @throws \Exception
     */
    private function DateDiff(string $date_create, string $date_now)
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
    protected function JsonTrafic(string $domain): string
    {
        $curlKeyword = $this->curl->run($domain)['keyword'] ?: null;
        $curlTraffic = $this->curl->run($domain)['traffic'] ?: null;

        $keywordJson = \GuzzleHttp\json_decode($curlKeyword);
        $trafficJson = \GuzzleHttp\json_decode($curlTraffic);

        return \GuzzleHttp\json_encode(
            [
                'traffic' => empty($trafficJson) ? [] : $trafficJson,
                'keywordAndTop' => empty($keywordJson) ? [] : $keywordJson
            ]);
    }

    /**
     * @param string $domain
     * @return array
     */
    public function FilterRank(string $domain): array
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
    public function FindRank(array $find): ?string
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
    public static function FindDateFile(string $file): string
    {
        $explode = explode('/', $file);
        $date_ex = explode('-', $explode[11]);
        return $date_ex[2] . '-' . $date_ex[3] . '-' . $date_ex[4];
    }

    /**
     * @param $data
     * @return string|null
     */
    public function JsonReturn($data): ?string
    {
        return $this->FindRank($data);
    }

    /**
     * @return string
     * @throws \Exception
     * Create a token !!!
     */
    public static function Token(): string
    {
        return bin2hex(random_bytes(16));
    }

    /**
     * @param $array
     * @param $key
     * @return array
     */
    public function unique_multidim_array($array, $key): array
    {
        $temp_array = [];
        $i = 0;
        $key_array = [];

        foreach ($array as $val) {
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
    public function DataDefault($data, $type = ''): array
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
    public function ForData($data_traffic): array
    {
        // Traffic And Keyword Top
        $trafficDt = $data_traffic->traffic->aData[0]->data ?? null;
        $keywordDt = $data_traffic->keywordAndTop->aData[0]->data ?? null;

        if (is_null($keywordDt)) {
            $keywordDt = end($data_traffic->keywordAndTop)->data ?: null;
        }

        if (is_null($trafficDt) && is_null($keywordDt)) {
            return [];
        } elseif (empty($trafficDt) && is_int($keywordDt)) {
            return [];
        }

        $data_end = [];

        $dataTraffic = $this->dataTrafficOrKeyword($trafficDt);
        $dataKeyword = $this->dataTrafficOrKeyword($keywordDt);

        foreach ($dataTraffic as $key => $value) {
            if ($value['date'] === $dataKeyword[$key]['date']) {
                $data_end[$key]['years'] = $value['years'];
                $data_end[$key]['date'] = $value['date'];
                $data_end[$key]['traffic'] = $value['value'];
                $data_end[$key]['keyword'] = $dataKeyword[$key]['value'];
            }
        }

        return $data_end;
    }

    /**
     * Change date with the Format corresponding !!!
     * @param $data
     * @param $format
     * @return array
     */
    public function ChangeData($data, $format): array
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
    public function ChangeDataItem($data, $format): array
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
    public function CronTraffic(string $file, string $dir, string $domain)
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
            $dirArray = explode('datas/', $dir);
            $underDir = 'datas/imastic/LinkProfile-';
            $domain = Str_options::str_replace_domain($domain);

            if (count($dirArray) === 2) {
                return $dirArray[0] . $underDir . $domain;
            }
            return false;
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
                } elseif ($powerSize >= 7 && $powerSize <= 9) {
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
        $fileCreate = $this->ChangeDir($dir, $domain) . DIRECTORY_SEPARATOR .
            Str_options::str_replace_domain($domain) . '-' .
            $token . '-domain.png';
        if (!is_dir($this->ChangeDir($dir, $domain))) {
            $mkdir = mkdir($this->ChangeDir($dir, $domain), 0777, true);
            if ($mkdir && !file_exists($fileCreate)) {
                try {
                    $fileCreate = File_Params::CreateParamsFile($fileCreate, $this->ChangeDir($dir, $domain), $ImgMajestic);
                } catch (\Exception $exception) {
                    $fileCreate = File_Params::CreateParamsFile($fileCreate, $this->ChangeDir($dir, $domain), null);
                }
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
        if (!empty($data_traffic_now)) {
            foreach ($data_traffic_now as $dt) {
                $data_traffic['years'] = date("Y", strtotime($dt->Dt));
                $data_traffic['date'] = date("F Y", strtotime($dt->Dt));
                $data_traffic['keyword'] = $dt->Oc;
                $data_traffic['traffic'] = $dt->Ot;
                $data[strtotime($dt->Dt)] = $data_traffic;
            }
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

    /**
     * @param array|null $dtOld
     * @return array
     */
    private function dataTrafficOrKeyword(?array $dtOld): array
    {
        $dataEnd = [];

        if (is_null($dtOld)) {
            return [];
        }

        if (!empty($dtOld)) {
            foreach ($dtOld as $key => $dt) {
                $data['years'] = date("Y", substr($dt[0], 0, -3) ?? 0);
                $data['date'] = date("F Y", substr($dt[0], 0, -3) ?? 0);
                $data['value'] = $dt[1] ?? 0;
                $dataEnd[substr($dt[0], 0, -3) ?? 0] = $data;
            }
        } else {
            return [];
        }

        // Change order Array by Years !!!
        usort($dataEnd, function ($v1, $v2) {
            $date_1 = strtotime($v1['date']);
            $date_2 = strtotime($v2['date']);
            return $date_1 - $date_2;
        });

        return $dataEnd;
    }
}
