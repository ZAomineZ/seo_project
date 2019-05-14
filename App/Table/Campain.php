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
    public function __construct(PDO_Model $PDO_Model)
    {
        parent::__construct($PDO_Model);
    }

    /**
     * @param array $data
     * @param string $table
     * @return bool
     */
    public function CreateCampain (array $data, string $table)
    {
        return $this->InsertData($data, $table);
    }

    /**
     * @param string $table
     * @return array
     */
    public function SelectCampain (string $table)
    {
        $select = $this->pdo
            ->GetPdo()
            ->query("
                SELECT *
                FROM $table
                ORDER BY id ASC");
        return $select->fetchAll();
    }

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
    public function SelectCampainDetails (string $slug, string $table)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("
                SELECT *
                FROM $table
                WHERE campain = ?
                ORDER BY id ASC");
        $select->execute([$slug]);
        return $select->fetchAll();
    }

    /**
     * @param string $table
     * @param string $slug
     * @return mixed
     */
    public function SelectIdCampain (string $table, string $slug)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT id FROM $table WHERE slug = ?");
        $select->execute([$slug]);
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
    public function SelectCost (string $table, $id)
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
    public function SelectCostByDate (string $table, string $id, string $date_start, string $date_end)
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
     * @return bool
     */
    public function DeleteCampain (string $table, string $slug)
    {
        $delete = $this->pdo->GetPdo()->prepare("DELETE FROM $table WHERE slug = ? ");
        return $delete->execute([$slug]);
    }

    /**
     * @param string $id
     * @param string $table
     * @return bool
     */
    public function DeleteCampainItem (string $id, string $table)
    {
        $delete = $this->pdo->GetPdo()->prepare("DELETE FROM $table WHERE id = ? ");
        return $delete->execute([$id]);
    }

    /**
     * @param string $table
     * @param string $id
     * @param $type
     * @return bool
     */
    public function UpdateDataReceived (string $table, string $id, $type)
    {
        $update = $this->pdo->GetPdo()->prepare("UPDATE $table SET received = :received WHERE id = :id");
        return $update->execute(['id' => $id, 'received' => $type]);
    }

    /**
     * @param string $table
     * @param string $id
     * @param string $value
     * @return bool
     */
    public function UpdateDataBl (string $table, string $id, string $value)
    {
        $update = $this->pdo->GetPdo()->prepare("UPDATE $table SET backlink = :backlink WHERE id = :id");
        return $update->execute(['id' => $id, 'backlink' => $value]);
    }

    /**
     * @param string $table
     * @param string $id
     * @return bool
     */
    public function UpdateDataBlFound (string $table, string $id)
    {
        $update = $this->pdo->GetPdo()->prepare("UPDATE $table SET bl_found = :bl_found, date_check = :date_check WHERE id = :id");
        return $update->execute(['id' => $id, 'bl_found' => '1', 'date_check' => date('Y-m-d')]);
    }
}
