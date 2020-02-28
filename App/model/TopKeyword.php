<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 15/04/19
 * Time: 20:24
 */

namespace App\Model;


use App\concern\Ajax;
use App\concern\File_Params;
use App\concern\Str_options;

class TopKeyword
{
    /**
     * @var array
     */
    private $dataKeyword = [];
    /**
     * @var \App\Table\Website
     */
    private $table;
    /**
     * @var Ajax
     */
    private $ajax;

    /**
     * TopKeyword constructor.
     * @param \App\Table\Website $table
     */
    public function __construct(\App\Table\Website $table, Ajax $ajax)
    {
        $this->table = $table;
        $this->ajax = $ajax;
    }

    /**
     * @param array $data
     * @param string $domain
     * @param int $id
     * @return mixed
     * @throws \Exception
     */
    public function FileTrafficByKeyword(array $data, string $domain, int $id)
    {
        $req = $this->table->SelectToken($domain);
        $domain_str = Str_options::str_replace_domain($domain);
        if (!$req) {
            $dir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'datas' . DIRECTORY_SEPARATOR . 'website' . DIRECTORY_SEPARATOR . date('Y') . DIRECTORY_SEPARATOR . date('m') . DIRECTORY_SEPARATOR . $domain_str;
            $file = $dir . DIRECTORY_SEPARATOR . 'traffic-' . WebSite::Token() . '.json';
            if (!is_dir($dir)) {
                $mkdir = mkdir($dir, 0777, true);
                if ($mkdir && !file_exists($file)) {
                    $this->ajax->UserRate((int)$id);
                    $json = $this->JsonData($data);
                    File_Params::CreateParamsFile($file, $dir, $json, true);
                    $this->ReqDataInsert(File_Params::TokenImgExplode($file), $domain);
                    return File_Params::OpenFile($file, $dir);
                }
            }
        } else {
            $dir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'datas' . DIRECTORY_SEPARATOR . 'website' . DIRECTORY_SEPARATOR . $req->directory . DIRECTORY_SEPARATOR . $domain_str;
            $file = $dir . DIRECTORY_SEPARATOR . 'traffic-' . $req->token . '.json';
            if (!file_exists($file)) {
                $this->ajax->UserRate((int)$id);
                $json = $this->JsonData($data);
                File_Params::CreateParamsFile($file, $dir, $json, true);
            } else {
                $object = File_Params::OpenFile($file, $dir);
                if (isset($object) && empty($object)) {
                    File_Params::UpdateFileExist($file, $dir, $this->JsonData($data));
                }
            }
            return File_Params::OpenFile($file, $dir);
        }
    }

    /**
     * Method who check if the json is empty or not !!!
     * @param array $data
     * @return string
     */
    private function JsonData(array $data) : string
    {
        if (is_null($data) || empty($data)) {
            return \GuzzleHttp\json_encode([]);
        }
        return \GuzzleHttp\json_encode($data);
    }

    /**
     * @param string $token
     * @param string $domain
     * @return bool
     */
    private function ReqDataInsert(string $token, string $domain) : bool
    {
        return $this->table->InsertDomain([
            'token' => $token,
            'domain' => $domain,
            'date' => date("Y-m-d H:i:s"),
            'directory' => date("Y") . '/' . date("m")
        ]);
    }

