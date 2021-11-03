let dbVideo;
let dbVidReady = false;
var CTR_VIDEO=0;
var rekords=[];



function dispVideos() {  
  //alert('dispVideos');
  var transaction = db.transaction(["Videos"]);
  var object_store = transaction.objectStore("Videos");
  var request = object_store.openCursor();

  var dtl='';  
  CTR_VIDEO=0;

  request.onerror = function(event) {
    console.err("error fetching data");
  };
  
  request.onsuccess = function(event) {
    //db2Video = e.target.result;    
    let cursor = event.target.result;
    if (cursor) {
        let key = cursor.primaryKey;
        let title=cursor.value.title;          
        let descrp=cursor.value.description;          
        let video = cursor.value.video;          
        
        var URL = window.URL || window.webkitURL;
        var videoURL = URL.createObjectURL(video);
        //videoURL="vids/gone.mp4";
        //alert(description);
        //descrp='the quick brown. fox jumps over the.   lazy dog. near the river.';
        //alert(descrp);
        dtl=dtl+
          '<div style="float:left;width:48%;height:160px;margin:1%;font-size:12px;border:1px solid gray;padding:2px;color:black;background:lightgray;">'+
            '<div style="width:100%;height:20px;padding:2px;font-weight:bold;overflow:auto;background:lightgray;">'+title+'</div>'+
            '<div style="width:100%;height:100px;padding:0px;background:none;">'+
             // '<video id="video'+CTR_VIDEO+'" onclick="alert(1);zoomPlay('+CTR_VIDEO+',&quot;'+description+'&quot;)" style="width:100%;height:100%;background:black;">'+    
              '<video id="video'+CTR_VIDEO+'" onclick="zoomPlay('+CTR_VIDEO+',&quot;'+title+'&quot;,&quot;'+descrp+'&quot;)" style="width:100%;height:100%;background:black;">'+    
                '<source src='+videoURL+' type="video/mp4">'+  
                'Your browser does not support HTML5 video'+
              '</video>'+ 
            '</div>'+
            '<div style="width:100%;height:35px;padding:2px;font-size:12px;overflow:auto;background:lightgray;">'+descrp+'</div>'+
          '</div>';
        
        CTR_VIDEO++;        
        cursor.continue();
    }
    else {
      // no more results             
      document.getElementById('dtl_videos').innerHTML=dtl;
    }    
  };
}

function zoomPlay(v,title,desc){  
  showMenu('mnu_zoom_play');   
  document.getElementById('page_dtl_video').style.display='none';
  document.getElementById('page_zoom_video').style.display='block';
  document.getElementById('back_video').style.display='none';
  var vid=document.getElementById('video'+v).getElementsByTagName('source')[0].src;
  //document.getElementById("example_video_1").getElementsByTagName('source')[0].src="example_video_2.mp4";   
  document.getElementById("zoomVideo").src=vid;  
  document.getElementById("zoom_video_title").innerHTML=title; 
  document.getElementById("zoom_video_desc").innerHTML=desc; 
  
  
}
function closeZoomPlay(){
  document.getElementById('page_dtl_video').style.display='block';
  document.getElementById('page_zoom_video').style.display='none';
  document.getElementById('back_video').style.display='block';
  document.getElementById('zoomVideo').pause();
  showMenu('mnu_video'); 
}

function jplay(v) { 
  var myBidyo=document.getElementById('video'+v);
  if (myBidyo.paused){
    myBidyo.play(); 
  }else{ 
    myBidyo.pause(); 
  }
} 

function fm_videos(){
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  openPage('page_video');
  showMenu('mnu_video'); 
  document.getElementById('page_zoom_video').style.display='none';
  document.getElementById('page_video').style.display='block';
  dispVideos();  
}

function closeVideo(){      
  for(var i=0;i<CTR_VIDEO;i++){
    document.getElementById('video'+i).pause();
  }

  document.getElementById("page_video").style.display='none';  
  showMainPage();
}
 
function videoExist(id){
  var trans = db.transaction(['Videos'], 'readonly');  
  let req = trans.objectStore('Videos').get(id);

  req.onsuccess = function (e) {
    var result = e.target.result;
    if (result) {
      console.log('yes');
      return true;
    } else {
      console.log('none');
      return false;
    }    
  }
}

