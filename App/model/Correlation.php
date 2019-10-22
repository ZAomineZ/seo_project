<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/10/19
 * Time: 02:45
 */

namespace App\Model;


use App\concern\File_Params;
use App\concern\Str_options;
use App\Controller\WebSiteController;
use App\Model\WebSite as WebSiteModel;
use App\Table\Website;
use DateTime;
use stdClass;

class Correlation
{
    /**
     * @var WebSiteController
     */
    private $controller;
    /**
     * @var Website
     */
    private $website;
    /**
     * @var \App\Model\WebSite
     */
    private $model;

    /**
     * Correlation constructor.
     * @param WebSiteController $controller
     * @param Website $website
     * @param \App\Model\WebSite $model
     */
    public function __construct(WebSiteController $controller, Website $website, WebSiteModel $model)
    {
        $this->controller = $controller;
        $this->website = $website;
        $this->model = $model;
    }

    /**
     * @param array $dataSerp
     * @param array $dataTitle
     * @param string $keywordDefault
     * @return array
     * @throws \Exception
     */
    public function CreateOrOpenFile(array $dataSerp, array $dataTitle, string $keywordDefault): array
    {
        $keyDataFirstSerp = array_keys($dataSerp)[0];
        $dataResult = [];

        foreach (array_slice($dataSerp[$keyDataFirstSerp], 0, 10) as $key => $item) {
            // Create Directory String !!!
            $domainArray = Str_options::TransformUrlToDomain($item);

            // Request, verify if item WebSite exist in the database !!!
            $request = $this->website->SelectToken($domainArray['defaultValue']);

            if (!$request) {
                // Wait ...
                sleep(3);

                // Insert New Website in the database with his token !!!
                WebSiteController::ReqDataDomain($domainArray['defaultValue'], WebSiteModel::Token());
            }

            // Request, verify if item WebSite exist in the database !!!
            // Recuperate Token in the database !!!
            $requestToken = $this->website->SelectToken($domainArray['defaultValue']);
            $dir = $this->dirName($domainArray, $requestToken);
            $token = $requestToken->token;

            // Create File String !!!
            $fileDayStats = $this->fileData($dir, 'dash-stats', $token);
            $fileDayData = $this->fileData($dir, $domainArray['valueWebsite'] . '-' . date('Y-m-d'), $token);
            $fileTraffic = $this->fileData($dir, 'traffic', $token);

            if (!is_dir($dir)) {
                $mkdir = mkdir($dir, 0777, true);
                if ($mkdir && !file_exists($fileDayStats) || !file_exists($fileDayData) || !file_exists($fileTraffic)) {
                    if (!$request) {
                        // Create File And Open This Files !!!
                        $this->fileCreateDataStats(
                            $fileDayData, $fileDayStats, $fileTraffic,
                            $dir, $domainArray['defaultValue'], $token);

                        // Implement in the Array Data, the stats Data !!!
                        $dataResult[$domainArray['defaultValue']]['stats'] = File_Params::OpenFile($fileDayStats, $dir);
                        $dataResult[$domainArray['defaultValue']]['traffic'] = File_Params::OpenFile($fileTraffic, $dir);
                        $dataResult[$domainArray['defaultValue']]['title'] = strtolower($dataTitle[$keyDataFirstSerp][$key]);
                        $dataResult[$domainArray['defaultValue']]['url'] = $item;
                        $dataResult[$domainArray['defaultValue']]['keyword'] = $keywordDefault;
                    }
                }
            } else {
                // Verify Date to first call Website is'nt more to 3 month !!!
                $dateBool = $this->dateFileData($requestToken->date, date('Y-m-d'));

                if ($dateBool === true) {
                    // Update The database for update the date !!!
                    $this->website->UpdateDate($domainArray['defaultValue']);

                    // Create File Data And Update File Dash Stats
                    $this->fileCreateDataStats(
                        $fileDayData, $fileDayStats, $fileTraffic,
                        $dir, $domainArray['defaultValue'], $token, TRUE);
                }
                // Implement in the Array Data, the stats Data !!!
                $dataResult[$domainArray['defaultValue']]['stats'] = File_Params::OpenFile($fileDayStats, $dir);
                $dataResult[$domainArray['defaultValue']]['traffic'] = File_Params::OpenFile($fileTraffic, $dir);
                $dataResult[$domainArray['defaultValue']]['title'] = strtolower($dataTitle[$keyDataFirstSerp][$key]);
                $dataResult[$domainArray['defaultValue']]['url'] = $item;
                $dataResult[$domainArray['defaultValue']]['keyword'] = $keywordDefault;
            }
        }

        // Return Array Result Data to File !!!
        return $dataResult;
    }

