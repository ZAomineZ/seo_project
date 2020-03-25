<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 21/03/19
 * Time: 22:56
 */

namespace App\Controller;

use App\Actions\Json_File;
use App\Actions\Url\MultiCurl_UrlTrafficAndKeyword;
use App\concern\Ajax;
use App\concern\File_Params;
use App\concern\Img_Params;
use App\concern\Str_options;
use App\Model\LinkDomain;
use App\Model\WebSite;
use App\Table\LinkProfile;
use InvalidArgumentException;
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
     * @var MultiCurl_UrlTrafficAndKeyword
     */
    private static $curlTrafficUrlKeyword;

    /**
     * WebSiteController constructor.
     * @param \App\Table\Website $table
     * @param Json_File $bl
     * @param WebSite $web
     * @param Numeral $format
     * @param MultiCurl_UrlTrafficAndKeyword $curlTrafficUrlKeyword
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
        MultiCurl_UrlTrafficAndKeyword $curlTrafficUrlKeyword,
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
        self::$curlTrafficUrlKeyword = $curlTrafficUrlKeyword;
        self::$controller = $controller;
        self::$ajax = $ajax;
        self::$linkTable = $linkProfile;
        self::$linkProfileController = $linkProfileController;
        self::$linkDomain = $linkDomain;
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
     * @param bool $first
     * @param string $domain
     * @return string
     */
    protected static function JsonBlTop(bool $first = false, string $domain): string
    {
        $result_first = self::$curlTrafficUrlKeyword->run($domain, "true", 'lastCheck')['url'] ?: false;
        $result = self::$curlTrafficUrlKeyword->run($domain, "false", 'lastCheck')['url'] ?: false;
        $result_second = self::$curlTrafficUrlKeyword->run($domain, "false", 'url')['url'] ?: false;
        $result_anchorUrl = self::$curlTrafficUrlKeyword->run($domain, "true", 'anchorUrl')['url'] ?: false;
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
     * @param string $domain
     * @param int $id
     * @throws \Exception
     */
    public function WebSite(string $domain, int $id)
    {
        if ($domain) {
            $backlinkJson = self::$bl->ReqBl($domain);
            $blTop = self::$bl->ReqTopBl($domain);

            if ($backlinkJson->status === "Not Found" || $backlinkJson->status === "Validation Error : target") {
                return self::ResultJsonError($backlinkJson->status);
            } else {
                $file_result = self::DirectoryWebSite($domain);
                $req = self::$table->SelectToken($domain);
                if ($req) {
                    $file = self::FilesDomain($file_result['dir'], $file_result['domain_str'], $req->token, date("Y-m-d"));
                    $file_dir = self::FileSystem($file_result['dir'], $req->token, $file);
                    if (file_exists($file_dir[1]) && file_exists($file_dir[0]) && file_exists($file_dir[2]) && file_exists($file_dir[3]) && file_exists($file_dir[4])) {
                        return self::ResultJson($file_result['dir'], $file_result['domain_str'], $domain);
                    } else {
                        self::$ajax->UserRate((int)$id);
                        return $this->ScrapDataWebsite($domain, $backlinkJson, $blTop, $file_result);
                    }
                } else {
                    self::$ajax->UserRate((int)$id);
                    return $this->ScrapDataWebsite($domain, $backlinkJson, $blTop, $file_result);
                }
            }
        }
        throw new \Exception("Request Ajax not Valid !!!");
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
        return [$file_bl_info, $file_traffic, $file_top, $file, $file_ref];
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
            'traffic' => File_Params::OpenFile($file[1], $dir) ?? [],
            'file_top_bl' => File_Params::OpenFile($file[2], $dir)->status === 'Service Unavailable' ? '' :
                File_Params::OpenFile($file[2], $dir),
            'all_bl' => [],
            'dash_stats' => $count >= 7 ?
                array_slice(self::$web->ChangeData(File_Params::OpenFile($file[4], $dir), "m/d"), $count - 7, $count)
                : self::$web->ChangeData(File_Params::OpenFile($file[4], $dir), "m/d"),
            'stats' => File_Params::OpenFile($file[4], $dir),
            'traffic_data' => self::$web->ForData(File_Params::OpenFile($file[1], $dir) ?? []),
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
            'data_asc' => [],
            'data_desc' => [],
            'data_url' => [],
            'data_assortUrl' => [],
            'power' => (int)self::$linkTable->SelectPowerbyDomain($domain)->power,
            'power_trust' => self::$web->ChangePowerSize(
                Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)),
                File_Params::OpenFile($file[3], $dir)->trust_rank,
                (int)self::$linkTable->SelectPowerbyDomain($domain)->power),
            'error' => ''
        ]);
    }

    /**
     * @param string $domain
     * @param $backlinkJson
     * @param $blTop
     * @param array $file_result
     * @throws \Exception
     */
    private function ScrapDataWebsite(string $domain, $backlinkJson, $blTop, array $file_result)
    {
        $filter = self::$web->FilterRank($domain);
        $json = self::$web->JsonReturn($filter);
        self::CreateFileDomain($domain, $backlinkJson, $blTop, $json);
        return self::ResultJson($file_result['dir'], $file_result['domain_str'], $domain);
    }

    /**
     * @param string $domain
     * @param $backlinkJson
     * @param $blTop
     * @param null $option
     * @return bool
     * @throws \Exception
     */
    protected static function CreateFileDomain(string $domain, $backlinkJson, $blTop, $option = null): bool
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
                    [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4]],
                    $dir_domain['dir'],
                    $domain,
                    $option, $backlinkJson, $blTop);
            }
        } else {
            if (is_dir($dir_domain['dir'])) {
                $req = self::$table->SelectToken($domain);
                self::$web->SaveImgPower($domain, $dir_domain['dir'], $req->token);
                if ($req) {
                    $file = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], $req->token, date("Y-m-d"));
                    $file_dir = self::FileSystem($dir_domain['dir'], $req->token, $file);
                    $file_ref = self::FilesDomain($dir_domain['dir'], 'dash-stats', $req->token);
                    if (!file_exists($file_dir[1]) || !file_exists($file_dir[0]) || !file_exists($file_dir[2]) || !file_exists($file) || !file_exists($file_dir[4])) {
                        if (file_exists($file_dir[1])) {
                            self::$web->CronTraffic($file_dir[1], $dir_domain['dir'], $domain);
                        }
                        if (!file_exists($file) && file_exists($file_ref)) {
                            File_Params::CreateParamsFile($file, $dir_domain['dir'], self::JsonWebSite($domain, $dir_domain['dir'], $backlinkJson, $option), TRUE);
                            File_Params::UpdateFile($file_ref, $dir_domain['dir'], self::JsonReferringWeb($domain, false, $file, $dir_domain['dir'], $backlinkJson, $blTop));
                            if (!file_exists($file_dir[1]) || !file_exists($file_dir[0]) || !file_exists($file_dir[2])) {
                                File_Params::CreateParamsFile($file_dir[1], $dir_domain['dir'], self::JsonTrafic($domain), TRUE);
                                File_Params::CreateParamsFile($file_dir[0], $dir_domain['dir'], \GuzzleHttp\json_encode($backlinkJson), true);
                                File_Params::CreateParamsFile($file_dir[2], $dir_domain['dir'], $blTop);
                            }
                            return true;
                        }
                        self::CreateFileWebSite(
                            [$file_dir[0], $file_dir[1], $file_dir[2], $file, $file_dir[4]],
                            $dir_domain['dir'],
                            $domain,
                            $option, $backlinkJson, $blTop);
                        return true;
                    } else {
                        self::$web->CronTraffic($file_dir[1], $dir_domain['dir'], $domain);
                        $req = self::$table->SelectToken($domain);
                        self::$web->SaveImgPower($domain, $dir_domain['dir'], $req->token);
                        $file_token = self::FilesDomain($dir_domain['dir'], $dir_domain['domain_str'], $req->token, date("Y-m-d"));
                        $file_ref = self::FilesDomain($dir_domain['dir'], 'dash-stats', $req->token);
                        if (!file_exists($file_token) && file_exists($file_ref)) {
                            File_Params::CreateParamsFile($file_token, $dir_domain['dir'], self::JsonWebSite($domain, $dir_domain['dir'], $backlinkJson, $option), TRUE);
                            File_Params::UpdateFile($file_ref, $dir_domain['dir'], self::JsonReferringWeb($domain, false, $file_token, $dir_domain['dir'], $backlinkJson, $blTop));
                            return true;
                        }
                    }
                }
            }
        }
        return false;
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
     * Create Files with Json Data !!!
     * @param array $arr
     * @param $dir
     * @param $domain
     * @param $option
     * @param $backlinkJson
     * @throws \Exception
     */
    protected static function CreateFileWebSite(array $arr, $dir, $domain, $option, $backlinkJson, $blTop)
    {
        File_Params::CreateParamsFile($arr[0], $dir, \GuzzleHttp\json_encode($backlinkJson), true);
        File_Params::CreateParamsFile($arr[1], $dir, self::JsonTrafic($domain), TRUE);
        File_Params::CreateParamsFile($arr[2], $dir, Json_File::JsonTopBl($domain));
        File_Params::CreateParamsFile($arr[3], $dir, self::JsonWebSite($domain, $dir, $backlinkJson, $option), TRUE);
        if (file_exists($arr[4]) && !file_exists($arr[3])) {
            File_Params::UpdateFile($arr[4], $dir, self::JsonReferringWeb($domain, false, $arr[3], $dir, $backlinkJson, $blTop));
        } else {
            File_Params::CreateParamsFile($arr[4], $dir, self::JsonReferringWeb($domain, TRUE, $arr[3], $dir, $backlinkJson, $blTop), TRUE);
        }
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

        $curlKeyword = self::$curlTrafficUrlKeyword->run($domain)['keyword'] ?: null;
        $curlTraffic = self::$curlTrafficUrlKeyword->run($domain)['traffic'] ?: null;

        try {
            $keywordJson = $curlKeyword !== null ? \GuzzleHttp\json_decode($curlKeyword) : [];
            $trafficJson = $curlTraffic !== null ? \GuzzleHttp\json_decode($curlTraffic) : [];
        } catch (\Exception $exception) {
            if ($exception instanceof InvalidArgumentException) {
                while (strpos($exception->getTrace()[0]['args'][0], '400 Bad Request') !== false) {
                    sleep(2);
                    [$keywordJson, $trafficJson] = self::invalidDataJson($domain);
                }

                return \GuzzleHttp\json_encode(
                    [
                        'traffic' => empty($trafficJson) ? [] : $trafficJson,
                        'keywordAndTop' => empty($keywordJson) ? [] : $keywordJson
                    ]);
            }
        }

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
    private static function invalidDataJson(string $domain): array
    {
        $curlKeyword = self::$curlTrafficUrlKeyword->run($domain)['keyword'] ?: null;
        $curlTraffic = self::$curlTrafficUrlKeyword->run($domain)['traffic'] ?: null;

        $keywordJson = $curlKeyword !== null ? \GuzzleHttp\json_decode($curlKeyword) : [];
        $trafficJson = $curlTraffic !== null ? \GuzzleHttp\json_decode($curlTraffic) : [];

        return [$keywordJson, $trafficJson];
    }

    /**
     * @param string $domain
     * @param string $dir
     * @param $backlinkJson
     * @param null $option
     * @return string
     * @throws \Exception
     */
    protected static function JsonWebSite(string $domain, string $dir, $backlinkJson, $option = null): string
    {
        // Request Backlink Curl And Verif Statut OK !!!
        if ($backlinkJson->status === 'Service Unavailable') {
            return null;
        } elseif ($backlinkJson->status === 'Validation Error : target') {
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
            $backlinkJson->data->trust_score,
            (int)self::$linkTable->SelectPowerbyDomain($domain)->power);

        return \GuzzleHttp\json_encode(
            [
                'referring_domain' => $backlinkJson->data->domains > 1000 ? self::$format->format($backlinkJson->data->domains, '0a.00') : $backlinkJson->data->domains,
                'referring_domain_int' => $backlinkJson->data->domains,
                'trust_rank' => $powerTrust === 0 ? $backlinkJson->data->trust_score === 0 ? Img_Params::PowerGoogleSize(Img_Params::FileGetSize($fileSize)) : $backlinkJson->data->trust_score : $powerTrust,
                'score_rank' => (int)self::$linkTable->SelectPowerbyDomain($domain)->power,
                'alexa_rank' => $option,
                'ip_subnets' => $backlinkJson->data->ipclassc
            ]
        );
    }

    /**
     * @param string $domain
     * @param bool $first
     * @param string|null $file
     * @param string|null $dir
     * @param $backlinkJson
     * @param $blTop
     * @return string
     */
    public static function JsonReferringWeb(string $domain, $first = false, string $file = null, string $dir = null, $backlinkJson, $blTop): string
    {
        // Recuperate Token And Request Backlink Curl And TopBL !!!
        $req = self::$table->SelectToken($domain);

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
                    'referring_domain' => $backlinkJson->data->domains,
                    'referring_pages' => $backlinkJson->data->links,
                    'ip' => $backlinkJson->data->ip,
                    'ip_subnets' => $backlinkJson->data->ipclassc,
                    'total_backlinks' => $blTop->data->backlinks->total,
                    'nofollow' => $backlinkJson->data->nofollow,
                    'follow' => $backlinkJson->data->follow,
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
            'referring_domain' => $backlinkJson->data->domains,
            'referring_pages' => $backlinkJson->data->links,
            'ip' => $backlinkJson->data->ip,
            'ip_subnets' => $backlinkJson->data->ipclassc,
            'total_backlinks' => $blTop->data->backlinks->total,
            'nofollow' => $backlinkJson->data->nofollow,
            'follow' => $backlinkJson->data->follow,
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
     * @param string $domain
     * @param bool $first
     * @param string|null $file
     * @param string|null $dir
     * @return string
     * @throws \Exception
     */
    public function getJsonReferringWeb(string $domain, $first = false, string $file = null, string $dir = null): string
    {
        $backlinkJson = self::$bl->ReqBl($domain);
        $blTop = self::$bl->ReqTopBl($domain);

        return self::JsonReferringWeb($domain, $first, $file, $dir, $backlinkJson, $blTop);
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
        $backlinkJson = self::$bl->ReqBl($domain);
        return self::JsonWebSite($domain, $dir, $backlinkJson, $option);
    }

    /**
     * @param string $domain
     * @param bool $topBacklink
     * @return object
     */
    public function getRequestJson(string $domain, bool $topBacklink = false): object
    {
        if ($topBacklink) {
            return self::$bl->ReqTopBl($domain);
        }
        return self::$bl->ReqBl($domain);
    }
}
