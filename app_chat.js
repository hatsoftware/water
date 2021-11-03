function fm_chat(){
  if(CURR2_PROJ=='NONE' || CURR2_PROJ=='' || CURR2_PROJ==null){
    MSG_SHOW(vbYesNo,"ERROR:","Please Log In",function(){ showLogin(); },function(){});
    return;
  }

  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  
  document.getElementById('div_msg_items').style.display="block";
  document.getElementById('msg_zoom').style.display="none";
  openPage('page_chat');  
  document.getElementById('txtMsg').value='';  
  getChat(CURR2_PROJ);
  showMenu('mnu_chat');
}

function getChat(projcode){
  DB_CHAT=[];  
  document.getElementById('fm_msg').style.pointerEvents='auto'; 
  if(!JBE_ONLINE){ 
    document.getElementById('fm_msg').style.pointerEvents='none';
    document.getElementById("div_msg_items").innerHTML='<br><br><br><center>O F F L I N E</center>';
    return; 
  }
  showProgress(true);    
  //alert('getChat: '+projcode);
  axios.post(JBE_API+'z_chat.php', {  request:1, projcode:projcode }) 
  .then(function (response) { 
    showProgress(false);
    console.log(response.data);    
    //alert('getChat len: '+response.data);
    DB_CHAT = response.data;
    dispChat();
  },JBE_HEADER)    
  .catch(function (error) { console.log(error); showProgress(false); }); 
}

function dispChat(){     
  document.getElementById('txtMsg').value='';
  document.getElementById('pre_img').src='gfx/jimage.png';
  var aryChat=DB_CHAT;
  //alert('dispchat len:'+aryChat.length); 
  aryChat.sort(sortByMultipleKey(['TRANSDAT','TRANSTIM']));  
  //aryChat.sort(sortByMultipleKey(['id']));  
  var dtl='<div style="width:100%;height:auto;padding:5px;background-color:none;">';
  document.getElementById('div_msg_items').innerHTML=dtl;
  for(var i=0;i<aryChat.length;i++){        
    var v_projcode=aryChat[i]['PROJCODE'];
    var v_msg=aryChat[i]['MSG'];
    var v_img=aryChat[i]['PHOTO'];
    var v_trano=aryChat[i]['TRANO'];
    var v_sender=parseInt(aryChat[i]['SENDER']);    
    var v_unread=parseInt(aryChat[i]['unread']);    
    var v_date=aryChat[i]['TRANSDAT'];
    var v_time=aryChat[i]['TRANSTIM'];
    var v_username=JBE_GETFLD('community',DB_PROJ,'PROJCODE',v_projcode);
    //alert(v_username);
    dtl+=ret_chatDtl(v_sender,v_trano,v_username,v_msg,v_img,v_date,v_time);
  }
  dtl+='</div>';
  var eldiv = document.getElementById("div_msg_items");
  eldiv.innerHTML=dtl;  
  eldiv.scrollTop = eldiv.scrollHeight;
}

function ret_chatDtl(v_sender,v_trano,v_username,v_msg,v_img,v_date,v_time){    
  var n = new Date().toLocaleTimeString('it-IT');   
  var v_dispImg='block';
  var h_img=50;
  if(v_img==''){ 
    v_dispImg='none'; 
    h_img=0;
  }
  
  var vdispDel='none'; 
  if(v_sender==0){     
    var direksyon='left';
    var v_dispUserImg='none';      
    var v_bg='lightgray';
  }else{
    var direksyon='right';
    var v_dispUserImg='none'; 
    var v_bg='darkgray';      
  }
  
  
  var div_direksyon='float:'+direksyon+';margin-left:5px;';

  var dtl = 
   // '<div style="width:100%;height:auto;text-align:'+direksyon+';background-color:blue;padding:1px;">'+
      
      '<div style="float:'+direksyon+';width:100%;height:auto;margin-top:10px;background:none;">'+
        '<div style="display:'+v_dispUserImg+';width:100%;height:auto;">'+
          //'<img src="'+v_userImg+'" style="float:'+direksyon+';height:30px;width:30px;border-radius:50%;border:1px solid gray;background:none;"/>'+
          '<div style="float:'+direksyon+';height:auto;width:auto;margin:5px;margin-bottom:5px;color:black;"/>'+v_username+'</div>'+
        '</div>'+
      '</div>'+
      
      '<div style='+div_direksyon+';width:70%;height:auto;margin-top:2px;border-radius:6px;padding:0.5%;background-color:'+v_bg+';">'+  
        '<div id="chatdel_'+v_trano+'"  title="Delete this chat" style="display:'+vdispDel+';width:100%;height:20px;text-align:center;font-size:14px;background-color:none;color:white;">'+
          '<span onclick="delChat(&quot;'+v_trano+'&quot;)" style="float:right;width:15px;cursor:pointer;border-radius:5px;background:red;">X</span>'+
        '</div>'+
        '<div style="float:'+direksyon+';width:100%;height:auto;font-size:16px;border-radius:5px;padding:1%;background-color:none;">'+
          '<div style="height:'+h_img+'px;">'+
            '<img id="'+v_trano+'" src="../upload/chat/'+v_img+'?'+n+'" style="float:'+direksyon+';display:'+v_dispImg+';width:auto;height:auto;max-width:100%;max-height:100%;border-radius:5px;" onclick="ZOOM_IMG(&quot;../upload/chat/'+v_img+'&quot;)" />'+
          '</div>'+
          '<div style="height:auto;width:100%;font-size:12px;text-align:'+direksyon+';color:black;background:none;">'+
            v_msg+
          '</div>'+
        '</div>'+ 
      '</div>'+
      
      '<div style='+div_direksyon+';width:70%;height:auto;font-size:11px;background-color:none;">Date:'+v_date+'&nbsp;&nbsp;&nbsp;&nbsp;Time:'+v_time+'</div>'
    //'</div>';
  return dtl;
}


