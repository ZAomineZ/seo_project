<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 18/05/19
 * Time: 20:17
 */

namespace App\Table\Auth;


use App\Model\PDO_Model;
use App\Table\Table;

class PasswordForgot extends Table
{
    /**
     * PasswordForgot constructor.
     * @param PDO_Model $PDO_Model
     */
    public function __construct(PDO_Model $PDO_Model)
    {
        parent::__construct($PDO_Model);
    }

    /**
     * @param string $email
     * @return mixed
     */
    public function ReqEmailExist (string $email)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id, email, username, confirmation_at, confirmation_token FROM users WHERE email = :email");
        $select->execute(['email' => $email]);
        return $select->fetch();
    }

    /**
     * @param string $token
     * @return mixed
     */
    public function ReqTokenUser (string $token)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id, confirmation_at FROM users WHERE confirmation_token = :token");
        $select->execute(['token' => $token]);
        return $select->fetch();
    }

    /**
     * @param float $id
     * @return bool
     */
    public function UpdateData (float $id) : bool
    {
        $update = $this->pdo
            ->GetPdo()
            ->prepare("UPDATE users SET confirmation_at = :confirmation_at WHERE id = :id");
        $update->execute(['confirmation_at' => 0, 'id' => $id]);
        return TRUE;
    }

    /**
     * @param string $token
     * @param string $password
     * @return bool
     */
    public function UpdatePassword (string $token, string $password) : bool
    {
        $update = $this->pdo
            ->GetPdo()
            ->prepare("UPDATE users SET password = :password, confirmation_at = :confirmation_at WHERE confirmation_token = :token");
        $update->execute(['token' => $token, 'confirmation_at' => 1, 'password' => $password]);
        return TRUE;
    }
}
