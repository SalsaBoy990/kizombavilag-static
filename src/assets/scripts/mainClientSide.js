/* global top, self, alert */
'use strict'
if (top.location.href !== self.location.href) {
  top.location.href = self.location.href
  alert('For security reasons, framing is not allowed. Click OK to remove the frames.')
}
window.onload = function () {
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
}
