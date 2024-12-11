
// declare audio context variable
let audioCtx;

// initialize a time variable
let time = 0;

// initialize a source variable
let sampleSources = [];

// initialize the start and end of loop 
let loopEnd;
let loopStart = 0;

//declare array to store the URLs of the audio files
let audioUrls = [];
// create flags
let flag = "running";
let setupDone = false;

// get all faders
let faders = document.querySelectorAll(".fader input[type='range']");

// create array that will contain gain nodes
let gains = [];

// get all pans
let pans = document.querySelectorAll(".pan input[type='range']");

// create array that will contain stereo Panner nodes
let panners = [];

// get button to start audio context (start console)
const onButton = document.getElementById("onbutton");

// get h2 text 
const setupText = document.getElementById("sample-setup")

// get button to play and pause
const playPauseBtn = document.getElementById("play-pause");

// get button to stop
const stopBtn = document.getElementById("stop");

// get all channel container elements
const channels = document.querySelectorAll(".channel");

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

onButton.addEventListener("click", () => {
    // create a new audio base context to start API
    audioCtx = new AudioContext();
    console.log("audio context started");

    // cretea panner nodes
    for (let i = 0; i < pans.length; i++) {
        panners[i] = audioCtx.createStereoPanner();
    }

    // create gain nodes for faders
    for (let i = 0; i < faders.length; i++) {
        gains[i] = audioCtx.createGain();
    }

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

                // hide h2 text that is not necesary
                setupText.style.visibility = "hidden";

                // define end of loop
                loopEnd = samples[0].duration;
                
                // start playing song from beginning
                if (time === 0) {
                    for (let i = 0; i < samples.length; i++) {
                        playSample(samples[i], 0, time, i);
                    }
                    // change time to 1
                    time = 1;
                }

                // pause audio
                else if (audioCtx.state === 'running') {
                    audioCtx.suspend().then(() => {
                        flag = "suspended";
                    });

                }
                // resume audio
                else if (audioCtx.state === 'suspended') {
                    audioCtx.resume().then(() => {
                        flag = "running";
                    })
                }
            });
            // add a stop button that calls stop function
            stopBtn.addEventListener("click", () => {
                stopSong(sampleSources);
                // change tiem to 0
                time = 0;
            });
            // adding control of the pan sliders
            for (let i = 0; i < pans.length; i++) {
                pans[i].oninput = () => {
                    panners[i].pan.setValueAtTime(pans[i].value, 0);
                }
            }
            // adding control of the gain sliders
            for (let i = 0; i < faders.length; i++) {
                faders[i].oninput = () => {
                    gains[i].gain.setValueAtTime(faders[i].value, 0);
                }
            }
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
    if (setupDone === false) {
        setupText.style.visibility = "visible";
    }
    //creating a loop to store each buffer
    for (const path of paths) {
        const sample = await getFile(path);
        audioBuffers.push(sample);
    }

    // return the new created array of buffers
    console.log("setting up done");
    // change samplsSetup flag 
    setupDone = true;

    // show controls
    if (setupDone === true) {
        setupText.innerText = "Ready";
        playPauseBtn.style.visibility = "visible";
        stopBtn.style.visibility = "visible";
        channels.forEach((channel) => {
            channel.style.visibility = "visible";
        });
    }
    return audioBuffers;
};

// create function to play audio
// function accepts an audiobuffer, a "when" to start (now, later), and at what point in the song to start
function playSample(audioBuffer, time, startTime, index) {
    // create an audio audio buffer source node
    let audio = audioCtx.createBufferSource();
    // adding the audio buffer soruce node to the array (so that it can be called later)
    sampleSources[index] = audio;
    // store the decoded audio in the buffer node
    audio.buffer = audioBuffer;
    // connecting it to the pan node
    audio.connect(panners[index]);
    // connecting the pan node to the gain node
    panners[index].connect(gains[index]);
    // starting the loop
    audio.loop = true;
    // setting the start of the loop
    audio.loopStart = loopStart;
    // setting the end of the loop
    audio.loopEnd = loopEnd;
    // connecting the gain node to the audio 
    gains[index].connect(audioCtx.destination);
    // starting the audio
    audio.start(time, startTime);
};

// create a function to stop the song
function stopSong(sources) {
    for (let i = 0; i < sources.length; i++) {
        sources[i].stop();
    }
}
