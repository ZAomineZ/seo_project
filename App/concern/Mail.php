<?php
/**
 * Created by PhpStorm.
 * User: bissboss
 * Date: 18/05/19
 * Time: 20:51
 */

namespace App\concern;


use PHPMailer\PHPMailer\PHPMailer;

class Mail
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
     * Mail constructor.
     * @param PHPMailer $phpmailer
     */
    public function __construct(PHPMailer $phpmailer)
    {
        $this->phpmailer = $phpmailer;
    }

    /**
     * Enjoy Email IF Request Mail is correct
     * @return array
     * @throws \PHPMailer\PHPMailer\Exception
     */
    private function SendMailPassword () : array
    {
        $status_mail = [];
        if(!$this->phpmailer->send()) {
            $status_mail["error"] = 'Message was not sent, Mailer error: ' . $this->phpmailer->ErrorInfo;
        } else {
            $status_mail["success"] = 'Message has been sent.';
        }
        return $status_mail;
    }

    /**
     * Connect Server SMTP for enjoyed Email !!!
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
     * Configuration SMTP EMAIL !!!
     */
    private function ConfigureParamsSMTP ()
    {
        // Configure Mail Smtp
        // Use Method IsSMTP for telling the class to use SMTP !!!
        $this->phpmailer->isSMTP();
        $this->phpmailer->SMTPAuth = true;
        $this->ConnectServerSMTP();
    }

    /**
     * @param string $email_to
     * @param string $username_to
     * @throws \PHPMailer\PHPMailer\Exception
     */
    private function EmailParamsInfo (string $email_to, string $username_to)
    {
        // Enjoy Mail From address Admin to Email User with method addAddress And SetFrom !!!
        $this->phpmailer->setFrom("YOUR_MAIL", "Machinools");
        $this->phpmailer->addAddress($email_to, $username_to);
    }

    /**
     * @param string $subject_message
     * @param string $body_message
     * @param bool $type
     * @return bool|null
     */
    private function HtmlSubBodyMail (string $subject_message, string $body_message, bool $type = false)
    {
        if ($type === false) {
            return null;
        }
        // Write in the mail the subject and the body !!!
        // Validate HTML Mail !!!
        $this->phpmailer->IsHtml($type);
        $this->phpmailer->Subject = $subject_message;
        $this->phpmailer->Body = $body_message;
        return true;
    }

    /**
     * @param string $username
     * @param string $email
     * @param string $token
     * @return array
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function SendMail (string $username, string $email, string $token) : array
    {
        $this->ConfigureParamsSMTP();
        $this->EmailParamsInfo($email, $username);

        // Body mail !!!
        $body = 'Hi! Dear '.$username.', you are received your confirmation for your new password !!!
                                        <a href="'.$_SERVER['HTTP_ORIGIN'].'/password_forgot_confirm/'.$token.'">Click here</a>';

        $this->HtmlSubBodyMail('Password Confirmation', $body, TRUE);

        // Send Mail with method SendMailPassword !!!
        return $this->SendMailPassword();
    }
}
