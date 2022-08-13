var dbVersion = 1;
var dbReady = false;
var db;

var IDX_STORE = [  
  { "id":0, "flename":"Meter", "numrec":0, "init":1 },  
  { "id":1, "flename":"User", "numrec":0, "init":1 },
  { "id":2, "flename":"Util", "numrec":0, "init":1 },
  { "id":3, "flename":"Sysfile", "numrec":0, "init":1 }
];


var CURR_IDX_DB='IDB_'+CURR_CLIENT;

if (navigator.storage && navigator.storage.persist)
  navigator.storage.persist().then(granted => {
    if (granted){
      //alert("Storage will not be cleared except by explicit user action");
      PERSIST_GRANTED=true;
    }else{
      //alert("Storage may be cleared by the UA under storage pressure.");
      PERSIST_GRANTED=false;
    }
  }
);

initDb();

function initDb() {
  console.log('initDb activated...'+JBE_ONLINE);
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }

  request.onsuccess = function(e) {
    db = e.target.result;
    console.log('db opened');  
  }
  var v_id;
  request.onupgradeneeded = function(e) {
    db = e.target.result;    
    for(var i=0;i<IDX_STORE.length;i++){

      if(i==0){
        v_id='meterno';
      }else{
        v_id='id';
      }
      db.createObjectStore(IDX_STORE[i]['flename'], { keyPath:v_id });
    }
    //create TranMeter temp file
    db.createObjectStore('TranMeter', { keyPath:'meterno' });
    dbReady = true;
  }
}

function clearStore(jstore){   
  //console.log('clearStore:'+jstore);
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
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
      console.log('objectStore Cleared: '+jstore);
      //alert('success');
    }
  }
}

/****************************************/
function countRecordIDX(n){  
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  request.onsuccess = function(e) {
    var db1 = e.target.result;
    var flename=IDX_STORE[n]['flename'];   
    //alert('countRecordIDX: '+flename);
    var jstore = db1.transaction([flename]).objectStore(flename); 
    var count = jstore.count();
    count.onsuccess = function() {      
      IDX_STORE[n]['numrec']=count.result;
      console.log('countRecordIDX: '+IDX_STORE[n]['flename']+' '+count.result);
    }
  }
}

/****************************************/
/****************************************/
function getAllDataFromIDX(jmode) {   
  //alert('getAllDataFromIDX: '+IDX_STORE.length);
  //alert(CURR_IDX_DB);
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  
  request.onsuccess = function(e) {
    var db2 = e.target.result;
    for(var i=0;i < IDX_STORE.length;i++){
      getDataFromIDX(i,db2);  
    }
    if(jmode){
      MSG_SHOW(vbOk,"Download Successful :","Download Successful.",function(){ JBE_CLOSE_VIEW(); },function(){});
    }
  }  
}  

function getDataFromIDX(i,db2) {  
  var idx=0;
  var aryIDB=[]; 
  var flename=IDX_STORE[i]['flename'];  
      
  var trans = db2.transaction([flename]);
  var object_store = trans.objectStore(flename);
  var request1 = object_store.openCursor();

  request1.onerror = function(event) {
    console.err("error fetching data");
    //alert("error fetching data");
  };
  
  request1.onsuccess = function(event) {        
    var cursor = event.target.result;    
    if (cursor) {
      var key = cursor.primaryKey;
      var ob;
      if(i==0){ //meter
        ob = {
          id:i,
          meterno:cursor.value.meterno,
          name:cursor.value.name,
          addrss:cursor.value.addrss,
          serialno:cursor.value.serialno,          
          mtrstat:cursor.value.mtrstat,
          custno:cursor.value.custno,
          lat:cursor.value.lat,
          lng:cursor.value.lng,
          duedate:cursor.value.duedate,
          monbill:cursor.value.monbill,
          prev_date:cursor.value.prev_date,
          curr_date:cursor.value.curr_date,
          prev_read:cursor.value.prev_read,
          curr_read:cursor.value.curr_read          
        };            
      }else if(i==1){ //user
        ob = {
          id:i,
          userid:cursor.value.userid,
          pword:cursor.value.pword,
          username:cursor.value.username,
          areano:cursor.value.areano
        };              
      }else if(i==2){ //util
        ob = {
          id:i,
          flatrate:cursor.value.flatrate,
          mincub:cursor.value.mincub,          
          ratecub:cursor.value.ratecub
        };              
      }else if(i==3){ //sysfile
        ob = {
          id:i,
          ip:cursor.value.ip
        };              
      }
      

      aryIDB[idx]=ob;  
      idx++;
      cursor.continue();
    }else{
      if(i==0){
        iDB_METER=[]; iDB_METER=aryIDB;              
      }else if(i==1){
        iDB_USER=[]; iDB_USER=aryIDB;
      }else if(i==2){
        iDB_UTIL=[]; iDB_UTIL=aryIDB;
      }else if(i==3){
        iDB_SYSFILE=[]; iDB_SYSFILE=aryIDB;
      }  
      IDX_STORE[i]['numrec']=aryIDB.length;
    }    
  }
}  

