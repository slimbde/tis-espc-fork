<?php
    
    require_once("./vod.php");
    
    //
    // sending data to Dispatcher DB entry point
    // provides convenient interface to comment out / uncomment features
    // this file is triggered by cron, so if you are to extend the funcionality
    // please follow the given structure and add your handler here
    //
    
    SendVODdata();
?>