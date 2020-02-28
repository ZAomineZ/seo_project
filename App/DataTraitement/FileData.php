<?php

namespace App\DataTraitement;

use App\concern\Date_Format;
use App\concern\File_Params;

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
}
