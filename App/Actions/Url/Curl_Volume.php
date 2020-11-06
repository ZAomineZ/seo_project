<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 27/09/19
 * Time: 03:00
 */

namespace App\Actions\Url;


class Curl_Volume
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
     * @param string $keyword
     */
    private function getCurlSetopt($ch, string $keyword)
    {
        $this->CurlSetopt($ch, CURLOPT_URL, 'http://api.scraperapi.com/?api_key=YOUR_KEY&url=https://online.seranking.com/research.keyword.html?source=fr&filter=keyword&input=' . $keyword);
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    }

    /**
     * @param array $headers
     * @param string $keyword
     * @return array
     */
    private function getHeaders(array $headers = [], string $keyword): array
    {
        return $headers;
    }

    /**
     * @param string $keyword
     * @return bool|string
     */
    public function CurlVolume(string $keyword)
    {
        // Start Curl With curl_init
        $ch = curl_init();

        // We defined our options with CurlSetopt
        $this->getCurlSetopt($ch, $keyword);

        // Header Curl
        $headers = [];
        $headers = $this->getHeaders($headers, $keyword);
        $this->CurlSetopt($ch, CURLOPT_HTTPHEADER, $headers);

        // Enjoy the result json if not error detected !!!
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        return curl_exec($ch);
    }
}
