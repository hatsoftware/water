var CURR2_PROC='';
var CURR2_PAGE=0;

function showMainPage(){   
  JBE_ONLINE_NAVI=navigator.onLine;    
  JBE_ONLINE=false;   
  //****************
  JBE_ONLINE_NAVI=true;
  //**************** 
  f_MainPage=true;
  if(f_reload && JBE_MOBILE){
    snackBar('Press Back key to Exit');
    f_reload=false;
  }
  console.log('mainpage '+f_MainPage);
  openPage('page_main');

  document.getElementById('page_main').style.display='block';   
  //document.getElementById('div_comm').style.color=JBE2_CLOR;

  if(!CURR_METERNO){
    //document.getElementById('div_cam').style.display='none';
    if(JBE_MOBILE) { snackBar('Please Log In...'); }
  }
  
  axios.post(JBE_API+'z_online.php',JBE_HEADER)  
    .then(function (response) {
      var res=parseInt(response.data);
      //alert('z_online:  '+res);    
       if(res > 0 && JBE_ONLINE_NAVI){       
         JBE_ONLINE=true; 
         get_app_db();
         init_app(); 
       }else{
          showOffline();
        }           
    })
    .catch(function (error) { 
      //alert('naunsa na! '+error);
      snackBar('ERROR: '+error);
      if (!error.response) {
        // network error (server is down or no internet)
        console.log('JBE Found: network error (server is down or no internet)');
      } else {
        // http status code
        const code = error.response.status;
        // data from server while error
        const response = error.response.data;
        //console.log(code+' vs '+response);
        MSG_SHOW(vbOk,"INTERNAL ERROR:","CODE:"+code+". Server Response: "+response+". <br>Please Refresh.",function(){},function(){}); 
      }
      showOffline();          
    }); 
  
  showMenu('mnu_main'); 
}

function showHomePage(){
  get_app_db();
  init_app();
  showMainPage();
}


function doValidate(){
  var rval=true;
  if(CURR_METERNO==null){
    rval=false;
  }  
  return rval;
}

function showLogin(){
  var dtl=
  '<div id="login" style="width:100%;height:150px;font-size:14px;text-align:center;padding:5px;background:white;">'+
    '<div style="width:100%;height:20%;font-size:20px;padding:5px;background:none;">Enter Project Code</div>'+
    '<input id="vprojcode" type="password" style="width:100%;height:30%;margin-top:15px;text-align:center;" value="" />'+
    '<input type="button" onclick="chk_projcode(vprojcode.value)" style="float:left;width:45%;height:30%;margin-top:10px;" value="Log In" />'+
    '<input type="button" onclick="closeBox();" style="float:right;width:45%;height:30%;margin-top:10px;" value="Log Out" />'+
  '</div>';
  openBox('login','Log In',dtl,'closeLogin');
}
function closeLogin(){    
  //showMainPage();
  return;
}

function chk_projcode(v){ 
  //alert('checking : '+v);
  v=v.toUpperCase();
  DB_PROJ=[]; 
  axios.post(JBE_API+'z_user.php', { request: 1, projcode: v }) 
  .then(function (response) { 
    console.log(response.data);     
    DB_PROJ=response.data; 
    if(response.data == "NONE"){          
      MSG_SHOW(vbOk,"ERROR: Can't Access the Site.","Ask the assistance of your Team Leader for the Project Code.",function(){ closeBox(); },function(){});
      return;
    }else{
      CURR_METERNO=v
      CURR2_COMMUNITY=DB_PROJ[0]["community"];
      CURR2_METERS=parseInt(DB_PROJ[0]["ctr_meter"]);
      CURR2_STATUS=parseInt(DB_PROJ[0]["stat"]);
      CURR2_DATE_DOWN=DB_PROJ[0]["date_down"];
      CURR2_DATE_EXP=DB_PROJ[0]["date_exp"];
      CURR2_REPAIRS=DB_PROJ[0]["repair"];
      CURR2_REPDATE=DB_PROJ[0]["repdate"];
      
      createCookie('cookie_proj',CURR_METERNO,1);
      createCookie('cok_community',CURR2_COMMUNITY,1);    
      createCookie('cok_meters',CURR2_METERS,1);    
      createCookie('cok_status',CURR2_STATUS,1);    
      createCookie('cok_downed',CURR2_DATE_DOWN,1);    
      createCookie('cok_exp_date',CURR2_DATE_EXP,1);    
      createCookie('cok_repairs',CURR2_REPAIRS,1);    
      createCookie('cok_repdate',CURR2_REPDATE,1);    
      //document.getElementById('div_comm').innerHTML=DB_PROJ[0]["community"];     
      saveProfile_IDB();   
      init_app();
      closeBox();       
    }
    
  })
  .catch(function (error) { 
    console.log(error); 
    snackBar('No Network...');
  }); 
}

function fm_refresh(){
  //chk_projcode(CURR_METERNO);  
  //snackBar('System Refreshed...');
  showLogin();
}

/*
      '<div style="width:100%;height:60%;padding:5px;background:yellow;">'+
        '<div id="nose" style="margin:0;width:100%;height:100%;padding:5px;overflow:auto;background:violet;">'+
                  
        '</div>'+
      '</div>'+
      '<div id="transcription" style="margin:0;margin-top:2%;width:100%;height:28.5%;padding:5px;overflow:auto;background:pink;">'+
      '</div>'+
    */

function xfm_ocr(){
  var dtl=
  '<div style="width:100%;height:100%;padding:5px;background:green;">'+
    
    '<div id="d1" style="margin-top:0px;width:100%;height:10%;padding:5px;background:pink;">'+
      '<input type="file" onchange="load_file()" id="picker" style="width:100%;height:100%;background:lightblue;" />'+
    '</div>'+
    
    '<div style="margin-top:2%;width:100%;height:67%;padding:5px;text-align:center;overflow:auto;background:violet;">'+
      '<img id="nose" style="width:auto;max-width:100%;height:100%;padding:5px;overflow:auto;background:violet;" />'+
    '</div>'+    
    
    '<div id="transcription" style="margin-top:2%;width:100%;height:20%;padding:5px;overflow:auto;background:pink;">'+

    '</div>'+    
    
  '</div>';  

  openView(1,dtl);      
}

function load_file () {
  var reader = new FileReader();
  reader.onload = function(){
    var img = new Image();
    img.src = reader.result;
    //alert(img.src);
    img.onload = function(){
      //document.getElementById('xnose').innerHTML = '';
      //document.getElementById('nose').appendChild(img)
      document.getElementById('nose').src=img.src;
      OCRAD(img, function(text){
        //document.getElementById('transcription').className = "done";
        document.getElementById('transcription').innerText = text;
      })
    }
  }
  reader.readAsDataURL(document.getElementById('picker').files[0]);
}

