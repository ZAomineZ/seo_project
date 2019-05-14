<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 22/03/19
 * Time: 03:41
 */

namespace App\Table;


use App\Model\PDO_Model;

class Website extends Table
{
    /**
     * Website constructor.
     * @param PDO_Model $PDO_Model
     */
    public function __construct(PDO_Model $PDO_Model)
    {
        parent::__construct($PDO_Model);
    }

    /**
     * @param array $data
     * @return bool
     */
    public function InsertDomain (array $data)
    {
        return $this->InsertData($data, 'website');
    }

    /**
     * @param string $domain
     * @return mixed
     */
    public function SelectToken (string $domain)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT * FROM website WHERE domain = ? ORDER BY id DESC LIMIT 1");
        $select->execute([$domain]);
        return $select->fetch();
    }

    /**
     * @param string $domain
     */
    public function UpdateDate (string $domain)
    {
        $select = $this->pdo->GetPdo()->prepare("UPDATE website SET date = :date WHERE domain = :domain");
        $select->execute([
            'date' => date("Y-m-d H:i:s"),
            'domain' => $domain
        ]);
    }
}
