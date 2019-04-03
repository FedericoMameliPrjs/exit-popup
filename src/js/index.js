//window.ShowPopupOnScroll = require('./ShowPopupOnScroll').ShowPopupOnScroll;
//window.EdgePopup = require('./EdgePopup').EdgePopup;

require('./mobileCheck');
require('./TouchDirectionEvent');

window.ExitPopup = require('./ExitPopup').ExitPopup;
new ExitPopup({position: 'bottom'});