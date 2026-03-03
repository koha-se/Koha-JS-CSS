    // * CHECKED OK *
    // *************************************************************************************
    // Katalog - Övergripande
    //
    // Senaste katalogposter-lista
    // ver 2.7
    // 2025-06-17
    // ( Kompatibel med 25.05 )

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    if ($('#catalog_detail').length) {

        var bibnr = $('input[name="bib"]').val();
        var title = $('.biblio-title').text();
        var type = $('.results_summary.type').text();
        type = type.slice(type.indexOf(' ')).trim();
        var isbn = $('span[property="isbn"]').text() || '';
        title = title.replace('/', '').trim();

        isbn = isbn.replace('-', '');
        if (isbn.includes(';')) {
            isbn = isbn.replace(';', ' ').replace(/\s+/g, ' ').trim();
            isbnarr = isbn.split(' ');
            isbn = isbnarr[0].toString();
        }
        isbn = isbn.replace(/\D/g, '');
        if (isbn.length < 1) {
            isbn = '(ej angiven)';
        }
        var publisher = '(ej angiven)';
        if ($('.results_summary.rda264').length) {
            publisher = $('.results_summary.rda264:first').text();
            publisher = publisher.replace(/,|;/g, " ").slice(publisher.indexOf(':') + 2);
        }
        else if ($('.results_summary .label')) {
            $('.results_summary .label').each(function () {
                var text = $(this).text();
                if (text.includes('Utgivningsuppgift') || text.includes('Publisher')) {
                    publisher = $(this).parent().text();
                    publisher = publisher.replace(/,|;/g, " ").slice(publisher.indexOf(':') + 2);
                }
                //console.log(publisher);
                return publisher;

            });
        }

        var d = new Date();
        var time = d.toTimeString();
        time = time.split(' ')[0];

        var lastpost = { title: title, bibnr: bibnr, time: time, type: type, isbn: isbn, publisher: publisher };
        var lastpostJSON = JSON.stringify(lastpost);

        localStorage.setItem('lastpost', lastpostJSON);

        savePost();
    }

    function savePost() {  // Spara ner katalogpost i listan ifall den inte finns med förut
        var lastpost = JSON.parse(localStorage.getItem('lastpost'));
        var lastposts = [];

        if (localStorage.getItem('lastposts')) {
            lastposts = JSON.parse(localStorage.getItem('lastposts'));
        } else {
            lastposts = { titles: [], links: [], timestamps: [], types: [], isbns: [], pubs: [] };
        }
        var lpObj = Object.keys(lastpost);
        var lpsObj = Object.keys(lastposts);

        if (lastposts.links.length > 0) {
            if (lastposts.links.includes(lastpost.bibnr)) {
                var indexnr = $.inArray(lastpost.bibnr, lastposts.links);
                for (i = 0; i < lpsObj.length; i++) {
                    lastposts[lpsObj[i]].splice(indexnr, 1);
                }
            }
            if (lastposts.titles.length > 15) {
                for (i = 0; i < lpsObj.length; i++) {
                    lastposts[lpsObj[i]].pop();
                }
            }
        }
        else {
            lastposts = { titles: [], links: [], timestamps: [], types: [], isbns: [], pubs: [] };
        }

        for (i = 0; i < lpsObj.length; i++) {
            lastposts[lpsObj[i]].unshift(lastpost[lpObj[i]]);
        }

        var lastpostsArr = { titles: lastposts.titles, links: lastposts.links, timestamps: lastposts.timestamps, types: lastposts.types, isbns: lastposts.isbns, pubs: lastposts.pubs };
        var lastpostsArrJSON = JSON.stringify(lastpostsArr);

        localStorage.setItem('lastposts', lastpostsArrJSON);

    }

    // Knapp för att visa senaste besökta katalogposter

    if (localStorage.getItem('lastposts')) {
        if (!$('#extra-header').length) {
            $(`
                <div id="extra-header" class="navbar-collapse collapse">
                    <ul id="extra-header-menu" class="nav navbar-nav"></ul>
                </div>
            `).insertAfter('#header_search');
        }

        $('#extra-header-menu').prepend(`
            <li class="nav-item dropdown">
                <a class="nav-link btn-group dropdown-toggle" href="#" role="button" id="lastposts" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-fw fa-list-alt"></i>
                    Senaste poster
                    <span class="caret"></span>
                </a>
                <ul id="posts-dropdown" class="dropdown-menu" aria-labelledby="lastposts"></ul>
            </li>
        `);

        var lastposts = JSON.parse(localStorage.getItem('lastposts'));
        var list = $("#posts-dropdown");
        var parent = list.parent();

        list.detach().empty().each(function (i) {
            for (var x = 0; x < lastposts.titles.length; x++) {
                $(this).append(`
                    <li>
                        <a class="dropdown-item" href="/cgi-bin/koha/catalogue/detail.pl?biblionumber=${lastposts.links[x]}">
                            <span class="timestamps">${lastposts.timestamps[x].slice(0, 5)} </span>
                            ${lastposts.titles[x]} 
                            <span class="bType"> - ${lastposts.types[x]}</span>
                            <br />
                            <span class="bIsbn">ISBN: ${lastposts.isbns[x]}</span>
                            <span class="bPub">Utgivning: ${lastposts.pubs[x]}</span>
                        </a>
                    </li>
                `);

                if (x == lastposts.titles.length - 1) {
                    $(this).appendTo(parent);
                }
            }

            $(this).append(`
                <li>
                    <a class="dropdown-item" href="" id="clearposts" style="margin:.25em">
                        <span>
                            <i class="fa fa-trash"></i> 
                            Rensa listan
                        </span>
                    </a>
                </li>
            `);

            $('#clearposts').on('click', function (event) { // Rensa listan
                event.preventDefault();
                localStorage.removeItem('lastpost');
                localStorage.removeItem('lastposts');
                $('#lastposts, #posts-dropdown').remove();
                if (!$('#lastpatron').length) {
                    $('#extra-header').remove();
                }
            });
        });
    }
