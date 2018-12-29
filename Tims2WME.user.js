// ==UserScript==
// @name         Tims2WME
// @version      2018.12.28.01
// @author       The_Cre8r
// @include      https://tims.ncdot.gov/TIMS/*IncidentDetail.aspx?id=*
// @grant        none
// ==/UserScript==
/* global TIMSApp */
/* global $ */

(function() {
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
       return(false);
    }

    function bootstrap() {
        if ($ && TIMSApp) {
            console.log('Initializing...');
            //var $ = unsafeWindow.$;
            init();
        } else {
            console.log('Bootstrap failed. Trying again...');
            setTimeout(function () {
                bootstrap();
            }, 250);
        }
    }

        async function init(){
            $.blockUI = function() {}
            $.unblockUI = function() {}
            console.log("async started");
            let incidents = await $.get('https://tims.ncdot.gov/TIMS/api/incidents');
            console.log(incidents.filter(x => x.Id == timsid))
            let incident = incidents.filter(x => x.Id == timsid)
            console.log("async ended");
            if (incident.length) {
                //
                console.log(incident[0].Id);
                $("#ctl00_Waze").attr("href", "https://www.waze.com/en-US/editor?env=usa&lon="+incident[0].Longitude+"&lat="+incident[0].Latitude+"&zoom=7")
                $("#ctl00_Waze").attr("target", "_blank")
                $("#ctl00_Waze").css({
                    'color': '#FFFFFF'
                })
                $( "#ct100_Waze_Loading" ).remove();
            } else {
                console.log("false");
                $( "#ct100_Waze_Loading" ).remove();
            }
        }

    var timsid = getQueryVariable("id");
        console.log("timsid = "+timsid);
        let pathname = "https://www.waze.com/en-US/editor";
        if ($("#ctl00_linkAdmin").length) {
            $("#ctl00_linkAdmin").before("<img src='http://wazenc.us/img/loading.svg' alt='Loading' id='ct100_Waze_Loading'><a id='ctl00_Waze' href='" + pathname + "'>Waze</a>&nbsp;&nbsp;|");
        }
        else {
            $("#tHeader_r2").prepend("<img src='http://wazenc.us/img/loading.svg' alt='Loading' id='ct100_Waze_Loading'><a id='ctl00_Waze' href='" + pathname + "'>Waze</a>&nbsp;&nbsp;|");
            $("#tHeader_r2").html(function (i, html) {
                return html.replace(/&nbsp;&nbsp;&nbsp;/g, '&nbsp;&nbsp;');
            });
        }
        $("#ctl00_Waze").css({
            'padding-left': '5px',
            'padding-right': '5px'
        })
        $("#ctl00_Waze").css({
            'color': '#999999'
        })
    bootstrap()
})();
