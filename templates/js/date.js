$(function () {

    $("#seleccion-fecha").hide();
    $("#alerta").hide();
    $("#datepicker1,#datepicker2").datepicker({
       showOn: "button",
       buttonImage: "img/calendar.png",
       changeMonth: true,
       changeYear: true,
   
       yearRange: "-20:+25",
       inline: true,
                    // Formato de la fecha
                    dateFormat: "dd/MM/yy",
                    // Primer dia de la semana El lunes
                    firstDay: 0,
                    showOtherMonths: true,
                    // Dias Largo en castellano
                    dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
                    // Dias cortos en castellano
                    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                    // Nombres largos de los meses en castellano
                    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    // Nombres de los meses en formato corto 
                    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"],
                });
$("#datepicker1,#datepicker2").datepicker().datepicker('setDate', 'today');


   $("#slider-range").slider({
        range: true,
        min: 0,
        max: 1440,
        step: 1,
        values: [0, 1440],
        slide: function (e, ui) {
          var hours1 = Math.floor(ui.values[0] / 60);
          var minutes1 = ui.values[0] - (hours1 * 60);

          if (hours1.length == 1) hours1 = '0' + hours1;
          if (minutes1.length == 1) minutes1 = '0' + minutes1;

          for (var i = 0; i < 10; i++) {
           if (minutes1 == i) minutes1 = '0' + i;
  
         };
         if (hours1 >= 12) {
          if (hours1 == 12) {
            hours1 = hours1;
            minutes1 = minutes1 + " PM";
          } else {
            hours1 = hours1;
            minutes1 = minutes1 + " PM";
          }

          if (hours1 == 24) {
              hours1 = 23;
              minutes1 = "59 PM";
          }
        } else {
          hours1 = hours1;
          minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
          hours1 = 12;
          minutes1 = minutes1;
        }

        $('.slider-time').html(hours1 + ':' + minutes1);

        var hours2 = Math.floor(ui.values[1] / 60);
        var minutes2 = ui.values[1] - (hours2 * 60);

        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        for (var i = 0; i < 10; i++) {
            if (minutes2 == i) minutes2 = '0' + i;
        };
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
          if (hours2 == 12) {
            hours2 = hours2;
            minutes2 = minutes2 + " PM";
          } else if (hours2 == 24) {
            hours2 = 23;
            minutes2 = "59 PM";
          } else {
            hours2 = hours2 ;
            minutes2 = minutes2 + " PM";
          }
        } else {
          hours2 = hours2;
          minutes2 = minutes2 + " AM";
        }

        $('.slider-time2').html(hours2 + ':' + minutes2);
      }
    });


});

$(function () {
    $( "#accordion" ).accordion({
        collapsible: true,
        active: false,
    });

    var toggle = true;
    var dialogisOpen = false;

    $("#personalizado").click(function () {
        if (!validateOpcionesVehiculo()) {
            $("#fechas").html("");
            $("#seleccion-fecha").show();
            $("#dialog").dialog();
            toggle = true;
            dialogisOpen = true;
            $('.innerTop').animate({
                'right': '1500px'
            });;

        } else {
            $("#alerta").dialog();
        }

    });

    function validateOpcionesVehiculo() {
        var vehiculoID = $("#SeleccionVehiculo").val();
        return vehiculoID === "";
    }

    $("#botonFecha").click(function () {
        if (toggle) {
            $('.innerTop').animate({
                'right': '0px'
            });
        }
        $("#dialog").dialog("close");
        toggle = false;
    });


    function _getSimpleDate(fecha1, fecha2) {
        var month = new Array();
        month[0] = "Enero";
        month[1] = "Febrero";
        month[2] = "Marzo";
        month[3] = "Abril";
        month[4] = "Mayo";
        month[5] = "Junio";
        month[6] = "Julio";
        month[7] = "Agosto";
        month[8] = "Septiembre";
        month[9] = "Octubre";
        month[10] = "Noviembre";
        month[11] = "Diciembre";

        if (!fecha2) {
            var param1 = fecha1.getDate() + " " + month[fecha1.getMonth()] + " " + fecha1.getFullYear();
            return param1;
        } else {
            var param1 = fecha1.getDate() + " " + month[fecha1.getMonth()] + " " + fecha1.getFullYear();
            var param2 = fecha2.getDate() + " " + month[fecha2.getMonth()] + " " + fecha2.getFullYear();
            return param1 + " al " + param2;
        }



    }

    function doVenus() {
        if (dialogisOpen) {
            $("#dialog").dialog("close");
            dialogisOpen = false;
        }
        if (toggle) {
            $('.innerTop').animate({
                'right': '0px'
            });


        };
    }
    $("#today").click(function () {
        if (!validateOpcionesVehiculo()) { 
                var today = new Date();
                $("#fechas").html(_getSimpleDate(today));
                doVenus();         
        } else {
            $("#alerta").dialog();

        }
    });

    $("#yesterday").click(function () {
        if (!validateOpcionesVehiculo()) {
            var today = new Date();

            var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
            $("#fechas").html(_getSimpleDate(yesterday));
            doVenus();
        } else {
            $("#alerta").dialog();

        }
    });

    $("#thisWeek").click(function () {
        if (!validateOpcionesVehiculo()) {
            var today = new Date();
            var fistdayofWeek = new Date();
            var firstday = new Date(fistdayofWeek.setDate(fistdayofWeek.getDate() - fistdayofWeek.getDay()));
            $("#fechas").html(_getSimpleDate(firstday, today));
            doVenus();
        } else {
            $("#alerta").dialog();

        }
    });

    $("#lastWeek").click(function () {
        if (!validateOpcionesVehiculo()) {
            var today = new Date();
            var fistdayofWeek = new Date();
            var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            var firstday = new Date(lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay()));

            var lastday = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate() + 6);


             $("#fechas").html(_getSimpleDate(firstday, lastday));
            doVenus();
        } else {
            $("#alerta").dialog();

        }
    });

    $("#thisMonth").click(function () {
        if (!validateOpcionesVehiculo()) {

            var today = new Date();
            var thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            $("#fechas").html(_getSimpleDate(thisMonth, today));
            doVenus();
        } else {
            $("#alerta").dialog();

        }
    });

    $("#lastMonth").click(function () {
        if (!validateOpcionesVehiculo()) {
            var today = new Date();
            var firstDayMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            var lastDayMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            $("#fechas").html(_getSimpleDate(firstDayMonth, lastDayMonth));
            doVenus();
        } else {
            $("#alerta").dialog();

        }
    });


    $(botonFecha).click(function () {



            var x = $('#datepicker1').datepicker('getDate');
   
            var y = $('#datepicker2').datepicker('getDate');
            $("#fechas").html(_getSimpleDate(x, y));



        



    });

  $(".close-image").click(function() {
             toggle = true;
          $('.innerTop').animate({
            'right': '1500px'
          });;
  });

 

  

});

  