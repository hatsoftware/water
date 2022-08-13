var CAMERA_ON=false;

'use strict';

// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');

const canvas = window.canvas = document.querySelector('canvas');

const constraints = {
  audio: false,  
  video: {
    facingMode: 'environment',
    width: {
      min: 320,
      max: 1280
    },
      height: {
      min: 140,
      max: 720
    }
      
  }
};

var aryStat=["Active","NOT Active","DISCONNECTED","Defective"];

function fm_meter(){       
  if(iDB_METER.length==0){
    MSG_SHOW(vbOk,"ERROR: ","Records Empty. Please Download the Files.",function(){},function(){});
    return;
  }

  if(!CURR_USER){
    showLogin();
    return;
  } 

  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
    
  openPage('page_meter');
  document.getElementById('page_meter').setAttribute('data-close',0);
  document.getElementById('cap_myView1').innerHTML='METER READING';
  //map.invalidateSize();

  init_meter();
}

function closeMeterPage(){
  var xclose=document.getElementById('page_meter').getAttribute('data-close');  
  if(document.getElementById('page_meter').getAttribute('data-close')==0){
	  showMainPage();
  }else{
    snackBar("You're in Edit Mode. Click Cancel");
  }
}

function init_meter(){  
  document.getElementById('meter_client').style.display='block';
  document.getElementById('id_no').style.display='none';
  
  document.getElementById('inp_meterno').value='';
  document.getElementById('mtr_no').value='';
  document.getElementById('mtr_date').innerHTML='Date: '+sysDate+'  Time: '+sysTime;  
  document.getElementById('mtr_name').innerHTML='';
  document.getElementById('mtr_address').innerHTML='';
  document.getElementById('mtr_serialno').innerHTML='';
  document.getElementById('mtr_stat').innerHTML='';
  document.getElementById('mtr_due').innerHTML='';
  document.getElementById('btn_look').style.display='block';
  document.getElementById('btn_stat').style.display='none';
  document.getElementById('btn_due').style.display='none';
  document.getElementById('btn_bill').style.display='none';
  document.getElementById('mtr_from').innerHTML='';   document.getElementById('mtr_from').setAttribute('data-date','');
  document.getElementById('mtr_to').innerHTML='';     document.getElementById('mtr_to').setAttribute('data-date','');
  document.getElementById('mtr_used').innerHTML='';
  document.getElementById('mtr_prev').innerHTML='';
  document.getElementById('mtr_curr').innerHTML='';
  document.getElementById('mtr_pic').src='gfx/img_empty.png';
  document.getElementById('mtr_amount').innerHTML='0.00';  
  document.getElementById('back_meter').style.display='block';  
  document.getElementById('inp_meterno').disabled=false;
  document.getElementById('btn_meterno').disabled=false;
  document.getElementById('page_meter').setAttribute('data-close',0);

  document.getElementById('meter_read').value='';
  document.getElementById('div_curr_img').src='';  

  var mmm = JBE_ARY_MONTH[new Date().getMonth()];   
  var yyyy = new Date().getFullYear();  
  var monbill=mmm+' '+yyyy;
  var v_bill=document.getElementById('mtr_bill').innerHTML;
  v_bill.disabled=true;
  if(!v_bill.value){
    document.getElementById('mtr_bill').innerHTML=monbill;
  }
  document.getElementById('mtr_bill').setAttribute('data-value',monbill);
  
  //convert_monbill(1,monbill);
  showMenu('mnu_meter');
}

function chk_meter(v_meterno){  
  v_meterno=v_meterno.toUpperCase();
  var v_custno=JBE_GETFLD('custno',iDB_METER,'meterno',v_meterno);
      
  if(!v_custno){    
    MSG_SHOW(vbOk,"ERROR:","Record Not Found.",function(){},function(){});
    init_meter();
    return;
  }else{
    disp_meter(v_meterno);
  }  
}

