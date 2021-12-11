<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
$meterno = $data->meterno;
include('refreshDB.php');
//include('server.php');

// Fetch all records
if($request == 0){    
  $response[0]=returnAllData("select * from mtrmast",'');
  $response[1]=returnAllData("select * from custmast",'');
  $response[2]=returnAllData("select * from user",'');  
  echo json_encode($response);
  exit;
}