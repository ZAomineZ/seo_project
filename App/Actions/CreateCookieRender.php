<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 07/04/20
 * Time: 15:55
 */

namespace App\Actions;


use App\concern\File_Params;

class CreateCookieRender
{
    /**
     * @var string
     */
    private $file;
    /**
     * @var string
     */
    protected $cookie = 'Cookie: ';

    /**
     * CreateCookieRender constructor.
     * @param string $file
     */
    public function __construct(string $file)
    {
        $this->file = $file;
    }

    /**
     * @return string
     */
    public function init(): string
    {
        $data = File_Params::OpenFile($this->file);

        $this->setCookie($data, 'PHPSESSID');
        $this->setCookie($data, 'device-source');
        $this->setCookie($data, 'device-referrer');
        $this->setCookie($data, 'auto_login_cookie', true);

        return $this->cookie;
    }

    /**
     * @param array $dataCookies
     * @param string $name
     * @param bool $endCookie
     */
    private function setCookie(array $dataCookies, string $name, bool $endCookie = false)
    {
        if (!empty($dataCookies)) {
            foreach ($dataCookies as $cookie) {
                if ($cookie->name === $name) {
                    $point = $endCookie ? ';' : '; ';
                    $this->cookie .= $cookie->name . '=' . $cookie->value . $point;
                }
                $this->cookie .= '';
            }
        }
    }
}
