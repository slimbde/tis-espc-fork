<?php
    
    $http_origin = $_SERVER['HTTP_ORIGIN'];

    header("Access-Control-Allow-Origin: $http_origin");
    header('Access-Control-Allow-Credentials: true');
    
    require_once("../include/dbase.class.php");
    date_default_timezone_set('UTC');

    //http://10.2.19.223/tis/smelt/?date=20220224&agregate=akoc:akoc2
    
    $uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

    $request = substr($uri[2],1,strlen($uri[2])-1);
    parse_str($request,$params);
    
    if(isset($params["date"])) {
        $date = intval($params["date"]); 
    
        if($date < 9999999) {
            header("HTTP/1.1 500 Internal Server Error");
            echo "wrong date format. try YYYYMMDD";
            return;
        }
        
        $startPoint = date("Ymd H:i:s", strtotime("$date -9 hours -30 minutes"));
        $trim = str_replace("-","",$date);
        $endPoint = "$trim 19:30:00";
        
        if(isset($params["agregate"])) {
            $agregate = split(":",strtolower($params["agregate"]));
            $agregate = implode("','",$agregate);
        }
        
        $stmt = "SELECT
                    a.name_agreg                                    AGREGATE
                    ,s.number                                       HEAT_ID
                    ,s.dtstart                                      START_POINT
                    ,IF dtend=dtstart THEN null ELSE dtend ENDIF    END_POINT
                FROM DBA.smelt s
                JOIN DBA.AGREGATE a ON s.agreg = a.agreg
                WHERE 
                    ((s.dtstart >= '$startPoint' AND s.dtstart < '$endPoint') 
                        OR (s.dtend = s.dtstart AND s.dtstart < '$startPoint'))
                    AND a.agreg NOT IN (0,3,6)";
                                    
        if(isset($agregate)) $stmt .= " AND LOWER(a.name_agreg) IN ('$agregate')";
        
        $stmt .= " ORDER BY AGREGATE, START_POINT";
        
        $db = new DBase();
        $result = $db->query($stmt);
                        
        echo $result;
    }
    else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "'date' is required for this request";
    }
    
?>