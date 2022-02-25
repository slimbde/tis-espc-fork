<?php
    
    require_once("./F.php");


    Class AKP extends F {
        
        /* STATE 
           "Холодный простой",      0
           "Горячий простой",       1
           "Продувка",              2
           "Под током",             3
           "Под током и продувка"   4
        */
        
        
        //
        // calculates aggregate state
        //
        function getState($phase,$stirring,$power,$processFlag) {
            $i = ($phase == 2 || (($stirring-1)*10+($power-1)) > 0) ? 1 : 0;
            $processCode = $i*100+($stirring-1)*10+($power-1);
            
            $state = 0;
            if($processCode == 100) $state = 1;
            if($processCode == 110) $state = 2;
            if($processCode == 101) $state = 3;
            if($processCode == 111) $state = 4;
            
            if($processFlag > 0 && $state === 0) $state = 1;
            return $state;
        }
        
        
        //
        // retrieves all necessary params from DD
        //
        function calculateParams($tank,$activeTank) {
            $values = array();
            $values['$DateTime'] = $this->trimReplace(date( "Y-m-d H:i:s" ));
            
            $nonActiveTank = $tank == 2 ? 1 : 2;
            
            $lfHeatInfo = "//16/dd/LF_heat_info_bgn1$tank";
            $lfHeatNonActiveInfo = "//16/dd/LF_heat_info_bgn1$nonActiveTank";
            $lfStatus = "//16/dd/LF_msp_status$tank";
            $lfAsutp = "//16/dd/LF_asutp$tank";
            
            $processPhase = intval($this->read_file("//16/dd/LF_hireg_est_data",22,2,"s"));
            $stirringStatus = intval($this->read_file($lfStatus,18,2,"s"));
            $powerStatus = intval($this->read_file($lfStatus,2,2,"s"));
            $processFlag = intval($this->read_file($lfAsutp,0,2,"s"));
            
            $values["STATE"] = $this->getState($processPhase,$stirringStatus,$powerStatus,$processFlag);
            
            // when heat is done it shouldn't update anymore
            if($values["STATE"] !== 0) {
                $values["HEAT_ID"] = $this->trimReplace($this->read_file($lfAsutp,2,10,"A10"));
                $values["STEEL_GRADE"] = $this->trimReplace($this->read_file($lfAsutp,12,10,"A10"));
                $values["HEAT_CURRENT_TIME"] = $this->minToTime(floor($this->read_file($lfStatus,122,2,"s")/60));
                $values["LADLE_ID"] = $this->trimReplace($this->read_file($lfAsutp,22,10,"A10"));
                
                if($tank === $activeTank) {
                    $values["HEAT_WEIGHT"] = round($this->read_file("//16/dd/LF_msp_est_data",22,2,"s")/100,1);
                    $values["CURRENT_TEMP"] = intval($this->read_file("//16/dd/LF_msp_est_data",20,2,"s"));
                    
                    //$bgnHeatId = $this->trimReplace($this->read_file($lfHeatInfo,34,20,"A20"));
                    
                    //$timeTank = $this->oleToTime(doubleval($this->read_file($lfHeatInfo,249,8,"d")));
                    //$timeNonActivetank = $this->oleToTime(doubleval($this->read_file($lfHeatNonActiveInfo,249,8,"d")));
                    
                    //$values['HEAT_START'] = $values["HEAT_ID"] === $bgnHeatId ? $timeTank : $timeNonActivetank;
                }
                
                $argon1 = $this->read_file($lfStatus,56,2,"s")*6/100;
                $argon2 = $this->read_file($lfStatus,60,2,"s")*6/100;
                $values["ARGON_FLOW_DOWN"] = $this->trimReplace(sprintf("%.0f %.0f",$argon1,$argon2));
            }
            
            return $values;
        }
        
        
        
        //
        // sending akp instant data to the dispatcher db
        // written by Grigoriy Dolgiy 2022
        // inspired by Konstantin Telichko
        //
        function SendData() {
            $tank = 2;

            $check = intval($this->read_file("//16/dd/LF_asutp1",0,2,"s"));
            if($check > 0) $tank = 1;
            
            $nonActiveTank = $tank == 2 ? 1 : 2;
            
            $values = $this->calculateParams($tank,$tank);
            $valuesNonActive = $this->calculateParams($nonActiveTank,$tank);
            
            $activeTankName = "EAKP-1$tank";
            $nonActiveTankName = "EAKP-1$nonActiveTank";
            
            $str = $this->assembleQuery($activeTankName, $values);
            $str2 = $this->assembleQuery($nonActiveTankName, $valuesNonActive);
                
            $this->send($str);
            $this->send($str2);
        }
    }
    
    $instance = new AKP();
    $instance->SendData();
    
?>
