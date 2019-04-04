//window.ShowPopupOnScroll = require('./ShowPopupOnScroll').ShowPopupOnScroll;
//window.EdgePopup = require('./EdgePopup').EdgePopup;

require('./mobileCheck');
require('./TouchDirectionEvent');

window.ExitPopup = require('./ExitPopup').ExitPopup;

if(process.env.NODE_ENV === 'development'){
    new ExitPopup({touch: 'top', desk: 'center'});
}