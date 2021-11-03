var aryREPAIRS=[];
aryREPAIRS[0]="Door Hinges";
aryREPAIRS[1]="Check Valve";
aryREPAIRS[2]="Stopper Plate Gasket";
aryREPAIRS[3]="Air Chamber Gasket";
aryREPAIRS[4]="Air Valve";
aryREPAIRS[5]="Stopper Plate Bolt & Nuts";
aryREPAIRS[6]="Waste Valve Plate";
aryREPAIRS[7]="Stopper Plate";

function showCheckboxes(expanded) {
  var t=document.getElementById('div_repairs');
  var divDrop=document.getElementById('div_drop');
  
  var div_drop = document.getElementById("div_drop");  
  var btn1=document.getElementById('btnRep1').value;
  if (btn1=='Edit') { return; }
  if (!expanded) {
    get_checkboxes();
    t.style.display='none';
    document.getElementById('div_repdate').style.display='none';
    div_drop.style.display = "block";    
    document.getElementById('btnRep1').disabled=true;
    document.getElementById('btnRep2').disabled=true;
    expanded = true;
  } else {
    t.style.display='block';
    document.getElementById('div_repdate').style.display='block';
    div_drop.style.display = "none";    
    document.getElementById('btnRep1').disabled=false;
    document.getElementById('btnRep2').disabled=false;
    expanded = false;
  }
}

function fm_setting(){      
  if(CURR2_PROJ=='NONE' || CURR2_PROJ=='' || CURR2_PROJ==null){
    MSG_SHOW(vbYesNo,"ERROR:","Please Log In",function(){ showLogin(); },function(){});
    return;
  }
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  openPage('page_setting');
  fill_checkboxes();
  disp_sys();
  showMenu('mnu_setting');
}
function clk_stat(){  
  var s=document.getElementById('cb_stat');  
  if(!s.checked){
    s.checked=true;    
    dispCurrStat(0);
  }else{
    s.checked=false;        
    dispCurrStat(1);
  }
  
}
function dispCurrStat(s){
  if(s==0){
    document.getElementById('cb_stat').checked=true;
    document.getElementById('tx_operational').innerHTML='OPERATIONAL';
    document.getElementById('tx_operational').style.color='blue';
    document.getElementById('div_dates').style.display='none';    
  }else{
    document.getElementById('cb_stat').checked=false;
    document.getElementById('tx_operational').innerHTML='DOWNED';
    document.getElementById('tx_operational').style.color='red';
    document.getElementById('div_dates').style.display='block';
  }
}

function disp_sys(){
  document.getElementById('tx_repairs').innerHTML=CURR2_REPAIRS;  
  document.getElementById('repdate').value=CURR2_REPDATE;
  document.getElementById('repdate').disabled=true;
  document.getElementById('tx_repairs').disabled=true;
  document.getElementById('sel_setting').style.color='gray';
  showCheckboxes(true);
  document.getElementById('btnRep1').value="Edit";
  document.getElementById('btnRep2').value="Close";
  document.getElementById('back_setting').style.pointerEvents='auto';  
  document.getElementById('status_box').style.pointerEvents='none';  
  document.getElementById('page_setting').style.display='block';  
  document.getElementById('lb_stat').style.color="darkgray";  
  document.getElementById('date_down').value=CURR2_DATE_DOWN;
  document.getElementById('date_exp').value=CURR2_DATE_EXP;
  document.getElementById('date_down').disabled=true;
  document.getElementById('date_exp').disabled=true;
  dispCurrStat(CURR2_STATUS);  
}
function edit_sys(){
  if(!JBE_ONLINE){ 
    snackBar('OFFLINE');
    return;
  }
  axios.post(JBE_API+'z_proj.php', { request: 1, host: JBE_HOST, projcode: CURR2_PROJ   
  })    
  .then(function (response) { 
    console.log(response.data); 
    document.getElementById('btnRep1').value='Save';
    document.getElementById('btnRep2').value='Cancel';
    document.getElementById('repdate').disabled=false;
    document.getElementById('tx_repairs').disabled=false;    
    document.getElementById('sel_setting').style.color='black';
    document.getElementById('back_setting').style.pointerEvents='none';  
    document.getElementById('status_box').style.pointerEvents='auto';  
    document.getElementById('lb_stat').style.color="black";  
    document.getElementById('date_down').disabled=false;
    document.getElementById('date_exp').disabled=false;
  })    
  .catch(function (error) { 
    console.log(error); 
    snackBar('Your are OFFLINE...');
  });  
}

