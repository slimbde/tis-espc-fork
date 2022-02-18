<?php

    require_once("./functions.php");
    
    
    /* STATE 
       "Холодный простой",      0
       "Горячий простой",       1
       "Продувка",              2
       "Под током",             3
       "Под током и продувка"   4
    */
    
    
    //
    // sending akp instant data to the dispatcher db
    // written by Grigoriy Dolgiy 2022
    // inspired by Konstantin Telichko
    //
    function SendAKPdata() {
        $values = array();
        $values['$DateTime'] = trimReplace(date( "Y-m-d H:i:s" ));
        
        //$b1 = filemtime("//16/dd/LF_heat_info_bgn11");    // file modification time
        //$e1 = filemtime("//16/dd/LF_heat_info_end11");
        //$b2 = filemtime("//16/dd/LF_heat_info_bgn12");
        //$e2 = filemtime("//16/dd/LF_heat_info_end12");
        
        $ladlePos = 2;
        $check = intval(read_file("//16/dd/LF_msp_status2",16,2,"c"));
        if($check !== 2) $ladlePos = 1;
        
        //if(($b1 > $b2 && $b1 > $e2) || ($e1 > $b1 && $e2 > $b1)) $ladlePos = 1;
        //if(($end1 < $beg1 && $beg1 > $beg2) || ($end1 > $beg1 && $end2 > $beg2)) $ladlePos = 1;

        $lfHeatInfo = "LF_heat_info_bgn1$ladlePos";
        $lfStatus = "LF_msp_status$ladlePos";
        
        $processPhase = intval(read_file("//16/dd/LF_hireg_est_data",22,2,"s"));
        $stirringStatus = intval(read_file("//16/dd/$lfStatus",18,2,"s"));
        $powerStatus = intval(read_file("//16/dd/$lfStatus",2,2,"s"));
        
        $i = ($processPhase == 2 || (($stirringStatus-1)*10+($powerStatus-1)) > 0) ? 1 : 0;
        
        $processCode = $i*100+($stirringStatus-1)*10+($powerStatus-1);
        
        $values["STATE"] = 0;
        if($processCode == 100) $values["STATE"] = 1;
        if($processCode == 110) $values["STATE"] = 2;
        if($processCode == 101) $values["STATE"] = 3;
        if($processCode == 111) $values["STATE"] = 4;
        
        $values["HEAT_ID"] = trimReplace(read_file("//16/dd/LF_msp_est_data",0,10,"A10"));
        $values["STEEL_GRADE"] = trimReplace(read_file("//16/dd/LF_msp_est_data",10,10,"A10"));
        $values["CURRENT_TEMP"] = read_file("//16/dd/LF_msp_est_data",20,2,"s");
        $values["TANK_ID"] = $ladlePos;
        $values["HEAT_WEIGHT"] = round(read_file("//16/dd/LF_msp_est_data",22,2,"s")/100,1);
        
        $argon1 = read_file("//16/dd/$lfStatus",56,2,"s")*6/100;
        $argon2 = read_file("//16/dd/$lfStatus",60,2,"s")*6/100;
        $values["ARGON_FLOW_DOWN"] = trimReplace(sprintf("%.0f %.0f",$argon1,$argon2));
        $values["HEAT_CURRENT_TIME"] = minToTime(floor(read_file("//16/dd/$lfStatus",122,2,"s")/60));
        $values["LADLE_ID"] = trimReplace(read_file("//16/dd/LF_asutp$ladlePos",22,10,"A10"));
        
        $activeTankName = "EAKP-1$ladlePos";
        
        $nonActiveTank = $ladlePos == 2 ? 1 : 2;
        $nonActiveTankName = "EAKP-1$nonActiveTank";
        
        $valuesNonActive = array();
        $valuesNonActive['$DateTime'] = $values['$DateTime'];
        $valuesNonActive["STATE"] = 0;
        $valuesNonActive["TANK_ID"] = $ladlePos;
        
        $str = assembleQuery($activeTankName, $values);
        $str2 = assembleQuery($nonActiveTankName, $valuesNonActive);
            
        send($str);
        send($str2);
    }
    
?>