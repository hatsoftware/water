function fm_print(){
   window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  
  //document.getElementById('div_footer').style.display='none';
  document.getElementById('printableArea').style.display='block';
  
  document.getElementById('prnHead1').innerText = CURR_CLIENTNAME.toUpperCase();
  document.getElementById('prnHead2').innerText = CURR_CLIENTADDRESS;
  document.getElementById('prnHead3').innerText = CURR_TELNO;
  var pDate = new Date();
  var pPeriod=
    JBE_DATE_FORMAT(document.getElementById('mtr_from').getAttribute('data-date'),"MM-DD-YYYY")+
    ' To '+
    JBE_DATE_FORMAT(document.getElementById('mtr_to').getAttribute('data-date'),"MM-DD-YYYY");
    //alert(pPeriod);
  document.getElementById('prnCustno').innerText = document.getElementById('inp_meterno').getAttribute('data-custno');
  document.getElementById('prnMeterno').innerText = document.getElementById('mtr_no').innerHTML;
  document.getElementById('prnDate').innerText = JBE_DATE_FORMAT(pDate,"MMM DD, YYYY");
  document.getElementById('prnName').innerText = document.getElementById('mtr_name').innerHTML;
  document.getElementById('prnAddress').innerText = document.getElementById('mtr_address').innerHTML;
  document.getElementById('prnSerialno').innerText = document.getElementById('mtr_serialno').innerHTML;
  document.getElementById('prnStat').innerText = document.getElementById('mtr_stat').innerHTML;
  //document.getElementById('prnName').innerText = 'Juan dela Cruz';
  //document.getElementById('prnAddress').innerText = 'Bacolod City';
  //document.getElementById('prnSerialno').innerText = 'MTR012453';
  
  document.getElementById('prnDays').innerText = '30 Days';
  document.getElementById('prnBillMon').innerText = document.getElementById('mtr_bill').innerHTML;
  document.getElementById('prnPeriod').innerText = pPeriod;
  document.getElementById('prnPrev').innerText = document.getElementById('mtr_prev').innerHTML;
  document.getElementById('prnCurr').innerText = document.getElementById('mtr_curr').innerHTML;
  document.getElementById('prnUsed').innerText = parseFloat(document.getElementById('mtr_used').innerHTML);
  document.getElementById('prnAmount').innerText = document.getElementById('mtr_amount').innerHTML;
  document.getElementById('prnDuedate').innerText = document.getElementById('mtr_due').innerHTML;
    
  document.querySelectorAll('.page_class').forEach(function(el) {
    //alert(el.id);
    el.style.display = 'none';
  });
  console.log ('fm print');
  showMenu('mnu_print'); 
}

function close_print(){
  document.getElementById('printableArea').style.display='none';
  showMainPage();
}

function do_print(){  
  var v_mtr_prev=parseInt(document.getElementById('mtr_prev').innerHTML);
  var v_mtr_curr=parseInt(document.getElementById('mtr_curr').innerHTML);
  var v_due=document.getElementById('mtr_due').innerHTML;

  var v_from=document.getElementById('mtr_from').innerHTML;
  var v_to=document.getElementById('mtr_to').innerHTML;  
  
  if(!v_due){
    MSG_SHOW(vbOk,"ERROR: ","Pls. Enter Due Date.",function(){},function(){});
    return;
  }
  if(v_to.trim().length==0){
    MSG_SHOW(vbOk,"ERROR: ","Pls. Enter Coverage Period.",function(){},function(){});
    return;
  }
  if(v_mtr_curr <= 0){
    MSG_SHOW(vbOk,"ERROR: ","Pls. Enter Current Reading...",function(){},function(){});
    return;
  }
  if(v_mtr_curr < v_mtr_prev){
    MSG_SHOW(vbOk,"ERROR: ","Pls. Enter Correct Current Reading...",function(){},function(){});
    return;
  }
  
  
  MSG_SHOW(vbYesNo,"PRINT:","Print Receipt?",function(){      
    fm_print();
    saveMeterToIDX();        
    return;
  },function(){});
}