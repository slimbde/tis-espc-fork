<?php
    
    require_once("./F.php");


    Class VOD extends F {
        
        /*  STATE
            "Холодный простой", 0
            "Горячий простой",  1
            "Продувка",         2
            "Вакуум",           3
            "Вакуум и продувка" 4
        */
        
        
        
        //
        // calculates aggregate state
        //
        function getState($stirring,$vacuum,$processFlag) {
            $processCode = $processFlag*100 + ($stirring-1)*10 + ($vacuum-1);
            
            $state = 0;
            if($processCode == 100) $state = 1;
            if($processCode == 110) $state = 2;
            if($processCode == 101) $state = 3;
            if($processCode == 111) $state = 4;
            
            return $state;
        }
        
        
        //
        // retrieves all necessary params from DD
        //
        function calculateParams($tank,$activeTank) {
            $values = array();
            $values['$DateTime'] = $this->trimReplace(date( "Y-m-d H:i:s" ));
            
            $vodASUTP = "//16/dd/VOD_asutp$tank";
            $vodMSPstatus = "//16/dd/VOD_msp_status$tank";
            $vodHeatInfo = "//16/dd/VOD_heat_info_bgn$tank";
            
            $stirringStatus = intval($this->read_file($vodMSPstatus,18,2,"s"));
            $vacuumStatus = intval($this->read_file($vodMSPstatus,8,2,"s"));
            $processFlag = intval($this->read_file($vodASUTP,0,2,"s"));
            
            $values["STATE"] = $tank===$activeTank
                ? $this->getState($stirringStatus,$vacuumStatus,$processFlag)
                : 0;
            
            // when heat is done it shouldn't update anymore
            if($values["STATE"] !== 0) {
                $values["HEAT_ID"] = $this->trimReplace($this->read_file($vodASUTP,2,10,"A10"));
                $values["STEEL_GRADE"] = $this->trimReplace($this->read_file($vodASUTP,12,10,"A10"));
                $values["LADLE_ID"] = $this->trimReplace($this->read_file($vodASUTP,22,10,"A10"));
                $values["VACUUM_PRESSURE"] = round($this->read_file($vodMSPstatus,72,2,"s")/10,1);
                $values['VACUUM_TIME'] = gmdate("H:i:s", $this->read_file($vodMSPstatus,132,2,"s"));
                $values['HEAT_START'] = $this->oleToTime(doubleval($this->read_file($vodHeatInfo,249,8,"d")));
                
                if($tank === $activeTank) {
                    $values["HEAT_WEIGHT"] = round($this->read_file("//16/dd/VOD_msp_est_data",22,2,"s")/100,1);
                    $values["CURRENT_TEMP"] = intval($this->read_file("//16/dd/VOD_msp_est_data",20,2,"s"));
                }
            }
            
            return $values;
        }
        
        
        
        //
        // sending akp instant data to the dispatcher db
        // written by Grigoriy Dolgiy 2022
        // inspired by Konstantin Telichko
        //
        function SendData() {
            $tank = 1;
            $check = intval($this->read_file("//16/dd/VOD_asutp1",0,2,"s"));
            if($check < 1) $tank = 2;
            
            $nonActiveTank = $tank == 2 ? 1 : 2;
            
            $values = $this->calculateParams($tank,$tank);
            $valuesNonActive = $this->calculateParams($nonActiveTank,$tank);
            
            
            $activeTankName = "VD-2$tank";
            $nonActiveTankName = "VD-2$nonActiveTank";
            
            $str = $this->assembleQuery($activeTankName, $values);
            $str2 = $this->assembleQuery($nonActiveTankName, $valuesNonActive);
                
            $this->send($str);
            $this->send($str2);
        }
    }
    
    $instance = new VOD();
    $instance->SendData();
    
?>
