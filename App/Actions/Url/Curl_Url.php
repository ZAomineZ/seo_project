<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 30/03/19
 * Time: 21:20
 */

namespace App\Actions\Url;


class Curl_Url
{

    /**
     * @param $curl
     * @param $option
     * @param $value
     * @return bool
     */
    protected function CurlSetopt ($curl, $option, $value) : bool
    {
        return curl_setopt($curl, $option, $value);
    }

    /**
     * @param $ch
     * @param string $domain
     * @param string $mode
     * @param string $sort
     */
    private function CurlSet ($ch, string $domain, string $mode, string $sort)
    {
        $this->CurlSetopt($ch, CURLOPT_URL, 'https://webmeup.com/backlink/backlinks');
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_POSTFIELDS, "url=$domain&mode=2&count=true&perPage=50&sort=$sort&sortAsc=$mode");
        $this->CurlSetopt($ch, CURLOPT_POST, 1);
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    }

    /**
     * @param array $headers
     * @return array
     */
    private function CurlSetHeader (array $headers = []) : array
    {
        $headers[] = 'Cookie: _ym_uid=1553891720585475788; _ym_d=1553891720; __utma=176069412.446332031.1553891720.1553891720.1553891720.1; __utmc=176069412; __utmz=176069412.1553891720.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmt_UA-33243258-1=1; _ym_visorc_23767645=w; _ym_isad=2; PHPSESSID=phampgoliotr2j3nircnhh0p16; 59db1c1865406acf972686b16458e6cd=9084df0f1c1e8a7ba5ce1431285968fcdecc5fcea%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22474277%22%3Bi%3A1%3Bs%3A5%3A%22Monic%22%3Bi%3A2%3Bi%3A604800%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; SWIFT_checkStatus=true; __utmb=176069412.4.10.1553891720';
        $headers[] = 'Origin: https://webmeup.com';
        $headers[] = 'Accept-Encoding: gzip, deflate, br';
        $headers[] = 'Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7';
        $headers[] = 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36';
        $headers[] = 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8';
        $headers[] = 'Accept: application/json, text/plain, */*';
        $headers[] = 'Referer: https://webmeup.com/';
        $headers[] = 'Authority: webmeup.com';
        $headers[] = 'X-Requested-With: XMLHttpRequest';
        return $headers;
    }

    /**
     * @param string $domain
     * @param string $mode
     * @return bool|string
     */
    public function Curl (string $domain, string $mode, string $sort)
    {
        //Init Curl and Use Method CurlSet for CURL an URL with the options !!!
        $ch = curl_init();
        $this->CurlSet($ch, $domain, $mode, $sort);

        //Initialise the header to CURL !!!
        $headers = [];
        $this->CurlSetHeader($headers);

        $this->CurlSetopt($ch,CURLOPT_HTTPHEADER, $this->CurlSetHeader($headers));

        //Error $ch verification to URL CURL !!!
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }

        //Execute the CURL !!!
        return \GuzzleHttp\json_decode(curl_exec($ch));
    }
}
