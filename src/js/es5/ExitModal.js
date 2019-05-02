//

//constructor
var ExitModal = function (config) {
    if(!config) config = {};

    this.popupEl = this._getPopupElement();
    this.isTouchDevice = this._checkScreenDeviceType();
    this.position = this._validateConfig(config, 'position', {touch: 'bottom', desk: 'top'});
    this.showOnStart = this._validateConfig(config, 'showOnStart', false);
    this.backdrop = this._validateConfig(config, 'backdrop', true);
    this.showAfter = this._validateConfig(config, 'showAfter', 0);
    this.popupShown = false;

    this._initPopup();
};

//get css class names
ExitModal.prototype._getCssClasses = function(){
    return{
        exitPopup: '.exit-modal',
        popupCloseBtn: '.exit-modal-close',
        backdrop: '.exit-modal-backdrop',
        visibility:{
            top: {show: '.showDown', hide: '.hideUp'},
            center: {show: '.showDown', hide: '.hideUp'},
            bottom: {show: '.showUp', hide: '.hideDown'}
        },
        position: {
            top: '.top',
            center: '.center',
            bottom: '.bottom'
        },
        bootstrap:{
            modal: '.modal',
            closeBtn: 'button.close'
        }
    };
};

//get allowed config properties
ExitModal.prototype._getAllowedConfigProperties = function(){
    return ['showOnStart', 'backdrop', 'position', 'showAfter'];
};

//search the exit-modal element
ExitModal.prototype._getPopupElement = function(){
    let el = document.querySelector(this._getCssClasses().exitPopup);
    if(!el)
        console.error('ExitModal Error: element not found.');

    return el;
};

ExitModal.prototype.getExitModalElement = function(){
    return this.popupEl;
};

ExitModal.prototype._getEventsNames = function(){
    return{
        shown: 'exit-modal.shown',
        hidden: 'exit-modal.hidden'
    }
};

ExitModal.prototype._getEvents = function(){
    return {
        shown: new Event(this._getEventsNames().shown),
        hidden: new Event(this._getEventsNames().hidden)
    }
};

ExitModal.prototype._getErrors = function(){
    return{
        configNotValid: ''
    }
};

/*===constructor config===*/
ExitModal.prototype._validateConfig = function(config, property, defaultValue = null){
    if(typeof config === 'object'){
        if(this._getAllowedConfigProperties().includes(property)) return config.hasOwnProperty(property) ? config[property] : defaultValue;
        else return undefined;
    }else
        console.error(this._getErrors().configNotValid);
};

/*===DEVICE TYPE===*/
ExitModal.prototype._checkScreenDeviceType = function(){
    return (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) || mobileCheck();
};

ExitModal.prototype._setPosition = function(){
    this.position = this.isTouchDevice ? this.position.touch : this.position.desk;
};

/*===RESET BOOTSTRAP MODAL===*/
ExitModal.prototype._resetBootstrapModal = function(){
    /*Rimuove gli eventi del modal di bootstrap */
    if(this.popupEl.classList.contains('modal')){
        //remove close event on button
        let q = `${this._getCssClasses().bootstrap.modal}${this._getCssClasses().exitPopup} ${this._getCssClasses().bootstrap.closeBtn}`;
        const modalCloseBnt = document.querySelector(q);
        modalCloseBnt.attributes["data-dismiss"].value = "";
        modalCloseBnt.classList.remove('close');
        modalCloseBnt.classList.add(this._getCssClasses().popupCloseBtn.replace('.', ''));

        $(this.popupEl).modal({
            backdrop: false,
            keyboard: false,
            show: false,
            focus: false
        });

        setTimeout(() => {
            $(this.popupEl).modal('show');
            document.querySelector('body').style.paddingRight = '0';
            document.querySelector('body').classList.remove('modal-open');
        }, 100);
    }
};

ExitModal.prototype._setPopupPosition = function(){
    //const positionVal = this.isTouchDevice ? this.position.touch : this.position.desk;
    this.popupEl.classList.add(this._getCssClasses().position[this.position].replace('.', ''));
};

ExitModal.prototype._setCloseEvents = function(){
    const closeBtnEl = document.querySelector(this._getCssClasses().popupCloseBtn);
    if(this.backdrop){
        const backdrop = document.querySelector(this._getCssClasses().backdrop);
        backdrop.addEventListener('click', this._hidePopup.bind(this));
    }

    closeBtnEl.addEventListener('click', this._hidePopup.bind(this));
};

ExitModal.prototype._removeCloseEvents = function(){
    const closeBtnEl = document.querySelector(this._getCssClasses().popupCloseBtn);
    if(this.backdrop){
        const backdrop = document.querySelector(this._getCssClasses().backdrop);
        backdrop.removeEventListener('click', this._hidePopup.bind(this));
    }

    closeBtnEl.removeEventListener('click', this._hidePopup.bind(this));
};

