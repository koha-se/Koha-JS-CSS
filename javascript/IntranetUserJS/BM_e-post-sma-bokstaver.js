    // *************************************************************************************
    // Endast småbokstäver i e-postfält
    // ver 1.1
    // ( Kompatibel med 25.05 )

    jQuery.fn.decapitalize = function () {
        $(this).keyup(function (event) {
            var box = event.target;
            var txt = $(this).val();
            var stringStart = box.selectionStart;
            var stringEnd = box.selectionEnd;
            $(this).val(txt.replace(/^(.)|(\s|\-)(.)/g, function ($word) {
                return $word;
            }));
            $(this).val(txt.toLowerCase());
            box.setSelectionRange(stringStart, stringEnd);
        });
        return this;
    };

    $('#email').addClass('decapitalizer');

    $('.decapitalizer').on('input', function () {
        $(this).decapitalize();
    });