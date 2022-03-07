<?php
    
    include_once("dbase.class.php");


    class Production extends DBase
    {
        var $startPoint;
        var $endPoint;
        
        
        
        function Production($startPoint, $endPoint) {
            parent::DBase();
            $this->startPoint = $startPoint;
            $this->endPoint = $endPoint;
        }
        
        
        
        function GetProductionInfo($agregate) {

            switch($agregate) {
                case "mnls1": 
                    $stmt = "SELECT
                                a.n_pl                                              HEAT_ID
                                ,a.bgn                                              START_POINT
                                ,a.nd                                               END_POINT
                                ,mn.sk                                              LADLE_ID
                                ,mn.pmk                                             TUNDISH_ID
                                ,mk.marka                                           STEEL_GRADE
                                ,mn.nws                                             SERIES
                                ,'0'||mn.vrasl1                                     CASTING_SPEED
                                ,s.cech                                             PROFILE_ID
                                ,(SELECT COUNT(*) FROM DBA.m_rez WHERE id=a.id)     SLABS
                                ,(SELECT MAX(temp) FROM m_tm WHERE id = a.id)       TEMP
                                ,mn.god                                             GOOD
                                ,mn.sk                                              STOIK_CRYST
                            FROM DBA.a_basic a
                            KEY JOIN DBA.m_mnls mn
                            LEFT OUTER JOIN DBA.marka1 mk ON mk.id=(IF LENGTH(a.kod_m)=6 THEN SUBSTR(a.kod_m,4,6) ELSE a.kod_m ENDIF)
                            LEFT OUTER JOIN DBA.s_m_sech s ON mn.sech = s.sech
                            WHERE (a.bgn >= '$this->startPoint' AND a.bgn < '$this->endPoint') AND a.owner = 'mnls1'
                            ORDER BY a.id;";
                    return $this->query($stmt);
                
                case "akos":
                    $stmt = "SELECT
                                a.n_pl          HEAT_ID
                                ,a.bgn          START_POINT
                                ,a.nd           END_POINT
                                ,mk.marka       STEEL_GRADE
                                ,asb.n_tab      HEAT_TAB
                                ,asb.massa      HEAT_WEIGHT
                                ,asb.n_sk       LADLE_ID
                                ,asb.ar         ARGON_EXPENSE
                                ,asb.tpr        ARGON_TIME
                                ,asb.ttok       CURRENT_TIME
                                ,asb.el         ENERGY_EXPENSE
                            FROM DBA.a_basic a
                            KEY JOIN DBA.as_basic asb
                            LEFT OUTER JOIN DBA.marka1 mk ON mk.id=(IF LENGTH(a.kod_m)=6 THEN SUBSTR(a.kod_m,4,6) ELSE a.kod_m ENDIF)
                            WHERE (a.bgn > '$this->startPoint' AND a.bgn < '$this->endPoint') AND a.owner = 'akos'
                            ORDER BY a.id;";
                    return $this->query($stmt);
                    
                case "dsp":
                    $stmt = "SELECT
                                a.n_pl		    HEAT_ID
                                ,a.bgn		    START_POINT
                                ,d.t_bgn	    FILL_POINT
                                ,d.t_nd		    FLUSH_POINT
                                ,a.nd		    END_POINT
                                ,mk.marka	    STEEL_GRADE
                                ,d.n_tab	    HEAT_TAB
                                ,d.massa	    HEAT_WEIGHT
                                ,d.el_dsp	    ENERGY_EXPENSE
                                ,d.ttok		    CURRENT_TIME
                                ,d.n_sk		    LADLE_ID
                            FROM DBA.a_basic a
                            LEFT OUTER JOIN DBA.d_basic d ON a.id=d.id
                            LEFT OUTER JOIN DBA.marka1 mk ON mk.id=IF LENGTH(a.kod_m)=6 THEN SUBSTR(a.kod_m,4,6) ELSE a.kod_m ENDIF
                            WHERE (a.bgn > '$this->startPoint' AND a.bgn < '$this->endPoint') AND a.owner = 'dsp'
                            ORDER BY a.id;";
                    return $this->query($stmt);
                    
                default: die("unknown agregate");
            }
        }
    }

?>