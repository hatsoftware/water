var CURR2_PROC='';
var CURR2_PAGE=0;

function showMainPage(){ 
  //alert('ako main page');
  f_MainPage=true;
  document.getElementById("myView1").setAttribute('data-JBEpage',0); //reset openview page to 0
  if(f_reload){
    snackBar('Press Back key to Exit');    
    //alert('Press Back key to Exit');    
    f_reload=false;
  }
  //allow_start(true);
  //document.getElementById('div_nobar').style.display='none';
  
  openPage('page_main');  
  //showMenu('mnu_main'); 
  var vmenu='mnu_main';  
  showMenu(vmenu);
  //getNewMsg();  
  console.log('mainpage '+f_MainPage);
}

function showLogin(){  
  var dtl=      
    '<div id="login" data-zoom=0 data-close="0" style="width:100%;height:150px;text-align:center;background-color:none;">'+      
      
      '<input id="vuserid" type="text" style="width:100%;height:30px;margin-top:15px;text-align:center;" placeholder="User ID" value="" />'+
  
      '<input id="vpword" type="password" style="width:100%;height:30px;margin-top:15px;text-align:center;" placeholder="Password" value="" />'+

      '<input type="button" onclick="chk_password(vuserid.value,vpword.value)" class="color_head" style="text-align:center;width:45%;height:30px;margin-top:10px;" value="Log In" />'+
      
    '</div>';  
  var dtl2=      
    '<div style="width:100%;height:30px;padding:10px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      'Password Facility'+      
    '</div>';   
  JBE_OPENBOX('login','Log In',dtl,dtl2); 
}

function chk_password(u,p){ 
  //alert('checking : '+u+' pass: '+p);
  p=p.toUpperCase();
  DB_USER=[]; 
  axios.post(JBE_API+'z_user.php', { request:1, uid:u, pword:p }) 
  .then(function (response) { 
    console.log(response.data);     
    DB_USER=response.data; 
    if(response.data == "NONE"){          
      MSG_SHOW(vbOk,"ACCESS DENIED","User Not Registered.<br>Ask the assistance of your Admin.",function(){ JBE_CLOSEBOX(); },function(){});
      return;
    }else{
      CURR_USER=p;
      CURR_USERID=u;
      CURR_USERNAME=DB_USER[0]["username"];      
      CURR_AXTYPE=parseInt(DB_USER[0]["axtype"]);      
      createCookie(CURR_CLIENT+'_userid',CURR_USERID,1);
      createCookie(CURR_CLIENT+'_pword',CURR_USER,1);    
      createCookie(CURR_CLIENT+'_username',CURR_USERNAME,1);    
      createCookie(CURR_CLIENT+'_axtype',CURR_AXTYPE,1);    
      //saveProfile_IDB();   
      init_app();
      JBE_CLOSEBOX();
    }    
  })
  .catch(function (error) { 
    console.log(error); 
    snackBar('No Network...');
  }); 
}

function logout(){
  CURR_USER='';
  CURR_USERID='';
  CURR_USERNAME='';      
  CURR_AXTYPE=0;      
  createCookie(CURR_CLIENT+'_userid',CURR_USERID,1);
  createCookie(CURR_CLIENT+'_pword',CURR_USER,1);    
  createCookie(CURR_CLIENT+'_username',CURR_USERNAME,1);    
  createCookie(CURR_CLIENT+'_axtype',CURR_AXTYPE,1);    
  init_app();
}

function fm_refresh(){
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

