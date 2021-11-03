var THISFILE=[];
clear_THISFILE();
  
function JBE_GET_IMAGE(id,inp_file,targ_div,cb,likod){
  //alert('i:'+inp_file+'\nt:'+targ_div);    
  document.getElementById(inp_file).setAttribute('data-orig',targ_div);
  
  THISFILE[id]=null;
  var real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/*"); //accept="image/*"

  real_ImgBtn.addEventListener('change', e => {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=e.target.files[0].size;
      var fname=e.target.files[0].name;
      var tfile=e.target.files[0];
      
      if(imgSize > 6000000){
        MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
        return;
      }
      
      reader.onload = e => {        
        if(document.getElementById(inp_file).getAttribute('data-orig')==targ_div){          
          var output = document.getElementById(targ_div);          
          if(likod){          
            output.style.backgroundImage='url('+reader.result+')';
            output.style.backgroundRepeat='no-repeat';
            output.style.backgroundSize="100% 100%";
          }else{
            output.src = reader.result;
          }
          var ndx=cb.indexOf('|');
          var param='';
          if(ndx >= 0){
            param=cb.substr(ndx+1);
            cb=cb.substr(0,ndx);
          }
  
          var fn = window[cb];
          if (typeof fn === "function") fn(param);          
          THISFILE[id]=tfile;                 
          document.getElementById(targ_div).setAttribute('data-img',fname);
          real_ImgBtn.value=null;          
        }
      };      
      reader.readAsDataURL(e.target.files[0]);
      
    }
  });
  real_ImgBtn.click();
}

function JBE_MULTI_IMAGES(id,inp_file,targ_div,cb,likod){
  //alert('id:'+id+'\ninp_file: '+inp_file+'\ntarget:'+targ_div+'\nLIKOD = '+likod);   
  /*
  alert(      
      '\nid: '+id+
      '\nCurr item: '+curr_item+
      '\nInput id: '+inp_file+
      '\ntarget div: '+targ_div+
      '\nLikod: '+likod
      );
  */    
  //alert('curr I: '+c_item);
  
  THISFILE[id]=null;
  var real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/*"); //accept="image/*"

  real_ImgBtn.addEventListener('change', e => {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=e.target.files[0].size;
      var fname=e.target.files[0].name;
      
      if(imgSize > 6000000){
        MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
        return;
      }
      reader.onload = e => {
        //alert('onload '+targ_div+' old targ: '+o_targ.substr(4)+'  curr_ite:'+curr_item);
        if(targ_div.substr(4)==curr_item){
          //alert(imgSize+ ' fname: '+fname);    
          var output = document.getElementById(targ_div);          
          if(likod){          
            output.style.backgroundImage='url('+reader.result+')';
            output.style.backgroundRepeat='no-repeat';
            output.style.backgroundSize="auto 100%";
          }else{
            output.src = reader.result;
          }
          var fn = window[cb];
          if (typeof fn === "function") fn(reader.result);
          THISFILE[id]=this.files[0];          
          document.getElementById(targ_div).setAttribute('data-img',fname);
          real_ImgBtn.value=null;          
        }      
      };      
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  real_ImgBtn.click();
}
// -------------------------------------------------------------------------------
function JBE_PICK_IMAGE(id,inp_file,targ_div,cb){
  //alert('i:'+inp_file+'\nt:'+targ_div);  
  //var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');  
  THISFILE[id]=null;
  var real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/*"); //accept="image/*"    

  real_ImgBtn.addEventListener("change", function() {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=event.target.files[0].size;
      reader.onload = function(){
        if(imgSize > 6000000){
          MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
          return;
        }
        var output = document.getElementById(targ_div);
        output.src = reader.result;
        var fn = window[cb];
        if (typeof fn === "function") fn(reader.result);
        //document.getElementById('tmp').src=reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      //id=this.files[0];
      THISFILE[id]=this.files[0];
      
      document.getElementById(targ_div).setAttribute('data-img',this.files[0].name);
      real_ImgBtn.value='';      
    } 
  });
  real_ImgBtn.click();
}

function uploadNOW(file,newName,dir,ndiv,keepSize,likod){   
  /*
  alert(
    'file: '+file+
    '\n newName: '+newName+
    '\n dir: '+dir+
    '\n ndiv: '+ndiv+
    '\n keepSize: '+keepSize+
    '\n likod: '+likod
  ); 
  */
  var ddir=dir.substr(JBE_API.length); 
  var phpDir=ddir;

  var data = new FormData();  
  data.append('file', file, newName); 
  data.append('dir', phpDir); 
  data.append('keepSize', keepSize); 
  var config = {}; 
  showProgress(true);
  axios.post(JBE_API+'z_load.php', data, config)
  .then(function (response) {    
    console.log(response.data[1]);    
    //alert(response.data[1]);    
    showProgress(false);
    if(response.data[0] == -1){
      MSG_SHOW(vbOk,"ERROR: Upload Failed",response.data[1],function(){},function(){return;});
      return;
    }  
    
    if(ndiv.length != 0){ 
      for(var j=0;j<ndiv.length;j++){
        RefreshImage(likod,dir,newName,ndiv[j]['div']); 
      }
    }    
  })  
  .catch(function (err) {    
    console.log(err.message);
    showProgress(false);
    MSG_SHOW(vbOk,"ERROR: Upload Failed",err.message,function(){},function(){return;});
  });  
}

