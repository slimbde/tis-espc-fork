<?php
    
    require_once("./F.php");


    Class CCM2 extends F {
        
        /*  STATE
          0 "Холодный простой",
          1 "Начало разливки",
          2 "Разливка",
          3 "Смена СК",
          4 "Смена СК",
        */

        //
        // sending ccm2 instant data to the dispatcher db
        // written by Grigoriy Dolgiy 2022
        // inspired by Konstantin Telichko 
        //
        function SendData() {
            $values = array();
            
            $values['$DateTime'] = str_replace(" ", "%20", date( "Y-m-d H:i:s" ));
            
            $plawka = intval($this->read_file("//16/dd/CCM_mnlz72",4,2,"s"));
            $rasl = intval($this->read_file("//16/dd/CCM_mnlz72",6,2,"s"));
            $seriq = intval($this->read_file("//16/dd/CCM_mnlz72",8,2,"s"));
            
            $processCode = $plawka*100 + $rasl*10 + $seriq;
                
            $values["STATE"] = 0;
            if($processCode == 100) $values["STATE"] = 1;
            if($processCode == 110) $values["STATE"] = 2;
            if($processCode == 99)  $values["STATE"] = 3;
            if($processCode == 113) $values["STATE"] = 4;
            
            $values['HEAT_ID'] = $this->trimReplace($this->read_file("//16/dd/CCM_mnlz72",266,6,"A6"));
            $values['SEQ_NO'] = $this->read_file("//16/dd/CCM_mnlz72",42,2,"s");
            $values['STEEL_GRADE'] = $this->trimReplace($this->read_file("//16/dd/CCM_mnlz72",276,10,"A10"));
            $values['SLAB_WIDTH'] = floor($this->read_file("//16/dd/CCM_str_product",36,4,"f"));
            $values['SLAB_THICKNESS'] = floor($this->read_file("//16/dd/CCM_str_product",28,4,"f"));
            $values['CURRENT_TEMP'] = $this->read_file("//16/dd/CCM_mnlz72",228,2,"s");
            $values['HEAT_WEIGHT'] = round($this->read_file("//16/dd/CCM_mnlz72",254,2,"s")/10,1);
            $values['LADLE_RESIDUE'] = round($this->read_file("//16/dd/CCM_mnlz72",224,2,"s")/10,1);
            $values['CASTING_SPEED'] = round($this->read_file("//16/dd/CCM_mnlz72",236,2,"s")/100,2);
            
            $lob = $this->read_file("//16/dd/CCM_mnlz72",462,4,"l");
            $lser = $this->read_file("//16/dd/CCM_mnlz72",466,4,"l");
            $meters = round(($lob-$lser)/10, 1);
            
            $width = $this->read_file("//16/dd/CCM_mnlz72",506,2,"s");
            $thickness = $this->read_file("//16/dd/CCM_mnlz72",508,2,"s");
            $gravity = $this->read_file("//16/dd/CCM_mnlz72",512,2,"s");
            $tonns = round($meters*$width/1000*$thickness/1000*$gravity/1000,1);
            
            $values['CASTED_METERS'] = $meters;
            $values['CASTED_TONNS'] = $tonns;
            
            $str = $this->assembleQuery("CCM-2", $values);
            
            $this->send($str);
        }
    }
    
    $instance = new CCM2();
    $instance->SendData();
    
?>
