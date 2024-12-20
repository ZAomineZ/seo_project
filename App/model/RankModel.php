<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 02/10/19
 * Time: 03:30
 */

namespace App\Model;

use App\Actions\Url\MultiCurl_VolumeResult;
use App\Actions\Url\MultiCurlKeywordConcurrent;
use App\concern\Str_options;
use App\DataTraitement\RankData\KeywordsTraitement;
use App\ErrorCode\Exception\NullableException;
use App\ErrorCode\NullableType;
use App\Helpers\RenderMessage;
use App\Table\Auth\LogIn;
use App\Table\Rank;
use Illuminate\Support\Str;

class RankModel
{
    /**
     * @var Rank
     */
    private $rankTable;
    /**
     * @var Serp
     */
    public $serp;

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
     * @param string $project
     * @return bool
     */
    public function findOrFail(string $project)
    {
        $bdd = $this->rankTable->findOrFail($project);
        if ($bdd === false) {
            (new RenderMessage())->messageError('This Project dont\' exist in our database !!!');
        }
        return true;
    }

    /**
     * Verify If the news keywords exist already or no !!!
     * @param string $value
     * @param null|string $keywordsProject
     */
    public static function keywordExist(string $value, ?string $keywordsProject)
    {
        if (!empty($keywordsProject) || !is_null($keywordsProject)) {
            $value = explode(',', $value);
            $keywordsProject = explode(',', $keywordsProject);
            $newKeywords = array_diff_key($value, $keywordsProject);

            foreach ($newKeywords as $item) {
                if (in_array($item, $keywordsProject)) {
                    $dataKeywords = array_merge($keywordsProject, $newKeywords);
                    $keywords = array_unique($dataKeywords);

                    echo \GuzzleHttp\json_encode([
                        'error' => 'One or many existing keywords already in the project, we deleted that, click on add again !!!',
                        'keywords' => implode(', ', $keywords)
                    ]);
                    die();
                }
            }
        }
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
     * @throws NullableException
     */
    public function KeywordsNotEmpty(string $project, string $website, string $content, string $keywords, $auth, $id = null): array
    {
        $request = $this->rankTable->selectRank($id);

        // Format keywords in array Data !!!
        $keywords = (new KeywordsTraitement($this, $keywords))->formatKeywords($request);

        // Limit Count Keywords by Project !!!
        $this->limitKeywords($request ? $request->keywords : '', $keywords);
        $this->RegexKeywords($keywords);

        $projectSlug = (new Str_options())->strReplaceString('.', '-', $project);
        $slug = Str::slug($projectSlug);
        $data = [
            'project' => $project,
            'slug' => $slug,
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

        return [
            'keywords' => $keywords
        ];
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
        $projectSlug = (new Str_options())->strReplaceString('.', '-', $project);
        $slug = Str::slug($projectSlug);

        if ($id) {
            $this->rankTable
                ->UpdateData([
                    'project' => $project,
                    'slug' => $slug,
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
            'slug' => (new Str_options())->strReplaceString('.', '-', $slug),
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
     * @param bool $dataRankReq
     * @param array|null $keywords
     * @return array
     */
    public function FormatDataRank(array $data, string $website, $option, bool $dataRankReq = false, array $keywords = null): array
    {
        $dataRank = [];
        $dataDate = [];
        $dataRankEnd = [];

        if (!empty($data)) {
            $i = 0;
            foreach ($data as $key => $value) {
                $countValueRank = count($value['rank']);
                $valueRank = $countValueRank >= 240 ? array_slice($value['rank'], $countValueRank - 240) : $value['rank'];
                foreach ($valueRank as $k => $v) {
                    foreach ($v as $k_ => $v_) {
                        $i++;
                        if (strpos($v_, (string)$website) !== false) {
                            $dataRank[$key][$k][$i]['rank'] = $k_ + 1;
                            $dataRank[$key][$k][$i]['url'] = $v_;
                            if (!is_null($keywords)) {
                                $dataRank[$key][$k][$i]['keyword'] = $keywords[$key];
                            }
                            $dataDate[$key] = $value['date'];
                        } else {
                            $dataRank[$key][$k][0]['rank'] = 0;
                            $dataRank[$key][$k][0]['url'] = $website;
                            if (!is_null($keywords)) {
                                $dataRank[$key][$k][0]['keyword'] = $keywords[$key];
                            }
                            $dataDate[$key] = $value['date'];
                        }
                    }
                }
                foreach ($dataRank as $kk => $item) {
                    if (isset($dataRank[$key])) {
                        foreach ($item as $kVal => $dVal) {
                            foreach ($dVal as $kkKey => $vvValue) {
                                $dataRankEnd[$kk][$kVal][$kkKey]['rank'] = $vvValue['rank'];
                                $dataRankEnd[$kk][$kVal][$kkKey]['url'] = $vvValue['url'];
                                if (!is_null($keywords)) {
                                    $dataRankEnd[$kk][$kVal][$kkKey]['keyword'] = $vvValue['keyword'];
                                }
                            }
                        }
                    } else {
                        $keyArray = $key;
                        foreach ($data[$key]['rank'] as $keyy => $valuee) {
                            $dataRankEnd[$keyArray][$keyy][0]['rank'] = 0;
                            $dataRankEnd[$keyArray][$keyy][0]['url'] = 'Not Found';
                            if (!is_null($keywords)) {
                                $dataRankEnd[$keyArray][$keyy][0]['keyword'] = $keywords[$keyArray];
                            }
                        }
                    }
                }
            }

            if ($dataRankReq !== false) {
                return $dataRankEnd;
            }

            $dataResultMontly = $this->DataResultRkDate($dataRankEnd, $dataDate, 'Y.d.m', $keywords);
            $dataResultYears = $this->DataResultRkDate($dataRankEnd, $dataDate, 'M', $keywords);



            return [
                'dataResultYearly' => $dataResultYears,
                'dataResultMontly' => $dataResultMontly,
                'id' => $option
            ];
        }
        return [
            'dataResultYearly' => [],
            'dataResultMontly' => [],
            'id' => $option
        ];
    }

    /**
     * @param array $data
     * @param $auth
     * @param array $keywords
     * @param array $newKeywords
     * @return array
     */
    public function DataAllProjectRank(array $data, $auth, array $keywords = [], array $newKeywords = []): array
    {
        $dataResult = [];
        $keywordsArray = [];

        foreach ($data as $key => $dt) {
            if (!is_null($dt->keywords)) {
                if (strpos($dt->keywords, ',') !== false) {
                    $keywordsArray = explode(',', $dt->keywords);
                } else {
                    $keywordsArray[] = $dt->keywords;
                }

                $keywordsArray = !empty($keywords) ? array_values(array_diff($keywords, $keywordsArray)) : $keywordsArray;
                if (empty($keywordsArray)) {
                    $keywordsArray = $keywords;
                }
                $keywords = implode(',', $keywordsArray);
                $newKeywords = array_values(array_diff($keywordsArray, $newKeywords));

                $dataResultKeywords = $this->SerpResultKeywords($keywords, $auth, false, null, $dt->slug, $newKeywords);
                $dataResult[] = $this->FormatDataRank($dataResultKeywords, $dt->website, $dt->id, false, $keywordsArray);
            } else {
                $dataResult[$key]['id'] = $dt->id;
                $dataResult[$key]['dataResultYearly'] = [];
                $dataResult[$key]['dataResultMontly'] = [];
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

    /**
     * @param string $id
     * @param $auth
     * @return bool
     */
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
     * @param string $project
     * @param $auth
     * @param array $keywordsDefault
     * @return array
     */
    public function projectUser(string $project, $auth, array $keywordsDefault = [])
    {
        $auth = \GuzzleHttp\json_decode($auth);

        $request = $this->rankTable->selectProjectBySlug($auth, $project);

        if ($request) {
            if ($request->keywords != '') {
                // Params Attr
                $keywords = trim($request->keywords);
                $keywordsCount = 1;
                $keywordsArray = [];

                // If project get many keywords, we create an array Data Keywords And we the count !!!
                if (strpos($keywords, ',') !== false) {
                    $keywordsArray = explode(',', $keywords);
                    $keywordsCount = count($keywordsArray);
                } else {
                    $keywordsArray[] = $keywords;
                }
                $keywordsArray = !empty($keywordsDefault) ? array_values(array_diff($keywordsArray, $keywordsDefault)) : $keywordsArray;
                if (empty($keywordsArray)) {
                    $keywordsArray = $keywordsDefault;
                }
                $keywords = implode(',', $keywordsArray);

                $id = $request->id;
                $website = $request->website;

                // Data Rank By Keywords
                $data = $this->SerpResultKeywords($keywords, $auth);
                // Return And Format Rank Array Data by Day !!!
                $dataResultKeywords = $this->FormatDataRank($data, $website, $id, FALSE, $keywordsArray);

                return [
                    'countKeywords' => $keywordsCount,
                    'arrayKeywords' => $keywordsArray,
                    'dataResult' => $dataResultKeywords
                ];
            }
        } else {
            echo \GuzzleHttp\json_encode(['error' => 'This project don\'t exist in our database or does not belong to you !!!']);
            die();
        }
    }

    /**
     * @param array|null $result
     * @param string $rank
     * @param string $rank10
     * @param string $rank3
     * @return array
     */
    public function DataFormatRankByDay(?array $result, string $rank, string $rank10, string $rank3): array
    {
        $data = [];

        if (!empty($result)) {
            if (isset($result['dataResultMontly'])) {
                foreach ($result['dataResultMontly'] as $vMonth) {
                    $data[$vMonth['date']][$rank] = isset($vMonth[$rank]) ? $vMonth[$rank] : 0;
                    $data[$vMonth['date']][$rank3] = isset($vMonth[$rank3]) ? $vMonth[$rank3] : 0;
                    $data[$vMonth['date']][$rank10] = isset($vMonth[$rank10]) ? $vMonth[$rank10] : 0;
                    $data[$vMonth['date']]['volume'] = $vMonth['volume'];
                    $data[$vMonth['date']]['date'] = $vMonth['date'];
                    $data[$vMonth['date']]['dateUsort'] = $vMonth['dateUsort'];
                }
            }
            return $this->UsortData($data);
        }
        return $data;
    }

    /**
     * @param string $project
     * @param $auth
     * @param string|null $typeFeatures
     * @param array $keywords
     * @return array
     */
    public function DataByKeyword(string $project, $auth, ?string $typeFeatures = null, array $keywords = []): array
    {
        // Json Decode AUTH !!!
        // Recuperate Keywords by the slug Project !!!
        $auth = \GuzzleHttp\json_decode($auth);
        $request = $this->rankTable->selectProjectBySlug($auth, $project);

        // Params Request
        $keywordsArray = explode(',', $request->keywords);
        $website = $request->website;
        $option = $request->id;

        $keywordsArray = !empty($keywords) ? array_values(array_diff($keywordsArray, $keywords)) : $keywordsArray;
        if (empty($keywordsArray)) {
            $keywordsArray = $keywords;
        }
        $keywords = implode(',', $keywordsArray);

        // Result Data, Rank By keywords !!!
        $rankResult = $this->SerpResultKeywords($keywords, $auth, false, $typeFeatures, $project);

        if (!is_null($typeFeatures)) {
            return [
                'rankResults' => $rankResult,
                'website' => $website,
                'option' => $option,
                'keywords' => $keywords
            ];
        }

        $dataRank = $this->FormatDataRank($rankResult, $website, $option, TRUE);
        return $this->rankFormatTableKeyword($dataRank, $keywords, $rankResult, $website);
    }

    /**
     * @param $result
     * @param string $keyword
     * @param bool $multiKeywords
     * @param string|null $typeFeatures
     * @return array|string
     */
    private function dataRankByWebsite($result, string $keyword, bool $multiKeywords = false, ?string $typeFeatures = null)
    {
        // Request Html DomCrawler
        $this->serp->LoadHtmlDom($result, $multiKeywords);

        if (!empty($keyword)) {
            // Convert Url and Desc SERP int the an array !!!
            $dir = $this->serp->DIRLoad(str_replace(' ', '-', $keyword));
            $dataResult = scandir($dir);
            $data = $this->serp->DataDateRank($dataResult, $dir);
        } else {
            $data = [];
        }

        // If $typeFeatures !== null, we returned the Result Dom HTML !!!
        if (!is_null($typeFeatures)) {
            return [
                'dirKeyword' => !empty($keyword) ? $this->serp->DIRLoad(str_replace(' ', '-', $keyword)) : '',
                'allDate' => !empty($keyword) ? $data['date'] : [],
                'allDateFormat' => !empty($keyword) ? $this->serp->DateFormat($data['date']) : []
            ];
        }

        // Return Array Result Data for the Front !!!
        return [
            "date_format" => !empty($keyword) ? $this->serp->DateFormat($data['date']) : [],
            "date" => !empty($keyword) ? $data['date'] : [],
            "rank" => !empty($keyword) ? $data['rank'] : [],
            "title" => !empty($keyword) ? $data['title'] : []
        ];
    }

    /**
     * @param null|string $keywords
     * @param $auth
     * @param bool $multiKeywords
     * @param string|null $typesFeatures
     * @param string|null $project
     * @param array $newKeywords
     * @return array
     */
    public function SerpResultKeywords(
        ?string $keywords,
        $auth = null,
        bool $multiKeywords = false,
        ?string $typesFeatures = null,
        ?string $project = null,
        array $newKeywords = []
    )
    {
        $dataArray = [];
        if (!is_null($keywords)) {
            $arrKywords = explode(',', $keywords);
            $arrKywords = array_filter($arrKywords, function ($item) {
                return $item !== '';
            });

            $keywordConcurrent = new MultiCurlKeywordConcurrent($this->serp);
            foreach ($arrKywords as $key => $value) {
                $valueFirst = trim($value);
                $value = trim($value);
                if (strpos($value, " ") !== false) {
                    $value = str_replace(" ", '-', $valueFirst);
                }

                $dir = $this->serp->DIRLoad($value);
                if (!file_exists($this->serp->FILELoad($dir))) {
                    if (!is_null($auth)) {
                        $this->rateUserCheck($newKeywords, $auth, $project);
                    }

                    if (is_null($auth)) {
                        [$dataUri, $name] = $this->serp->FileData($value, $valueFirst, null, true);
                    } else {
                        [$dataUri, $name] = $this->serp->FileData($value, $valueFirst, $auth->id, true);
                    }
                    $keywordConcurrent->setUri($dataUri);
                    $keywordConcurrent->setName($name);
                }
            }
            // Concurrent Multi Curl Request for keywords URI !!!
            $keywordConcurrent->run();

            // Pushed in the dataArray to data Doctype Html Google !!!
            foreach ($arrKywords as $key => $item) {
                $keyword = trim($item);
                $name = str_replace(' ', '-', $keyword);

                $data = $this->serp->getSerpDoctype($name);
                $dataArray[] = $this->dataRankByWebsite($data, $keyword, $multiKeywords, $typesFeatures);
            }
        }
        return $dataArray;
    }

    /**
     * @param array $dataRank
     * @param array $dataDate
     * @param string $format
     * @param array|null $keywords
     * @return array
     */
    private function DataResultRkDate(array $dataRank, array $dataDate, string $format, array $keywords = null): array
    {
        $data = [];

        if (isset($keywords) && !is_null($keywords)) {
            // Data Volume by keywords !!!
            $dataVl = $this->keywordsValueVolume($keywords);
        }

        // Array Data Classes the rank in the data !!!
        $dataRank = array_values($dataRank);
        foreach ($dataDate as $kD => $vD) {
            foreach ($vD as $key => $value) {
                for ($i = 0; $i < count($dataRank); $i++) {
                    if (isset($dataRank[$i][$value])) {
                        foreach ($dataRank[$i][$value] as $k => $v) {
                            $data[$value][$v['keyword']][$k]['rank'] = $v['rank'];
                            $data[$value][$v['keyword']][$k]['url'] = $v['url'];
                            if (isset($keywords) && !is_null($keywords)) {
                                $data[$value][$v['keyword']][$k]['volume'] = isset($dataVl[$v['keyword']][$v['rank'] - 1]['volume']['volume']) ?
                                    $dataVl[$v['keyword']][$v['rank'] - 1]['volume']['volume']
                                    : 0;
                            }
                        }
                    }
                }
            }
        }
        return $this->ResultDataRankByTop($data, $format);
    }

    /**
     * @param array $dataRank
     * @param string $format
     * @return array
     */
    private
    function ResultDataRankByTop(array $dataRank, string $format): array
    {
        $dataByMonth = [];
        if ($format === 'Y.d.m') {
            $data = $this->DataRankTopByWebsite($dataRank, $format);
        } else {
            foreach ($dataRank as $key => $value) {
                $dt = date('Y-m', strtotime($key));
                if (strpos($key, $dt) !== false) {
                    foreach ($value as $k => $v) {
                        foreach ($v as $keyRank => $rankValue) {
                            $dataByMonth[$dt][$k . '-' . $key][$keyRank] = $rankValue;
                        }
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
        usort($data, function ($v1, $v2) {
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
    private function DataRankTopByWebsite(array $data, string $format): array
    {
        $dataReturn = [];

        foreach ($data as $key => $value) {
            $top1 = 0;
            $top3 = 0;
            $top10 = 0;
            $top50 = 0;
            $top100 = 0;
            $volume = 0;
            foreach ($value as $k => $kValueRank) {
                $keyDate = date($format, strtotime($key));

                foreach ($kValueRank as $valueRank) {
                    if ($valueRank['url'] !== 'Not Found' && $valueRank['rank'] !== 0) {
                        if ($valueRank['rank'] === 1) {
                            $top1++;
                            $top3++;
                            $top10++;
                            $top50++;
                            $top100++;
                        } elseif ($valueRank['rank'] <= 1 || $valueRank['rank'] <= 3) {
                            $top3++;
                            $top10++;
                            $top50++;
                            $top100++;
                        } elseif ($valueRank['rank'] <= 1 || $valueRank['rank'] <= 10) {
                            $top10++;
                            $top50++;
                            $top100++;
                        } elseif ($valueRank['rank'] <= 1 || $valueRank['rank'] <= 50) {
                            $top50++;
                            $top100++;
                        } elseif ($valueRank['rank'] <= 1 || $valueRank['rank'] <= 100) {
                            $top100++;
                        }
                    }
                    if (isset($valueRank['volume'])) {
                        $volume += (int)$valueRank['volume'];
                    }

                    $dataReturn[$keyDate]['top1'] = $top1;
                    $dataReturn[$keyDate]['top3'] = $top3;
                    $dataReturn[$keyDate]['top10'] = $top10;
                    $dataReturn[$keyDate]['top50'] = $top50;
                    $dataReturn[$keyDate]['top100'] = $top100;
                    $dataReturn[$keyDate]['volume'] = $volume;

                    $dataReturn[$keyDate]['date'] = $keyDate;
                    $dataReturn[$keyDate]['dateUsort'] = date('Y-m-d', strtotime($key));
                }
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

    /**
     * @param array $dataRank
     * @param string $keywords
     * @param array $rankResult
     * @param string $website
     * @return array
     */
    public function rankFormatTableKeyword(
        array $dataRank,
        string $keywords,
        array $rankResult,
        string $website
    ): array
    {
        // Verification than Array DataRank isn't empty and we found keywords !!
        if (!empty($dataRank) && !empty($keywords)) {
            $data = [];
            $dataRankDiff = [];
            if (strpos($keywords, ',')) {
                $keywords = explode(',', $keywords);
            }

            // Create Data Array Rank by Website with like value (keyword, rank, url, date)
            foreach ($dataRank as $keyR => $dt) {
                // Recuperate last result Data Rank !!!
                $dtURI = array_slice($dt, count($dt) - 1);
                // Recuperate two last result Data Rank for diffDataRank !!!
                if (count($dt) >= 7) {
                    $dataRankDiff[] = array_merge(
                        array_slice($dt, count($dt) - 7, 1),
                        array_slice($dt, count($dt) - 1)
                    );
                } else {
                    $dataRankDiff[] = array_slice($dt, count($dt) - 2);
                }

                // Create Data !!!
                foreach ($dtURI as $k => $d) {
                    foreach ($d as $key => $item) {
                        if (is_array($keywords)) {
                            if (isset($keywords[$keyR])) {
                                $data[$keywords[$keyR]][$key]['keyword'] = $keywords[$keyR];
                                $data[$keywords[$keyR]][$key]['rank'] = $item['rank'];
                                $data[$keywords[$keyR]][$key]['url'] = $item['url'];
                                $data[$keywords[$keyR]][$key]['date'] = $k;
                            }
                        } else {
                            $data[$keywords][$key]['keyword'] = $keywords;
                            $data[$keywords][$key]['rank'] = $item['rank'];
                            $data[$keywords][$key]['url'] = $item['url'];
                            $data[$keywords][$key]['date'] = $k;
                        }
                    }
                }
            }

            // Format Data Array Rank for get diff keyword Rank check Today and the last result found !!!
            $data = $this->diffDataRank($data, $dataRankDiff);

            // Format Data Array Rank for get volume !!!
            $data = $this->volumeAddDataRank($data, $keywords);

            // Format Data Array Rank For Push array data Rank by Day to Website
            $data = $this->addRankByWebsite($data, $rankResult, $website, $keywords);

            return $data;
        }
        return [];
    }

    /**
     * @param array $dataRnk
     * @param array $dataRnkDiff
     * @return array
     */
    private
    function diffDataRank(array $dataRnk, array $dataRnkDiff): array
    {
        $dataNumberDiff = [];
        $dataDiff = [];
        $data = [];
        // Format DataRankDiff without the Date like KEY !!!
        foreach ($dataRnkDiff as $key => $diff) {
            $i = -1;
            foreach ($diff as $k => $dfUrl) {
                $i++;
                foreach ($dfUrl as $dKey => $dItem) {
                    $dataDiff[$i][$key][$dKey] = $dItem;
                }
            }
        }

        foreach ($dataDiff as $key => $diff) {
            // Diff Rank
            foreach ($diff as $k => $dfUrl) {
                foreach ($dfUrl as $kRank => $vRank) {
                    if (isset($dataDiff[0][$k]) && isset($dataDiff[1][$k])) {
                        if (count($dataDiff) === 2) {
                            $keysItems1 = array_keys($dataDiff[0][$k]);
                            $keysItems2 = array_keys($dataDiff[1][$k]);

                            foreach ($keysItems1 as $kItem => $item) {
                                $item_diff1 = $dataDiff[0][$k][$item] ?? null;
                                if (isset($keysItems2[$kItem]) && !is_null($keysItems2[$kItem])) {
                                    $item_diff2 = isset($dataDiff[1][$k][$keysItems2[$kItem]]) ? $dataDiff[1][$k][$keysItems2[$kItem]] : null;
                                } else {
                                    $item_diff2 = null;
                                }

                                if (!is_null($item_diff1) && !is_null($item_diff2)) {
                                    $dataNumberDiff[0][$k][$item_diff1['url']]['rank'] = $item_diff1['rank'];
                                    $dataNumberDiff[0][$k][$item_diff1['url']]['key'] = $item;

                                    $dataNumberDiff[1][$k][$item_diff2['url']]['rank'] = $item_diff2['rank'];
                                    $dataNumberDiff[1][$k][$item_diff2['url']]['key'] = $keysItems2[$kItem];
                                }
                            }
                        }
                    }
                }
            }
        }

        // Diff Rank with url identic
        $newDataDiff = [];
        foreach ($dataNumberDiff as $diffKey => $diffValue) {
            foreach ($diffValue as $keyDiff => $valueDiff) {
                if (isset($dataNumberDiff[0][$diffKey]) && isset($dataNumberDiff[1][$diffKey])) {
                    $element1 = $dataNumberDiff[0][$keyDiff];
                    $element2 = $dataNumberDiff[1][$keyDiff];

                    foreach ($element1 as $kElement => $vElement) {
                        $elementDiff = $element2[$kElement] ?? 0;

                        $newDataDiff[$elementDiff['key']] = ($vElement['rank'] - $elementDiff['rank']);
                    }
                }
            }
        }

        // Add Diff Number in the array Data Rank !!!
        foreach ($dataRnk as $k => $d) {
            foreach ($d as $kV => $dV) {
                $values = $newDataDiff;

                $data[$k][$kV]['keyword'] = $dV['keyword'];
                $data[$k][$kV]['rank'] = $dV['rank'];
                $data[$k][$kV]['url'] = $dV['url'];
                $data[$k][$kV]['date'] = $dV['date'];
                $data[$k][$kV]['diff'] = isset($values[$kV]) ? $values[$kV] : 0;
            }
        }

        return $data;
    }

    /**
     * @param array $dataRank
     * @param array|string $keywords
     * @return array
     */
    private function volumeAddDataRank(array $dataRank, $keywords): array
    {
        $data = [];
        // We created now a new file with Curl_Volume class
        // If File Exist we returned the result in JSON !!!
        // Statistic Volume And CPC
        // Search keywords is array ou string !!!
        if (is_array($keywords)) {

            // Implement in the Array Data Volume by Keywords
            $dataVl = $this->keywordsValueVolume($keywords);

            // Data Render !!!
            foreach ($dataRank as $k => $d) {
                foreach ($d as $kV => $dV) {
                    $data[$k][$kV]['keyword'] = $dV['keyword'];
                    $data[$k][$kV]['rank'] = $dV['rank'];
                    $data[$k][$kV]['url'] = $dV['url'];
                    $data[$k][$kV]['date'] = $dV['date'];
                    $data[$k][$kV]['diff'] = $dV['diff'];
                    $data[$k][$kV]['volume'] = isset($dataVl[$dV['keyword']][$dV['rank'] - 1]['volume']['volume']) ?
                        $dataVl[$dV['keyword']][$dV['rank'] - 1]['volume']['volume']
                        : 0;
                }
            }
        } else {
            $keyword = str_replace(' ', '-', $keywords);

            // Volume And Trends System
            if (!$this->serp->existFileVolume($keyword)) {
                $result = (new MultiCurl_VolumeResult())->run($keyword);
                $DataFileVolume = $this->serp->extractResultData($result, $keyword);
                $responseVolume = \GuzzleHttp\json_decode($DataFileVolume);
                $volumeResult = Serp::DataRestultVolume($responseVolume->{'volume'});
            } else {
                $responseVolume = \GuzzleHttp\json_decode($this->serp->RenderVolume($keyword));
                $volumeResult = Serp::DataRestultVolume($responseVolume->{'volume'});
            }

            foreach ($dataRank as $k => $d) {
                foreach ($d as $kV => $dV) {
                    $data[$k][$kV]['keyword'] = $dV['keyword'];
                    $data[$k][$kV]['rank'] = $dV['rank'];
                    $data[$k][$kV]['url'] = $dV['url'];
                    $data[$k][$kV]['date'] = $dV['date'];
                    $data[$k][$kV]['diff'] = $dV['diff'];
                    if (isset($volumeResult->error)) {
                        $data[$k][$kV]['volume'] = 0;
                    } else {
                        if (isset($volumeResult[$dV['rank'] - 1])) {
                            $data[$k][$kV]['volume'] = $volumeResult[$dV['rank'] - 1]['volume'];
                        } else {
                            $data[$k][$kV]['volume'] = 0;
                        }
                    }
                }
            }
        }
        return $data;
    }

    /**
     * @param array $data
     * @param array $rankResult
     * @param string $website
     * @param array|string $keywords
     * @return array
     */
    private function addRankByWebsite(array $data, array $rankResult, string $website, $keywords): array
    {
        $dtRankChart = [];
        $dRankChart = [];
        $dataRankChart = [];
        $dataEnd = [];

        // Create Array Chart in Foreach by Keywords for Ranked by day the websites !!!
        foreach ($rankResult as $kk => $result) {
            $rank = $result['rank'];
            foreach ($rank as $date => $rk) {
                foreach ($rk as $key => $web) {
                    if (strpos($web, $website) !== false) {
                        // Verification if keyword is array or string !!!
                        if (is_array($keywords)) {
                            $dRankChart[$keywords[$kk]][$date][$key][$web] = $key + 1;
                            if (count($dRankChart[$keywords[$kk]][$date]) > 1) {
                                if (count($dRankChart[$keywords[$kk]][$date]) >= 2) {
                                    foreach ($dRankChart[$keywords[$kk]][$date] as $valueRr) {
                                        $rank = array_values($valueRr);
                                        $dtRankChart[$keywords[$kk]][$date][$web] = $rank[0];
                                    }
                                } else {
                                    $rankSlice = array_slice($dRankChart[$keywords[$kk]][$date], 0, -1);
                                    $rank = array_values($rankSlice[0]);
                                    $dtRankChart[$keywords[$kk]][$date][$web] = $rank[0];
                                }
                            } else {
                                $dtRankChart[$keywords[$kk]][$date][$web] = $key + 1;
                            }
                        } else {
                            $dRankChart[$keywords][$date][$key][$web] = $key + 1;
                            if (count($dRankChart[$keywords][$date]) > 1) {
                                $rankSlice = array_slice($dRankChart[$keywords][$date], 0, -1);
                                $rank = array_values($rankSlice[0]);
                                $dtRankChart[$keywords][$date][$web] = $rank[0];
                            } else {
                                $dtRankChart[$keywords][$date][$web] = $key + 1;
                            }
                        }
                    }
                }
            }
        }

        // Format dtRankChart for ranked by each Website !!!
        foreach ($dtRankChart as $key => $dt) {
            foreach ($dt as $date => $value) {
                foreach ($value as $url => $item) {
                    // Verification if keyword is array or string !!!
                    if (is_array($keywords)) {
                        $dataRankChart[$key][$url][$date]['rank'] = $item;
                    } else {
                        $dataRankChart[$key][$url][$date]['rank'] = $item;
                    }
                }
            }
        }

        // Implemented dataChartRank in Data Array !!!
        $i = 0;
        foreach ($data as $k => $d) {
            foreach ($d as $kV => $dV) {
                $i++;
                $dataEnd[$i]['keyword'] = $dV['keyword'];
                $dataEnd[$i]['rank'] = $dV['rank'];
                $dataEnd[$i]['url'] = $dV['url'];
                $dataEnd[$i]['date'] = $dV['date'];
                $dataEnd[$i]['diff'] = $dV['diff'];
                $dataEnd[$i]['volume'] = $dV['volume'];
                $dataEnd[$i]['chart'] = isset($dataRankChart[$dV['keyword']][$dV['url']]) ? $dataRankChart[$dV['keyword']][$dV['url']] : 0;
            }
        }
        return $dataEnd;
    }

    /**
     * @param string $value
     */
    private function RegexKeywords(string $value)
    {
        $value_ex = explode(',', $value);
        foreach ($value_ex as $item) {
            if (empty($item) || !preg_match("#^[\p{L}\p{Nd}\-\'\&\+\-\.\s]+$#u", $item)) {
                echo \GuzzleHttp\json_encode(['error' => 'Invalid Value !!!']);
                die ();
            }
        }
    }

    /**
     * @param $keywords
     * @return array
     */
    private
    function keywordsValueVolume($keywords): array
    {
        $dataVl = [];
        foreach ($keywords as $key => $item) {
            if (strpos($item, " ") !== false) {
                $item = str_replace(" ", '-', $item);
            }

            // Volume And Trends System
            if (!$this->serp->existFileVolume($item)) {
                $result = (new MultiCurl_VolumeResult())->run($item);
                $DataFileVolume = $this->serp->extractResultData($result, $item);
                $responseVolume = \GuzzleHttp\json_decode($DataFileVolume);
                $volumeResult = Serp::DataRestultVolume($responseVolume->{'volume'});
            } else {
                $responseVolume = \GuzzleHttp\json_decode($this->serp->RenderVolume($item));
                $volumeResult = Serp::DataRestultVolume($responseVolume->{'volume'});
            }

            if (isset($volumeResult)) {
                foreach ($volumeResult as $keyVl => $vl) {
                    $itemKey = str_replace('-', ' ', $item);
                    $dataVl[$itemKey][$keyVl]['volume'] = $vl;
                }
            }
        }

        return $dataVl;
    }

    /**
     * @param string|null $keywordsRecords
     * @param string|null $newKeywords
     * @throws NullableException
     */
    private function limitKeywords(?string $keywordsRecords, ?string $newKeywords)
    {
        if (!is_null($newKeywords)) {
            $keywordsRecords = !is_null($keywordsRecords) ? explode(',', $keywordsRecords) : [];
            $newKeywords = explode(',', $newKeywords);
        } else {
            NullableType::nullableArgument();
        }

        $keywords = array_merge($keywordsRecords, $newKeywords);

        if (!empty($keywords)) {
            $countKey = count($keywords);
            if ($countKey >= 500) {
                echo \GuzzleHttp\json_encode([
                    'error' => '500 keywords by project is authorized !!!',
                    'keywords' => $keywords
                ]);
                die();
            }
        }
    }

    /**
     * @param null|array $keywords
     * @param null $auth
     * @param string|null $project
     */
    private function rateUserCheck(?array $keywords = [], $auth = null, ?string $project = null): void
    {
        if (!is_null($project)) {
            $pdo = new PDO_Model();

            $user = (new LogIn($pdo))->SelectRateByUser((int)$auth->id);
            $tableRank = new Rank($pdo);

            $bddProject = $tableRank->selectKeywordsByProject($project);
            if ((int)$user->rate_user === 10000 && !empty($keywords)) {
                $tableRank
                    ->deleteKeywordsRecents($keywords, $bddProject->keywords ?? '', $project);
            } elseif ((int)$user->rate_user === 10000 && empty($keywords)) {
                $tableRank->deleteProject($auth, $bddProject->id ?? null);
            }
        }
    }
}
