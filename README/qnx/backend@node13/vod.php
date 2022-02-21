<?php

    require_once("./functions.php");
    
    
    /*  STATE
        "Холодный простой", 0
        "Горячий простой",  1
        "Продувка",         2
        "Вакуум",           3
        "Вакуум и продувка" 4
    */
    
    
    //
    // sending akp instant data to the dispatcher db
    // written by Grigoriy Dolgiy 2022
    // inspired by Konstantin Telichko
    //
    function SendVODdata() {
        $values = array();
        $values['$DateTime'] = trimReplace(date( "Y-m-d H:i:s" ));
        
        $ladlePos = 1;
        $check = intval(read_file("//16/dd/VOD_asutp1",0,2,"s"));
        
        if($check < 1) $ladlePos = 2;

        $nonActiveTank = $ladlePos == 2 ? 1 : 2;
        
        $vodASUTP = "//16/dd/VOD_asutp$ladlePos";
        $vodMSPstatus = "//16/dd/VOD_msp_status$ladlePos";
        $vodHeatInfo = "//16/dd/VOD_heat_info_bgn$ladlePos";
        
        $processCode = 0;
        $flag = intval(read_file($vodASUTP,0,2,"s"));
        
        if($flag >= 1) {
            $stirringStatus = intval(read_file($vodMSPstatus,18,2,"s"));
            $vacuumStatus = intval(read_file($vodMSPstatus,8,2,"s"));
            $processCode = 100 + ($stirringStatus-1)*10 + ($vacuumStatus-1);
        }
        
        $values["STATE"] = 0;
        if($processCode == 100) $values["STATE"] = 1;
        if($processCode == 110) $values["STATE"] = 2;
        if($processCode == 101) $values["STATE"] = 3;
        if($processCode == 111) $values["STATE"] = 4;
        
        $processFlag = intval(read_file($vodASUTP,0,2,"s"));
        if($processFlag > 0 && $values["STATE"] === 0) $values["STATE"] = 1;
        
        // when heat is done it shouldn't update anymore
        if($values["STATE"] !== 0) {
            $values["HEAT_ID"] = trimReplace(read_file($vodASUTP,2,10,"A10"));
            $values["STEEL_GRADE"] = trimReplace(read_file($vodASUTP,12,10,"A10"));
            $values["HEAT_WEIGHT"] = round(read_file("//16/dd/VOD_msp_est_data",22,2,"s")/100,1);
            $values["LADLE_ID"] = trimReplace(read_file($vodASUTP,22,10,"A10"));
            $values["VACUUM_PRESSURE"] = round(read_file($vodMSPstatus,72,2,"s")/10,1);
            $values['VACUUM_TIME'] = gmdate("H:i:s", read_file($vodMSPstatus,132,2,"s"));
            $values["CURRENT_TEMP"] = intval(read_file("//16/dd/VOD_msp_est_data",20,2,"s"));
            $values['HEAT_START'] = oleToTime(doubleval(read_file($vodHeatInfo,249,8,"d")));
        }
        
        $values["TANK_ID"] = $ladlePos;
        
        $activeTankName = "VD-2$ladlePos";
        $nonActiveTankName = "VD-2$nonActiveTank";
        
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