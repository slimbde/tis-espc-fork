<?php

    require_once("./F.php");
    
    
    //
    // CastingSpeedPLC ~ CCM1
    // Written by Grigoriy Dolgiy 2022
    // Reason: to calculate average casting speed CCM1
    //
    class SpeedCCM1 extends F {

        //
        // writes service log to the file
        //
        function trace($message) {
            $dateTime = date( "Y-m-d H:i:s" );
            $this->fileWrite("logs/speedCCM1.log", "$dateTime: $message");
        }
        
        
        
        //
        // accumulates average speed
        //
        function observe($params) {
            $heatId = $params["HEAT_ID"];
            $speed = doubleval($params["AVG_SPEED"]);
            $newSpeed = doubleval($this->read_file("//20/dd/fusion_isa_1",30,4,"f"));
            $params["AVG_SPEED"] = ($speed + $newSpeed)/2.;
            $params["LAST_MSG"] = "observe heat: $heatId";
            return $params;
        }
        
        
        
        //
        // sends new heat request to the database
        //
        function start($params) {
            $newHeatId = $this->read_file("//20/dd/fusion_isa_1",62,4,"l");
            
            if($newHeatId !== $params["HEAT_ID"]) {
                $params["HEAT_ID"] = $newHeatId;
                $params["START_POINT"] = date("Y-m-d H:i:s");
                $params["END_POINT"] = "";
                $params["AVG_SPEED"] = 0;
                $this->sendToTis($params);
            }
            
            $message = "start heat: $newHeatId";
            $params["LAST_MSG"] = $message;
            $this->trace($message);
            return $params;
        }
        
        
        
        //
        // sends heat stop request to the database
        //
        function save($params) {
            $this->sendToTis($params);
            
            $heatId = $params["HEAT_ID"];
            $avgSpeed = $params["AVG_SPEED"];
            
            $message = "stop heat: $heatId, avgSpeed:$avgSpeed";
            $params["LAST_MSG"] = $message;
            $params["END_POINT"] = date( "Y-m-d H:i:s" );
            $this->trace($message);
            return $params;
        }
        
        
        
        //
        // resolves action to run from states transition
        //
        function resolve($prevProcessCode,$processCode) {
            /* states
                0   "Холодный простой",
                100 "Разливка",
                110 "Разливка и раскрой",
                99  "Раскрой",
                113 "Плавка на плавку",
            */
            
            $transitions = array(
                "0-0"       => "",
                "0-100"     => "start",
                "0-110"     => "start",
                "0-99"      => "",
                "0-113"     => "start",
                
                "100-0"     => "save",
                "100-100"   => "observe",
                "100-110"   => "observe",
                "100-99"    => "save",
                "100-113"   => "save-start",
                
                "110-0"     => "save",
                "110-100"   => "observe",
                "110-110"   => "observe",
                "110-99"    => "save",
                "110-113"   => "save-start",
                
                "99-0"      => "",
                "99-100"    => "start",
                "99-110"    => "start",
                "99-99"     => "",
                "99-113"    => "start",
                
                "113-0"     => "save",
                "113-100"   => "observe",
                "113-110"   => "observe",
                "113-99"    => "save",
                "113-113"   => "observe",
            );
            
            $transition = "$prevProcessCode-$processCode";
            return $transitions[$transition];
        }
        
        

        //
        // sends heat open and close requests to TIS
        //
        function sendToTis($params) {
            
            $date1 = strtotime(str_replace('%20',' ',$params["START_POINT"]));
            $date2 = time();
            $interval = $date2 - $date1;
            $duration = date('H:i:s',$interval);
            
            $heatId = $params["HEAT_ID"];
            $avgSpeed = $params["AVG_SPEED"];
            
            $data = $avgSpeed === 0 
                ? "StartCCM1Heat?heatId=$heatId"
                : "StopCCM1Heat?heatId=$heatId&avgSpeed=$avgSpeed&time=$duration";
            
            $host="10.2.10.84";
            $fp = fsockopen( $host, 83, $errno, $errstr, 30 ) or die("$errno ($errstr)\n");

            echo "Open socket: ok\n";
            
            $out    = "GET /api/data/$data HTTP/1.1\r\n";
            $out    .= "Host: ".$host."\r\n";
            $out    .= "Content-Type: text/html; charset=UTF-8\r\n";
            $out    .= "Connection: Close\r\n\r\n";
            
            fwrite( $fp, $out );
            
            echo "Server response:\n";
            
            while( !feof( $fp ) ) {
                echo $this->cp866(fgets( $fp, 128 ));
            }
            
            fclose( $fp );
        }
    }

    
    // the entry point
    $inst = new SpeedCCM1();
    
    $plawka = intval($inst->read_file("//20/dd/mnlz72",4,2,"s")) == 1;
    $rasl = intval($inst->read_file("//20/dd/mnlz72",6,2,"s")) == 1;
    $seriq = intval($inst->read_file("//20/dd/mnlz72",8,2,"s"));
    $processCode = $plawka*100 + $rasl*10 + $seriq;

    $stashFilename = "ccm1Stash.dat";
    $params = array();
    $params = $inst->fileReadParams($stashFilename, $params);
    
    if(count($params) !== 0) {
        $action = $inst->resolve($params["PROCESS_CODE"],$processCode);
        
        if($action === "start")     $params = $inst->start($params);
        if($action === "save")      $params = $inst->save($params);
        if($action === "observe")   $params = $inst->observe($params);
        if($action === "save-start") {
            $params = $inst->save($params);
            $params = $inst->start($params);
        }
        
        $params["PROCESS_CODE"] = $processCode;
    }
    
    $inst->fileWriteParams($stashFilename, $params);
    
?>