function disp_meter(v_meterno){
  document.getElementById('meter_client').style.display='none';
  document.getElementById('id_no').style.display='block';
  document.getElementById('mtr_no').innerHTML=v_meterno;
  
  var v_custno=JBE_GETFLD('custno',iDB_METER,'meterno',v_meterno);
  document.getElementById('page_meter').setAttribute('data-close',1);
  document.getElementById('inp_meterno').setAttribute('data-custno',v_custno);
  
  showMenu('mnu_get_meter');

  document.getElementById('back_meter').style.display='none';  
  document.getElementById('inp_meterno').disabled=true;
  document.getElementById('btn_meterno').disabled=true;
    

  var aryMeter=JBE_GETARRY(iDB_METER,'meterno',v_meterno);
  var v_name=aryMeter['name'];
  var v_address=aryMeter['addrss'];
  var v_curr_read=iif(!aryMeter['curr_read'],0,aryMeter['curr_read']);
  var v_prev_read=iif(!aryMeter['prev_read'],0,aryMeter['prev_read']);
  var v_stat=parseInt(aryMeter['mtrstat']);
  var v_avg=aryMeter['avg'];
  var v_duedate=aryMeter['duedate'];
  
  var v_curr_date=aryMeter['curr_date'];
  //var v_prev_date=aryMeter['prev_date'];
  var v_prev_date=iif(!aryMeter['prev_date'],'',aryMeter['prev_date']);  
  //alert(aryMeter['prev_date']);


  var v_used=v_curr_read-v_prev_read;
  var v_rate=parseInt(iDB_UTIL[0]['ratecub']);
  //if(v_used <= parseFloat(iDB_UTIL[0]['mincub'])){ v_rate=parseInt(iDB_UTIL[0]['flatrate']); }

  //var v_amount=v_used * v_rate;
  var v_amount=v_used * v_rate;

  // ready for new entries 
  v_prev_read=v_curr_read; 
  v_curr_read=0;   
  v_prev_date=v_curr_date;
  v_curr_date=''; 
  v_used=0;
  v_amount=0;
    
  var v_period=JBE_DATE_FORMAT(v_prev_date,'MMM DD, YYYY')+' To '+JBE_DATE_FORMAT(v_curr_date,'MMM DD, YYYY');
  if(!v_prev_date){
    v_prev_date='';
    v_period=JBE_DATE_FORMAT(v_curr_date,'MMM DD, YYYY');    
    v_period='';    
  }
  document.getElementById('mtr_from').setAttribute('data-date',v_prev_date);

  //var v_photo='data:image/png;base64,' + btoa(aryMeter['photo']);
  var v_photo='gfx/img_empty.png';  
  //if(aryMeter['photo']){ v_photo='data:image/png;base64,' + btoa(aryMeter['photo']); }
  if(aryMeter['photo']){ v_photo='data:image/jpeg;base64,' + btoa(aryMeter['photo']); }

  document.getElementById('mtr_no').setAttribute('data-avg',v_stat);
  document.getElementById('mtr_name').innerHTML=v_name;
  document.getElementById('mtr_address').innerHTML=v_address;
  document.getElementById('mtr_serialno').innerHTML=aryMeter["serialno"];
  document.getElementById('btn_look').style.display='none';
  document.getElementById('btn_stat').style.display='block';
  //document.getElementById('btn_due').style.display='block';
  document.getElementById('btn_bill').style.display='block';

  document.getElementById('mtr_used').innerHTML=v_used;
  document.getElementById('mtr_amount').innerHTML=JBE_FORMAT_DOUBLE_TO_STR(v_amount);
  document.getElementById('mtr_stat').innerHTML=retStat(parseInt(aryMeter["mtrstat"]));
  document.getElementById('mtr_stat').setAttribute('data-stat',v_stat);
  document.getElementById('mtr_due').setAttribute('data-duedate',v_duedate);
  document.getElementById('mtr_due').innerHTML=JBE_DATE_FORMAT(v_duedate,"MMM DD, YYYY");
  document.getElementById('mtr_curr').innerHTML=v_curr_read;
  document.getElementById('mtr_prev').innerHTML=v_prev_read;
  
  if(!v_prev_date){
    document.getElementById('mtr_from').innerHTML='';
  }else{
    document.getElementById('mtr_from').innerHTML=JBE_DATE_FORMAT(v_prev_date,"MMM DD, YYYY");
  }
  document.getElementById('mtr_to').innerHTML=' '; //JBE_DATE_FORMAT(v_curr_date,"MM-DD-YYYY");
  
  //document.getElementById('mtr_period').value=v_period; // JBE_DATE_FORMAT(v_prev_date,"MMM DD, YYYY")+' To '+JBE_DATE_FORMAT(v_curr_date,"MMM DD, YYYY");
  //document.getElementById('mtr_period').setAttribute('data-from',JBE_DATE_FORMAT(v_prev_date,"YYYY-MM-DD"));
  //document.getElementById('mtr_period').setAttribute('data-to',JBE_DATE_FORMAT(v_curr_date,"YYYY-MM-DD"));

  
  //document.getElementById('mtr_period').innerHTML=123456;
  //document.getElementById('mtr_pic').src=aryMeter["photo"];
  document.getElementById('mtr_pic').src=v_photo;  
}


