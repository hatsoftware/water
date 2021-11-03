function fm_ocr(){     
  if(CURR2_PROJ=='NONE' || CURR2_PROJ=='' || CURR2_PROJ==null){
    MSG_SHOW(vbYesNo,"ERROR:","Please Log In",function(){ showLogin(); },function(){});
    return;
  }

  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
    
  openPage('page_ocr');
  set_ocr(0);
  //clearScreen(0);    
  showMenu('mnu_ocr'); 
}

function do_scan(){
  var x=document.getElementById("btn_scan_main").getAttribute('data-mode');    
  if(x==0){    
    JBE_GET_IMAGE(0,id_file_front.id,div_scan_img.id,'iyot',false);    
  }else{
    //alert('go scan');
    doOCR2();
    //set_ocr(0);
  }  
}

function doCloseOCR(){
  document.getElementById("div_scan_img").src='gfx/jcam.png';
  set_ocr(0);
}

function iyot(){
  //alert('Tan-awa: '+document.getElementById("div_scan_img").src);  
  set_ocr(1);
}

function set_ocr(m){
  document.getElementById("btn_scan_main").setAttribute('data-mode',0);  
  document.getElementById("btn_scan_main").style.backgroundColor=JBE2_CLOR2;  
  document.getElementById("btn_scan_txt").innerHTML="Take 3 Photo";  
  document.getElementById("btn_scan_txt2").innerHTML="Close";  
  document.getElementById("btn_scan_img2").src='gfx/jcancel.png';
  
  document.getElementById("btn_scan_main").style.pointerEvents='auto';
  document.getElementById("btn_scan_main").style.backgroundColor=JBE2_CLOR2; 
  document.getElementById("btn_scan_cancel").style.pointerEvents='auto';
  document.getElementById("btn_scan_cancel").style.backgroundColor=JBE2_CLOR2;  

  document.getElementById("div_scan").style.display='block';
  //document.getElementById("div_scan_img").src='gfx/jcam.png';
  document.getElementById("div_transcription").style.display='none';
  
  if(m==1){
    document.getElementById("btn_scan_main").setAttribute('data-mode',1);   
    document.getElementById("btn_scan_main").style.backgroundColor='red';     
    document.getElementById("btn_scan_txt").innerHTML="Capture";
    document.getElementById("btn_scan_txt2").innerHTML="Cancel";  
    document.getElementById("btn_scan_img2").src='gfx/jback.png';
    //document.getElementById("div_scan_img").style.display='none';    
  }  
}

function doOCR2(){
  document.getElementById("div_transcription").innerText = "";    
  var simg=document.getElementById("div_scan_img").src;
  document.getElementById("btn_scan_main").style.pointerEvents='none';
  document.getElementById("btn_scan_main").style.backgroundColor='gray';
  
  document.getElementById("btn_scan_cancel").style.pointerEvents='auto';
  document.getElementById("btn_scan_txt2").innerHTML="STOP";    
  document.getElementById("btn_scan_cancel").style.backgroundColor='red';
  
  // Other browsers will fall back to image/png
  //img.src = canvas.toDataURL('image/png');
  //img.src = document.getElementById("div_scan_img").src;
  //alert(simg);
  runningOCR(simg,'div_transcription');
  set_ocr(0);
}


function runningOCR(url,tranz) {
  document.getElementById(tranz).style.color='red';    
  document.getElementById('div_scan').style.opacity='1';    
  document.getElementById('div_scan_text').style.display='block';    
  
  worker = new Tesseract.TesseractWorker();    
  //const worker = new Tesseract.TesseractWorker();
  worker.recognize(url)
    .then(function(result) {
      //var num_only = result.text.match(/\d+/g);        
      document.getElementById(tranz).style.color='navy';
      document.getElementById(tranz).innerText = result.text;
      //document.getElementById("meter_read").value = getNumOnly(result.text);              
      })
    .progress(function(result) {
      document.getElementById('div_scan_text')
              .innerText = result["status"] + " (" +
              Math.round(result["progress"] * 100) + "%)";
      })
    .catch(function (error) { 
      console.log('new OCR error : '+error); 
      MSG_SHOW(vbOk,"new OCR ERROR:",error,function(){},function(){});
      })
    .finally(function(result) {       
      worker.terminate();
      document.getElementById('div_scan_text').style.display='none';    
      document.getElementById('div_scan').style.opacity='1';    
      snackBar('new OCR Completed...');
      show_scanned();      
    });	
}         

function show_scanned(){
  showMenu('mnu_ocr_scanned'); 
  document.getElementById("div_scan").style.display='none';
  document.getElementById("div_transcription").style.display='block';
  //document.getElementById("div_transcription").style.contentEditable="true";
}

function save_scanned(){
  var fileName =  'tags.txt'; // You can use the .txt extension if you want
  downloadInnerHtml(fileName, 'div_transcription');
}

function xdownloadInnerHtml(filename, elId, mimeType) {
  var elHtml = document.getElementById(elId).innerHTML;
  var link = document.createElement('a');
  mimeType = mimeType || 'text/plain';

  link.setAttribute('download', filename);
  link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
  link.click(); 
}

//var fileName =  'tags.txt'; // You can use the .txt extension if you want
//downloadInnerHtml(fileName, 'div_transcription','text/html');

function xbrToNewLine(str) {
  return str.replace(/<br ?\/?>/g, "\n");  
}

function nl2br(str){
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function brToNewLine(str){
  //var str = document.getElementById(elId).innerHTML;
  var regex = /<br\s*[\/]?>/gi;
  return str.replace(regex, "\n");
}

function downloadInnerHtml(filename, elId, mimeType) {
  var elHtml = brToNewLine(document.getElementById(elId).innerHTML);

  if (navigator.msSaveBlob) { // IE 10+ 
      navigator.msSaveBlob(new Blob([elHtml], { type: mimeType + ';charset=utf-8;' }), filename);
  } else {
      var link = document.createElement('a');
      mimeType = mimeType || 'text/plain';

      link.setAttribute('download', filename);
      link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
      link.click(); 
  }
}