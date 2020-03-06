<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 27/02/20
 * Time: 16:35
 */

namespace App\DataTraitement;


use App\concern\File_Params;
use App\concern\Str_options;
use App\QueryElement\Element\KeywordsPagination;
use App\Table\Website;
use League\Csv\Reader;
use League\Csv\Statement;

class KeywordsCsv
{
    CONST URL = 'https://online.seranking.com';

    /**
     * @var \stdClass
     */
    protected $website;
    /**
     * @var Statement
     */
    protected $statementCSV;
    /**
     * @var string
     */
    protected $file = '';
    /**
     * @var string
     */
    protected $directoryCSV = '';

    /**
     * KeywordsCsv constructor.
     * @param $website
     * @param Statement $statementCSV
     */
    public function __construct($website, Statement $statementCSV)
    {
        $this->website = $website;
        $this->statementCSV = $statementCSV;
    }

    /**
     * @param object|null $response
     * @return array|null
     * @throws \League\Csv\Exception
     */
    public function all(?object $response): ?array
    {
        if (is_null($response)) {
            return null;
        }

        $CSVDownload = self::URL . $response->{'url'};

        $csvFile = $this->createFileCsv($CSVDownload);

        if ($csvFile) {
            $keywordsPagination = new KeywordsPagination($this->statementCSV);
            [$records, $pages, $intervalElement, $paginationNumber] = $keywordsPagination->hydrate($this->file, 1, 0);

            return [$records, $pages, $intervalElement, $paginationNumber];
        }

        return [[], 0, [0, 99], [1, 2, 3]];
    }

    /**
     * @param int|null $page
     * @param int|null $offset
     * @param string $pageRemoveIndex
     * @return array
     * @throws \League\Csv\Exception
     */
    public function pagination(?int $page, ?int $offset, string $pageRemoveIndex = 'false')
    {
        $webiste =  Str_options::str_replace_domain($this->website->domain) ?: null;
        $filename = 'keywords-' . $this->website->token . '.csv';

        $this->FileCsv($webiste, $filename);

        return (new KeywordsPagination($this->statementCSV))->hydrate($this->file, $page, $offset, $pageRemoveIndex);
    }

    /**
     * @param string $domain
     * @param string $filename
     * @param \stdClass $website
     * @return array
     * @throws \League\Csv\Exception
     */
    public function getKeywords(string $domain, string $filename, \stdClass $website): array
    {
        $this->website = $website;

        $this->FileCsv($domain, $filename);

        $keywordsPagination = new KeywordsPagination($this->statementCSV);
        $keywordsPagination->hydrate($this->file, 1, 0);
        $records = $keywordsPagination->getKeywords();

        return $records;
    }

    /**
     * @param string $domain
     * @param string $filename
     * @return mixed
     */
    protected function openCsvFile(string $domain, string $filename)
    {
        $this->FileCsv($domain, $filename);
        return File_Params::OpenFile($this->file, $this->directoryCSV, true);
    }

    /**
     * @param string $csv
     * @return bool
     */
    private function createFileCsv(string $csv): bool
    {
        $website = $this->website;

        $domain = Str_options::str_replace_domain($website->domain) ?: null;
        $dir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage/datas/website/' . $website->directory . DIRECTORY_SEPARATOR . $domain;

        if (file_exists($dir)) {
            $filename = 'keywords-' . $website->token . '.csv';
            $this->FileCsv($domain, $filename);

            if (!file_exists($this->directoryCSV)) {
                $mkdir = mkdir($this->directoryCSV, 0777, true);
                if ($mkdir) {
                    File_Params::CreateParamsFile($this->file, $this->directoryCSV, $csv);
                    return File_Params::OpenFile($this->file, $this->directoryCSV, true);
                }
            }

            return $this->openCsvFile($domain, $filename);
        }
    }

    /**
     * @param string $domain
     * @param string $filename
     */
    protected function FileCsv(string $domain, string $filename): void
    {
        $dir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage/datas/website/' . $this->website->directory . DIRECTORY_SEPARATOR . $domain;
        $this->directoryCSV = $dir . DIRECTORY_SEPARATOR . 'csvKeywords/' . date('Y') . DIRECTORY_SEPARATOR . date('m') . DIRECTORY_SEPARATOR;

        $this->file = $this->directoryCSV . $filename;
    }
}
