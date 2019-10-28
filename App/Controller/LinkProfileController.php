<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 13/03/19
 * Time: 13:26
 */

namespace App\Controller;

use App\concern\Backlink_Profile;
use App\concern\Img_Params;
use App\concern\Str_options;
use App\Model\LinkDomain;
use App\Model\PDO_Model;
use App\Table\LinkProfile;
use Goutte\Client;

class LinkProfileController extends \App\Http\Controllers\Controller
{
    /**
     * URL MAJESTIC !!!
     */
    CONST URL = "https://fr.majestic.com/reports/majestic-million?domain=";

    /**
     * @var LinkDomain
     */
    private $link;
    /**
     * @var Client
     */
    private $crawler;
    /**
     * @var PDO_Model
     */
    private $pdo_model;
    /**
     * @var LinkProfile
     */
    private $table;
    /**
     * @var Backlink_Profile
     */
    private $profile;

    /**
     * LinkProfileController constructor.
     * @param LinkDomain $link
     * @param Client $crawler
     * @param PDO_Model $pdo
     * @param LinkProfile $table
     * @param Backlink_Profile $profile
     */
    public function __construct(
        LinkDomain $link,
        Client $crawler,
        PDO_Model $pdo,
        LinkProfile $table,
        Backlink_Profile $profile)
    {
        $this->link = $link;
        $this->crawler = $crawler;
        $this->pdo_model = $pdo;
        $this->table = $table;
        $this->profile = $profile;
    }

    /**
     * @param string $url
     * @return string
     */
    protected function DomainUrl(string $url): string
    {
        $domain = $url;
        return self::URL . $domain;
    }

    /**
     * @param string $file
     * @param $mode
     * @return bool|resource
     */
    protected function FopenFile(string $file, $mode)
    {
        return fopen($file, $mode);
    }

    /**
     * @param string $file
     * @param string $dir
     * @param string $url
     * @return bool
     */
    protected function CreateParamsFile(string $file, string $dir, string $url): bool
    {
        chmod($dir, 0777);
        $this->FopenFile($file, "w");
        file_put_contents($file, $this->FopenFile($url, "r"));
        return true;
    }

    /**
     * @param string $file
     * @param string $dir
     * @param string $url
     * @param string $domain
     * @return bool
     */
    public function LinkSave(string $file, string $dir, string $url, string $domain)
    {
        if (!is_dir($dir)) {
            $mkdir = mkdir($dir, 0777, true);
            if ($mkdir && !file_exists($file)) {
                $this->CreateParamsFile($file, $dir, $url);
                $this->table->InsertDomain([
                    'power' => Img_Params::PowerImg(Img_Params::FileGetSize($file)) > 100 ? 100 : Img_Params::PowerImg(Img_Params::FileGetSize($file)),
                    'token' => $this->link->TokenImgExplode($file),
                    'domain' => $domain,
                    'date' => date("Y-m-d H:i:s")
                ]);
                return true;
            }
        } else {
            if (!file_exists($file)) {
                $req = $this->table->SelectPowerbyDomain($domain);
                if ($req) {
                    // File Token Exist !!!
                    $majestic = $this->DomainMajectic($domain);
                    $file = $majestic["dir"] . '/' . $majestic["domain_str"] . '-' . $req->token . '.png';

                    if (self::DateNoTime($req->date) === (string)date("Y-m-d")) {
                        return false;
                    } else {
                        $this->CreateParamsFile($file, $dir, $url);
                        $this->table->InsertDomain([
                            'power' => Img_Params::PowerImg(Img_Params::FileGetSize($file)) > 100 ? 100 : Img_Params::PowerImg(Img_Params::FileGetSize($file)),
                            'token' => $this->link->TokenImgExplode($file),
                            'domain' => $domain,
                            'date' => date("Y-m-d H:i:s")
                        ]);
                    }
                } else {
                    $this->CreateParamsFile($file, $dir, $url);
                    $this->table->InsertDomain([
                        'power' => Img_Params::PowerImg(Img_Params::FileGetSize($file)) > 100 ? 100 : Img_Params::PowerImg(Img_Params::FileGetSize($file)),
                        'token' => $this->link->TokenImgExplode($file),
                        'domain' => $domain,
                        'date' => date("Y-m-d H:i:s")
                    ]);
                }
            }
        }
    }

    /**
     * @param string $domain
     * @return array
     */
    public function DomainMajectic(string $domain): array
    {
        $url = "https://fr.majestic.com/charts/linkprofile/2/?target=$domain&IndexDataSource=F";
        $domain_str = Str_options::str_replace_domain($domain);
        $dir = dirname(__DIR__, 2) . '/' . 'storage' . '/' . 'datas' . '/' . 'imastic' . '/' . 'LinkProfile-' . $domain_str;
        $domain_url = $this->DomainUrl($domain);
        return [
            "url" => $url,
            "domain_str" => $domain_str,
            "dir" => $dir,
            "domain_url" => $domain_url
        ];
    }

    /**
     * @param string $date
     * @return mixed
     */
    protected static function DateNoTime(string $date)
    {
        $explode = explode(" ", $date);
        return $explode[0];
    }

    /**
     * @param string $domain
     * @param $majestic
     */
    protected function ExistDateDomain(string $domain, $majestic)
    {
        if (self::DateNoTime($this->table->SelectPowerbyDomain($domain)->date) !== (string)date("Y-m-d")) {
            $file = $majestic["dir"] . '/' . $majestic["domain_str"] . '-' . $this->table->SelectPowerbyDomain($domain)->token . '.png';
            $url = "https://fr.majestic.com/charts/linkprofile/2/?target=$domain&IndexDataSource=F";
            file_put_contents($file, $this->FopenFile($url, "r"));
            $this->table->InsertDomain([
                'power' => Img_Params::PowerImg(Img_Params::FileGetSize($file)),
                'token' => $this->link->TokenImgExplode($file),
                'domain' => $domain,
                'date' => date("Y-m-d H:i:s")
            ]);
        }
    }

    /**
     * @param string $domain
     * @param $json
     * @return false|string
     * @throws \Exception
     */
    protected function ReturnHtml(string $domain, $json)
    {
        $majestic = $this->DomainMajectic($domain);
        $file = $majestic["dir"] . '/' . $majestic["domain_str"] . '-' . $this->link->TokenImg() . '.png';

        $this->LinkSave($file, $majestic["dir"], $majestic["url"], $domain);
        $this->ExistDateDomain($domain, $majestic);

        $power = array_reverse($this->table->SelectPowerAll($domain));
        $power_last = $this->table->SelectPowerbyDomain($domain);

        return $this->link->UrlHtml($majestic["domain_url"], $power, $power_last, $this->table->SelectDate($domain), $json);
    }

    /**
     * @param string $domain
     * @return string
     * @throws \Exception
     */
    public function linkProfile(string $domain): ?string
    {
        if ($this->profile->ReqIpRef($domain)->status === "Not Found" || $this->profile->ReqIpRef($domain)->status === "Validation Error : target") {
            return $this->link->UrlHtml('', '', '', '', $this->profile->ReqIpRef($domain));
        }
        return $this->ReturnHtml($domain, $this->profile->ReqIpRef($domain));
    }
}