function is_date(d){    
  d=new Date(d);  
  if(d=='Invalid Date'){
    return false;
  }else{
    return true;
  }   
}

function save_sys(){
  var cb_stat=0;
  var date_down=document.getElementById('date_down').value;
  var date_exp=document.getElementById('date_exp').value;
  if(!document.getElementById('cb_stat').checked){
    cb_stat=1;
    //alert(date_down);
    if(!is_date(date_down)){
      MSG_SHOW(vbOk,"ERROR:","Invalid Date on Date Downed field",function(){},function(){});
      return;
    }
    if(!is_date(date_exp)){
      MSG_SHOW(vbOk,"ERROR:","Invalid Date on Expected Date field",function(){},function(){});
      return;
    }
    if(date_down > date_exp){
      MSG_SHOW(vbOk,"ERROR:","Date Downed field is greater than the Expected Date field",function(){},function(){});
      return;
    }
  }else{
    date_down='';
    date_exp='';
  }
  
  var repair=document.getElementById('tx_repairs').innerHTML;
  var repdate=document.getElementById('repdate').value;
  
  axios.post(JBE_API+'z_proj.php', { request: 3, host: JBE_HOST,   
    stat: cb_stat,
    date_down: date_down,
    date_exp: date_exp,    
    repair: repair,
    repdate: repdate,
    projcode: CURR2_PROJ
  })     
  .then(function (response) { 
    console.log(response.data);
    CURR2_STATUS=cb_stat;
    CURR2_DATE_DOWN=date_down;
    CURR2_DATE_EXP=date_exp;
    CURR2_REPAIRS=repair;
    CURR2_REPDATE=repdate;
    createCookie('cok_status',CURR2_STATUS,1); 
    createCookie('cok_downed',CURR2_DATE_DOWN,1);    
    createCookie('cok_exp_date',CURR2_DATE_EXP,1);    
    createCookie('cok_repairs',CURR2_REPAIRS,1);    
    createCookie('cok_repdate',CURR2_REPDATE,1);    
    snackBar(response.data);
    disp_sys();
  })    
  .catch(function (error) { console.log(error); });  
}

function closeSetting(){      
  showMainPage();
}

function fill_checkboxes(){
  var dtl='';  
  for(var i=1;i<=aryREPAIRS.length;i++){    
    dtl=dtl+
    '<label for="'+i+'" onclick="check_checkboxes('+i+')" style="display:block;padding:2px;width:100%;height:25px;">'+
    '<input type="checkbox"  id="cbox'+i+'" />'+aryREPAIRS[i-1]+'</label>';
  }
  document.getElementById('checkboxes').innerHTML=dtl;
}

function get_checkboxes(){
  var rep=document.getElementById('tx_repairs');
  var rval=rep.innerHTML.split(',');
  for(var i=0;i<rval.length;i++){
   var s_rep=rval[i].trim().toUpperCase();
   //search againts the array
   for(var k=0;k<aryREPAIRS.length;k++){
      t_rep=aryREPAIRS[k].trim().toUpperCase();
      if(s_rep==t_rep){
        document.getElementById('cbox'+(k+1)).checked=true;
      }
    }
  }    
}
function save_checkboxes(){  
  var rval='';
  for(var i=1;i<=aryREPAIRS.length;i++){
    if(document.getElementById('cbox'+i).checked){
      rval=rval+aryREPAIRS[i-1]+', ';
    }
  }  
  document.getElementById('tx_repairs').innerHTML=rval.slice(0, -2);
  exit_checkboxes();
}
function exit_checkboxes(){
  clear_checkboxes();
  showCheckboxes(true);
}
function clear_checkboxes(){
  var dtl='';  
  for(var i=1;i<=aryREPAIRS.length;i++){
    document.getElementById('cbox'+i).checked=false;
  }
  //document.getElementById('checkboxes').innerHTML=dtl;
}

function check_checkboxes(v){
  var div_cbox=document.getElementById('cbox'+v);
  var c_val=div_cbox.checked;
  c_val=!c_val;
  div_cbox.checked=c_val;
}

function btn_rep(m){
  var btnCmd1=document.getElementById('btnRep1');
  var btnCmd2=document.getElementById('btnRep2');
  if(m==1){
    if(btnCmd1.value=='Edit'){ //edit
      edit_sys();
    }else if(btnCmd1.value=='Save'){ //Save
      save_sys();    
    }  
  }else{
    if(btnCmd2.value=='Close'){ //close
      closeSetting(1);  
    }else if(btnCmd2.value=='Cancel'){ //Cancel    
      disp_sys();
    }    
  }
}

