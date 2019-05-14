<?php
namespace App\Actions;

class Error_ajax {

    private static $bl;

    public function __construct(Json_File $bl)
    {
        self::$bl = $bl;
    }

    /**
     * @param string/array $error
     */
    private static function ResultJsonError ($error)
    {
        echo \GuzzleHttp\json_encode([
            "error" => $error
        ]);
    }

    /**
     * @param array/string $domain
     */
    public function Error_Search ($domain)
    {
        if (is_array($domain)) {
            $error = '';
            $err = false;
            foreach ($domain as $dom) {
                if (self::$bl->ReqBl(strip_tags(trim($dom)))->status === "Not Found" || self::$bl->ReqBl(strip_tags(trim($dom)))->status === "Validation Error : target") {
                    $err .= true;
                }
                $err .= false;
            }
            $error .= $err ? 'An Url is invalid or not exist !!!' : '';
            return self::ResultJsonError($error);
        } else {
            if (self::$bl->ReqBl(strip_tags(trim($domain)))->status === "Not Found" || self::$bl->ReqBl(strip_tags(trim($domain)))->status === "Validation Error : target") {
                return self::ResultJsonError(self::$bl->ReqBl(strip_tags(trim($domain)))->status);
            }
            return self::ResultJsonError('');
        }
    }
}
