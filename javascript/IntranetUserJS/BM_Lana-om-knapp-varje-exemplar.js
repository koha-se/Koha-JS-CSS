    // *************************************************************************************
    // - Cirkulation
    //
    // Låna om-knapp för varje utlånat exemplar
    // ver 1.6
    // 2025-06-13
    // ( Kompatibel med 25.05 )

    function renewButtons() {

        $('.renew:visible').each(function () {
            var itemId = $(this).val();
            $(this).parent().parent().append(`<button type="button" class="btn btn-primary btn-xs renewlink" value="${itemId}">Låna om</button>`);
        });

        $('.renewlink').on('click', function (event) {
            event.preventDefault();
            var id = $(this).val();
            $(".renew:visible").prop("checked", false);
            $(this).siblings().find('.renew').prop('checked', true);
            $('#RenewChecked').trigger('click');
            $(".renew:visible").prop("checked", true);
        });

        $('.renewals-disabled:visible').each(function () {
            $(this).parent().append('<i class="fa-regular fa-face-frown" style="float:right;font-size:x-large;color:#d0d0d0;"></i>');
        });
    }

    //  OBS! Issues-table


    if ($('#circ_circulation, #pat_moremember').length) {
        var renewed = 0;
        issueT = $('#issues-table');
        issueT.on('draw.dt', function () {
            if (!$('.sadsmiley').length) {
                if (!$('.renewlink').length) {
                    renewButtons();
                }
            }
        });
    }