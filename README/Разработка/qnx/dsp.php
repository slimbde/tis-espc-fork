<?php
    
    require_once("./functions.php");
    
    
    //
    // assembles DSP gas info
    //
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
    



    //
    // fills target array with DSP chemicals
    //
    function appendDSPchemicals($values) {
        $nums = array();
        $times = array();
        $chemValues = array();
        
        for($i=0; $i<510; $i+=102) {
            $num = trimReplace(read_file("//10/dds/analysis",$i,4,"A4"));
            if(empty($num)) break;
            
            array_push($nums, $num);
            
            $hour = read_file("//10/dds/analysis",$offset+4,1,"c");
            $minute = read_file("//10/dds/analysis",$offset+5,1,"c");
            array_push($times, assembleTime($hour,$minute));
            
            $vals = array();
            for($j=0; $j<56; $j+=4) {
                array_push($vals, round(read_file("//10/dds/analysis",$i+$j+6,4,"f"),5));
            }
            
            $chemValues[$i/90] = implode(";",$vals);
        }
        
        $fileToStash = "dspChemStash.dat";
        
        if(count($nums) > 0) {
            // stash first probe to make it available any time
            $chemToStash = array();
            $chemToStash['CHEMICAL_NUMS'] = $nums[0];
            $chemToStash['CHEMICAL_TIMES'] = $times[0];
            $chemToStash['CHEMICAL_0'] = $chemValues[0];
            fileWriteParams($fileToStash, $chemToStash);
            
            $names = array('C','Mn','Si','S','P','Cr','Ni','Cu','Al','Ti','Mo','V','W','N');
            $values['CHEMICAL_KEY'] = implode(";",$names);
            
            $values['CHEMICAL_NUMS'] = implode(";",$nums);
            $values['CHEMICAL_TIMES'] = implode(";",$times);
            
            foreach($chemValues as $key => $val) {
                if($key === "nums" || $key === "times") continue;
                $values["CHEMICAL_$key"] = $val;
            }
        }
        // if probes are gone we still are able to use the last one from stash
        else $values = fileReadParams($fileToStash,$values);
        
        return $values;
    }
    
    
    
    
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
        
        $values = appendDSPchemicals($values);
        
        $str = assembleQuery("AF", $values);
        
        send($str);
    }
?>