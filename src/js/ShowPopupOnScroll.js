export class ShowPopupOnScroll{

    constructor(config = {}){
        this.popupElement = document.querySelector(this.constructor._getClasses().popupBox);
        this.breakpoint = this._validateConfig(config, this.constructor._getAllowedConfigProperties()[0], null); //aggiungere se pensare in max-width o min-width
        this.showTimes = this._validateConfig(config, this.constructor._getAllowedConfigProperties()[1], null);
        this.backdrop = this._validateConfig(config, this.constructor._getAllowedConfigProperties()[2], false);
        this.show = this._validateConfig(config, this.constructor._getAllowedConfigProperties()[3], false);

        this.shownTimes = 0;
        this.nScrolls = document.body.offsetHeight / innerHeight;
        this.lastScrollAmount = innerHeight * (this.nScrolls - Math.floor(this.nScrolls));
        this.threshold = document.body.offsetHeight - this.lastScrollAmount;
        this.userPosition = scrollY + innerHeight;
        this._isBootstrapModal();


        this.init();
    }

    /*PRIVATE STUFF*/
    static _getClasses(){
        return {
            popupBox: '.popup',
            popupShowUp: '.showUp',
            popupHideDown: '.hideDown',
            popupCloseBtn: '.popup-close',
            popupBackdrop: '.popup-backdrop'
        };
    }

    static _getAllowedConfigProperties(){
        return [
            'breakpoint',
            'showTimes',
            'backdrop',
            'show'
        ];
    }


    init(){
        /*verifico breakpoint*/
        if(this.breakpoint !== null && this.breakpoint > 0){

            if((innerWidth < this.breakpoint)){
                this._showOnStart();
                window.addEventListener('scroll', this._scrollEvent.bind(this));
            }

            //setto evento per la chiusura
            document.querySelector(this.constructor._getClasses().popupCloseBtn).addEventListener('click', this._onCloseEvent.bind(this));

            window.addEventListener('keyup', key => {
                if(key.key.toUpperCase() === 'ESCAPE')
                    this._onCloseEvent();
                });
        }else throw "Breakpoint option must be greater then 0.";
    }

    _validateConfig(config, property, defaultValue = null){
        if(typeof config === 'object'){
            if(this.constructor._getAllowedConfigProperties().includes(property)) return config.hasOwnProperty(property) ? config[property] : defaultValue;
            else return undefined;
        }else
            throw "Config is not an object";
    }

    _showOnStart(){
        if(this.show){
             this._showBackdrop();
             this.popup('show');
        }
        else {
            this.shownTimes = -1;
            this.popup('hide');
        }
    }

    _isBootstrapModal(){
        if(this.popupElement.classList.contains('modal')){
            //remove close event on button
            const modalCloseBnt = document.querySelector('.modal.popup button.close');
                  modalCloseBnt.attributes["data-dismiss"].value = "";
                  modalCloseBnt.classList.remove('close');
                  modalCloseBnt.classList.add(this.constructor._getClasses().popupCloseBtn.replace('.', ''));

            $(this.popupElement).modal({
                backdrop: false,
                keyboard: false,
                show: true
            });

            document.querySelector('body').classList.remove('modal-open');
        }
    }

    _createBackdrop(){
        const backdropElement = document.createElement('div');
              backdropElement.classList.add(this.constructor._getClasses().popupBackdrop.replace('.',''));

        document.body.insertAdjacentElement('beforeend', backdropElement);
        document.body.style.overflowY = 'hidden';

        return backdropElement;
    }

    _removeBackdrop(){
        document.body.removeChild(document.querySelector(this.constructor._getClasses().popupBackdrop));
        document.body.style.overflowY = 'initial';
    }

    _scrollEvent() {
        //posso mostrare il popup?
        if((this.shownTimes < this.showTimes) || this.showTimes === null) {
            //se il popup e' stato mostrato meno volte di quanto dovrei si

            //ho superato il threshold e sto e sto risalendo su?
            if (((scrollY + innerHeight) > this.threshold) && ((scrollY+innerHeight) < this.userPosition)) {
                //1. si, se non trovo 'backdrop' nel dom e devo crearlo => lo creo
                this._showBackdrop();

                //2. mostro il popup
                this.popup('show');
            }

            //salvo posizione dell'utente
            this.userPosition = (scrollY + innerHeight);
        }
        else
            window.removeEventListener('scroll', this._scrollEvent)
    }

    _onCloseEvent(){
        if(document.querySelector(this.constructor._getClasses().popupBackdrop))
            this._removeBackdrop();

        this.popup('hide');
    }

    _showBackdrop(){
        if (!document.querySelector(this.constructor._getClasses().popupBackdrop) && this.backdrop) {
            let backdropElement = this._createBackdrop();

            //Al click sul backdrop devo chiudere il popup?
            if (this.backdrop === true)
                backdropElement.addEventListener('click', this._onCloseEvent.bind(this));
        }
    }

    popup(v){
        switch (v) {
            case 'show':
                document.querySelector(this.constructor._getClasses().popupBox).classList.remove('hideDown');
                document.querySelector(this.constructor._getClasses().popupBox).classList.add('showUp');
                break;
            case 'hide':
                document.querySelector(this.constructor._getClasses().popupBox).classList.remove('showUp');
                document.querySelector(this.constructor._getClasses().popupBox).classList.add('hideDown');
                this.shownTimes++;
                break;
        }
    }

}