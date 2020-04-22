<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 13/10/19
 * Time: 01:36
 */

namespace App\Actions\Cron;


use App\concern\Date_Format;
use App\DataTraitement\RankData\DataJson\RankJson;
use App\Helpers\RenderMessage;
use App\Model\RankModel;
use App\Table\Rank;

class CronKeywords
{
    /**
     * @var bool
     */
    public $cronActive = false;
    /**
     * @var Rank
     */
    private $rank;
    /**
     * @var RankModel
     */
    private $rankModel;

    /**
     * CronKeywords constructor.
     * @param Rank $rank
     * @param RankModel $rankModel
     */
    public function __construct(Rank $rank, RankModel $rankModel)
    {
        $this->rank = $rank;
        $this->rankModel = $rankModel;
    }

    /**
     * @return bool
     */
    public function CronKeywords()
    {
        // Data Keywords Cron create file Serp by Keyword
        $keywords = $this->rank->selectAllKeywords();

        // Checked if the date now === date to database Rank !!!
        $checkedDate = $this->dateCheckedToday($keywords);
        if ($checkedDate === false) {
            (new RenderMessage())
                ->messageRender('Hey Drogbadvc, I you remind that you already have start this CRON !!!');
        }

        $this->cronActive = true;
        foreach ($keywords as $item) {
            $projects = [$item ?: null];
            $project = $this->rank->selectRank((int)$item->id);

            $rankJson = new RankJson($this->rankModel, $projects);
            $rankJson->dataJson(null, $project, []);
        }
        $this->cronActive = false;

        return true;
    }

    /**
     * @param array $items
     * @return bool
     */
    private function dateCheckedToday(array $items)
    {
        if (!empty($items)) {
            $countTodayDate = 0;
            foreach ($items as $item) {
                $date = $item->created_at ?? null;
                if (Date_Format::DateFormatReq($date, 'Y-m-d') === date('Y-m-d')) {
                    $countTodayDate++;
                }
            }

            if ($countTodayDate === count($items)) {
                return false;
            }
        }
        return true;
    }
}
