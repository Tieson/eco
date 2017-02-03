<?php
/* 
    Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
*/

namespace TV\inc;

/**
 * Description of Message
 *
 * @author Tomáš Václavík
 */
class Message {

    protected $debugger;
    private $identifikator;

    public function __construct($debugger, $identifikator) {
        $this->debugger = $debugger;
        $this->identifikator = $identifikator;
    }

    protected function debug($message) {
        $this->debugger->debug($message);
    }

    public function addMessage($message) {
        if (!isset($_SESSION[$this->identifikator])) {
            $_SESSION[$this->identifikator] = array();
        }
        $_SESSION[$this->identifikator][] = $message;
        $this->debug('Pridana zprava: ' . $message);
    }

    public function getCount() {
        if (isset($_SESSION[$this->identifikator])){
        $messageCount = count($_SESSION[$this->identifikator]);
        $this->debug('Pocet zprav je ' . $messageCount);
        return $messageCount;
        }else{
        $this->debug('Pocet zprav je 0, promena neexistuje');
            return 0;
        }
    }

    public function getMessages() {
		if (isset($_SESSION[$this->identifikator])){
        return $_SESSION[$this->identifikator];
		}else{
			return array();
		}
    }

    public function clear() {
        if (isset($_SESSION[$this->identifikator])) {
            $this->debug('Identifikator (' . $this->identifikator . ') existuje a bude vymazan.');
            unset($_SESSION[$this->identifikator]);
            $this->debug("Identifikator vymazan.");
        }
        $_SESSION["error"] = null;
    }

}
