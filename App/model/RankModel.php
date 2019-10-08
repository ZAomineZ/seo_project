<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 02/10/19
 * Time: 03:30
 */

namespace App\Model;

use App\Table\Rank;

class RankModel
{
    /**
     * @var Rank
     */
    private $rankTable;
    /**
     * @var Serp
     */
    private $serp;

    /**
     * RankModel constructor.
     * @param Rank $rankTable
     * @param Serp $serp
     */
    public function __construct(Rank $rankTable, Serp $serp)
    {
        $this->rankTable = $rankTable;
        $this->serp = $serp;
    }

    /**
     * @param array $data
     * @param string $table
     * @return bool
     */
    public function DataInsert(array $data, string $table): bool
    {
        return $this->rankTable->InsertData($data, $table);
    }

    /**
     * @param string $project
     * @param string $website
     * @param string $content
     * @param string $keywords
     * @param $auth
     * @param string|int $id
     * @return array
     */
    public function KeywordsNotEmpty(string $project, string $website, string $content, string $keywords, $auth, $id = null): array
    {
        $keywords = trim($keywords);
        if (strpos($keywords, "\n")) {
            $kArray = explode("\n", $keywords);
            $keywords = implode(',', $kArray);
        }
        $data = [
            'project' => $project,
            'website' => $website,
            'content' => $content,
            'created_at' => date('Y-m-d H:i:s'),
            'keywords' => $keywords,
            'user_id' => $auth->id
        ];
        if ($id) {
            unset($data['user_id']);
            $data['id'] = $id;
            $this->rankTable->UpdateData($data);
        } else {
            $this->DataInsert($data, 'rank');
        }
        return $this->SerpResultKeywords($keywords, $auth);
    }

    /**
     * @param string $project
     * @param string $website
     * @param string $content
     * @param $auth
     * @param null $id
     * @return array
     */
    public function KeywordsEmpty(string $project, string $website, string $content, $auth, $id = null): array
    {
        if ($id) {
            $this->rankTable
                ->UpdateData([
                    'project' => $project,
                    'website' => $website,
                    'content' => $content,
                    'keywords' => null,
                    'created_at' => date('Y-m-d H:i:s'),
                    'id' => $id
                ]);
            return [];
        }
        $this->DataInsert([
            'project' => $project,
            'website' => $website,
            'content' => $content,
            'created_at' => date('Y-m-d H:i:s'),
            'user_id' => $auth->id
        ], 'rank');
        return [];
    }

    /**
     * @param $auth
     * @return array
     */
    public function AllProject($auth): array
    {
        return $this->rankTable->SelectAllProjectByUser($auth->id);
    }

    /**
     * @param array $data
     * @param string $website
     * @param string|int $option
     * @return array
     */
    public function FormatDataRank(array $data, string $website, $option): array
    {
        $dataRank = [];
        $dataDate = [];
        foreach ($data as $key => $value) {
            foreach ($value['rank'] as $k => $v) {
                foreach ($v as $k_ => $v_) {
                    if (strpos($v_, (string)$website) !== false) {
                        $dataRank[$key][$k][$v_] = $k_ + 1;
                        $dataDate[$key] = $value['date'];
                    }
                }
            }
        }
        $dataResultMontly = $this->DataResultRkDate($dataRank, $dataDate, 'd.m');
        $dataResultYears = $this->DataResultRkDate($dataRank, $dataDate, 'M');
        return [
            'dataResultYearly' => $dataResultYears,
            'dataResultMontly' => $dataResultMontly,
            'id' => $option
        ];
    }

    /**
     * @param array $data
     * @param $auth
     * @return array
     */
    public function DataAllProjectRank(array $data, $auth): array
    {
        $dataResult = [];
        foreach ($data as $dt) {
            if (!is_null($dt->keywords)) {
                $dataResultKeywords = $this->SerpResultKeywords($dt->keywords, $auth);
                $dataResult[] = $this->FormatDataRank($dataResultKeywords, $dt->website, $dt->id);
            } else {
                $dataResult[] = [];
            }
        }
        return $dataResult;
    }

    /**
     * @param $auth
     * @param string $project
     * @param string|int|null $id
     */
    public function projectExist($auth, string $project, $id = null)
    {
        $request = $this->ProjectSimilar($auth, $project, $id);
        if ($request === true) {
            echo \GuzzleHttp\json_encode(['error' => 'This name project exist in yours projects presents !!!']);
            die();
        }
    }

    public function ProjectDelete(string $id, $auth)
    {
        $request = $this->projectRank($auth, $id);
        if ($request && $auth->id == $request->user_id) {
            $this->rankTable->deleteProject($auth, $id);
            return true;
        }
        echo \GuzzleHttp\json_encode(['error' => 'You can\'t deleted this project, it belongs to you !!!']);
        die();
    }

    /**
     * @param $auth
     * @param int $limit
     * @return bool
     */
    public function limitProject($auth, int $limit): bool
    {
        $request = $this->rankTable->countProjectByUser($auth->id);
        if ($request && $request->idCount == $limit) {
            echo \GuzzleHttp\json_encode(['error' => 'You can\'t add more than 5 project !!!']);
            die();
        }
        return true;
    }

    /**
     * @param $result
     * @param string $keyword
     * @return array
     */
    private function dataRankByWebsite($result, string $keyword): array
    {
        // Request Html DomCrawler
        $this->serp->LoadHtmlDom($result);

        // Convert Url and Desc SERP int the an array !!!
        $data = $this->serp->DataDateRank(scandir($this->serp->DIRLoad(str_replace('%20', '-', $keyword))), $this->serp->DIRLoad(str_replace('%20', '-', $keyword)));

        // Return Array Result Data for the Front !!!
        return [
            "date_format" => $this->serp->DateFormat($data['date']),
            "date" => $data['date'],
            "rank" => $data['rank']
        ];
    }

