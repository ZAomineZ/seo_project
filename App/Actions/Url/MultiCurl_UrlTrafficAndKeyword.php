<?php

namespace App\Actions\Url;

use App\Actions\CreateCookieRender;
use App\concern\Str_options;

class MultiCurl_UrlTrafficAndKeyword
{
    /**
     * @var array
     */
    private $headers = [];

    /**
     * @param $ch
     * @param $typeCurlOpt
     * @param $value
     * @return bool
     */
    private function curlSetopt($ch, $typeCurlOpt, $value)
    {
        return curl_setopt($ch, $typeCurlOpt, $value);
    }

    /**
     * @param string $value
     * @param int $key
     * @return MultiCurl_UrlTrafficAndKeyword
     */
    private function setHeaders(string $value, int $key): self
    {
        $this->headers[$key][] = $value;

        return $this;
    }

    /**
     * @param int $key
     * @return array
     */
    private function getHeaders(int $key): array
    {
        return $this->headers[$key];
    }

    /**
     * @param $ch
     * @param string $domain
     * @param string $sort
     * @param string $mode
     */
    protected function curlUrl($ch, string $domain, ?string $sort = null, ?string $mode = null): void
    {

        if (is_null($sort)) {
            $sort = '';
        }

        if (is_null($mode)) {
            $mode = '';
        }

        $this->CurlSetopt($ch, CURLOPT_URL, 'https://webmeup.com/backlink/backlinks');
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_POSTFIELDS, "url=$domain&mode=2&count=true&perPage=50&sort=$sort&sortAsc=$mode");
        $this->CurlSetopt($ch, CURLOPT_POST, 1);
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('cookie: utmc=176069412; utmz=176069412.1574375066.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ym_uid=1569310247685040912; _ym_d=1574375066; SWIFT_client=a%3A1%3A%7Bs%3A15%3A%22templategroupid%22%3Bs%3A1%3A%221%22%3B%7D; utma=176069412.1723501803.1574375066.1574375066.1574779005.2; utmt_UA-33243258-1=1; _ym_visorc_23767645=w; _ym_isad=2; PHPSESSID=8ld74d8ong0q7mdupmdeflbeq1; 59db1c1865406acf972686b16458e6cd=232b2c83376c46a9af71418e9feb1f247de49bcca%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22479032%22%3Bi%3A1%3Bs%3A11%3A%22Marie+Donna%22%3Bi%3A2%3Bi%3A604800%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; SWIFT_checkStatus=true; __utmb=176069412.7.10.1574779005', 0)
            ->setHeaders('Origin: https://webmeup.com', 0)
            ->setHeaders('Accept-Encoding: gzip, deflate, br', 0)
            ->setHeaders('Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7', 0)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36', 0)
            ->setHeaders('Content-Type: application/x-www-form-urlencoded; charset=UTF-8', 0)
            ->setHeaders('Accept: application/json, text/plain, */*', 0)
            ->setHeaders('Referer: https://webmeup.com/', 0)
            ->setHeaders('Authority: webmeup.com', 0)
            ->setHeaders('X-Requested-With: XMLHttpRequest', 0);

        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(0));
    }

    /**
     * @param $ch
     * @param string $domain
     */
    protected function curlKeyword($ch, string $domain): void
    {
        $dir = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'storage/datas/';
        $file = $dir . 'cookies.json';

        $cookie = (new CreateCookieRender($file))->init();

        $this->curlSetopt($ch, CURLOPT_URL, "https://online.seranking.com/research.organic.html?ajax=Chart&source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&type=keywords_count&line=organic");
        $this->curlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->curlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->curlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('Authority: online.seranking.com', 1)
            ->setHeaders($cookie, 1)
            ->setHeaders('Accept: application/json, text/javascript, */*; q=0.01', 1)
            ->setHeaders('Sec-Fetch-Dest: empty', 1)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36', 1)
            ->setHeaders('Accept: application/json, text/javascript, */*; q=0.01', 1)
            ->setHeaders('Sec-Fetch-Site: same-origin', 1)
            ->setHeaders('Sec-Fetch-Mode: cors', 1)
            ->setHeaders('X-Requested-With: XMLHttpRequest', 1)
            ->setHeaders("Referer: https://online.seranking.com/research.organic.html?source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&page=1&page_size=50&order_field=traffic&order_type=DESC&", 1);

        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(1));
    }

    /**
     * @param $ch
     * @param string $domain
     */
    protected function curlTraffic($ch, string $domain): void
    {
        $dir = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'storage/datas/';
        $file = $dir . 'cookies.json';

        $cookie = (new CreateCookieRender($file))->init();

        $this->curlSetopt($ch, CURLOPT_URL, "https://online.seranking.com/research.organic.html?ajax=Chart&source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=false&type=traffic_sum&line=both");
        $this->curlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->curlSetopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        $this->curlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

        $this
            ->setHeaders('Authority: online.seranking.com', 2)
            ->setHeaders('Accept: application/json, text/javascript, */*; q=0.01', 2)
            ->setHeaders('Sec-Fetch-Dest: empty', 2)
            ->setHeaders('X-Requested-With: XMLHttpRequest', 2)
            ->setHeaders('User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36', 2)
            ->setHeaders('Sec-Fetch-Site: same-origin', 2)
            ->setHeaders('Sec-Fetch-Mode: cors', 2)
            ->setHeaders("Referer: https://online.seranking.com/research.overview.html?source=fr&engine=google&input=$domain&filter=base_domain&should_show_es_db_label=0", 2)
            ->setHeaders('Accept-Language: fr,es;q=0.9,en-US;q=0.8,en;q=0.7', 2)
            ->setHeaders($cookie, 2);

        $this->curlSetopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders(2));
    }


    /**
     * @param string $domain
     * @param string|null $mode
     * @param string|null $sort
     * @return array
     */
    public function run(string $domain, ?string $mode = null, ?string $sort = null)
    {
        // Curl Keywords Serp Analysis and Curl surferseo Keywords !!!
        $ch = curl_init();
        $ch2 = curl_init();
        $ch3 = curl_init();

        // Initialised the Curls !!!
        $this->curlUrl($ch, $domain, $sort, $mode);
        $this->curlKeyword($ch2, $domain);
        $this->curlTraffic($ch3, $domain);

        // Create administrator to multi curl !!!
        $multiCurl = curl_multi_init();

        // ADD to two administrators with method add_handle for the Multi Curl !!!
        curl_multi_add_handle($multiCurl, $ch);
        curl_multi_add_handle($multiCurl, $ch2);
        curl_multi_add_handle($multiCurl, $ch3);

        // Running Exec multi curl !!!
        $running = null;
        do {
            // Exec and Select the multi curl for return result too later !!!
            curl_multi_exec($multiCurl, $running);
            curl_multi_select($multiCurl);
        } while ($running > 0);

        // Error $ch verification to URL CURL !!!
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        } elseif (curl_errno($ch2)) {
            echo 'Error:' . curl_error($ch2);
        } elseif (curl_errno($ch3)) {
            echo 'Error:' . curl_error($ch3);
        }

        // We recuperated the result to the Curls and pushed the results in the array Data
        $data = [];
        $resultUrlCurl = curl_multi_getcontent($ch);
        $resultKeywordCurl = curl_multi_getcontent($ch2);
        $resultTrafficCurl = curl_multi_getcontent($ch3);

        $data['url'] = $resultUrlCurl;
        $data['keyword'] = $resultKeywordCurl;
        $data['traffic'] = $resultTrafficCurl;

        // Return $data Data[], the informations to the CURL !!!
        return $data;
    }
}
