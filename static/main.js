// get all faders
let faders = document.querySelectorAll(".fader input[type='range']");

// get all pans
let pans = document.querySelectorAll(".pan input[type='range']");


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

const onButton = document.getElementById("onbutton");

onButton.addEventListener("click", () => {
    // create a new audio base context to start API
    const audioCtx = new AudioContext();

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
        });


    // create an async function to avoid other code execute before it 
    // decode audio with this function
    async function getFile(audioContext, filepath) {
        // call the audio from the server
        const response = await fetch(filepath);
        // wait for response and store it in const
        const arrayBuffer = await response.arrayBuffer();
        // decode the audio of the buffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        // return the audio information
        return audioBuffer;
    };

    //async function to store audio data in buffer array
    async function setUpBuffers() {
        // create buffer array
        let audioBuffers = [];
        // create loop to iterate trhough each url
        for (let i = 0; i < audioUrls.length; i++) {
            //store data of the url in a buffer an then in array
            const audbuffer = await getFile(audioCtx, audioUrls[i]);
            audioBuffers.push(audbuffer);
        }
        // return array of buffers
        return audioBuffers;
    };

    // store buffers
    let buffers = setUpBuffers();

    //create audioBuffersSourceNodes for each audio
    let sourceNodes = [];

    for (let i = 0; i < buffers.length; i++) {
        let buffer = audioCtx.createBufferSource();
        buffer.buffer = buffers[i];
        buffer.connect(audioCtx.destination);
        sourceNodes.push(buffer);
    };

    //get the play pause button
    const playPause = document.getElementById("play-pause");

    //create constant to check if song is being played or not
    //let isPlaying = false;
    // setup play function to click on button
    playPause.addEventListener("click", (ev) => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume;
        }

        if (audioCtx.state === 'running') {
            audioCtx.suspend;
        }
    });
});


