<?php
    
    require_once("./F.php");


    Class AKOS extends F {
        
        /*  STATE
          0 "Холодный простой",
          1 "Горячий простой",
          2 "Продувка",
          3 "Под током",
          4 "Под током и продувка",
        */
        
        
        
        //
        // assembles AKOS temperatures
        //
        function getAKOStemps() {
            $times = array();
            $values = array();
            
            for($i=0; $i<10; ++$i) {
                $offset = $i*10;
                
                $val = intval($this->read_file("//14/dd/tsteel",$offset+2,4,"l"));
                if($val == 0) break;
                
                array_push($values, $val);
                
                $hour = $this->read_file("//14/dd/tsteel",$offset,1,"c");
                $minute = $this->read_file("//14/dd/tsteel",$offset+1,1,"c");
                array_push($times, $this->assembleTime($hour,$minute));
            }
            
            $result = array();
            for($j=0; $j<count($values); ++$j) {
                $pair = "$times[$j]=$values[$j]";
                array_push($result, $pair);
            }
            
            $result = implode(";",$result);
            return $result;
        }





        //
        // fills target array with AKOS chemicals
        //
        function appendAKOSChemicals($values) {
            $nums = array();
            $times = array();
            $chemValues = array();
            
            for($i=0; $i<450; $i+=90) {
                $num = $this->trimReplace($this->read_file("//14/dd/chemical",$i,4,"A4"));
                if(empty($num)) break;
                
                array_push($nums, $num);
                
                $hour = $this->read_file("//14/dd/chemical",$i+4,1,"c");
                $minute = $this->read_file("//14/dd/chemical",$i+5,1,"c");
                array_push($times, $this->assembleTime($hour,$minute));
                
                $vals = array();
                for($j=0; $j<56; $j+=4) {
                    array_push($vals, round($this->read_file("//14/dd/chemical",$i+$j+6,4,"f"),5));
                }
                
                $chemValues[$i/90] = implode(";",$vals);
            }
            
            $stash = $this->fileReadParams("akosChemStash.dat",$stash);
            
            if(count($nums) > 0) {
                // stash first probe to make it available any time
                $stash['CHEMICAL_NUMS'] = $nums[0];
                $stash['CHEMICAL_TIMES'] = $times[0];
                $stash['CHEMICAL_0'] = $chemValues[0];
                $this->fileWriteParams("akosChemStash.dat", $stash);
                
                $values['CHEMICAL_NUMS'] = implode(";",$nums);
                $values['CHEMICAL_TIMES'] = implode(";",$times);
                
                foreach($chemValues as $key => $val) {
                    if($key === "nums" || $key === "times") continue;
                    $values["CHEMICAL_$key"] = $val;
                }
            }
            // if probes are gone we still are able to use the last one from stash
            else {
                $values['CHEMICAL_NUMS'] = $stash['CHEMICAL_NUMS'];
                $values['CHEMICAL_TIMES'] = $stash['CHEMICAL_TIMES'];
                $values['CHEMICAL_0'] = $stash['CHEMICAL_0'];
            }
                
            $names = array('C','Mn','Si','S','P','Cr','Ni','Cu','Al','Ti','Mo','V','W','N');
            $values['CHEMICAL_KEY'] = implode(";",$names);
            
            return $values;
        }
        
        
        
        
        
        //
        // sending akos instant data to the dispatcher db
        // written by Grigoriy Dolgiy 2022
        // inspired by Julia Cherkasova 
        //
        function SendData() {
            $values = array();
        
            $values['$DateTime'] = str_replace(" ", "%20", date( "Y-m-d H:i:s" ));
            $values['HEAT_ID'] = $this->read_file("//14/dd/fusion",10,4,"l");
            $values['STEEL_GRADE'] = $this->trimReplace($this->read_file("//14/dd/curmark",8,32,"A32"));
            $values['LADLE_ID'] = $this->read_file("//14/dd/fusion",22,1,"c");
            $values['CURRENT_TEMP'] = $this->read_file("//14/dd/steel4diagn",82,2,"s");
            $values['ARGON_FLOW'] = $this->read_file("//14/dd/Ar_i",0,2,"s");
            $values['ARGON_PRESSURE'] = round($this->read_file("//14/dd/Ar_c",19,4,"f"),1);
            $values['SVOD_VERTICAL'] = $this->read_file("//14/dd/mecanics",0,1,"c");
            $values['SVOD_HORIZONTAL'] = $this->read_file("//14/dd/mecanics",1,1,"c");
            $values['HEAT_WEIGHT'] = $this->read_file("//14/dd/mass",0,4,"f");
            $values['HEAT_TAB'] = $this->read_file("//14/dd/fusion",18,4,"l");
            $values['EE_HEAT_ACTIVE'] = $this->read_file("//14/dd/elpar_vu",4,4,"l");
            $values['STOIK_SVOD'] = $this->read_file("//14/dd/vacswitch",7,2,"s");
            $values['ARGON_FLOW_INST'] = $this->read_file("//14/dd/Ar_c",6,2,"s");
            $values['ARGON_TIME'] = $this->minToTime($this->read_file("//14/dd/Ar_i",6,2,"s"));
            $values['ARGON_DELAY'] = $this->minToTime($this->read_file("//14/dd/Ar_i",4,2,"s"));
            $values['ARGON_FLOW_DOWN'] = $this->read_file("//14/dd/Ar_i",23,2,"s");
            $values['ARGON_TIME_DOWN'] = $this->minToTime($this->read_file("//14/dd/Ar_i",25,2,"s"));
            $values['ARGON_FLOW_INST_PWD'] = $this->read_file("//14/dd/pour_isa",0,4,"f");
            $values['STEAM_PIPE_VACUUM'] = round($this->read_file("//14/dd/funnel",0,4,"f"),1);
            
            $elparVuSumWorktime = intval($this->read_file("//14/dd/elpar_vu",33,2,"s"));
            $akosProcessFlowProc = intval($this->read_file("//14/dd/akos_process",0,1,"c"));
            $akosProcessCurrentProc = intval($this->read_file("//14/dd/akos_process",1,1,"c"));
            
            $values['ARGON_ON'] = $akosProcessFlowProc;
            $values['ENERGY_ARC_ON'] = $akosProcessCurrentProc;
            $values['HEAT_CURRENT_TIME'] = $this->minToTime($elparVuSumWorktime);
            
            $i=1;
            if($elparVuSumWorktime + $akosProcessFlowProc + $akosProcessCurrentProc === 0) $i=0;
            
            $processCode = $i*100 + $akosProcessFlowProc*10 + $akosProcessCurrentProc;
            
            $values["STATE"] = 0;
            if($processCode == 100) $values["STATE"] = 1;
            if($processCode == 110) $values["STATE"] = 2;
            if($processCode == 101) $values["STATE"] = 3;
            if($processCode == 111) $values["STATE"] = 4;
            
            $values['SAMPLES'] = $this->getAKOStemps();
            $values = $this->appendAKOSChemicals($values);
            
            $str = $this->assembleQuery("EAKP-2", $values);
            
            $this->send($str);
        }
    }
    
    $instance = new AKOS();
    $instance->SendData();
    
?>
