<?php

namespace App\Actions;

use App\Model\PDO_Model;
use App\Table\Website;

class Error_ajax
{

    /**
     * @var Json_File
     */
    private static $bl;
    /**
     * @var Website
     */
    private static $web;

    /**
     * Error_ajax constructor.
     * @param Json_File $bl
     * @param Website $website
     */
    public function __construct(Json_File $bl, Website $website)
    {
        self::$bl = $bl;
        self::$web = $website;
    }

    /**
     * @param string/array $error
     */
    private static function ResultJsonError($error)
    {
        echo \GuzzleHttp\json_encode([
            "error" => $error
        ]);
    }

    /**
     * @param $domain
     * @return mixed
     */
    private function DomainSearchExist ($domain)
    {
        if (is_array($domain)) {
            foreach ($domain as $dom) {
                return self::$web->SelectToken($dom);
            }
        }
        return self::$web->SelectToken($domain);
    }

    /**
     * @param array/string $domain
     */
    public function Error_Search($domain)
    {
        $domain_exist = $this->DomainSearchExist($domain);
        if (!$domain_exist) {
            if (is_array($domain)) {
                $error = '';
                $err = false;
                foreach ($domain as $dom) {
                    $blJson = self::$bl->ReqBl(strip_tags(trim($dom)));

                    if ($blJson->status === "Not Found" || $blJson->status === "Validation Error : target") {
                        $err .= true;
                    }
                    $err .= false;
                }
                $error .= $err ? 'An Url is invalid or not exist !!!' : '';
                return self::ResultJsonError($error);
            } else {
                $blJson = self::$bl->ReqBl(strip_tags(trim($domain)));

                if ($blJson->status === "Not Found" || $blJson->status === "Validation Error : target") {
                   return self::ResultJsonError($blJson->status);
                }
                return self::ResultJsonError('');
            }
        }
        return self::ResultJsonError('');
    }
}
