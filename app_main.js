function get_app_db(){
  if(!CURR_METERNO){ return; }
  DB_CONSUMER=[]; DB_METER=[];
  axios.post(JBE_API+'z_tanan.php', { request: 0, meterno: CURR_METERNO })     
  .then(function (response) { console.log(response.data);        

    DB_METER = response.data[0];  
    DB_CONSUMER = response.data[1];    

    JBE_ONLINE=true;
    document.getElementById('logger').style.color='navy';
    document.getElementById('logger').innerHTML='Date: '+sysDate+'  Time: '+sysTime;
    
    //showUnreadMsg();
    /*
    CURR2_COMMUNITY=JBE_GETFLD('community',DB_PROJ,'PROJCODE',CURR_METERNO);  
    CURR2_METERS=parseInt(JBE_GETFLD('ctr_meter',DB_PROJ,'PROJCODE',CURR_METERNO));  
    CURR2_STATUS=parseInt(JBE_GETFLD('stat',DB_PROJ,'PROJCODE',CURR_METERNO));  
    CURR2_COLLECTION=parseFloat(JBE_GETFLD('collection',DB_PROJ,'PROJCODE',CURR_METERNO));
    CURR2_DATE_DOWN=JBE_GETFLD('date_down',DB_PROJ,'PROJCODE',CURR_METERNO);  
    CURR2_DATE_EXP=JBE_GETFLD('date_exp',DB_PROJ,'PROJCODE',CURR_METERNO);  
    CURR2_REPAIRS=JBE_GETFLD('repair',DB_PROJ,'PROJCODE',CURR_METERNO);     
    saveProfile_IDB();      
    */
  })    
  .catch(function (error) { 
    JBE_ONLINE=false;
    console.log(error); 
    showOffline();
    getProfile_IDB();
  });
}

