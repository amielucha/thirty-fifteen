/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $body, $window, $sidebar, adminbarOffset, top = false,
        bottom = false, windowWidth, windowHeight, lastWindowPos = 0,
        topOffset = 0, bodyHeight, sidebarHeight, resizeTimer;


    var $document = $(document);

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();

        $(".scroll-down").arctic_scroll();

        $(".secondary-toggle").on("click", function(e){
            e.preventDefault();
            $(this).toggleClass("toggled-on");
            $('.secondary').toggleClass("toggled-on");
        });

        // Scrolling
        $body          = $( document.body );
        $window        = $( window );
        $sidebar       = $( '#sidebar' ).first();
        adminbarOffset = $body.is( '.admin-bar' ) ? $( '#wpadminbar' ).height() : 0;

        $window
            .on( 'scroll.twentyfifteen', scroll )
            .on( 'resize.twentyfifteen', function() {
                clearTimeout( resizeTimer );
                resizeTimer = setTimeout( resizeAndScroll, 500 );
            } );
        $sidebar.on( 'click keydown', 'button', resizeAndScroll );

        resizeAndScroll();

        for ( var i = 1; i < 6; i++ ) {
            setTimeout( resizeAndScroll, 100 * i );
        }

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };

    // Sidebar scrolling.
    function resize() {
        windowWidth   = $window.width();
        windowHeight  = $window.height();
        bodyHeight    = $body.height();
        sidebarHeight = $sidebar.height();

        if ( 955 > windowWidth ) {
            top = bottom = false;
            $sidebar.removeAttr( 'style' );
        }
    }

    function scroll() {
        var windowPos = $window.scrollTop();

        if ( 955 > windowWidth ) {
            return;
        }

        if ( sidebarHeight + adminbarOffset > windowHeight ) {
            if ( windowPos > lastWindowPos ) {
                if ( top ) {
                    top = false;
                    topOffset = ( $sidebar.offset().top > 0 ) ? $sidebar.offset().top - adminbarOffset : 0;
                    $sidebar.attr( 'style', 'top: ' + topOffset + 'px;' );
                } else if ( ! bottom && windowPos + windowHeight > sidebarHeight + $sidebar.offset().top && sidebarHeight + adminbarOffset < bodyHeight ) {
                    bottom = true;
                    $sidebar.attr( 'style', 'position: fixed; bottom: 0;' );
                }
            } else if ( windowPos < lastWindowPos ) {
                if ( bottom ) {
                    bottom = false;
                    topOffset = ( $sidebar.offset().top > 0 ) ? $sidebar.offset().top - adminbarOffset : 0;
                    $sidebar.attr( 'style', 'top: ' + topOffset + 'px;' );
                } else if ( ! top && windowPos + adminbarOffset < $sidebar.offset().top ) {
                    top = true;
                    $sidebar.attr( 'style', 'position: fixed;' );
                }
            } else {
                top = bottom = false;
                topOffset = ( $sidebar.offset().top > 0 ) ? $sidebar.offset().top - adminbarOffset : 0;
                $sidebar.attr( 'style', 'top: ' + topOffset + 'px;' );
            }
        } else if ( ! top ) {
            top = true;
            $sidebar.attr( 'style', 'position: fixed;' );
        }

        lastWindowPos = windowPos;
    }

    function resizeAndScroll() {
        resize();
        scroll();
    }
})(jQuery);
