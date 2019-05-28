<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 16/05/19
 * Time: 22:53
 */

namespace App\Table\Auth;


use App\Model\PDO_Model;
use App\Table\Table;

class LogIn extends Table
{
    public function __construct(PDO_Model $PDO_Model)
    {
        parent::__construct($PDO_Model);
    }

    /**
     * @param string $token
     * @return mixed
     */
    public function SelectUser (string $token)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id, confirmation_at FROM users WHERE confirmation_token = :token");
        $select->execute(['token' => $token]);
        return $select->fetch();
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function SelectUserByID (int $id)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id, username, email FROM users WHERE id = :id");
        $select->execute(['id' => $id]);
        return $select->fetch();
    }

    /**
     * @param string $username
     * @return mixed
     */
    public function SelectUserbyName (string $username)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT * FROM users WHERE username = :username");
        $select->execute(['username' => $username]);
        return $select->fetch();
    }

    /**
     * @param float $id
     * @return bool|\PDOStatement
     */
    public function UpdateUserConfirmation (float $id)
    {
        $update = $this->pdo
            ->GetPdo()
            ->prepare("UPDATE users SET confirmation_at = :confirmation_at WHERE id = :id");
        $update->execute(['confirmation_at' => 1, 'id' => $id]);
        return $update;
    }
}
