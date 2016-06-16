
addButton();
function addButton(){
var element = document.createElement("input");

element.type = 'button';
element.value = 'Enable';
element.name = 'test';
element.style.position = "fixed";
element.style.zIndex = "9999";
element.style.right = "0";
element.classList.add('btn');
element.classList.add('btn-default');
element.onclick = function() {
  var selectors = ['button', 'input', 'textarea', 'select', 'li', 'a','fieldset','div','img'];
  selectors.forEach(function(selector) {
    var elems = document.getElementsByTagName(selector);
    for (i = 0; i < elems.length; i++) {
      elems[i].disabled = false;
      elems[i].classList.remove("disabled");
	  elems[i].readOnly  = false;
    }
  });
};

element.onmouseover = function(btn){
   btn.srcElement.style.opacity='1';
}

element.onmouseout = function(btn){
   btn.srcElement.style.opacity='0';
}

 debugger;
 document.body.insertBefore(element, document.body.firstChild);
}

