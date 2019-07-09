<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 21/03/19
 * Time: 22:56
 */

namespace App\Controller;

use App\Actions\Json_File;
use App\Actions\Url\Curl_Keyword;
use App\Actions\Url\Curl_Url;
use App\concern\File_Params;
use App\concern\Str_options;
use App\Model\WebSite;
use Stillat\Numeral\Numeral;

class WebSiteController
{
    private static $table;
    private static $bl;
    private static $web;
    private static $format;
    private static $curl;
    private static $curl_keyword;
    private static $controller;

    /**
     * WebSiteController constructor.
     * @param \App\Table\Website $table
     * @param Json_File $bl
     * @param WebSite $web
     * @param Numeral $format
     * @param Curl_Url $curl
     * @param Curl_Keyword $curl_keyword
     * @param TopKeywordController $controller
     */
    public function __construct(\App\Table\Website $table, Json_File $bl, WebSite $web, Numeral $format, Curl_Url $curl, Curl_Keyword $curl_keyword, TopKeywordController $controller)
    {
        self::$table = $table;
        self::$bl = $bl;
        self::$web = $web;
        self::$format = $format;
        self::$curl = $curl;
        self::$curl_keyword = $curl_keyword;
        self::$controller = $controller;
    }

    /**
     * @param string $dir
     * @param string $name
     * @param $token
     * @param string|null $options_date
     * @return string
     */
    protected static function FilesDomain (string $dir, string $name, $token, string $options_date = null)
    {
        if (is_null($options_date)) {
            return $dir . DIRECTORY_SEPARATOR . $name . '-' . $token . '.json';
        }
        return $dir . DIRECTORY_SEPARATOR . $name . '-' . $options_date. '-' . $token . '.json';
    }

    /**
     * @param string $domain
     * @param string $token
     * @return mixed|null
     */
    protected static function ReqDataDomain (string $domain, string $token)
    {
        $insert =  self::$table->InsertDomain([
            'domain' => $domain,
            'token' => $token,
            'date' => date("Y-m-d H:i:s"),
            'directory' => date("Y") . '/' . date("m")
        ]);
        if ($insert) {
            return self::$table->SelectToken($domain);
        }
        return null;
    }

    /**
     * @param string $domain
     * @param null $option
     * @return string
     * @throws \Exception
     */
    protected static function JsonWebSite (string $domain, $option = null)
    {
        $bl = self::$bl->ReqBl($domain);
        if ($bl->status === 'Service Unavailable') {
            return null;
        }
        return \GuzzleHttp\json_encode(
            [
                'referring_domain' => $bl->data->domains > 1000 ? self::$format->format($bl->data->domains, '0a.00') : $bl->data->domains ,
                'referring_domain_int' => $bl->data->domains,
                'trust_rank' => $bl->data->trust_score,
                'score_rank' => $bl->data->ascore,
                'alexa_rank' => $option,
                'ip_subnets' => $bl->data->ipclassc
            ]
        );
    }

    /**
     * @param string $domain
     * @return string
     */
    protected static function JsonTrafic (string $domain)
    {
        $html = self::$controller->CrawlHtml(self::$curl_keyword->Curl($domain));
        $key = $html['api_key'];
        $exportHash = $html['export_hash'];
        $traffic = self::$bl->ReqTrafficKeyword("https://www.semrush.com/dpa/api?database=fr&amp;export=json&key=$key&domain=$domain&display_hash=$exportHash&currency=usd&action=report&type=domain_rank_history&display_sort=dt_asc&_=1555332238625");
        return \GuzzleHttp\json_encode(['data' => $traffic->rank_history->data]);
    }

