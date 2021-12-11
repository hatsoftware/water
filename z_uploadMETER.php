<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();
$data = json_decode(file_get_contents("php://input"));
$request = $data->request;

include('server.php');
//include 'refreshDB.php';

// UPDATE record
if($request == 3){
  $aryItems = json_decode($data->aryItems,true);
  $max_Ctr=count($aryItems);
   
  for($i=0;$i<$max_Ctr;$i++) {      
    $meterno=$aryItems[$i]['meterno'];
    $trandate=$aryItems[$i]['trandate'];
    $month_bill=$aryItems[$i]['month_bill'];
    $reading=$aryItems[$i]['reading'];
    $amount=intval(str_replace(",","",$aryItems[$i]['amount']));
    
    //$expire_time = $trandate;
    //$expire_time = substr($expire_time, 0, strpos($expire_time, '('));
    //echo date('Y-m-d h:i:s', strtotime($expire_time));
    //$trandate=date('Y-m-d h:i:s', strtotime($expire_time));
    

    $sql="SELECT * from custjrnl WHERE DOCREF1=:meterno and MONBILL=:month_bill";
    $stmt = $DBserver->prepare($sql);
    $stmt->execute(array(':meterno'  => $meterno, ':month_bill'  => $month_bill));		
    if($stmt->rowCount()){
      //update
      $sql="UPDATE custjrnl SET CURREAD=:reading,MONBILL=:month_bill,TRANSDAT=:trandate,AMOUNT=:amount where  DOCREF1=:meterno and MONBILL=:month_bill";
      $stmt = $DBserver->prepare($sql);
      $stmt->execute(array(
        ':meterno'  => $meterno,
        ':trandate'  => $trandate,
        ':month_bill'  => $month_bill,
        ':reading'  => $reading,
        ':amount'  =>  $amount
      ));		  
    }else{
      //add
      $sql="INSERT INTO `custjrnl` (DOCREF1,TRANSDAT,MONBILL,CURREAD,AMOUNT)
                  VALUES (:meterno,:trandate,:month_bill,:reading,:amount)";
      $stmt = $DBserver->prepare($sql);
      $stmt->execute(array(
      ':meterno'  => $meterno,
      ':trandate'  => $trandate,
      ':month_bill'  => $month_bill,
      ':reading'  => $reading,
      ':amount'  => $amount
      ));
    }

    //update
    $sql="UPDATE mtrmast SET CURREAD=:curr_read,AMOUNT=:amount where  METERNO=:meterno";
    $stmt = $DBserver->prepare($sql);
    $stmt->execute(array(
      ':meterno'  => $meterno,
      ':curr_read'  => $reading,
      ':amount'  =>  $amount
    ));		  

  }

  echo "OK";
  //echo json_encode(ret_msg_AllData($projcode));
  exit;
}

// Update messages unread
if($request == 31){  
  $projcode = $data->projcode;

  $sql="UPDATE messages SET unread=:unread where unread=0 and SENDER=0 and PROJCODE=:projcode";
  $stmt = $DBserver->prepare($sql);
  $stmt->execute(array( ':unread' => 1,':projcode'  => $projcode));
  echo json_encode(ret_msg_AllData($projcode));
  exit;
}

