<?php
    
    $http_origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $http_origin");
    
    
    require_once("./include/production.class.php");
    
    //http://10.2.19.215/api/production.php?date=2022-03-01&agregate=mnls1
    
    
    if(isset($_GET["date"])) {
        $date = $_GET["date"];
    
        if(!strpos($date,"-")) {
            header("HTTP/1.1 500 Internal Server Error");
            die("Wrong date format. Try YYYY-MM-DD");
        }
        
        $startPoint = date("Ymd H:i:s", strtotime("$date -4 hours -30 minutes"));
        $trim = str_replace("-","",$date);
        $endPoint = "$trim 19:30:00";
        
        if(isset($_GET["agregate"])) {
            $agregate = split(":",strtolower($_GET["agregate"]));
            if(count($agregate)>1) die("multiple agregates are not supported");
            $agregate = $agregate[0];
        }
        else {
            header("HTTP/1.1 500 Internal Server Error");
            die("'agregate' is required for this request");
        }
        
        $production = new Production($startPoint, $endPoint);
        $result = $production->GetProductionInfo($agregate);
        
        echo $result;
    }
    else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "'date' is required for this request";
    }

?>