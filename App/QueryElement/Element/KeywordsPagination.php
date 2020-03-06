<?php
namespace App\QueryElement\Element;

use App\QueryElement\Pagination;
use Generator;
use League\Csv\Reader;
use League\Csv\Statement;

/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 28/02/20
 * Time: 10:42
 */

class KeywordsPagination extends Pagination
{
    /**
     * @var Statement
     */
    protected $statement;
    /**
     * @var array
     */
    private $newRecords = [];
    /**
     * @var int
     */
    private $countRecords = 0;

    /**
     * KeywordsPagination constructor.
     * @param Statement $statement
     */
    public function __construct(Statement $statement)
    {
        $this->statement = $statement;
    }

    /**
     * @param string|null $element
     * @param int|null $page
     * @param int|null $offset
     * @param string $pageRemoveIndex
     * @param string|null $filter
     * @param string|null $keyFilter
     * @return array
     * @throws \League\Csv\Exception
     */
    public function hydrate(?string $element, ?int $page, ?int $offset, string $pageRemoveIndex = 'false', ?string $filter = null, ?string $keyFilter = null): array
    {
        $offset = $offset ?: 0;
        $page = $page ?: 1;
        $intervalPageRemove = [(100 * $page) - 100, ($offset * 100) - 100];

        $intervalElement = $pageRemoveIndex === 'true' ? $intervalPageRemove : [($offset * 100), (100 * $page)];

        $readerCSV = Reader::createFromPath($element, 'r');
        $readerCSV->setHeaderOffset(1);

        if (is_null($filter) || is_null($keyFilter)) {
            $records = $this->getRecords($intervalElement, $readerCSV);
        } else {
            $dataFilter = [
                'value' => $filter,
                'key' => $keyFilter
             ];
            $records = $this->getRecords($intervalElement, $readerCSV, $dataFilter);
        }

        $this->countRecords($records);
        $count = is_null($filter) || is_null($keyFilter) ? $readerCSV->count() : $this->countRecords;

        $pages = ceil($count / 100);
        $paginationNumber = $this->paginationNumber($page, $pages);
        $intervalElement = $this->intervalRecords($intervalElement, $count);

        $offsetRecords = is_null($filter) || is_null($keyFilter) ? 0 : $intervalElement[0];
        $records = array_slice($this->newRecords, $offsetRecords, 100);

        return $this->recordsPaginate($records, $pages, $intervalElement, $paginationNumber);
    }

    /**
     * @return array
     */
    public function getKeywords(): array
    {
        return $this->newRecords;
    }

    /**
     * @param array $intervalElement
     * @param Reader $readerCSV
     * @param array|null $dataFilter
     * @return Generator
     * @throws \League\Csv\Exception
     */
    protected function getRecords(array $intervalElement, Reader $readerCSV, ?array $dataFilter = [])
    {
        $statement = $this->statement->offset($intervalElement[0]);
        $process = $statement->process($readerCSV);
        return $process->getRecords();
    }

    /**
     * @param Generator $records
     * @return void
     */
    private function countRecords(Generator $records): void
    {
        foreach ($records as $record) {
            $this->newRecords[] = $record;
        }

        $this->countRecords = count($this->newRecords);
    }

    /**
     * @param array $intervalElement
     * @param int $countRecords
     * @return array
     */
    private function intervalRecords(array $intervalElement, int $countRecords): array
    {
        if ($countRecords < 100) {
            return [0, $countRecords];
        }
        return $intervalElement;
    }

    /**
     * @param int $page
     * @param float $pages
     * @return array
     */
    private function paginationNumber(int $page, float $pages): array
    {
        if ($pages === 1.0 || $pages === 0.0) {
            return [];
        }

        if ($page === 1 && $pages >= 3) {
            return [1, 2, 3];
        } elseif ($page === 1 && $pages >= 2) {
            return [1, 2];
        } elseif ($page === 2 && $pages === 2.0) {
            return [1, 2];
        } elseif ($page !== 1 && $page < $pages) {
            return [$page - 1, $page, $page + 1];
        } else {
            return [$page - 2, $page - 1, $page];
        }
    }
}
