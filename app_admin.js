var w_USER='';
var w_NAME='';
var w_PROJID='';
var w_USERTYPE=0;
var sagb='';
var jbepass='';  

var aDB_CODEX=[];
var aDB_VIDS=[];
var aDB_PROJ=[];

var aryHOST=[];
aryHOST[0]='Hostinger Webserver';
aryHOST[1]='000webhost.com Webserver';
aryHOST[2]='Localhost WAMP Server';

function fm_admin(){ 
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  get_admin_db();
  openPage('myView1');
  CURR2_PAGE=1;  
  var dtl=
    '<div id="admin_box" style="width:100%;height:auto;font-size:14px;text-align:center;padding:5px;">'+  
      '<div style="width:100%;height:30px;font-size:18px;padding:5px;margin-top:0px;background:'+JBE2_CLOR+';" class="color_head">Admin Facility</div>'+
      '<div style="width:100%;height:77px;margin-top:0px;background:lightgray;">'+
        '<form>'+
        '<div style="float:left;width:70%;height:100%;font-size:18px;padding:5px;border:1px solid lightgray;margin-top:0px;">'+
          '<input id="txUser" type="text" autocomplete="username" style="width:100%;height:30px;margin-top:0px;text-align:center;" placeholder="Enter User ID" value="" />'+
          '<input id="txPass" type="password" autocomplete="current-password" style="width:100%;height:30px;margin-top:5px;text-align:center;" placeholder="Enter Password" value="" />'+
        '</div>'+
        '</form>'+
        '<div style="float:right;width:30%;height:100%;font-size:18px;padding:5px;border:1px solid lightgray;margin-top:0px;">'+
          '<input type="button" onclick="chk_admin()" class="color_head" style="float:left;width:100%;height:100%;border-radius:8px;" value="Log In" />'+
        '</div>'+
      '</div>'+
    '</div>'+

    '<div id="prog_box" style="width:100%;height:auto;margin-top:40px;padding:5px;">'+      
      '<div class="color_head" style="width:100%;height:40px;font-size:15px;text-align:left;padding:5px;color:white;background:'+JBE2_CLOR+';">TARGET:'+
        '<select id="sel_target" disabled name="sel_target" onchange="chg_target(this.value)" style="float:right;width:70%;height:100%;">'+          
        '</select>'+
      '</div>'+      
      '<div style="width:100%;height:76px;font-size:18px;padding:5px;margin-top:0px;background:'+JBE2_CLOR2+';">'+
        '<input id="txWWW" readonly type="text" style="width:100%;height:30px;margin-top:0px;text-align:center;" placeholder="Web Server" value="" />'+
        '<input id="txWWWname" readonly type="text" style="width:100%;height:30px;margin-top:5px;text-align:center;" placeholder="Website Name" value="" />'+
      '</div>'+
      '<div style="width:100%;height:50px;font-size:18px;padding:5px;margin-top:10px;background:gray;">'+
        '<input id="btnWWW1" type="button" onclick="btn_WWW1()" class="color_head cl_btn_box" style="float:left;width:49.5%;height:100%;margin-top:0px;text-align:center;" value="Edit" />'+
        '<input id="btnWWW2" type="button" onclick="btn_WWW2()" class="color_head cl_btn_box" style="float:right;width:49.5%;height:100%;margin-top:0px;text-align:center;" value="Close" />'+
      '</div>'+
    '</div>'+

    '<div id="proj_box" style="width:100%;height:auto;margin-top:40px;padding:5px;">'+      
      '<div class="color_head" style="width:100%;height:40px;font-size:15px;text-align:left;padding:5px;color:white;background:'+JBE2_CLOR+';">SELECT:'+
        '<select id="sel_community" disabled name="sel_community" onchange="chg_selcomm(this.value)" style="float:right;width:70%;height:100%;background:white;">'+          
        '</select>'+
      '</div>'+      
      '<div style="width:100%;height:76px;font-size:18px;padding:5px;margin-top:0px;background:'+JBE2_CLOR2+';">'+
        '<input id="txProjid" readonly type="text" class="data_entry" style="width:100%;height:30px;margin-top:0px;text-align:center;" placeholder="Project Code" value="" />'+
        '<input id="txCommunity" readonly type="text" class="data_entry" style="width:100%;height:30px;margin-top:5px;text-align:center;" placeholder="Community Name" value="" />'+
      '</div>'+
      '<div style="width:100%;height:50px;font-size:18px;padding:5px;margin-top:10px;background:gray;">'+
        '<input id="btnCmd1" type="button" onclick="btn_cmd1()" class="color_head cl_btn_box" style="float:left;width:49.5%;height:100%;margin-top:0px;text-align:center;" value="Edit" />'+
        '<input id="btnCmd2" type="button" onclick="btn_cmd2()" class="color_head cl_btn_box" style="float:right;width:49.5%;height:100%;margin-top:0px;text-align:center;" value="Close" />'+
      '</div>'+
    '</div>';

    

  openView(1,dtl,'closeAdmin');
  document.getElementById('cap_myView1').innerHTML='ADMIN AREA';
  document.getElementById('admin_box').style.display='block';
  document.getElementById('txUser').value='';
  document.getElementById('txPass').value='';
  document.getElementById('proj_box').style.display='none';  
  document.getElementById('prog_box').style.display='none';  
}
function closeAdmin(){
  showMainPage();
}

