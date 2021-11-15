var dbVersion = 1;
var dbReady = false;
var db;

var IDX_STORE = [  
  { "id":0, "flename":"Meter", "numrec":0, "init":1 },
  { "id":1, "flename":"Consumer", "numrec":0, "init":1 },
  { "id":2, "flename":"User", "numrec":0, "init":1 }
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
  
  request.onupgradeneeded = function(e) {
    db = e.target.result;    
    for(var i=0;i<IDX_STORE.length;i++){
      db.createObjectStore(IDX_STORE[i]['flename'], { keyPath:'id' });
    }
    dbReady = true;
  }
}

function saveImgToIDX(jmtr,jimg){
  let file = jimg;
  var reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = function(e) {    
    let bits = e.target.result;
    let ob = {
      //created:new Date(),
      meter:jmtr,
      data:bits
    };

    let trans = db.transaction(['MeterFile'], 'readwrite');
    let addReq = trans.objectStore('MeterFile').add(ob);

    addReq.onerror = function(e) {
      console.log('error storing data');
      console.error(e);
    }

    trans.oncomplete = function(e) {
      console.log('data stored');
    }
  }
}

function doImageTest() {
  console.log('doImageTest');
  let image = document.querySelector('#testImage');
  let recordToLoad = parseInt(document.querySelector('#recordToLoad').value,10);
  if(recordToLoad === '') recordToLoad = 1;

  let trans = db.transaction(['MeterFile'], 'readonly');
  //hard coded id
  let req = trans.objectStore('MeterFile').get(recordToLoad);
  req.onsuccess = function(e) {
    let record = e.target.result;
    console.log('get success', record);
    image.src = 'data:image/jpeg;base64,' + btoa(record.data);
    //image.src = 'data:image/jpeg;base64,' + record.data;
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
function getAllDataFromIDX() {   
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
          serialno:cursor.value.serialno,
          custno:cursor.value.custno,
          lat:cursor.value.lat,
          lng:cursor.value.lng,
          lastread:cursor.value.lastread        
        };  
      }else if(i==1){ //consumer
        ob = {
          id:i,
          custno:cursor.value.custno,
          name:cursor.value.name,
          addrss:cursor.value.addrss
        };              
      }else if(i==2){ //user
        ob = {
          id:i,
          userid:cursor.value.userid,
          pword:cursor.value.pword,
          username:cursor.value.username,
          axtype:cursor.value.axtype
        };              
      }  

      aryIDB[idx]=ob;  
      //if(i==2) { alert(ob.slide1); }
      idx++;
      cursor.continue();
    }else{
      if(i==0){
        iDB_METER=[]; iDB_METER=aryIDB;              
        //show_candidates();   
        //alert('show_candidates:'+DB_CANDIDATE.length);
      }else if(i==1){
        iDB_CONSUMER=[]; iDB_CONSUMER=aryIDB;
      }else if(i==2){
        iDB_USER=[]; iDB_USER=aryIDB;
      }
      //alert(IDX_STORE[i]['flename']+' : '+aryIDB.length);
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
    /*
    var photo=JBE_API+'upload/photo/'+aryDB[i]['code']+'.jpg';  
    if(aryDB[i]['photo']){      
      await JBE_BLOB(n,photo).then(result => photo=result);
    }else{
      photo='';
    }
    */
    ob = { 
      id:i,
      meterno:aryDB[i]['meterno'],
      serialno:aryDB[i]['serialno'],
      custno:aryDB[i]['custno'],
      lat:aryDB[i]['lat'],
      lng:aryDB[i]['lng'],
      lastread:aryDB[i]['lastread']
    };
  }else if(n==1){    //consumer
    ob = { 
      id:i,
      custno:aryDB[i]['custno'],
      name:aryDB[i]['name'],
      addrss:aryDB[i]['addrss']
    };
  }else if(n==2){    //user
    ob = { 
      id:i,
      userid:aryDB[i]['userid'],
      pword:aryDB[i]['pword'],
      username:aryDB[i]['username'],
      axtype:aryDB[i]['axtype']
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
