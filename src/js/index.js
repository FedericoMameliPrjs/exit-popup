//window.ShowPopupOnScroll = require('./ShowPopupOnScroll').ShowPopupOnScroll;
//window.EdgePopup = require('./EdgePopup').EdgePopup;

require('./mobileCheck');
require('./TouchDirectionEvent');

window.ExitPopup = require('./ExitPopup').ExitPopup;

if(process.env.NODE_ENV === 'development'){
    const exitModal = new ExitPopup({touch: 'top', desk: 'center'});

    exitModal.getExitModalElement().addEventListener('exitmodal.shown', function(){
        console.log('ExitModal shown');
    });

    exitModal.getExitModalElement().addEventListener('exitmodal.hidden', function(){
        console.log('ExitModal hidden');
    });
}