function RefreshImage(likod,dir,newName,ndiv){    
  var n = new Date().toLocaleTimeString('it-IT');
  var targ=dir+newName+'?'+n;
  if(likod){
    document.getElementById(ndiv).style.backgroundImage='url('+targ+')'; 
  }else{
    document.getElementById(ndiv).src=targ;
  }
}

function JBE_ZOOM(img,div_close){
  var dtl=      
    '<div id="main_JBE_zoom" data-zoom=0 data-close="'+div_close+'" style="width:100%;height:'+(H_BODY-30)+'px;text-align:center;background-color:none;">'+      
      '<img id="img_JBE_zoom" onclick="JBE_zoom2()" src="'+img+'" style="width:auto;height:100%;">'+      
    '</div>';  
  var dtl2=      
    '<div style="width:100%;height:30px;padding:5px 0 0 0;text-align:center;color:'+JBE_TXCLOR1+';background:none;">'+
      'Click the Image to Zoom In or Zoom Out'+      
    '</div>';   
  JBE_OPENBOX('main_JBE_zoom','Zoom Image',dtl,dtl2); 
}

function close_JBE_ZOOM(){
  var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');
  var fn = window[closeDiv];
  if (typeof fn === "function") fn();
}

function JBE_OPENBOX(div,title,dtl,dtl2) {   
  var div_dtl=    
    '<div id="myJBox_main" data-open=0 data-close="" class="bottom_box" style="width:100%;height:0px;background:'+JBE_CLOR+';">'+
      '<div id="hd_jbox" class="hd_box" style="width:100%;height:30px;font-size:15px;font-weight:bold;border:1px solid black;background:none;">'+        
        '<div style="float:left;width:10%;height:100%;text-align:left;padding:0 0 0 10px;background:none;">'+
          '<input type="button" onclick="JBE_CLOSEBOX()" style="width:28px;height:100%;font-size:14px;color:white;border-radius:50%;border:1px solid white;background:red;" value="X" />'+
        '</div>'+
        '<div id="cap_jbox" style="float:right;text-align:right;width:90%;height:100%;padding:5px;color:'+JBE_TXCLOR1+';background:none;">'+title+'</div>'+
      '</div>'+      
      '<div id="dtl_jbox" style="width:100%;height:auto;padding:5px;overflow:auto;border:1px solid black;color:black;background:white;">'+
        dtl+
      '</div>'+
      '<div id="footer_jbox" class="jfooter" style="display:block;height:35px;width:100%;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
        dtl2+
      '</div>'+    
    '</div>';
  
  document.getElementById("myJBox").innerHTML=div_dtl;  
  //document.getElementById("myJBox_main").setAttribute('data-close',xclose);
  document.getElementById("myJBox").style.height = window.innerHeight+'px';
  //document.getElementById("cap_jbox").innerHTML=title;
  //document.getElementById("dtl_jbox").innerHTML=dtl;
  
  var h=parseInt(document.getElementById(div).style.height); 
  var hh=h+30+50; //dtl height + box head height + paddings         
  document.getElementById("dtl_jbox").style.height = h+'px';
  document.getElementById("myJBox_main").style.height = hh+'px';
  document.getElementById("myJBox").style.height = window.innerHeight+'px';
  document.getElementById(div).style.height="auto";
  document.getElementById(div).style.width="100%";
  document.getElementById(div).style.height = (h-12)+'px';
}

