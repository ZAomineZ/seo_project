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
use App\concern\Ajax;
use App\concern\File_Params;
use App\concern\Img_Params;
use App\concern\Str_options;
use App\Model\LinkDomain;
use App\Model\WebSite;
use App\Table\LinkProfile;
use Stillat\Numeral\Numeral;

class WebSiteController
{
    /**
     * @var \App\Table\Website
     */
    private static $table;
    /**
     * @var Json_File
     */
    private static $bl;
    /**
     * @var WebSite
     */
    private static $web;
    /**
     * @var Numeral
     */
    private static $format;
    /**
     * @var Curl_Url
     */
    private static $curl;
    /**
     * @var Curl_Keyword
     */
    private static $curl_keyword;
    /**
     * @var TopKeywordController
     */
    private static $controller;
    /**
     * @var Ajax
     */
    private static $ajax;
    /**
     * @var LinkProfile
     */
    private static $linkTable;
    /**
     * @var LinkProfileController
     */
    private static $linkProfileController;
    /**
     * @var LinkDomain
     */
    private static $linkDomain;

    /**
     * WebSiteController constructor.
     * @param \App\Table\Website $table
     * @param Json_File $bl
     * @param WebSite $web
     * @param Numeral $format
     * @param Curl_Url $curl
     * @param Curl_Keyword $curl_keyword
     * @param TopKeywordController $controller
     * @param Ajax $ajax
     * @param LinkProfile $linkProfile
     * @param LinkProfileController $linkProfileController
     * @param LinkDomain $linkDomain
     */
    public function __construct(
        \App\Table\Website $table,
        Json_File $bl,
        WebSite $web,
        Numeral $format,
        Curl_Url $curl,
        Curl_Keyword $curl_keyword,
        TopKeywordController $controller,
        Ajax $ajax,
        LinkProfile $linkProfile,
        LinkProfileController $linkProfileController,
        LinkDomain $linkDomain
    )
    {
        self::$table = $table;
        self::$bl = $bl;
        self::$web = $web;
        self::$format = $format;
        self::$curl = $curl;
        self::$curl_keyword = $curl_keyword;
        self::$controller = $controller;
        self::$ajax = $ajax;
        self::$linkTable = $linkProfile;
        self::$linkProfileController = $linkProfileController;
        self::$linkDomain = $linkDomain;
    }

    /**
     * @param string $dir
     * @param string $name
     * @param $token
     * @param string|null $options_date
     * @return string
     */
    protected static function FilesDomain(string $dir, string $name, $token, string $options_date = null): string
    {
        if (is_null($options_date)) {
            return $dir . DIRECTORY_SEPARATOR . $name . '-' . $token . '.json';
        }
        return $dir . DIRECTORY_SEPARATOR . $name . '-' . $options_date . '-' . $token . '.json';
    }

