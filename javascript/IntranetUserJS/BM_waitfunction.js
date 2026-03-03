
    // Vänt-funktion med uppräkning av försök
    // ver 2.0

    var waitcounter = 0;

    var waitForEl = function (selector, callback) {
        console.log(`Waitcount for ${selector}: ${waitcounter}`);

        waitcounter++;

        if (jQuery(selector).length) {
            console.log(`Waitcount for ${selector}: ${waitcounter}`);
            waitcounter = 0;
            callback();
        } else {
            if (waitcounter < 50) {
                setTimeout(function () {
                    waitForEl(selector, callback);
                }, 100);
            } else {
                console.log('Waitcount took too long time...');
            }
        }
    };