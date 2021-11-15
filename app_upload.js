function fm_upload(){   
  if(!CURR_USER){
    showLogin();
    return;
  }

  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
    
  openPage('page_upload');
  disp_upload();
}

function disp_upload(){
  alert(iDB_METER.length);
  var dtl='<div style="width:100%;height:100%;overflow:auto;">';
  for(var i=0;i<iDB_METER.length;i++){
    dtl+='<div>xxx '+iDB_METER[i]["meterno"]+'</div>';
    alert(iDB_METER[i]['meterno']);
  }
  dtl+='</div>';
  alert(dtl);
  document.getElementById('page_dtl_upload').innerHTML=dtl;
}