    /**
     * @param array $dt
     * @param $keywordDt
     * @param int|null $key
     * @param string $domain
     * @param string $keyObject
     */
    private function InsertDataTrafficKeyword(array $dt, $keywordDt, ?int $key, string $domain, string $keyObject): void
    {
        $option = [];

        $date = date("Y-m-d", substr($dt[0], 0, -3));
        $option['domain'] = $domain ?? '';
        $option['date'] = $date;

        // Check if $keyObject is != keywordData
        // If the condition return true we inserted the traffic in the options !!!

        if ($keyObject !== 'keywordData') {
            $option['traffic'] = $dt[1] ?? 0;
        }

        // If $keywordDT is to type array, we recuperated the index 0 to array current !!!
        // Else we recuperated the object aData on the variable $keywordDt !!!

        if ($keyObject !== 'trafficData') {
            if (is_array($keywordDt)) {
                $option['top_3'] = $keywordDt[0]->data[count($keywordDt[0]->data) - ($key + 1)][1] ?? 0;
                $option['top_4_10'] = $keywordDt[1]->data[count($keywordDt[0]->data) - ($key + 1)][1] ?? 0;
                $option['top_11_20'] = $keywordDt[2]->data[count($keywordDt[0]->data) - ($key + 1)][1] ?? 0;
                $option['top_21_50'] = $keywordDt[3]->data[count($keywordDt[0]->data) - ($key + 1)][1] ?? 0;
                $option['top_51_100'] = $keywordDt[4]->data[count($keywordDt[0]->data) - ($key + 1)][1] ?? 0;
            } else {
                $keywordData = $keywordDt->aData[0]->data ?: [];

                $option['top_3'] = $keywordData[count($keywordData) - ($key + 1)][1] ?? 0;
                $option['top_4_10'] = $keywordData[count($keywordData) - ($key + 1)][1] ?? 0;
                $option['top_11_20'] = $keywordData[count($keywordData) - ($key + 1)][1] ?? 0;
                $option['top_21_50'] = $keywordData[count($keywordData) - ($key + 1)][1] ?? 0;
                $option['top_51_100'] = $keywordData[count($keywordData) - ($key + 1)][1] ?? 0;
            }
        }

        $this->dataKeyword[$keyObject][$domain ?? ''][$key] = $option;
    }

    /**
     * @param array $data
     * @param object|array|null $keywordDt
     * @param string|null $domain
     * @param bool $dateCheck
     * @param string $keyObject
     * @return void
     */
    private function createDataTrafficAndTop(array $data, $keywordDt, ?string $domain, bool $dateCheck = true, string $keyObject): void
    {
        foreach ($data as $key => $dt) {
            if ($dateCheck) {
                // Create Date random for -1, -2, -3 Month to Today date !!!
                $lastmonth = mktime(0, 0, 0, date("m") - 1, date("d"), date("Y"));
                $lastmonth_2 = mktime(0, 0, 0, date("m") - 2, date("d"), date("Y"));
                $lastmonth_3 = mktime(0, 0, 0, date("m") - 3, date("d"), date("Y"));

                // Format the dates random 'Ym15' !!!
                $str_date = date('m', $lastmonth);
                $str_date_2 = date('m', $lastmonth_2);
                $str_date_3 = date('m', $lastmonth_3);

                // Format the date exists Traffic Json !!!
                $dateExist = date('m', substr($dt[0], 0, -3));

                // Verify if the date randoms are equal to dates exists !!!
                if (
                    $dateExist === $str_date ||
                    $dateExist === $str_date_2 ||
                    $dateExist === $str_date_3 ||
                    $dateExist === date('m')
                ) {
                    $this->InsertDataTrafficKeyword($dt, $keywordDt, $key, $domain, $keyObject);
                }
            } else {
                $this->InsertDataTrafficKeyword($dt, $keywordDt, $key, $domain, $keyObject);
            }
        }
    }

    /**
     * Render and Create JSON to TOP Keyword !!!
     * @param $result
     * @param string $domain
     * @return array
     */
    public function CreateJson($result, string $domain = '') : array
    {
        if (!is_null($result) || !empty($result)){
            if ($result->traffic !== null) {
                // Define trafficData and KeywordAndTop in the Result JSon !!!
                $trafficDt = $result->traffic->aData[0]->data ?? null;
                $keywordDt = $result->keywordAndTop ?? null;

                if (!is_null($trafficDt) && !is_null($keywordDt)) {
                    $dtTrafficAndKeyword = array_slice($trafficDt, - 3, count($trafficDt));
                    $dtTraffic = array_slice($trafficDt, - 6, count($trafficDt));
                    $dtKeyword = array_slice($trafficDt, - 1, count($trafficDt));

                    $this->createDataTrafficAndTop($dtTrafficAndKeyword, $keywordDt, $domain, true, 'data');
                    $this->createDataTrafficAndTop($dtTraffic, $keywordDt, $domain, false, 'trafficData');
                    $this->createDataTrafficAndTop($dtKeyword, $keywordDt, $domain, false, 'keywordData');
                }
            }
            return $this->dataKeyword;
        }
        return [];
    }
}
