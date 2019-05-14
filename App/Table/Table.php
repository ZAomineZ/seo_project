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

    protected $pdo;

    public function __construct(PDO_Model $PDO_Model)
    {
        $this->pdo = $PDO_Model;
    }

    public function InsertData (array $data, string $table)
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