    /**
     * @param array $domainArray
     * @param $request
     * @return string
     */
    private function dirName(array $domainArray, stdClass $request): string
    {
        // Date to Request Date int the Database !!!
        $directory = $request->directory;

        // Return String directory !!!
        return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR .
            'storage/datas/' . 'website' . DIRECTORY_SEPARATOR .
            $directory .
            DIRECTORY_SEPARATOR . $domainArray['valueWebsite'];
    }

    /**
     * @param string $directory
     * @param string $name
     * @param string $token
     * @return string
     */
    private function fileData(string $directory, string $name, string $token): string
    {
        return $directory . DIRECTORY_SEPARATOR . $name . '-' . $token . '.json';
    }

    /**
     * @param string $fileData
     * @param string $fileDashStats
     * @param string $fileTraffic
     * @param string $dir
     * @param string $domainDefault
     * @param string $token
     * @param bool $update
     * @return bool
     * @throws \Exception
     */
    private function fileCreateDataStats(
        string $fileData,
        string $fileDashStats,
        string $fileTraffic,
        string $dir,
        string $domainDefault,
        string $token,
        bool $update = false
    ): bool
    {
        // Create new file Picture Majestic in LinkProfile
        $this->model->SaveImgPower($domainDefault, $dir, $token);

        // Create File Data Dash Stats And Data today !!!
        File_Params::CreateParamsFile($fileData, $dir, $this->controller->getJsonWebSite($domainDefault, $dir), TRUE);
        if ($update !== false) {
            File_Params::UpdateFile($fileDashStats, $dir, $this->controller->getJsonReferringWeb($domainDefault, FALSE, $fileData, $dir));
        } else {
            File_Params::CreateParamsFile($fileDashStats, $dir, $this->controller->getJsonReferringWeb($domainDefault, TRUE, $fileData, $dir), TRUE);
        }
        File_Params::CreateParamsFile($fileTraffic, $dir, WebSiteController::JsonTrafic($domainDefault), TRUE);
        return true;
    }

    /**
     * @param array $dataResult
     * @return array
     */
    public function dataFormatCorrelation(array $dataResult): array
    {
        $data = [];

        foreach ($dataResult as $key => $value) {
            $statsValue = $value['stats'];
            $traffic = $value['traffic'];

            $data[$key]['stats'] = $statsValue[count($statsValue) - 1];
            $data[$key]['traffic'] = $traffic->data_now->{'0'}->Ot;

            $keyword = str_replace('-', ' ', $value['keyword']);

            if (strpos($value['title'], $keyword) !== false) {
                $data[$key]['title'] = 1;
            } else {
                $data[$key]['title'] = 0;
            }

            if (strpos($value['url'], 'https') !== false) {
                $data[$key]['https'] = 1;
            } else {
                $data[$key]['https'] = 0;
            }

            $data[$key]['titleCharacters'] = $value['title'];
            $data[$key]['UrlCharacters'] = $value['url'];
        }

        return $data;
    }

    /**
     * @param array $dataFormatCorrelation
     * @return array
     */
    public function correlationAverage(array $dataFormatCorrelation): array
    {
        $dataResultMax = [];
        $dataAverage = [];

        // Implemented in the Data Format Correlation new value Ratio !!!
        $dataFormatCorrelation = $this->dataFormatWithNewValue($dataFormatCorrelation, $this->correlationAverageRatio($dataFormatCorrelation));

        // Recuperate Value max for each stats !!!
        $dataResultMax['referring_ip'] = $this->correlationByStats($dataFormatCorrelation, 'ip_subnets', TRUE);
        $dataResultMax['score_rank'] = $this->correlationByStats($dataFormatCorrelation, 'score_rank', TRUE);
        $dataResultMax['trust_rank'] = $this->correlationByStats($dataFormatCorrelation, 'trust', TRUE);
        $dataResultMax['traffic'] = $this->correlationByStats($dataFormatCorrelation, 'traffic');
        $dataResultMax['ratio'] = $this->correlationByStats($this->correlationAverageRatio($dataFormatCorrelation), 'ratio');

        // Average Data !!!
        $dataAverage['referring_ip'] = $this->correlationAverageByStats($dataFormatCorrelation, $dataResultMax, 'referring_ip', 'ip_subnets', TRUE);
        $dataAverage['score_rank'] = $this->correlationAverageByStats($dataFormatCorrelation, $dataResultMax, 'score_rank', 'score_rank', TRUE);
        $dataAverage['trust_rank'] = $this->correlationAverageByStats($dataFormatCorrelation, $dataResultMax, 'trust_rank', 'trust', TRUE);
        $dataAverage['traffic'] = $this->correlationAverageByStats($dataFormatCorrelation, $dataResultMax, 'traffic', 'traffic');
        $dataAverage['ratio'] = $this->correlationAverageByStats($dataFormatCorrelation, $dataResultMax, 'ratio', 'ratio');
        $dataAverage['https'] = $this->correlationAverageData($dataFormatCorrelation, 'https');
        $dataAverage['title'] = $this->correlationAverageData($dataFormatCorrelation, 'title');

        return $dataAverage;
    }

