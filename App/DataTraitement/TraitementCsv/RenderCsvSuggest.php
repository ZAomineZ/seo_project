<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 30/03/20
 * Time: 12:54
 */

namespace App\DataTraitement\TraitementCsv;


use App\concern\Str_options;
use App\DataTraitement\SuggestData\DataCSV;

class RenderCsvSuggest
{
    /**
     * @var array
     */
    private $data;
    /**
     * @var string
     */
    private $keyword;

    /**
     * RenderCsvSuggest constructor.
     * @param array $data
     * @param string $keyword
     */
    public function __construct(array $data, string $keyword)
    {
        $this->data = array_values($data);
        $this->keyword = $keyword;
    }

    /**
     * Render CSV for keywords Suggest
     */
    public function renderCSV(): void
    {
        $keyword = (new Str_options())->strReplaceString('-', ' ', $this->keyword);
        $data = (new DataCSV($this->data))->formatData();

        $downloadCsv = new DownloadCsv([
            'Keyword'
        ], 'suggestKeywords.csv');
        $downloadCsv->CsvDownload($data, true);
    }
}
