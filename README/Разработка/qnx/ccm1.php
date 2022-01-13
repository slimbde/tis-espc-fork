<?php
    
    require_once("./functions.php");
    
    //
    // sending ccm1 instant data to the dispatcher db
    // written by Grigoriy Dolgiy 2021
    // inspired by Albert Zagirov 
    //
    function SendCCM1data() {
        $values = array();
        
        $values['$DateTime'] = str_replace(" ", "%20", date( "Y-m-d H:i:s" ));
        
        $startHour = read_file("//20/dd/fusion_isa_1",118,1,"c");
        $startMinute = read_file("//20/dd/fusion_isa_1",119,1,"c");
        $startSecond = read_file("//20/dd/fusion_isa_1",120,1,"c"); 
        $values['HEAT_START'] = assembleTime($startHour, $startMinute, $startMinute);
        
        $endHour = read_file("//20/dd/fusion_isa_1",126,1,"c");
        $endMinute = read_file("//20/dd/fusion_isa_1",127,1,"c");
        $endSecond = read_file("//20/dd/fusion_isa_1",128,1,"c");
        $values['HEAT_TIME'] = assembleTime($endHour, $endMinute, $endSecond);
        
        $values['HEAT_ID'] = read_file("//20/dd/fusion_isa_1",62,4,"l");
        $values['HEAT_WEIGHT'] = round(read_file("//20/dd/calcv_1",28,4,"f"), 1);
        $values['SEQ_NO'] = read_file("//20/dd/fusion_isa_1",58,4,"l");
        $values['CASTING_SPEED'] = round(read_file("//20/dd/fusion_isa_1",30,4,"f"), 2);
        $values['OPTIMAL_SPEED'] = round(read_file("//20/dd/calcv_1",0,4,"f"), 2);
        $values['FLOW_SPEED'] = round(read_file("//20/dd/fusion_isa_1",26,4,"f") * 60 / 1000, 2);
        $values['CASTED_METERS'] = round(read_file("//20/dd/fusion_isa_1",78,4,"f"), 1);
        $values['CASTED_TONNS'] = round(read_file("//20/dd/fusion_isa_1",82,4,"f"), 1);
        $values['STREAM_CAST'] = read_file("//20/dd/fusion_isa_1",24,1,"c") == 1 ? "True" : "False";
        $values['STEEL_GRADE'] = trimReplace(read_file("//20/dd/fusion_struct_1",74,10,"A10"));
        $values['SLAB_WIDTH'] = read_file("//20/dd/fusion_struct_1",822,4,"l");
        $values['SLAB_THICKNESS'] = read_file("//20/dd/fusion_struct_1",826,4,"l");
        $values['TEAM_ID'] = read_file("//20/dd/fusion_struct_1",8,4,"l");
        $values['SHIFT_CODE'] = read_file("//20/dd/fusion_struct_1",12,4,"l");
        $values['SHIFT_RESPONSIBLE'] = trimReplace(read_file("//20/dd/fusion_struct_1",16,50,"A50"));
        $values['CUT_ID'] = read_file("//20/dd/fusion_struct_1",1550,4,"l");
        $values['CURRENT_TEMP'] = round(read_file("//20/dd/calcv_1",16,4,"f"), 0);
        
        $values['CRYST_STOIK'] = read_file("//20/dd/fusion_struct_1",834,4,"l");
        $values['CRYST_SHOS'] = trimReplace(read_file("//20/dd/fusion_struct_1",838,50,"A50"));
        $values['CRYST_FREQ'] = round(read_file("//20/dd/ado6_analog_1",28,4,"f"), 1);
        $values['CRYST_PULL_EFFORT'] = round(read_file("//20/dd/ado6_analog_1",288,4,"f"), 1);
        $values['CRYST_T_SHEARS'] = round(read_file("//20/dd/zvo_c_1",320,4,"f"), 0);
        $values['CRYST_T_BEFORE'] = round(read_file("//20/dd/zvo_c_1",308,4,"f"), 1);
        $values['CRYST_T_DELTA'] = round(read_file("//20/dd/zvo_c_1",316,4,"f"), 1);
        $values['CRYST_FLOW'] = round(read_file("//20/dd/zvo_c_1",124,4,"f"), 0);
        $values['CRYST_F_LEFT'] = round(read_file("//20/dd/zvo_c_1",112,4,"f"), 2);
        $values['CRYST_F_RIGHT'] = round(read_file("//20/dd/zvo_c_1",100,4,"f"), 2);
        
        $values['LADLE_ID'] = read_file("//20/dd/fusion_struct_1",962,4,"l");
        $values['LADLE_STOIK'] = read_file("//20/dd/fusion_struct_1",966,4,"l");
        $values['LADLE_ARM'] = read_file("//20/dd/fusion_struct_1",974,4,"l");
        $values['LADLE_SHIB'] = read_file("//20/dd/fusion_struct_1",978,4,"l");
        
        $tundishCar = read_file("//20/dd/fusion_struct_1",1162,1,"c") === 1 ? 1 : 2;
        $values['TUNDISH_CAR'] = $tundishCar;
        $values['TUNDISH_SHOS'] = trimReplace(read_file("//20/dd/fusion_struct_1",($tundishCar === 1) ? 1058 : 1208,50,"A50"));
        $values['TUNDISH_ID'] = read_file("//20/dd/fusion_struct_1",($tundishCar === 1) ? 1046 : 1194 ,4,"l");
        $values['TUNDISH_STOIK'] = read_file("//20/dd/fusion_struct_1",($tundishCar === 1) ? 1050 : 1200 ,4,"l");
        
        $values['SAMPLES'] = getMNLZ1Temps($startHour, $startMinute);
        
        $str = assembleQuery("CCM-1", $values);
        
        send($str);
    }
?>