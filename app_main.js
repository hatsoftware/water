function start_app(){  
  JBE_MOBILE=true;  
  if(window.outerWidth > 500){
    JBE_MOBILE=false;    
    document.getElementById('div_header').style.display='none';
    document.getElementById('div_footer').style.display='none';    
    //document.getElementById('bar_avatar').src='./gfx/icon-192x192.png';    
    document.getElementById('page_main').innerHTML='This App runs in mobile platform only.';    
    return;    
  }  

  getAllDataFromIDX();
  init_app();  
  showMainPage(); 
  // Page is loaded
  const objects = document.getElementsByClassName('asyncImage');
  Array.from(objects).map((item) => {
    // Start loading image
    const img = new Image();
    img.src = item.dataset.src;
    // Once image is loaded replace the src of the HTML element
    img.onload = () => {
      item.classList.remove('asyncImage');
      return item.nodeName === 'IMG' ? 
        item.src = item.dataset.src :        
        item.style.backgroundImage = `url(${item.dataset.src})`;
    };
  }); 
}

function init_app(){
  //if(CURR_METERNO=='NONE' || CURR_METERNO=='' || CURR_METERNO==null) {       
  document.getElementById('logger').style.color='navy';
  //alert(CURR_USERNAME);
  if(!CURR_USER) {       
    document.getElementById('logger').innerHTML="Please Log In";
    document.getElementById('theReader').innerHTML='-';
  }else{
    document.getElementById('logger').innerHTML='Date: '+sysDate+'  Time: '+sysTime;
    //if(CURR_USERNAME==undefined){ CURR_USERNAME='x'; }
    //alert('CURR_USERNAME '+CURR_USERNAME);
    document.getElementById('theReader').innerHTML=CURR_USERNAME;
  }
}


function myResizeFunction(){    
  //var H_BAR=parseInt(document.getElementById('div_bar').style.height);  
  var H_BAR=30;
  
  H_HEADER=parseInt(document.getElementById('div_header').style.height);  
  H_FOOTER=parseInt(document.getElementById('div_footer').style.height);
  
  H_WRAPPER=window.innerHeight;
  H_BODY=window.innerHeight - (H_FOOTER);
  H_PAGE=window.innerHeight - (H_FOOTER);
  H_VIEW=window.innerHeight - (H_FOOTER);
  H_VIEW_DTL=window.innerHeight - (H_FOOTER+H_BAR+0);
 
  //document.getElementById('wrapper').style.height=(window.innerHeight)+'px';
  
  document.querySelectorAll('.page_class').forEach(function(el) {    
    el.style.height=H_BODY+'px';    
    //el.style.backgroundColor='blue';
  });

  document.querySelectorAll('.myView').forEach(function(el) {
    el.style.height=H_VIEW+'px';
    //el.style.width=(px_right+scrollWidth)+'px';
    el.style.width='100%';
    //el.style.backgroundColor='red';
    //el.style.border='2px solid green';
  });
   
  document.querySelectorAll('.myView_dtl').forEach(function(el) {    
    el.style.height=H_VIEW_DTL+'px';    
    //el.style.border='1px solid yellow';
    el.style.width='100%';
  });
  
  document.getElementById('user_main').style.height=window.innerHeight - (H_FOOTER+H_HEADER)+'px';  

  document.getElementById('mySidenav').style.marginTop=(H_HEADER-25)+'px';
  //document.getElementById('mySidenav').style.height=H_WRAPPER+50+'px';
  document.getElementById('mySidenav').style.height=(H_BODY+10)+'px';

  document.getElementById('page_meter').style.height=H_BODY+'px';
  //document.getElementById('page_dtl_meter').style.height=(H_BODY-40)+'px';

  //alert('user main height: '+document.getElementById('user_main').style.height);
  //document.getElementById('mySidenav').style.height=(window.innerHeight-H_HEADER)+'px';
  //document.getElementById('mySidenav').style.top=H_HEADER+'px';

  if(window.outerWidth > 500){
    JBE_MOBILE=false;
  }else{
    JBE_MOBILE=true;
  }  
  document.getElementById('div_header').style.display='block';
  document.getElementById('div_footer').style.display='block';
}

function showMenu(m){
  document.querySelectorAll('.menu_class').forEach(function(el) {
    el.style.display = 'none';
  });
  document.getElementById(m).style.display='block';        
}
function openPage(m){
  document.querySelectorAll('.page_class').forEach(function(el) {
    //alert(el.id);
    el.style.display = 'none';
  });
  document.getElementById(m).style.display='block';        
}

function loadDoc(div,fle) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(div).innerHTML = this.responseText;      
      }
    };
  xhttp.open("GET", fle, true);
  xhttp.send();
}




function jnumber(n){  
  return n.replace(/,/g, '');  
}

