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
?>

