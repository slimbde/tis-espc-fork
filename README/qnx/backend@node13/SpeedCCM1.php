<?php

    require_once("./F.php");
    
    
    //
    // CastingSpeedPLC ~ CCM1
    // Written by Grigoriy Dolgiy 2022
    // Reason: to calculate average casting speed CCM1
    //
    class SpeedCCM1 extends F {

        var $traceFile = "logs/speedCCM1.trace";
        
        
        
        //
        // accumulates average speed
        //
        function observe($params) {
            $heatId = $params["HEAT_ID"];
            $speed = doubleval($params["AVG_SPEED"]);
            $newSpeed = doubleval($this->read_file("//20/dd/fusion_isa_1",30,4,"f"));
        
            $params["AVG_SPEED"] = $newSpeed < 2     // huge values filter
                ? ($speed + $newSpeed)/2.
                : $speed;
                
            $params["LAST_MSG"] = "observe heat: $heatId";
            return $params;
        }
        
        
        
        //
        // sends new heat request to the database
        //
        function start($params) {
            $newHeatId = $this->read_file("//20/dd/fusion_isa_1",62,4,"l");
            
            if($newHeatId !== $params["HEAT_ID"]) {
                $params["LAST_2ND_OPENED_HEAT_ID"] = $params["HEAT_ID"];
                $params["HEAT_ID"] = $newHeatId;
                $params["START_POINT"] = date("Y-m-d H:i:s");
                $params["END_POINT"] = "";
                $params["AVG_SPEED"] = 0;
                $this->sendToTis($params);
                
                $steelGrade = $this->utf($this->trimReplace($this->read_file("//20/dd/fusion_struct_1",74,10,"A10")));
                $this->sendToTisHistory("sp_OpenHeat%20$newHeatId,ccm1,'$steelGrade'");
                $this->trace($this->traceFile, "open heat $newHeatId at tis_history");
            }
            
            $params['SLAB_WIDTH'] = $this->read_file("//20/dd/fusion_struct_1",822,4,"l");
            $params['SLAB_THICKNESS'] = $this->read_file("//20/dd/fusion_struct_1",826,4,"l");
            
            return $params;
        }
        
        
        
        //
        // sends heat stop request to the database
        //
        function save($params) {
            $this->sendToTis($params);
            
            $params["END_POINT"] = date( "Y-m-d H:i:s" );
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
            $action = $transitions[$transition];
            
            return $action;
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
            $avgSpeed = doubleval($params["AVG_SPEED"]);
            $width = intval($params["SLAB_WIDTH"]);
            $thickness = intval($params["SLAB_THICKNESS"]);
            
            $performance = round($width * $thickness / 1000000 * 7.85 * 60 * $avgSpeed, 3); 
            
            $data = $avgSpeed === 0. 
                ? "StartCCM1Heat?heatId=$heatId"
                : "StopCCM1Heat?heatId=$heatId&avgSpeed=$avgSpeed&time=$duration&performance=$performance";
                
            $this->trace($this->traceFile, $data);
            
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
    
    
    
        //
        // closes last heat in series
        //
        function closeHeat($params,$src) {
            $heatId = $params["HEAT_ID"];
            $this->sendToTisHistory("sp_CloseHeat%20$heatId,ccm1");
            $this->trace($this->traceFile, "<$src> close heat $heatId at tis_history");
            return $params;
        }
    
    
    
        //
        // 
        //
        function checkStoppedHeat($params,$processCode) {
            // when current heat stopped
            if(intval($params["PROCESS_CODE"]) > 0 && $processCode === 0)
                $params = $this->closeHeat($params,"proc-code");
            // when 2nd last heat stopped
            else if ($processCode > 0) {
                $last2ndHeatId = intval($this->read_file("//20/dd/fusion_isa_1",262,4,"l"));
                $last2ndOpenedHeatId = intval($params["LAST_2ND_OPENED_HEAT_ID"]);
                
                $last2ndHeatTime = $params["LAST_2ND_HEAT_TIME"];
                
                $last2ndHeatMinute = intval($this->read_file("//20/dd/fusion_isa_1",323,1,"C"));
                $last2ndHeatSecond = intval($this->read_file("//20/dd/fusion_isa_1",324,1,"C"));
                $newLast2ndHeatTime = "$last2ndHeatMinute:$last2ndHeatSecond";
                
                if($newLast2ndHeatTime === $last2ndHeatTime && $last2ndOpenedHeatId === $last2ndHeatId)
                    $params = $this->closeHeat($params,"last2ndHeatTime");
                
                $params["LAST_2ND_HEAT_TIME"] = $newLast2ndHeatTime;
            }

            return $params;
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
        $params = $inst->checkStoppedHeat($params,$processCode);    // catching old heat stop point
        
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