<?php
    
    require_once("./F.php");


    Class DSP extends F {
        
        /* STATE =  
          "Холодный простой",             0
          "Плавление завалки",            1
          "Плавление первой подвалки",    2    
          "Плавление второй подвалки",    3
          "Доводка металла",              4
          "Горячий простой"               5    
        */
        
        //
        // assembles DSP gas info
        //
        function appendDSPgas($values) {
            $sfg1 = array();
            array_push($sfg1,round($this->read_file("//10/dds/c4_sfg",46,4,"f")));
            array_push($sfg1,round($this->read_file("//10/dds/exp_burn",32,4,"f")));
            array_push($sfg1,round($this->read_file("//10/dds/c4_sfg",50,4,"f")));
            array_push($sfg1,round($this->read_file("//10/dds/exp_burn",36,4,"f")));
            array_push($sfg1,round($this->read_file("//10/dds/c4_sfg",54,4,"f")));
            array_push($sfg1,round($this->read_file("//10/dds/exp_furm",16,4,"f")));
            
            $sfg2 = array();
            array_push($sfg2,round($this->read_file("//10/dds/c4_sfg",94,4,"f")));
            array_push($sfg2,round($this->read_file("//10/dds/exp_burn",40,4,"f")));
            array_push($sfg2,round($this->read_file("//10/dds/c4_sfg",98,4,"f")));
            array_push($sfg2,round($this->read_file("//10/dds/exp_burn",44,4,"f")));
            array_push($sfg2,round($this->read_file("//10/dds/c4_sfg",102,4,"f")));
            array_push($sfg2,round($this->read_file("//10/dds/exp_furm",32,4,"f")));
            
            $sfg3 = array();
            array_push($sfg3,round($this->read_file("//10/dds/c4_sfg",142,4,"f")));
            array_push($sfg3,round($this->read_file("//10/dds/exp_burn",48,4,"f")));
            array_push($sfg3,round($this->read_file("//10/dds/c4_sfg",146,4,"f")));
            array_push($sfg3,round($this->read_file("//10/dds/exp_burn",52,4,"f")));
            array_push($sfg3,round($this->read_file("//10/dds/c4_sfg",150,4,"f")));
            array_push($sfg3,round($this->read_file("//10/dds/exp_furm",48,4,"f")));
            
            $sfg4 = array();
            array_push($sfg4,round($this->read_file("//10/dds/c4_sfg",190,4,"f")));
            array_push($sfg4,round($this->read_file("//10/dds/exp_burn",56,4,"f")));
            array_push($sfg4,round($this->read_file("//10/dds/c4_sfg",194,4,"f")));
            array_push($sfg4,round($this->read_file("//10/dds/exp_burn",60,4,"f")));
            array_push($sfg4,round($this->read_file("//10/dds/c4_sfg",198,4,"f")));
            array_push($sfg4,round($this->read_file("//10/dds/exp_furm",64,4,"f")));
            
            $sfg5 = array();
            array_push($sfg5,round($this->read_file("//10/dds/c4_sfg",238,4,"f")));
            array_push($sfg5,round($this->read_file("//10/dds/exp_burn",64,4,"f")));
            array_push($sfg5,round($this->read_file("//10/dds/c4_sfg",242,4,"f")));
            array_push($sfg5,round($this->read_file("//10/dds/exp_burn",68,4,"f")));
            array_push($sfg5,round($this->read_file("//10/dds/c4_sfg",246,4,"f")));
            array_push($sfg5,round($this->read_file("//10/dds/exp_furm",80,4,"f")));
            
            $mf = array();
            array_push($mf,round($this->read_file("//10/dds/c4_mf",20,4,"f")));
            array_push($mf,round($this->read_file("//10/dds/exp_mf",0,4,"f")));
            array_push($mf,round($this->read_file("//10/dds/c4_mf",24,4,"f")));
            array_push($mf,round($this->read_file("//10/dds/exp_mf",4,4,"f")));
            array_push($mf,round($this->read_file("//10/dds/c4_mf",28,8,"f")));
            array_push($mf,round($this->read_file("//10/dds/exp_mf",8,8,"f")));
            
            $pk = array();
            array_push($pk,round($this->read_file("//10/dds/c4_pk",4,4,"f")));
            array_push($pk,round($this->read_file("//10/dds/unkeeppk",0,4,"f")));
            array_push($pk,round($this->read_file("//10/dds/exp_mf",12,4,"f")));
            array_push($pk,round($this->read_file("//10/dds/unkeeppk",4,4,"f")));
            
            $summ = array();
            for($i=0; $i<6; ++$i) {
                $summ[$i] = $sfg1[$i] + $sfg2[$i] + $sfg3[$i] + $sfg4[$i] + $sfg5[$i] + $mf[$i];
                
                if($i<4) 
                    $summ[$i] += $pk[$i];
            }
            
            $values['GAS_SFG1'] = implode(";",$sfg1);
            $values['GAS_SFG2'] = implode(";",$sfg2);
            $values['GAS_SFG3'] = implode(";",$sfg3);
            $values['GAS_SFG4'] = implode(";",$sfg4);
            $values['GAS_SFG5'] = implode(";",$sfg5);
            $values['GAS_MF'] = implode(";",$mf);
            $values['GAS_PK'] = implode(";",$pk);
            $values['GAS_SUMM'] = implode(";",$summ);
            
            return $values;
        }
        



        //
        // fills target array with DSP chemicals
        //
        function appendDSPchemicals($values) {
            $nums = array();
            $times = array();
            $chemValues = array();
            
            for($i=0; $i<510; $i+=102) {
                $num = $this->trimReplace($this->read_file("//10/dds/analysis",$i,4,"A4"));
                if(empty($num)) break;
                
                array_push($nums, $num);
                
                $hour = $this->read_file("//10/dds/analysis",$offset+4,1,"c");
                $minute = $this->read_file("//10/dds/analysis",$offset+5,1,"c");
                array_push($times, $this->assembleTime($hour,$minute));
                
                $vals = array();
                for($j=0; $j<56; $j+=4) {
                    array_push($vals, round($this->read_file("//10/dds/analysis",$i+$j+6,4,"f"),5));
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
                $this->fileWriteParams($fileToStash, $chemToStash);
                
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
            else $values = $this->fileReadParams($fileToStash,$values);
            
            return $values;
        }
        
        
        
        
        //
        // sending dsp instant data to the dispatcher db
        // written by Grigoriy Dolgiy 2022
        // inspired by Julia Cherkasova 
        //
        function SendData() {
            $values = array();
        
            $values['$DateTime'] = $this->trimReplace(date( "Y-m-d H:i:s" ));
            $values['HEAT_ID'] = $this->read_file("//10/dds/fusion",10,4,"l");
            $values['HEAT_TAB'] = $this->read_file("//10/dds/fusion",18,4,"l");
            $values['LADLE_ID'] = $this->read_file("//10/dds/fusion",24,2,"s");
            $values['PSN'] = $this->read_file("//10/dds/hveqan",0,4,"l") - 1;
            $values['STEEL_GRADE'] = $this->trimReplace($this->read_file("//10/dds/steel",14,16,"A16"));
            $values['HEAT_START'] = gmdate("H:i:s", $this->read_file("//10/dds/smelt_start",14,4,"l"));
            $values['HEAT_TIME'] = gmdate("H:i:s", $this->read_file("//10/dds/eenerg",0,4,"l"));
            $values['HEAT_CURRENT_TIME'] = gmdate("H:i:s", $this->read_file("//10/dds/eenerg",4,4,"l"));
            $values['EE_HEAT_REACTIVE'] = $this->read_file("//10/dds/eenerg",56,4,"l");
            $values['EE_TODAY_ACTIVE'] = round($this->read_file("//10/dds/eenerg",24,4,"l") * (1 - $this->read_file("//10/dds/eenerg",40,4,"l") / $this->read_file("//10/dds/eenerg",28,4,"l")));
            $values['EE_TODAY_REACTIVE'] = round($this->read_file("//10/dds/eenerg",32,4,"l") * (1 - $this->read_file("//10/dds/eenerg",48,4,"l") / $this->read_file("//10/dds/eenerg",36,4,"l")));
            $values['EE_YEST_ACTIVE'] = $this->read_file("//10/dds/eenerg",44,4,"l");
            $values['EE_YEST_REACTIVE'] =$this->read_file("//10/dds/eenerg",52,4,"l");
            $values['STOIK_SVOD_LG'] =$this->read_file("//10/dds/stoik",0,4,"l");
            $values['STOIK_SVOD_SM'] =$this->read_file("//10/dds/stoik",4,4,"l");
            $values['STOIK_WALL'] =$this->read_file("//10/dds/stoik",8,4,"l");
            $values['STOIK_FLOOR'] =$this->read_file("//10/dds/stoik",12,4,"l");
            $values['STOIK_Q1'] =$this->read_file("//10/dds/stoik",16,4,"l");
            $values['STOIK_Q2'] =$this->read_file("//10/dds/stoik",20,4,"l");
            $values['STOIK_ERK'] =$this->read_file("//10/dds/stoik",24,4,"l");
            $values['STOIK_CASE_FRMW'] =$this->read_file("//10/dds/stoik",40,4,"l");
            $values['STOIK_SVOD_FRMW'] =$this->read_file("//10/dds/stoik",48,4,"l");
            $values['ANGLE'] =$this->read_file("//10/dds/pfenc1",76,4,"f");
            
            $procSmStat = intval($this->read_file("//10/dds/proc",0,1,"c"));
            $eenergData02 = intval($this->read_file("//10/dds/eenerg",8,4,"l"));
            $procEeInput = intval($this->read_file("//10/dds/proc",1,1,"c"));
            
            $processCode = 0;
            if($procSmStat > 0) $processCode = round($eenergData02/15000 + 1);
            if($processCode > 0 && $procEeInput === 0) $processCode = 5;
            
            $values['STATE'] = $processCode;
            $values['ENERGY_ON']  = $procEeInput;
            $values['EE_HEAT_ACTIVE'] = $eenergData02;
            
            $values = $this->appendDSPgas($values);
            
            $values = $this->appendDSPchemicals($values);
            
            $str = $this->assembleQuery("AF", $values);
            
            $this->send($str);
        }
    }
    
    $instance = new DSP();
    $instance->SendData();
    
?>