function JBE_CLOSEBOX(){  
  var xclose=document.getElementById("myJBox_main").getAttribute('data-close'); 

  var fn = window[xclose];
  if (typeof fn === "function"){
    //var ret_func=fn(param);
    //if(!ret_func){ return; }
    if(fn()==false){ return; }
  }

  document.getElementById("myJBox").style.height=0+'px';
  document.getElementById("myJBox_main").style.height = 0+'px';       
  
  document.getElementById("myJBox").style.height = "0px";       
  document.getElementById("myJBox").setAttribute('data-open','0');   
}

function sortByMultipleKey(keys) {
  return function(a, b) {
      if (keys.length == 0) return 0; // force to equal if keys run out
      key = keys[0]; // take out the first key
      if(key.substr(0,1)=="*"){        
        key=key.substr(1);
        if (a[key] < b[key]) return 1; // will be 1 if DESC
        else if (a[key] > b[key]) return -1; // will be -1 if DESC
      }
      //if (a[key] < b[key]) return -1; // will be 1 if DESC
      //else if (a[key] > b[key]) return 1; // will be -1 if DESC
      //alert(key);
      if (a[key] < b[key]) return -1; // will be 1 if DESC
      else if (a[key] > b[key]) return 1; // will be -1 if DESC
      else return sortByMultipleKey(keys.slice(1))(a, b);
  }
}

function showProgress(v){
  var vd='block';
  if(!v){ vd='none'; }
  document.getElementById("loading").style.display=vd;
}




function JBE_zoom2(){
  var div=document.getElementById('main_JBE_zoom');
  var mod=parseInt(document.getElementById('main_JBE_zoom').getAttribute('data-zoom'));
  var divImg=document.getElementById('img_JBE_zoom').src;
  var img_w=0;
  var img_h=0;
  var ximg = new Image();
  ximg.src=divImg;  
  ximg.onload = function() {
    img_w=ximg.naturalWidth;
    img_h=ximg.naturalHeight;
    
    var imageratio = img_w/img_h;

    var new_width = H_BODY*imageratio;
    var new_height = H_BODY;

    if(mod==0){
      div.style.height=new_height+'px';
      div.style.width=new_width+'px';
      (document.getElementById('main_JBE_zoom').setAttribute('data-zoom',1));      
    }else{
      div.style.height="auto";
      div.style.width="100%";
      (document.getElementById('main_JBE_zoom').setAttribute('data-zoom',0));
    }
  }
}

function JBE_OPEN_VIEW(dtl,cap,xclose) {
  //alert(xclose);
  document.getElementById('page_main').style.display='none';
  //document.getElementById('div_nobar').style.display='block';
  var m=parseInt(document.getElementById("myView1").getAttribute('data-JBEpage'));  
  m++;
  //alert(m);
  document.getElementById("myView"+m).setAttribute('data-page',m);
  document.getElementById("myView"+m).setAttribute('data-close',xclose); 
  //document.getElementById('dtl_myView'+m).style.height=H_VIEW_DTL+'px';
  
  document.getElementById("dtl_myView"+m).innerHTML=dtl;  
  document.getElementById("cap_myView"+m).innerHTML=cap;  

  if(m==1){
    openPage('myView'+m);    
  }else{
    document.getElementById("myView"+(m-1)).style.display='none';
    //alert('second page view');
    document.getElementById("myView"+m).style.display='block';
  }
  document.getElementById("myView1").setAttribute('data-JBEpage',m);    
  //alert(document.getElementById("dtl_myView"+m).innerHTML);
  //document.getElementById("copyright").innerHTML=m;
}

