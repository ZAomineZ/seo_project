<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 05/04/19
 * Time: 02:58
 */

namespace App\Controller;


use App\Table\Campain;
use Illuminate\Support\Str;

class CampainController
{
    protected $table;
    protected $campain;

    /**
     * CampainController constructor.
     * @param Campain $table
     * @param \App\Model\Campain $campain
     */
    public function __construct(Campain $table, \App\Model\Campain $campain)
    {
        $this->table = $table;
        $this->campain = $campain;
    }

    /**
     * @param string $value
     * @return bool
     */
    protected function data_insert (string $value)
    {
        if ($value) {
            return $this->table->CreateCampain(["name" => $value, "slug" => Str::slug($value)], 'campaign');
        }
        return false;
    }

    /**
     * @param string $table
     * @param string $slug
     * @param int $user_id
     * @return array
     */
    protected function DataReq (string $table, string $slug = '', int $user_id)
    {
        if ($slug !== '') {
            return $this->table->SelectCampainDetails($slug, $table, $user_id);
        }
        return $this->table->SelectCampain($table, $user_id);
    }

    /**
     * @param string $table
     * @param string $slug
     * @param int $user_id
     * @return bool
     */
    protected function DataDelete (string $table, string $slug, int $user_id)
    {
        return $this->table->DeleteCampain($table, $slug, $user_id);
    }

    /**
     * @param string $id
     * @param string $data_option
     * @param string $date
     * @throws \Exception
     */
    protected function SelectEchoJsonData (string $id, string $data_option = '', string $date = '')
    {
        if ($data_option === 'data_chart') {
            echo \GuzzleHttp\json_encode([
                'data' => $this->table->SelectCampainDetails($id, 'list_campaign'),
                'data_chart' => $this->campain->ChartData($date, $id)
            ]);
        } else {
            echo \GuzzleHttp\json_encode([
                'data' => $this->table->SelectCampainDetails($id, 'list_campaign')
            ]);
        }
    }

    /**
     * @param string $table
     * @param array $data
     * @return bool
     */
    protected function DataCampainDetails (string $table, array $data)
    {
        return $this->table->InsertData($data, $table);
    }

    /**
     * @param string $website
     * @param string $platform
     * @param string $cost
     * @param string $slug
     * @throws \Exception
     */
    public function InsertCampain (string $website, string $platform, string $cost, string $slug)
    {
        $select = $this->table->SelectIdCampain("campaign", $slug);
        $this->DataCampainDetails('list_campaign', [
            'campain' => $select->id,
            'website' => $website,
            'platform' => $platform,
            'cost' => $cost,
            'date' => date("Y-m-d")
        ]);
        $select_date = $this->table->SelectDateAsc("list_campaign", $select->id);
        return $this->SelectEchoJsonData($select->id, 'data_chart', $select_date->date);
    }

    /**
     * @param string $value
     * @return bool
     */
    public function CampainData (string $value)
    {
       return $this->data_insert($value);
    }

    /**
     * @param object $auth
     * @return array
     */
    public function ReqCampain (object $auth)
    {
        $select = $this->DataReq("campaign", '', $auth->id);
        return $this->campain->ReturnJson($select);
    }

    /**
     * @param string $slug
     * @param object $auth
     * @return bool
     */
    public function DeleteCampain (string $slug, object $auth)
    {
        return $this->DataDelete("campaign", $slug, $auth->id);
    }

    /**
     * @param string $id
     * @param string $slug
     * @throws \Exception
     */
    public function DeleteItemCampain (string $id, string $slug)
    {
        $this->table->DeleteCampainItem($id, 'list_campaign');
        $select = $this->table->SelectIdCampain("campaign", $slug);
        $select_item = $this->table->SelectBlLink('list_campaign', $select->id);
        if ($select_item->id_count >= 1) {
            $select_date = $this->table->SelectDateAsc("list_campaign", $select->id);
            echo \GuzzleHttp\json_encode($this->campain->ChartData($select_date->date, $select->id));
        } else {
            echo \GuzzleHttp\json_encode([]);

        }
    }

    /**
     * @param string $slug
     * @throws \Exception
     */
    public function DataReqCampain (string $slug)
    {
        $select = $this->table->SelectIdCampain("campaign", $slug);
        $select_all = $this->DataReq("list_campaign", $select->id);
        $select_date = $this->table->SelectDateAsc("list_campaign", $select->id);
        if (!empty($select_all)) {
            echo \GuzzleHttp\json_encode([
                'data' => $select_all,
                'data_chart' => $this->campain->ChartData($select_date->date, $select->id)
            ]);
        } else {
            echo \GuzzleHttp\json_encode([
                'data' => [],
                'data_chart' => []
            ]);
        }
    }

    /**
     * @param string $id
     * @param $type
     * @return bool
     */
    public function UpdateData (string $id, $type)
    {
        return $this->table->UpdateDataReceived('list_campaign', $id, $type);
    }

    /**
     * @param string $id
     * @param string $value
     * @param string $slug
     * @param string $bl
     * @throws \Exception
     */
    public function UpdateDataBl (string $id, string $value, string $slug, string $bl)
    {
        $select = $this->table->SelectIdCampain("campaign", $slug);
        $this->table->UpdateDataBl('list_campaign', $id, $value);
        $this->campain->CrawlBl($bl, $value, $id);
        return $this->SelectEchoJsonData($select->id);
    }
}