    /**
     * @param array $dataFormatCorrelation
     * @return array
     */
    public function dataTopByWebsite(array $dataFormatCorrelation) : array
    {
        $dataResult = [];

        // Implemented in the Data Format Correlation new value Ratio !!!
        $dataFormatCorrelation = $this->dataFormatWithNewValue($dataFormatCorrelation, $this->correlationAverageRatio($dataFormatCorrelation));

        $dataResult['referring_ip'] = $this->formatTopByWebsite($dataFormatCorrelation, 'ip_subnets', TRUE);
        $dataResult['score_rank'] = $this->formatTopByWebsite($dataFormatCorrelation, 'score_rank', TRUE);
        $dataResult['trust_rank'] = $this->formatTopByWebsite($dataFormatCorrelation, 'trust', TRUE);
        $dataResult['traffic'] = $this->formatTopByWebsite($dataFormatCorrelation, 'traffic');
        $dataResult['ratio'] = $this->formatTopByWebsite($dataFormatCorrelation, 'ratio');
        $dataResult['https'] = $this->formatTopByWebsite($dataFormatCorrelation, 'UrlCharacters');
        $dataResult['title'] = $this->formatTopByWebsite($dataFormatCorrelation, 'titleCharacters');

        return $dataResult;
    }

    /**
     * @param array $dataCorrelation
     * @param string $stat
     * @param bool $stats
     * @return array
     */
    private function correlationByStats(array $dataCorrelation, string $stat, bool $stats = false): array
    {
        $dataMax = [];
        $dataWebsite = [];
        $dataWebsiteAll = [];
        $websiteMax = '';

        // Implemented in the Array dataMax All value stat !!!
        foreach ($dataCorrelation as $key => $item) {
            if ($stats) {
                $dataMax[] = $item['stats']->{$stat};
                $dataWebsite[] = $key;
            } else {
                $dataMax[] = $item[$stat];
                $dataWebsite[] = $key;
            }
        }

        // Recuperate the value max to Array dataMax !!!
        $maxValue = max($dataMax);

        // Recuperate WebSite Where the value is the more long !!!
        foreach ($dataWebsite as $website) {
            if ($stats) {
                if ($dataCorrelation[$website]['stats']->{$stat} === $maxValue) {
                    $websiteMax .= $website . ',';
                }
                $dataWebsiteAll[] = $website;
            } else {
                if ($dataCorrelation[$website][$stat] === $maxValue) {
                    $websiteMax .= $website . ',';
                }
                $dataWebsiteAll[] = $website;
            }
        }
        return [
            'maxValue' => max($dataMax),
            'webSiteData' => $websiteMax,
            'dataWebsiteAll' => $dataWebsiteAll
        ];
    }