function retStat(v){
  return aryStat[v];
}


function openCamera(){
  //alert('opening camera');
  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

function stopCamera(){
  CAMERA_ON=false;
  console.log('stop called');
  stream.getVideoTracks().forEach(function (track) {
      track.stop();
  });
}

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  CAMERA_ON=true;
}

function handleError(error) {
  CAMERA_ON=false;
  //console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  MSG_SHOW(vbOk,"ERROR:",'navigator.MediaDevices.getUserMedia error: '+ error.message+'<br>'+error.name,function(){},function(){}); 
}

function setter(m){
  document.getElementById("btn_cam_main").setAttribute('data-mode',0);  
  document.getElementById("btn_cam_main").style.backgroundColor=JBE2_CLOR2;  
  document.getElementById("div_curr_photo").style.display='block';    
  document.getElementById("div_video").style.display='none';
  document.getElementById("btn_cam_txt").innerHTML="Take Photo";  
  document.getElementById("btn_cam_txt2").innerHTML="Close";  
  document.getElementById("btn_cam_img2").src='gfx/jcancel.png';
  
  document.getElementById("btn_cam_main").style.pointerEvents='auto';
  document.getElementById("btn_cam_main").style.backgroundColor=JBE2_CLOR2; 
  document.getElementById("btn_cam_cancel").style.pointerEvents='auto';
  document.getElementById("btn_cam_cancel").style.backgroundColor=JBE2_CLOR2;  
  
  if(m==1){
    document.getElementById("btn_cam_main").setAttribute('data-mode',1);   
    document.getElementById("btn_cam_main").style.backgroundColor='red'; 
    document.getElementById("div_curr_photo").style.display='none';
    document.getElementById("div_video").style.display='block';    
    document.getElementById("btn_cam_txt").innerHTML="Capture";
    document.getElementById("btn_cam_txt2").innerHTML="Cancel";  
    document.getElementById("btn_cam_img2").src='gfx/jback.png';
  }
}

function tira(){   
  const canvas = document.getElementById('myCanvas');
  const jvideo = document.getElementById('myVideo');
  
  var meter = document.getElementById('myCameraBox_main').getAttribute('data-meter'); //get meter number
  canvas.width = jvideo.videoWidth;
  canvas.height = jvideo.videoHeight;
  //canvas.width=300;
  //canvas.height=300;
  //canvas.height=200;
  
  //canvas.getContext('2d').drawImage(jvideo, 0, 0);    
  canvas.getContext('2d').drawImage(jvideo, 0, -25);    
 
  document.getElementById('div_curr_img').src=canvas.toDataURL("image/png");  
  document.getElementById("div_curr_photo").style.display='block';    
}


