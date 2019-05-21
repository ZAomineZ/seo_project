<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 18/05/19
 * Time: 20:16
 */

namespace App\Controller\Auth;


use App\concern\Mail;
use App\Table\Auth\PasswordForgot;

class PasswordForgotController
{
    private $table;
    private $password;
    private $mail;

    public function __construct(PasswordForgot $table, \App\Model\Auth\PasswordForgot $password, Mail $mail)
    {
        $this->table = $table;
        $this->password = $password;
        $this->mail = $mail;
    }

    /**
     * @param float $id
     * @return bool
     */
    private function UpdateData (float $id)
    {
        return $this->table->UpdateData($id);
    }

    /**
     * @param string $token
     * @param string $password
     * @return bool
     */
    private function UpdateUserToken (string $token, string $password)
    {
        $password = password_hash($password, PASSWORD_DEFAULT);
        return $this->table->UpdatePassword($token, $password);
    }

    /**
     * @param string $token
     */
    public function ConfirmAtUser (string $token)
    {
        $request = $this->table->ReqTokenUser($token);
        if ($request && $request->confirmation_at == 1) {
            echo \GuzzleHttp\json_encode($this->password->MessageFront('Your account has already been confirmed !!!', 'error'));
        }
    }

    /**
     * @param string $email
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function DataPassword (string $email)
    {
        $request = $this->table->ReqEmailExist($email);
        if ($request && $request->confirmation_at == 1) {
            $mail = $this->mail->SendMail($request->username, $request->email, $request->confirmation_token);
            if ($mail && $mail['success']) {
                $this->UpdateData($request->id);
                echo \GuzzleHttp\json_encode($this->password->MessageFront('Message has been sent !!!', 'success'));
            } else {
                echo \GuzzleHttp\json_encode($this->password->MessageFront($mail['error'], 'error'));
            }
        } else {
            echo \GuzzleHttp\json_encode($this->password->MessageFront('Your email is invalid !!!', 'error'));
        }
    }

    /**
     * @param string $token
     * @param string $password
     * @param string $password_confirm
     */
    public function NewReqPassword (string $token, string $password, string $password_confirm)
    {
        if ($password !== '' && $password_confirm != '') {
            if ($password === $password_confirm) {
                $request = $this->UpdateUserToken($token, $password);
                if ($request === TRUE) {
                    echo \GuzzleHttp\json_encode($this->password->MessageFront('Your password has been modified !!!', 'success'));
                }
            } else {
                echo \GuzzleHttp\json_encode($this->password->MessageFront('The field password and password confirm are not identical !!!', 'error'));
            }
        }
    }
}
