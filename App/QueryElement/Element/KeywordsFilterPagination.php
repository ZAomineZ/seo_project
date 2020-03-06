<?php

namespace App\QueryElement\Element;

use League\Csv\Reader;

class KeywordsFilterPagination extends KeywordsPagination
{
    /**
     * @param string|null $element
     * @param int|null $page
     * @param int|null $offset
     * @param string $pageRemoveIndex
     * @param string $filter
     * @param string $keyFilter
     * @return array
     * @throws \League\Csv\Exception
     */
    public function hydrate(?string $element, ?int $page, ?int $offset, string $pageRemoveIndex = 'false', ?string $filter = null, ?string $keyFilter = null): array
    {
        return parent::hydrate($element, $page, $offset, $pageRemoveIndex, $filter, $keyFilter);
    }

    /**
     * @param array $intervalElement
     * @param Reader $readerCSV
     * @param array|null $dataFilter
     * @return \Generator
     */
    protected function getRecords(array $intervalElement, Reader $readerCSV, ?array $dataFilter = [])
    {
        $statement = $this->statement
            ->where(function (array $records) use ($dataFilter) {
                if ($dataFilter['key'] === 'Position') {
                    return $records[$dataFilter['key']] <= $dataFilter['value'];
                } elseif ($dataFilter['key'] === 'URL') {
                    return $records[$dataFilter['key']] === $dataFilter['value'];
                }
                return $records[$dataFilter['key']] >= $dataFilter['value'];
            });
        $process = $statement->process($readerCSV);
        return $process->getRecords();
    }
}
