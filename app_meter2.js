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

function chkAllEntries(mode){
  var divMeter='myMeter';
  var divReading='myReading';
  var divCollection="dta_collection";
  if(mode==2){
    divMeter='lastMeter';
    divReading='lastReading';
    divCollection="lastCollection";
  }
  var rval=true;  
  //validate if all have entries/data    
  for(var i=1;i<=CURR2_METERS;i++){
    var jstrImg=ret_img(divMeter+i);
    var jmeter=document.getElementById(divReading+i).innerHTML;
        
    if(jstrImg ==''){       
      rval=false;
      break;
    }
    if(jmeter ==''){      
      rval=false;
      break;
    }
  }
  if(document.getElementById(divCollection).value==''){
    rval=false;
  }
  
  return rval;
}

function sendSaveData(){	
	sendData(2);
  closeBox();
  //closeMeterPage();
}

function sendData(mode){ 
  //alert(JBE_ONLINE);  
  if(!JBE_ONLINE){ 
    snackBar('OFFLINE');
    return;
  }
  //
    
  if(mode==1){
		if(!saveData(1)){
			return;
		} 
  }

  var divMeter='myMeter';
  var divReading='myReading';
  var divCollection="dta_collection";
  if(mode==2){
    divMeter='lastMeter';
    divReading='lastReading';
    divCollection="lastCollection";    
    //alert('mode is: '+mode);
    //var ddiv=document.getElementById(divMeter+1);
    //document.getElementById('myMeter1').src=ddiv.src;
    //return;
  }
  var currCollection=document.getElementById(divCollection).value;
   
  var vDate=new Date();  
  var vTime = vDate.toLocaleTimeString('it-IT');  

  vDate = new Date(vDate.getTime() - (vDate.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0]; 
  //alert(vDate+' '+vTime);

  var data = new FormData();
  data.append('host', JBE_HOST);
  data.append('projcode', CURR2_PROJ);
  for(var i=1;i<=CURR2_METERS;i++){    
    data.append('img'+i, document.getElementById(divMeter+i).src);
    data.append('mtr'+i, document.getElementById(divReading+i).innerText);
    //console.log('meter '+i+' = '+document.getElementById(divReading+i).innerText);
  }
  data.append('ctr_meter', CURR2_METERS);  // meter counter total
  //send app data  
  data.append('app_status',CURR2_STATUS);  
  data.append('app_collection',currCollection);  
  data.append('app_downed',CURR2_DATE_DOWN);  
  data.append('app_exp_date',CURR2_DATE_EXP);  
  data.append('app_repairs',CURR2_REPAIRS);  
  data.append('app_repdate',CURR2_REPDATE);   

  data.append('app_date',vDate);   
  data.append('app_time',vTime);   
   
  showProgress(true);  
  axios.post(JBE_API+'z_upload.php', data)
  .then(function (response) {
      console.log('JEFF: '+response.data);      
      snackBar('Record sent...');
      CURR2_COLLECTION=currCollection;
      //tell the app the meter is sent and flag true the system.
      edit_system(1,1,currCollection);
      showProgress(false);
      showMainPage();      
  })  
  .catch(function (err) {    
      console.log(err.message); 
      showProgress(false);
      MSG_SHOW(vbOk,"ERROR: Upload Failed",err.message,function(){},function(){});
  });  
}

function saveData(m){  
  //m=0 main exit, m=1 used by function
	if(!chkAllEntries(1)){
    MSG_SHOW(vbOk,"ERROR:","Fill all entries for Meters & Collection fields.",function(){},function(){}); 
    return false;
  }
  var currCollection=document.getElementById('dta_collection').value;
  for(var i=1;i<=CURR2_METERS;i++){
    var jmtr=i;
    var jreading=document.getElementById('myReading'+i).innerHTML;
    var jimg=document.getElementById('myMeter'+i).src;
    saveMeterToIDX(jmtr,jreading,jimg);
    edit_system(1,0,currCollection);
  }
  
  document.getElementById('meter_read').value='';
  if(m==0){ closeMeterPage(); }
	return true;
}

function saveMeterToIDX(jmtr,jreading,jimg){  
  var canvas = document.createElement("canvas");
  const context = canvas.getContext('2d');
  
  var img = new Image();
  img.src=jimg;
  
  img.onload = function() {
    canvas.width=img.width;
    canvas.height=img.height;
    context.drawImage(img, 0, 0);
    
    canvas.toBlob(function (blob) {        // get content as JPEG blob
      //saveFINAL(jmtr,jreading,blob);
			
			//let file = blob;
			var reader = new FileReader();
			reader.readAsBinaryString(blob);
			reader.onload = function(e) {    
				let bits = e.target.result;
				let ob = {
					meter:jmtr,
					reading:jreading,
					data:bits
				};

				let trans = db.transaction(['MeterFile'], 'readwrite');
				let addReq = trans.objectStore('MeterFile').put(ob);

				addReq.onerror = function(e) {
					console.log('error storing data');
					console.error(e);
				}

				trans.oncomplete = function(e) {
					console.log('data stored');
				}
			}
			
    }); 
  }  
}

function editMeter(meter,reading){   
  let ob = {
    meter:meter,
    reading:reading,
    data:'pics'
  }; 
  let trans = db.transaction(['MeterFile'], 'readwrite');
  let editReq = trans.objectStore('MeterFile').put(ob);
  //var request = testStore.get(2);

  editReq.onerror = function(e) {
    console.log('error storing data');
    console.error(e);
  }

  trans.oncomplete = function(e) {
    console.log('data updated');
  }
}

function forceDownload(url, fileName){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function(){
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
  }
  xhr.send();
}

function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}

function jdownload(){
  document.getElementById('downloadtag').click();
}

function transfer_last_read(){    
  //get from saved
  for(var i=1;i<=CURR2_METERS;i++){
    //let image = document.querySelector('#lastMeter'+mtr);
    //image.src = 'data:image/jpeg;base64,' + btoa(record.data);      
    var jimg=document.getElementById('lastMeter'+i).src;
    var jmeter=document.getElementById('lastReading'+i).innerHTML;
    var jcoll=document.getElementById('lastCollection').value;

    document.getElementById('myMeter'+i).src=jimg;
    document.getElementById('myReading'+i).innerHTML=jmeter;
    document.getElementById('dta_collection').value=jcoll;
  }  
  closeBox();
}



/*
 // Retrieve the file that was just stored
    transaction.objectStore("elephants").get("image").onsuccess = function (event) {
    var imgFile = event.target.result;
    console.log("Got elephant!" + imgFile);

    // Get window.URL object
    var URL = window.URL || window.webkitURL;

    // Create and revoke ObjectURL
    var imgURL = URL.createObjectURL(imgFile);

    // Set img src to ObjectURL
    var imgElephant = document.getElementById("elephant");
    imgElephant.setAttribute("src", imgURL);

    // Revoking ObjectURL
    URL.revokeObjectURL(imgURL);
};
*/