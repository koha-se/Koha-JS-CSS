    // *************************************************************************************
    // - Cirkulation / Reservation
    //
    // Snabbaccess till senaste låntagare vid reservation
    // ver 2.6
    // 2025-06-11
    // ( Kompatibel med 25.05 )

    if ($('#circ_request').length) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var biblionumber = urlParams.get('biblionumber');

        if (localStorage.getItem('lastpatron')) {
            var name = localStorage.getItem('lastpatron');
            var patronlink = localStorage.getItem('patronlink');
            $(`
                <br />
                <br />
                <span>Reservera för senaste låntagaren: </span>
                <a href="/cgi-bin/koha/reserve/request.pl?biblionumber=${biblionumber}&${patronlink}" id="hold">${name}</a>`).appendTo('#holds_patronsearch_pane_panel');

            //$('<span> </span><div class="btn btn-group" style="vertical-align:unset;"><button id="lastpatrons_res" class="dropdown-toggle" data-bs-toggle="dropdown">Fler<span class="caret"></span></button><ul id="patron-dropdown2" class="dropdown-menu"></ul></div>').appendTo('#holds_patronsearch_pane_panel');

            $(`
                <span> </span>
                <div class="btn-group" style="vertical-align:unset;">
                    <a href="" id="lastpatrons_res" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                        Fler
                        <span class="caret"></span>
                    </a>
                    <ul id="patron-dropdown2" class="dropdown-menu"></ul>
                </div>`).appendTo('#holds_patronsearch_pane_panel');

            $('#lastpatrons_res').on('click', function (event) { // Öppna listan med senaste låntagare
                var reslp = localStorage.getItem('lastpatrons');
                var resnames = reslp.split(",");
                var respl = localStorage.getItem('patronlinks');
                var reslinks = respl.split(",");
                var rests = localStorage.getItem('timestamps');
                var restimes = rests.split(",");
                var reslist = $("#patron-dropdown2");
                var resparent = reslist.parent();

                reslist.detach().empty().each(function (i) {
                    for (var x = 0; x < resnames.length; x++) {
                        $(this).append(`
                            <li>
                                <a class="dropdown-item" href="/cgi-bin/koha/reserve/request.pl?biblionumber=${biblionumber}&${reslinks[x]}" id="hold">
                                    <span class="timestamps">${restimes[x].slice(0, 5)}</span>
                                    ${resnames[x]}
                                </a>
                            </li>`);
                        if (x == resnames.length - 1) {
                            $(this).appendTo(resparent);
                        }
                    }
                });
            });
        }
    }