    /**
     * @param string $domain
     * @param string $token
     * @return mixed|null
     */
    public static function ReqDataDomain(string $domain, string $token)
    {
        $insert = self::$table->InsertDomain([
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
     * @param string $dir
     * @param null $option
     * @return string
     * @throws \Exception
     */
    protected static function JsonWebSite(string $domain, string $dir, $option = null): string
    {
        // Request Backlink Curl And Verif Statut OK !!!
        $bl = self::$bl->ReqBl($domain);
        if ($bl->status === 'Service Unavailable') {
            return null;
        } elseif ($bl->status === 'Validation Error : target') {
            return null;
        }

        // Recuperate the token in tht database
        // We created Two file Img Majectic for recuperate the power Trust and power Score Rank
        // We inserted this in the datasbase
        $req = self::$table->SelectToken($domain);
        $majestic = self::$linkProfileController->DomainMajectic($domain);
        $file = $majestic["dir"] . '/' . $majestic["domain_str"] . '-' . self::$linkDomain->TokenImg() . '.png';

        // Save Img Majectic Power Trust
        self::$linkProfileController->LinkSave($file, $majestic["dir"], $majestic["url"], $domain);
        $fileSize = self::$web->SaveImgPower($domain, $dir, $req->token);

        // Save Img Majectic Power Score
        $powerTrust = self::$web->ChangePowerSize(
            Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)),
            $bl->data->trust_score,
            (int)self::$linkTable->SelectPowerbyDomain($domain)->power);

        return \GuzzleHttp\json_encode(
            [
                'referring_domain' => $bl->data->domains > 1000 ? self::$format->format($bl->data->domains, '0a.00') : $bl->data->domains,
                'referring_domain_int' => $bl->data->domains,
                'trust_rank' => $powerTrust === 0 ? $bl->data->trust_score === 0 ? Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)) : $bl->data->trust_score : $powerTrust,
                'score_rank' => (int)self::$linkTable->SelectPowerbyDomain($domain)->power,
                'alexa_rank' => $option,
                'ip_subnets' => $bl->data->ipclassc
            ]
        );
    }

    /**
     * @param string $domain
     * @return string
     */
    public static function JsonTrafic(string $domain): string
    {
        // Format Domain For traffic !!!
        $domainArray = explode('.', $domain);
        $domain = $domainArray[count($domainArray) - 2] . '.' . $domainArray[count($domainArray) - 1];

        $html = self::$controller->CrawlHtml(self::$curl_keyword->Curl($domain));

        $key = $html['api_key'];
        $exportHash = $html['export_hash'];
        $exportHashTraffic = $html['export_hash_traffic'];

        $traffic = self::$bl->ReqTrafficKeyword("https://www.semrush.com/dpa/api?database=fr&amp;export=json&key=$key&domain=$domain&display_hash=$exportHash&currency=usd&action=report&type=domain_rank_history&display_sort=dt_asc&_=1555332238625");
        $traffic_now = self::$bl->ReqTrafficKeyword("https://fr.semrush.com/dpa/api?database=fr&export=json&key=$key&domain=$domain&display_hash=$exportHashTraffic&action=report&type=domain_rank");
        if (isset($traffic->error) && $traffic->error !== '') {
            echo \GuzzleHttp\json_encode(['error' => 'A Error is present !!!']);
            die();
        }
        return \GuzzleHttp\json_encode(['data' => $traffic->rank_history->data, 'data_now' => $traffic_now->rank->data]);
    }

    /**
     * @param string $domain
     * @param bool $first
     * @param string|null $file
     * @param string|null $dir
     * @return string
     * @throws \Exception
     */
    public static function JsonReferringWeb(string $domain, $first = false, string $file = null, string $dir = null): string
    {
        // Recuperate Token And Request Backlink Curl And TopBL !!!
        $req = self::$table->SelectToken($domain);
        $bl = self::$bl->ReqBl($domain);
        $bl_top = self::$bl->ReqTopBl($domain);

        // Save Power Trust and Score Rank
        $result = File_Params::OpenFile($file, $dir);
        $fileSize = self::$web->SaveImgPower($domain, $dir, $req->token);
        $powerTrust = self::$web->ChangePowerSize(
            Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)),
            $result->trust_rank,
            (int)self::$linkTable->SelectPowerbyDomain($domain)->power);

        // Return The result with Json_Encode for convert in JSON !!!
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
                    'trust' => $powerTrust === 0 ?
                        $result->trust_rank === 0 ?
                            Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)) :
                            $result->trust_rank :
                        $powerTrust,
                    'score_rank' => (int)self::$linkTable->SelectPowerbyDomain($domain)->power,
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
            'trust' => $powerTrust === 0 ?
                $result->trust_rank === 0 ?
                    Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)) :
                    $result->trust_rank :
                $powerTrust,
            'score_rank' => (int)self::$linkTable->SelectPowerbyDomain($domain)->power,
            'date' => date("Y-m-d")
        ]);
    }

    /**
     * @param bool $first
     * @param string $domain
     * @return string
     */
    protected static function JsonBlTop($first = false, string $domain): string
    {
        $result_first = self::$curl->Curl($domain, "true", 'lastCheck');
        $result = self::$curl->Curl($domain, "false", 'lastCheck');
        $result_second = self::$curl->Curl($domain, "false", 'url');
        $result_anchorUrl = self::$curl->Curl($domain, "true", 'anchorUrl');
        if ($first) {
            return \GuzzleHttp\json_encode([
                $result_first === false ? [] : $result_first
            ]);
        }
        return \GuzzleHttp\json_encode([
            $result === false ? [] : $result,
            $result_second === false ? [] : $result_second,
            $result_anchorUrl === false ? [] : $result_anchorUrl
        ]);
    }

    /**
     * @param string $dir
     * @param string $token
     * @param string $file
     * @return array
     * @throws \Exception
     */
    protected static function FileSystem(string $dir, string $token, string $file): array
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
    protected static function CurlCreateFile(string $filename, string $dir, string $domain)
    {
        if ($filename) {
            File_Params::CreateParamsFile($filename, $dir, self::JsonBlTop(true, $domain), TRUE);
            File_Params::UpdateFile($filename, $dir, self::JsonBlTop(false, $domain));
        }
    }

    /**
     * Create Files with Json Data !!!
     * @param array $arr
     * @param $dir
     * @param $domain
     * @param $option
     * @throws \Exception
     */
    protected static function CreateFileWebSite(array $arr, $dir, $domain, $option)
    {
        File_Params::CreateParamsFile($arr[0], $dir, Json_File::JsonBacklink($domain));
        File_Params::CreateParamsFile($arr[1], $dir, self::JsonTrafic($domain), TRUE);
        File_Params::CreateParamsFile($arr[2], $dir, Json_File::JsonTopBl($domain));
        File_Params::CreateParamsFile($arr[3], $dir, self::JsonWebSite($domain, $dir, $option), TRUE);
        if (file_exists($arr[4]) && !file_exists($arr[3])) {
            File_Params::UpdateFile($arr[4], $dir, self::JsonReferringWeb($domain, false, $arr[3], $dir));
        } else {
            File_Params::CreateParamsFile($arr[4], $dir, self::JsonReferringWeb($domain, TRUE, $arr[3], $dir), TRUE);
        }
        self::CurlCreateFile($arr[5], $dir, $domain);
    }

    /**
     * @param string $domain
     * @param null $option
     * @return bool
     * @throws \Exception
     */
    protected static function CreateFileDomain(string $domain, $option = null): bool
    {
        $dir_domain = self::DirectoryWebSite($domain);
        if (!is_dir($dir_domain['dir'])) {
            $mkdir = mkdir($dir_domain['dir'], 0777, true);
            $file = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], WebSite::Token(), date("Y-m-d"));
            $req = self::ReqDataDomain($domain, File_Params::TokenImgExplode($file));
            self::$web->SaveImgPower($domain, $dir_domain['dir'], $req->token);
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
                self::$web->SaveImgPower($domain, $dir_domain['dir'], $req->token);
                if ($req) {
                    $file = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], $req->token, date("Y-m-d"));
                    $file_dir = self::FileSystem($dir_domain['dir'], $req->token, $file);
                    $file_ref = self::FilesDomain($dir_domain['dir'], 'dash-stats', $req->token);
                    if (!file_exists($file_dir[1]) || !file_exists($file_dir[0]) || !file_exists($file_dir[2]) || !file_exists($file) || !file_exists($file_dir[4]) || !file_exists($file_dir[5])) {
                        if (file_exists($file_dir[1])) {
                            self::$web->CronTraffic($file_dir[1], $dir_domain['dir'], $domain);
                        }
                        if (!file_exists($file) && file_exists($file_ref)) {
                            File_Params::CreateParamsFile($file, $dir_domain['dir'], self::JsonWebSite($domain, $dir_domain['dir'], $option), TRUE);
                            File_Params::UpdateFile($file_ref, $dir_domain['dir'], self::JsonReferringWeb($domain, false, $file, $dir_domain['dir']));
                            if (!file_exists($file_dir[1]) || !file_exists($file_dir[0]) || !file_exists($file_dir[2]) || !file_exists($file_dir[5])) {
                                File_Params::CreateParamsFile($file_dir[1], $dir_domain['dir'], self::JsonTrafic($domain), TRUE);
                                File_Params::CreateParamsFile($file_dir[0], $dir_domain['dir'], Json_File::JsonBacklink($domain));
                                File_Params::CreateParamsFile($file_dir[2], $dir_domain['dir'], Json_File::JsonTopBl($domain));
                                self::CurlCreateFile($file_dir[5], $dir_domain['dir'], $domain);
                            }
                            return true;
                        }
                        self::CreateFileWebSite(
                            [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4], $file_dir[5]],
                            $dir_domain['dir'],
                            $domain,
                            $option);
                        return true;
                    } else {
                        self::$web->CronTraffic($file_dir[1], $dir_domain['dir'], $domain);
                        $req = self::$table->SelectToken($domain);
                        self::$web->SaveImgPower($domain, $dir_domain['dir'], $req->token);
                        $file_token = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], $req->token, date("Y-m-d"));
                        $file_ref = self::FilesDomain($dir_domain['dir'], 'dash-stats', $req->token);
                        if (!file_exists($file_token) && file_exists($file_ref)) {
                            File_Params::CreateParamsFile($file_token, $dir_domain['dir'], self::JsonWebSite($domain, $option), TRUE);
                            File_Params::UpdateFile($file_ref, $dir_domain['dir'], self::JsonReferringWeb($domain, false, $file_token, $dir_domain['dir']));
                            return true;
                        }
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
    private static function ResultJson(string $dir, string $domain_str, string $domain)
    {
        $req = self::$table->SelectToken($domain);
        $fileSize = self::$web->SaveImgPower($domain, $dir, $req->token);
        $file_1 = self::FilesDomain($dir, $domain_str, $req->token, date("Y-m-d"));
        $file = self::FileSystem($dir, $req->token, $file_1);
        $count = count(File_Params::OpenFile($file[4], $dir));
        echo \GuzzleHttp\json_encode([
            'result' => File_Params::OpenFile($file[3], $dir),
            'bl_info' => File_Params::OpenFile($file[0], $dir)->status === 'Service Unavailable' ? '' :
                File_Params::OpenFile($file[0], $dir),
            'traffic' => File_Params::OpenFile($file[1], $dir),
            'file_top_bl' => File_Params::OpenFile($file[2], $dir)->status === 'Service Unavailable' ? '' :
                File_Params::OpenFile($file[2], $dir),
            'all_bl' => File_Params::OpenFile($file[5], $dir),
            'dash_stats' => $count >= 7 ?
                array_slice(self::$web->ChangeData(File_Params::OpenFile($file[4], $dir), "m/d"), $count - 7, $count)
                : self::$web->ChangeData(File_Params::OpenFile($file[4], $dir), "m/d"),
            'stats' => File_Params::OpenFile($file[4], $dir),
            'traffic_data' => self::$web->ForData(
                File_Params::OpenFile($file[1], $dir)->data,
                File_Params::OpenFile($file[1], $dir)->data_now
            ),
            'anchors' => File_Params::OpenFile($file[0], $dir)->status === 'Service Unavailable' ? '' :
                self::$web->DataDefault(File_Params::OpenFile($file[0], $dir)
                    ->data
                    ->anchors
                    ->data),
            'domain_stat' => File_Params::OpenFile($file[0], $dir)
                ->status === 'Service Unavailable' ? '' :
                self::$web->ChangeDataItem(File_Params::OpenFile($file[0], $dir)
                    ->data
                    ->historical
                    ->domain_stat
                    ->weeks, "M j"),
            'data_asc' => isset(File_Params::OpenFile($file[5], $dir)[0]) &&
            File_Params::OpenFile($file[5], $dir)[0] === [] ?
                [] : self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[0]
                    ->backlink
                    ->backlink, 'UNIQUE'),
            'data_desc' => isset(File_Params::OpenFile($file[5], $dir)[1][0]) &&
            File_Params::OpenFile($file[5], $dir)[1][0] === [] ?
                [] :
                self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[1][0]
                    ->backlink
                    ->backlink, 'UNIQUE'),
            'data_url' => isset(File_Params::OpenFile($file[5], $dir)[1][1]) &&
            File_Params::OpenFile($file[5], $dir)[1][1] === [] ?
                [] : self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[1][1]
                    ->backlink
                    ->backlink, 'UNIQUE'),
            'data_assortUrl' => isset(File_Params::OpenFile($file[5], $dir)[1][2]) &&
            File_Params::OpenFile($file[5], $dir)[1][2] === [] ?
                [] : self::$web->DataDefault(File_Params::OpenFile($file[5], $dir)[1][2]
                    ->backlink
                    ->backlink, 'UNIQUE'),
            'power' => (int)self::$linkTable->SelectPowerbyDomain($domain)->power,
            'power_trust' => self::$web->ChangePowerSize(
                Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)),
                File_Params::OpenFile($file[3], $dir)->trust_rank,
                (int)self::$linkTable->SelectPowerbyDomain($domain)->power),
            'error' => ''
        ]);
    }

    /**
     * @param string $error
     */
    private static function ResultJsonError(string $error)
    {
        echo \GuzzleHttp\json_encode(["error" => $error]);
    }

    /**
     * Create Path if the domain exist or not !!!
     * @param string $domain
     * @return array
     */
    protected static function DirectoryWebSite(string $domain): array
    {
        $domain_str = Str_options::str_replace_domain($domain);
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
     * @param array $file_result
     * @throws \Exception
     */
    private function ScrapDataWebsite(string $domain, array $file_result)
    {
        $filter = self::$web->FilterRank($domain);
        $json = self::$web->JsonReturn($filter);
        self::CreateFileDomain($domain, $json);
        return self::ResultJson($file_result['dir'], $file_result['domain_str'], $domain);
    }

    /**
     * @param string $domain
     * @param int $id
     * @throws \Exception
     */
    public function WebSite(string $domain, int $id)
    {
        if ($domain) {
            if (self::$bl->ReqBl($domain)->status === "Not Found" || self::$bl->ReqBl($domain)->status === "Validation Error : target") {
                return self::ResultJsonError(self::$bl->ReqBl($domain)->status);
            } else {
                $file_result = self::DirectoryWebSite($domain);
                $req = self::$table->SelectToken($domain);
                if ($req) {
                    $file = self::FilesDomain($file_result['dir'], $file_result['domain_str'], $req->token, date("Y-m-d"));
                    $file_dir = self::FileSystem($file_result['dir'], $req->token, $file);
                    if (file_exists($file_dir[1]) && file_exists($file_dir[0]) && file_exists($file_dir[2]) && file_exists($file_dir[3]) && file_exists($file_dir[4]) && file_exists($file_dir[5])) {
                        return self::ResultJson($file_result['dir'], $file_result['domain_str'], $domain);
                    } else {
                        self::$ajax->UserRate((int)$id);
                        return $this->ScrapDataWebsite($domain, $file_result);
                    }
                } else {
                    self::$ajax->UserRate((int)$id);
                    return $this->ScrapDataWebsite($domain, $file_result);
                }
            }
        }
        throw new \Exception("Request Ajax not Valid !!!");
    }

    /**
     * @param string $domain
     * @param bool $first
     * @param string|null $file
     * @param string|null $dir
     * @return string
     * @throws \Exception
     */
    public function getJsonReferringWeb(string $domain, $first = false, string $file = null, string $dir = null): string
    {
        return self::JsonReferringWeb($domain, $first, $file, $dir);
    }

    /**
     * @param string $domain
     * @param string $dir
     * @param $option
     * @return string
     * @throws \Exception
     */
    public function getJsonWebSite(string $domain, string $dir, $option = null): string
    {
        return self::JsonWebSite($domain, $dir, $option);
    }
}
