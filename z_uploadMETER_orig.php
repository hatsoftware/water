<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();
$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
$brgyno = $data->brgyno;


include('refreshDB.php');
include('server.php');

// UPDATE record
if($request == 3){
  $aryItems = json_decode($data->aryItems,true);
  $max_Ctr=count($aryItems);
   
  for($i=0;$i<$max_Ctr;$i++) {      
    $meterno=$aryItems[$i]['meterno'];
    $acctno2=$aryItems[$i]['acctno2'];
    $trandate=$aryItems[$i]['trandate'];
    $prev_date=$aryItems[$i]['prev_date'];
    $curr_date=$aryItems[$i]['curr_date'];
    $prev_read=$aryItems[$i]['prev_read'];
    $curr_read=$aryItems[$i]['curr_read'];
    $month_bill=$aryItems[$i]['month_bill'];
    
    
    $used=$aryItems[$i]['used'];
    $stat=$aryItems[$i]['stat'];
    $instruct=$aryItems[$i]['instruct'];
    $prev_date=date('Y-m-d h:i:s', strtotime($prev_date));
    
    $img=$aryItems[$i]['photo'];

    $img_data = file_get_contents($img);
    $photo = $base64_encode($img_data);

    //$photo=file_get_contents($img);
    //$photo=load_file('gfx/jham.png');
    //$data = str_replace($photo, '', $data);
    //$data = str_replace(' ','+',$data);
    //$photo = base64_decode($photo);
    //$img = $_POST['canImg'];
    //$photo = str_replace('data:image/png;base64,', '', $photo);
    //$photo = str_replace(' ', '+', $photo);
    //$photo = base64_decode($photo);
    //$file = UPLOAD_DIR . uniqid() . '.png';
    //$success = file_put_contents($file, $data);
    

    
    $amount=intval(str_replace(",","",$aryItems[$i]['amount']));
    
    //$expire_time = $trandate;
    //$expire_time = substr($expire_time, 0, strpos($expire_time, '('));
    //echo date('Y-m-d h:i:s', strtotime($expire_time));
    //$trandate=date('Y-m-d h:i:s', strtotime($expire_time));
    $f_new=false;

    $sql="SELECT * from custjrnl WHERE ACCTNO2=:acctno2 and MONBILL=:month_bill";
    $stmt = $DBserver->prepare($sql);
    $stmt->execute(array(':acctno2'  => $acctno2, ':month_bill'  => $month_bill));		
    if($stmt->rowCount()){
      //update
      $sql="UPDATE custjrnl SET MONBILL=:month_bill,PICFILE=:photo,TRANSDAT=:trandate,PREVDAT=:prev_date,
          PRVREAD=:prev_read,CURREAD=:curr_read,MTRUSED=:used,MTRSTAT=:stat,INSTRUCT=:instruct,DUEAMT=:amount,larawan=:larawan
          where  ACCTNO2=:acctno2 and MONBILL=:month_bill";
      $stmt = $DBserver->prepare($sql);
      $stmt->execute(array(
        ':acctno2'  => $acctno2,
        ':trandate'  => $curr_date,
        ':prev_date'  => $prev_date,        
        ':month_bill'  => $month_bill,
        ':photo'  => $photo,
        ':curr_read'  => $curr_read,        
        ':prev_read'  => $prev_read,
        ':used'  => $used,
        ':stat'  => $stat,      
        ':instruct'  => $instruct,
        ':larawan' => $photo,
        ':amount'  =>  $amount
      ));		  
    }else{
      //add
      $f_new=true;
      $sql="INSERT INTO `custjrnl` (ACCTNO2,TRANSDAT,MONBILL,PICFILE,PREVDAT,PRVREAD,CURREAD,MTRUSED,MTRSTAT,INSTRUCT,DUEAMT,larawan) 
          VALUES (:acctno2,:trandate,:month_bill,:photo,:prev_date,:prev_read,:curr_read,:used,:stat,:instruct,:amount,:larawan)";
      $stmt = $DBserver->prepare($sql);
      $stmt->execute(array(
        ':acctno2'  => $acctno2,
        ':trandate'  => $curr_date,
        ':month_bill'  => $month_bill,        
        ':photo'  => $photo,
        ':prev_date'  => $prev_date,                
        ':curr_read'  => $curr_read,        
        ':prev_read'  => $prev_read,
        ':used'  => (float)$used,
        ':stat'  => $stat,      
        ':instruct'  => $instruct,
        ':larawan' => $photo,
        ':amount'  =>  $amount
      ));
    }

    //update
    
    if($f_new){
      $sql="UPDATE custmast SET MTRSTAT=:stat,LASTREAD=CURREAD,CURREAD=:curr_read where METERNO=:meterno";
      $stmt = $DBserver->prepare($sql);
      $stmt->execute(array(
        //':custno'  => $acctno2,
         ':meterno'  => $meterno,
        ':stat'  => $stat,        
        ':curr_read'  => $curr_read
      ));		  
    }else{
      $sql="UPDATE custmast SET MTRSTAT=:stat,LASTREAD=:prev_read,CURREAD=:curr_read  where METERNO=:meterno";
      $stmt = $DBserver->prepare($sql);
      $stmt->execute(array(
        //':custno'  => $acctno2,
        ':meterno'  => $meterno,
        ':stat'  => $stat,            
        ':prev_read'  => $prev_read,
        ':curr_read'  => $curr_read        
      ));		  
    }
    
  }

  //echo "OK";  
  //exit;  
  $response=returnAllData("select CUSTNO,ACCTNAME,ADDRESS1,METERNO,SERIALNO,MTRSTAT,GEOLAT,GEOLONG,LASTDAT,LASTREAD,READDAT,CURREAD from custmast WHERE BRGYNO=:brgyno ORDER BY ACCTNAME",
    array(':brgyno' => $brgyno)
  );  
  echo json_encode($response);
  //imagedestroy($img);
  exit;
}
?>
