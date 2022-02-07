<?php
    
    require_once("./ccm1.php");
    require_once("./dsp.php");
    
    //
    // sending data to Dispatcher DB entry point
    // provides convenient interface to comment out / uncomment features
    // this file is triggered by cron, so if you are to extend the funcionality
    // please follow the given structure and add your handler here
    //
    
    SendCCM1data();
    SendDSPdata();
?>