function JBE_CLOSE_VIEW(){
  var m=parseInt(document.getElementById("myView1").getAttribute('data-JBEpage'));
  //alert('closeView # '+m);
  var xclose=document.getElementById("myView"+m).getAttribute('data-close');
  //var param=xclose.substr(xclose.lastIndexOf('|')+1);
  //xclose=xclose.substr(0,xclose.lastIndexOf('|')+0);
  var ndx=xclose.indexOf('|');
  var param='';
  if(ndx >= 0){
    param=xclose.substr(ndx+1);
    xclose=xclose.substr(0,ndx);
  }

  var fn = window[xclose];
  if (typeof fn === "function"){
    //var ret_func=fn(param);
    //if(!ret_func){ return; }
    if(fn(param)==false){ return; }
  }
  
  document.getElementById("myView"+m).setAttribute('data-open','0');
  document.getElementById("myView"+m).style.display='none';
  
  if(m > 1){
    document.getElementById("myView"+(m-1)).style.display='block';    
    document.getElementById("myView1").setAttribute('data-JBEpage',m-1);
  }else{
    //document.getElementById('div_nobar').style.display='none';
    document.getElementById("myView1").setAttribute('data-JBEpage',0);
  }
  //document.getElementById("copyright").innerHTML=m-1;
}

//function EP_SetColorByClass(cls,clr1,clr2){
function JBE_SET_COLOR_BY_CLASS(cls,clr1,clr2){	  
  document.querySelectorAll('.'+cls).forEach(function(el) {
    el.style.color=clr1;
    el.style.backgroundColor=clr2;
  });
}
  
function JBE_GETFLD(r_ret_str,r_arry,r_fld,r_key){   
  //alert(' JBE_GETFLD arry len: '+r_arry.length);
  var rval='';
  for(var i=0; i<r_arry.length; i++) {
    if(r_key==r_arry[i][r_fld]){
      rval=r_arry[i][r_ret_str];      
      break;
    }    
  }    
  return rval;
}

function JBE_GETFLD2(ret,db,cond){
  var rval='';
  var ctr_cond=cond.length;

  for(var i=0;i<db.length;i++){    
    var ctr_ix=0;
    for(var ix=0;ix<ctr_cond;ix++){
      if(db[i][(cond[ix]['fld'])]==cond[ix]['val']){
        ctr_ix++;
      }
    }
    if(ctr_ix==ctr_cond){ 
      //alert('ctr_ix '+ctr_ix);
      rval=db[i][ret];
      break;
    }
  } 
  return rval;
}

function JBE_FILTER_ARRAY(db,cond){  
  var aryDB=[];
  var ctr=0;
  var ctr_cond=cond.length;
  
  for(var i=0;i<db.length;i++){    
    var ctr_ix=0;
    for(var ix=0;ix<ctr_cond;ix++){
      if(db[i][(cond[ix]['fld'])]==cond[ix]['val']){
        ctr_ix++;
      }
    }
    if(ctr_ix==ctr_cond){ 
      aryDB[ctr]=db[i];
      ctr++;
    }
  } 
  
  return aryDB;
}





function xxxJBE_FILTER_ARRAY(db,fld,filter){  
  var aryDB=[];
  var ctr=0;
  for(var i=0;i<db.length;i++){
    //alert(db[i]['pos']);
    if(db[i][fld] != filter){ continue; }
    
    aryDB[ctr] = db[i];
    //aryDB[ctr].push(db[i]);
    //aryDTL.push(ob);  
    //alert(db[i]);
    ctr++;
  }  
  return aryDB;
}


function JBE_GETARRY(r_arry,r_fld,r_key){   
  //JBE_GETFLD('usertype',DB_CLIENTS,'usercode',usercode);  
  var rval=[];
  for(var i=0; i<r_arry.length; i++) {    
    if(r_key==r_arry[i][r_fld]){
      rval=r_arry[i];
      //alert(rval['clientno']);
      break;
    }
  }      
  return rval;
}

function JBE_IMG_EXIST(v_img){
  var img = document.createElement('img');

  img.src=v_img;

  img.onload = function(e){
    //alert('Success!');
    return true;
  };

  img.onerror = function(e) {
    //alert('ERROR!');
    return false;
  };
}

var JBE_LAT, JBE_LNG;
var GEO_MODE=0;
function JBE_GETLOCATION() {
	
	//alert(vmode);
	//alert(m);
   showProgress(true);
  if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(jbe_updatePosition, jbe_showError);
  } else { 
     MSG_SHOW(vbOk,"ERROR:","Geolocation is not supported by this app.",function(){},function(){});
     //snackBar("Geolocation is not supported by this app.");
  }
  showProgress(false);
}

