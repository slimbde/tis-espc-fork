<?php

    require_once("./functions.php");

    //
    // sending ccm2 instant data to the dispatcher db
    // written by Grigoriy Dolgiy 2022
    // inspired by Konstantin Telichko 
    //
    function SendCCM2data() {
        $values = array();
        
        $values['$DateTime'] = str_replace(" ", "%20", date( "Y-m-d H:i:s" ));
        
        $heat = intval(read_file("//16/dd/CCM_mnlz72",4,2,"s"));
        $rasl = intval(read_file("//16/dd/CCM_mnlz72",6,2,"s"));
        $seriq = intval(read_file("//16/dd/CCM_mnlz72",8,2,"s"));
        
        $processCode = $seriq + $rasl*10 + $heat*100;
            
        $values["STATE"] = 0;
        if($processCode == 100) $values["STATE"] = 1;
        if($processCode == 110) $values["STATE"] = 2;
        if($processCode == 101) $values["STATE"] = 3;
        if($processCode == 111) $values["STATE"] = 4;
        
        $values['STEEL_GRADE'] = trimReplace(read_file("//16/dd/CCM_mnlz72",276,10,"A10"));
        $values['SLAB_WIDTH'] = floor(read_file("//16/dd/CCM_str_product",36,4,"f"));
        $values['SLAB_THICKNESS'] = floor(read_file("//16/dd/CCM_str_product",28,4,"f"));
        $values['CURRENT_TEMP'] = read_file("//16/dd/CCM_mnlz72",228,2,"s");
        $values['HEAT_WEIGHT'] = round(read_file("//16/dd/CCM_mnlz72",254,2,"s")/10,1);
        $values['LADLE_RESIDUE'] = round(read_file("//16/dd/CCM_mnlz72",224,2,"s")/10,1);
        
        $lob = read_file("//16/dd/CCM_mnlz72",462,4,"l");
        $lser = read_file("//16/dd/CCM_mnlz72",466,4,"l");
        $meters = round(($lob-$lser)/10, 1);
        
        $width = read_file("//16/dd/CCM_mnlz72",506,2,"s");
        $thickness = read_file("//16/dd/CCM_mnlz72",508,2,"s");
        $gravity = read_file("//16/dd/CCM_mnlz72",512,2,"s");
        $tonns = round($meters*$width/1000*$thickness/1000*$gravity/1000,1);
        
        $values['CASTED_METERS'] = $meters;
        $values['CASTED_TONNS'] = $tonns;
        
        $str = assembleQuery("CCM-2", $values);
        
        send($str);
    }
?>