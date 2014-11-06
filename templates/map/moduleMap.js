var map = (function () {
    var map;

    //Variables con los iconos de los marcadores
    var manejando = new google.maps.MarkerImage('img/vManejando.png', null, null, new google.maps.Point(10, 35));
    var ralenti = new google.maps.MarkerImage('img/vRalenti.png', null, null, new google.maps.Point(10, 35));
    var parado = new google.maps.MarkerImage('img/vParado.png', null, null, new google.maps.Point(10, 35));
    var alerta = new google.maps.MarkerImage('img/alerta.png', null, null, new google.maps.Point(10, 35));
    var icono = [manejando, ralenti, parado, alerta];

    var infowindow = new google.maps.InfoWindow(); //variable para la ventanita con la informacion del marcador
    var geocoder = new google.maps.Geocoder(); //variable para mandar un par de coordenadas y devolver una direccion física
    var bounds = new google.maps.LatLngBounds();

    var polyline = new google.maps.Polyline();
    var arrpolyline = [];
    var marcadores = [];
    infobox = new InfoBox();


    function initMap(lat, lng) {

        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng(lat, lng)
        }

        map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }

    function _setMarkerSize(x, y) {
        var cuadrado = {
            url: 'http://lacachora.com/CSIPRO/marcador.png',
            size: new google.maps.Size(120, 120),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 20),
            scaledSize: new google.maps.Size(x, y)


        };
        return cuadrado;
    }


    function addNewestMarker(datoGPS) {


        var circulos = {
            path: google.maps.SymbolPath.CIRCLE,
            anchor: new google.maps.Point(0, 0),
            scale: 4,
            strokeColor: '#3498db',
            fillColor: '#EAF6FE',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeOpacity: 0.8

        };
        // To add the marker to the map, use the 'map' property

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(datoGPS.latitud, datoGPS.longitud),
            map: map,
            icon: circulos
        });
        marcadores.push(marker);
        bounds.extend(marker.getPosition());
        (function (datoGPS, marker) {
            // Creamos el event listener para que aparezca el infowindows.
            google.maps.event.addListener(marker, 'mouseover', function () {

                // Verificar si ya hay un infowindows abierto.
                if (!infobox) {
                    infobox = new InfoBox();
                }

                function isOn(datoGPS) {

                    if (datoGPS.encendido == "1") {
                        return "Encendido"
                    } else {
                        return "Apagado"
                    }

                };


                var iconover = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 6.5,
                    strokeColor: '#3498db',
                    fillColor: '#EAF6FE',
                    fillOpacity: 1,
                    strokeWeight: 3.5,
                    strokeOpacity: 0.8
                };
                marker.setIcon(iconover);

                //contenido de la infowindows
                var boxText = document.createElement("div");
                boxText.innerHTML = "<table id='infobox'><tr><td><img src='http://lacachora.com/CSIPRO/vehi.png' /></td><td> <h4>Honda Civic '07</h4></td>		</tr><tr><td></td><td><p>Velocidad: a " + datoGPS.velocidad + " KMH</p></td></tr><tr><td><img src='http://lacachora.com/CSIPRO/led_green.png' id='led'/></td><td><p>Estatus: " + isOn(datoGPS) + "</p></td>		</tr></table>";
                var myOptions = {
                    content: boxText,
                    disableAutoPan: false,
                    maxWidth: 300,
                    pixelOffset: new google.maps.Size(30, -60),
                    zIndex: null,
                    boxStyle: {
                        opacity: 0.75,
                        width: "300PX"
                    },
                    closeBoxMargin: "4px 4px 2px 2px",
                    closeBoxURL: "",
                    infoBoxClearance: new google.maps.Size(1, 1)
                };


                // ligamos el contenido al infowindows
                infobox = new InfoBox(myOptions);
                // ligamos el infowindows al marcador
                infobox.open(map, marker);
            });
        })(datoGPS, marker);



        google.maps.event.addListener(marker, 'mouseout', function () {

            marker.setIcon(circulos);
            infobox.close();

        });

    }

    function addMarker(lat, lng, icon) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            icon: icono[icon]
        });
        marcadores.push(marker);
        bounds.extend(marker.getPosition());
        //a cada marcador le asignamos un infowindows con la informacion del vehiculo
        (function (marker) {
            // Creamos el event listener para que aparezca el infowindows.
            google.maps.event.addListener(marker, 'click', function () {
                var result;
                // llamamos al metodo geocode() del geocoder que es el que nos dara la direccion a partir de las coordenadas del evento.
                geocoder.geocode({
                    'latLng': marker.getPosition()
                }, function (results, status) {
                    var result;
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            result = results[0].formatted_address; //esta es la direccion fisica de las coordenadas

                        } else {
                            vehiculo.ubicacion = 'Desconocida';
                        }

                        // Verificar si ya hay un infowindows abierto.
                        if (!infowindow) {
                            infowindow = new google.maps.InfoWindow();
                        }
                        //contenido de la infowindows
                        var content = '<div id="info">' +
                            '<p>Ubicación: ' + result + '</p>' +
                            '</div>';
                        // ligamos el contenido al infowindows
                        infowindow.setContent(content);
                        // ligamos el infowindows al marcador
                        infowindow.open(map, marker);

                        // hacemos que el centro del mapa sea el mismo al del marcador seleccionado.
                        map.setCenter(marker.getPosition());
                        // Ponemos agregamos zoom
                        map.setZoom(18);
                    }
                });

            });
        })(marker);

    }

    function setTravelStartEnd(recorrido) {
        addMarker(recorrido.d[0].latitud, recorrido.d[0].longitud, 0);
        addMarker(recorrido.d[recorrido.d.length - 1].latitud, recorrido.d[recorrido.d.length - 1].longitud, 2);

    }
    function getLastLocation(lat, lng, data, i) {

        function writeTable(result) {
           
          
               $("#tabla-reportes").append("<tr id='" + data.d[i].iID + "'><td>"
                    + data.d[i].VehiculoID + "</td><td>"
                     + "DIDCOM</td><td>"
                    + data.d[i].FechaComienzo + "</td><td>"
                    + data.d[i].TiempoRecorrido + " Seg </td><td>"
                    + data.d[i].FechaFinal + "</td><td>"
                    + data.d[i].DistanciaRecorrida + " Km </td><td>"
                    + data.d[i].TiempoDetenido + "</td><td>"
                      + result + "</td><td>"
                     + data.d[i].TiempoRalenti + "</td><td>"
                    + data.d[i].VelocidadMaxima + "</td></tr>");
            
        }

        var geocoderRequest = {
            latLng: new google.maps.LatLng(lat, lng)
        }

        geocoder.geocode(geocoderRequest, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {

                    writeTable(results[0].formatted_address);

                } else {
                    writeTable("Desconocida");
                }


            }
        });


    }

    function clearMap() {
        _clearMarkers();
        _removeLine();
        marcadores = [];
        arrpolyline = [];

    }

    function _setAllMap(map) {
        for (var i = 0; i < marcadores.length; i++) {
            marcadores[i].setMap(map);
        }
    }


    // le quita a los marcadores sus referencias para que desaparezcan el mapa
    function _clearMarkers() {
        _setAllMap(null);
    }


    function drawPolyline(direcciones) {
        var iconsetngs = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: '#222222',
            fillOpacity: 0.8,
            scale: 2,
            strokeColor: '#222222',
            strokeWeight: 1
        };

        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3.5,
            strokeColor: '#3498db',
            fillColor: '#EAF6FE',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeOpacity: 0.8
        };


        var polylineoptns = {
            path: direcciones,
            icons: [{
                icon: iconsetngs,
                repeat: '100px'
            }],
            map: map,
            strokeColor: '#3498db',
            strokeOpacity: 0.8,
            strokeWeight: 7
        };
        polyline = new google.maps.Polyline(polylineoptns);
    }

    function _addLine() {
        polyline.setMap(map);
    }

    function _removeLine() {
        polyline.setMap(null);
    }

    function readJSON(file) {
        clearMap();
        bounds = new google.maps.LatLngBounds();
        $.getJSON(file, function (json) {


            for (var i = 0, length = json.length; i < length; i++) {
                var data = json[i];

                addMarker(data.lat, data.lng);
                arrpolyline.push(new google.maps.LatLng(data.lat, data.lng));
            };
            _setAllMap(map);
            drawPolyline(arrpolyline);
            _addLine();
            map.fitBounds(bounds);
        });
    };


    function getDataGPS(trid) {
        clearMap();
        bounds = new google.maps.LatLngBounds();
       
        $.ajax({
            type: "POST",
            url: "RecorridosHistoricos.aspx/obtener_DatosGPS",
            data: "{ trid:" + trid + "}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
          
                var datosGPS = response.d;

                $.each(datosGPS, function (index, datoGPS) {
                    //  addMarker(datoGPS.latitud, datoGPS.longitud);
                    addNewestMarker(datoGPS);
                    // addNewMarker(datoGPS.latitud, datoGPS.longitud, index, response.d.length);
                    arrpolyline.push(new google.maps.LatLng(datoGPS.latitud, datoGPS.longitud));


                });



                _setAllMap(map);
                drawPolyline(arrpolyline);
                setTravelStartEnd(response);
                _addLine();
                map.fitBounds(bounds);
            },
            failure: function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            }
        });


    };

    return {
        initMap: initMap,
        drawPolyline: drawPolyline,
        addMarker: addMarker,
        readJSON: readJSON,
        clearMap: clearMap,
        getDataGPS: getDataGPS,
        getLastLocation: getLastLocation,

    };

})();


