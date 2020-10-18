let recorder;
let gif;
let stoppedFlag = false;

const video = document.getElementById("gif-captor-video");
let timer = document.querySelector(".timer");
let timerSet=null;

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
      console.log("Error: " + err);
    });
}


function stage2() {
// some DOM stuff
}

function stage3() {

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

    let s = 0;
    stoppedFlag = false;

    timerSet = setInterval(setTimer, 1000); // fancy timer

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

    /* Had to add a second for the recording to start,  otherwise I'd get this error: 
    
    RecordRTC.js:4734 Uncaught (in promise) TypeError: Cannot read property 'stream' of undefined
    at GifRecorder.stop (RecordRTC.js:4734)
    at Object.stopRecording (RecordRTC.js:135)
    at stage4 (create.js:166)
    at HTMLAnchorElement.<anonymous> (create.js:39)
    
    */
    startFilm.style.pointerEvents = "none";
    setTimeout(() => {
      startFilm.style.pointerEvents = "unset";
    }, 1000);
    state = 2;

  });
}

function onStop() {
  stoppedFlag = true;
}

async function stage4() {

  state = 2;
  await recorder.stopRecording(onStop);

  gif = await recorder.getBlob();

  state = 3;
}

async function stage5() {

  awaitUploadAnimation();

  let form = new FormData();
  await form.append('file', gif, 'newGif.gif');

  let resp = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
    method: 'POST',
    body: form,
    json: true,
    mode: 'cors'
  });

  /* Second error: occurs half of the times, although I have dealt with CORS: Access to fetch at 'https://upload.giphy.com/v1/gifs?=[object%20FormData]&api_key=VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn' from origin 'https://mollzilla.github.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled. */


  let data = await resp.json();

  onUploadCompleted();

  function awaitUploadAnimation() {
    // more DOM stuff
  }

  function onUploadCompleted() {
    // aaand... more DOM stuff
  }
  state = 4;
}