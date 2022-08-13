function fm_download_data(){ 
    if(!CURR_USER){
      //showLogin();
      //return;
    }  
    window.history.pushState({ noBackExitsApp: true }, '');
    f_MainPage=false;
    var api_dir='file:///C:/wamp/www/water/';
    var dtl=
      '<div id="download_box" data-mode=0 style="width:100%;height:100%;font-size:18px;text-align:center;padding:5px;border:0px solid lightgray;background:white;">'+  
  
        '<div style="width:100%;height:15%;font-size:22px;font-weight:bold;padding:6% 0 0 0;background:none;">'+
          '<div>Download Data</div>'+
          '<div style="font-size:14px;color:navy;"></div>'+      
        '</div>'+
        
        '<div style="width:100%;height:70%;padding:5%;border:0px solid darkgray;background:none;">'+  
          '<div style="width:80%;height:110px;margin:10%;padding:10px;border-radius:5px;border:1px solid darkgray;background:none;">'+  
            '<div style="width:100%;height:30%;font-weight:bold;padding:2px 0 0 0;background:none;">Files to be Downloaded</div>'+      
            '<div id="div_dd1" style="width:100%;height:70%;padding:7px 0 0 0;background:none;"></div>'+        
          '</div>'+
  
          '<div style="width:80%;height:110px;margin:10%;padding:10px;border-radius:5px;border:1px solid darkgray;background:none;">'+  
            '<div style="width:100%;height:30%;font-weight:bold;padding:2px 0 0 0;background:none;">Current Data</div>'+      
            '<div id="div_dd2" style="width:100%;height:70%;padding:7px 0 0 0;background:none;"></div>'+        
          '</div>'+
        '</div>'+

        '<div style="width:100%;height:15%;margin-top:0px;background:lightgray;">'+
          '<form>'+
            '<div style="float:left;width:50%;height:100%;font-size:18px;padding:5px;border:1px solid lightgray;margin-top:0px;">'+
              '<input id="txUser" type="text" autocomplete="username" style="width:100%;height:30px;margin-top:0px;text-align:center;" placeholder="Enter User ID" value="" />'+
              '<input id="txPass" type="password" autocomplete="current-password" style="width:100%;height:30px;margin-top:5px;text-align:center;" placeholder="Enter Password" value="" />'+
            '</div>'+
          '</form>'+
          '<div style="float:right;width:50%;height:100%;font-size:18px;padding:5px;border:1px solid lightgray;margin-top:0px;">'+
            '<input type="button" onclick="download_data(txUser.value,txPass.value)" class="color_head" style="float:left;width:100%;height:100%;border-radius:8px;" value="Download" />'+
          '</div>'+
        '</div>'+
        
      '</div>';
  
    JBE_OPEN_VIEW(dtl,'Download Facility','close_fm_download_data');
    //document.getElementById('cap_myView1').innerHTML='Download Main Data';
  
    DB_METER=[]; DB_UTIL=[]; DB_USER=[]; 
    //iDB_METER=[]; iDB_UTIL=[]; iDB_USER=[]; 
    //alert('app main: '+JBE_API);
    showProgress(true);
    axios.post(api_dir+'z_tanan.php', { request: 0, brgyno: CURR_BRGYNO },JBE_HEADER)     
    .then(function (response) { 
      console.log(response.data);        
      
      DB_METER = response.data[0];        
      DB_USER = response.data[1]; 
      DB_UTIL = response.data[2]; 
        
      JBE_ONLINE=true;
      document.getElementById('logger').style.color='navy';
      document.getElementById('logger').innerHTML='Date: '+sysDate+' &nbsp;&nbsp;&nbsp;Time: '+sysTime;
  
      dtl=
        '<div style="width:100%;height:100%;background:none;">'+
          '<div style="width:100%;height:20px;">Meter File : '+DB_METER.length+'</div>'+
          '<div style="width:100%;height:20px;">User File : '+DB_USER.length+'</div>'+        
          '<div style="width:100%;height:20px;">Util File : '+DB_UTIL.length+'</div>'+        
        '</div>';
      document.getElementById('div_dd1').innerHTML=dtl;
  
      dtl=
        '<div style="width:100%;height:100%;background:none;">'+
          '<div style="width:100%;height:20px;">Meter File : '+iDB_METER.length+'</div>'+
          '<div style="width:100%;height:20px;">User File : '+iDB_USER.length+'</div>'+     
          '<div style="width:100%;height:20px;">Util File : '+iDB_UTIL.length+'</div>'+           
        '</div>';
      document.getElementById('div_dd2').innerHTML=dtl;
      showProgress(false);
      
      //snackBar('Ready to Download...');
    })    
    .catch(function (error) { 
      JBE_ONLINE=false;
      console.log(error); 
      showProgress(false);
      document.getElementById('btn_download').disabled=true;
      MSG_SHOW(vbOk,"GUIHULNGAN ERROR: ",error,function(){},function(){});
    });
  
  }
  
  function close_fm_download_data(){
    var vmode=document.getElementById('download_box').getAttribute('data-mode');
    //alert(vmode);
    showMainPage();
  }
  
  function download_data(u,p) {  
    var f_found=false;
    
    for(var i=0;i<DB_USER.length;i++){
      if(DB_USER[i]['USERNO']==u && DB_USER[i]['PWORD']==p){
        CURR_BRGYNO=DB_USER[i]['BRGYNO'];
        CURR_USER=DB_USER[i]['USERNO'];
        CURR_USERNAME=DB_USER[i]['ACCTNAME'];
        f_found=true;
        break;
      }
    }

    if(!f_found){ 
      MSG_SHOW(vbOk,"ACCESS DENIED: ","Invalid User ID or Password. Try again...",function(){},function(){});
      return;
    }
    
    //alert('CURR_BRGYNO: '+CURR_BRGYNO);
    DB_METER=[];    
    clearStore('Meter');    
    clearStore('TranMeter');
    showProgress(true);
    axios.post(api_dir+'z_meter.php', { request: 1, brgyno: CURR_BRGYNO },JBE_HEADER)     
    .then(function (response) { console.log(response.data);        
  
      DB_METER = response.data;
      //alert('tot DB_METER '+DB_METER.length);
      //alert('DB_METER: '+DB_METER[0]['AVG']);
      //DB_METER2 = response.data[1];
      saveDataToIDX(DB_METER,0);
      saveDataToIDX(DB_USER,1);
      saveDataToIDX(DB_UTIL,2);
      
      //DB_UTIL=[];
      //DB_METER=[];
      //DB_USER=[];   
      showProgress(false);
      console.log('Data Downloaded...');
      //console.log('DB_METER2 lenght is '+DB_METER2);
      //showLogin();
      getAllDataFromIDX(true);
      init_app();
    })    
    .catch(function (error) { 
      showProgress(false);
      JBE_ONLINE=false;
      console.log(error); 
      //showOffline();
      snackBar(error);
      //getProfile_IDB();
    });  
  }
