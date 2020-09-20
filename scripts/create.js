

function getStreamAndRecord () { 
    navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
       height: { max: 480 }
    }
 })
 .then(function(stream) {
    let capturedGif = document.querySelector("#captured-gif");
    capturedGif.srcObject = stream;
    capturedGif.play();
 })
}

document.querySelector("#create").addEventListener("click", getStreamAndRecord);

/* falta que se cierre el video cuando sea necesario */




  

