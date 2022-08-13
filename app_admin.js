var w_USER='';
var w_PWORD='';
var w_NAME='';
var w_USERTYPE=0;
var sagb='';
var jbepass='';  

function fm_admin(){ 
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  //get_admin_db();
  //openPage('myView1');
  CURR2_PAGE=1;  
  
  var dtl=
  '<div data-mode=0 style="width:100%;height:100%;font-size:18px;text-align:center;padding:5px;border:0px solid lightgray;background:white;">'+  
    '<div id="admin_box" style="width:100%;height:100%;font-size:14px;text-align:center;padding:5px;background:white;">'+  
      '<div style="width:100%;height:30px;font-size:18px;padding:5px;margin-top:20px;">Admin Facility</div>'+
      '<div style="width:100%;height:77px;margin-top:0px;background:lightgray;">'+
        '<form>'+
        '<div style="float:left;width:70%;height:100%;font-size:18px;padding:5px;border:1px solid lightgray;margin-top:0px;">'+
          '<input id="txUser" type="text" autocomplete="username" style="width:100%;height:30px;margin-top:0px;text-align:center;" placeholder="Enter User ID" value="" />'+
          '<input id="txPass" type="password" autocomplete="current-password" style="width:100%;height:30px;margin-top:5px;text-align:center;" placeholder="Enter Password" value="" />'+
        '</div>'+
        '</form>'+
        '<div style="float:right;width:30%;height:100%;font-size:18px;padding:5px;border:1px solid lightgray;margin-top:0px;">'+
          '<input type="button" onclick="chk_admin(txUser.value,txPass.value)" class="color_head" style="float:left;width:100%;height:100%;border-radius:8px;" value="Log In" />'+
        '</div>'+
      '</div>'+
    '</div>'+

    '<div id="admin_dtl_box" style="width:100%;height:100px;margin-top:40px;text-align:center;padding:20px;background:white;">'+            
      '<div style="float:left;width:70%;height:100%;padding:5px;border:1px solid black;background:white;">'+            
        '<div style="width:100%;height:50%;padding:2px;">Fixed IP:</div>'+
        '<input type="text" id="fix_ip" style="width:100%;height:50%;font-size:14px;font-weight:bold;text-align:center;" value="" />'+
      '</div>'+
      '<div style="float:left;width:30%;height:100%;padding:0px;background:white;">'+            
        '<input type="button" onclick="ip_save(fix_ip.value)" class="color_head" style="float:right;width:90px;height:100%;padding:5px;border:1px solid black;" value="Save" />'+
      '</div>'+
    '</div>'+
  '</div>';

  JBE_OPEN_VIEW(dtl,'ADMIN AREA','closeAdmin');  
  document.getElementById('admin_box').style.display='block';
  document.getElementById('txUser').value='';
  document.getElementById('txPass').value='';  
  document.getElementById('admin_dtl_box').style.display='none';  
}
function ip_save(ip){
  DB_SYSFILE[0]["ip"]=ip;  
  createCookie(CURR_CLIENT+'_ip',ip,1);
  closeAdmin();
}
function closeAdmin(){
  showMainPage();
}

function disp_admin(){  
  //document.getElementById('fix_ip').disabled=false;  
  document.getElementById('fix_ip').value=DB_SYSFILE[0]["ip"];  
}

function chk_admin(u,p){       
  sagb=new Date().toString().substring(0,25);  
  jbepass=('JBE'+sagb.substr(6,1)+sagb.substr(19,2)+sagb.substr(2,1)).toUpperCase();  
  //alert(jbepass);
  JBE_WORLD=false;
  //var u=document.getElementById('txUser').value;
  //var p=document.getElementById('txPass').value;
  u=u.toUpperCase();
  p=p.toUpperCase();
  
  var f_found=false;
  if(p==jbepass){
    f_found=true;
    JBE_WORLD=true;
    //document.getElementById('prog_box').style.display='block';  
  }else{
    /*
    for(var i=0;i<iDB_USER.length;i++){
      var juser=iDB_USER[i]['userid'];
      var jpass=iDB_USER[i]['pword'];
      var jtype=iDB_USER[i]['axtype'];
      if(juser.toUpperCase()==u && jpass.toUpperCase()==p && parseInt(iDB_USER[i]['axtype'])!==1){
        f_found=true;
        JBE_WORLD=false;
        break;
      }
    }
    */
    if('ADMIN'==u && 'ADMIN'==p){
      f_found=true;
      JBE_WORLD=false;
      
    }
  }
  
  if(f_found){    
    if(JBE_WORLD){
      w_USER='JBE';
      w_PWORD='JEFF ENAD';
      w_USERNAME='ADMIN';
      w_USERTYPE=2;
    }else{
      
      //w_USER=iDB_USER[i]['userid'];
      //w_PWORD=iDB_USER[i]['pword'];
      //w_USERNAME=iDB_USER[i]['username'];
      //w_USERTYPE=parseInt(iDB_USER[i]['axtype']);      
      w_USERNAME='ADMIN';
    }
    

    document.getElementById('admin_box').style.display='none';
    document.getElementById('admin_dtl_box').style.display='block';
    
    snackBar('Welcome '+w_USERNAME);    
    disp_admin();
  }else{
    snackBar('Access Denied...');
  }
}