function sel_date(){
  var rval='';
  var monthNames = JBE_ARY_MONTH;
  var today = new Date();  
  var yyyy = today.getFullYear();
  var mmm = today.getMonth();
  var tilt='Date Facilty';
  var dtl=          
    '<div id="div_bill_date" data-zoom=0 style="width:100%;height:250px;font-text:14px;text-align:center;padding:0px;background-color:white;">'+            
      '<div style="float:left;width:49%;height:100%;padding:0px;border:1px solid red;overflow:auto;">';
        var ddd='';
        for(var i=0;i<monthNames.length;i++){
          ddd+='<div id="d_'+i+'" onclick="do_sel_mon(&quot;'+monthNames[i]+'&quot;)" style="width:100%;height:20px;padding:2px;border:1px solid green;">'+monthNames[i]+'</div>';
        }
        dtl+=ddd+
      '</div>'+
      '<div style="float:right;width:50%;height:100%;padding:50px 10px 50px 10px;border:1px solid red;">'+
        '<div id="dsel_mon" style="width:100%;height:50%;padding:20px;border:1px solid red;">'+monthNames[mmm]+'</div>'+
        '<div style="width:100%;height:50%;padding:10px;text-align:center;border:1px solid red;">'+
          '<input id="dsel_year" type="number" style="width:100%;height:100%;text-align:center;padding:2px;border:1px solid red;" value="'+yyyy+'" />'+        
        '</div>'+
      '</div>'+
    '</div>';
  
  var dtl2=      
    '<div style="width:100%;height:100%;padding:10px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
      '<input type="button" onclick="save_billdate(dsel_mon.innerHTML,dsel_year.value)" style="width:100px;height:100%;" value="GO"/>'+
    '</div>';   

  JBE_OPENBOX('div_bill_date',tilt,dtl,dtl2); 
}
function do_sel_mon(v){
  document.getElementById('dsel_mon').innerHTML=v;
}

function sel_due(){
  var tilt='Due Date';
  var vdue=document.getElementById('mtr_due').getAttribute('data-duedate');
  if(vdue){ }
  var dtl=          
    '<div id="div_due" data-zoom=0 style="width:100%;height:70px;font-text:14px;text-align:center;padding:0px;background-color:white;">'+            
      '<div style="width:100%;height:100%;padding:0px;border:0px solid red;overflow:auto;">'+
        '<input id="inp_due" type="date" value="'+vdue+'" style="width:100%;height:30px;padding:5px;border:1px solid gray;"/>'+
      '</div>'+
    '</div>';
  
  var dtl2=      
    '<div style="width:100%;height:100%;padding:10px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
      '<input type="button" onclick="do_sel_due(inp_due.value)" style="width:100px;height:100%;" value="OK"/>'+
    '</div>';   

  JBE_OPENBOX('div_due',tilt,dtl,dtl2);
}
function do_sel_due(v){
  JBE_CLOSEBOX();
  if(!v){ return; }
  document.getElementById('mtr_due').innerHTML=JBE_DATE_FORMAT(v,"MMM DD, YYYY");
  document.getElementById('mtr_due').setAttribute('data-duedate',v);  
}

function sel_name(){    
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  
  //document.getElementById("myView1").setAttribute('data-JBEpage',1);
  //CURR2_PAGE=1;  
  var box2=0; 
  var box1=H_VIEW-(30+box2);
  var tilt='Select Account';  
  var dtl=          
    '<div id="div_name" data-zoom=0 style="width:100%;height:'+box1+'px;font-text:14px;padding:0px;background-color:white;">'+         
      '<div style="width:100%;height:50px;padding:10px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
         '<input id="filterInput" type="text" style="float:left;width:100%;height:100%;text-align:center;" value="" placeholder="Search here..."/>'+      
      '</div>'+    
      '<div style="width:100%;height:'+(box1-50)+'px;padding:5px;border:0px solid red;overflow:auto;">';
        var ddd='';
        for(var i=0;i<iDB_METER.length;i++){
          ddd+=
          '<div id="d_'+i+'" class="cls_names" onclick="do_sel_name(&quot;'+iDB_METER[i]['meterno']+'&quot;)" style="width:100%;height:30px;padding:5px;border:1px solid gray;">'+
            '<div style="float:left;width:75%;">'+iDB_METER[i]['name']+'</div>'+
            '<div style="float:left;width:25%;">'+iDB_METER[i]['meterno']+'</div>'+
          '</div>';
        }
        dtl+=ddd+
      '</div>'+    
    '</div>';
 
  JBE_OPEN_VIEW(dtl,tilt,'closeNames');

  //JBE_OPENBOX('div_name',tilt,dtl,dtl2); 
  let filterInput=document.getElementById('filterInput');
  filterInput.addEventListener('keyup',filterNames);
}
function filterNames(){
  var filterValue=document.getElementById('filterInput').value.toUpperCase();      
  var li=document.getElementsByClassName("cls_names");

  for(var i=0;i<li.length;i++){
    var a=li[i];
    if(a.innerHTML.toUpperCase().indexOf(filterValue) > -1){
      li[i].style.display='';
    }else{
      li[i].style.display='none';
    }        
  }
}
function do_sel_name(v){
  chk_meter(v);  
  JBE_CLOSE_VIEW();
}

