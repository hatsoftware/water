var db;
var dbVersion = 1;
var dbReady = false;

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
  let request = indexedDB.open('DB_'+CURR_CLIENT, dbVersion);

  request.onerror = function(e) {
    console.error('Unable to open database.');
  }

  request.onsuccess = function(e) {
    db = e.target.result;
    //db.deleteObjectStore('MeterFile');
    console.log('db opened');
  }

  request.onupgradeneeded = function(e) {
    db = e.target.result;
    
    db.createObjectStore('MeterFile', {keyPath:'meter', autoIncrement: true});
    db.createObjectStore('Videos', { keyPath:'id' });
    db.createObjectStore('ChatFile', { keyPath:'id' });
    db.createObjectStore('SysFile', { keyPath:'id' });
    db.createObjectStore('SysProfile', { keyPath:'projcode' });

    //var index = ObjectStore.createIndex("ixName", "fieldName");
    //db.createObjectStore('MeterFile', {keyPath:'meter'});
    //db.createObjectStore('Videos', {keyPath:'title'});
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


function getRecordsFromIDX() { 
  let idx=0;
  var aryIDB=[]; 
  
  var transaction = db.transaction(["ChatFile"]);
  var object_store = transaction.objectStore("ChatFile");
  var request = object_store.openCursor();

  request.onerror = function(event) {
    console.err("error fetching data");
  };
  
  request.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
        let key = cursor.primaryKey;
        let msg=cursor.value.msg;          
        let date=cursor.value.date;          
        let time = cursor.value.time;          
        let sender = cursor.value.sender;          
        let unread = cursor.value.unread;     

        let ob = {
          idx:idx,
          MSG:msg,
          TRANSDAT:date,
          TRANSTIM:time,
          SENDER:sender,
          unread:unread
        };
        
        aryIDB[idx]=ob;                
        idx++;
        cursor.continue();
    }
    else {
      DB_CHAT=aryIDB;      
      dispChat();
    }    
  };
}

function saveChatToIDX() {
  var cchat=DB_CHAT;
  cchat.sort(sortByMultipleKey(['TRANSDAT','TRANSTIM','SENDER']));
  for(var i=0;i<cchat.length;i++){
    let ob = 
      {
        id:i,
        msg:cchat[i]['MSG'],
        date:cchat[i]['TRANSDAT'],
        time:cchat[i]['TRANSTIM'],
        sender:cchat[i]['SENDER'],
        unread:1
      };  
    putChatToIDB(ob);
  }
}

function putChatToIDB(ob){
  let trans = db.transaction(['ChatFile'], 'readwrite');
  let editReq = trans.objectStore('ChatFile').put(ob);

  editReq.onerror = function(e) {
    console.log('error storing chat');
    console.error(e);
  }

  trans.oncomplete = function(e) {
    console.log('chat updated');
  }
}