    /**
     * @param string $domain
     * @param bool $first
     * @param string|null $file
     * @param string|null $dir
     * @return string
     */
    protected static function JsonReferringWeb (string $domain, $first = false, string $file = null, string $dir = null)
    {
        $bl = self::$bl->ReqBl($domain);
        $bl_top = self::$bl->ReqTopBl($domain);
        $result = File_Params::OpenFile($file, $dir);
        if ($first) {
            return \GuzzleHttp\json_encode([
                [
                    'referring_domain' => $bl->data->domains,
                    'referring_pages' => $bl->data->links,
                    'ip' => $bl->data->ip,
                    'ip_subnets' => $bl->data->ipclassc,
                    'total_backlinks' => $bl_top->data->backlinks->total,
                    'nofollow' => $bl->data->nofollow,
                    'follow' => $bl->data->follow,
                    'trust' => $result->trust_rank,
                    'score_rank' => $result->score_rank,
                    'date' => date("Y-m-d")
                ]
            ]);
        }
        return \GuzzleHttp\json_encode([
            'referring_domain' => $bl->data->domains,
            'referring_pages' => $bl->data->links,
            'ip' => $bl->data->ip,
            'ip_subnets' => $bl->data->ipclassc,
            'total_backlinks' => $bl_top->data->backlinks->total,
            'nofollow' => $bl->data->nofollow,
            'follow' => $bl->data->follow,
            'trust' => $result->trust_rank,
            'score_rank' => $result->score_rank,
            'date' => date("Y-m-d")
        ]);
    }

    /**
     * @param bool $first
     * @param string $domain
     * @return string
     */
    protected static function JsonBlTop ($first = false, string $domain)
    {
        $result_first = self::$curl->Curl($domain, "true", 'lastCheck');
        $result = self::$curl->Curl($domain, "false", 'lastCheck');
        $result_second = self::$curl->Curl($domain, "false", 'url');
        $result_anchorUrl = self::$curl->Curl($domain, "true", 'anchorUrl');
        if ($first) {
            return \GuzzleHttp\json_encode([$result_first]);
        }
        return \GuzzleHttp\json_encode([$result, $result_second, $result_anchorUrl]);
    }

    /**
     * @param string $dir
     * @param string $token
     * @param string $file
     * @return array
     * @throws \Exception
     */
    protected static function FileSystem (string $dir, string $token, string $file)
    {
        $file_bl_info = self::FilesDomain($dir, 'bl-info', $token);
        $file_traffic = self::FilesDomain($dir, 'traffic', $token);
        $file_ref = self::FilesDomain($dir, 'dash-stats', $token);
        $file_top = self::FilesDomain($dir, 'top_bl', $token);
        $file_curl = self::FilesDomain($dir, 'all_bl', $token);
        return [$file_bl_info, $file_traffic, $file_top, $file, $file_ref, $file_curl];
    }


    /**
     * @param string $filename
     * @param string $dir
     * @param string $domain
     */
    protected static function CurlCreateFile (string $filename, string $dir, string $domain)
    {
        if ($filename) {
            File_Params::CreateParamsFile($filename, $dir, self::JsonBlTop(true, $domain), TRUE);
            File_Params::UpdateFile($filename, $dir, self::JsonBlTop(false, $domain));
        }
    }

    /**
     * @param array $arr
     * @param $dir
     * @param $domain
     * @param $option
     * @throws \Exception
     */
    protected static function CreateFileWebSite (array $arr, $dir, $domain, $option)
    {
        File_Params::CreateParamsFile($arr[0], $dir, Json_File::JsonBacklink($domain));
        File_Params::CreateParamsFile($arr[1], $dir, self::JsonTrafic($domain), TRUE);
        File_Params::CreateParamsFile($arr[2], $dir, Json_File::JsonTopBl($domain));
        File_Params::CreateParamsFile($arr[3], $dir, self::JsonWebSite($domain, $option), TRUE);
        File_Params::CreateParamsFile($arr[4], $dir, self::JsonReferringWeb($domain, TRUE, $arr[3], $dir), TRUE);
        self::CurlCreateFile($arr[5], $dir, $domain);
    }

