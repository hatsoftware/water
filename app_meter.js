function fm_meter(){   
  if(!CURR_USER){
    showLogin();
    return;
  }

  if(iDB_METER.length==0){
    MSG_SHOW(vbOk,"ERROR: ","Records Empty. Please Download the Files.",function(){},function(){});
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
  document.getElementById('mtr_date').innerHTML='Date: '+sysDate+'  Time: '+sysTime;  
  document.getElementById('mtr_name').innerHTML='';
  document.getElementById('mtr_address').innerHTML='';
  document.getElementById('mtr_serialno').innerHTML='';
  document.getElementById('mtr_prev').innerHTML='';
  document.getElementById('mtr_curr').innerHTML='';
  document.getElementById('mtr_pic').src='gfx/img_empty.png';
  document.getElementById('mtr_amount').innerHTML='0.00';
  //document.getElementById('inp_meterno').style.pointerEvents='auto';
  //document.getElementById('btn_meterno').style.pointerEvents='auto';
  document.getElementById('back_meter').style.display='block';  
  document.getElementById('inp_meterno').disabled=false;
  document.getElementById('btn_meterno').disabled=false;
  document.getElementById('page_meter').setAttribute('data-close',0);

  document.getElementById('meter_read').value='';
  document.getElementById('div_curr_img').src='';  

  var mmm = JBE_ARY_MONTH[new Date().getMonth()];   
  var yyyy = new Date().getFullYear();  
  var monbill=mmm+' '+yyyy;
  document.getElementById('mtr_bill').disabled=true;
  document.getElementById('mtr_bill').value=monbill;
  document.getElementById('mtr_bill').setAttribute('data-value',monbill);
  
  //convert_monbill(1,monbill);
  showMenu('mnu_meter');
}

function chk_meter(){  
  var v_meterno=document.getElementById('inp_meterno').value.toUpperCase();
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
  var aryConsumer=JBE_GETARRY(iDB_CONSUMER,'custno',v_custno);

  var v_name=aryConsumer['name'];
  var v_address=aryConsumer['addrss'];
  
  document.getElementById('mtr_name').innerHTML=v_name;
  document.getElementById('mtr_address').innerHTML=v_address;
  document.getElementById('mtr_serialno').innerHTML=aryMeter["serialno"];
  document.getElementById('mtr_prev').innerHTML=aryMeter["last_read"];

  document.getElementById('mtr_bill').disabled=false;
  
  getMeterFromIDX(v_meterno);
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
function save_billdate(m,y){
  document.getElementById('mtr_bill').value=m+' '+y;
  JBE_CLOSEBOX();
}

function show_TranMeter(aryDB){
  if(aryDB.length > 0){
    document.getElementById('mtr_bill').value=get_monbill(aryDB[0]["month_bill"]);
    document.getElementById('mtr_curr').innerHTML=aryDB[0]["reading"];   
    document.getElementById('mtr_amount').innerHTML=aryDB[0]["amount"];   
    document.getElementById('mtr_pic').src='data:image/png;base64,' + btoa(aryDB[0]['photo']);
  }
}

function do_xprint(){    
  var originalContents = document.body.innerHTML;    
  document.getElementById('printableArea').style.display='block';
  var printContents = document.getElementById('printableArea').innerHTML;//.cloneNode(true);
    
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
}

function do_print(){  
  var v_mtr_curr=document.getElementById('mtr_curr').innerHTML;
  if(!v_mtr_curr){
    MSG_SHOW(vbOk,"ERROR: ","Pls. enter current reading...",function(){},function(){});
    return;
  }

  MSG_SHOW(vbYesNo,"ERROR:","Print Receipt?",function(){      
    var v_meterno=document.getElementById('inp_meterno').value.toUpperCase();
    var v_img=document.getElementById('mtr_pic').src;
    document.getElementById('prnHead1').innerText = CURR_CLIENTNAME.toUpperCase();
    document.getElementById('prnHead2').innerText = CURR_CLIENTADDRESS;
    document.getElementById('prnHead3').innerText = CURR_TELNO;

    document.getElementById('prnDate').innerText = sysDate;
    document.getElementById('prnName').innerText = document.getElementById('mtr_name').innerHTML;
    document.getElementById('prnAddress').innerText = document.getElementById('mtr_address').innerHTML;
    document.getElementById('prnSerialno').innerText = document.getElementById('mtr_serialno').innerHTML;
    JBE_PRINTDIV('printableArea');
    saveMeterToIDX();    
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

  var mtr_prev=parseInt(document.getElementById('mtr_prev').innerHTML);
  meter_read=parseInt(meter_read);
  var amt_due=(meter_read-mtr_prev)*40;
  document.getElementById('mtr_pic').src=document.getElementById('div_curr_img').src;    
  document.getElementById('mtr_curr').innerHTML=meter_read;
  document.getElementById('mtr_amount').innerHTML=JBE_FORMAT_DOUBLE_TO_STR(amt_due);
  closeCameraBox();	
}


function get_meter(){    
  var v_meterno=document.getElementById("inp_meterno").value.toUpperCase();
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
