function fm_meter(){   
  if(!CURR_USER){
    showLogin();
    return;
  }

  if(iDB_METER.length==0){
    alert('Empty iDB_METER');
    MSG_SHOW(vbOk,"ERROR: ","Records Empty. Please Download the Files.",function(){},function(){});
    return;
  }

  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
    
  openPage('page_meter');

  document.getElementById('cap_myView1').innerHTML='METER READING';
  //map.invalidateSize();

  init_meter();
}

function closeMeterPage(){
	showMainPage();
}

function init_meter(){
  document.getElementById('inp_meterno').value='';
  document.getElementById('mtr_date').innerHTML='Date: '+sysDate+'  Time: '+sysTime;  
  document.getElementById('mtr_name').innerHTML='';
  document.getElementById('mtr_address').innerHTML='';
  document.getElementById('mtr_serialno').innerHTML='';
  document.getElementById('mtr_prev').innerHTML='';
  document.getElementById('mtr_curr').innerHTML='';
  document.getElementById('mtr_pic').src='gfx/img_empty.png';
  document.getElementById('mtr_amount').innerHTML='';
  document.getElementById('inp_meterno').style.pointerEvents='auto';
  document.getElementById('btn_meterno').style.pointerEvents='auto';
  showMenu('mnu_meter');
}

function chk_meter(){  
  var v_meterno=document.getElementById('inp_meterno').value.toUpperCase();
  var v_custno=JBE_GETFLD('custno',iDB_METER,'meterno',v_meterno);
    
  if(!v_custno){    
    MSG_SHOW(vbOk,"ERROR:","Record Not Found.",function(){},function(){});
    init_meter();
    return;
  }

  showMenu('mnu_get_meter');

  document.getElementById('inp_meterno').style.pointerEvents='none';
  document.getElementById('btn_meterno').style.pointerEvents='none';

  var aryMeter=JBE_GETARRY(iDB_METER,'meterno',v_meterno);
  var aryConsumer=JBE_GETARRY(iDB_CONSUMER,'custno','C001');

  var v_name=aryConsumer['name'];
  var v_address=aryConsumer['addrss'];
  
  document.getElementById('mtr_name').innerHTML=v_name;
  document.getElementById('mtr_address').innerHTML=v_address;
  document.getElementById('mtr_serialno').innerHTML=aryMeter["serialno"];
  document.getElementById('mtr_prev').innerHTML=aryMeter["lastread"];
}

function do_print(){
  MSG_SHOW(vbYesNo,"ERROR:","Please Log In",function(){      
    document.getElementById('prnHead1').innerText = CURR_CLIENTNAME.toUpperCase();
    document.getElementById('prnHead2').innerText = CURR_CLIENTADDRESS;
    document.getElementById('prnHead3').innerText = CURR_TELNO;

    document.getElementById('prnDate').innerText = sysDate;
    document.getElementById('prnName').innerText = document.getElementById('mtr_name').innerHTML;
    document.getElementById('prnAddress').innerText = document.getElementById('mtr_address').innerHTML;
    document.getElementById('prnSerialno').innerText = document.getElementById('mtr_serialno').innerHTML;
    JBE_PRINTDIV('printableArea');
    //saveDataToIDX(DB_METER,0);
    return;
  },function(){});
}

function saveEntries(){  
  var meter = document.getElementById('myCameraBox_main').getAttribute('data-meter'); //get meter number 
  var meter_read=document.getElementById('meter_read').value;  
  
  if(meter_read.trim().length==0){
    MSG_SHOW(vbOk,"ERROR:","Meter is empty. Enter Meter Reading.",function(){},function(){}); 
    return;
  }
  meter_read=parseInt(meter_read);
  document.getElementById('mtr_pic').src=document.getElementById('div_curr_img').src;    
  document.getElementById('mtr_curr').innerHTML=meter_read;
  closeCameraBox();	
}

function showRecordBtn(v){
  /*
  var lbRecVal='none';
  document.getElementById('lb_rec').style.display='block';  
  document.getElementById('lb_record').style.display='none';  
  if(v > 0){
    lbRecVal='block';
    document.getElementById('lb_rec').style.display='none';  
    document.getElementById('lb_record').style.display='block';  
  }
  //document.getElementById('lb_record').style.display=lbRecVal;  
  //document.getElementById('lb_record').disabled=true;
  */
}

function showSendBtn(){
	var vdisp='none';
	if(chkAllEntries(1)){
		vdisp='block';
	}	
	document.getElementById('dm_save').style.display=vdisp;
	document.getElementById('dm_send').style.display=vdisp;
}

function retuDate(d){
  var rval=d;
  if(d=='0000-00-00'){
    rval='';
  }
  return rval;
}
function assign_data_meter(){
  var rval="DOWNED";
  var clor="red";
  if(CURR2_STATUS==0){
    rval="OPERATIONAL";
    clor="lightgreen";      
  }

  document.getElementById('pump_stat').style.color=clor;
  document.getElementById('pump_stat').innerHTML=rval;

  document.getElementById('dta_collection').innerHTML=CURR2_COLLECTION;
  document.getElementById('dta_date_down').innerHTML=retuDate(CURR2_DATE_DOWN);
  document.getElementById('dta_date_exp').innerHTML=retuDate(CURR2_DATE_EXP);
  document.getElementById('dta_repair').innerHTML=CURR2_REPAIRS;
  document.getElementById('dta_repdate').innerHTML=retuDate(CURR2_REPDATE);
}

function get_meter(){  
  var v=document.getElementById("inp_meterno").value.toUpperCase();
  if(!v){ 
    snackBar('Enter Meter Number');
    return;
  }
  var valMeter=document.getElementById("meter_read").value;
  //showRecordBtn(valMeter);

  openCameraBox(v);  
  document.getElementById('cap_cam_box').innerHTML='Meter # '+v;
  //document.getElementById('back_myView1').style.pointerEvents='none';
  //document.getElementById('div_row_meters').style.pointerEvents='none';  
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
    setter(1);
    openCamera();  
    var jpad=10;
    var jfocus=document.getElementById('jfocus');
    var jt='10px';
    var jw=parseInt(jfocus.style.width);

    var jl=(window.outerWidth-jpad-jw)/2;
    jfocus.style.top=jt;
    jfocus.style.left=jl+'px';        
  }else{
    tira();
    stopCamera();
		if(f_worker){ 
      doOCR(); 
		}else{
			setter(0);
    }
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


function doOCR(){  
  document.getElementById("div_video").style.display='none';
  var img=document.getElementById("myCanvas");
  document.getElementById("btn_cam_main").style.pointerEvents='none';
  document.getElementById("btn_cam_main").style.backgroundColor='gray';
  
  document.getElementById("btn_cam_cancel").style.pointerEvents='auto';
  document.getElementById("btn_cam_txt2").innerHTML="STOP";    
  document.getElementById("btn_cam_cancel").style.backgroundColor='red';
  
  // Other browsers will fall back to image/png
  img.src = canvas.toDataURL('image/png');  
  setter(0);
}