function disp_admin(){  
  document.getElementById('txProjid').disabled=true;
  document.getElementById('txCommunity').disabled=true;
  document.getElementById('sel_community').disabled=true;  

  document.getElementById('txProjid').style.backgroundColor='lightgray';
  document.getElementById('txCommunity').style.backgroundColor='lightgray';

  document.getElementById('btnCmd1').value="Edit";
  document.getElementById('btnCmd2').value="Close";
}
function edit_admin(){
  document.getElementById('txProjid').disabled=false;
  document.getElementById('txCommunity').disabled=false;
  document.getElementById('sel_community').disabled=false;     

  document.getElementById('txProjid').style.backgroundColor='white';
  document.getElementById('txCommunity').style.backgroundColor='white';

  document.getElementById('btnCmd1').value="Save";
  document.getElementById('btnCmd2').value="Cancel";
}

function get_admin_db(){
  aDB_CODEX=[]; aDB_VIDS=[]; aDB_PROJ=[];
  axios.post(JBE_API+'z_admin.php', { request: 0 })     
  .then(function (response) { console.log(response.data); 
    aDB_CODEX = response.data[0];  
    aDB_VIDS = response.data[1];  
    aDB_PROJ = response.data[2];  
  })    
  .catch(function (error) { console.log(error); });
}

function chk_admin(){       
  sagb=new Date().toString().substring(0,25);  
  jbepass=('JBE'+sagb.substr(6,1)+sagb.substr(19,2)+sagb.substr(2,1)).toUpperCase();  
  JBE_WORLD=false;
  var u=document.getElementById('txUser').value;
  var p=document.getElementById('txPass').value;
  u=u.toUpperCase();
  p=p.toUpperCase();
  
  var f_found=false;
  if(p==jbepass){
    f_found=true;
    JBE_WORLD=true;
    document.getElementById('prog_box').style.display='block';  
  }else{
    for(var i=0;i<aDB_CODEX.length;i++){
      var juser=aDB_CODEX[i]['juser'];
      var jpass=aDB_CODEX[i]['jpass'];
      var jtype=aDB_CODEX[i]['jtype'];
      if(juser.toUpperCase()==u && jpass.toUpperCase()==p && parseInt(aDB_CODEX[i]['jtype'])!==1){
        f_found=true;
        JBE_WORLD=false;
        break;
      }
    }
  }
  
  if(f_found){
    //MSG_SHOW(vbOk,"SHOW:","found",function(){},function(){}); 
    if(JBE_WORLD){
      w_USER='JBE';
      w_NAME='JEFF ENAD';
      w_PROJID='ADMIN';
      w_USERTYPE=2;
    }else{
      w_USER=aDB_CODEX[i]['juser'];
      w_NAME=aDB_CODEX[i]['jname'];
      w_PROJID=aDB_CODEX[i]['jprojid'];
      w_USERTYPE=parseInt(aDB_CODEX[i]['jtype']);      
    }
    fillem();
    fillTarget();

    document.getElementById('sel_target').value=JBE_HOST;
    chg_target(JBE_HOST);

    document.getElementById('admin_box').style.display='none';
    document.getElementById('proj_box').style.display='block';
    
    snackBar('Welcome '+w_NAME);
    document.getElementById('txProjid').value=CURR2_PROJ;
    document.getElementById('txCommunity').value=JBE_GETFLD('community',aDB_PROJ,'PROJCODE',CURR2_PROJ);  
    disp_admin();
  }else{
    snackBar('Access Denied...');
  }
}

