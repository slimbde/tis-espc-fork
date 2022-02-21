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
        
        $ladlePos = 2;
        $check = intval(read_file("//16/dd/LF_msp_status2",16,2,"s"));
        if($check !== 2) $ladlePos = 1;
        
        $nonActiveTank = $ladlePos == 2 ? 1 : 2;

        $lfHeatInfo = "//16/dd/LF_heat_info_bgn1$ladlePos";
        $lfHeatOppositeInfo = "//16/dd/LF_heat_info_bgn1$nonActiveTank";
        $lfStatus = "//16/dd/LF_msp_status$ladlePos";
        $lfAsutp = "//16/dd/LF_asutp$ladlePos";
        
        $processPhase = intval(read_file("//16/dd/LF_hireg_est_data",22,2,"s"));
        $stirringStatus = intval(read_file($lfStatus,18,2,"s"));
        $powerStatus = intval(read_file($lfStatus,2,2,"s"));
        
        $i = ($processPhase == 2 || (($stirringStatus-1)*10+($powerStatus-1)) > 0) ? 1 : 0;
        
        $processCode = $i*100+($stirringStatus-1)*10+($powerStatus-1);
        
        $values["STATE"] = 0;
        if($processCode == 100) $values["STATE"] = 1;
        if($processCode == 110) $values["STATE"] = 2;
        if($processCode == 101) $values["STATE"] = 3;
        if($processCode == 111) $values["STATE"] = 4;
        
        $processFlag = intval(read_file($lfAsutp,0,2,"s"));
        if($processFlag > 0 && $values["STATE"] === 0) $values["STATE"] = 1;
        
        
        // when heat is done it shouldn't update anymore
        if($values["STATE"] !== 0) {
            $values["HEAT_ID"] = trimReplace(read_file($lfAsutp,2,10,"A10"));
            $values["STEEL_GRADE"] = trimReplace(read_file($lfAsutp,12,10,"A10"));
            $values["HEAT_WEIGHT"] = round(read_file("//16/dd/LF_msp_est_data",22,2,"s")/100,1);
            $values["HEAT_CURRENT_TIME"] = minToTime(floor(read_file($lfStatus,122,2,"s")/60));
            $values["LADLE_ID"] = trimReplace(read_file($lfAsutp,22,10,"A10"));
            $values["CURRENT_TEMP"] = intval(read_file("//16/dd/LF_msp_est_data",20,2,"s"));
            
            $argon1 = read_file($lfStatus,56,2,"s")*6/100;
            $argon2 = read_file($lfStatus,60,2,"s")*6/100;
            $values["ARGON_FLOW_DOWN"] = trimReplace(sprintf("%.0f %.0f",$argon1,$argon2));
            
            $bgnHeatId = trimReplace(read_file($lfHeatInfo,34,20,"A20"));
            
            $timeLadlePos = oleToTime(doubleval(read_file($lfHeatInfo,249,8,"d")));
            $timeNonLadlePos = oleToTime(doubleval(read_file($lfHeatOppositeInfo,249,8,"d")));
            
            $values['HEAT_START'] = $values["HEAT_ID"] === $bgnHeatId ? $timeLadlePos : $timeNonLadlePos;
        }
        
        $values["TANK_ID"] = $ladlePos;
        
        $activeTankName = "EAKP-1$ladlePos";
        
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