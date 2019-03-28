//window.ShowPopupOnScroll = require('./ShowPopupOnScroll').ShowPopupOnScroll;
//window.EdgePopup = require('./EdgePopup').EdgePopup;

require('./mobileCheck');
require('./TouchDirectionEvent');

window.ExitPopup = require('./ExitPopup').ExitPopup;

window.a = new ExitPopup({
    position: 'bottom',
    backdrop: 1
});