<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 05/04/19
 * Time: 03:07
 */

namespace App\Table;

use App\Model\PDO_Model;

class Campain extends Table
{
    /**
     * Campain constructor.
     * @param PDO_Model $PDO_Model
     */
    public function __construct(PDO_Model $PDO_Model)
    {
        parent::__construct($PDO_Model);
    }

    /**
     * @param array $data
     * @param string $table
     * @return bool
     */
    public function CreateCampain (array $data, string $table) : bool
    {
        return $this->InsertData($data, $table);
    }

    /**
     * @param string $table
     * @param int $user_id
     * @return array
     */
    public function SelectCampain (string $table, int $user_id) : array
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT * FROM $table WHERE user_id = :user_id ORDER BY id ASC");
        $select->execute(['user_id' => $user_id]);
        return $select->fetchAll();
    }

    /**
     * @param string $table
     * @param int $user_id
     * @param string $value
     * @return mixed
     */
    public function SelectCampainExist (string $table, int $user_id, string $value)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT * FROM $table WHERE user_id = :user_id AND name = :value ORDER BY id ASC");
        $select->execute(['user_id' => $user_id, 'value' => $value]);
        return $select->fetch();
    }

    /**
     * @param string $table
     * @param string $id
     * @return mixed
     */
    public function SelectDateAsc (string $table, string $id)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT date FROM $table WHERE campain = :id ORDER BY id ASC LIMIT 1");
        $select->execute(['id' => $id]);
        return $select->fetch();
    }

    /**
     * @param string $slug
     * @param string $table
     * @return array
     */
    public function SelectCampainDetails (string $slug, string $table) : array
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("
                SELECT *
                FROM $table
                WHERE campain = :slug
                ORDER BY id ASC");
        $select->execute(['slug' => $slug]);
        return $select->fetchAll();
    }

    /**
     * @param string $table
     * @param string $slug
     * @param int $user_id
     * @return mixed
     */
    public function SelectIdCampain (string $table, string $slug, int $user_id)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT id FROM $table WHERE slug = :slug AND user_id = :user_id");
        $select->execute(['slug' => $slug, 'user_id' => $user_id]);
        return $select->fetch();
    }

    /**
     * @param string $table
     * @param $id
     * @return mixed
     */
    public function SelectBlLink (string $table, $id)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT count(id) as id_count FROM $table WHERE campain = ?");
        $select->execute([$id]);
        return $select->fetch();
    }

    /**
     * @param string $table
     * @param $id
     * @return array
     */
    public function SelectCost (string $table, $id) : array
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT cost FROM $table WHERE campain = ?");
        $select->execute([$id]);
        return $select->fetchAll();
    }

    /**
     * @param string $table
     * @param string $id
     * @param string $date_start
     * @param string $date_end
     * @return array
     */
    public function SelectCostByDate (string $table, string $id, string $date_start, string $date_end) : array
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT cost FROM $table 
        WHERE campain = :id AND date 
        BETWEEN :date_start AND :date_end");

        $select->execute(['id' => $id, 'date_start' => $date_start, 'date_end' => $date_end]);
        return $select->fetchAll();
    }

    /**
     * @param string $table
     * @param string $slug
     * @param int $user_id
     * @return bool
     */
    public function DeleteCampain (string $table, string $slug, int $user_id) : bool
    {
        $delete = $this->pdo->GetPdo()->prepare("DELETE FROM $table WHERE slug = :slug AND user_id = :user_id");
        return $delete->execute(['slug' => $slug, 'user_id' => $user_id]);
    }

    /**
     * @param string $id
     * @param string $table
     * @return bool
     */
    public function DeleteCampainItem (string $id, string $table) : bool
    {
        $delete = $this->pdo->GetPdo()->prepare("DELETE FROM $table WHERE id = ? ");
        return $delete->execute([$id]);
    }

    /**
     * @param int $campain
     * @param string $table
     * @return bool
     */
    public function DeleteCampainDetails (int $campain, string $table) : bool
    {
        $delete = $this->pdo->GetPdo()->prepare("DELETE FROM $table WHERE campain = :campain ");
        return $delete->execute(['campain' => $campain]);
    }

    /**
     * @param string $table
     * @param string $id
     * @param $type
     * @return bool
     */
    public function UpdateDataReceived (string $table, string $id, $type) : bool
    {
        $update = $this->pdo->GetPdo()->prepare("UPDATE $table SET received = :received WHERE id = :id");
        return $update->execute(['id' => $id, 'received' => $type]);
    }

    /**
     * @param string $table
     * @param string $id
     * @return mixed
     */
    public function SelectExistCampaignList (string $table, string $id)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT id FROM $table WHERE id = :id");
        $select->execute(['id' => $id]);
        return $select->fetch();
    }

    /**
     * @param string $table
     * @param string $id
     * @param string $value
     * @return bool
     */
    public function UpdateDataBl (string $table, string $id, string $value) : bool
    {
        $update = $this->pdo->GetPdo()->prepare("UPDATE $table SET backlink = :backlink WHERE id = :id");
        return $update->execute(['id' => $id, 'backlink' => $value]);
    }

    /**
     * @param string $table
     * @param string $id
     * @return bool
     */
    public function UpdateDataBlFound (string $table, string $id) : bool
    {
        $update = $this->pdo->GetPdo()->prepare("UPDATE $table SET bl_found = :bl_found, date_check = :date_check WHERE id = :id");
        return $update->execute(['id' => $id, 'bl_found' => '1', 'date_check' => date('Y-m-d')]);
    }
}
