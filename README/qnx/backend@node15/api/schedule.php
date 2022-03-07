<?php
    
    $http_origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $http_origin");
    
    require_once("./include/dbase.class.php");

    //http://10.2.19.215/api/schedule.php?date=2022-03-01&agregate=dsp
    
    
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
        
        if(isset($params["agregate"])) {
            $agregate = split(":",strtolower($_GET["agregate"]));
            $agregate = implode("','",$agregate);
        }
        
        $stmt = "SELECT
                    UPPER(isnull(owner,'undefined'))                AGREGATE
                    ,IF LENGTH(n_pl)<6 THEN null ELSE n_pl ENDIF    HEAT_ID
                    ,isnull(bgn,now())                              START_POINT
                    ,nd                                             END_POINT
                FROM DBA.a_basic
                WHERE (bgn >= '$startPoint' AND bgn < '$endPoint')";
                                    
        if(isset($agregate)) $stmt .= " AND LOWER(a.owner) IN ('$agregate')";
        
        $stmt .= " ORDER BY AGREGATE, START_POINT;";
        
        $db = new DBase();
        $result = $db->query($stmt);
                        
        echo $result;
    }
    else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "'date' is required for this request";
    }

?>