    /**
     * @param string $domain
     * @param null $option
     * @return bool
     * @throws \Exception
     */
    protected static function CreateFileDomain (string $domain, $option = null)
    {
        $dir_domain = self::DirectoryWebSite($domain);
        if (!is_dir($dir_domain['dir'])) {
            $mkdir = mkdir($dir_domain['dir'], 0777, true);
            $file = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], WebSite::Token(), date("Y-m-d"));
            $req = self::ReqDataDomain($domain, File_Params::TokenImgExplode($file));
            $file_dir = self::FileSystem($dir_domain['dir'], $req->token, $file);
            if ($mkdir && !file_exists($file_dir[0])) {
                self::CreateFileWebSite(
                    [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4], $file_dir[5]],
                    $dir_domain['dir'],
                    $domain,
                    $option);
            }
        } else {
            if (is_dir($dir_domain['dir'])) {
                $req = self::$table->SelectToken($domain);
                $file = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], $req->token, date("Y-m-d"));
                $file_dir = self::FileSystem($dir_domain['dir'], $req->token, $file);
                if (file_exists($file_dir[1]) && !file_exists($file_dir[0]) && !file_exists($file_dir[2]) && !file_exists($file_dir[3]) && !file_exists($file_dir[4]) && !file_exists($file_dir[5])) {
                    self::$web->CronTraffic($file_dir[1], $dir_domain['dir'], $domain);
                    self::CreateFileWebSite(
                        [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4], $file_dir[5]],
                        $dir_domain['dir'],
                        $domain,
                        $option);
                } elseif (file_exists($file_dir[1]) && !file_exists($file_dir[0]) && !file_exists($file_dir[2]) && file_exists($file_dir[3]) && !file_exists($file_dir[4]) && !file_exists($file_dir[5])) {
                    self::$web->CronTraffic($file_dir[1], $dir_domain['dir'], $domain);
                    self::CreateFileWebSite(
                        [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4], $file_dir[5]],
                        $dir_domain['dir'],
                        $domain,
                        $option);
                } elseif (!file_exists($file_dir[1]) && !file_exists($file_dir[0]) && !file_exists($file_dir[2]) && file_exists($file_dir[3]) && file_exists($file_dir[4]) && !file_exists($file_dir[5])) {
                    self::CreateFileWebSite(
                        [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4], $file_dir[5]],
                        $dir_domain['dir'],
                        $domain,
                        $option);
                } elseif (!file_exists($file_dir[1]) && !file_exists($file_dir[0]) && !file_exists($file_dir[2]) && file_exists($file_dir[3]) && !file_exists($file_dir[4]) && !file_exists($file_dir[5])) {
                    self::CreateFileWebSite(
                        [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4], $file_dir[5]],
                        $dir_domain['dir'],
                        $domain,
                        $option);
                } elseif (file_exists($file_dir[1]) && !file_exists($file_dir[0]) && !file_exists($file_dir[2]) && !file_exists($file_dir[3]) && file_exists($file_dir[4]) && !file_exists($file_dir[5])) {
                    self::CreateFileWebSite(
                        [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4], $file_dir[5]],
                        $dir_domain['dir'],
                        $domain,
                        $option);
                } else {
                    self::$web->CronTraffic($file_dir[1], $dir_domain['dir'], $domain);
                    $req = self::$table->SelectToken($domain);
                    $file_token = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], $req->token, date("Y-m-d"));
                    $file_ref = self::FilesDomain($dir_domain['dir'], 'dash-stats', $req->token);
                    if (!file_exists($file_token)) {
                        File_Params::CreateParamsFile($file_token, $dir_domain['dir'], self::JsonWebSite($domain, $option), TRUE);
                        File_Params::UpdateFile($file_ref, $dir_domain['dir'], self::JsonReferringWeb($domain, false, $file_token, $dir_domain['dir']));
                    }
                }
            }
        }
        return false;
    }

    /**
     * @param string $dir
     * @param string $domain_str
     * @param string $domain
     * @throws \Exception
     */
    private static function ResultJson (string $dir, string $domain_str, string $domain)
    {
        $req = self::$table->SelectToken($domain);
        $file_1 = self::FilesDomain($dir, $domain_str, $req->token, date("Y-m-d"));
        $file = self::FileSystem($dir, $req->token, $file_1);
        $count = count(File_Params::OpenFile($file[4], $dir));
        echo \GuzzleHttp\json_encode([
            'result' => File_Params::OpenFile($file[3], $dir),
            'bl_info' => File_Params::OpenFile($file[0], $dir)->status === 'Service Unavailable' ? '' : File_Params::OpenFile($file[0], $dir),
            'traffic' => File_Params::OpenFile($file[1], $dir),
            'file_top_bl' => File_Params::OpenFile($file[2], $dir)->status === 'Service Unavailable' ? '' : File_Params::OpenFile($file[2], $dir),
            'all_bl' => File_Params::OpenFile($file[5], $dir),
            'dash_stats' => $count >= 7 ? array_slice(self::$web->ChangeData(File_Params::OpenFile($file[4], $dir), "m/d"), $count - 7,  $count) : self::$web->ChangeData(File_Params::OpenFile($file[4], $dir), "m/d"),
            'stats' => File_Params::OpenFile($file[4], $dir),
            'traffic_data' => self::$web->ForData(File_Params::OpenFile($file[1], $dir)->data),
            'anchors' => File_Params::OpenFile($file[0], $dir)->status === 'Service Unavailable' ? '' : self::$web->DataDefault(File_Params::OpenFile($file[0], $dir)->data->anchors->data),
            'domain_stat' => File_Params::OpenFile($file[0], $dir)->status === 'Service Unavailable' ? '' : self::$web->ChangeDataItem(File_Params::OpenFile($file[0], $dir)->data->historical->domain_stat->weeks, "M j"),
            'data_asc' => self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[0]->backlink->backlink, 'UNIQUE'),
            'data_desc' => self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[1][0]->backlink->backlink, 'UNIQUE'),
            'data_url' => self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[1][1]->backlink->backlink, 'UNIQUE'),
            'data_assortUrl' => self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[1][2]->backlink->backlink, 'UNIQUE'),
            'error' => ''
        ]);
    }

    private static function ResultJsonError (string $error)
    {
        echo \GuzzleHttp\json_encode(["error" => $error]);
    }

    /**
     * @param string $domain
     * @return array
     */
    protected static function DirectoryWebSite (string $domain)
    {
        $domain_str =  Str_options::str_replace_domain($domain);
        $req = self::$table->SelectToken($domain);
        if ($req !== false) {
            $dir = dirname(__DIR__, 2) . '/' . 'storage/' . 'datas/' . 'website/' . $req->directory . '/' . $domain_str;
        } else {
            $dir = dirname(__DIR__, 2) . '/' . 'storage/' . 'datas/' . 'website/' . date("Y") . '/' . date("m") . '/' . $domain_str;
        }
        return [
            "dir" => $dir,
            "domain_str" => $domain_str
        ];
    }

    /**
     * @param string $domain
     * @throws \Exception
     */
    public function WebSite (string $domain)
    {
        if ($domain) {
            if (self::$bl->ReqBl($domain)->status === "Not Found" || self::$bl->ReqBl($domain)->status === "Validation Error : target") {
                return self::ResultJsonError(self::$bl->ReqBl($domain)->status);
            } else {
                $filter = self::$web->FilterRank($domain);
                $json = self::$web->JsonReturn($filter);
                $file_result = self::DirectoryWebSite($domain);
                self::CreateFileDomain($domain, $json);
                return self::ResultJson($file_result['dir'], $file_result['domain_str'], $domain);
            }
        }
        throw new \Exception("Request Ajax not Valid !!!");
    }
}
