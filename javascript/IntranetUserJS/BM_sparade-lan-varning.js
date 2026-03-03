    // *************************************************************************************
    // - Cirkulation
    //
    // SPARADE LÅN - Varning med datum
    // Vid försök av lån tidigare lånad bok så anges nu senast lånat datum i bekräftelserutan, även om annan streckkod av samma titel försöker lånas.
    // ver 4.5
    // Hämtar via REST-api
    // 2025-07-03
    // ( Kompatibel med 23.05 )

    $('#circ_needsconfirmation').each(function () { // Bekräfta lån-rutan
        if ($('#circ_needsconfirmation ul li').text().indexOf('previously ') > -1 || $('#circ_needsconfirmation ul li').text().indexOf('tidigare') > -1) {
            $('#circ_needsconfirmation ul').append('<h4 id="lastdateloading">Hämtar information... <div class="loader"></div></h4>');
            var lastdate = 0;
            var borrower = $('#circ_needsconfirmation input[name="borrowernumber"]').val();
            var barcode = $('#circ_needsconfirmation input[name="barcode"]').val();
            $.ajax({
                url: `/api/v1/items/?external_id=${barcode}&_match=exact`,
                cache: true,
                success: function (item) {
                    $.ajax({
                        url: `/api/v1/checkouts?checked_in=true&_match=exact&q={"item_id":"${item[0].item_id}","patron_id":"${borrower}"}`,
                        cache: true,
                        success: function (data) {
                            lastdate = data.length ? data[0].checkout_date.slice(0, 10) : null;
                            $('#circ_needsconfirmation #lastdateloading').remove();
                            var retMessage = lastdate ? `<b>${lastdate}</b>` : '<b>Okänt</b> <i>(före övergång till koha)</i>';
                            $('#circ_needsconfirmation ul').append('<li style="padding-top:10px" id="lastdate">Senast lånad:\t ' + retMessage + '</li>');
                        },
                        error: function (error) {
                            console.log(error);
                            $('#circ_needsconfirmation #lastdateloading').remove();
                            $('#circ_needsconfirmation ul').append('<li style="padding-top:10px" id="lastdate">Senast lånad:\t <b>Okänt</b> <i>(före övergång till koha)</i></li>');
                        }
                    });
                }
            });
        }
    });