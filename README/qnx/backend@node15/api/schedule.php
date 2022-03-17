<?php
    
    $http_origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $http_origin");
    
    require_once("./include/dbase.class.php");

    
    //
    // Provides TIS schedule info
    // Written by Grigoriy Dolgiy 2022
    //
    
    //http://10.2.19.215/api/schedule.php?date=2022-03-01
    
    
    if(isset($_GET["date"])) {
        $date = $_GET["date"];
    
        if(!strpos($date,"-")) {
            header("HTTP/1.1 500 Internal Server Error");
            echo "wrong date format. try YYYY-MM-DD";
            return;
        }
        
        $startPoint = date("Ymd H:i:s", strtotime("$date -9 hours -30 minutes"));
        $trim = str_replace("-","",$date);
        $endPoint = "$trim 19:30:00";
        
        // middle point is a dynamic field to fit extra data
        $stmt = "SELECT -- DSP
                    'DSP'                                                   AGREGATE
                    ,IF LENGTH(a.n_pl)<6 THEN null ELSE a.n_pl ENDIF        HEAT_ID
                    ,isnull(d.t_bgn,a.bgn)                                  START_POINT
                    ,CONVERT(CHAR(20),d.nwe,121)                            MIDDLE_POINT
                    ,isnull(d.t_nd,a.nd)                                    END_POINT
                    ,s.marka                                                STEEL_GRADE
                FROM DBA.a_basic a
                LEFT OUTER JOIN DBA.d_basic d ON a.id = d.id
                LEFT OUTER JOIN DBA.spr_stal s ON a.kod_m = s.kod_komb
                WHERE START_POINT > '$startPoint' and START_POINT < '$endPoint' AND a.owner IN ('dsp')
                                
                UNION ALL -- CCMs
                SELECT 
                    UPPER(isnull(a.owner,'undefined'))                      AGREGATE
                    ,IF LENGTH(a.n_pl)<6 THEN null ELSE a.n_pl ENDIF        HEAT_ID
                    ,isnull(a.bgn,now())                                    START_POINT
                    ,CONVERT(CHAR(20), m.god)                               MIDDLE_POINT
                    ,a.nd                                                   END_POINT
                    ,s.marka                                                STEEL_GRADE
                FROM DBA.a_basic a
                LEFT OUTER JOIN DBA.m_mnls m ON m.id = a.id
                LEFT OUTER JOIN DBA.spr_stal s ON a.kod_m = s.kod_komb
                WHERE a.bgn > '$startPoint' and a.bgn < '$endPoint' AND a.owner IN ('mnls1','mnls2')
                                        
                UNION ALL -- REST
                SELECT 
                    UPPER(isnull(a.owner,'undefined'))                      AGREGATE
                    ,IF LENGTH(a.n_pl)<6 THEN null ELSE a.n_pl ENDIF        HEAT_ID
                    ,isnull(a.bgn,now())                                    START_POINT
                    ,CONVERT(CHAR(20), akp.t_bgn, 121)                      MIDDLE_POINT
                    ,a.nd                                                   END_POINT
                    ,s.marka                                                STEEL_GRADE
                FROM DBA.a_basic a
                LEFT OUTER JOIN DBA.as_basic akp ON akp.id = a.id
                LEFT OUTER JOIN DBA.spr_stal s ON a.kod_m = s.kod_komb
                WHERE a.bgn > '$startPoint' and a.bgn < '$endPoint' AND a.owner NOT IN ('dsp','mnls1','mnls2')
                                    
                ORDER BY 1,3";
        
        $db = new DBase();
        $result = $db->query($stmt);
                        
        echo $result;
    }
    else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "'date' is required for this request";
    }

?>