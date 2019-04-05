import {name, version} from "../../package.json";

export class ExitModal{

    constructor(config = {}){
        this.popupEl = this._getPopupElement();
        this.isTouchDevice = this._checkScreenDeviceType();
        this.position = this._validateConfig(config, 'position', {touch: 'bottom', desk: 'top'});
        this.showOnStart = this._validateConfig(config, 'showOnStart', false);
        this.backdrop = this._validateConfig(config, 'backdrop', true);
        //this.threshold = this._validateConfig(config, 'threshold', 'first');//mobile only
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
        return ['showOnStart', 'backdrop', 'position'];
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

    _getEvents(){
        return {
            shown: new Event('exitmodal.shown'),
            hidden: new Event('exitmodal.hidden')
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
                show: false
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

    _setScrollEvents() {
        if (this.isTouchDevice) {
            document.addEventListener('touchdirection', event => {
                if (event.detail.touchDirection === 'bottom' && !this.popupShown)
                    this._showPopup();
            });
        }
        else {
            document.addEventListener('mousemove', event => {
                if (event.clientY <= 10 && !this.popupShown)
                    this._showPopup();
            });
        }
    }

    _showOnStart(){
        if(this.showOnStart)
            this.popupEl.classList.add(this._getCssClasses().visibility[this.position].show.replace('.', ''));
        else
            this.popupEl.classList.add(this._getCssClasses().visibility[this.position].hide.replace('.', ''));
    }

    _initPopup(){
        this._setPosition();
        //check if the popup is a bootstrap modal
        this._resetBootstrapModal();

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
        backdrop.addEventListener('transitionend', el => {
            document.body.removeChild(el.target);
        });
    }

    _showPopup(){
        //mostro backdrop
        if(this.backdrop) this._createBackdrop();

        this._setCloseEvents();

        this.popupEl.classList.remove(this._getCssClasses().visibility[this.position].hide.replace('.', ''));
        this.popupEl.classList.add(this._getCssClasses().visibility[this.position].show.replace('.', ''));

        //emit open event
        this.popupEl.dispatchEvent(this._getEvents().shown);

        this.popupShown = true;
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

/*
* config => {
*   showOnStart :> Mostra il popup al caricamento della pagina [boolean|number]
*   backdrop :> Mostra uno sfondo con click per chiudere il popup [boolean]
*   position: Definisce la posizione del modal [String] => 'top' | 'bottom' ('top' default)
*   threshold: Definisce una soglia che,  una volta superata,  mostra il modal [String] => 'first', 'center', 'last'
* }
*
* */