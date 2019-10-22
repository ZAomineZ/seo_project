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
     * @param object $data
     * @param string $domain
     * @param int $id
     * @return mixed
     * @throws \Exception
     */
    public function FileTrafficByKeyword(object $data, string $domain, int $id)
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
                if (isset($object->traffic)) {
                    File_Params::UpdateFileExist($file, $dir, $this->JsonData($data));
                }
            }
            return File_Params::OpenFile($file, $dir);
        }
    }

    /**
     * @param object $data
     * @return string
     */
    private function JsonData(object $data) : string
    {
        if (is_null($data)) {
            return \GuzzleHttp\json_encode([
                'data' => []
            ]);
        }
        return \GuzzleHttp\json_encode([
            'data' => $data->rank_history->data
        ]);
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
            'domain' => str_replace('-', '.', $domain),
            'date' => date("Y-m-d H:i:s"),
            'directory' => date("Y") . '/' . date("m")
        ]);
    }

    /**
     * Render and Create JSON to TOP Keyword !!!
     * @param object $result
     * @param string $domain
     * @return array
     */
    public function CreateJson(object $result, string $domain = '') : array
    {
        if ($result) {
            $option = [];
            $data = [];
            if ($result->data !== null) {
                foreach ($result->data as $key => $dt) {
                    $lastmonth = mktime(0, 0, 0, date("m") - 1, date("d"), date("Y"));
                    $lastmonth_2 = mktime(0, 0, 0, date("m") - 2, date("d"), date("Y"));
                    $lastmonth_3 = mktime(0, 0, 0, date("m") - 3, date("d"), date("Y"));
                    $str_date = date('Ym15', $lastmonth);
                    $str_date_2 = date('Ym15', $lastmonth_2);
                    $str_date_3 = date('Ym15', $lastmonth_3);
                    if ($dt->Dt === $str_date || $dt->Dt === $str_date_2 || $dt->Dt === $str_date_3) {
                        $date = date("Y-m-d", strtotime($dt->Dt));
                        $option['domain'] = $dt->Dn === "" ? $domain : $dt->Dn;
                        $option['date'] = $date;
                        $option['traffic'] = $dt->Ot;
                        $option['top_3'] = $dt->X0;
                        $option['top_4_10'] = $dt->X1;
                        $option['top_11_20'] = $dt->X2;
                        $option['top_21_50'] = $dt->X3 + $dt->X4 + $dt->X5;
                        $option['top_51_100'] = $dt->X6 + $dt->X7 + $dt->X8 + $dt->X9 + $dt->Xa;
                        $data[$dt->Dn][] = $option;
                    }
                }
            }
            return $data;
        }
    }
}
