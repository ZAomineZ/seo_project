<?php
namespace App\QueryElement;

use App\DataTraitement\FileData;
use Generator;

class Pagination
{
    /**
     * @param array|Generator $records
     * @param float|null $pages
     * @param array $intervalElement
     * @param array $paginationNumber
     * @return array
     */
    public function recordsPaginate($records, ?float $pages, array $intervalElement, array $paginationNumber)
    {
        if ($records instanceof Generator) {
            $records = (new FileData())
                ->dataCsv($records, $pages, $intervalElement, $paginationNumber)[0];
        }
        return (new FileData())->dataCsv($records, $pages, $intervalElement, $paginationNumber);
    }
}
