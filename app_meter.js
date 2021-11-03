function fm_meter(){   

  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
    
  openPage('page_meter');
  //clearScreen(0);      
  //document.getElementById('page_meter').style.display='block';  
 
  //document.getElementById('div_row_meters').style.height=H_BODY-(110+30+40+20)+'px';
  document.getElementById('cap_myView1').innerHTML='METER READING';
  //map.invalidateSize();
  showMenu('mnu_meter'); 
  document.getElementById('mtr_date').innerHTML='Date: '+sysDate+'  Time: '+sysTime;
  document.getElementById('mtr_name').innerHTML='';
  document.getElementById('mtr_address').innerHTML='';
  document.getElementById('dm_save').style.display='none';
  document.getElementById('dm_send').style.display='none';
  init_meter();
  //alert('prog '+JBE_ONLINE);
}

function closeMeterPage(){
	showMainPage();
}

function init_meter(){
  document.getElementById('mtr_name').innerHTML='';
  document.getElementById('mtr_address').innerHTML='';
  document.getElementById('mtr_serialno').innerHTML='';
  document.getElementById('mtr_prev').innerHTML='';
  document.getElementById('mtr_curr').innerHTML='';
  document.getElementById('mtr_amount').innerHTML='';
}

function chk_meter(){
  
  var v_meterno=document.getElementById('inp_meterno').value.toUpperCase();
  //alert(v_meterno);
  var aryMeter=JBE_GETARRY(DB_METER,'meterno',v_meterno);
  var v_custno=aryMeter["custno"];
  var aryConsumer=JBE_GETARRY(DB_CONSUMER,'custno',v_custno);
  if(aryMeter.length==0){ alert('wala'); return; }
  
  //document.getElementById('mtr_name').innerHTML=JBE_GETFLD('name',DB_CONSUMER,'custno',v_custno);
  //document.getElementById('mtr_address').innerHTML=JBE_GETFLD('addrss',DB_CONSUMER,'custno',v_custno);
  document.getElementById('mtr_name').innerHTML=aryConsumer['name'];
  document.getElementById('mtr_address').innerHTML=aryConsumer['addrss'];
  document.getElementById('mtr_serialno').innerHTML=aryMeter["serialno"];
  document.getElementById('mtr_prev').innerHTML=aryMeter["lastread"];
}

function showRecordBtn(v){
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
  CURR2_PROC='get_meter';
  var valMeter=document.getElementById("meter_read").value;
  showRecordBtn(valMeter);

  openCameraBox(v);  
  document.getElementById('cap_cam_box').innerHTML='Meter # '+v;
  //document.getElementById('back_myView1').style.pointerEvents='none';
  //document.getElementById('div_row_meters').style.pointerEvents='none';  
  showMenu('mnu_get_meter');   
}

function openCameraBox(meter) { 
  var x=document.getElementById("myCameraBox").getAttribute('data-open'); 
  if(x==1) { 
    //closeCameraBox();
    //return;
  } 
  
  setter(0);
  h=parseInt(document.getElementById('container').style.height);
  var hh=h+30+12; //dtl height + box head height + paddings
  //h=300;
  //document.getElementById('div_backer').style.display='none';   
  document.getElementById("myCameraBox").style.height = H_BODY+'px';            

  document.getElementById("dtl_cam_box").style.height = (h+12)+'px';     
    
  document.getElementById("myCameraBox_main").setAttribute('data-open',1);     
  document.getElementById("myCameraBox_main").setAttribute('data-meter',meter); 
  document.getElementById("myCameraBox_main").style.height = hh+'px';         
    
  /*
  //var selected_meter_img=document.getElementById('myMeter'+meter).src.split('/').pop();
  var selected_meter_img=document.getElementById('myMeter'+meter).src;
  //var selected_meter_img=ret_img('myMeter'+meter);
  //alert('selected_meter_img : '+selected_meter_img);
  if(selected_meter_img.split('/').pop()==''){    
    selected_meter_img='gfx/img_empty.webp';
  }
  document.getElementById("div_curr_img").src=selected_meter_img;  
  document.getElementById("meter_read").value=document.getElementById("myReading"+meter).innerHTML;
*/
  //tapali  
  document.getElementById("div_tapal").style.height = (h-100)+'px';
  document.getElementById('transcription').innerHTML='';  
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
    
  document.getElementById("myCameraBox_main").style.height = 0+'px';       
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
  showMenu('mnu_meter');
}

