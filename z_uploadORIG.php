<?php
//header('Access-Control-Allow-Origin: *');  
$cn=$_POST['host'];
include 'dbcon/dbcon.php';

$ctr_img=$_POST['ctr_meter'];
$projcode=$_POST['projcode'];

$aryIMG=array();
$aryMTR=array();
//init aryMTR
for($i=0;$i<10;$i++){
    $aryMTR[$i]=0;
}

$meter=0;
for($i=0;$i<$ctr_img;$i++){
    $ii=$i+1;
    $jrow='img'.$ii;
    $jmtr='mtr'.$ii;
    $aryIMG[$i]=$_POST[$jrow];    
    $aryMTR[$i]=(int)$_POST[$jmtr];    
    $meter=$meter+$aryMTR[$i];
}

$app_status=$_POST['app_status'];
$app_collection=$_POST['app_collection'];
$app_downed=$_POST['app_downed'];
$app_exp_date=$_POST['app_exp_date'];
$app_repairs=$_POST['app_repairs'];
$app_repdate=$_POST['app_repdate'];

$app_date=$_POST['app_date'];
$app_time=$_POST['app_time'];

// Update projmast record
//$sql="UPDATE projmast SET stat=:app_status,date_down=:app_downed,date_exp=:app_exp_date,repair=:app_repairs,repdate=:app_repdate".$dtl." where PROJCODE=:projcode";
$sql="UPDATE projmast SET stat=:app_status,collection=:app_collection,date_down=:app_downed,date_exp=:app_exp_date,repair=:app_repairs,repdate=:app_repdate,
        meter1=:mtr1,meter2=:mtr2,meter3=:mtr3,meter4=:mtr4,meter5=:mtr5,
        meter6=:mtr6,meter7=:mtr7,meter8=:mtr8,meter9=:mtr9,meter10=:mtr10,meter=:meter,
        date=:app_date,time=:app_time
        where PROJCODE=:projcode";
$stmt = $DBcon->prepare($sql);

$stmt->execute(array(   ':app_status' => $app_status,
                        ':app_collection' => (float) $app_collection,
                        ':app_downed' => $app_downed,
                        ':app_exp_date' => $app_exp_date,
                        ':app_repairs' => $app_repairs,
                        ':app_repdate' => $app_repdate,
                        ':mtr1' => $aryMTR[0],':mtr2' => $aryMTR[1],':mtr3' => $aryMTR[2],':mtr4' => $aryMTR[3],':mtr5' => $aryMTR[4],
                        ':mtr6' => $aryMTR[5],':mtr7' => $aryMTR[6],':mtr8' => $aryMTR[7],':mtr9' => $aryMTR[8],':mtr10' => $aryMTR[9],
                        ':meter' => $meter,
                        ':app_date' => $app_date,
                        ':app_time' => $app_time,
                        ':projcode'  => $projcode
                    ));

//save photo
$ctr_file=0;
for($i=0;$i<$ctr_img;$i++){
    $ii=$i+1;
    $img = $_POST['img'.$ii];
    $flename=$projcode.'_'.$i;
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $dst = '../cam_img/'.$flename.'.png';    
    $success = file_put_contents($dst, $data);
    //if(move_uploaded_file($data,$dst)){
    //    $ctr_file++;
    //}
    $ctr_file++;
}
echo 'total img count: '.$ctr_file.' total meters: '.$meter;
exit;
?>

