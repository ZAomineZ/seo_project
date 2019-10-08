<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 14/03/19
 * Time: 16:55
 */

namespace App\Table;

use App\Model\PDO_Model;

class Table
{
    /**
     * @var PDO_Model
     */
    protected $pdo;

    /**
     * Table constructor.
     * @param PDO_Model $PDO_Model
     */
    public function __construct(PDO_Model $PDO_Model)
    {
        $this->pdo = $PDO_Model;
    }

    /**
     * @param array $data
     * @param string $table
     * @return bool
     */
    public function InsertData (array $data, string $table) : bool
    {
        $arr = [];
        $params = [];
        foreach ($data as $key => $value) {
            $arr[] = $value;
            $params[] = "$key = ?";
        }
        $implode = implode(', ', $params);
        return $this->pdo->GetPdo()
            ->prepare("INSERT INTO $table SET $implode")
            ->execute($arr);
    }
}