function initialize() {

    map.initMap(23.6266557, -102.5375005);




    $(botonFecha).click(function () {


     //   alert(dateString);

       
     //   alert(dateString);

        //alert($('.slider-time').text());
      //  alert($('.slider-time2').text());


        function getCustomDate() {
            var x = $('#datepicker1').datepicker('getDate');
            var dateString = $.datepicker.formatDate('yy-mm-dd', x);

            var y = $('#datepicker2').datepicker('getDate');
            var dateString1 = $.datepicker.formatDate('yy-mm-dd', y);

            //alert($('.slider-time').text());
            //  alert($('.slider-time2').text());
            var hora1 = $('.slider-time').text();
            var arr = hora1.split(' ');

            var hora2 = $('.slider-time2').text();
            var arr2 = hora2.split(' ');

            return _sendPairofCustomDates(dateString + " " + arr[0] + ":00", dateString1 + " " + arr2[0] + ":00");
        }

       
         var params = JSON.stringify( getCustomDate());
        sendParameters(params);


    });


    $(document).on("click", '#tabla-reportes tbody tr', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        trid = $(this).attr('id');
        console.log(trid);
        map.getDataGPS(trid);

    });

    function _getPairofDates(fecha1, fecha2) {
        var param1 = fecha1.getFullYear() + "-" + (fecha1.getMonth() + 1) + "-" + fecha1.getDate() + " 00:00:00";
        var param2 = fecha2.getFullYear() + "-" + (fecha2.getMonth() + 1) + "-" + fecha2.getDate() + " 23:59:59";
        var vehiculoID = $("#SeleccionVehiculo").val();
        console.log(vehiculoID);
        return [param1, param2, vehiculoID];
    }

  
    function _sendPairofCustomDates(fecha1, fecha2) {
        var param1 = fecha1;
        var param2 = fecha2;
        var vehiculoID = $("#SeleccionVehiculo").val();
        console.log(vehiculoID);
        return [param1, param2, vehiculoID];
    }
    function sendParameters(parameters) {
     //   $('#loading-image').show();
        $.ajax({
            type: "POST",
            url: "RecorridosHistoricos.aspx/fecha",
            data: "{ parametros: " + parameters + "}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: OnSuccess,
            failure: function (response) {
                alert(response.d);
            },
                complete: function () {
                  //  $('#loading-image').hide();
                }
        });

        function OnSuccess(data) {
          //  $('#loading-image').hide();
            if (data.d.length <= 0) {
                $("#respuestaTablaVehiculos").html("No existen registros");
            } else {
                $("#respuestaTablaVehiculos").html("");
            }

            $("#tabla-reportes  tbody").html("");
            for (var i = 0; i < data.d.length; i++) {
                map.getLastLocation(data.d[i].Latitud, data.d[i].Longitud, data, i);
            }
           
        }


    }

  

    $('#today').click(function () {

   

              function getToday() {
                  var today = new Date();

             //     $("#fechas").html(_getSimpleDate(today));
                  return _getPairofDates(today, today);

              }

              var params = JSON.stringify(getToday());
              sendParameters(params);
    

    

    });

    $('#yesterday').click(function () {

        function getYesterday() {
            var today = new Date();

            var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
       //     $("#fechas").html(_getSimpleDate(yesterday));
            return _getPairofDates(yesterday, yesterday);
        }

        
        var params = JSON.stringify(getYesterday());
        sendParameters(params);
    });

    $('#thisWeek').click(function () {
        function thisWeek() {
            var today = new Date();

            var fistdayofWeek = new Date();
            var firstday = new Date(fistdayofWeek.setDate(fistdayofWeek.getDate() - fistdayofWeek.getDay()));
          //  $("#fechas").html(_getSimpleDate(firstday, today));
            return _getPairofDates(firstday, today);

        }

        var params = JSON.stringify(thisWeek());
        sendParameters(params);

    });



    $('#lastWeek').click(function () {
        function getLastWeek() {
            var today = new Date();
            var fistdayofWeek = new Date();
            var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            var firstday = new Date(lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay()));

            var lastday = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate() + 6);


         //   $("#fechas").html(_getSimpleDate(firstday, lastday));
           return _getPairofDates(firstday, lastday);
 

       }

        var params = JSON.stringify(getLastWeek());
        sendParameters(params);



    });

    $('#thisMonth').click(function () {
        function getThisMonth() {
            var today = new Date();
            var thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        //    $("#fechas").html(_getSimpleDate(thisMonth, today));
            return _getPairofDates(thisMonth, today);
        }

        var params = JSON.stringify(getThisMonth());
        sendParameters(params);



    });

    $("#lastMonth").click(function () {
        function lastMonth() {
            var today = new Date();
            var firstDayMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            var lastDayMonth = new Date(today.getFullYear(), today.getMonth(), 0);

          //  $("#fechas").html(_getSimpleDate(firstDayMonth, lastDayMonth));
            return _getPairofDates(firstDayMonth, lastDayMonth);
        }

        var params = JSON.stringify(lastMonth());
        sendParameters(params);

    });
    $('#bitch1').click(function () {

        //map.readJSON("json/trayecto.json");
        map.getDataGPS();
    });

}

google.maps.event.addDomListener(window, 'load', initialize);