// get all faders
let faders = document.querySelectorAll(".fader input[type='range']");

// get all pans
let pans = document.querySelectorAll(".pan input[type='range']");

// declare audio context variable
let audioCtx;

// initialize a time variable
let time = 0;

let sampleSource;

let loopEnd;

let loopStart = 0;

// loop through each pan
pans.forEach(pan => {
    //add an event listener for when the range is moved
    pan.addEventListener('input', function() {
        //change the attribute value accordingly
        pan.setAttribute('value', pan.value);
    });
});

// loop through each fader
faders.forEach(fader => {
    //add an event listener for when the range is moved
    fader.addEventListener('input', function() {
        //change the attribute value accordingly
        fader.setAttribute('value', (2 * Math.log10(fader.value)).toFixed(2).toString());
    });
});

//declare array to store the URLs of the audio files
let audioUrls = [];

let flag = "running";

// get button to start audio context (start console)
const onButton = document.getElementById("onbutton");

// get button to play and pause
const playPauseBtn = document.getElementById("play-pause");

onButton.addEventListener("click", () => {
    // create a new audio base context to start API
    audioCtx = new AudioContext();
    console.log("audio context started");

    // add name of each instrument to every channel
    // fetch audio files from server
    fetch('/audiofiles')
        // turn response of server to javascript objects
        .then(response => response.json())
        // use the javascript objects obtained from server
        .then(audioFilenames => {
            // get all nametrack <p> elements
            let names = document.querySelectorAll(".nametrack");
            // loop through each name 
            names.forEach((name,index) => {
                if (index < audioFilenames.length) {
                    // change the name of the channel to each audiofile name
                    name.innerText = audioFilenames[index];
                    // store the urls of each sound in the array
                    let audioUrl = `/static/${audioFilenames[index]}`;
                    audioUrls.push(audioUrl);
                }
            });
        return setupSamples(audioUrls);
        })
        .then(samples => {
            playPauseBtn.addEventListener("click", () => {
                console.log(audioCtx.currentTime);
                loopEnd = samples[0].duration;
                if (time === 0) {
                    for (let i = 0; i < samples.length; i++) {
                        playSample(samples[i], 0, time);
                    }
                    time = 1;
                }
                else if (audioCtx.state === 'running') {
                    audioCtx.suspend().then(() => {
                        //currenTime = audioCtx.currentTime;
                        flag = "suspended";
                    });

                }
                else if (audioCtx.state === 'suspended') {
                    audioCtx.resume().then(() => {
                        flag = "running";
                    })
                }
            });
        }); 
    });

// create async function to fetch audiofiles
async function getFile(filepath) {
    //fetcth audiofile and wait for response
    const response = await fetch(filepath);
    //store the information of the response in an arrayBuffer using
    //arrayBuffer method
    const arrayBuffer = await response.arrayBuffer();
    //decode the data into audio and store it in audiobuffer
    //using the audio context initialized before
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    //return audioBuffer
    return audioBuffer;
};

// create async funciton to prepare audio samples
//and store them in an array
async function setupSamples(paths) {
    // prepare an array for storing buffers
    const audioBuffers = [];
    console.log("setting up samples");
    //creating a loop to store each buffer
    for (const path of paths) {
        const sample = await getFile(path);
        audioBuffers.push(sample);
    }

    // return the new created array of buffers
    console.log("setting up done")
    return audioBuffers;
};

function playSample(audioBuffer, time, startTime) {
    sampleSource = audioCtx.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioCtx.destination);
    sampleSource.loop = true;
    sampleSource.loopStart = loopStart;
    sampleSource.loopEnd = loopEnd;
    sampleSource.start(time, startTime);
};
