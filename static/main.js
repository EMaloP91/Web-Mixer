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

// add name of each instrument to every channel
// fetch audio files from server
fetch('/audiofiles')
    .then(response => response.json())
    .then(audioFilenames => {
        let names = document.querySelectorAll(".nametrack");
        names.forEach((name,index) => {
            if (index < audioFilenames.length) {
                name.innerText = audioFilenames[index];
            }
        });
    })

    console.log(audioFilenames);