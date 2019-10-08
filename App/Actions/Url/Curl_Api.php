<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 25/04/19
 * Time: 01:33
 */

namespace App\Actions\Url;

class Curl_Api
{
    /**
     * @param $ch
     * @param $option
     * @param $value
     * @return bool
     */
    private function CurlSetopt ($ch, $option, $value) : bool
    {
        return curl_setopt($ch, $option, $value);
    }

    /**
     * @param $ch
     * @param $url
     */
    private function Option_Curl ($ch, $url)
    {
        $this->CurlSetopt($ch, CURLOPT_AUTOREFERER, false);
        $this->CurlSetopt($ch, CURLOPT_REFERER, 'https://www.google.com');
        $this->CurlSetopt($ch, CURLOPT_HEADER, 0);
        $this->CurlSetopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $this->CurlSetopt($ch, CURLOPT_URL, $url);
        $this->CurlSetopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    }

    /**
     * @param string $url
     * @return bool|string
     */
    public function CurlApi (string $url)
    {
        // Init Curl Api !!!
        $ch = curl_init();

        // Initialise Options Curl with method CurlSetopt($ch, $option, $value) !!!
        $this->Option_Curl($ch, $url);

        // Execute the Curl Api !!!
        $data = curl_exec($ch);
        return $data;
    }
}
