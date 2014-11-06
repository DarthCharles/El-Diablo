var vehiculo = {
coordenadas: [],
añadirCoordenadas:  function (latitud, longitud) {
         vehiculo.coordenadas.push(new google.maps.LatLng(latitud, longitud));
    }
};


(function() {
	window.onload = function() {
// Creating a map
var options = {
	zoom: 12,
	center: new google.maps.LatLng(29.0784761, -110.9793706),
	mapTypeId: google.maps.MapTypeId.ROADMAP
};




var map = new google.maps.Map(document.getElementById('map'), options);
var manejando = new google.maps.MarkerImage('img/vManejando.png', null, null , 	new google.maps.Point(10, 35));
var ralenti = new google.maps.MarkerImage('img/vRalenti.png', null, null , 	new google.maps.Point(10, 35));
var parado = new google.maps.MarkerImage('img/vParado.png', null, null , 	new google.maps.Point(10, 35));


//var shadow = new google.maps.MarkerImage('img/shadow.png');
var bounds = new google.maps.LatLngBounds();

// Adding a LatLng object for each city

vehiculo.añadirCoordenadas(29.098372, -110.971301);
vehiculo.añadirCoordenadas(29.097343, -110.971145);
vehiculo.añadirCoordenadas(29.096256, -110.970974);
vehiculo.añadirCoordenadas(29.095217, -110.970809);
vehiculo.añadirCoordenadas(29.094172, -110.970620);
vehiculo.añadirCoordenadas(29.093150, -110.970447);
vehiculo.añadirCoordenadas(29.092086, -110.970270);
vehiculo.añadirCoordenadas(29.091031, -110.970099);
vehiculo.añadirCoordenadas(29.090140, -110.969927);
vehiculo.añadirCoordenadas(29.089460, -110.968806);
vehiculo.añadirCoordenadas(29.089001, -110.967792);
vehiculo.añadirCoordenadas( 29.088598, -110.966786);
vehiculo.añadirCoordenadas( 29.088233, -110.965806);
vehiculo.añadirCoordenadas(29.087841, -110.964837);
vehiculo.añadirCoordenadas( 29.087124, -110.963951);
vehiculo.añadirCoordenadas(29.086130, -110.962905);
vehiculo.añadirCoordenadas( 29.085047, -110.961736);
vehiculo.añadirCoordenadas(29.084261, -110.960322);
vehiculo.añadirCoordenadas(29.083658, -110.959705);




for (var i = 0; i <  vehiculo.coordenadas.length; i++) {

	if (i%3 == 0) {
	var marker = new google.maps.Marker({
		position: vehiculo.coordenadas[i],
		map: map,
		icon: ralenti ,
		//shadow: shadow

	});
	} else {

			var marker = new google.maps.Marker({
		position: vehiculo.coordenadas[i],
		map: map,
		icon: manejando ,
		//shadow: shadow
	});
	};
var infowindow;
(function(i, marker) {
// Creating the event listener. It now has access to the values of
// i and marker as they were during its creation
google.maps.event.addListener(marker, 'click', function() {
// Check to see if we already have an InfoWindow
if (!infowindow) {
	infowindow = new google.maps.InfoWindow();
}
// Setting the content of the InfoWindow
infowindow.setContent('Registro ' + i);
// Tying the InfoWindow to the marker
infowindow.open(map, marker);
});
})(i, marker);
	bounds.extend(vehiculo.coordenadas[i]);
};
map.fitBounds(bounds);

// Creating an array that will contain the points for the polyline

// Creating the polyline object
var polyline = new google.maps.Polyline({
	path: vehiculo.coordenadas,
	strokeColor: "#3498db",
	strokeOpacity: 0.8,
	strokeWeight: 5
});
// Adding the polyline to the map
polyline.setMap(map);



}
})();