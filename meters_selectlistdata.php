<?php

    include "config.php";

    $return_arr = array();
    
    $query_select = "";
    $num = 5;
    if($_REQUEST["txtsearch"] == ""){
        $query_select = 'SELECT * FROM pv_meters WHERE pvb_opportunityId = "'.$num .'" ORDER BY pvb_id';
        $result = mysqli_query($con,$query_select);
        $id = 1;
        while($row = mysqli_fetch_array($result)){
    
            $return_arr[] = array("id"      => $id,
                            "pvb_id"        => $row['pvb_id'],
                            "name"          => $row['pvb_meterDescription'],
                            "number"        => $row['pvb_meterNumber'],
                            "amps"          => $row['pvb_panelBoxAmps'],
                            "voltage"       => $row['pvb_voltage'],
                            "phase"         => $row['pvb_phase'],
                            "notes"         => $row['pvb_interconnectNotes'],
                            "apn"           => $row['pvb_parcelIdentification'],
                            "lat"           => $row['pvb_lat'],
                            "lon"           => $row['pvb_lon']);
            $id++;
        }
        echo json_encode($return_arr);
        return;
    }else{
        $query_select = 'SELECT * FROM pv_meters WHERE pvb_opportunityId = "'.$num .'" AND pvb_meterDescription = "'.$_REQUEST["txtsearch"].'" ORDER BY pvb_id';
        $result = mysqli_query($con,$query_select);
        $id = 1;
        while($row = mysqli_fetch_array($result)){
    
            $return_arr[] = array("id"      => $id,
                            "pvb_id"        => $row['pvb_id'],
                            "name"          => $row['pvb_meterDescription'],
                            "number"        => $row['pvb_meterNumber'],
                            "amps"          => $row['pvb_panelBoxAmps'],
                            "voltage"       => $row['pvb_voltage'],
                            "phase"         => $row['pvb_phase'],
                            "notes"         => $row['pvb_interconnectNotes'],
                            "apn"           => $row['pvb_parcelIdentification'],
                            "lat"           => $row['pvb_lat'],
                            "lon"           => $row['pvb_lon']);
            $id++;
        }
        echo json_encode($return_arr);
        return;
    }
    
