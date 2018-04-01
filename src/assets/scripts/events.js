'use strict';
(function () {
  // Make list element selectable and jump to an url.
  var select = document.getElementById('select-menu')
  if (select.addEventListener) {
    select.addEventListener('change', function () {
      if (this.value) {
        window.location.href = this.value
      }
    })
  } else {
    select.attachEvent('onchange', function () {
      if (this.value) {
        window.location.href = this.value
      }
    })
  }
}())
