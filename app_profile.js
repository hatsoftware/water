function fm_profile(){      
  if(CURR2_PROJ=='NONE' || CURR2_PROJ=='' || CURR2_PROJ==null){
    MSG_SHOW(vbYesNo,"ERROR:","Please Log In",function(){ showLogin(); },function(){});
    return;
  }
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  openPage('page_profile');
  disp_profile();
  
  var eldiv = document.getElementById("page_dtl_profile");
  //eldiv.innerHTML=dtl;  
  eldiv.scrollTop = 0;
  showMenu('mnu_profile');
}

function closeProfile(){     
  showMainPage();
}

function xxxclearStore(jstore){   
  //alert(jstore);
  //let request = indexedDB.open('app_db', dbVersion);
  var request = indexedDB.open('DB_'+CURR_CLIENT, dbVersion);
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  request.onsuccess = function(e) {
    var db1 = e.target.result;  
    var trans = db1.transaction([jstore], 'readwrite');
    var req = trans.objectStore(jstore).clear();
  
    //alert(111);
    req.onerror = function(e) {
      console.log('error clearing storeobject');
      console.error(e);
      //alert('error');
    }

    req.onsuccess = function(e) {
      console.log('objectStore Cleared');
      //alert('success');
    }
  }
}

function saveProfile_IDB(){
  clearStore('SysProfile');
  let ob = 
      {
        projcode:CURR2_PROJ,
        projname:JBE_GETFLD('community',DB_PROJ,'PROJCODE',CURR2_PROJ),
        family:JBE_GETFLD('QTYTOT',DB_PROJ,'PROJCODE',CURR2_PROJ),
        hectare:JBE_GETFLD('hecta',DB_PROJ,'PROJCODE',CURR2_PROJ),
        male:JBE_GETFLD('bmale',DB_PROJ,'PROJCODE',CURR2_PROJ),
        female:JBE_GETFLD('bfemale',DB_PROJ,'PROJCODE',CURR2_PROJ),
        children:JBE_GETFLD('QTYAVG',DB_PROJ,'PROJCODE',CURR2_PROJ),
        total:JBE_GETFLD('QTYAVG',DB_PROJ,'PROJCODE',CURR2_PROJ),
        exp_output:JBE_GETFLD('OUTPUT',DB_PROJ,'PROJCODE',CURR2_PROJ)
      };  

  let trans = db.transaction(['SysProfile'], 'readwrite');
  let editReq = trans.objectStore('SysProfile').put(ob);

  editReq.onerror = function(e) {
    console.log('error storing profile');
    //alert('error storing profile');
    console.error(e);
  }

  trans.oncomplete = function(e) {
    console.log('profile updated');
    //alert('profile updated');
  }
}

function getProfile_IDB(){  
  var trans = db.transaction(['SysProfile'], 'readonly');  
  let req = trans.objectStore('SysProfile').get(CURR2_PROJ);
  req.onsuccess = function (e) {
    var result = e.target.result;
    if(!result){
      //alert('Mr. Jeffrey Enad, wala result!');
      return;
    }
    document.getElementById('div_profile_community').innerHTML=result.projname;
    document.getElementById('div_profile_families').value=result.family;
    document.getElementById('div_profile_hectares').value=result.hectare;

    document.getElementById('bene_male').value=result.male;
    document.getElementById('bene_female').value=result.female;
    document.getElementById('bene_children').value=result.children;
    document.getElementById('bene_total').value=result.total;
    document.getElementById('exp_output').value=result.exp_output;
    init_profile(true);
  }
  req.onerror = function(e) {
    console.err(e);    
  };
}

function init_profile(b){
  document.querySelectorAll('.data_entry').forEach(function(el) {        
    if(b){
      el.style.backgroundColor='white';
    }else{
      el.style.backgroundColor='lightgray';
    }
    el.disabled=b;
  }); 
}

