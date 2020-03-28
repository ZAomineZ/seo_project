<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 25/03/20
 * Time: 16:25
 */

namespace App\Actions\Url;

use App\concern\Str_options;
use App\Helpers\CURL\RollingCurl;
use App\Model\Serp;
use Closure;

class MultiCurlKeywordConcurrent
{
    /**
     * @var array
     */
    private $urls = [];
    /**
     * @var array
     */
    private $names = [];
    /**
     * @var Serp
     */
    private $serp;

    /**
     * MultiCurlKeywordConcurrent constructor.
     * @param Serp $serp
     */
    public function __construct(Serp $serp)
    {
        $this->serp = $serp;
    }

    public function run()
    {
        if (!empty($this->urls)) {
            $rolling = new RollingCurl(3);
            foreach ($this->urls as $key => $url) {
                $url = rawurldecode($url);
                $name = $this->names[$key];
                $options = $this->getOptions();
                $callback = $this->getCallBack($name);

                $rolling->setOptions($options);
                $rolling->setTimeout(150000);
                $rolling->addRequest($url, null, $callback);
            }
            $rolling->execute();
            $this->reset();
        }
    }

    /**
     * @param string|null $url
     */
    public function setUri(?string $url)
    {
        if (!is_null($url)) {
            $this->urls[] = $url;
        }
    }

    /**
     * @param string|null $name
     */
    public function setName(?string $name)
    {
        if (!is_null($name)) {
            $this->names[] = $name;
        }
    }

    /**
     * @return array
     */
    private function getOptions(): array
    {
        return [
            CURLOPT_AUTOREFERER => false,
            CURLOPT_REFERER => 'https://www.google.com',
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_FOLLOWLOCATION => true
        ];
    }

    /**
     * @param string $name
     * @return Closure
     */
    private function getCallBack(string $name): Closure
    {
        return function ($response) use ($name)
        {
            if ($response !== false) {
                $this->serp->createDataSerp($response, $name);
            } else {
                $value = (new Str_options())->strReplaceString('-', ' ', $name);
                $this->serp->newScrapBadResponse($value, $name);
            }
        };
    }

    private function reset()
    {
        $this->urls = [];
        $this->names = [];
    }
}
