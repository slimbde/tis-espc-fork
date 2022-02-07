<?php 

    //
    // the scope of auxiliary functions
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
        
        for($i=0; $i<10; ++$i) {
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
        
        $result = implode(";",$result);
        
        // as dev_value field of the target database is of length = 30, truncate the output string
        if(strlen($result) > 30)        
            $result = substr($result, 0, 30);
        
        return $result;
    }


    function getDSPgas() {
        $sfg1 = array();
        array_push($sfg1,round(read_file("//10/dds/c4_sfg",46,4,"f")));
        array_push($sfg1,round(read_file("//10/dds/exp_burn",32,4,"f")));
        array_push($sfg1,round(read_file("//10/dds/c4_sfg",50,4,"f")));
        array_push($sfg1,round(read_file("//10/dds/exp_burn",36,4,"f")));
        array_push($sfg1,round(read_file("//10/dds/c4_sfg",54,4,"f")));
        array_push($sfg1,round(read_file("//10/dds/exp_furm",16,4,"f")));
        
        $sfg2 = array();
        array_push($sfg2,round(read_file("//10/dds/c4_sfg",94,4,"f")));
        array_push($sfg2,round(read_file("//10/dds/exp_burn",40,4,"f")));
        array_push($sfg2,round(read_file("//10/dds/c4_sfg",98,4,"f")));
        array_push($sfg2,round(read_file("//10/dds/exp_burn",44,4,"f")));
        array_push($sfg2,round(read_file("//10/dds/c4_sfg",102,4,"f")));
        array_push($sfg2,round(read_file("//10/dds/exp_furm",32,4,"f")));
        
        $sfg3 = array();
        array_push($sfg3,round(read_file("//10/dds/c4_sfg",142,4,"f")));
        array_push($sfg3,round(read_file("//10/dds/exp_burn",48,4,"f")));
        array_push($sfg3,round(read_file("//10/dds/c4_sfg",146,4,"f")));
        array_push($sfg3,round(read_file("//10/dds/exp_burn",52,4,"f")));
        array_push($sfg3,round(read_file("//10/dds/c4_sfg",150,4,"f")));
        array_push($sfg3,round(read_file("//10/dds/exp_furm",48,4,"f")));
        
        $sfg4 = array();
        array_push($sfg4,round(read_file("//10/dds/c4_sfg",190,4,"f")));
        array_push($sfg4,round(read_file("//10/dds/exp_burn",56,4,"f")));
        array_push($sfg4,round(read_file("//10/dds/c4_sfg",194,4,"f")));
        array_push($sfg4,round(read_file("//10/dds/exp_burn",60,4,"f")));
        array_push($sfg4,round(read_file("//10/dds/c4_sfg",198,4,"f")));
        array_push($sfg4,round(read_file("//10/dds/exp_furm",64,4,"f")));
        
        $sfg5 = array();
        array_push($sfg5,round(read_file("//10/dds/c4_sfg",238,4,"f")));
        array_push($sfg5,round(read_file("//10/dds/exp_burn",64,4,"f")));
        array_push($sfg5,round(read_file("//10/dds/c4_sfg",242,4,"f")));
        array_push($sfg5,round(read_file("//10/dds/exp_burn",68,4,"f")));
        array_push($sfg5,round(read_file("//10/dds/c4_sfg",246,4,"f")));
        array_push($sfg5,round(read_file("//10/dds/exp_furm",80,4,"f")));
        
        $mf = array();
        array_push($mf,round(read_file("//10/dds/c4_mf",20,4,"f")));
        array_push($mf,round(read_file("//10/dds/exp_mf",0,4,"f")));
        array_push($mf,round(read_file("//10/dds/c4_mf",24,4,"f")));
        array_push($mf,round(read_file("//10/dds/exp_mf",2,4,"f")));
        array_push($mf,round(read_file("//10/dds/c4_mf",28,8,"f")));
        array_push($mf,round(read_file("//10/dds/exp_mf",8,8,"f")));
        
        $pk = array();
        array_push($pk,round(read_file("//10/dds/c4_pk",4,4,"f")));
        array_push($pk,round(read_file("//10/dds/unkeeppk",0,4,"f")));
        array_push($pk,round(read_file("//10/dds/exp_mf",12,4,"f")));
        array_push($pk,round(read_file("//10/dds/unkeeppk",4,4,"f")));
        
        $summ = array();
        for($i=0; $i<6; ++$i) {
            $summ[$i] = $sfg1[$i] + $sfg2[$i] + $sfg3[$i] + $sfg4[$i] + $sfg5[$i] + $mf[$i];
            
            if($i<4) 
                $summ[$i] += $pk[$i];
        }
        
        $result = array();
        $result['sfg1'] = implode(";",$sfg1);
        $result['sfg2'] = implode(";",$sfg2);
        $result['sfg3'] = implode(";",$sfg3);
        $result['sfg4'] = implode(";",$sfg4);
        $result['sfg5'] = implode(";",$sfg5);
        $result['mf'] = implode(";",$mf);
        $result['pk'] = implode(";",$pk);
        $result['summ'] = implode(";",$summ);
        
        return $result;
    }
    

    function show($str) {
        echo "$str\n";
    }
?>