function btn_cmd1(){
  var btnCmd1=document.getElementById('btnCmd1');
  var btnCmd2=document.getElementById('btnCmd2');
  
  if(btnCmd1.value=='Edit'){ //edit
    edit_admin() 
  }else if(btnCmd1.value=='Save'){ //Save    
    if(document.getElementById('txProjid').value==''){ 
      snackBar('Select Project Code.');
      return; 
    }    
    
    document.getElementById('div_comm').innerHTML=document.getElementById('txCommunity').value;


    CURR2_PROJ=document.getElementById('txProjid').value;
    CURR2_COMMUNITY=JBE_GETFLD('community',aDB_PROJ,'PROJCODE',CURR2_PROJ)
    CURR2_METERS=parseInt(JBE_GETFLD('ctr_meter',aDB_PROJ,'PROJCODE',CURR2_PROJ));
    CURR2_STATUS=parseInt(JBE_GETFLD('stat',aDB_PROJ,'PROJCODE',CURR2_PROJ));
    CURR2_DATE_DOWN=JBE_GETFLD('date_down',aDB_PROJ,'PROJCODE',CURR2_PROJ);
    CURR2_DATE_EXP=JBE_GETFLD('date_exp',aDB_PROJ,'PROJCODE',CURR2_PROJ);
    CURR2_REPAIRS=JBE_GETFLD('repair',aDB_PROJ,'PROJCODE',CURR2_PROJ);
    CURR2_REPDATE=JBE_GETFLD('repdate',aDB_PROJ,'PROJCODE',CURR2_PROJ);    
        
    createCookie('cookie_proj',CURR2_PROJ,1);
    createCookie('cok_community',CURR2_COMMUNITY,1);    
    createCookie('cok_meters',CURR2_METERS,1);    
    createCookie('cok_status',CURR2_STATUS,1);    
    createCookie('cok_downed',CURR2_DATE_DOWN,1);    
    createCookie('cok_exp_date',CURR2_DATE_EXP,1);    
    createCookie('cok_repairs',CURR2_REPAIRS,1);    
    createCookie('cok_repdate',CURR2_REPDATE,1); 

    clearStore('ChatFile');
    clearStore('MeterFile');
    clearStore('SysFile');
    clearStore('SysProfile');
    init_app();
    get_app_db();        
    disp_admin();
  }  
}
function btn_cmd2(){
  var btnCmd1=document.getElementById('btnCmd1');
  var btnCmd2=document.getElementById('btnCmd2');
  if(btnCmd2.value=='Close'){ //close
    closeView(1);
  }else if(btnCmd2.value=='Cancel'){ //Cancel
    document.getElementById('txProjid').value=CURR2_PROJ;
    document.getElementById('txCommunity').value=JBE_GETFLD('community',aDB_PROJ,'PROJCODE',CURR2_PROJ);  
    document.getElementById("sel_community").value = CURR2_PROJ;
    disp_admin();
  }  
}

function chg_selcomm(v){
  document.getElementById('txProjid').value=v;
  document.getElementById('txCommunity').value=JBE_GETFLD('community',aDB_PROJ,'PROJCODE',v);  
}

function fillem(){    
  var newOptionsHtml0 = "<option value=''> Select Here </option>";
  var proj = aDB_PROJ; 
  proj.sort(sortByMultipleKey(['community']));
  for(var i=0;i<proj.length;i++){   
    var v_mcode=proj[i]['PROJCODE'];
    var v_mname=proj[i]['community'];
    
    if(w_PROJID !== 'ADMIN') {
      if(proj[i]['MCODE'] !== w_PROJID){
        continue;
      }
    }    

    if(v_mcode==CURR2_PROJ){
      newOptionsHtml0=newOptionsHtml0+"<option selected value='"+v_mcode+"'>"+v_mcode+" - "+v_mname+"</option>";    
    }else{
      newOptionsHtml0=newOptionsHtml0+"<option value='"+v_mcode+"'>"+v_mcode+" - "+v_mname+"</option>";    
    }

  }    
  newOptionsHtml0=newOptionsHtml0+"<option value='NONE'>NONE - No Site</option>";    
  document.getElementById("sel_community").innerHTML=newOptionsHtml0;
}

// programmer area *************************************************************************

function btn_WWW1(){
  var btnCmd1=document.getElementById('btnWWW1');
  var btnCmd2=document.getElementById('btnWWW2');
  
  if(btnCmd1.value=='Edit'){ //edit
    btnCmd1.value='Save';
    btnCmd2.value='Cancel';
    document.getElementById('sel_target').disabled=false;      
  }else if(btnCmd1.value=='Save'){ //Save
    if(document.getElementById('txWWW').value==''){ return; }
    document.getElementById('sel_target').disabled=true;      
    document.getElementById('txProjid').value='';
    document.getElementById('txCommunity').value='';  
    btnCmd1.value='Edit';
    btnCmd2.value='Close';
    JBE_HOST=parseInt(document.getElementById('txWWW').value);
    createCookie('cok_host',JBE_HOST,1); 
    get_app_db();    
  }  
}

function btn_WWW2(){
  var btnCmd1=document.getElementById('btnWWW1');
  var btnCmd2=document.getElementById('btnWWW2');
  if(btnCmd2.value=='Close'){ //close
    closeView(1);  
  }else if(btnCmd2.value=='Cancel'){ //Cancel
    document.getElementById('sel_target').disabled=true;      
    document.getElementById('txWWW').value='';
    document.getElementById('txWWWname').value='';  
    btnCmd1.value='Edit';
    btnCmd2.value='Close';
    //document.getElementById('txWWW').value=CURR2_PROJ;
    //document.getElementById('txWWWname').value=JBE_GETFLD('community',aDB_PROJ,'PROJCODE',CURR2_PROJ);  
  }  
}

function chg_target(v){
  //MSG_SHOW(vbOk,"SHOW:",v,function(){},function(){}); 
  document.getElementById('txWWW').value=v;  
  document.getElementById('txWWWname').value=aryHOST[v];  
}

function fillTarget(){        
  var newOptionsHtml0 = '';    
  for(var i=0;i<aryHOST.length;i++){   
    var v_mcode=i;
    var v_mname=aryHOST[i];    
    newOptionsHtml0=newOptionsHtml0+"<option value='"+v_mcode+"'>"+v_mname+"</option>";    
  }                             
  
  
}
