    // *************************************************************************************
    // - Låntagare
    //
    // Tillåt endast siffror i personnummer och mobiltelefonnummer (med förklaring om endast svenska nummer)
    // ver 1.2
    // ( Kompatibel med 25.05 )

    $("input#mobile" || patron_attr_personnr).keydown(function (e) {
        var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
        var isCursorMoveOrDeleteAction = ([46, 8, 9, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) != -1);
        var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
        var vKey = 86,
            cKey = 67,
            aKey = 65,
            xKey = 88;
        switch (true) {
            case isCursorMoveOrDeleteAction:
            case isModifierkeyPressed == false && isNumKeyPressed:
            case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey, xKey].indexOf(e.keyCode) != -1):
                break;
            default:
                e.preventDefault();
        }
    });

    $('<span class="hint"> Endast svenska mobilnummer</span>').insertAfter("input#mobile");