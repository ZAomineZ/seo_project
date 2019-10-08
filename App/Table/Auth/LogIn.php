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
    /**
     * LogIn constructor.
     * @param PDO_Model $PDO_Model
     */
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
            ->prepare("SELECT id, username, email, token_user FROM users WHERE id = :id");
        $select->execute(['id' => $id]);
        return $select->fetch();
    }

    /**
     * @param string $token
     * @return mixed
     */
    public function SelectUserByToken (string $token)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id FROM users WHERE token_user = :token");
        $select->execute(['token' => $token]);
        return $select->fetch();
    }

    /**
     * @param int $id
     * @param string $username
     * @param string $email
     * @return mixed
     */
    public function SelectUserByIDOrData (int $id, string $username, string $email)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT id FROM users WHERE id = :id AND username = :username AND email = :email");
        $select->execute(['id' => $id, 'username' => $username, 'email' => $email]);
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
     * @param int $user_id
     * @return mixed
     */
    public function SelectRateByUser (int $user_id)
    {
        $select = $this->pdo
            ->GetPdo()
            ->prepare("SELECT rate_user, created_at FROM users WHERE id = :user_id");
        $select->execute(['user_id' => $user_id]);
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

    /**
     * @param string $token
     * @param int $id
     * @return bool|\PDOStatement
     */
    public function UpdateTokenUser (string $token, int $id)
    {
        $update = $this->pdo
            ->GetPdo()
            ->prepare("UPDATE users SET token_user = :token WHERE id = :id");
        $update->execute(['token' => $token, 'id' => $id]);
        return $update;
    }

    /**
     * @param int $user_id
     * @param $date
     * @return bool|\PDOStatement
     */
    public function UpdateRateUser (int $user_id, $date)
    {
        $update = $this->pdo
            ->GetPdo()
            ->prepare("UPDATE users SET rate_user = rate_user+:increments, created_at = :date_time WHERE id = :user_id");
        $update->execute(['increments' => 1, 'user_id' => $user_id, 'date_time' => $date]);
        return $update;
    }

    /**
     * @param int $user_id
     * @return bool|\PDOStatement
     */
    public function UpdateResetRateUser (int $user_id)
    {
        $update = $this->pdo
            ->GetPdo()
            ->prepare('UPDATE users SET rate_user = :rate_user WHERE id= :user_id');
        $update->execute(['rate_user' => 0, 'user_id' => $user_id]);
        return $update;
    }
}
