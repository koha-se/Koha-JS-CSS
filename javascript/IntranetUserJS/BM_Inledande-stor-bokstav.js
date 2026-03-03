    // *************************************************************************************
    // - Låntagare / Registrering
    //
    // Stor bokstav i början på alla namn och adresser på låntagaranmälan och redigering
    // ver 1.1
    // ( Kompatibel med 25.05 )

    jQuery.fn.capitalize = function () {
        $(this[0]).keyup(function (event) {
            var box = event.target;
            var txt = $(this).val();
            var stringStart = box.selectionStart;
            var stringEnd = box.selectionEnd;
            $(this).val(txt.replace(/^(.)|(\s|\-)(.)/g, function ($word) {
                return $word.toUpperCase();
            }));
            box.setSelectionRange(stringStart, stringEnd);
        });
        return this;
    };

    jQuery.fn.capitalizefw = function () {
        $(this).keyup(function (event) {
            var textBox = event.target;
            var start = textBox.selectionStart;
            var end = textBox.selectionEnd;
            textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1);
            textBox.setSelectionRange(start, end);
        });
        return this;
    };

    $('#surname, #firstname, #city, #country, #B_city, #B_country').addClass('capitalizer');
    $('#address, #address2, #B_address, #B_address2').addClass('capitalizerfw');

    $('.capitalizer').on('input', function () {
        $(this).capitalize();
    });

    $('.capitalizerfw').on('input', function () {
        $(this).capitalizefw();
    });