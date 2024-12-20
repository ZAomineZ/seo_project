<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 04/03/20
 * Time: 17:45
 */

namespace App\DataTraitement\TraitementCsv;

class DownloadCsv
{
    /**
     * @var array
     */
    private $data;
    /**
     * @var string
     */
    private $file;

    /**
     * DownloadCsv constructor.
     * @param array $data
     * @param string $file
     */
    public function __construct(array $data, string $file)
    {
        $this->data = $data;
        $this->file = $file;
    }

    /**
     * @param array $data
     * @param bool $arrayPush
     */
    public function CsvDownload(array $data, bool $arrayPush = false)
    {
        $this->ColCsv($this->file);

        if (!$arrayPush) {
            $this->convertDataForCSV($data);
        } else {
            foreach ($data as $dt) {
                fputcsv(fopen('php://output', 'w'), $dt);
            }
        }

        fclose(fopen('php://output', 'w'));
        exit();
    }

    /**
     * @param string $filename
     * @return bool
     */
    private function ColCsv(string $filename): bool
    {
        // Format the page Header in CSV !!!
        header('Content-Type: application/csv');
        header('Content-Disposition: attachment; filename=" ' . $filename . '');

        // FLUX php://output, open the file CSV in mode "w" !!!
        $handle = fopen('php://output', 'w');

        // Create the column TITLE CSV file with Function fputcsv !!!
        fputcsv($handle, $this->data);

        return true;
    }

    /**
     * @param array $data
     */
    private function convertDataForCSV(array $data)
    {
        foreach ($data as $dt) {
            if (!is_array($dt)) {
                $data = \GuzzleHttp\json_decode($dt);

                $dataJson = array_map(function ($value) use ($data) {
                    $value = str_replace(' ', '_', $value);
                    $value = str_replace('-', '_', $value);
                    $value = strtolower($value);

                    return $data->{$value};
                }, $this->data);

                fputcsv(fopen('php://output', 'w'), $dataJson);
            } else {
                if (is_array($dt)) {
                    foreach ($dt as $d) {
                        fputcsv(fopen('php://output', 'w'), $d);
                    }
                } else {
                    fputcsv(fopen('php://output', 'w'), $dt);
                }
            }
        }
    }
}