function nopath(p){
  var retval=p.substr(p.lastIndexOf('/')+1);
  return retval;
}

function je_msg_color(fg,bg){
  document.getElementById('modal-header').style.backgroundColor=bg;
  document.getElementById('modal-footer').style.backgroundColor=bg;
  document.getElementById('modal-body').style.backgroundColor=fg;
}

function openBox(div,title,dtl,xclose) {     
  var x=document.getElementById("myBox_main").getAttribute('data-open');   
  document.getElementById("myBox_main").setAttribute('data-close',xclose); 
  document.getElementById("myBox").style.height = H_BODY+'px';       
  document.getElementById("cap_box").innerHTML=title;
  document.getElementById("dtl_box").innerHTML=dtl;
  
  var h=parseInt(document.getElementById(div).style.height);
  
  var hh=h+30+12; //dtl height + box head height + paddings
         
  document.getElementById("dtl_box").style.height = (h+12)+'px';         
  
  document.getElementById("myBox_main").style.height = hh+'px';         
  document.getElementById("myBox_main").setAttribute('data-open',1);     
}

function closeBox(){  
  var xclose=document.getElementById("myBox_main").getAttribute('data-close'); 

  document.getElementById("myBox").style.height=0+'px';
  document.getElementById("myBox_main").style.height = 0+'px';       
  
  document.getElementById("myBox").style.height = "0px";       
  document.getElementById("myBox").setAttribute('data-open','0');   
  // find object
  var fn = window[xclose];
  // is object a function?
  if (typeof fn === "function") fn();
}

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}

function not_yet(){
  MSG_SHOW(vbOk,"FYI: ","This routine is still under construction.",function(){},function(){});
}


function uploadNOW(file,newName,dir,ndiv){
  //alert('file='+file+ ', newName: '+newName);
  var phpDir=dir;
  //alert(phpDir);
  var data = new FormData();  
  data.append('file', file, newName); 
  data.append('dir', phpDir); 
  var config = {}; 
  var headers = {
    'Content-Type': 'multipart/form-data'
    }
/*
  formData.append("image", imagefile.files[0]);
  axios.post(JBE_API+JBE_API+'upload_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
*/

  showProgress(true);
  axios.post(JBE_API+'z_load.php', data)
  .then(function (response) {    
    console.log(response.data[1]);
    //alert('uploadnow : '+response.data);
    showProgress(false);    
    if(response.data[0] == -1){
      MSG_SHOW(vbOk,"ERROR: Upload Failed",response.data[1],function(){},function(){return;});
      return;
    }  
    
    //var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');
    //var fn = window[clbak];
    //if (typeof fn === "function") fn();
    
    //snackBar(response.data[1]);
    if(ndiv.length != 0){ 
      for(var j=0;j<ndiv.length;j++){
        RefreshImage(phpDir,newName,ndiv[j]['div']); 
      }
    }
    
  })  
  .catch(function (err) {    
    console.log(err.message);
    showProgress(false);
    MSG_SHOW(vbOk,"ERROR: Upload Failed",err.message,function(){},function(){return;});
  });  
}

function RefreshImage(dir,newName,ndiv){    
  var n = new Date().toLocaleTimeString('it-IT');
  let targ=dir+newName+'?'+n;
  //alert("target "+targ);
  document.getElementById(ndiv).src=targ;
}

function ZOOM_IMG(vImg){  
  document.getElementById('div_msg_items').style.display='none';
  document.getElementById('msg_zoom').style.display='block';
  document.getElementById('msg_zoom_img').src=vImg;
  document.getElementById('fm_msg').style.pointerEvents='none';
}
function ZOOM_CLOSE(){  
  document.getElementById('msg_zoom').style.display='none';
  document.getElementById('div_msg_items').style.display='block';
  document.getElementById('fm_msg').style.pointerEvents='auto';
}