function doCamera(){
  document.getElementById('transcription').innerHTML='';
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
    document.getElementById("transcription").innerText = "OCR TERMINATED";    
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
  document.getElementById("transcription").innerText = "";    
  document.getElementById("div_video").style.display='none';
  var img=document.getElementById("myCanvas");
  document.getElementById("btn_cam_main").style.pointerEvents='none';
  document.getElementById("btn_cam_main").style.backgroundColor='gray';
  
  document.getElementById("btn_cam_cancel").style.pointerEvents='auto';
  document.getElementById("btn_cam_txt2").innerHTML="STOP";    
  document.getElementById("btn_cam_cancel").style.backgroundColor='red';
  
  // Other browsers will fall back to image/png
  img.src = canvas.toDataURL('image/png');
  runningOCR(img.src,'transcription');
  setter(0);
}

function getNumOnly(s){
  var rval='';
  s=s.match(/\d+/g);
  if(s==null){ return rval; }
  for(var i=0;i<s.length;i++){
      rval+=s[i];
  }   
  return rval;
}

function runOCR(url) {
    document.getElementById("transcription").style.color='red';    
    worker = new Tesseract.TesseractWorker();    
    //const worker = new Tesseract.TesseractWorker();
		worker.recognize(url)
			.then(function(result) {
				//var num_only = result.text.match(/\d+/g);        
				document.getElementById("transcription").style.color='navy';
				document.getElementById("transcription").innerText = result.text;
				document.getElementById("meter_read").value = getNumOnly(result.text);              
				})
			.progress(function(result) {
				document.getElementById("transcription")
								.innerText = result["status"] + " (" +
								Math.round(result["progress"] * 100) + "%)";
				})
			.catch(function (error) { 
        console.log('OCR error : '+error); 
        MSG_SHOW(vbOk,"OCR ERROR:",error,function(){},function(){});
				})
			.finally(function(result) {       
       worker.terminate();
       snackBar('OCR Completed...')
       
			});	
}         

function saveEntries(){  
  var meter = document.getElementById('myCameraBox_main').getAttribute('data-meter'); //get meter number 
  var meter_read=document.getElementById('meter_read').value;  
  
  if(meter_read.trim().length==0){
    MSG_SHOW(vbOk,"ERROR:","Meter is empty. Enter Meter Reading.",function(){},function(){}); 
    return;
  }
  meter_read=parseInt(meter_read);
  //document.getElementById('myMeter'+meter).src=document.getElementById('div_curr_img').src;    
  document.getElementById('mtr_curr').innerHTML=meter_read;
  closeCameraBox();
	//showSendBtn();
}

function disp_lastread(t){
  var vdisp='block';
  var vevent='auto';
  if(t){
    vdisp='none';
    vevent='none'
  }
  document.getElementById('back_meter_img').style.display=vdisp;
  document.getElementById('div_row_meters').style.pointerEvents=vevent;
  document.getElementById('dta_collection').disabled=t;
}