function myResizeFunction(){       
  var screen_width=window.outerWidth;
  var H_HEADER=parseInt(document.getElementById('div_header').style.height);  
  var H_FOOTER=parseInt(document.getElementById('div_footer').style.height);
  H_WRAPPER=window.innerHeight - (H_HEADER+H_FOOTER);
  H_BODY=window.innerHeight - H_FOOTER;

  document.getElementById('page_main').style.height=H_BODY+'px';
  document.getElementById('user_main').style.height=H_WRAPPER+'px';
  //document.getElementById('um_1').style.height='90%';
  //document.getElementById('um_ver').style.height='10%';
  //document.getElementById('um_ver').innerHTML='Version '+JBE2_VER;
  //document.getElementById('um_2').style.height='100%';
  //document.getElementById('div_cam').style.backgroundColor=JBE2_CLOR;

  document.getElementById('mySidenav').style.marginTop=(H_HEADER-25)+'px';
  document.getElementById('mySidenav').style.height=H_WRAPPER+25+'px';
/*
  document.getElementById('page_video').style.height=H_BODY+'px';
  document.getElementById('page_dtl_video').style.height=(H_BODY-40)+'px';
  document.getElementById('page_zoom_video').style.height=(H_BODY-40)+'px';
*/

  document.getElementById('page_meter').style.height=H_BODY+'px';
  document.getElementById('page_dtl_meter').style.height=(H_BODY-40)+'px';

  document.getElementById('page_setting').style.height=H_BODY+'px';
  document.getElementById('page_dtl_setting').style.height=(H_BODY-40)+'px';
    
  document.getElementById('page_ocr').style.height=H_BODY+'px';
  document.getElementById('page_dtl_ocr').style.height=(H_BODY-65+30)+'px';

  document.getElementById('page_map').style.height=H_BODY+'px';
  //document.getElementById('page_dtl_map').style.height=(H_BODY-65+30)+'px';

  document.getElementById('page_profile').style.height=H_BODY+'px';
  document.getElementById('page_dtl_profile').style.height=(H_BODY-40)+'px';

  document.getElementById('page_chat').style.height=H_BODY+'px';
  document.getElementById('page_dtl_chat').style.height=(H_BODY-35)+'px';
  document.getElementById('div_chat').style.height=(H_BODY-(40+30+2))+'px';

  //document.getElementById('div_comm').style.color=JBE2_CLOR;
  
  if(screen_width > 500){
    JBE_MOBILE=false;
    /*
    document.getElementById('div_header').style.display='none';
    document.getElementById('div_footer').style.display='none';
    document.getElementById('div_cam').style.display='none';
    document.getElementById('center_btns').style.display='none';
    document.getElementById('div_comm').innerHTML='This App runs in mobile platform only.';    
    */
  }else{
    JBE_MOBILE=true;
    /*
    document.getElementById('div_header').style.display='block';
    document.getElementById('div_footer').style.display='block';
    document.getElementById('div_cam').style.display='none';
    */
    //document.getElementById('div_comm').innerHTML="the quick brown fox jumps over the lazy dog."
  }  
  document.getElementById('div_header').style.display='block';
  document.getElementById('div_footer').style.display='block';
  //document.getElementById('div_cam').style.display='none';
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

function snackBar(s) {
  if(s==''){ return; }
  var x = document.getElementById("snackbar");    
  x.innerHTML=s;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
/*
function jformatNumber(num) {
  num=Number(num);  
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function jformatNumber2(xnum) {
  num=Number(xnum);
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
*/
function jformatNumber(xnum) {
  var num=Math.round(xnum,0);
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function jformatNumber2(xnum) {
  var num=Math.round(xnum,2);
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function jeffNumber(mode,div) {  
  var vv = document.getElementById(div).value;
  var v = vv.replace(/,/g, '');
  //var res = str.replace(/,/g, ".");
  
  if(mode==1) {
    v=parseInt(v);
    var rval = jformatNumber(v);
  } else if(mode==2) {
    v=parseFloat(v);
    rval=jformatNumber2(v);
  }
  
  document.getElementById(div).value=rval;
  return;
}

function isNumberKey(evt,div){    
  var charCode = (evt.which) ? evt.which : event.keyCode
  //var inputValue = $("#"+div).val();
  var inputValue = document.getElementById(div).value;
  if (charCode == 46){        
      var count = (inputValue.match(/'.'/g) || []).length;
      if(count<1){
        if (inputValue.indexOf('.') < 1){
          if (inputValue.charAt(0) == '.') return false;
            return true;
        }
        return false;
      }else{
        return false;
      }
  }
  
  if (charCode == 45) {      
    var xcount = (inputValue.match(/'-'/g) || []).length;      
    if(xcount<1){        
      if (inputValue.indexOf('-') < 1){                      
        if (inputValue.charAt(0) == '-') return false;
        //if (getCursorPosition(inputValue) != 0) return false;
        return true;
      }
    }else{
      //alert(888);
      return false;
    }
    
    //if (currentValue.charAt(0) == '-') return false;
    //if (getCursorPosition(this) != 0) return false;
  } 

  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)){
      return false;
  }
  return true;
}  

function jnumber(n){  
  return n.replace(/,/g, '');  
}

function nopath(p){
  var retval=p.substr(p.lastIndexOf('/')+1);
  return retval;
}

function jonline(level){        
  return;
  if(level==1){
    JBE_ONLINE=navigator.onLine;    
    return JBE_ONLINE;
  }
  var d = new Date();
  var n = d.getTime();
  //var url = "https://updeskapp1.000webhostapp.com/";
  var url = "https://aidfimonitoring.com/";
  var newImg = new Image;
  newImg.src = url+'gfx/logo.png'+'?'+n;
  //newImg.src = url+'gfx/admin.png'+'?'+n;
  console.log("Checking " + url);
  
  //JBE_ONLINE=false;
  newImg.onload = function(){
      console.log(this.width);
      if (newImg.height == 300) {
          //alert("YES Online!");    
          JBE_ONLINE=true;
          /*
          if(navigator.onLine) {
            JBE_ONLINE=true;
            console.log("perfect true...");
            return true;
          }else{
            JBE_ONLINE=false;
            console.log("sorry not perfect...");
            return false;
          }
          */
          return JBE_ONLINE;
      } else {
          //alert("NOT ONLINE");
          JBE_ONLINE=false;            
          return JBE_ONLINE;
      }
  }
  //return false;
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

function xxxopenView(m,dtl) { 
  if(m==1){
    document.getElementById('div_header').style.display='none';
    //document.getElementById('div_body').style.display='none';  
  }else{
    for(var i=1;i<=m;i++){        
      document.getElementById('myView'+i).style.display='none'; 
    }    
  }
  document.getElementById("myView"+m).style.display='block';
  var jpad=20;
  document.getElementById("dtl_myView"+m).style.height = H_BODY-(30+jpad)+'px';    
  document.getElementById("myView"+m).style.height =H_BODY+'px'; 
  document.getElementById("dtl_myView"+m).innerHTML=dtl;  
}
function xxxcloseView(m){
  var xclose=document.getElementById("myBox_main").getAttribute('data-close');
  document.getElementById("myView"+m).setAttribute('data-open','0');
  document.getElementById("myView"+m).style.display='none';
  // find object
  var fn = window[xclose];
  // is object a function?
  if (typeof fn === "function") fn();
}

function openView(m,dtl,xclose) {  
  var jpad=20;
  document.getElementById("myView"+m).setAttribute('data-close',xclose);
  document.getElementById("dtl_myView"+m).style.height = H_BODY-(30+jpad)+'px';    
  document.getElementById("myView"+m).style.height =H_BODY+'px'; 
  document.getElementById("dtl_myView"+m).innerHTML=dtl;  
  openPage('myView'+m);
}

function closeView(m){
  var xclose=document.getElementById("myView"+m).getAttribute('data-close');
  document.getElementById("myView"+m).setAttribute('data-open','0');
  document.getElementById("myView"+m).style.display='none';
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

function JBE_PICK_IMAGE(inp_file,targ_div,cb){
  //alert('i:'+inp_file+'\nt:'+targ_div);  
  //var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');
  thisFile=null;
  var real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/*"); //accept="image/*"    

  real_ImgBtn.addEventListener("change", function() {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=event.target.files[0].size;
      reader.onload = function(){
        if(imgSize > 6000000){
          MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
          return;
        }
        var output = document.getElementById(targ_div);
        output.src = reader.result;
        var fn = window[cb];
      if (typeof fn === "function") fn(reader.result);
        //document.getElementById('tmp').src=reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      thisFile=this.files[0];
      document.getElementById(targ_div).setAttribute('data-img',thisFile.name);
      real_ImgBtn.value='';      
    } 
  });
  real_ImgBtn.click();
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