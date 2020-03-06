<?php

namespace App\DataTraitement;

use App\concern\Str_options;
use App\QueryElement\Element\KeywordsFilterPagination;
use League\Csv\Statement;

final class KeywordsFilter extends KeywordsCsv
{

    /**
     * KeywordsFilter constructor.
     * @param \stdClass $website
     * @param Statement $statementCSV
     */
    public function __construct(\stdClass $website, Statement $statementCSV)
    {
        parent::__construct($website, $statementCSV);
    }

    /**
     * @param string $filter
     * @param string $key
     * @return array
     * @throws \League\Csv\Exception
     */
    public function filterCsv(string $filter, string $key): array
    {
        $domain = Str_options::str_replace_domain($this->website->domain);
        $filename = 'keywords-' . $this->website->token . '.csv';

        $openFileCsv = $this->openCsvFile($domain, $filename);

        if ($openFileCsv) {
            [$records, $pages, $intervalElement, $paginationNumber] =
                (new KeywordsFilterPagination($this->statementCSV))
                    ->hydrate($this->file, 1, 0, 'false', $filter, $key);

            return [$records, $pages, $intervalElement, $paginationNumber];
        }
        return [[], 0, [0, 99], [1, 2, 3]];
    }

    /**
     * @param int|null $page
     * @param int|null $offset
     * @param string|null $filter
     * @param string|null $keyFilter
     * @param string $pageRemoveIndex
     * @return array
     * @throws \League\Csv\Exception
     */
    public function paginationFilter(
        ?int $page,
        ?int $offset,
        ?string $filter,
        ?string $keyFilter,
        string $pageRemoveIndex = 'false'
    ): array
    {
        $webiste =  Str_options::str_replace_domain($this->website->domain) ?: null;
        $filename = 'keywords-' . $this->website->token . '.csv';

        $this->FileCsv($webiste, $filename);

        return (new KeywordsFilterPagination($this->statementCSV))->hydrate($this->file, $page, $offset, $pageRemoveIndex, $filter, $keyFilter);
    }
}
