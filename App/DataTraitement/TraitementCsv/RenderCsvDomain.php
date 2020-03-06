<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 04/03/20
 * Time: 18:19
 */

namespace App\DataTraitement\TraitementCsv;


use App\DataTraitement\TraitementString\DomainsData;

class RenderCsvDomain
{
    /**
     * @var DomainsData
     */
    private $domainsData;

    /**
     * RenderCsvDomain constructor.
     * @param DomainsData $domainsData
     */
    public function __construct(DomainsData $domainsData)
    {

        $this->domainsData = $domainsData;
    }

    /**
     * @param string $domains
     * @throws \League\Csv\Exception
     */
    public function renderCSV(string $domains)
    {
        $this->domainsData->split($domains);

        $dataKeywords = $this->domainsData->dataKeywords();
        $downloadCsv = new DownloadCsv([
            'Domain',
            'Keyword',
            'Rank',
            'Search Volume',
            'Url',
            'Traffic'
        ], 'allKeywords.csv');

        $downloadCsv->CsvDownload($dataKeywords);
    }
}
