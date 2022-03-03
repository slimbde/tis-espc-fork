<?php
    
    include_once("json_encode.php");


    class DBase 
    {
        //var $db="MatEspc6";
        //var $user="readall";
        //var $pass="readall";
        
        var $connect;

        //register_shutdown_function(array(&$this, '__destruct'));

        function DBase()
        {
            $db="n_work";
            $user="dsp";
            $pass="sql";
        
            $this->connect = odbc_connect("DRIVER={SYBASE};Database=$db", $user, $pass) or die("cannot establish connection");
        }


        function parse($rs){
            $length = odbc_num_fields($rs);
            $fields;
            for ($i = 1; $i <= $length; $i++){
                $fields[] = odbc_field_name($rs, $i);
            }
            $result;
            $i = 0;
            while (odbc_fetch_row($rs)){
                foreach($fields as $field){
                    $result[$i][$field] = odbc_result($rs, $field);
                }
                $i++;
            }
            return $result;
        }



        function __destruct() {
            if($this->connect)
                odbc_close($this->connect);
        }



        function query($q)
        {
            $rs1 = odbc_exec($this->connect, $q);
            $rs = $this->parse($rs1);
            //__destruct();
            return json_encode($rs);
        }
    }

?>