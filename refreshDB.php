<?php
function returnAllData($xsql,$xary){
  include 'server.php';
  $xresponse=array();  
  $xstmt = $DBserver->prepare($xsql);
  if($xary==''){
    $xstmt->execute();  
  }else{
    $xstmt->execute($xary);
  }
  while($xrows=$xstmt->FETCH(PDO::FETCH_ASSOC)) {
    $xresponse[] = $xrows;
  } 
  $xstmt=null;
  return $xresponse;
}

function returnLastRec(){
  include 'server.php';
  $xresponse=array();  
  $xsql = "SELECT CUSTNO,ACCTNAME,ADDRESS1,PICFILE FROM custjrnl";
  $xstmt = $DBserver->prepare($xsql);
  
  $xstmt->execute();  
  
  while($xrows=$xstmt->FETCH(PDO::FETCH_ASSOC)) {    
    $aryMSG["ACCTNAME"] = $xrows["ACCTNAME"];
    $aryMSG["ADDRESS1"] = $xrows["ADDRESS1"];
    $aryMSG["PICFILE"] = base64_encode($xrows['PICFILE']);    
    $xresponse[]=$aryMSG;
  }
}
?>