    /**
     * @param array $dataFormatCorrelation
     * @param array $stats
     * @param string $statName
     * @param string $stat
     * @param bool $statBool
     * @return array
     */
    private function correlationAverageByStats(array $dataFormatCorrelation, array $stats, string $statName, string $stat, bool $statBool = false)
    {
        /**
         * Data classed top 3 stats to the Serp
         * @var array
         */
        $dataTop = [];
        $top3Stat = [];
        $top5Stat = [];
        $top10Stat = [];

        /**
         * Int for calc the average for the Top 3, Top 5, Top 10 !!!
         * @var int
         */
        $top3Int = 0;
        $top5Int = 0;
        $top10Int = 0;
        $valueWebsiteTop3 = 0;
        $valueWebsiteTop5 = 0;
        $valueWebsiteTop10 = 0;

        /**
         * Data Average Final !!!
         * @var array
         */
        $dataAverage = [];

        // Create Data Top Stats for classed the stats Average by Top 3, Top 5, Top 10 !!!
        foreach ($stats as $key => $value) {
            if ($key === $statName) {
                $data = explode(',', $value['webSiteData']);
                $dataFilter = array_filter($data, function ($value) {
                    return $value !== '';
                });
                foreach ($value['dataWebsiteAll'] as $item) {
                    if ($statBool) {
                        if ($dataFormatCorrelation[$item]['stats']->{$stat} === $value['maxValue']) {
                            foreach ($dataFilter as $website) {
                                $dataTop[$website][$statName]['maxValue'] = $value['maxValue'];
                                $dataTop[$website][$statName]['website'] = $website;
                            }
                        } else {
                            $top3Stat = array_slice($dataFormatCorrelation, 0, 3);
                            $top5Stat = array_slice($dataFormatCorrelation, 0, 5);
                            $top10Stat = array_slice($dataFormatCorrelation, 0, 10);
                        }
                    } else {
                        if (isset($dataFormatCorrelation[$item][$stat])) {
                            if ($dataFormatCorrelation[$item][$stat] === $value['maxValue']) {
                                foreach ($dataFilter as $website) {
                                    $dataTop[$website][$statName]['maxValue'] = $value['maxValue'];
                                    $dataTop[$website][$statName]['website'] = $website;
                                }
                            } else {
                                $top3Stat = array_slice($dataFormatCorrelation, 0, 3);
                                $top5Stat = array_slice($dataFormatCorrelation, 0, 5);
                                $top10Stat = array_slice($dataFormatCorrelation, 0, 10);
                            }
                        }
                    }
                }
            }
        }

        // Format Top Array for Calcul the average !!!
        foreach ($top3Stat as $kk => $vl) {
            if ($statBool) {
                if ($vl['stats']->{$stat} !== $stats[$statName]['maxValue']) {
                    $top3Int += $vl['stats']->{$stat};
                }
            } else {
                if ($vl[$stat] !== $stats[$statName]['maxValue']) {
                    $top3Int += $vl[$stat];
                }
            }
        }
        foreach ($top5Stat as $kk => $vl) {
            if ($statBool) {
                if ($vl['stats']->{$stat} !== $stats[$statName]['maxValue']) {
                    $top5Int += $vl['stats']->{$stat};
                }
            } else {
                if ($vl[$stat] !== $stats[$statName]['maxValue']) {
                    $top5Int += $vl[$stat];
                }
            }
        }
        foreach ($top10Stat as $kk => $vl) {
            if ($statBool) {
                if ($vl['stats']->{$stat} !== $stats[$statName]['maxValue']) {
                    $top10Int += $vl['stats']->{$stat};
                }
            } else {
                if ($vl[$stat] !== $stats[$statName]['maxValue']) {
                    $top10Int += $vl[$stat];
                }
            }
        }

        // Function Data Foreach Average
        foreach ($dataTop as $key => $value) {
            foreach ($value as $kk => $vl) {
                $keysTop3 = array_keys($top3Stat);
                $keysTop5 = array_keys($top5Stat);
                $keysTop10 = array_keys($top10Stat);
            }

            // Top 3 Array Keys Website : For Know if the website is the value max or not !!!
            if (!in_array($vl['website'], $keysTop3)) {
                $dataAverage['top3']['average'] = (($top3Int / 3) / $vl['maxValue']) * 100;
            } else {
                $valueWebsiteTop3 += 1;
                $dataAverage['top3']['average'] = (($top3Int / (3 - $valueWebsiteTop3)) / ($vl['maxValue']) * 100);
            }

            // Top 5 Array Keys Website : For Know if the website is the value max or not !!!
            if (!in_array($vl['website'], $keysTop5)) {
                $dataAverage['top5']['average'] = (($top5Int / 5) / ($vl['maxValue']) * 100);
            } else {
                $valueWebsiteTop5 += 1;
                $dataAverage['top5']['average'] = (($top5Int / (5 - $valueWebsiteTop5)) / ($vl['maxValue']) * 100);
            }

            // Top 10 Array Keys Website : For Know if the website is the value max or not !!!
            if (!in_array($vl['website'], $keysTop10)) {
                $dataAverage['top10']['average'] = (($top10Int / 10) / ($vl['maxValue']) * 100);
            } else {
                $valueWebsiteTop10 += 1;
                $dataAverage['top10']['average'] = (($top10Int / (10 - $valueWebsiteTop10)) / ($vl['maxValue']) * 100);
            }
            $dataAverage['maxValue'] = $vl['maxValue'];
        }
        return $dataAverage;
    }