function disp_profile(){      
  document.getElementById('back_profile').style.pointerEvents='auto'; 
  axios.post(JBE_API+'z_proj.php', { request: 1, host: JBE_HOST, projcode: CURR2_PROJ   
  })    
  .then(function (response) { 
    console.log(response.data);
    document.getElementById('btnProf1').value='Edit';
    document.getElementById('btnProf2').value='Close';
    document.getElementById('div_profile_community').innerHTML=JBE_GETFLD('community',DB_PROJ,'PROJCODE',CURR2_PROJ);  

    document.getElementById('div_profile_families').value=JBE_GETFLD('QTYTOT',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('div_profile_hectares').value=JBE_GETFLD('hecta',DB_PROJ,'PROJCODE',CURR2_PROJ);

    document.getElementById('bene_male').value=JBE_GETFLD('bmale',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('bene_female').value=JBE_GETFLD('bfemale',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('bene_children').value=JBE_GETFLD('bchild',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('bene_total').value=JBE_GETFLD('QTYAVG',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('exp_output').value=JBE_GETFLD('OUTPUT',DB_PROJ,'PROJCODE',CURR2_PROJ);
    
    document.getElementById('ofc_chair').value=JBE_GETFLD('ofc_chair',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_chair_tel').value=JBE_GETFLD('ofc_chair_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_vice').value=JBE_GETFLD('ofc_vice',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_vice_tel').value=JBE_GETFLD('ofc_vice_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_sec').value=JBE_GETFLD('ofc_sec',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_sec_tel').value=JBE_GETFLD('ofc_sec_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_treas').value=JBE_GETFLD('ofc_treas',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_treas_tel').value=JBE_GETFLD('ofc_treas_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_audi').value=JBE_GETFLD('ofc_audi',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('ofc_audi_tel').value=JBE_GETFLD('ofc_audi_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);

    document.getElementById('tech1_name').value=JBE_GETFLD('tech1_name',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('tech1_tel').value=JBE_GETFLD('tech1_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('tech2_name').value=JBE_GETFLD('tech2_name',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('tech2_tel').value=JBE_GETFLD('tech2_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('tech3_name').value=JBE_GETFLD('tech3_name',DB_PROJ,'PROJCODE',CURR2_PROJ);
    document.getElementById('tech3_tel').value=JBE_GETFLD('tech3_tel',DB_PROJ,'PROJCODE',CURR2_PROJ);
    
    init_profile(true);
  })    
  .catch(function (error) { 
    console.log(error); 
    getProfile_IDB();    
  });  
    
}

// --find object
//var fn = window[xclose];
// --is object a function?
//if (typeof fn === "function") fn();

function edit_profile(){
  if(!JBE_ONLINE){ 
    snackBar('OFFLINE');
    return;
  }
  axios.post(JBE_API+'z_proj.php', { request: 1, host: JBE_HOST, projcode: CURR2_PROJ   
  })    
  .then(function (response) { 
    console.log(response.data); 
    document.getElementById('back_profile').style.pointerEvents='none';  
    document.getElementById('btnProf1').value='Save';
    document.getElementById('btnProf2').value='Cancel';  
    init_profile(false);
  })    
  .catch(function (error) { 
    console.log(error); 
    snackBar('Your are OFFLINE...');
  });  
}

function save_profile(){  
  axios.post(JBE_API+'z_proj.php', { request: 32, host: JBE_HOST,   
    div_profile_families: jnumber(document.getElementById('div_profile_families').value),
    div_profile_hectares: jnumber(document.getElementById('div_profile_hectares').value),

    bene_male: jnumber(document.getElementById('bene_male').value),
    bene_female: jnumber(document.getElementById('bene_female').value),
    bene_children: jnumber(document.getElementById('bene_children').value),
    bene_total: jnumber(document.getElementById('bene_total').value),
    exp_output: jnumber(document.getElementById('exp_output').value),
    
    ofc_chair: document.getElementById('ofc_chair').value,
    ofc_chair_tel: document.getElementById('ofc_chair_tel').value,
    ofc_vice: document.getElementById('ofc_vice').value,
    ofc_vice_tel: document.getElementById('ofc_vice_tel').value,
    ofc_sec: document.getElementById('ofc_sec').value,
    ofc_sec_tel: document.getElementById('ofc_sec_tel').value,
    ofc_treas: document.getElementById('ofc_treas').value,
    ofc_treas_tel: document.getElementById('ofc_treas_tel').value,
    ofc_audi: document.getElementById('ofc_audi').value,
    ofc_audi_tel: document.getElementById('ofc_audi_tel').value,
    
    tech1_name: document.getElementById('tech1_name').value,
    tech1_tel: document.getElementById('tech1_tel').value,
    tech2_name: document.getElementById('tech2_name').value,
    tech2_tel: document.getElementById('tech2_tel').value,
    tech3_name: document.getElementById('tech3_name').value,
    tech3_tel: document.getElementById('tech3_tel').value,
    
    projcode: CURR2_PROJ
  })     
  .then(function (response) { 
    console.log(response.data);    
    DB_PROJ=response.data;
    //alert(DB_PROJ.length);
    snackBar('Record saved...');
    saveProfile_IDB();   
    disp_profile();
  })    
  .catch(function (error) { 
    console.log(error); 
  });  
}

function tot_bene(){  
  var tot=0;
  var fam=parseInt(document.getElementById("div_profile_families").value.replace(/,/g, ''));
  //alert('weeee fam = '+fam);
  
  tot = parseInt(document.getElementById("bene_male").value.replace(/,/g, ''))+
  parseInt(document.getElementById("bene_female").value.replace(/,/g, ''))+
  parseInt(document.getElementById("bene_children").value.replace(/,/g, ''));  
  if(tot==0){
    tot=fam*5;
  }
  document.getElementById("bene_total").value=tot;
}

function btn_prof(m){
  //alert(JBE_ONLINE);
  var btnCmd1=document.getElementById('btnProf1');
  //btnCmd1.disabled=false;

  var btnCmd2=document.getElementById('btnProf2');
  if(m==1){
    if(btnCmd1.value=='Edit'){ //edit
      edit_profile();
    }else if(btnCmd1.value=='Save'){ //Save
      save_profile();    
    }  
  }else{
    if(btnCmd2.value=='Close'){ //close
      showMainPage();  
    }else if(btnCmd2.value=='Cancel'){ //Cancel    
      disp_profile();
    }    
  }
}