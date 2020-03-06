<?php

namespace App\DataTraitement;

use App\concern\Date_Format;
use App\concern\File_Params;
use Generator;

class FileData
{
    /**
     * @param object $trends
     * @param int $volume
     * @param string $directory
     * @return mixed
     */
    public function createFileTrendsAndVolume(?object $trends, int $volume, string $directory)
    {
        $file = $directory . 'insights.json';

        if (!file_exists($file)) {
            $data = [
                'trends' => $trends,
                'volume' => $volume
            ];
            $dataJson = \GuzzleHttp\json_encode($data);

            if (!file_exists($directory)) {
                mkdir($directory, 0777, true);
            }
            File_Params::CreateParamsFile($file, $directory, $dataJson, TRUE);
        }

        return File_Params::OpenFile($file, $directory, TRUE);
    }

    /**
     * @param string|null|object $data
     * @return null|array
     */
    public function resultData($data): ?array
    {
        if (is_string($data)) {
            $data = \GuzzleHttp\json_decode($data);
        }

        if (!isset($data->trends)) {
            return null;
        }

        $newData = [];
        foreach ($data->{'trends'} as $key => $value) {
            $keyDate = Date_Format::DateFormatReq($key, 'Y-m-d', false);
            $newData['trends'][$keyDate] = $value;
        }

        $newData['volume'] = $data->{'volume'} ?: 0;

        return $newData;
    }

    /**
     * @param Generator|array|null $csvData
     * @param float $pages
     * @param array $intervalElement
     * @param array $paginationNumber
     * @return array|null
     */
    public function dataCsv($csvData, float $pages, array $intervalElement, array $paginationNumber): array
    {
        $keywords = [];

        foreach ($csvData as $key => $record) {
            if (is_array($record) && !empty($record)) {
                $keywords[$key]['id'] = $key ?: 0;
                $keywords[$key]['keyword'] = isset($record['Mot-clé']) ? $record['Mot-clé'] : $record['keyword'];
                $keywords[$key]['rank'] = isset($record['Position']) ? $record['Position'] : $record['rank'];
                $keywords[$key]['search_volume'] = isset($record['Volume de recherche.']) ? $record['Volume de recherche.'] : $record['search_volume'];
                $keywords[$key]['traffic'] = isset($record['Trafic']) ? $record['Trafic'] : $record['traffic'];
                $keywords[$key]['url'] = isset($record['URL']) ? $record['URL'] : $record['url'];
            }
        }

        return [$keywords, $pages, $intervalElement, $paginationNumber];
    }
}