function delChat(v_trano){  
  //alert(v_trano);
  var projcode=CURR2_PROJ;
  //alert('del projcode: '+projcode);
  var photo=JBE_GETFLD('PHOTO',JBE_MSG,'idx',v_trano);
  //alert(photo);
  
  var f_owner=false;
  if(CURR_AXTYPE > 0){ f_owner=true; }
  
  MSG_SHOW(vbYesNo,"CONFIRM:","Are you sure to Delete this Message?",
    function(){   
      showProgress(true);
      axios.post(JBE_API+'z_chat.php', { request: 4,
        trano: v_trano,
        projcode: projcode,
        photo:photo
      },JBE_HEADER)
      .then(function (response) {
        showProgress(false);
        console.log(response.data);
        //alert(response.data);
        JBE_MSG=response.data;
        //alert('after del len:'+JBE_MSG.length);
        dispChat();
      })
      .catch(function (error) {
        console.log(error); showProgress(false);
      });
    },function(){ return; }
  ); 
}

function closeChat(){    
  // mark 1 to unread fields
  //alert('going to closeChat');
  axios.post(JBE_API+'z_chat.php', { request: 31, projcode: CURR2_PROJ })     
    .then(function (response) { 
      console.log(response.data);
      DB_CHAT=response.data;
      showUnreadMsg();
    })    
    .catch(function (error) { console.log(error); });

  if(JBE_ONLINE){    
    clearStore('ChatFile');
    saveChatToIDX();
  }  
  showMainPage();
}

function sendMsg(){
  var projcode=CURR2_PROJ;
  //alert(projcode);
  var mcode=JBE_GETFLD('MCODE',DB_PROJ,'PROJCODE',projcode);  
  var v_sender=1; 
  
  var msg=document.getElementById('txtMsg').value;
  //alert(msg);  
  var newName='';
  
  var vDate=new Date();  
  var vTime = vDate.toLocaleTimeString('it-IT'); 

  vDate = new Date(vDate.getTime() - (vDate.getTimezoneOffset() * 60000 ))
                   .toISOString()
                   .split("T")[0].replace(/-\s*/g, "");
  
  var trano=vDate + new Date().toLocaleTimeString('it-IT').replace(/:\s*/g, "");
    
  if(thisFile){      
    newName = trano + '.jpg';//+getExt(thisFile.name);    
    document.getElementById('pre_img').src='../gfx/jimage.png';   
  }  
  //alert('ready sender: '+v_sender);
  if(msg != '' || newName != ''){    
    showProgress(true);
    axios.post(JBE_API+'z_chat.php', {  request: 2,
      trano: trano,
      projcode: projcode,
      mcode: mcode,
      photo: newName,
      sender: 1,
      trandate: vDate,
      trantime: vTime,
      msg: msg
    },JBE_HEADER)
    .then(function (response) {   
      showProgress(false);      
      console.log(response.data);
      //alert('send Msg: '+response.data);
      DB_CHAT=response.data;
      dispChat();
          
      //document.getElementById('txtMsg').value='';
      //document.getElementById('pre_img').src='../gfx/jimage.png';

      if(thisFile){ 
        let ob = [
          { "div":trano }
        ];
        uploadNOW(thisFile,newName,'../upload/chat/',ob); 
      }        
    
      newName='';
      thisFile='';
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
      showProgress(false);
    });
  }else{
    snackBar('Fill all fields.');
  } 
}

function refreshMESSAGES(){
  getChat(CURR2_PROJ);
}
