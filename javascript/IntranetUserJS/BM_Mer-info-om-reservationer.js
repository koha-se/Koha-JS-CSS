    // *************************************************************************************
    // Cirkulation - Återlämning / reservationer
    //
    // Hämta mer information om reservationer på återlämningssidan och automatisk utskrift av kvitto vid ENTER-tryckning
    // ver 2.3
    // 2025-12-16
    // ( Kompatibel med 25.05 )

    if ($('#circ_returns').length) {

        $('#hold-found1').on('shown.bs.modal', function (e) {
            $('#hold-found1 .print').css('--bs-btn-focus', 'lightgreen');
            $('#hold-found1 .print').focus();
        });

        $('#hold-found2').on('shown.bs.modal', function (e) {

            console.log('Hold-found2');

            var bibnr = $('.modal-body input[name="biblionumber"]').val();
          
          	// Enter vid reservation
            if ($('#hold-found2').hasClass('show')) {
              $('#hold-found2 .modal-footer .print').css('--bs-btn-bg', 'lightgreen');
              $('#hold-found2 .modal-footer .print').focus();

            }

            //console.log('Biblionumber= ' + bibnr);

            $.ajax({
                type: "GET",
                cache: true,

                url: `/api/v1/holds/?biblio_id=${bibnr}&_per_page=500&_match=exact`,
                success: function (data) {
                    var inTransit = 0;
                    var waiting = 0;
                    for (i = 0; i < data.length; i++) {
                        if (data[i].status == 'T') {
                            inTransit++;
                        }
                        if (data[i].status == 'W') {
                            waiting++;
                        }
                    }
                    var leftRes = data.length - inTransit - waiting;

                    $('#hold-found2 .modal-body').append('<hr /><h4 style="margin-bottom:10px">Reservationsstatus:</h4>');
                    if (leftRes > 0) {
                        $('#hold-found2 .modal-body').append(`<span class="resDetail resExtra">Antal i kö: ${leftRes}</span>`);
                    }
                    if (inTransit > 0) {
                        $('#hold-found2 .modal-body').append(`<span class="resDetail resExtra">Transport: ${inTransit}</span>`);
                    }
                    if (waiting > 0) {
                        $('#hold-found2 .modal-body').append(`<span class="resDetail resExtra">Aviserade: ${waiting}</span>`);
                    }
                    $('#hold-found2 .modal-body').append(`
                            <br />
                            <div style="padding: 1em;">
                                <a href="/cgi-bin/koha/reserve/request.pl?biblionumber=${bibnr}" target="_blank" style="padding-top: 15px;">
                                    Öppna reservationskö i nytt fönster
                                </a>
                            <div>
					`);
                }
            });
        });

        $('#item-transfer-modal').on('shown.bs.modal', function (e) {
            console.log('item-transfer!');
            $('#item-transfer-modal .print').focus();
        });

        $('#wrong-transfer-modal').on('shown.bs.modal', function (e) {
            console.log('wrong-transfer!');
            $('#wrong-transfer-modal .openWin').focus();
        });

    }