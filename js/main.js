$(document).ready(function() {

    /*!
     * Asta Carousel.js v0.0.8-alpha
     * License: MIT
     */

    (function () {

        var cloned_items, direction, startX, endX, distance,
            start_index = 3,
            current_index = start_index,
            prev_index = 0,
            next_index = 0,
            item_opacity = .5,
            item_width = 60,
            original_width = 33.33,
            debounceInterval = 250;

        function debounce(func, wait, immediate) {

            var timeout;

            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };

                var callNow = immediate && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);

                if (callNow) func.apply(context, args);
            };
        };

        function touchStart(e) {
            startX = e.touches[0].clientX;
        }

        function touchMove(e) {

            direction = (e.touches[0].clientX > startX) ? 'prev' : 'next';

            if (direction == 'prev') {
                distance = Math.ceil(startX - e.touches[0].clientX);
            } else {
                distance = Math.ceil(e.touches[0].clientX - startX);
            }
        }

        function touchEnd(e) {
            (direction == 'next') ? next() : prev();
        }

        function refreshIndexes() {

            // prev index
            if (current_index === carousel_length - 1) {
                prev_index = carousel_length - 2;
            } else if (current_index === 0) {
                prev_index = carousel_length - 1;
            } else {
                prev_index = current_index - 1;
            }

            // next index
            if (current_index === carousel_length - 1) {
                next_index = 0;
            } else {
                next_index = current_index + 1;
            }

            console.info(prev_index, current_index, next_index);
        }

        function changeItems(resize) {

            carousel_items.addClass('is-animating');

            carousel_items
                .filter(function(index) {
                    return index != prev_index && index != current_index && index !== next_index;
                })
                .css({
                    opacity    : 0,
                    position   : 'absolute',
                    top        : '50%',
                    marginTop  : Math.ceil(carousel_items.eq(resize ? prev_index : current_index).outerHeight() / 2 * -1),
                    left       : '50%',
                    marginLeft : Math.ceil(carousel_items.eq(resize ? prev_index : current_index).outerWidth() / 2 * -1)
                });

            carousel_items.eq(prev_index).css({
                opacity    : item_opacity,
                width      : original_width + '%',
                zIndex     : 20,
                left       : 0,
                marginLeft : 0,
                top        : '50%',
                marginTop  : Math.ceil(carousel_items.eq(resize ? prev_index : current_index).outerHeight() / 2 * -1)
            });

            carousel_items.eq(next_index).css({
                opacity    : item_opacity,
                width      : original_width + '%',
                zIndex     : 20,
                left       : carousel.width() - carousel_items.eq(resize ? prev_index : current_index).outerWidth(),
                marginLeft : 0,
                top        : '50%',
                marginTop  : Math.ceil(carousel_items.eq(resize ? prev_index : current_index).outerHeight() / 2 * -1),
            });


            carousel_items.eq(current_index).css({
                opacity    : 1,
                width      : item_width + '%',
                zIndex     : 100,
                top        : 0,
                marginTop  : 0,
                left       : '50%',
                marginLeft : (item_width / 2 *-1) + '%',
            });
        }

        var prev = function(event) {

            if (typeof event !== 'undefined') {
                event.preventDefault();
            }

            current_index = current_index - 1;

            if (current_index < 0) {
                current_index = carousel_length - 1;
            } else if (current_index === carousel_length - 1) {
                current_index = 0;
            }

            refreshIndexes();
            changeItems();

        };

        var next = function(event) {

            if (typeof event !== 'undefined') {
                event.preventDefault();
            }

            current_index = current_index + 1;

            if (current_index === carousel_length) {
                current_index = 0;
            }

            refreshIndexes();
            changeItems();
        };

        var carousel = $('#asta-carousel');
        var carousel_items = $('.asta-carousel__item');
        var carousel_length = carousel_items.length;
        var buttons = {
            prev : $('.button-prev'),
            next : $('.button-next')
        }

        if (carousel_length == 3) {

            carousel_items
                .clone()
                .addClass('cloned')
                .appendTo(carousel);

            carousel_items = $('.asta-carousel__item');
            carousel_length = carousel_items.length;
        }

        carousel_items.css({
            opacity    : item_opacity,
            position   : 'absolute',
            top        : '50%',
            marginTop  : Math.ceil(carousel_items.eq(current_index).outerHeight() / 2 * -1),
            left       : '50%',
            marginLeft : Math.ceil(carousel_items.eq(current_index).outerWidth() / 2 * -1),
        });

        var refreshPosition = debounce(function() {

            refreshIndexes();
            changeItems(true);

            setTimeout(function() {

                carousel.css({
                    height : carousel_items.eq(current_index).outerHeight()
                });

            }, debounceInterval);

        }, debounceInterval);

        refreshPosition();

        if (typeof window.ontouchstart !== 'undefined') {
            carousel[0].addEventListener('touchstart', touchStart, false);
            carousel[0].addEventListener('touchmove', touchMove, false);
            carousel[0].addEventListener('touchend', touchEnd, false);
        }

        //TODO : доделать перемещение мышью для ПК
        /*carousel[0].addEventListener('mousedown', touchStart, false);
        carousel[0].addEventListener('mousemove', touchMove, false);
        carousel[0].addEventListener('mouseup', touchEnd, false);*/

        buttons.prev[0].addEventListener('click', prev, false);
        buttons.next[0].addEventListener('click', next, false);

        console.info(carousel);


        window.addEventListener('resize', refreshPosition);

    })(window);

});
