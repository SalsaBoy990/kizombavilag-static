/* global top, self, alert */
'use strict'
if (top.location.href !== self.location.href) {
  top.location.href = self.location.href
  alert('For security reasons, framing is not allowed. Click OK to remove the frames.')
}
