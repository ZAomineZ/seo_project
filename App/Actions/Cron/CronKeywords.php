<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 13/10/19
 * Time: 01:36
 */

namespace App\Actions\Cron;


use App\Model\RankModel;
use App\Table\Rank;

class CronKeywords
{
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
        foreach ($keywords as $item) {
            $this->rankModel->SerpResultKeywords($item->keywords);
        }
        return true;
    }
}