function closeNames(){  
  openPage('page_meter');     
}

function sel_stat(){
  var rval='';
  
  var tilt='Select Status';
  
  var dtl=          
    '<div id="div_stat" data-zoom=0 style="width:100%;height:135px;font-text:14px;text-align:center;padding:0px;background-color:white;">'+            
      '<div style="width:100%;height:100%;padding:0px;border:0px solid red;overflow:auto;">';
        var ddd='';
        for(var i=0;i<aryStat.length;i++){
          ddd+='<div id="d_'+i+'" onclick="do_sel_stat(&quot;'+i+'&quot;)" style="width:100%;height:30px;padding:5px;border:1px solid gray;">'+aryStat[i]+'</div>';
        }
        dtl+=ddd+
      '</div>'+
    '</div>';
  
  var dtl2=
    '<div style="width:100%;height:100%;padding:10px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
      '<input type="button" onclick="JBE_CLOSEBOX()" style="width:100px;height:100%;" value="OK"/>'+
    '</div>';   

  JBE_OPENBOX('div_stat',tilt,dtl,dtl2); 
}
function do_sel_stat(v){
  var v_avg=document.getElementById('mtr_no').getAttribute('data-avg');
  document.getElementById('mtr_stat').innerHTML=aryStat[v];
  document.getElementById('mtr_stat').setAttribute('data-stat',v);
  if(v==3){
    do_defective(true);
  }else{
    do_defective(false);
  }
  JBE_CLOSEBOX();
}
function do_defective(f){
  alert(f);
  var vdisp1='block';
  var vdisp2='none';
  if(f){
    vdisp1='none';
    vdisp2='block';
  }
  document.getElementById('div_doCamera').style.display=vdisp1;
  document.getElementById('div_doPrint').style.display=vdisp1;
  document.getElementById('div_doSave').style.display=vdisp2;
}

function sel_period(){
  var tilt='Reading Period Coverage';  
  var d1=JBE_DATE_FORMAT(document.getElementById('mtr_from').innerHTML,"YYYY-MM-DD");
  var d2=''; 
  if(document.getElementById('mtr_to').innerHTML){
    d2=JBE_DATE_FORMAT(document.getElementById('mtr_to').getAttribute('data-date'),"YYYY-MM-DD");
  }
  //alert(d1+' vs '+d2);
  var dtl=          
    '<div id="div_period" data-zoom=0 style="width:100%;height:105px;font-text:14px;text-align:center;padding:10px;background-color:white;">'+
      '<div style="width:100%;height:30px;padding:2px;border:0px solid black;color:black;background:none;">'+
        '<div class="class_mtr1" style="float:left;width:20%;text-align:right;">From: </div>'+
        '<input type="date"  id="pmtr_from" class="xclass_mtr2" style="float:right;width:78%;font-size:14px;"  value="'+d1+'" />'+
      '</div>'+
      '<div style="width:100%;height:30px;padding:2px;border:0px solid black;color:black;background:none;">'+
        '<div class="class_mtr1" style="float:left;width:20%;text-align:right;">To: </div>'+
        '<input type="date" id="pmtr_to" class="xclass_mtr2" style="float:right;width:78%;font-size:14px;" value="'+d2+'" />'+
      '</div>'+
    '</div>';
  
  var dtl2=      
    '<div style="width:100%;height:100%;padding:10px;text-align:center;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+      
      '<input type="button" onclick="do_sel_period(pmtr_from.value,pmtr_to.value)" style="width:100px;height:100%;" value="OK"/>'+
    '</div>';   

  JBE_OPENBOX('div_period',tilt,dtl,dtl2); 
  
  if(!d1){
    document.getElementById('mtr_from').innerHTML=''
    document.getElementById('mtr_from').disabled=false;
  }
  
}
function do_sel_period(v_from,v_to){  
  if(!v_to){
    MSG_SHOW(vbOk,"ERROR: ","Pls. enter valid Date...",function(){},function(){});
    return;
  }
  if(v_from > v_to){
    MSG_SHOW(vbOk,"ERROR: ","Invalid Dates...<br>FROM date should be lesser than the TO date.",function(){},function(){});
    return;
  }
  
  var v_period=JBE_DATE_FORMAT(v_from,'MMM DD, YYYY')+' To '+JBE_DATE_FORMAT(v_to,'MMM DD, YYYY');
  //document.getElementById('mtr_from').innerHTML=JBE_DATE_FORMAT(v_from,"YYYY-MM-DD");
  document.getElementById('mtr_to').innerHTML=JBE_DATE_FORMAT(v_to,"MMM DD, YYYY");
  document.getElementById('mtr_to').setAttribute('data-date',v_to);
  //document.getElementById('mtr_period').setAttribute('data-to',JBE_DATE_FORMAT(v_to,"YYYY-MM-DD"));
  //document.getElementById('mtr_period').value=v_period;
  document.getElementById('mtr_bill').innerHTML=get_monbill(v_to);
  JBE_CLOSEBOX();
}