function closeDownloadVids(){
  showMenu('mnu_video'); 
}
function video_download(){  
  //alert('tot vids :'+DB_VIDS.length);
  var dtl=
  '<div id="downVids" style="width:100%;height:250px;font-size:14px;text-align:center;padding:5px;background:white;">'+
    '<div style="width:100%;height:10%;font-size:18px;padding:2px;background:none;">Download Videos</div>'+
    '<div id="sel_vids" style="width:100%;height:90%;font-size:12px;padding:5px;overflow:auto;background:lightgray;">'+

    '</div>'+
    '<div id="vid_progress" style="display:none;width:100%;height:40px;border:1px solid black;background:gray;">'+
      '<div style="width:100%;height:40%;font-size:11px;padding:1px;text-align:center;color:navy;background:white;">Downloading: <span id="vid_progress_title"></span></div>'+
      '<div id="vid_progress_bar" style="width:0%;height:60%;background:navy;"></div>'+
    '</div>'+
  '</div>';
  openBox('downVids','Download Videos',dtl,'closeDownloadVids');
  var dtl2='';
  var bclor='white';
  var vids=DB_VIDS;
  vids.sort(sortByMultipleKey(['vidtitle']));  
  for(var i=0;i<vids.length;i++){
    var v_row=parseInt(vids[i]['id']);
    var v_title=vids[i]['vidtitle'];
    var v_desc=vids[i]['viddesc'];
    var v_video=vids[i]['vidname'];
    dtl2=dtl2+
    //'<div id="'+v_row+'" data-clor="'+bclor+'" data-sel=0 data-row='+i+' onmouseover="subHover(this.id,1,&quot;'+v_row+'&quot;,&quot;'+JBE2_CLOR3+'&quot;)" onmouseout="subHover(this.id,0,&quot;'+v_row+'&quot;,&quot;white&quot;)"'+ 
    '<div id="'+v_row+'" data-clor="'+bclor+'" data-sel=0 data-row='+i+
          ' style="width:100%;height:35px;border:1px solid gray;padding:3px;background:white;">'+v_title+
      '<img src="gfx/jdown.png" onclick="dl_now('+v_row+',&quot;'+v_title+'&quot;,&quot;'+v_desc+'&quot;,&quot;'+v_video+'&quot;)" class="color_2" style="float:right;height:100%;padding:2px;border:1px solid black;" />'+
      //'<img src="gfx/jdown.png" onclick="alert(888);dl_now('+v_row+')" class="color_2" style="float:right;height:100%;padding:2px;border:1px solid black;" />'+
    '</div>';
  }
  document.getElementById('sel_vids').innerHTML=dtl2;
  showMenu('mnu_video_download');
}

function dl_now(id,tilt,descrp,vidfile){   
  var trans = db.transaction(['Videos'], 'readonly');  
  let req = trans.objectStore('Videos').get(id);

  req.onsuccess = function (e) {
    var result = e.target.result;
    if (result) {
      MSG_SHOW(vbOk,"ERROR:","Video already downloaded...",function(){},function(){});
      return;
    } else {
      MSG_SHOW(vbOkAbort,"CONFIRM:","Download "+tilt+"?",function(){ dl_now2(id,tilt,descrp,vidfile); },function(){});
      return;
    }    
  }
}

function dl_now2(id,tilt,descrp,vidfile){     
  document.getElementById('sel_vids').style.height='70%';
  document.getElementById('vid_progress').style.display='block';
  var xhr = new XMLHttpRequest(),  blob;
  // Get the Video file from the server.
  //xhr.open("GET", "Heilman-Betts.webm", true);     
  xhr.open("GET", "../vids/"+vidfile, true);     
  xhr.responseType = "blob";

  xhr.onprogress = function (e) {
    if (e.lengthComputable) {
      //console.log(e.loaded+  " / " + e.total);
      var percentComplete = Math.ceil((e.loaded / e.total) * 100);
      document.getElementById('vid_progress_title').innerHTML=percentComplete+'%';      
      document.getElementById('vid_progress_bar').style.width=percentComplete+'%';
    }
  }
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      blob = xhr.response;
      
      let ob = {
        id:id,
        title:tilt,
        description:descrp,
        video:blob
      };
      var transaction = db.transaction(["Videos"], "readwrite");
      var put = transaction.objectStore("Videos").put(ob);

      console.log('ayos...');
      snackBar("SUCCESS: Video file downloaded.");        
      dispVideos();
    } else {          
      console.log('wala na download...');
      MSG_SHOW(vbOk,"ERROR:","Unable to download video. Try again...",function(){},function(){});
    }
    
    document.getElementById('sel_vids').style.height='90%';
    document.getElementById('vid_progress').style.display='none';
  }
  xhr.send();
}