function fm_download_data(){ 
  if(!CURR_USER){
    //showLogin();
    //return;
  }  
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  var dtl=
    '<div id="download_box" data-mode=0 style="width:100%;height:100%;font-size:18px;text-align:center;padding:5px;border:0px solid lightgray;background:white;">'+  

      '<div style="width:100%;height:15%;font-size:22px;font-weight:bold;padding:6% 0 0 0;background:none;">'+
        '<div>Download Data</div>'+
        '<div style="font-size:14px;color:navy;">'+JBE_API+'</div>'+      
      '</div>'+
      
      '<div style="width:100%;height:70%;padding:5%;border:0px solid darkgray;background:none;">'+  
        '<div style="width:80%;height:100px;margin:10%;padding:10px;border-radius:5px;border:1px solid darkgray;background:none;">'+  
          '<div style="width:100%;height:30%;font-weight:bold;padding:2px 0 0 0;background:none;">Files to be Downloaded</div>'+      
          '<div id="div_dd1" style="width:100%;height:70%;padding:7px 0 0 0;background:none;"></div>'+        
        '</div>'+

        '<div style="width:80%;height:100px;margin:10%;padding:10px;border-radius:5px;border:1px solid darkgray;background:none;">'+  
          '<div style="width:100%;height:30%;font-weight:bold;padding:2px 0 0 0;background:none;">Current Data</div>'+      
          '<div id="div_dd2" style="width:100%;height:70%;padding:7px 0 0 0;background:none;"></div>'+        
        '</div>'+
      '</div>'+
      
      '<div style="width:100%;height:15%;padding:3% 0 0 0;text-align:center;background:none;">'+
        '<input id="btn_download" type="button" onclick="download_data()" class="color_head" style="width:80%;height:50px;border-radius:8px;font-size:18px;" value="Download Now" />'+
      '</div>'+
    '</div>';

  JBE_OPEN_VIEW(dtl,'Download Facility','close_fm_download_data');
  //document.getElementById('cap_myView1').innerHTML='Download Main Data';

  DB_CONSUMER=[]; DB_METER=[];  DB_USER=[]; DB_SYSFILE=[];
  //alert('app main: '+JBE_API);
  showProgress(true);
  axios.post(JBE_API+'z_tanan.php', { request: 0, meterno: CURR_METERNO },JBE_HEADER)     
  .then(function (response) { console.log(response.data);        
    DB_METER = response.data[0];  
    DB_CONSUMER = response.data[1];    
    DB_USER = response.data[2]; 
    DB_SYSFILE = response.data[3]; 

    JBE_ONLINE=true;
    document.getElementById('logger').style.color='navy';
    document.getElementById('logger').innerHTML='Date: '+sysDate+' &nbsp;&nbsp;&nbsp;Time: '+sysTime;

    dtl=
      '<div style="width:100%;height:100%;background:none;">'+
        '<div style="width:100%;height:20px;">Meter File : '+DB_METER.length+'</div>'+
        '<div style="width:100%;height:20px;">Consumer File : '+DB_CONSUMER.length+'</div>'+        
      '</div>';
    document.getElementById('div_dd1').innerHTML=dtl;

    dtl=
      '<div style="width:100%;height:100%;background:none;">'+
        '<div style="width:100%;height:20px;">Meter File : '+iDB_METER.length+'</div>'+
        '<div style="width:100%;height:20px;">Consumer File : '+iDB_CONSUMER.length+'</div>'+        
      '</div>';
    document.getElementById('div_dd2').innerHTML=dtl;
    showProgress(false);
    console.log('DB HERE...');
    //getAllDataFromIDX();
  })    
  .catch(function (error) { 
    JBE_ONLINE=false;
    console.log(error); 
    showProgress(false);
    document.getElementById('btn_download').disabled=true;
    MSG_SHOW(vbOk,"ERROR: ",error,function(){},function(){});
    //getProfile_IDB();
  });

}

function close_fm_download_data(){
  var vmode=document.getElementById('download_box').getAttribute('data-mode');
  //alert(vmode);
  showMainPage();
}

function download_data() {  
  DB_CONSUMER=[]; DB_METER=[];
  DB_UPLOAD=[];  
  clearStore('Meter');
  clearStore('Consumer');
  clearStore('User');
  clearStore('TranMeter');
  clearStore('Sysfile');
  //alert(JBE_API);
  axios.post(JBE_API+'z_tanan.php', { request: 0, meterno: CURR_METERNO },JBE_HEADER)     
  .then(function (response) { console.log(response.data);        

    DB_METER = response.data[0];  
    DB_CONSUMER = response.data[1];    
    DB_USER = response.data[2];    
    DB_SYSFILE = response.data[3];    
    
    document.getElementById('logger').style.color='navy';
    document.getElementById('logger').innerHTML='Date: '+sysDate+' &nbsp;&nbsp;&nbsp;Time: '+sysTime;

    //clearStore('Meter');clearStore('Consumer');
    saveDataToIDX(DB_METER,0);
    saveDataToIDX(DB_CONSUMER,1);
    saveDataToIDX(DB_USER,2);
    saveDataToIDX(DB_SYSFILE,3);
    
    DB_CONSUMER=[];
    DB_METER=[];
    DB_USER=[];   
    console.log('Data Downloaded...');
    getAllDataFromIDX();
    MSG_SHOW(vbOk,"Download Successful :","Download Successful.",function(){ JBE_CLOSE_VIEW(); },function(){});
  })    
  .catch(function (error) { 
    JBE_ONLINE=false;
    console.log(error); 
    //showOffline();
    snackBar(error);
    //getProfile_IDB();
  });  
}