// ================================================================

function saveDataToIDX(aryDB,n) {  
  IDX_STORE[n]['numrec']=aryDB.length;
  for(var i=0;i<aryDB.length;i++){
    putDataToIDX(i,aryDB,n);
  }
}
async function putDataToIDX(i,aryDB,n){   
  var ob;
  if(n==0){    //meter
    //alert (aryDB[i]['AVG']);
    //var photo=JBE_API+'upload/photo/'+aryDB[i]['code']+'.jpg';  
    var photo='';
    if(aryDB[i]['photo']){      
      await JBE_BLOB(n,photo).then(result => photo=result);
    }else{
      photo='';
    }    
        
    ob = { 
      meterno:aryDB[i]['METERNO'],
      name:aryDB[i]['ACCTNAME'],
      addrss:aryDB[i]['ADDRESS1'],
      serialno:aryDB[i]['SERIALNO'],      
      mtrstat:aryDB[i]['MTRSTAT'],
      custno:aryDB[i]['CUSTNO'],
      lat:aryDB[i]['GEOLAT'],
      lng:aryDB[i]['GEOLONG'],      
      duedate:aryDB[i]['DUEDAT'],      
      prev_date:aryDB[i]['LAST_DATE'],
      prev_read:aryDB[i]['LAST_READ'],
      curr_date:aryDB[i]['CURR_DATE'],            
      curr_read:aryDB[i]['CURR_READ'],
      monbill:aryDB[i]['MONBILL'],
      avg:aryDB[i]['AVG'],
      photo:photo
    };
  }else if(n==1){    //user
    ob = { 
      id:i,
      userid:aryDB[i]['USERNO'],
      pword:aryDB[i]['PWORD'],
      username:aryDB[i]['ACCTNAME'],
      areano:aryDB[i]['AREANO']
    };    
  }else if(n==2){    //util
    ob = { 
      id:i,
      flatrate:aryDB[i]['FLATRATE'],
      mincub:aryDB[i]['MINCUB'],
      ratecub:aryDB[i]['RATECUB']    
    };
  }else if(n==3){    //sysfile
    ob = { 
      id:i,
      ip:CURR_IP
    };
  }
  
  var trans = db.transaction([IDX_STORE[n]['flename']], 'readwrite');
  var addReq = trans.objectStore(IDX_STORE[n]['flename']).put(ob);
  addReq.onerror = function(e) {
    console.log('ERROR: putToIDX '+IDX_STORE[n]['flename']);
    console.error(e);
  }

  trans.oncomplete = function(e) {
    console.log(n+': putToIDX '+IDX_STORE[n]['flename']+' with value '+IDX_STORE[n]['numrec']);
  }
}


