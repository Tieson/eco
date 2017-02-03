<?php
/* 
    Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
*/

namespace TV\inc;

interface Debugger {
    public function debug($message);
}

class DebuggerEcho implements Debugger {

    private static $debugger = null;

    protected function __construct() {}

    private function __clone() {}

    public static function getInstance() {
        if (self::$debugger === null) {
            self::$debugger = new self();
        }
        return self::$debugger;
    }

    public function debug($message) {
        echo '<em style="color:#CC0099;">'.$message . "</em><br>\n";
    }

}

class DebuggerLog implements Debugger {

    private static $debugger = null;

    protected function __construct() {}

    private function __clone() {}

    public static function getInstance() {
        if (self::$debugger === null) {
            self::$debugger = new self();
        }
        return self::$debugger;
    }
    
    public function debug($message) {
        errorLog($message . "\n", 3, './library.log');
    }
}

class DebuggerVoid implements Debugger {

    private static $debugger = null;

    protected function __construct() {}

    private function __clone() {}

    public static function getInstance() {
        if (self::$debugger === null) {
            self::$debugger = new self();
        }
        return self::$debugger;
    }
    
    public function debug($message) {
        // ignorovat všechna hlášení
    }
}
