<?php
    
    require_once("./functions.php");
    
    //
    // sending dsp instant data to the dispatcher db
    // written by Grigoriy Dolgiy 2022
    // inspired by Julia Cherkasova 
    //
    function SendDSPdata() {
        $values = array();
    
        $values['$DateTime'] = trimReplace(date( "Y-m-d H:i:s" ));
        $values['HEAT_ID'] = read_file("//10/dds/fusion",10,4,"l");
        $values['HEAT_TAB'] = read_file("//10/dds/fusion",18,4,"l");
        $values['LADLE_ID'] = read_file("//10/dds/fusion",24,2,"s");
        $values['PSN'] = read_file("//10/dds/hveqan",0,4,"l") - 1;
        $values['STEEL_GRADE'] = trimReplace(read_file("//10/dds/steel",14,16,"A16"));
        $values['HEAT_START'] = gmdate("H:i:s", read_file("//10/dds/smelt_start",14,4,"l"));
        $values['HEAT_TIME'] = gmdate("H:i:s", read_file("//10/dds/eenerg",0,4,"l"));
        $values['HEAT_CURRENT_TIME'] = gmdate("H:i:s", read_file("//10/dds/eenerg",4,4,"l"));
        $values['ENERGY_ON']  = read_file("//10/dds/proc",1,1,"c");
        $values['EE_HEAT_ACTIVE'] = read_file("//10/dds/eenerg",8,4,"l");
        $values['EE_HEAT_REACTIVE'] = read_file("//10/dds/eenerg",56,4,"l");
        $values['EE_TODAY_ACTIVE'] = round(read_file("//10/dds/eenerg",24,4,"l") * (1 - read_file("//10/dds/eenerg",40,4,"l") / read_file("//10/dds/eenerg",28,4,"l")));
        $values['EE_TODAY_REACTIVE'] = round(read_file("//10/dds/eenerg",32,4,"l") * (1 - read_file("//10/dds/eenerg",48,4,"l") / read_file("//10/dds/eenerg",36,4,"l")));
        $values['EE_YEST_ACTIVE'] = read_file("//10/dds/eenerg",44,4,"l");
        $values['EE_YEST_REACTIVE'] = read_file("//10/dds/eenerg",52,4,"l");
        $values['STOIK_SVOD_LG'] = read_file("//10/dds/stoik",0,4,"l");
        $values['STOIK_SVOD_SM'] = read_file("//10/dds/stoik",4,4,"l");
        $values['STOIK_WALL'] = read_file("//10/dds/stoik",8,4,"l");
        $values['STOIK_FLOOR'] = read_file("//10/dds/stoik",12,4,"l");
        $values['STOIK_Q1'] = read_file("//10/dds/stoik",16,4,"l");
        $values['STOIK_Q2'] = read_file("//10/dds/stoik",20,4,"l");
        $values['STOIK_ERK'] = read_file("//10/dds/stoik",24,4,"l");
        $values['STOIK_CASE_FRMW'] = read_file("//10/dds/stoik",40,4,"l");
        $values['STOIK_SVOD_FRMW'] = read_file("//10/dds/stoik",48,4,"l");
        $values['ANGLE'] = read_file("//10/dds/pfenc1",76,4,"f");
        //$values['ANGLE'] = read_file("//10/dds/pfenc4",4,4,"f");
        
        $gas = getDSPgas();
        $values['GAS_SFG1'] = $gas['sfg1'];
        $values['GAS_SFG2'] = $gas['sfg2'];
        $values['GAS_SFG3'] = $gas['sfg3'];
        $values['GAS_SFG4'] = $gas['sfg4'];
        $values['GAS_SFG5'] = $gas['sfg5'];
        $values['GAS_MF'] = $gas['mf'];
        $values['GAS_PK'] = $gas['pk'];
        $values['GAS_SUMM'] = $gas['summ'];
        
        $str = assembleQuery("AF", $values);
        
        send($str);
    }
?>