<?php
    
    include_once("json_encode.php");


    class DBase 
    {
        
        var $connect;
        
        //register_shutdown_function(array(&$this, '__destruct'));
        
        function DBase()
        {
            $db="n_work";
            $user="dba";
            $pass="qwe";
        
            $this->connect = odbc_connect("DRIVER={SYBASE};Database=$db", $user, $pass) or die("cannot establish connection");
        }
        
        
        function parse($rs) {
            $length = odbc_num_fields($rs);
            $fields;
            for ($i = 1; $i <= $length; $i++){
                $fields[] = odbc_field_name($rs, $i);
            }
            $result;
            $i = 0;
            while (odbc_fetch_row($rs)) {
                foreach($fields as $field) {
					$raw = odbc_result($rs, $field);
					$result[$i][$field] = mb_convert_encoding($raw,"CP1251","CP866");
                }
                $i++;
            }
            return $result;
        }
        
        
        
        function __destruct() {
            if($this->connect)
                odbc_close($this->connect);
        }
        
        
        
        function query($q) {
            $rs1 = odbc_exec($this->connect, $q);
            $rs = $this->parse($rs1);
            
            return json_encode($rs);
        }
    }

?>