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