function closeLastRead(){    
  showMenu('mnu_camera'); 
}
function lastReading(){  
  var dtl=
		'<div id="lastRead" style="width:100%;height:300px;background:lightgray;">'+
		  '<div id="xxxdiv_collection" style="width:100%;height:30px;text-align:center;padding:3px;background:'+JBE2_CLOR3+';">'+        
            '<input id="lastCollection" onchange="showSendBtn()" type="number" readonly style="float:right;width:40%;height:100%;text-align:center;" />'+
            '<span style="float:right;width:auto;height:100%;text-align:right;padding:3px;background:none;">Collection : </span>'+
		  '</div>'+
		  '<div id="last_row_meters" style="padding:5px;height:270px;background:white;"></div>'+
		'</div>';
  openBox('lastRead','Last Saved Record',dtl,'closeLastRead');
  
  dtl='';
  var max_meter=CURR2_METERS;
  for(var i=0;i<max_meter;i++){
    mtr=(i+1);
    dtl=dtl+
      '<div style="width:100%;height:60px;text-align:center;border:1px solid black;">'+  
        '<div style="float:left;width:60%;height:100%;overflow:hidden;text-align:center;border:0px solid lightgray;background:gray;">'+  
          '<img id="lastMeter'+mtr+'" src="" style="display:block;width:100%;overflow:hidden;padding:0%;" />'+
        '</div>'+
        '<div style="float:left;width:40%;height:100%;text-align:center;border:0px solid lightgray;padding:1px;background:gray;">'+  
          '<div class="color_head4" style="float:left;width:100%;height:30%;padding:1px;font-size:12px;font-weight:bold;text-align:center;border:1px solid lightgray;color:black;background:'+JBE2_CLOR2+'">'+  
            'Meter: '+mtr+
          '</div>'+  
          '<div id="lastReading'+mtr+'" style="float:left;width:100%;height:70%;text-align:center;font-weight:bold;padding:10px;border:1px solid lightgray;color:navy;">'+ 

          '</div>'+  
        '</div>'+  
      '</div>';
  }
  document.getElementById('last_row_meters').innerHTML=dtl;
	for(var i=1;i<=CURR2_METERS;i++){
    getLastItem(i);
  } 
  showMenu('mnu_lastread');

  //////check if record already sent or not.
  var trans = db.transaction(['SysFile'], 'readonly');  
  let req = trans.objectStore('SysFile').get(1);
  req.onsuccess = function (e) {
    var result = e.target.result;
    if(!result){
      document.getElementById('send_last_read').style.display='none';        
      return;
    }
    if (result.sent==1) {
      document.getElementById('send_last_read').style.display='none';        
      console.log('sent');      
    } else {
      document.getElementById('send_last_read').style.display=' block';  
      console.log('none');
    }  
    document.getElementById('lastCollection').value=result.collection;  
    //document.getElementById('send_last_read').style.display=' block';  
  }
  req.onerror = function(e) {
    console.err(e);    
  };
  
  //////////////////////////////////////////
  
}

function getLastItem(mtr) {    
  let image = document.querySelector('#lastMeter'+mtr);
  let divmeter = document.querySelector('#lastReading'+mtr);
  let recordToLoad = mtr;
  if(recordToLoad === '') recordToLoad = 1;

  let trans = db.transaction(['MeterFile'], 'readonly');
  //hard coded id
  let req = trans.objectStore('MeterFile').get(recordToLoad);
  req.onsuccess = function(e) {
    let record = e.target.result;
    if(!record){ return; }
    //console.log('get success', record);
    image.src = 'data:image/png;base64,' + btoa(record.data);      
    divmeter.innerHTML=record.reading;
  }  
}

/*
function xxxgetLastItem(mtr) {    
  let image = document.querySelector('#lastMeter'+mtr);
  let divmeter = document.querySelector('#lastReading'+mtr);
  let recordToLoad = mtr;
  if(recordToLoad === '') recordToLoad = 1;

  let trans = db.transaction(['MeterFile'], 'readonly');
  //hard coded id
  let req = trans.objectStore('MeterFile').get(recordToLoad);
  req.onsuccess = function(e) {
    var imgFileX = e.target.result;
    var imgFile=imgFileX.value.data;
    //var URL = window.URL || window.webkitURL;
    //var videoURL = URL.createObjectURL(video);
    console.log("Got elephant!" + imgFile);

    // Get window.URL object
    var URL = window.URL || window.webkitURL;

    // Create and revoke ObjectURL
    var imgURL = URL.createObjectURL(imgFile);

    // Set img src to ObjectURL
    var imgElephant = document.getElementById("lastMeter"+mtr);
    imgElephant.setAttribute("src", imgURL);

    // Revoking ObjectURL
    URL.revokeObjectURL(imgURL);

    //image.src = 'data:image/jpeg;base64,' + btoa(record.data);      
    //divmeter.innerHTML=record.reading;
  }  
}
*/

function edit_system(id,sent,coll){   
  let ob = {
    id:id,
    sent:sent,
    collection:coll
  };
  let trans = db.transaction(['SysFile'], 'readwrite');
  let editReq = trans.objectStore('SysFile').put(ob);

  editReq.onerror = function(e) {
    console.log('error storing meter sent');
    console.error(e);
  }

  trans.oncomplete = function(e) {
    console.log('meter sent updated');
  }
}

