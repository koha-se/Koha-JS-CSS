    // *************************************************************************************
    // - Cirkulation / Searchbar
    //
    // Spara senaste låntagare som lånat eller återlämnat
    // ver 3.6
    // 2025-06-11
    // ( Kompatibel med 25.05 )

    $('#checkedintable tr:nth-child(1) td.ci-patron a:first, #hold-request-form').each(function () {  // Senaste låntagaren som återlämnat eller reserverat
        var checkedinpatron;
        if ($('#hold-request-form').length) {
            checkedinpatron = $('input[name="borrowernumber"]').val();
        } else {
            checkedinpatron = $(this).attr('href');
        }
        checkedinpatron = checkedinpatron.slice(checkedinpatron.indexOf('=') + 1);
        var patronname;
        var patronlink = 'borrowernumber=' + checkedinpatron;

        $.ajax({
            url: '/api/v1/patrons/',
            data: { "patron_id": checkedinpatron },
            cache: true
        }).done(function (data) {
            patronname = `${data[0].firstname} ${data[0].surname} (${data[0].cardnumber})`;

            var checkedin = $('#circ_returns').length ? ' [ Återlämnat ]' : '';

            localStorage.setItem('lastpatron', patronname + checkedin);

            patronlink = patronlink.slice(patronlink.indexOf('?') + 1);

            localStorage.setItem('patronlink', patronlink);
            savePatron();

        });
    });

    if ($('#circ_circulation').length || $('#pat_moremember').length) {
        $('div.patroninfo h5').each(function () {  // Spara senaste låntagaren som laddats
            var name = $(this).text().replace(/\s+/g, " ");
            var borrowernumber = $('.patronborrowernumber').text().trim();
            borrowernumber = borrowernumber.slice(16);
            var patronlink = 'borrowernumber=' + borrowernumber;

            localStorage.setItem('lastpatron', name);
            localStorage.setItem('patronlink', patronlink);
            savePatron();

        });
    }

    function savePatron() {  // Spara ner låntagare i listan ifall hen inte finns med förut

        var lastpatrons = [];
        var patronlinks = [];
        var timestamps = [];

        var d = new Date();
        time = d.toTimeString();
        time = time.split(' ')[0];

        localStorage.setItem('timestamp', time);

        var name = localStorage.getItem('lastpatron');
        var link = localStorage.getItem('patronlink');
        var time = localStorage.getItem('timestamp');

        if (localStorage.getItem('lastpatrons')) {

            var theString = localStorage.getItem('lastpatrons');
            lastpatrons = theString.split(",");
            var theString2 = localStorage.getItem('patronlinks');
            patronlinks = theString2.split(",");
            var theString3 = localStorage.getItem('timestamps');
            timestamps = theString3.split(",");

            if (patronlinks.indexOf(link) > -1) {

                var indexnr = $.inArray(link, patronlinks);
                patronlinks.splice(indexnr, 1);
                lastpatrons.splice(indexnr, 1);
                timestamps.splice(indexnr, 1);
            }
        }
        else {
            lastpatrons = [];
            patronlinks = [];
            timestamps = [];
        }

        lastpatrons.unshift(name);
        patronlinks.unshift(link);
        timestamps.unshift(time);

        if (lastpatrons.length > 15) {
            lastpatrons.pop();
            patronlinks.pop();
            timestamps.pop();
        }

        localStorage.setItem('lastpatrons', lastpatrons);
        localStorage.setItem('patronlinks', patronlinks);
        localStorage.setItem('timestamps', timestamps);
    };


    if (localStorage.getItem('lastpatron')) { // Visa knappen ifall det finns en sparad låntagare
        var lpatron = localStorage.getItem('lastpatron');

        if (!$('#extra-header').length) {
            $(`
                <div id="extra-header" class="navbar-collapse collapse">
                    <ul id="extra-header-menu" class="navbar-nav"></ul>
                </div>
            `).insertAfter('#header_search');
        }
        $('#extra-header-menu').append(`
            <li class="nav-item">
                <a class="nav-link" href="#" id="lastpatron" >
                    <i class="fa fa-fw fa-user"></i>
                    Senaste låntagare
                </a>                
            </li>
            `);
        $('#extra-header-menu').append(`
            <li class="nav-item dropdown">
                
                    <a class="nav-link btn-group dropdown-toggle" href="#" role="button" id="lastpatrons" data-bs-toggle="dropdown" aria-haspopup="true">
                        Fler
                        <span class="caret"></span>
                    </a>
                    <ul id="patron-dropdown" class="dropdown-menu" aria-labelledby="lastpatrons"></ul>
                
            </li>
            `);

        var lp = localStorage.getItem('lastpatrons');
        var pl = localStorage.getItem('patronlinks');
        var ts = localStorage.getItem('timestamps');
        var list = $("#patron-dropdown");

        var names = lp.split(",");
        var links = pl.split(",");
        var times = ts.split(",");
        var parent = list.parent();

        var chksum = names.length + links.length + times.length;

        if (chksum / 3 == names.length) {

            list.detach().empty().each(function (i) {
                for (var x = 0; x < names.length; x++) {
                    $(this).append(`
                        <li>
                            <a class="dropdown-item" href="/cgi-bin/koha/circ/circulation.pl?${links[x]}">
                                <span class="timestamps">${times[x].slice(0, 5)}</span>
                                ${names[x]}
                            </a>
                        </li>`);
                    if (x == names.length - 1) {
                        $(this).appendTo(parent);
                    }
                }
            });
            $('<li><a class="dropdown-item" href="#" id="clearlpatron" style="margin:.25em"> Rensa</a></li>').appendTo('#patron-dropdown');

            $('#clearlpatron').on('click', function (event) { // Rensa senaste låntagare
                event.preventDefault();
                clearPatronlist();
            });


        } else {
            clearPatronlist();
        }
    }

    function clearPatronlist() {
        localStorage.removeItem('patronlink');
        localStorage.removeItem('lastpatron');
        localStorage.removeItem('lastpatrons');
        localStorage.removeItem('patronlinks');
        localStorage.removeItem('timestamp');
        localStorage.removeItem('timestamps');

        $('#lastpatron').remove();
        $('#clearlpatron').remove();
        $('#lastpatrons').remove();
        $('#patron-dropdown').remove();
        if (!$('#lastposts').length) {
            $('#extra-header').remove();
        }
    };

    $("<a href='#' id='patronspan'> " + lpatron + "</a>").insertBefore('#clearlpatron').hide();

    $('#lastpatron').mouseover(function (event) {
        event.preventDefault();
        $(`<span class="tooltiptext" id="lp_tooltip" style="color:#408540">: ${lpatron}</span>`).appendTo('#lastpatron');
        $(this).text(lpatron);
    });

    $('#lastpatron').mouseout(function (event) {
        event.preventDefault();
        $(this).html('<i class="fa fa-fw fa-user"></i>Senaste låntagare');
    });

    $('#lastpatron').on('click', function (event) { // Öppna senaste låntagare
        if (localStorage.getItem('lastpatron')) {
            var patronlink = localStorage.getItem('patronlink');
            window.location.assign("/cgi-bin/koha/circ/circulation.pl?" + patronlink);
        }
    });