const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

let recorder;
let gif;
let stoppedFlag = false;
let activatedStage3Button=false

let createContainer = document.querySelector(".create");
let startFilm = document.querySelector("#start-film")
let createText = document.querySelector(".create-text");
let gifCaptor = document.querySelector(".gif-captor");
let textChildren = createText.childNodes;
const video = document.getElementById("gif-captor-video");
video.style.display = "none";
let timer = document.querySelector(".timer");
let [filmStage1, filmStage2, filmStage3] = Array.from(document.querySelectorAll(".film-stage"));
uploadOverlay = document.querySelector("#create-overlay");

let repetirCaptura = document.querySelector(".repetir-captura");
repetirCaptura.style.display = "none";
repetirCaptura.addEventListener("click", stage3);

let timerSet=null;

document.querySelector("#crear").addEventListener("click", (e) => {
  e.preventDefault();
  stage0();
  startFilm.style.display="block"
});

let state = 0; // initial state before recording

startFilm.addEventListener('click', (e) => {
  e.preventDefault();

  if (state == 0)
    stage1(e);
  else if (state == 1)
    stage3();
  else if (state == 2)
    stage4();
  else if (state == 3)
    stage5();
});

async function stage1(e) {

  startFilm.classList.add("disabled");
  filmStage1.classList.add("activated");
  textChildren[1].innerHTML = "¿Nos das acceso <br> a tu cámara?";
  textChildren[3].innerHTML = "El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO.";

  getMediaPermissions();
}

function getMediaPermissions() {

  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
  navigator.getUserMedia(
    {
      audio: false,
      video: true,
      video: {
        height: { max: 240 }
      }
    },

    async function (localMediaStream) {
      video.srcObject = localMediaStream;
      state = 1;
      await stage2();
    },

    function (err) {
      console.log("Ocurrió el siguiente error: " + err);
    });
}


function stage2() {

  filmStage2.classList.add("activated");
  filmStage1.classList.remove("activated");

  startFilm.classList.remove("disabled");
  startFilm.textContent = "GRABAR";

  video.style.display = "block";
  textChildren[1].innerHTML = "";
  textChildren[3].innerHTML = "";
}

function stage3() {

  if(startFilm.style.opacity==0.25)
    {
      console.log("currently recording-skipping");
      return;
    }
  // filmStage2.classList.remove("activated");

  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(async function (stream) {
    recorder = RecordRTC(stream, {
      type: 'gif',
      frameRate: 1,
      quality: 10,
      width: 360,
      hidden: 240,
      onGifRecordingStarted: function () {
        console.log('started')
      }
    }
    );

    recorder.startRecording();

    video.style.display = "block";

    let s = 0;
    stoppedFlag = false;

    timer.style.display = "block";
    repetirCaptura.style.display = "none";

    timerSet = setInterval(setTimer, 1000);

    function setTimer() {
      if (stoppedFlag == true) {
        clearInterval(timerSet)
        s = 0;
      }
      else {
        let timeValue = new Date(s * 1000).toISOString().substr(11, 8)

        timer.textContent = timeValue;
        s++;
      }
    };

        /* Permito la ejecución de startRecording dándole un segundo de ventaja, virtualmente imperceptible para el usuario */
    startFilm.style.opacity=".25"
    
    setTimeout(() => {
      startFilm.style.opacity="1"
      startFilm.textContent = "FINALIZAR";
      state = 2;
    }, 1500);

  });
}

function onStop() {
  stoppedFlag = true;
}

async function stage4() {

  state = 2;

  startFilm.textContent = "SUBIR GIFO";
  createText.style.display = "none";

  timer.style.display = "none";
  repetirCaptura.style.display = "block";

  await recorder.stopRecording(onStop);

  gif = await recorder.getBlob();

  state = 3;
}

async function stage5() {

  startFilm.classList.add("disabled");

  filmStage2.classList.remove("activated");
  filmStage3.classList.add("activated");

  repetirCaptura.style.display = "none";

  awaitUploadAnimation();

  let form = new FormData();
  await form.append('file', gif, 'newGif.gif');

  let resp = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
    method: 'POST',
    body: form,
    json: true,
    mode: 'cors'
  });

  let data = await resp.json();

  onUploadCompleted();

  function awaitUploadAnimation() {
    uploadOverlay.classList.add("create-overlay");
    document.querySelector("#subiendo").classList.add("subiendo");
    document.querySelector(".loader").classList.remove("hidden");
  }

  function onUploadCompleted() {
    document.querySelector("#subiendo").textContent = "GIFO subido con éxito";
    document.querySelector(".loader").setAttribute("src", "assets/check.svg");
    document.querySelector(".loader").classList.add("stopSpin");
    startFilm.style.display="none";

    addActionIcons(data.data.id)

    console.log(data)

    if (!localStorage.getItem('myGifos')) {
      let myGifo = [data.data.id]
      localStorage.setItem("myGifos", myGifo);
    }
    else {
      let myGifos = localStorage.getItem('myGifos').split(",");
      myGifos.push(data.data.id);
      localStorage.setItem("myGifos", myGifos.toString(", "));
    }
  }

  state = 4;
}

function addActionIcons(id) {

  let actionIcons = document.createElement("div");
  actionIcons.classList.add("create-action-icons");

  let download = document.createElement("a");
  download.id=id;
  download.addEventListener('click', downloadAction);

  let copyURL = document.createElement("a");
  copyURL.id = id;
  copyURL.addEventListener('click', (e) => { copyURLAction(e) });

  [download, copyURL].forEach(a => {
    a.classList.add(id, "create-action-icon")
    actionIcons.appendChild(a)
  });

  // actionIcons.appendChild(download)

  uploadOverlay.appendChild(actionIcons);
}

let favoritesButtonSm = document.querySelector("#favoritos-sm");
let favoritesButtonLg = document.querySelector("#favoritos-lg");

let misGifosSm = document.querySelector("#mis-gifos-sm");
let misGifosLg = document.querySelector("#mis-gifos-lg");

/* Triggers button event even after being redirected to another page thanks to location.hash */

[favoritesButtonSm, favoritesButtonLg, misGifosSm, misGifosLg].forEach(button => button.addEventListener('click', e => {
  e.preventDefault();
  console.log(e);
  window.location.href = `index.html#${e.path[0].id}`;
}));


function stage0() {
  video.style.display = "none";
  uploadOverlay.style.display="none";
  repetirCaptura.style.display = "none";
  createContainer.style.display = "block";
  [filmStage1, filmStage2, filmStage3].map(b => b.classList.remove("activated"));
  createText.style.display="block";
  textChildren[1].innerHTML = "Aquí podrás <br>  tus propios <span id='gifos-green'>GIFOS</span>";
  textChildren[3].innerHTML = "¡Crea tu GIFO en sólo 3 pasos! <br> (sólo necesitas una cámara para grabar un video)";
  clearInterval(timerSet);
  stoppedFlag=false;
  timer.style.display = "none";
  repetirCaptura.style.display = "none";
  startFilm.style.display="block";
  startFilm.innerHTML="COMENZAR";
  state=0;
}