function formatDate(date) {
  var day = date.getDate();
  if (day < 10) {
      day = "0" + day;
  }
  var month = date.getMonth() + 1;
  if (month < 10) {
      month = "0" + month;
  }
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}


function save_billdate(m,y){
  document.getElementById('mtr_bill').innerHTML=m+' '+y;
  JBE_CLOSEBOX();
}

function show_TranMeter(aryDB){
  if(aryDB.length > 0){
    document.getElementById('mtr_bill').innerHTML=get_monbill(aryDB[0]["month_bill"]);
    document.getElementById('mtr_curr').innerHTML=aryDB[0]["reading"];   
    document.getElementById('mtr_used').innerHTML=aryDB[0]["used"];
    document.getElementById('mtr_amount').innerHTML=aryDB[0]["amount"];   
    document.getElementById('mtr_pic').src='data:image/jpeg;base64,' + btoa(aryDB[0]['photo']);
    //document.getElementById('mtr_pic').src='gfx/jham.png';
  }
}



function saveEntries(){    //jbe
  //var meter = document.getElementById('myCameraBox_main').getAttribute('data-meter'); //get meter number 
  var meter = document.getElementById('mtr_no').innerHTML;
  var meter_read=document.getElementById('meter_read').value;  
  
  var mtr_prev=parseInt(document.getElementById('mtr_prev').innerHTML);
  if(!mtr_prev){ mtr_prev=0; }

  //alert('mtr_prev '+mtr_prev);
  
  if(meter_read.trim().length==0){
    MSG_SHOW(vbOk,"ERROR:","Meter is empty. Enter Meter Reading.",function(){},function(){}); 
    return;
  }

  if(parseInt(meter_read) <= parseInt(mtr_prev)){
    MSG_SHOW(vbOk,"ERROR:","Meter is lower than the previous meter reading.",function(){},function(){}); 
    return;
  }

  
  //meter_read=parseInt(meter_read);
  var mtr_rate=parseInt(iDB_UTIL[0]['ratecub']);
  var mtr_used=parseInt(meter_read)-parseInt(mtr_prev);
  //var v_used=v_curr_read-v_prev_read;
  //var v_rate=parseInt(iDB_UTIL[0]['ratecub']);
  var amt_due=mtr_used * mtr_rate;
  if(mtr_used <= parseFloat(iDB_UTIL[0]['mincub'])){ 
    amt_due=parseInt(iDB_UTIL[0]['flatrate']); 
  }
  
  document.getElementById('mtr_pic').src=document.getElementById('div_curr_img').src;      
  document.getElementById('mtr_curr').innerHTML=meter_read;
  document.getElementById('mtr_used').innerHTML=mtr_used;
  document.getElementById('mtr_amount').innerHTML=JBE_FORMAT_DOUBLE_TO_STR(amt_due);
  closeCameraBox();	
}

function chgPic(){
  document.getElementById('mtr_pic').src='gfx/bg_app.jpg';      
  alert(document.getElementById('mtr_pic').src);
}


