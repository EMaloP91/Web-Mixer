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
    })