    /**
     * @param string $keywords
     * @param $auth
     * @return array
     */
    private function SerpResultKeywords(string $keywords, $auth)
    {
        $dataArray = [];
        $arrKywords = explode(',', $keywords);
        foreach ($arrKywords as $key => $value) {
            $valueFirst = $value;
            if (strpos($value, " ")) {
                $value = str_replace(" ", '-', $valueFirst);
            }
            $data = $this->serp->FileData($value, $valueFirst, $auth->id);
            $dataArray[] = $this->dataRankByWebsite($data, $value);
        }
        return $dataArray;
    }

    /**
     * @param array $dataRank
     * @param array $dataDate
     * @param string $format
     * @return array
     */
    private function DataResultRkDate(array $dataRank, array $dataDate, string $format): array
    {
        $data = [];
        // Array Data Classes the rank in the data !!!
        foreach ($dataDate as $kD => $vD) {
            foreach ($vD as $key => $value) {
                for ($i = 0; $i < count($dataRank); $i++) {
                    if (isset($dataRank[$i][$value])) {
                        $data[$value][$i] = $dataRank[$i][$value];
                    }
                }
            }
        }
        // Rank Combined Array Data by Date
        $dataRankEnd = [];
        $dataRankWebSite = [];
        foreach($data as $dtKey => $dtValue) {
            foreach($dtValue as $dKey =>  $dValue) {
                $dataRankEnd = array_merge($dataRankEnd, $dValue);
            }
            $dataRankWebSite[$dtKey] = $dataRankEnd;
        }
        return $this->ResultDataRankByTop($dataRankWebSite, $format);
    }

    /**
     * @param array $dataRank
     * @param string $format
     * @return array
     */
    private function ResultDataRankByTop(array $dataRank, string $format): array
    {
        $dataByMonth = [];
        if ($format === 'd.m') {
            $data = $this->DataRankTopByWebsite($dataRank, $format);
        } else {
            foreach ($dataRank as $key => $value) {
                $dt = date('Y-m', strtotime($key));
                if (strpos($key, $dt) !== false) {
                    foreach ($value as $k => $v) {
                        $dataByMonth[$dt][$k . '-' . $key] = $v;
                    }
                }
            }
            $data = $this->DataRankTopByWebsite($dataByMonth, $format);
        }

        // Order Array Data by Date !!!
        $dataR = $this->UsortData($data);

        // Return Data Rank
        return $dataR;
    }

    /**
     * @param array $data
     * @return array
     */
    private function UsortData(array $data): array
    {
        /**
         * @var $dataNew array
         */
        $dataNew = [];

        // We utilised usort function for ranked the Data Array !!!
        usort($data, function($v1, $v2) {
            $date_1 = strtotime($v1['dateUsort']);
            $date_2 = strtotime($v2['dateUsort']);
            return $date_1 - $date_2;
        });

        // TransForm Data array !!!
        foreach ($data as $value) {
            $dataNew[$value['date']] = $value;
        }

        // Return new Data Array $dataNew
        return $dataNew;
    }

    /**
     * @param array $data
     * @param string $format
     * @return array
     */
    private function DataRankTopByWebsite (array $data, string $format) : array
    {
        $dataReturn = [];
        foreach ($data as $key => $value) {
            $top1 = 0;
            $top3 = 0;
            $top10 = 0;
            $top50 = 0;
            $top100 = 0;
            foreach ($value as $k => $v) {
                $keyDate = date($format, strtotime($key));
                if ($v === 1) {
                    $top1++;
                    $top3++;
                    $top10++;
                    $top50++;
                    $top100++;
                    $dataReturn[$keyDate]['top1'] = $top1;
                    $dataReturn[$keyDate]['top3'] = $top3;
                    $dataReturn[$keyDate]['top10'] = $top10;
                    $dataReturn[$keyDate]['top50'] = $top50;
                    $dataReturn[$keyDate]['top100'] = $top100;
                } elseif ($v <= 1 || $v <= 3) {
                    $top3++;
                    $top10++;
                    $top50++;
                    $top100++;
                    $dataReturn[$keyDate]['top3'] = $top3;
                    $dataReturn[$keyDate]['top10'] = $top10;
                    $dataReturn[$keyDate]['top50'] = $top50;
                    $dataReturn[$keyDate]['top100'] = $top100;
                } elseif ($v <= 1 || $v <= 10) {
                    $top10++;
                    $top50++;
                    $top100++;
                    $dataReturn[$keyDate]['top10'] = $top10;
                    $dataReturn[$keyDate]['top50'] = $top50;
                    $dataReturn[$keyDate]['top100'] = $top100;
                } elseif ($v <= 1 || $v <= 50) {
                    $top50++;
                    $top100++;
                    $dataReturn[$keyDate]['top50'] = $top50;
                    $dataReturn[$keyDate]['top100'] = $top100;
                } elseif ($v <= 1 || $v <= 100) {
                    $top100++;
                    $dataReturn[$keyDate]['top100'] = $top100;
                }
                $dataReturn[$keyDate]['date'] = $keyDate;
                $dataReturn[$keyDate]['dateUsort'] =  date('Y-m-d', strtotime($key));
            }
        }
        return $dataReturn;
    }

    /**
     * @param $auth
     * @param string $project
     * @param null|string|int $id
     * @return mixed
     */
    private function ProjectSimilar($auth, string $project, $id = null)
    {
        return $this->rankTable->selectProject($auth, $project, $id);
    }

    /**
     * @param $auth
     * @param string $id
     * @return mixed
     */
    private function projectRank($auth, string $id)
    {
        return $this->rankTable->selectRank($id);
    }
}