ExitModal.prototype._triggerEvent = function(device){
    let fn;

    switch (device.toLowerCase()) {
        case 'touch':
            fn = event => {
                if (event.detail.touchDirection === 'bottom' && !this.popupShown)
                    this._showPopup();
            };
            break;
        case 'desktop':
            fn = event => {
                if (event.clientY <= 10 && !this.popupShown)
                    this._showPopup();
            };
            break;
    }

    return fn;
};

ExitModal.prototype._setScrollEvents = function(){
    const event = {
        name: this.isTouchDevice ? 'touchdirection' : 'mousemove',
        fn: this._triggerEvent(this.isTouchDevice ? 'touch' : 'desktop')
    };

    document.addEventListener(event.name, event.fn);
};

ExitModal.prototype._removeScrollEvents = function(){
    const event = {
        name: this.isTouchDevice ? 'touchdirection' : 'mousemove',
        fn: this._triggerEvent(this.isTouchDevice ? 'touch' : 'desktop')
    };

    document.removeEventListener(event.name, event.fn);
};

ExitModal.prototype._showOnStart = function(){
    if(this.showOnStart)
        this.popupEl.classList.add(this._getCssClasses().visibility[this.position].show.replace('.', ''));
    else
        this.popupEl.classList.add(this._getCssClasses().visibility[this.position].hide.replace('.', ''));
};

ExitModal.prototype._createCloseBtn = function(){
    if(!this.popupEl.querySelector(this._getCssClasses().popupCloseBtn)){
        const closeBtn = document.createElement('button');
        closeBtn.classList.add(this._getCssClasses().popupCloseBtn.replace('.', ''));
        closeBtn.innerText = 'X';
        this.popupEl.insertAdjacentElement('afterbegin', closeBtn);
    }
};

ExitModal.prototype._initPopup = function(){
    this.popupEl.style.display = 'block';
    this._setPosition();

    //check if the popup is a bootstrap modal
    this._resetBootstrapModal();

    this._createCloseBtn();

    //set the position of popup
    this._setPopupPosition();

    //set events
    this._setScrollEvents();

    this._showOnStart();
};

ExitModal.prototype._createBackdrop = function(){
    const backdropElement = document.createElement('div');
    backdropElement.classList.add(this._getCssClasses().backdrop.replace('.',''));

    document.body.insertAdjacentElement('beforeend', backdropElement);
    setTimeout(() => backdropElement.style.opacity = '1' , 200);
    document.body.style.overflowY = 'hidden';
};

ExitModal.prototype._destroyBackdrop = function(){
    const backdrop = document.querySelector(this._getCssClasses().backdrop);
    backdrop.removeEventListener('click', this._hidePopup.bind(this));
    backdrop.style.opacity = '0';
    setTimeout(() => {
        document.body.removeChild(backdrop);
    }, 200);

    document.body.style.overflowY = 'initial';
};

ExitModal.prototype.shown = function(fn){
    this.popupEl.addEventListener(this._getEventsNames().shown, fn);
};

ExitModal.prototype.hidden = function(fn){
    this.popupEl.addEventListener(this._getEventsNames().hidden, fn);
};

ExitModal.prototype._showPopup = function(){
    //rimuovo trigger per attivare popup
    this._removeScrollEvents();

    this.popupShown = true;
    //faccio partire timer e mostro popup
    setTimeout(() => {
        //mostro backdrop
        if(this.backdrop) this._createBackdrop();

        this._setCloseEvents();

        this.popupEl.classList.remove(this._getCssClasses().visibility[this.position].hide.replace('.', ''));
        this.popupEl.classList.add(this._getCssClasses().visibility[this.position].show.replace('.', ''));

        //emit open event
        this.popupEl.dispatchEvent(this._getEvents().shown);
    }, this.showAfter);
};

ExitModal.prototype._hidePopup = function(){
    if(this.backdrop)
        this._destroyBackdrop();

    this._removeCloseEvents();

    this.popupEl.classList.remove(this._getCssClasses().visibility[this.position].show.replace('.', ''));
    this.popupEl.classList.add(this._getCssClasses().visibility[this.position].hide.replace('.', ''));

    //emit open event
    this.popupEl.dispatchEvent(this._getEvents().hidden);
};


function mobileCheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

/*Helper for detect the touch movements on touch screens*/
(function(){
    var touchStartY;
    var touchEndY;
    var touchDirection;

    document.addEventListener('touchstart', function(event){touchStartY = event.touches[0].clientY;});
    document.addEventListener('touchmove', function(event){touchEndY = event.touches[0].clientY;});
    document.addEventListener('touchend', function(){
        touchDirection = touchStartY > touchEndY ? 'top' : 'bottom';

        document.dispatchEvent(new CustomEvent('touchdirection', {detail:{touchDirection, touchStartY, touchEndY}}));
    });
})();