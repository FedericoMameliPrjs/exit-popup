export class EdgePopup{
    constructor(config = {}){

        //set element
        this.popupEdgeElement = this._getEdgeElement();
        this.showTimes = this._validateConfig(config, this._getAllowedConfigProperties()[1], null);
        this.backdrop = this._validateConfig(config, this._getAllowedConfigProperties()[2], false);
        this.show = this._validateConfig(config, this._getAllowedConfigProperties()[3], false);

        this.shownTimes = 0;

        this._setEdgePopupListener();
    }

    //private stuff
    _getClasses(){
        return{
            popup: '.popup',
            popupEdge: '.popup-edge',
            showPopupEdge: '.slideDown'
        }
    }

    _getErrors(){
        const pre = '[Edge Popup Error]:';
        return {
            elementNotFound: `${pre} Element not found, there must be an element with .popup-edge or .popup classes.`,
            configNotValid: `${pre} Config is not an object`
        }
    }

    _getEdgeElement(){
        let popupEdgeElement = document.querySelector(this._getClasses().popupEdge);

        if(!popupEdgeElement){
            const popupElement = document.querySelector(this._getClasses().popup);
            if(popupElement){
                popupElement.classList.add(this._getClasses().popupEdge.replace('.', ''));
                popupEdgeElement = popupElement;
            }
            else{
                popupEdgeElement = false;
                console.error(this._getErrors().elementNotFound);
            }
        }

        if(popupEdgeElement.classList.contains('hideDown')){
            popupEdgeElement.classList.remove('hideDown');
            popupEdgeElement.classList.remove('popup');
        }

        return popupEdgeElement;
    }

     _getAllowedConfigProperties(){
        return [
            'breakpoint',
            'showTimes',
            'backdrop',
            'show'
        ];
    }

    _validateConfig(config, property, defaultValue = null){
        if(typeof config === 'object'){
            if(this._getAllowedConfigProperties().includes(property)) return config.hasOwnProperty(property) ? config[property] : defaultValue;
            else return undefined;
        }else
            console.error(this._getErrors().configNotValid);
    }

    _setEdgePopupListener(){
        document.addEventListener('mouseleave', e => {
            if(e.y <= 0) {
                this._showPopup();
            }
        });
    }

    _showPopup(){
        if((this.shownTimes < this.showTimes) || this.showTimes === null) {
            console.log('show');
            this.popupEdgeElement.classList.add(this._getClasses().showPopupEdge.replace('.', ''));
            this.shownTimes++;
        }
    }

    _closePopup(){
        this.popupEdgeElement.classList.remove(this._getClasses().showPopupEdge.replace('.', ''));
    }
}

/*
* config = {
*   breakpoint: Number  -> serve per verificare se mostrare o meno l'edgePopup
*
* }
*
* */