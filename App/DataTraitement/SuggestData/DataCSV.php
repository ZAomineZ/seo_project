<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 30/03/20
 * Time: 12:59
 */

namespace App\DataTraitement\SuggestData;


class DataCSV
{
    /**
     * @var array
     */
    private $data;

    /**
     * DataCSV constructor.
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function formatData(): array
    {
        $dataBasic = $this->renderDataBasic($this->data);
        $dataAlphabet = $this->renderDataAlphabet($this->data);

        $data = array_merge($dataBasic, $dataAlphabet);

        return $data;
    }

    /**
     * @param array $data
     * @return array
     */
    private function renderDataBasic(array $data): array
    {
        $dataFirst = array_merge($data[0] ?? [], $data[1] ?? []);
        $dataSecond = array_merge($data[2] ?? [], $data[3] ?? []);

        $newData = array_merge($dataFirst, $dataSecond);

        $data = [];
        foreach ($newData as $key =>  $item) {
            $data[$key][] = $item['title'] ?? '';
        }

        return $data;
    }

    /**
     * @param array $data
     * @return array
     */
    private function renderDataAlphabet(array $data): array
    {
        $dataAlphabet = $data[4] ?? [];

        $newData = [];
        foreach ($dataAlphabet as $key => $item) {
            foreach ($item as $value) {
                $newData[][] = $value['title'] ?? '';
            }
        }

        return $newData;
    }
}
