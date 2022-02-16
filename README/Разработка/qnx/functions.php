<?php 

    //
    // the scope of auxiliary common functions
    // 


    function send($str) {

        $host="10.2.59.150";
		$stime = date('Y-m-d H:i:s');
        
		// write protocol
        echo "~ SEND FUNCTION PROTOCOL ~ [$stime host: $host]\n";
        
		$fp	= fsockopen( $host, 80, $errno, $errstr, 30 ) or die("$errno ($errstr)\n");

        echo "Open socket: ok\n";
        
        $out	= "GET /recivetodb.php?str=$str HTTP/1.1\r\n";
        $out	.= "Host: ".$host."\r\n";
        $out	.= "Content-Type: text/html; charset=UTF-8\r\n";
        $out	.= "Connection: Close\r\n\r\n";
        
        echo "HTML to send:\n$out\n";
        
        fwrite( $fp, $out );
        
        echo "Received:\n";
        
        while( !feof( $fp ) ) {
            echo fgets( $fp, 128 );
        }
        
        echo "\n\n";
        
        fclose( $fp );
		
		//$etime = date('H:i:s');
		//echo "\n$stime ... $etime End query\n";
	}


    function read_file($file, $offset, $len, $format) {
		$st2 = array();
		
		$ff=fopen($file,"r") or die("File $file not open\n");

		{
			fseek($ff,$offset);
			$st1 = fread($ff, $len);

            $st2 = $format 
                ? unpack($format, $st1)
                : $st2[1] = $st1;

		}
        
		fclose($ff);
		return $st2[1];
	}
 
 
    function assembleTime($hour, $minute, $second = -1) {
        $rHour = $hour < 10 ? "0".$hour : $hour;
        $rMinute = $minute < 10 ? "0".$minute : $minute;
        $rSecond = $second < 10 ? "0".$second : $second;
        
        $result = $second == -1
            ? "$rHour:$rMinute"
            : "$rHour:$rMinute:$rSecond";
        
        return $result;
    }
 
 
    function minToTime($mins) {
        if($mins > 1440) return "12:59:59";
        
        $hour = floor($mins / 60);
        $min = $mins - $hour * 60;
        return assembleTime($hour,$min,0);
    }
    
    
    function utf($string) {
        return mb_convert_encoding($string,"utf-8", "cp866");
    }
    
    
    function cp866($string) {
        return mb_convert_encoding($string,"cp866","utf-8");
    }
    
 
    function assembleQuery($device, $params) {
        if(!is_array($params))
            die("params is not array");
        
        $result = "$device~";
        
        foreach($params as $key => $val) {
            $result .= "$key=$val|";
        }
        
        $result = utf($result);
        return $result;
    }


    function trimReplace($raw) {
        // sometimes the ShiftResponsible parameter contains wrong string, i.e. ЕгуновМ.Р.[NUL]М.Ф.
        // and trimming doesn't help. So we got to get rid of the NUL explicitly
        
        $sub = explode("\0", trim($raw));
        
        return str_replace(" ", "%20", $sub[0]);
    }
    

    function fileWriteParams($filename, $params) {
        if(!is_array($params)) {
            echo "params is not array";
            return;
        }
        
        $fp = fopen($filename, "w");

        foreach($params as $key => $value) {
            $str = sprintf("%s~%s\n",$key,$value);
            fwrite($fp, $str);
        }
    
        fclose($fp);
    }

    
    function fileReadParams($filename, $arr) {
        if(!file_exists($filename)) return $arr;
        
        $fp = fopen($filename, "r");

        while($str = fgets($fp)) {
            $exp = explode("~",$str);
            $key = trimReplace($exp[0]); 
            $value = trimReplace($exp[1]);
            $arr[$key] = $value;
        }
    
        fclose($fp);
        return $arr;
    }


    function show($str) {
        echo "$str\n";
    }
?>
