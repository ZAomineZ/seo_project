<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 14/03/19
 * Time: 16:27
 */

namespace App\Table;

use App\Model\PDO_Model;

class LinkProfile extends Table
{
    /**
     * LinkProfile constructor.
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
        return $this->InsertData($data, 'link_profile');
    }

    /**
     * @param $domain
     * @return mixed
     */
    public function SelectPowerbyDomain ($domain)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT * FROM link_profile WHERE domain = ? ORDER BY id DESC LIMIT 1");
        $select->execute([$domain]);
        return $select->fetch();
    }

    /**
     * @param $domain
     * @return array
     */
    public function SelectPowerAll ($domain)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT * FROM link_profile WHERE domain = ? ORDER BY id ASC LIMIT 30 ");
        $select->execute([$domain]);
        return $select->fetchAll();
    }

    /**
     * @param $domain
     * @return array
     */
    public function SelectDate ($domain)
    {
        $select = $this->pdo->GetPdo()->prepare("SELECT power FROM link_profile WHERE domain = ? ORDER BY date DESC LIMIT 2 ");
        $select->execute([$domain]);
        return $select->fetchAll();
    }
}