    /**
     * @param array $dataFormatCorrelation
     * @param string $keySearch
     * @return array
     */
    private function correlationAverageData(array $dataFormatCorrelation, string $keySearch): array
    {
        $dataItems = [];

        $countItemTrueTop3 = 0;
        $countItemTrueTop5 = 0;
        $countItemTrueTop10 = 0;

        // Implemented in the array DataItems the result to key $key !!!
        if (!empty($dataFormatCorrelation)) {
            foreach ($dataFormatCorrelation as $key => $value) {
                $dataItems[$key][$key] = $value[$keySearch];
            }
        }

        // Average to $keySearch !!!

        // Array Data Top 3, Top 5, Top 10
        $top3_Data = array_slice($dataItems, 0, 3);
        $top5_Data = array_slice($dataItems, 0, 5);
        $top10_Data = array_slice($dataItems, 0, 10);

        $countItemsTop3 = count($top3_Data);
        $countItemsTop5 = count($top5_Data);
        $countItemsTop10 = count($top10_Data);

        // Top 3 Data Count Items Average
        foreach ($top3_Data as $k => $v) {
            foreach ($v as $item) {
                if ($item === 1) {
                    $countItemTrueTop3 += 1;
                }
            }
        }

        // Top 5 Data Count Items Average
        foreach ($top5_Data as $k => $v) {
            foreach ($v as $item) {
                if ($item === 1) {
                    $countItemTrueTop5 += 1;
                }
            }
        }

        // Top 10 Data Count Items Average
        foreach ($top10_Data as $k => $v) {
            foreach ($v as $item) {
                if ($item === 1) {
                    $countItemTrueTop10 += 1;
                }
            }
        }

        return [
            'top3' => [
                'average' => ($countItemTrueTop3 / $countItemsTop3) * 100
            ],
            'top5' => [
                'average' => ($countItemTrueTop5 / $countItemsTop5) * 100
            ],
            'top10' => [
                'average' => ($countItemTrueTop10 / $countItemsTop10) * 100
            ]
        ];
    }

    /**
     * @param array $dataFormatCorrelation
     * @return array
     */
    private function correlationAverageRatio(array $dataFormatCorrelation): array
    {
        $dataRatio = [];

        // Data Array implemented Ration to Rank Score And Trust Rank
        foreach ($dataFormatCorrelation as $key => $value) {
            if (isset($value['stats'])) {
                $stats = $value['stats'];
                $dataRatio[$key]['ratio'] = ($stats->trust / $stats->score_rank) * 100;
            }
        }

        return $dataRatio;
    }

    /**
     * @param array $dataFormatCorrelation
     * @param array $ratio
     * @return array
     */
    private function dataFormatWithNewValue(array $dataFormatCorrelation, array $ratio): array
    {
        $newData = [];

        // Implemented new Value Ratio
        foreach ($dataFormatCorrelation as $key => $value) {
            $newData[$key]['stats'] = $value['stats'];
            $newData[$key]['traffic'] = $value['traffic'];
            $newData[$key]['title'] = $value['title'];
            $newData[$key]['https'] = $value['https'];
            $newData[$key]['ratio'] = $ratio[$key]['ratio'];
            $newData[$key]['UrlCharacters'] = $value['UrlCharacters'];
            $newData[$key]['titleCharacters'] = $value['titleCharacters'];
        }

        return $newData;
    }

    /**
     * @param array $dataFormatCorrelation
     * @param string $keySearch
     * @param bool $statBool
     * @return array
     */
    private function formatTopByWebsite(array $dataFormatCorrelation, string $keySearch, bool $statBool = false): array
    {
        $data = [];

        if (!empty($dataFormatCorrelation)) {
            foreach ($dataFormatCorrelation as $key => $value) {
                if ($keySearch === 'UrlCharacters' || $keySearch === 'titleCharacters') {
                    $data[$key]['value'] = $statBool ? strlen($value['stats']->{$keySearch}) : strlen($value[$keySearch]);
                    $data[$key]['website'] = $key;
                } else {
                    $data[$key]['value'] = $statBool ? $value['stats']->{$keySearch} : $value[$keySearch];
                    $data[$key]['website'] = $key;
                }
            }
        }

        return $data;
    }

    /**
     * @param string $dateRequest
     * @param string $dateToday
     * @return bool
     * @throws \Exception
     */
    private function dateFileData(string $dateRequest, string $dateToday)
    {
        $dateRequest = date('Y-m-d', strtotime($dateRequest));

        $dateDiffRequest = new DateTime($dateRequest);
        $dateDiffToday = new DateTime($dateToday);
        $interval = $dateDiffToday->diff($dateDiffRequest);

        // Verify If the date to request has interval to 3 month with the today date !!!
        // We returned true else false !!!
        if ($interval && $interval->m >= 3) {
            return true;
        }
        return false;
    }
}
