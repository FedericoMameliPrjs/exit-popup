//window.ShowPopupOnScroll = require('./ShowPopupOnScroll').ShowPopupOnScroll;
//window.EdgePopup = require('./EdgePopup').EdgePopup;

require('./mobileCheck');
require('./TouchDirectionEvent');

window.ExitPopup = require('./ExitPopup').ExitPopup;

if(process.env.NODE_ENV === 'development'){
    const exitModal = new ExitPopup({touch: 'top', desk: 'center'});

    console.log('%c' + exitModal.getVersion(), 'background: orange; padding: .5rem; border-radius:5px;');

    exitModal.getExitModalElement().addEventListener('exitmodal.shown', function(){
        console.log('ExitModal shown');
    });

    exitModal.getExitModalElement().addEventListener('exitmodal.hidden', function(){
        console.log('ExitModal hidden');
    });
}