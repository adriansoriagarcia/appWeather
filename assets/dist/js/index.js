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
    //API completa= https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    //console.log(position);
    const appId = '9ef0f6cd66c367ab044dec44ca6bd9ff';
    const apiKey = '31b33df22fe2b492d9b74843003438fe';
    //(mia)9ef0f6cd66c367ab044dec44ca6bd9ff    31b33df22fe2b492d9b74843003438fe
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;
    let url5Dias = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    let url16Dias = `https://api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}`;


    // fetch api 1 día
    fetch(url)
      .then(respuesta => {
        return respuesta.json();
      })
      .then(datos => {
        console.log(datos);
        //limpiarHTML();
        if(datos.cod === "404") {
          //mostrarError('Ciudad No Encontrada')
        } else {
          mostrarClima(datos)
        }
      })
      .catch(error => {
        console.log(error)
      });

            // fetch api 5 días
    fetch(url5Dias)
    .then(respuesta => {
      return respuesta.json();
    })
    .then(informacion => {
      //console.log(informacion);
      //limpiarHTML();
      if(informacion.cod === "404") {
        //mostrarError('Ciudad No Encontrada')
      } else {
        climaSemana(informacion)
      }
    })
    .catch(error => {
      console.log(error)
    });

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

    if(tiempo== "Clear") {
        document.getElementById("tiempo").src="../assets/img/Clear.png";
    } else if (tiempo== "Clouds") {
        document.getElementById("tiempo").src="../assets/img/LightCloud.png";
    } else if (tiempo== "Rain"){
        document.getElementById("tiempo").src="../assets/img/LightRain.png";
    }

}

function climaSemana(informacion){
  //console.log(informacion.list);

  //DATOS DE MAÑANA

  hoy = new Date()
  maniana = hoy.setTime(hoy.getTime() + (1*24*60*60*1000))
  maniana = new Date(maniana)
  let manana = String(maniana.getFullYear() +'-' + String(maniana.getMonth() + 1).padStart(2, '0') + '-' + maniana.getDate());
  let pasado = String(maniana.getFullYear() +'-' + String(maniana.getMonth() + 1).padStart(2, '0') + '-' + maniana.getDate());
  //console.log(manana);

  let valoresManana = [];

  let valores = Object.values(informacion.list); 
  for(let i=0; i< informacion.list.length; i++){
    //console.log(valores[i]);
    //includes comprueba si existe un texto en una frase.
    if(valores[i].dt_txt.includes(`${manana}`)){
      console.log(valores[i])
      valoresManana.push(valores[i]);
    }
  }

  let ultimoValorDiario = valoresManana.length;

  //console.log();
  document.getElementById("maxManana").innerHTML = (valoresManana[0].main.temp_max - 273.15).toFixed(0) + "°C";
  document.getElementById("minManana").innerHTML = (valoresManana[ultimoValorDiario - 1].main.temp_min- 273.15).toFixed(0) + "°C";

  //let estadoMañana = valoresManana[0].weather[0].main;
  //console.log(estadoMañana)
  //console.log(valoresManana[ultimoValorDiario - 1].main.temp_min);

  //DATOS DE MAÑANA





  let valoresPasado = [];
  let valoresSiguiente = [];
}

window.addEventListener("load",()=>getLocation());