function saveMeterToIDX() {  
  putMeterToIDX();
}
async function putMeterToIDX(){
  var v_meterno=document.getElementById('mtr_no').innerHTML;
  var v_custno=JBE_GETFLD('custno',iDB_METER,'meterno',v_meterno);

  //alert(v_meterno+' custno: '+v_custno);
  //var aryMeter=JBE_GETARRY(iDB_METER,'meterno',v_meterno);

  var ob;
  var photo=document.getElementById('mtr_pic').src;  
    
  if(photo){          
    await JBE_BLOB(0,photo).then(result => photo=result);
  }else{
    photo='';
  }
  
  var monbill=save_monbill(document.getElementById('mtr_bill').innerHTML);
  var prev_date=document.getElementById('mtr_from').innerHTML;
  var curr_date=document.getElementById('mtr_to').getAttribute('data-date');
  var instruct=JBE_DATE_FORMAT(prev_date,'MMM DD, YYYY')+' To '+JBE_DATE_FORMAT(curr_date,'MMM DD, YYYY');
  if(!prev_date){
    instruct=JBE_DATE_FORMAT(curr_date,'MMM DD, YYYY');
  }
  //alert(curr_date+' save '+curr_date);
  ob = {
    meterno:v_meterno,
    acctno2:v_custno,    
    trandate:curr_date,
    prev_date:prev_date,    
    curr_date:curr_date,
    month_bill:monbill,
    prev_read:document.getElementById('mtr_prev').innerHTML,
    curr_read:document.getElementById('mtr_curr').innerHTML,    
    used:document.getElementById('mtr_used').innerHTML,
    stat:document.getElementById('mtr_stat').getAttribute('data-stat'),
    duedate:document.getElementById('mtr_due').getAttribute('data-duedate'),
    instruct:instruct,
    amount:document.getElementById('mtr_amount').innerHTML,
    photo:photo
  };  
  
  var trans = db.transaction('TranMeter', 'readwrite');
  var addReq = trans.objectStore('TranMeter').put(ob);
  addReq.onerror = function(e) {
    console.log('ERROR: putToIDX Meter');
    console.error(e);
  }

  trans.oncomplete = function(e) {
    console.log('putToIDX Meter with value');
  }
}

function getMeterFromIDX(v_meterno) {  
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  
  request.onsuccess = function(e) {
    var db2 = e.target.result;
    
    var aryIDB=[]; 
    var flename='TranMeter';
        
    var trans = db2.transaction([flename]);
    var object_store = trans.objectStore(flename);
    var request1 = object_store.openCursor();

    request1.onerror = function(event) {
      console.err("error fetching data");
      //alert("error fetching data");
    };
    
    request1.onsuccess = function(event) {        
      var cursor = event.target.result;    
      if (cursor) {
        var key = cursor.primaryKey;
        var ob;
        if(cursor.value.meterno == v_meterno){
          ob = {    
            meterno:cursor.value.meterno,       
            acctno2:cursor.value.acctno2,       
            trandate:cursor.value.trandate,              
            curr_date:cursor.value.curr_date,
            prev_date:cursor.value.prev_date,
            month_bill:cursor.value.month_bill,  
            curr_read:cursor.value.curr_read,
            prev_read:cursor.value.prev_read,
            used:cursor.value.used,
            stat:cursor.value.stat,
            duedate:cursor.value.duedate,
            instruct:cursor.value.instruct,    
            amount:cursor.value.amount,
            photo:cursor.value.photo
          };

          aryIDB[0]=ob;  
        }
        cursor.continue();
      }else{
        show_TranMeter(aryIDB);  
      }    
    }
  }
}  
  
function getAllTranMeterFromIDX() {  
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  
  request.onsuccess = function(e) {
    var db2 = e.target.result;
    
    var aryIDB=[]; 
    var flename='TranMeter';
    var ctr=0;
        
    var trans = db2.transaction([flename]);
    var object_store = trans.objectStore(flename);
    var request1 = object_store.openCursor();

    request1.onerror = function(event) {
      console.err("error fetching data");
      //alert("error fetching data");
    };
    
    request1.onsuccess = function(event) {        
      var cursor = event.target.result;    
      if (cursor) {
        var key = cursor.primaryKey;
        var ob;        
        ob = {    
          meterno:cursor.value.meterno,       
          acctno2:cursor.value.acctno2,       
          trandate:cursor.value.trandate,              
          curr_date:cursor.value.curr_date,
          prev_date:cursor.value.prev_date,
          month_bill:cursor.value.month_bill,  
          curr_read:cursor.value.curr_read,
          prev_read:cursor.value.prev_read,
          used:cursor.value.used,
          stat:cursor.value.stat,
          duedate:cursor.value.duedate,
          instruct:cursor.value.instruct,    
          amount:cursor.value.amount,
          photo:cursor.value.photo
        };
        aryIDB[ctr]=ob;          
        ctr++;
        cursor.continue();
      }else{
        iDB_TRANMETER=[]; iDB_TRANMETER=aryIDB;  
        //show_AllTranMeter();  
        disp_upload();
      }    
    }
  }
}  
  