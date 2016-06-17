
var element = document.createElement("input");

element.type = 'button';
element.value = "Enable All";

element.style.position = "fixed";
element.style.zIndex = "9999";
element.style.right = "0";
element.style.top = "0";
element.style.backgroundColor = '#9C8C42';
element.style.border = '2px solid #91782c';
element.style.color = '#FFF';
element.style.textAalign = 'center';
element.style.borderRradius = '4px';
element.style.padding = '3px';
element.style.cursor = 'pointer';
element.style.opacity = '0';

element.onclick = function () {
  var selectors = ['button', 'input', 'textarea', 'select', 'li', 'a', 'fieldset', 'div', 'img'];
  selectors.forEach(function (selector) {
    var elems = document.getElementsByTagName(selector);
    elems.forEach(function (el) {
      el.disabled = false;
      el.classList.remove("disabled");
      el.readOnly = false;
    });
  });
};

element.onmouseover = function (btn) {
  btn.srcElement.style.opacity = '1';
}

element.onmouseout = function (btn) {
  btn.srcElement.style.opacity = '0';
}


document.body.insertBefore(element, document.body.firstChild);

