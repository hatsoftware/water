<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();
$aryMSG = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;

include('refreshDB.php');

// Fetch all records
if($request == 0){  
  include 'server.php';
  $xresponse=array();  
  $xsql = "SELECT ACCTNO2,TRANSDAT,PICFILE FROM custjrnl";
  $xstmt = $DBserver->prepare($xsql);
  
  $xstmt->execute();  
  
  while($xrows=$xstmt->FETCH(PDO::FETCH_ASSOC)) {    
    $aryMSG["ACCTNO2"] = $xrows["ACCTNO2"];
    $aryMSG["TRANSDAT"] = $xrows["TRANSDAT"];
    $aryMSG["PICFILE"] = base64_encode($xrows['PICFILE']);    
    $xresponse[]=$aryMSG;
  } 
  $xstmt=null;
  
  echo json_encode($xresponse);
}