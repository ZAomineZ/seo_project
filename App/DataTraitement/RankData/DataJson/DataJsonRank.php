<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/03/20
 * Time: 18:00
 */

namespace App\DataTraitement\RankData\DataJson;


use App\concern\File_Params;

class DataJsonRank
{

    /**
     * @param array $projects
     * @param $auth
     * @return array
     */
    public function dataJson(array $projects, $auth): array
    {
        $dataJson = [];

        foreach ($projects as $project) {
            if (is_string($project)) {
                $slugProject = $project;
                $userProject = $auth->id;
            } else {
                $slugProject = $project->{'slug'};
                $userProject = $project->{'user_id'};
            }

            $directory = dirname(__DIR__, 4) . DIRECTORY_SEPARATOR . 'storage/datas/rankTo/';
            $file = $directory . $slugProject . '-' . $userProject . '.json';

            $dataJson[] = File_Params::OpenFile($file, $directory);
        }

        return $dataJson;
    }

    /**
     * @param array $results
     * @return array
     */
    public function DataRankTopResult(array $results): array
    {
        $dataResult = [];

        foreach ($results as $key => $result) {
            $item = $result->{'dataRankTopByDate'} ?: null;

            if (is_array($item) && isset($item[0])) {
                $dataResult[] = $item[0];
            } else {
                $dataResult[] = $item;
            }
        }

        return $dataResult;
    }
}