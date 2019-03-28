/*Helper for detect the touch movements on touch screens*/
(function(){
    var touchStartY;
    var touchEndY;
    var touchDirection;

    document.addEventListener('touchstart', function(event){touchStartY = event.touches[0].clientY;});

    document.addEventListener('touchmove', function(event){touchEndY = event.touches[0].clientY;});

    document.addEventListener('touchend', function(){
        touchDirection = touchStartY > touchEndY ? 'top' : 'bottom';

        document.dispatchEvent(new CustomEvent('touchdirection', {detail:{touchDirection}}));
    });
})();