function fm_upload(){   
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
    var aryConsumer=JBE_GETARRY(iDB_CONSUMER,'custno',v_custno);
    //var v_consumer=JBE_GETFLD('name',iDB_CONSUMER,'custno',v_custno);
    //var v_address=JBE_GETFLD('addrss',iDB_CONSUMER,'custno',v_custno);
    var v_consumer=aryConsumer['name'];
    var v_address=aryConsumer['addrss'];
    var v_date=iDB_TRANMETER[i]['trandate'];
    var v_amount=iDB_TRANMETER[i]['amount'];
    var v_photo='data:image/png;base64,' + btoa(iDB_TRANMETER[i]['photo']);
    dtl=dtl+      
      '<div id="meter_'+v_meterno+'" style="width:100%;height:100px;margin-top:2px;font-size:12px;padding:2px;border:1px solid lightgray;background:none;">'+
        '<div style="float:left;width:60%;height:100%;border:0px solid lightgray;overflow:auto;background:none;">'+
          '<div style="width:100%;height:15px;">Meter No.: <b>'+v_meterno+'</b></div>'+
          '<div style="width:100%;height:15px;">Date: <b>'+v_date+'</b></div>'+
          '<div style="width:100%;height:15px;">Consumer: <b>'+v_consumer+'</b></div>'+
          '<div style="width:100%;height:auto;">Address: <b>'+v_address+'</b></div>'+
          '<div style="width:100%;height:15px;">Amount: <b>'+v_amount+'</b></div>'+
        '</div>'+
        '<div style="float:right;position:relative;width:40%;height:100%;font-size:14px;text-align:center;border:1px solid black;padding:2px;background:none;">'+
          '<img src="'+v_photo+'" onerror="imgOnError(this)" alt="category image" style="max-width:100%;width:auto;max-height:100%;height:auto;background:none;">'+         
          '<div style="position:absolute;top:0px;right:0px;width:30px;height:30px;text-align:center;font-size:20px;color:white;padding:1px 0 0 0;border:1px solid white;border-radius:50%;background:red;">x</div>'+   
          '<div style="position:absolute;bottom:0px;left:0px;width:100%;height:15px;text-align:center;padding:0px 0 0 0;color:white;background:black;">'+iDB_TRANMETER[i]['reading']+'</div>'+   
        '</div>'+                
      '</div>';  
  }
  dtl+='</div>';
  //alert(dtl);
  document.getElementById('page_dtl_upload').innerHTML=dtl;
}

function do_uploadMETER(){
  MSG_SHOW(vbYesNo,"CONFIRM:","Are you sure to UPLOAD all the records?",
    function(){   
      showProgress(true);
      axios.post('z_uploadMeter.php', { request: 3,
        aryItems:JSON.stringify(iDB_TRANMETER)        
      }, JBE_HEADER)
      .then(function (response) { 
        console.log(response.data);    
        //DB_PROJ=response.data;
        //alert(DB_PROJ.length);
        snackBar('Record saved...');
        showProgress(false);
      })    
      .catch(function (error) { 
        console.log(error); 
      });  
    },function(){ return; }
  ); 
}