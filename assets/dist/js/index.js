function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert( "El navegador no soporta geolocalización.");
    }
}

function showPosition(position) {
        console.log("Latitud: " + position.coords.latitude +
        "\nLongitud: " + position.coords.longitude);
        consulatrAPI(position);
}

function consulatrAPI(position){

    //API básica = https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}

    //console.log(position);
    const appId = '9ef0f6cd66c367ab044dec44ca6bd9ff';

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

    var imagenes=new Array(
      [`https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&lang=es&unit=metric&output=internal&tzshift=0`],
      [`https://www.7timer.info/bin/meteo.php?lon=${lon}&lat=${lat}&ac=0&lang=es&unit=metric&output=internal&tzshift=0`],
      [`https://www.7timer.info/bin/civil.php?lon=${lon}&lat=${lat}&ac=0&lang=es&unit=metric&output=internal&tzshift=0`],
      [`https://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&lang=es&unit=metric&output=internal&tzshift=0`],
      [`https://www.7timer.info/bin/two.php?lon=${lon}&lat=${lat}&ac=0&lang=es&unit=metric&output=internal&tzshift=0`]
    );

    // fetch api 1 día
    fetch(url)
      .then(respuesta => {
        return respuesta.json();
      })
      .then(datos => {
        console.log(datos);
        //limpiarHTML();
        if(datos.cod === "404") {
          console.log('Ciudad No Encontrada');
        } else {
          mostrarClima(datos)
        }
      })
      .catch(error => {
        console.log(error)
      });


    climaSemana(imagenes);
}

function mostrarClima(datos){

    const { name, main: { temp} } = datos;
    const grados = (temp - 273.15).toFixed(0);
    const {  main: { weather } } = datos;
    const tiempo = datos.weather[0].main;
    const ubi = datos.name;

    const actual = document.getElementById("temperatura");
    actual.innerHTML = grados + "ºC";

    const estado = document.getElementById("estado");
    estado.innerHTML = tiempo;

    const ubicacion = document.getElementById("localizacion");
    ubicacion.innerHTML = ubi;

    //console.log(datos.main.pressure);

    document.getElementById("viento").innerHTML= "Viento: " + datos.wind.speed + " km/h";
    document.getElementById("humedad").innerHTML= "Humedad: " + datos.main.humidity + " %";

    let visibilidad = datos.visibility / 1000;

    document.getElementById("visibilidad").innerHTML= "Visibilidad: " +  visibilidad + " km";

    document.getElementById("presion").innerHTML="Presion: " + datos.main.pressure + " mb";

    if(tiempo == "Clear") {
        document.getElementById("tiempo").src="../assets/img/Clear.png";
    } else if (tiempo == "Clouds") {
        document.getElementById("tiempo").src="../assets/img/LightCloud.png";
    } else if (tiempo == "Rain"){
        document.getElementById("tiempo").src="../assets/img/LightRain.png";
    }


}

function climaSemana(imagenes){
  console.log(imagenes);
  //document.getElementById("semana").src = imagenes[2];

  let contador=0;
 
  /*
      Funcion para cambiar la imagen
   */
  function rotarImagenes()
  {
      // cambiamos la imagen 
      
      contador++
      if (contador > 4) {
        contador = 0;
      }
      document.getElementById("semana").src=imagenes[contador];

  }
 
      // Cargamos una imagen aleatoria
      rotarImagenes();

      // Indicamos que cada 30 segundos cambie la imagen
      setInterval(rotarImagenes,30000);
  
  
}

window.addEventListener("load",()=>getLocation());