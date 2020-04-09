<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 27/09/19
 * Time: 03:00
 */

namespace App\Actions\Url;


use App\Actions\CreateCookieRender;

class Curl_CsvKeywords
{
    /**
     * @param $ch
     * @param $option
     * @param $value
     * @return bool
     */
    private function CurlSetopt($ch, $option, $value)
    {
        return curl_setopt($ch, $option, $value);
    }

    /**
     * @param $ch
     * @param string $domain
     */
    private function getCurlSetopt($ch, string $domain)
    {
        $this->CurlSetopt($ch, CURLOPT_URL, "https://online.seranking.com/research.organic.html?ajax=exportKeywordsTable&source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&order_field=traffic&order_type=DESC&type_export=csv&");
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    }

    /**
     * @param array $headers
     * @param string $domain
     * @return array
     */
    private function getHeaders(array $headers = [], string $domain): array
    {
        $dir = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'storage/datas/';
        $file = $dir . 'cookies.json';

        $cookie = (new CreateCookieRender($file))->init();

        $headers[] = 'Authority: online.seranking.com';
        $headers[] = 'Accept: application/json, text/javascript, */*; q=0.01';
        $headers[] = 'Sec-Fetch-Dest: empty';
        $headers[] = 'X-Requested-With: XMLHttpRequest';
        $headers[] = 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36';
        $headers[] = 'Sec-Fetch-Site: same-origin';
        $headers[] = 'Sec-Fetch-Mode: cors';
        $headers[] = "Referer: https://online.seranking.com/research.organic.html?source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&page=1&page_size=50&order_field=traffic&order_type=DESC&";
        $headers[] = 'Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7';
        $headers[] = $cookie;
        return $headers;
    }

    /**
     * @param string $domain
     * @return bool|string
     */
    public function run(string $domain)
    {
        // Start Curl With curl_init
        $ch = curl_init();

        // We defined our options with CurlSetopt
        $this->getCurlSetopt($ch, $domain);

        // Header Curl
        $headers = [];
        $headers = $this->getHeaders($headers, $domain);
        $this->CurlSetopt($ch, CURLOPT_HTTPHEADER, $headers);

        // Enjoy the result json if not error detected !!!
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        return curl_exec($ch);
    }
}