function get_meter(){    
  var v_meterno=document.getElementById("mtr_no").innerHTML;  
  if(!v_meterno){ 
    snackBar('Enter Meter Number');
    return;
  }

  document.getElementById("meter_read").value=document.getElementById("mtr_curr").innerHTML;
  document.getElementById("div_curr_img").src=document.getElementById("mtr_pic").src;

  openCameraBox(v_meterno);  
  document.getElementById('cap_cam_box').innerHTML='Meter # '+v_meterno;  
  showMenu('mnu_save_meter');   
}

function openCameraBox(meter) { 
  var x=document.getElementById("myCameraBox").getAttribute('data-open'); 
  if(x==1) { 
    //closeCameraBox();
    //return;
  } 
  
  setter(0);
  document.getElementById("myCameraBox").style.height = H_BODY+'px';              
  var h=parseInt(document.getElementById("myCameraBox_main").style.height);
  var h_tapal=parseInt(document.getElementById("div_tapal").style.height);
  
  document.getElementById("dtl_cam_box").style.height = (h-(30))+'px';    
  document.getElementById("container").style.height = (h-(h_tapal+40))+'px';
  document.getElementById("myCameraBox_main").setAttribute('data-open',1);     
  document.getElementById("myCameraBox_main").setAttribute('data-meter',meter); 
}

function ret_img(div){
  return;
  //var selected_meter_img=document.getElementById(div).src.split('/').pop();
  var selected_meter_img=document.getElementById(div).src;
  return selected_meter_img;
}
function closeCameraBox(){
  if(CAMERA_ON){
    stopCamera();
    document.getElementById("btn_cam_main").setAttribute('data-mode',0);
  }  
    
  document.getElementById("myCameraBox").style.height = 0+'px';       
  //document.getElementById('back_myView1').style.pointerEvents='auto';
  //document.getElementById('div_row_meters').style.pointerEvents='auto';
  
  document.getElementById("myCameraBox").style.height = "0px";       
  document.getElementById("myCameraBox").setAttribute('data-open','0');   
  /*
  if(CURR2_PROC=='fm_stock'){
    document.getElementById('div_main_stock').style.pointerEvents='auto';
    showMenu('mnu_stock'); return;
  }
  if(CURR2_PROC=='get_meter'){    
    document.getElementById('div_showMeter').style.pointerEvents='auto';
    CURR2_PROC='showMeter';
    showMenu('mnu_camera'); return;
  }
  */
  showMenu('mnu_get_meter');
}

function doCamera(){  
  var sw=parseInt(document.getElementById("btn_cam_main").getAttribute('data-mode')); 
  if(sw==0){
    //alert('doCamera');
    setter(1);
    openCamera();  
    var jpad=10;
    var jfocus=document.getElementById('jfocus');
    var jt='10px';
    var jw=parseInt(jfocus.style.width);

    var jl=(window.outerWidth-(jpad+jw))/2;
    jfocus.style.top=jt;
    jfocus.style.left=jl+'px';        
  }else{
    tira();
    stopCamera();
    setter(0);
  }
}

function doClose(){
  var btn2=document.getElementById("btn_cam_txt2");
  if(btn2.innerHTML=='STOP'){
    worker.terminate();
    setter(0);    
    return;
  }
  var sw=parseInt(document.getElementById("btn_cam_main").getAttribute('data-mode'));    
  if(sw==0){
    closeCameraBox();
  }else{
    stopCamera();
    setter(0);
  }
}

function get_monbill(monbill){  
  var pos=monbill.indexOf('-');
  var yyyy=monbill.substr(0,pos);
  var mm=parseInt(monbill.substr(pos+1));
  var mmm=JBE_ARY_MONTH[mm-1];
  var rval=mmm+' '+yyyy;
  return rval;
}

function save_monbill(monbill){  
  var pos=monbill.indexOf(' ');
  var mmm=monbill.substr(0,pos);  
  var yyyy=monbill.substr(pos+1);
  var mm=0;
  for(var i=0;JBE_ARY_MONTH.length;i++){
    if(mmm==JBE_ARY_MONTH[i]){
        mm=(i+1);
      break;
    }
  }
  mmm=mm;
  if(mm < 10){ mmm='0'+mm; }
  var rval=yyyy+'-'+mmm;
  return rval;
}
