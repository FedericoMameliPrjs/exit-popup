import {name, version} from "../../package.json";


/*
* class ExitModal
* @param config => (Object)
*   - position : (Object) Definisce la posizione del modal, separatamente per dispositivi touch e desktop
*   - showOnStart: (Boolean) Mostra il modal al caricamento della pagina
*   - backdrop: (Boolean) Mostra o nasconde il backdrop
*   -showAfter: (Number) il modal viene mostrato dopo n secondi / default 0
*
* */
export class ExitModal{

    constructor(config = {}){
        this.popupEl = this._getPopupElement();
        this.isTouchDevice = this._checkScreenDeviceType();
        this.position = this._validateConfig(config, 'position', {touch: 'bottom', desk: 'top'});
        this.showOnStart = this._validateConfig(config, 'showOnStart', false);
        this.backdrop = this._validateConfig(config, 'backdrop', true);
        this.showAfter = this._validateConfig(config, 'showAfter', 0);
        this.popupShown = false;

        this._initPopup();
    }

    /*===GETS===*/
    getVersion(){ return `Exit Modal v${version}`; }

    _getCssClasses(){
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
    }

    _getAllowedConfigProperties(){
        return ['showOnStart', 'backdrop', 'position', 'showAfter'];
    }

    _getPopupElement(){
        let el = document.querySelector(this._getCssClasses().exitPopup);
        if(!el)
            console.error('ExitModal Error: element not found.');

        return el;
    }

    getExitModalElement(){
        return this.popupEl;
    }

    _getEventsNames(){
        return{
            shown: 'exit-modal.shown',
            hidden: 'exit-modal.hidden'
        }
    }

    _getEvents(){
        return {
            shown: new Event(this._getEventsNames().shown),
            hidden: new Event(this._getEventsNames().hidden)
        }
    }

    _getErrors(){
        return{
            configNotValid: ''
        }
    }

    /*===constructor config===*/
    _validateConfig(config, property, defaultValue = null){
        if(typeof config === 'object'){
            if(this._getAllowedConfigProperties().includes(property)) return config.hasOwnProperty(property) ? config[property] : defaultValue;
            else return undefined;
        }else
            console.error(this._getErrors().configNotValid);
    }

    /*===DEVICE TYPE===*/
    _checkScreenDeviceType(){
        return (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) || mobileCheck();
    }

    _setPosition(){
        this.position = this.isTouchDevice ? this.position.touch : this.position.desk;
    }

    /*===RESET BOOTSTRAP MODAL===*/
    _resetBootstrapModal(){
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
    }

    _setPopupPosition(){
        //const positionVal = this.isTouchDevice ? this.position.touch : this.position.desk;
        this.popupEl.classList.add(this._getCssClasses().position[this.position].replace('.', ''));
    }

    _setCloseEvents(){
        const closeBtnEl = document.querySelector(this._getCssClasses().popupCloseBtn);
        if(this.backdrop){
            const backdrop = document.querySelector(this._getCssClasses().backdrop);
            backdrop.addEventListener('click', this._hidePopup.bind(this));
        }

        closeBtnEl.addEventListener('click', this._hidePopup.bind(this));
    }

    _removeCloseEvents(){
        const closeBtnEl = document.querySelector(this._getCssClasses().popupCloseBtn);
        if(this.backdrop){
            const backdrop = document.querySelector(this._getCssClasses().backdrop);
            backdrop.removeEventListener('click', this._hidePopup.bind(this));
        }

        closeBtnEl.removeEventListener('click', this._hidePopup.bind(this));
    }

    _triggerEvent(device){
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
    }

    _setScrollEvents(){
        const event = {
            name: this.isTouchDevice ? 'touchdirection' : 'mousemove',
            fn: this._triggerEvent(this.isTouchDevice ? 'touch' : 'desktop')
        };

        document.addEventListener(event.name, event.fn);
    }

    _removeScrollEvents(){
        const event = {
            name: this.isTouchDevice ? 'touchdirection' : 'mousemove',
            fn: this._triggerEvent(this.isTouchDevice ? 'touch' : 'desktop')
        };

        document.removeEventListener(event.name, event.fn);
    }

    _showOnStart(){
        if(this.showOnStart)
            this.popupEl.classList.add(this._getCssClasses().visibility[this.position].show.replace('.', ''));
        else
            this.popupEl.classList.add(this._getCssClasses().visibility[this.position].hide.replace('.', ''));
    }

    _createCloseBtn(){
        if(!this.popupEl.querySelector(this._getCssClasses().popupCloseBtn)){
            const closeBtn = document.createElement('button');
                  closeBtn.classList.add(this._getCssClasses().popupCloseBtn.replace('.', ''));
                  closeBtn.innerText = 'X';
            this.popupEl.insertAdjacentElement('afterbegin', closeBtn);
        }
    }

    _initPopup(){
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
    }

    _createBackdrop(){
        const backdropElement = document.createElement('div');
        backdropElement.classList.add(this._getCssClasses().backdrop.replace('.',''));

        document.body.insertAdjacentElement('beforeend', backdropElement);
        setTimeout(() => backdropElement.style.opacity = 1 , 200);
        document.body.style.overflowY = 'hidden';
    }

    _destroyBackdrop(){
        const backdrop = document.querySelector(this._getCssClasses().backdrop);
        backdrop.removeEventListener('click', this._hidePopup.bind(this));
        backdrop.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(backdrop);
        }, 200);

        document.body.style.overflowY = 'initial';
    }

    shown(fn){
        this.popupEl.addEventListener(this._getEventsNames().shown, fn);
    }

    hidden(fn){
        this.popupEl.addEventListener(this._getEventsNames().hidden, fn);
    }

    _showPopup(){
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
    }

    _hidePopup(){
        if(this.backdrop)
            this._destroyBackdrop();

        this._removeCloseEvents();

        this.popupEl.classList.remove(this._getCssClasses().visibility[this.position].show.replace('.', ''));
        this.popupEl.classList.add(this._getCssClasses().visibility[this.position].hide.replace('.', ''));

        //emit open event
        this.popupEl.dispatchEvent(this._getEvents().hidden);
    }
}

