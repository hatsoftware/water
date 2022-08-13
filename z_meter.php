<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();
$aryDB = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
$brgyno = $data->brgyno;

include('refreshDB.php');

// Fetch all records
if($request == 1){  
  include 'server.php';
  $xresponse=array();  
  $aryDB=array();
  $aryLAST=array();  
  $xsql = "SELECT CUSTNO,ACCTNAME,ADDRESS1,METERNO,SERIALNO,MTRSTAT,GEOLAT,GEOLONG,BRGYNO,PICFILE,DUEDAT FROM custmast WHERE BRGYNO=:brgyno";
  $xstmt = $DBserver->prepare($xsql);
  
  $xstmt->execute(array(':brgyno' => $brgyno));  
  if($xstmt->rowCount()){
  }
  
  while($xrows=$xstmt->FETCH(PDO::FETCH_ASSOC)) {    
    $aryDB["CUSTNO"] = $xrows["CUSTNO"];
    $aryDB["ACCTNAME"] = $xrows["ACCTNAME"];
    $aryDB["ADDRESS1"] = $xrows["ADDRESS1"];
    $aryDB["METERNO"] = $xrows["METERNO"];
    $aryDB["SERIALNO"] = $xrows["SERIALNO"];
    $aryDB["MTRSTAT"] = $xrows["MTRSTAT"];
    $aryDB["BRGYNO"] = $xrows["BRGYNO"];
    $aryDB["SERIALNO"] = $xrows["SERIALNO"];
    $aryDB["PICFILE"] = base64_encode($xrows['PICFILE']);   
    //CUSTNO,ACCTNAME,ADDRESS1,METERNO,SERIALNO,MTRSTAT,GEOLAT,GEOLONG,BRGYNO,LASTDAT,READDAT,LASTREAD,CURREAD 
    $aryDB["GEOLAT"] = $xrows["GEOLAT"];
    $aryDB["GEOLONG"] = $xrows["GEOLONG"];
    $aryDB["DUEDAT"] = $xrows["DUEDAT"];
   
    $aryLAST = getAVG_LastRec($xrows["CUSTNO"]);
    $aryDB["LAST_DATE"] = $aryLAST["LAST_DATE"];
    $aryDB["LAST_READ"] = $aryLAST["LAST_READ"];
    $aryDB["CURR_DATE"] = $aryLAST["CURR_DATE"];
    $aryDB["CURR_READ"] = $aryLAST["CURR_READ"];
    $aryDB["MONBILL"] = $aryLAST["MONBILL"];
    $aryDB["AVG"] = $aryLAST["AVG"];
    $xresponse[]=$aryDB;
  } 
  $xstmt=null; 
  echo json_encode($xresponse);
}

function getAVG_LastRec($custno){
  include 'server.php';
  //$response=array();  
  $xaryDB=array();  
  
  $sql = "SELECT ACCTNO2,PREVDAT,PRVREAD,TRANSDAT,CURREAD,MONBILL,MTRUSED,PICFILE FROM custjrnl WHERE ACCTNO2=:custno ORDER BY TRANSDAT DESC";
  $stmt = $DBserver->prepare($sql);
  $stmt->execute(array(':custno' => $custno));  
  
  $v_lastDate="";
  $v_lastRead="";
  $v_currDate="";
  $v_currRead="";
  $v_monbill="";
  $v_photo="";
  
  $ctr=0;
  $mtr_used=0;
  
  if($stmt->rowCount() > 0){
    while($rows=$stmt->FETCH(PDO::FETCH_ASSOC)) {    
      if($ctr==0){
        $v_lastDate = $rows["PREVDAT"];
        $v_lastRead = $rows["PRVREAD"];
        $v_currDate = $rows["TRANSDAT"];
        $v_currRead = $rows["CURREAD"];
        $v_monbill = $rows["MONBILL"]; 
        $v_photo = $rows["PICFILE"];  
      }
      $mtr_used+=$rows["MTRUSED"];
      $ctr++;
      if($ctr > 3){
        break;
      }
    } 
    $mtr_used=$mtr_used/$ctr;
  }
  
  $xaryDB["LAST_DATE"] = $v_lastDate;
  $xaryDB["LAST_READ"] = $v_lastRead;
  $xaryDB["CURR_DATE"] = $v_currDate;
  $xaryDB["CURR_READ"] = $v_currRead;
  $xaryDB["MONBILL"] = $v_monbill;                
  $xaryDB["AVG"] = $mtr_used;
  $xaryDB["PICFILE"] = $v_photo;
  
  $stmt=null;
  return $xaryDB;
}
?>