let startFilm = document.querySelector("#start-film")
let createText= document.querySelector(".create-text");
let textChildren=createText.childNodes;
const video = document.getElementById("gif-captor-video");
video.style.display="none";
let [filmStage1, filmStage2, filmStage3] = Array.from(document.querySelectorAll(".film-stage"));

async function stepOne(e) {
  e.preventDefault();

  console.log(e.path[0].style.display="none")
  filmStage1.classList.add("activated");
  textChildren[1].innerHTML="¿Nos das acceso <br> a tu cámara?";
  textChildren[3].innerHTML="El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO."

  getMediaPermissions();
}

startFilm.addEventListener('click', (e) => stepOne(e));

function getMediaPermissions() {

  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia);
  navigator.getUserMedia (
  
  // constraints
  {
    audio: false,
    video: true,
    video: {
    height: { max: 360 }
    }
  },
  
  // successCallback
  async function(localMediaStream) {
    video.srcObject = localMediaStream;
    await stage2();
    stage3();
  },
  
  // errorCallback
  function(err) {
  console.log("Ocurrió el siguiente error: " + err);
  });
}


function stage2() {
  filmStage2.classList.add("activated");
  filmStage1.classList.remove("activated");
  startFilm.style.display="block";
  startFilm.textContent="GRABAR";
  startFilm.removeEventListener("click", stepOne);
}

function stage3() {
  video.style.display="block";
  textChildren[1].innerHTML="";
  textChildren[3].innerHTML="";

}