let recorder;
let gif;

createContainer.style.display="none";
let startFilm = document.querySelector("#start-film")
let createText= document.querySelector(".create-text");
let textChildren=createText.childNodes;
const video = document.getElementById("gif-captor-video");
video.style.display="none";
let timer=document.querySelector(".timer");
let [filmStage1, filmStage2, filmStage3] = Array.from(document.querySelectorAll(".film-stage"));
uploadOverlay=document.querySelector("#create-overlay");

document.querySelector("#crear").addEventListener("click", (e) => {
  e.preventDefault();
  createContainer.style.display="block";
  
  [mainTitle, trending, document.querySelector(".search-results"), document.querySelector(".search")].map(node => node.style.display="none")
});

startFilm.addEventListener('click', (e) => stepOne(e));

async function stepOne(e) {
  e.preventDefault();

  console.log(e.path[0].style.display="none")
  filmStage1.classList.add("activated");
  textChildren[1].innerHTML="¿Nos das acceso <br> a tu cámara?";
  textChildren[3].innerHTML="El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO."

  getMediaPermissions();
}

function getMediaPermissions() {

  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia);
    navigator.getUserMedia (
  
  {
    audio: false,
    video: true,
    video: {
    height: { max: 240 }
    }
  },
  
  async function(localMediaStream) {
    video.srcObject = localMediaStream;
    await stage2();
  },
  
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
  startFilm.addEventListener("click", stage3)
}

function stage3(){

  filmStage3.classList.add("activated");
  filmStage2.classList.remove("activated");

	navigator.mediaDevices.getUserMedia({
		video: true
	}).then(async function(stream) {
		recorder = RecordRTC(stream, {
			type: 'gif',
			frameRate: 1,
			quality: 10,
			width: 360,
			hidden: 240,
			onGifRecordingStarted: function() {
			 console.log('started')
			}
	});
    recorder.startRecording();
    
    video.style.display="block";
    timer.style.display="block";
    timer.textContent= () => {

    }
    textChildren[1].innerHTML="";
    textChildren[3].innerHTML="";

    startFilm.textContent="FINALIZAR";
    startFilm.removeEventListener("click", stage3);
    startFilm.addEventListener("click", stage4)
  });
}

function onStop() {
  console.log("mili")
}

let myGifosArray = JSON.parse(localStorage.getItem("myGifos"));

if (myGifosArray === null){
	myGifosArray = [];
}

async function stage4() {
  createText.style.display="none";
  
	recorder.stopRecording(onStop);
	gif = await recorder.getBlob();
  fifthStage();
}

async function fifthStage() {
  console.log(118)

  awaitUploadAnimation();

	let form = new FormData();
	form.append('file', gif, 'newGif.gif');

	let resp = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
		method: 'POST',
		body: form,
		json: true
});

  let data = await resp.json();
  
  onUploadCompleted();
  
	console.log(data.data);

	myGifosArray.push(data.data.id);

	localStorage.setItem('myGifos', JSON.stringify(myGifosArray));
  console.log(localStorage);
}

function awaitUploadAnimation() {
  uploadOverlay.classList.add("create-overlay");
  document.querySelector("#subiendo").classList.add("subiendo");
  document.querySelector(".loader").classList.remove("hidden");
}

function onUploadCompleted() {
  document.querySelector("#subiendo").textContent="GIFO subido con éxito";
  document.querySelector(".loader").setAttribute("src", "assets/check.svg");
  document.querySelector(".loader").classList.add("stopSpin");
  addToMyGifos();
}


// function interval() {
//  setInterval(() => {
   
//  }, intervalEnMilisegundos); 
// };