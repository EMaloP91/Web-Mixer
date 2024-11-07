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
        fader.setAttribute('value', fader.value);
    });
});