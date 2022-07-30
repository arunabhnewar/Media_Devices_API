// Selectors
const videoContent = document.getElementById('video-content');
const turnOff = document.getElementById('turn_off_button');
const muteButton= document.getElementById('mute_button');
const shareScreen= document.getElementById('share_screen_button');
const camSelect= document.getElementById('camera_select');
const micSelect = document.getElementById('mic_select');



// Variables
let mediaStream;
let cam = true;
let mute = false;
let currentCamera;


async function getMediaUser(camId, micId) {

    currentCamera = camId === null ? currentCamera : camId;
    const camOption = currentCamera ? {deviceId: currentCamera} : true

    const initialConstraits = {
        video: true,
        audio: true
    }

    const preferenceCamContraits = {
        video: {
            deviceId: { exact: camId }
        },
        audio: true
    }

    const preferenceMicContraits = {
        video: camOption,
        audio: {
            deviceId: { exact: micId }
        }
    }
   
    try {
        const stream = await window.navigator.mediaDevices.getUserMedia(camId || micId ? camId ? preferenceCamContraits : preferenceMicContraits : initialConstraits)

        mediaStream = stream;
        
        mediaDisplay();
        getAllCams();
        getAllMics();
        console.log(mediaStream.getAudioTracks());
       
    } catch (error) {
        console.log(error);
    }
}

getMediaUser();



// Media Display Function
function mediaDisplay() {
    videoContent.srcObject = mediaStream;
    videoContent.addEventListener('loadedmetadata', () => {
        videoContent.play();
    })
}



// Mute Button Event
muteButton.addEventListener('click', (e) => {

    if (mute) {
        mute = false;
        muteButton.textContent = "Mute";

        mediaStream.getAudioTracks().forEach(singleTrack => {
            singleTrack.enabled = true;
        })

    } else {
        mute = true;
        muteButton.textContent = "Unmute";

        // console.log(mediaStream.getAudioTracks());
        mediaStream.getAudioTracks().forEach(singleTrack => {
            // console.log(singleTrack);
            singleTrack.enabled = false;
        })
    }
})



// Camera Turn Off Event
turnOff.addEventListener('click', (e) => {

    if (cam) {
        cam = false;
        turnOff.textContent = "Camera Turn On";

        // console.log(mediaStream.getVideoTracks());
        mediaStream.getVideoTracks().forEach(singleTrack => {
            singleTrack.enabled = false;
        })

        } else {
        cam = true;
        turnOff.textContent = "Camera Turn Off";

        mediaStream.getVideoTracks().forEach(singleTrack => {
            singleTrack.enabled = true;
        })
        }
})



// Access To All Cameras
async function getAllCams() {

    const currentCam = mediaStream.getVideoTracks()[0];
    const allCams = await window.navigator.mediaDevices.enumerateDevices();
    camSelect.innerText = "";
    // console.log(allCams);

    allCams.forEach(singleCam => {
        if (singleCam.kind === "videoinput") {
            const option = document.createElement('option');
            option.value = singleCam.deviceId;
            option.textContent = singleCam.label;
            option.selected = singleCam.label === currentCam.label ? true : false;
            camSelect.appendChild(option);
    }
})
    
}



// Select Specific Camera
camSelect.addEventListener('input', (e) => {
    const camId = e.target.value;
    getMediaUser(camId);
})



// Access To All Microphones
async function getAllMics() {

    const currentMic = mediaStream.getAudioTracks()[0];
    const allMics = await window.navigator.mediaDevices.enumerateDevices();
    micSelect.innerText = "";
    // console.log(allMics);

    allMics.forEach(singleMic => {
        if (singleMic.kind === "audioinput") {
            const option = document.createElement('option');
            option.value = singleMic.deviceId;
            option.textContent = singleMic.label;
            option.selected = singleMic.label === currentMic.label ? true : false;
            micSelect.appendChild(option);
    }
})
    
}



// Select Specific Microphone
micSelect.addEventListener('input', (e) => {
    const micId = e.target.value;
    getMediaUser(currentCamera, micId);
})



// Get Share Screen
async function getScreenShare() {
    try {
        mediaStream = await window.navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        })

        mediaDisplay()
        
    } catch (error) {
        console.log(error);
    }
}



// Share Screen Event
shareScreen.addEventListener('click', getScreenShare)
