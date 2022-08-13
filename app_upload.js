function fm_upload(){ 
  if(iDB_METER.length==0){
    MSG_SHOW(vbOk,"ERROR: ","Records Empty. Please Download the Files.",function(){},function(){});
    return;
  }
      
  if(!CURR_USER){
    showLogin();
    return;
  }

  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
    
  openPage('page_upload');
  getAllTranMeterFromIDX();
  showMenu('mnu_upload');
}

function disp_upload(){  
  var dtl='<div style="width:100%;height:100%;overflow:auto;background:none;padding:2px;">';

  for(var i=0;i<iDB_TRANMETER.length;i++){
    var v_meterno=iDB_TRANMETER[i]['meterno'];    
    var v_custno=JBE_GETFLD('custno',iDB_METER,'meterno',v_meterno);
    var aryMeter=JBE_GETARRY(iDB_METER,'custno',v_custno);
    //var v_consumer=JBE_GETFLD('name',iDB_CONSUMER,'custno',v_custno);
    //var v_address=JBE_GETFLD('addrss',iDB_CONSUMER,'custno',v_custno);
    var v_consumer=aryMeter['name'];
    var v_address=aryMeter['addrss'];
    var v_date=iDB_TRANMETER[i]['trandate'];
    var v_curr_read=iDB_TRANMETER[i]['curr_read'];
    //v_curr_read=123;
    var v_amount=iDB_TRANMETER[i]['amount'];
    var v_photo='data:image/jpeg;base64,' + btoa(iDB_TRANMETER[i]['photo']);    
    //alert('vphoto: '+v_photo);
    dtl=dtl+      
      '<div id="meter_'+v_meterno+'" style="width:100%;height:120px;margin-top:2px;font-size:12px;padding:2px;border:1px solid lightgray;background:none;">'+
        '<div style="float:left;width:60%;height:100%;border:0px solid lightgray;overflow:auto;background:none;">'+
          '<div style="width:100%;height:15px;">Meter No.: <b>'+v_meterno+'</b></div>'+
          '<div style="width:100%;height:15px;">Date: <b>'+v_date+'</b></div>'+
          '<div style="width:100%;height:15px;">Consumer: <b>'+v_consumer+'</b></div>'+
          '<div style="width:100%;height:auto;">Address: <b>'+v_address+'</b></div>'+
          '<div style="width:100%;height:auto;">Status: <b>'+retStat(parseInt(iDB_TRANMETER[i]['stat']))+'</b></div>'+
          '<div style="width:100%;height:15px;">Prev Rdg.: <b>'+iDB_TRANMETER[i]['prev_read']+'</b></div>'+
          '<div style="width:100%;height:15px;">Curr Rdg.: <b>'+iDB_TRANMETER[i]['curr_read']+'</b></div>'+
          '<div style="width:100%;height:15px;">Amount: <b>'+v_amount+'</b></div>'+
          
        '</div>'+
        '<div style="float:right;position:relative;width:40%;height:100%;font-size:14px;text-align:center;border:1px solid black;padding:2px;background:none;">'+
          '<img id="img_'+v_meterno+'" src="'+v_photo+'" onerror="imgOnError(this)" alt="category image" style="max-width:100%;width:auto;max-height:100%;height:auto;background:none;">'+         
          '<div style="display:none;position:absolute;top:0px;right:0px;width:30px;height:30px;text-align:center;font-size:20px;color:white;padding:1px 0 0 0;border:1px solid white;border-radius:50%;background:red;">x</div>'+   
          '<div style="position:absolute;bottom:0px;left:0px;width:100%;height:15px;text-align:center;padding:0px 0 0 0;color:white;background:black;">'+v_curr_read+'</div>'+   
        '</div>'+                
      '</div>';  
  }
  dtl+='</div>';
  //alert(dtl);
  
  if(iDB_TRANMETER.length==0){
    document.getElementById('mnu_upload').style.display='none';    
    dtl='<div style="width:100%;text-align:center;margin-top:100px;">No Upload to show...</div>';
  }
  document.getElementById('page_dtl_upload').innerHTML=dtl;  
}

function do_uploadMETER(){
  //alert(iDB_TRANMETER[0]['photo']);
  //alert(iDB_TRANMETER.length); return;
  //var v_mtrstat=JBE_GETFLD('mtrstat',iDB_METER,'meterno',v_meterno);
  MSG_SHOW(vbYesNo,"CONFIRM:","Are you sure to UPLOAD all the records?",
    function(){   

      var aryUpload=[];
      for(var i=0;i<iDB_TRANMETER.length;i++){
        var v_meterno=iDB_TRANMETER[i]['meterno'];
        //aryUpload[i]["meterno"]=v_meterno;
        var ob={
          "meterno":v_meterno,
          "acctno2":iDB_TRANMETER[i]['acctno2'],
          "trandate":iDB_TRANMETER[i]['trandate'],
          "prev_date":iDB_TRANMETER[i]['prev_date'],
          "curr_date":iDB_TRANMETER[i]['curr_date'],          
          "prev_read":iDB_TRANMETER[i]['prev_read'],
          "curr_read":iDB_TRANMETER[i]['curr_read'],
          "month_bill":iDB_TRANMETER[i]['month_bill'],          
          "used":iDB_TRANMETER[i]['used'],
          "stat":iDB_TRANMETER[i]['stat'],
          "instruct":iDB_TRANMETER[i]['instruct'],
          "amount":iDB_TRANMETER[i]['amount'],
          "photo":document.getElementById('img_'+v_meterno).src
        }        
        aryUpload[i]=ob;        
      }
     
      showProgress(true);
      axios.post('z_uploadMeter.php', { request: 3, 
        brgyno:CURR_BRGYNO,       
        aryItems:JSON.stringify(aryUpload)        
      }, JBE_HEADER)
      .then(function (response) { 
        console.log(response.data);    
        DB_METER=response.data;
        saveDataToIDX(DB_METER,0);   
        clearStore('TranMeter');
        showMainPage();
        snackBar('Record saved...');
        showProgress(false);
      })    
      .catch(function (error) { 
        console.log(error); 
      });  
    },function(){ return; }
  ); 
}

