    // *************************************************************************************
    // - Cirkulation
    //
    // Knappar Kopiera streckkod och Återlämna bredvid streckkod på utlåningssidan
    // ver 1.8
    // 2025-06-13
    // ( Kompatibel med 25.05 )

  
  	function circdetailButtons() {
        
        // Kopiera

        $('.bcopy').on('click', function (event) {
          for (i = 1; i < 3; i++) {
            event.preventDefault();

            $('td a').removeClass('bcSel');
            $(this).siblings('a:first').addClass('bcSel');

            var bcLink = document.querySelector('.bcSel');
            var range = document.createRange();
            range.selectNode(bcLink);
            window.getSelection().addRange(range);

            document.execCommand('copy');

            window.getSelection().removeAllRanges();
          }
        });

        // Återlämna

        $('.breturn').on('click', function (event) {
          event.preventDefault();
          var bc = $(this).siblings('a:first').text();

          if (confirm("Är du säker på att du vill återlämna detta exemplaret? \n\r\n\r" + bc)) {
            sessionStorage.setItem('lastbarcode_checkin', bc);
            window.location.href = `/cgi-bin/koha/circ/returns.pl?barcode=${bc}`;
          }

        });
      }
  
    if ($('#circ_circulation').length || $('#pat_moremember').length) {
        
      	var title_cellnr;
      
        $('#issues-table').on('draw.dt', function () {
            if (!$('#issues-table .bcopy').length) {
              	$('#issues-table th').each(function() {
                    if ($(this).text().includes('Titel') || $(this).text().includes('Title')) {
                    	//console.log($(this).index());
                        title_cellnr = $(this).index() + 1;
                	  }
                });
              
              	//console.log($(`#issues-table tbody th span`).text().includes('Titel').index());

                $(`#issues-table tbody tr td:nth-child(${title_cellnr})`).each(function () {
                    $(this).append(`
                        </br>
                        <a class="btn btn-primary btn-xs bcopy" data-toggle="tooltip" title="Kopiera">
                            <i class="fa fa-copy"></i>
                        </a>
                        <a class="btn btn-primary btn-xs breturn" data-toggle="tooltip" title="Återlämna">
                            <i class="fa fa-sign-in"></i>
                        </a>
                    `);
                });
              
              	circdetailButtons();
            }
        });
      
      	$('#holds-table').on('draw.dt', function () {
            if (!$('#holds-table .bcopy').length) {
				        $('#holds-table th').each(function() {
                    if ($(this).text().includes('Titel') || $(this).text().includes('Title')) {
                    	  //console.log($(this).index());
                        title_cellnr = $(this).index() + 1;
                	  }
                });

                $(`#holds-table tbody tr td:nth-child(${title_cellnr + 3})`).each(function () {
                  	if ($(this).children().length) {
                  	  	$(this).append(`
                            </br>
                            <a class="btn btn-primary btn-xs bcopy" data-toggle="tooltip" title="Kopiera">
                                <i class="fa fa-copy"></i>
                            </a>
                            <a class="btn btn-primary btn-xs breturn" data-toggle="tooltip" title="Återlämna">
                                <i class="fa fa-sign-in"></i>
                            </a>
                      	`);
                    }
                });
              
              	circdetailButtons();
            }
        });
    }


    if ($('#circ_returns').length) {
        if (sessionStorage.getItem('lastbarcode_checkin')) {
            const bc = sessionStorage.getItem('lastbarcode_checkin');
            sessionStorage.removeItem('lastbarcode_checkin');
            $('#barcode').val(bc);
            $('#checkin-form button').trigger('click');
        }
    }