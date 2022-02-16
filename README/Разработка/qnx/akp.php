<?php

    require_once("./functions.php");
    
    
    // STATE ["Холодный простой","Горячий простой","Продувка","Под током","Под током и продувка"];
    
    
    //
    // sending akp instant data to the dispatcher db
    // written by Grigoriy Dolgiy 2022
    // inspired by Konstantin Telichko
    //
    function SendAKPdata() {
        $values = array();
        $values['$DateTime'] = trimReplace(date( "Y-m-d H:i:s" ));
        
        $ladlePos = intval(read_file("//16/dd/LF_msp_status2",16,2,"s"));
        $lfStatus = $ladlePos !== 2 ? "LF_msp_status1" : "LF_msp_status2";
        $lfHeatInfo = $ladlePos !== 2 ? "LF_heat_info_bgn11" : "LF_heat_info_bgn12";
        
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
        $values["TANK_ID"] = read_file("//16/dd/$lfHeatInfo",188,1,"c");
        $values["LADLE_ID"] = trimReplace(read_file("//16/dd/$lfHeatInfo",189,2,"A2"));
        $values["HEAT_WEIGHT"] = round(read_file("//16/dd/LF_msp_est_data",22,2,"s")/100,1);
        
        $argon1 = read_file("//16/dd/$lfStatus",56,2,"s")*6/100;
        $argon2 = read_file("//16/dd/$lfStatus",60,2,"s")*6/100;
        $values["ARGON_FLOW_DOWN"] = trimReplace(sprintf("%.0f %.0f",$argon1,$argon2));
        $values["HEAT_CURRENT_TIME"] = minToTime(floor(read_file("//16/dd/$lfStatus",122,2,"s")/60));

        $activeTank = $values["TANK_ID"];
        $activeTankName = "EAKP-1$activeTank";
        
        $nonActiveTank = $activeTank == 2 ? 1 : 2;
        $nonActiveTankName = "EAKP-1$nonActiveTank";
        $valuesNonActive = array();
        $valuesNonActive['$DateTime'] = $values['$DateTime'];
        $valuesNonActive["STATE"] = 0;
        $valuesNonActive["TANK_ID"] = $values["TANK_ID"];
        
        $str = assembleQuery($activeTankName, $values);
        $str2 = assembleQuery($nonActiveTankName, $valuesNonActive);
            
        send($str);
        send($str2);
    }
    
?>