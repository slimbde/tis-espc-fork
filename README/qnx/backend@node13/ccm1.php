<?php
    
    require_once("./F.php");


    //
    // sending ccm1 instant data to the dispatcher db
    // written by Grigoriy Dolgiy 2022
    // inspired by Albert Zagirov 
    //
    Class CCM1 extends F {
        /*  STATE
          0 "Холодный простой",
          1 "Разливка",
          2 "Разливка и раскрой",
          3 "Раскрой",
          4 "Плавка на плавку",
        */
        
        //
        // retrieves CCM1 temperatures
        //
        function getCCM1Temps($startHour, $startMinute) {
            $result = array();
            
            for($i=0; $i<10; ++$i) {
                $hour = $this->read_file("//20/dd/length_tsteel_1", $i*10+0, 1, "c");
                $minute = $this->read_file("//20/dd/length_tsteel_1", $i*10+1, 1, "c");
                
                if(($hour == $startHour && $minute > $startMinute) 
                    || ($hour > $startHour)
                    || ($startHour > 20 && $hour < 10)  // on the day's edge
                    ) {
                        $temp = $this->read_file("//20/dd/length_tsteel_1", $i*10+6, 4, "l");
                        array_push($result, $temp);
                    }
            }
            
            $result = implode(";",$result);
            
            // as dev_value field of the target database is of length = 30, truncate the output string
            if(strlen($result) > 30)        
                $result = substr($result, 0, 30);
            
            return $result;
        }
        
        
        
       
        function SendData() {
            $values = array();
            
            $values['$DateTime'] = str_replace(" ", "%20", date( "Y-m-d H:i:s" ));
            
            $plawka = intval($this->read_file("//20/dd/mnlz72",4,2,"s"));
            $rasl = intval($this->read_file("//20/dd/mnlz72",6,2,"s"));
            $seriq = intval($this->read_file("//20/dd/mnlz72",8,2,"s"));
            
            $processCode = $plawka*100 + $rasl*10 + $seriq;
                
            $values["STATE"] = 0;
            if($processCode == 100) $values["STATE"] = 1;
            if($processCode == 110) $values["STATE"] = 2;
            if($processCode == 99)  $values["STATE"] = 3;
            if($processCode == 113) $values["STATE"] = 4;
            
            $startHour = $this->read_file("//20/dd/fusion_isa_1",118,1,"c");
            $startMinute = $this->read_file("//20/dd/fusion_isa_1",119,1,"c");
            $startSecond = $this->read_file("//20/dd/fusion_isa_1",120,1,"c"); 
            $values['HEAT_START'] = $this->assembleTime($startHour, $startMinute, $startMinute);
            
            $endHour = $this->read_file("//20/dd/fusion_isa_1",126,1,"c");
            $endMinute = $this->read_file("//20/dd/fusion_isa_1",127,1,"c");
            $endSecond = $this->read_file("//20/dd/fusion_isa_1",128,1,"c");
            $values['HEAT_TIME'] = $this->assembleTime($endHour, $endMinute, $endSecond);
            
            $params = $this->fileReadParams("ccm1Stash.dat",$params);
            $values['HEAT_END'] = substr($params["END_POINT"],13,9);
            
            $values['HEAT_ID'] = $this->read_file("//20/dd/fusion_isa_1",62,4,"l");
            $values['HEAT_WEIGHT'] = round($this->read_file("//20/dd/calcv_1",28,4,"f"), 1);
            $values['SEQ_NO'] = $this->read_file("//20/dd/fusion_isa_1",58,4,"l");
            $values['CASTING_SPEED'] = round($this->read_file("//20/dd/fusion_isa_1",30,4,"f"), 2);
            $values['OPTIMAL_SPEED'] = round($this->read_file("//20/dd/calcv_1",0,4,"f"), 2);
            $values['FLOW_SPEED'] = round($this->read_file("//20/dd/fusion_isa_1",26,4,"f") * 60 / 1000, 2);
            $values['CASTED_METERS'] = round($this->read_file("//20/dd/fusion_isa_1",78,4,"f"), 1);
            $values['CASTED_TONNS'] = round($this->read_file("//20/dd/fusion_isa_1",82,4,"f"), 1);
            $values['STREAM_CAST'] = $this->read_file("//20/dd/fusion_isa_1",24,1,"c") == 1 ? "True" : "False";
            $values['STEEL_GRADE'] = $this->trimReplace($this->read_file("//20/dd/fusion_struct_1",74,10,"A10"));
            $values['SLAB_WIDTH'] = $this->read_file("//20/dd/fusion_struct_1",822,4,"l");
            $values['SLAB_THICKNESS'] = $this->read_file("//20/dd/fusion_struct_1",826,4,"l");
            $values['TEAM_ID'] = $this->read_file("//20/dd/fusion_struct_1",8,4,"l");
            $values['SHIFT_CODE'] = $this->read_file("//20/dd/fusion_struct_1",12,4,"l");
            $values['SHIFT_RESPONSIBLE'] = $this->trimReplace($this->read_file("//20/dd/fusion_struct_1",16,50,"A50"));
            $values['CUT_ID'] = $this->read_file("//20/dd/fusion_struct_1",1550,4,"l");
            $values['CURRENT_TEMP'] = round($this->read_file("//20/dd/calcv_1",16,4,"f"), 0);
            
            $values['CRYST_STOIK'] = $this->read_file("//20/dd/fusion_struct_1",834,4,"l");
            $values['CRYST_SHOS'] = $this->trimReplace($this->read_file("//20/dd/fusion_struct_1",838,50,"A50"));
            $values['CRYST_FREQ'] = round($this->read_file("//20/dd/ado6_analog_1",28,4,"f"), 1);
            $values['CRYST_PULL_EFFORT'] = round($this->read_file("//20/dd/ado6_analog_1",288,4,"f"), 1);
            $values['CRYST_T_SHEARS'] = round($this->read_file("//20/dd/zvo_c_1",320,4,"f"), 0);
            $values['CRYST_T_BEFORE'] = round($this->read_file("//20/dd/zvo_c_1",308,4,"f"), 1);
            $values['CRYST_T_DELTA'] = round($this->read_file("//20/dd/zvo_c_1",316,4,"f"), 1);
            $values['CRYST_FLOW'] = round($this->read_file("//20/dd/zvo_c_1",124,4,"f"), 0);
            $values['CRYST_F_LEFT'] = round($this->read_file("//20/dd/zvo_c_1",112,4,"f"), 2);
            $values['CRYST_F_RIGHT'] = round($this->read_file("//20/dd/zvo_c_1",100,4,"f"), 2);
            
            $values['LADLE_ID'] = $this->read_file("//20/dd/fusion_struct_1",962,4,"l");
            $values['LADLE_STOIK'] = $this->read_file("//20/dd/fusion_struct_1",966,4,"l");
            $values['LADLE_ARM'] = $this->read_file("//20/dd/fusion_struct_1",974,4,"l");
            $values['LADLE_SHIB'] = $this->read_file("//20/dd/fusion_struct_1",978,4,"l");
            
            $tundishCar = $this->read_file("//20/dd/fusion_struct_1",1162,1,"c") === 1 ? 1 : 2;
            $values['TUNDISH_CAR'] = $tundishCar;
            $values['TUNDISH_SHOS'] = $this->trimReplace($this->read_file("//20/dd/fusion_struct_1",($tundishCar === 1) ? 1058 : 1208,50,"A50"));
            $values['TUNDISH_ID'] = $this->read_file("//20/dd/fusion_struct_1",($tundishCar === 1) ? 1046 : 1194 ,4,"l");
            $values['TUNDISH_STOIK'] = $this->read_file("//20/dd/fusion_struct_1",($tundishCar === 1) ? 1050 : 1200 ,4,"l");
            
            $values['SAMPLES'] = $this->getCCM1Temps($startHour, $startMinute);
            
            $str = $this->assembleQuery("CCM-1", $values);
            
            $this->send($str);
        }
    }
    
    
    $instance = new CCM1();
    $instance->SendData();
    
?>