function jbe_updatePosition(position) {
    if(GEO_MODE==0){
        document.getElementById('flat2').value=position.coords.latitude;
        document.getElementById('flng2').value=position.coords.longitude;
        //alert('Mode: '+GEO_MODE);
        return;
    }
	showProgress(true);
    axios.post(JBE_API+'z_user.php', { clientno:CURR_CLIENT, request:302,         
        lat:position.coords.latitude,
        lng:position.coords.longitude,
        usercode: CURR_USER ,
    },JBE_HEADER)     
    .then(function (response) {        
        DB_USER = response.data;
        get_db_clients();     
        //alert(response.data.length);
        showProgress(false);
        if(GEO_MODE!=0){
            snackBar('Location Updated');
        }
    }).catch(function (error) { 
        snackBar('ERROR: '+error);  
        showProgress(false);
    });    
}

function jbe_showError(error) {
  //var vmode=document.getElementById('div_admin_profile').getAttribute('data-mode');
  if(GEO_MODE==0){
     return;
  }
  var msg='XXX';
  switch(error.code) {
    case error.PERMISSION_DENIED:
      msg = "Please turn on your Location."
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      msg = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      msg = "An unknown error occurred."
      break;
  }
  showProgress(false);
  MSG_SHOW(vbOk,"ERROR:",msg,function(){},function(){});
}


function JBE_BASE64(src,callback){
	//alert(src);
    var img = new Image();
    img.src = src;
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var dataURL ;
        
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
         
        dataURL = canvas.toDataURL();  
        //alert(dataURL);
        callback(src);
    };
    
}

function JBE_BLOB(n,img) {
  return new Promise(resolve => {
    JBE_getBLOB(n,img,function(uurl){       
      resolve(uurl);       
    });           
  });
}

function JBE_getBLOB(n,jimg,callback){
  //alert(n+'  JBE_getBLOB : '+jimg);
  var canvas = document.createElement("canvas");
  const context = canvas.getContext('2d');  
  const img = new Image();
  img.crossOrigin = "anonymous";
  //img.src = "https://somesite.com/someimage.jpg"  
  //img.setAttribute('crossorigin', 'anonymous'); // works for me
  img.src=jimg;
  if(!JBE_ONLINE){
    img.onerror=img.onerror=null;img.src="main_gfx/jsite.png"; 
  }

  img.onload =  function() {
    canvas.width=img.width;
    canvas.height=img.height;
    context.drawImage(img, 0, 0);

    canvas.toBlob(function (blob) {        // get content as JPEG blob      
        var reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onload = function(e) {    
            var bits = e.target.result;
            callback(bits);
        }
    });     
  }       
}

function JBE_AUDIO(s,d){
	navigator.vibrate(d);
	var xx = document.getElementById("myAudio"); 
	xx.pause();
	xx.src=s+'.mp3';
	xx.src=s+'.ogg';
	xx.load();
	xx.play();
}

function snackBar(s) {
  if(s==''){ return; }
  var x = document.getElementById("snackbar");    
  x.innerHTML=s;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function JBE_SEEK_ARRAY(db,fld,seek){
  var rval=false;
  for(var i=0;i<db.length;i++){
    if(db[i][fld]==seek){
      rval=true;
      break;
    }
  }
  return rval;
}

function clear_THISFILE(){
  //snackBar('clear thisfile');
  //alert('thisfile activated');
  for(var i=0;i<25;i++){
    THISFILE[i]=null;
  }
}

function JBE_FORMAT_INT_TO_STR(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function JBE_FORMAT_DOUBLE_TO_STR(xnum) {
  num=Number(xnum);
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function jeffNumber(mode,div) {  
  var vv = document.getElementById(div).value;
  if(vv==''){ vv='0'; }
  //alert('jeffNumber vv='+vv);
  var v = vv.replace(/,/g, '');
  //var res = str.replace(/,/g, ".");
  
  if(mode==1) {
    v=parseInt(v);
    var rval = JBE_FORMAT_INT_TO_STR(v);
  } else if(mode==2) {
    v=parseFloat(v);
    rval=JBE_FORMAT_DOUBLE_TO_STR(v);
  }
  
  document.getElementById(div).value=rval;
  return;
}

function JBE_DATE_FORMAT(date) {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemper", "October", "November", "December" ];
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return monthNames[date.getMonth()] + ' ' + day + ', ' + year;
}

var JBE_COLORHEX = x => '#' + x.match(/\d+/g).map(y = z => ((+z < 16)?'0':'') + (+z).toString(16)).join('');
//enad