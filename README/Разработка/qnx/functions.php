<?php 

    //
    // the scope of auxiliary functions
    // 

    function send($str) {

        $host="10.2.59.150";
		$stime = date('Y-m-d H:i:s');
        
		// write protocol
        echo "$stime host: $host\n";
        
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
        
        fclose( $fp );
		
		$etime = date('H:i:s');
		
		echo "\n$stime ... $etime End query\n";
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
 
 
    function assembleTime($hour, $minute, $second) {
        $rHour = $hour < 10 ? "0".$hour : $hour;
        $rMinute = $minute < 10 ? "0".$minute : $minute;
        $rSecond = $second < 10 ? "0".$second : $second;
        
        return "$rHour:$rMinute:$rSecond";
    }
 
 
    function assembleQuery($device, $params) {
        if(!is_array($params))
            die("params is not array");
        
        $result = "$device~";
        
        foreach($params as $key => $val) {
            $result .= "$key=$val|";
        }
        
        $result = mb_convert_encoding($result,"utf-8", "cp866");
        return $result;
    }


    function trimReplace($raw) {
        // sometimes the ShiftResponsible parameter contains wrong string, i.e. ЕгуновМ.Р.[NUL]М.Ф.
        // and trimming doesn't help. So we got to get rid of the NUL explicitly
        
        $sub = explode("\0", trim($raw));
        
        return str_replace(" ", "%20", $sub[0]);
    }
    
    
    function getMNLZ1Temps($startHour, $startMinute) {
        $result = array();
        
        for($i=0; $i<20; ++$i) {
            $hour = read_file("//20/dd/length_tsteel_1", $i*10+0, 1, "c");
            $minute = read_file("//20/dd/length_tsteel_1", $i*10+1, 1, "c");
            
            if(($hour == $startHour && $minute > $startMinute) 
                || ($hour > $startHour)
                || ($startHour > 20 && $hour < 10)  // on the day's edge
                ) {
                    $temp = read_file("//20/dd/length_tsteel_1", $i*10+6, 4, "l");
                    array_push($result, $temp);
                }
        }
        
        return implode(";",$result);
    }
?>