function PrintElem() {
  var mywindow = window.open('', 'PRINT');
  mywindow.document.write('<html><head><title>Payment Slip</title>');
  mywindow.document.write('</head><body style="text-align:center;font: Georgia, "Times New Roman", Times, serif;background: #fff;font-size: 22pt;margin:20px auto auto 50px;" >');
  mywindow.document.write('<header style="text-align:center; white-space:nowrap;overflow:hidden;line-height: 1em;">' +
  '<p  style="font-size:16pt;white-space:nowrap;overflow:hidden;line-height: 12pt;">Payment Slip</p>' +
  '<p style="font-size:16pt;white-space:nowrap;overflow:hidden;line-height: 1em;"></p>' +
'</header>');
  mywindow.document.write('<content style="text-align:center;">' +
  '<table style="margin-left: auto;margin-right: auto;border-collapse: collapse;font-size:16pt;">' +
      '<tr  style="border:1px solid black"><td  style="border:1px solid black">Name:</td><td  style="border:1px solid black">' +  '</td></tr>' +
      '<tr style="border:1px solid black"><td style="border:1px solid black">Address:</td><td style="border:1px solid black">' +  '</td></tr>' +
      '<tr  style="border:1px solid black"><td  style="border:1px solid black">Meter No:</td><td  style="border:1px solid black">' +  '</td></tr>' +
      '<tr  style="border:1px solid black"><td  style="border:1px solid black">Token:</td><td  style="border:1px solid black">' +  '</td></tr>' +
  '</table>'+

'</content>' +
'<footer>' +
'<hr style="margin-top:30pt;margin-bottom:30pt;">' +
  '<p style="text-align:right;">&copy pdb</p>' +
'</footer>'+
'');
  mywindow.document.write('</body></html>');
  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/
  mywindow.print();
  mywindow.close();
  return true;
}
function PrintElem() {
  var mywindow = window.open('', 'PRINT');
  mywindow.document.write('<html><head><title>W A T E R   B I L L</title></head>');
  mywindow.document.write('<body style="text-align:center;font: Georgia, "Times New Roman", Times, serif;background: #fff;font-size: 22pt;margin:20px auto auto 50px;" >');
  mywindow.document.write('<header style="text-align:center; white-space:nowrap;overflow:hidden;line-height: 1em;">' +
      '<div style="font-size:16pt;white-space:nowrap;overflow:hidden;line-height: 14pt;">'+CURR_CLIENTNAME+'</div>' +
      '<div style="font-size:16pt;white-space:nowrap;overflow:hidden;line-height: 14pt;">'+CURR_CLIENTADDRESS+'</div>' +
      '<div style="font-size:16pt;white-space:nowrap;overflow:hidden;line-height: 14pt;">'+CURR_TELNO+'</div>' +
      '<div style="font-size:16pt;white-space:nowrap;overflow:hidden;line-height: 14pt;margin-top:20px;">W A T E R   B I L L</div>' +
      '<div style="font-size:16pt;white-space:nowrap;overflow:hidden;line-height: 1em;"></div>' +
      '</header>');
  mywindow.document.write('<content style="text-align:center;">' +
      '<table style="margin-top:20px;margin-left: auto;margin-right: auto;border-collapse: collapse;font-size:16pt;">' +
          '<tr  style="border:0px solid black"><td  style="border:0px solid black">Name:</td><td  style="border:0px solid black">' +document.getElementById('mtr_name').innerHTML+ '</td></tr>' +
          '<tr style="border:0px solid black"><td style="border:0px solid black">Address:</td><td style="border:0px solid black">' +document.getElementById('mtr_address').innerHTML+ '</td></tr>' +
          '<tr  style="border:0px solid black"><td  style="border:0px solid black">Meter No:</td><td  style="border:0px solid black">' +document.getElementById('inp_meterno').value.toUpperCase()+ '</td></tr>' +
          '<tr  style="border:0px solid black"><td  style="border:0px solid black">Previous Reading:</td><td  style="border:0px solid black">' +document.getElementById('mtr_prev').innerHTML+ '</td></tr>' +
          '<tr  style="border:0px solid black"><td  style="border:0px solid black">Current Reading:</td><td  style="border:0px solid black">' +document.getElementById('mtr_curr').innerHTML+ '</td></tr>' +
      '</table>'+

      '</content>' +
      '<footer>' +
      '<hr style="margin-top:30pt;margin-bottom:30pt;">' +
        '<p style="text-align:center;">&copy Hatsoftware</p>' +
      '</footer>'+
      '');
  mywindow.document.write('</body></html>');
  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/
  mywindow.print();
  mywindow.close();
  return true;
}
