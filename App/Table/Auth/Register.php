<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 15/05/19
 * Time: 21:40
 */

namespace App\Table\Auth;


use App\Model\PDO_Model;
use App\Table\Table;

class Register extends Table
{
    /**
     * Register constructor.
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
    public function RegisterUser (array $data) : bool
    {
        return $this->InsertData($data, 'users');
    }

    /**
     * @param string $username
     * @param string $email
     * @return mixed
     */
    public function UserExist (string $username, string $email)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id, confirmation_token FROM users WHERE username = :username OR email = :email");
        $select->execute(['username' => $username, 'email' => $email]);
        return $select->fetch();
    }
}
