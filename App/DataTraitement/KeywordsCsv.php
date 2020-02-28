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
use League\Csv\Reader;
use League\Csv\Statement;

class KeywordsCsv
{
    CONST URL = 'https://online.seranking.com';

    /**
     * @var \stdClass
     */
    private $website;
    /**
     * @var Statement
     */
    private $statementCSV;
    /**
     * @var string
     */
    private $file = '';

    /**
     * KeywordsCsv constructor.
     * @param \stdClass $website
     * @param Statement $statementCSV
     */
    public function __construct(\stdClass $website, Statement $statementCSV)
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
            $readerCSV = Reader::createFromPath($this->file, 'r');
            $readerCSV->setHeaderOffset(1);

            $statement = $this->statementCSV
                ->offset(0)
                ->limit(100);
            $process = $statement->process($readerCSV);
            $records = $process->getRecords();
            $pages = ceil($readerCSV->count() / 100);

            return $this->dataCsv($records, $pages, [0, 99]);
        }

        return [[], 0, [0, 99]];
    }

    public function pagination(?int $page, ?int $offset)
    {
        dd($page, $offset);
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
            $directoryCSV = $dir . DIRECTORY_SEPARATOR . 'csvKeywords/' . date('Y') . DIRECTORY_SEPARATOR . date('m') . DIRECTORY_SEPARATOR;

            if (!file_exists($directoryCSV)) {
                $mkdir = mkdir($directoryCSV, 0777, true);
                if ($mkdir) {
                    $this->file = $directoryCSV . $filename;

                    File_Params::CreateParamsFile($this->file, $directoryCSV, $csv);
                    return File_Params::OpenFile($this->file, $directoryCSV, true);
                }
            }

            $this->file = $directoryCSV . $filename;
            return File_Params::OpenFile($this->file, $directoryCSV, true);
        }
    }

    /**
     * @param \Generator|null $csvData
     * @param float $pages
     * @param array $intervalElement
     * @return array|null
     */
    private function dataCsv(?\Generator $csvData, float $pages, array $intervalElement): array
    {
        $keywords = [];

        foreach ($csvData as $key => $record) {
            if (is_array($record) && !empty($record)) {
                $keywords[$key]['id'] = $key;
                $keywords[$key]['keyword'] = $record['Mot-clé'];
                $keywords[$key]['rank'] = $record['Position'];
                $keywords[$key]['search_volume'] = $record['Volume de recherche.'];
                $keywords[$key]['url'] = $record['URL'];
            }
        }

        return [$keywords, $pages, $intervalElement];
    }
}
