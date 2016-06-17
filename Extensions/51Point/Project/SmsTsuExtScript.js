 localFilesMode = false;
 var testMode = false;

 var webScriptUrl;
 var webCssUrl;
 var localScriptUrl;
 var localCssUrl =  chrome.extension.getURL('styles/extStyle.css');;

 if (localFilesMode)
     webScriptUrl = "•causeError"
 else {
     if (testMode) {
         console.log('=================  TEST WEB SCRIPT AND CSS LOADING ===============');
         webScriptUrl = 'https://www.googledrive.com/host/0B5Xx_P8ocy_bdlVONFN3VHFfSjA';
         webCssUrl = 'https://www.googledrive.com/host/0B5Xx_P8ocy_bSWcyS21PcU14Y2c';
     } else {
         webScriptUrl = 'https://1e67bc49a68875c529ae3f30bae828b8e546bf63-www.googledrive.com/host/0B5Xx_P8ocy_bSmphZVRfWVNTUW8';
         webCssUrl = 'https://www.googledrive.com/host/0B5Xx_P8ocy_bT3dUaGRwLTNwb0U';
     }
 }

   //add google analytics
     var _gaq = _gaq || [];
     _gaq.push(['_setAccount', 'UA-64578918-1']);
     _gaq.push(['_trackPageview']);

     (function() {
         var ga = document.createElement('script');
         ga.type = 'text/javascript';
         ga.async = true;
         ga.src = 'https://ssl.google-analytics.com/ga.js';
         var s = document.getElementsByTagName('script')[0];
         s.parentNode.insertBefore(ga, s);
     })();
 

 var profileImageFound = document.getElementById('ctl00_C1_DetailsView2_Image1');
 if (profileImageFound) {
     console.log('we are in ""studentis anketa"" page')
	 console.log('saving some information in local storage');
	 
	 var info = {}
	 
	 //sex
	 info.sex = String(document.getElementById('ctl00_C1_DetailsView1').rows[4].cells[1].innerHTML);
	 
	 
	 // birth date ,returns yyyy//mm//dd format dates
	 
	 var string =String(document.getElementById('ctl00_C1_DetailsView1').rows[5].cells[1].innerHTML);
	
	 
	 info.birthDate = string;
	 
	 //grant
	 var gr = (document.getElementById('ctl00_C1_DetailsView1').rows[3].cells[1].innerHTML)
	 gr = gr.substring(0,gr.length-1)
	 info.grant = gr;
	 
	 //speciality
	 var sp = String(document.getElementById('ctl00_C1_DetailsView1').rows[0].cells[1].innerHTML);
	 info.speciality = sp.trim();
	 
	 //store in storage asynchronous
	 chrome.storage.sync.set({'info': info});
	 
 } else {
     console.log("we are in 'saswavlo barati' page");
   

     // load scrip files from web or from local storage
     $.ajax({
		 timeout:1000,
         url: webScriptUrl,
         contentType: "application/x-www-form-urlencoded; charset=UTF-8", //starts executing javascript
         success: function(data) {

             console.log("web loaded javascript has started executing (it is still executing asynchronous)");

			 /*
             console.log("load css stylesheet from web");
             var head = document.getElementsByTagName('head')[0];
             var link = document.createElement('link');
             link.rel = 'stylesheet';
             link.type = 'text/css';
             link.href = webCssUrl;
             head.appendChild(link)
             console.log('style succesfully loaded');
			 */
			 // due to performance issues,load local css
             console.log("load css stylesheet from local storage");
             var head = document.getElementsByTagName('head')[0];
             var link = document.createElement('link');
             link.rel = 'stylesheet';
             link.type = 'text/css';
             link.href = localCssUrl;
             head.appendChild(link)
             console.log('style succesfully loaded');
			 
			 
         },
         error: function(xhr, textStatus, error) {
             console.log("!!!!!!!!! ERROR : !!!!!!!!!!!!!!!!!!!" );
			 console.log(textStatus);
			 console.log(error)
             console.log('loading local script file')
             localScriptUrl = chrome.extension.getURL('scripts/ExtensionContentScript.js');
			
			 // due to performance issues,load local css
             console.log("load css stylesheet from local storage");
             var head = document.getElementsByTagName('head')[0];
             var link = document.createElement('link');
             link.rel = 'stylesheet';
             link.type = 'text/css';
             link.href = localCssUrl;
             head.appendChild(link)
             console.log('style succesfully loaded');
			 
			 
             //load local js
             $.ajax({
                 url: localScriptUrl,
                 contentType: "application/x-www-form-urlencoded; charset=UTF-8", //immediately starts executing javaScript
                 success: function(data) {
                     console.log('local javascript files loaded, start executing');
                     eval(data); //start executing javascript
                 },
                 error: function(xhr, textStatus, error) {
                     if (status == 'error')
                         console.log("can not load local javaScript, application is failed :( sorry");

                 }
             });

             

         }
     });



 }