<?php

namespace App\DataTraitement\CorrelationData;

use App\concern\Str_options;

class WebsitesData
{
    /**
     * @var array
     */
    private $websites;

    /**
     * WebsitesData constructor.
     * @param array $websites
     */
    public function __construct(array $websites)
    {
        $this->websites = $websites;
    }

    /**
     * @return array
     */
    public function newDataWebsites(): array
    {
        $dataWebsites = array_map(function ($website) {
            return $website->{'website'};
        }, $this->websites);

        return $dataWebsites;
    }
}
