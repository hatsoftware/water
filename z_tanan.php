<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
$brgyno = $data->brgyno;
include('refreshDB.php');

// Fetch all records
if($request == 0){    
  $response[0]=''; //returnAllData("select CUSTNO,ACCTNAME,ADDRESS1,METERNO,SERIALNO,MTRSTAT,GEOLAT,GEOLONG,BRGYNO,LASTDAT,READDAT,LASTREAD,CURREAD from custmast ORDER BY ACCTNAME","");  
  $response[1]=returnAllData("select USERNO,PWORD,ACCTNAME,BRGYNO,AREANO from usermast where AREANO='WDO'","");  
  $response[2]=returnAllData("select FLATRATE,MINCUB,RATECUB from utilmast","");  
  echo json_encode($response);
  exit;
}else if($request == 1){    
  $response[0]=returnAllData("select CUSTNO,ACCTNAME,ADDRESS1,METERNO,SERIALNO,MTRSTAT,GEOLAT,GEOLONG,BRGYNO,LASTDAT,READDAT,LASTREAD,CURREAD from custmast WHERE BRGYNO=:brgyno ORDER BY ACCTNAME",
    array(':brgyno' => $brgyno)
  );    
  
  echo json_encode($response);
  exit;
}
?>