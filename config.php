<?php

    $host = "localhost"; /* Host name */
    $user = "root"; /* User */
    $password = ""; /* Password */
    $dbname = "stockupn_stockup_nema_k12"; /* Database name */

    $con = mysqli_connect($host, $user, $password, $dbname);
    // Check connection
    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // $sql_where_text .= "(pvb_opportunityId =" . $cop_id . ")"; 

    // $sql_text = "SELECT  *  from pv_meters INNER JOIN pv_utilities ON pvb_utilityId = pvu_id INNER JOIN pv_rates ON pvb_rateId = pvr_id  " . $sql_where_text . " order by pvb_parentMeter, pvb_meterDescription"; 

