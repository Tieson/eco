<?php


class Mail {

    protected $from;
	protected $to = array();
    protected $subject;
    protected $text;

    public function __construct() {}

    public function setFrom($mail, $name) {
        $this->from = strip_tags($mail);
        return $this;
    }

    public function addTo($mail, $name) {
	    array_push($this->to, $mail );
        return $this;
    }

    public function setText($text) {
        $this->text = $text;
        return $this;
    }

    public function setSubject($subject) {
        $this->subject = $subject;
        return $this;
    }

    public function sendMail() {
        $subject = $this->subject;
        $message = $this->text;
        $from = 'From: '.$this->from;
//        $replyTo = "Reply-To: ". $this->from . "\r\n";
        $to = $this->getRecipientsAsString();

        $headers = "Mime-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= $from;
//        $headers .= $replyTo;

        if (mail($to, $subject, $message, $headers)) {
            return true;
        }
        return false;
    }

    private function getRecipientsAsString() {
        $to = '';
        foreach ($this->to as $recipient) {
            if ($to != '') {
                $to .= ', ';
            }
            $to .= $recipient;
        }
        return $to;
    }

}

?>
