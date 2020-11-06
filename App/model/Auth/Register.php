<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 15/05/19
 * Time: 21:40
 */

namespace App\Model\Auth;

use PHPMailer\PHPMailer\PHPMailer;

class Register
{
    /**
     * Username Server SMTP
     */
    CONST USERNAME = 'YOUR_SMTP';
    /**
     * Password Server SMTP
     */
    CONST PASSWORD = 'YOUR_PASSWORD';

    /**
     * @var PHPMailer
     */
    private $phpmailer;

    /**
     * Register constructor.
     * @param PHPMailer $PHPMailer
     */
    public function __construct(PHPMailer $PHPMailer)
    {
        $this->phpmailer = $PHPMailer;
    }

    /**
     * Enjoy Email IF Request Mail is correct
     * @return array
     * @throws \PHPMailer\PHPMailer\Exception
     */
    private function SendMail () : array
    {
        $status_mail = [];
        if(!$this->phpmailer->send()) {
            $status_mail["error"] = 'Message was not sent, Mailer error:' . $this->phpmailer->ErrorInfo;
        } else {
            $status_mail["success"] = 'Message has been sent.';
        }
        return $status_mail;
    }

    /**
     * Connect to Server SMTP For enjoy Email !!!
     */
    private function ConnectServerSMTP ()
    {
        // Set Port, Server SMTP AND SMTP Account username And password !!!
        $this->phpmailer->Host = 'smtp.gmail.com';
        $this->phpmailer->Port = '587';
        $this->phpmailer->Username   = self::USERNAME;
        $this->phpmailer->Password   = self::PASSWORD;
        $this->phpmailer->SMTPSecure = 'tls';
    }

    /**
     * @param string $name_field
     * @param string $type_field
     * @return array
     */
    private function FielsType (string $name_field, string $type_field) : array
    {
        $errors = [];
        if ($name_field === '' || !preg_match('/^[a-zA-Z0-9_-]+$/', $name_field) && $type_field === 'username') {
            $errors['error'] = 'Your Username field shouldn’t be empty or invalid';
        } elseif ($name_field === '' || !filter_var($name_field, FILTER_VALIDATE_EMAIL) && $type_field === 'email') {
            $errors['error'] = 'Your Email field shouldn’t be empty or invalid';
        }
        return $errors;
    }

    /**
     * @param string $username
     * @param string $email
     * @return array
     */
    public function DataFields (string $username, string $email) : array
    {
        $username = $this->FielsType($username, 'username');
        $email = $this->FielsType($email, 'email');
        return ['username' => $username, 'email' => $email];
    }

    /**
     * @param string $username
     * @param string $email
     * @param string $token
     * @return mixed
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function MailEnjoy (string $username, string $email, string $token)
    {
        // Configure Mail Smtp
        // Use Method IsSMTP for telling the class to use SMTP !!!
        $this->phpmailer->isSMTP();
        $this->phpmailer->SMTPAuth = true;
        $this->ConnectServerSMTP();

        // Enjoy Mail From address Admin to Email User with method addAddress And SetFrom !!!
        $this->phpmailer->setFrom("YOUR_MAIL", "Machinools");
        $this->phpmailer->addAddress($email, $username);

        // Write in the mail the subject and the body !!!
        $this->phpmailer->Subject  = 'Message: Confirm Your Account !!!';
        $this->phpmailer->IsHtml(true);
        $this->phpmailer->Body     = 'Hi! Dear '.$username.', you are received your confirmation from your account !!!
                                        <a href="'.$_SERVER['HTTP_ORIGIN'].'/log_in/'.$token.'">Confirmation Account</a>';

        // Send Message Mail !!!
        return $this->SendMail();
    }

}
