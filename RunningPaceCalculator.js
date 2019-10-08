document.getElementById('output').style.visibility = 'hidden'; //Hides output cards as default
var distanceBusy, timeBusy, paceBusy; //current state of input fields (true/false), if not empty then busy

var mToKm = 1.60934;

var distanceInput = document.getElementById('distanceInput');
var distanceUnitInput = document.getElementById('distance_selector');
var timeHourInput = document.getElementById('timeHourInput');
var timeMinuteInput = document.getElementById('timeMinuteInput');
var timeSecondInput = document.getElementById('timeSecondInput');
var paceMinuteInput = document.getElementById('paceMinuteInput');
var paceSecondInput = document.getElementById('paceSecondInput');
var paceUnitInput = document.getElementById('pace_selector');

// -----functions-----
function checkInput(input, min, max) {
    if (input.value.length > 2 && input !== distanceInput) {
        input.value = input.value.slice(0, 2);
    }
    if (isNaN(+input.value)) {
        input.value = "";
    }
    if (+input.value >= max+1) {
        input.value = "";
    } else if (+input.value <= min-1) {
        input.value = "";
    }
}
function calculateDistance() {
    var totalTimeSeconds = +timeSecondInput.value + (+timeMinuteInput.value*60) + (+timeHourInput.value*3600);
    var totalPaceSeconds = +paceSecondInput.value + (+paceMinuteInput.value*60);

    if ((distanceUnitInput.value === "miles" && paceUnitInput.value === "mile") || (distanceUnitInput.value === "kilometers" && paceUnitInput.value === "kilometer")) {
        //If both distance and pace units are same
        distanceInput.value = Math.round( (totalTimeSeconds / totalPaceSeconds) * 1000 + Number.EPSILON ) / 1000;
    } else if (distanceUnitInput.value === "miles" && paceUnitInput.value === "kilometer") {
        //If distance unit is miles and pace unit is kilometer
        distanceInput.value = Math.round( (totalTimeSeconds / totalPaceSeconds)/mToKm * 1000 + Number.EPSILON ) / 1000;
    } else if (distanceUnitInput.value === "kilometers" && paceUnitInput.value === "mile") {
        //If distance unit is kilometers and pace unit is mile
        distanceInput.value = Math.round( (totalTimeSeconds / totalPaceSeconds)*mToKm * 1000 + Number.EPSILON ) / 1000;
    }
}
function calculateTime() {
    var totalDistanceMiles;
    var totalPacePerMile;
    var totalTimeSeconds;

    if (distanceUnitInput.value === "miles") {
        //Sets total miles to distance input
        totalDistanceMiles = +distanceInput.value;
    } else if (distanceUnitInput.value === "kilometers") {
        //Sets total miles to distance input * 1.60934 (mile to km conversion)
        totalDistanceMiles = +distanceInput.value / mToKm;
    }

    if (paceUnitInput.value === "mile") {
        totalPacePerMile = +paceMinuteInput.value*60 + +paceSecondInput.value;
    } else if (paceUnitInput.value === "kilometer") {
        totalPacePerMile = (+paceMinuteInput.value*60 + +paceSecondInput.value)*mToKm;
    }

    totalTimeSeconds = Math.round(totalDistanceMiles * totalPacePerMile);

    if (totalTimeSeconds / 3600 >= 1) {
        timeHourInput.value = (Math.floor(totalTimeSeconds/3600));
        totalTimeSeconds -= (+timeHourInput.value * 3600); //totalTimeSeconds = totalTimeSeconds - hours value
    }
    if (totalTimeSeconds / 60 >= 1) {
        timeMinuteInput.value = (Math.floor(totalTimeSeconds/60));
        totalTimeSeconds -= (+timeMinuteInput.value * 60); //totalTimeSeconds = totalTimeSeconds - minute value
    }
    timeSecondInput.value = Math.round(totalTimeSeconds);
}
function calculatePace() {
    var totalDistanceMiles;
    var totalTimeSeconds = +timeSecondInput.value + (+timeMinuteInput.value*60) + (+timeHourInput.value*3600);
    var totalPaceSecondsMiles;

    if (distanceUnitInput.value === "miles") {
        //Sets total miles to distance input
        totalDistanceMiles = +distanceInput.value;
    } else if (distanceUnitInput.value === "kilometers") {
        //Sets total miles to distance input * 1.60934 (mile to km conversion)
        totalDistanceMiles = +distanceInput.value / mToKm;
    }

    totalPaceSecondsMiles = Math.round(totalTimeSeconds/totalDistanceMiles);

    if (paceUnitInput.value === "mile") {
        if (totalPaceSecondsMiles / 60 >= 1) {
            paceMinuteInput.value = (Math.floor(totalPaceSecondsMiles/60));
            totalPaceSecondsMiles = totalPaceSecondsMiles - (+paceMinuteInput.value * 60);
        }
        paceSecondInput.value = Math.round(totalPaceSecondsMiles);
    } else if (paceUnitInput.value === "kilometer") {
        totalPaceSecondsMiles /= mToKm;
        if (totalPaceSecondsMiles / 60 >= 1) {
            paceMinuteInput.value = (Math.floor(totalPaceSecondsMiles/60));
            totalPaceSecondsMiles = totalPaceSecondsMiles - (+paceMinuteInput.value * 60);
        }
        paceSecondInput.value = totalPaceSecondsMiles | 0;
    }
}
function resetFields() {
    var input_field = document.getElementsByClassName('form-control'); //list of all input fields
    for (var i=0; i < input_field.length; i++) {
        input_field[i].value = ""; //sets all input fields to nothing to show placeholder
        input_field[i].disabled = false;
        distanceBusy = false;
        timeBusy = false;
        paceBusy = false;
    }
    distanceUnitInput.value = "miles";
    paceUnitInput.value ="mile";
    document.getElementById('output').style.visibility = 'hidden';
}
function checkBusy() {
    if (distanceBusy === true && timeBusy === true) {
        //If distance and time are filled, disable pace
        document.getElementById('paceMinuteInput').disabled = true;
        document.getElementById('paceSecondInput').disabled = true;
        calculatePace();
    } else if (distanceBusy === true && paceBusy === true) {
        //If distance and pace and filled, disable time
        timeHourInput.disabled = true;
        timeMinuteInput.disabled = true;
        timeSecondInput.disabled = true;
        calculateTime();
    } else if (timeBusy === true && paceBusy === true) {
        //If time and pace are filled, disable distance
        document.getElementById('distanceInput').disabled = true;
        calculateDistance();
    }
}


// -----action listeners-----
//Reset Button
document.getElementById('reset').addEventListener('click', function(e) {
    resetFields();
});

//Distance Unit Selector
distanceUnitInput.onchange = function() {
    checkBusy();
};
//Distance Input
distanceInput.addEventListener('input', function(e) {
    checkInput(distanceInput, 0, 99999999);
    if (distanceInput.value !== "") {
        distanceBusy = true;
    }
    checkBusy();
});


//---time action listeners---
//Time Input
function timeInputListener() {
    if ((timeHourInput.value !== "") || (timeMinuteInput.value !== "") || (timeSecondInput.value !== "")) {
        timeBusy = true;
    }
    checkBusy();
}
//Time Hour Input
timeHourInput.addEventListener('input', function(e) {
    checkInput(timeHourInput, 0, 59);
    timeInputListener();
});
//Time Minute Input
timeMinuteInput.addEventListener('input', function(e) {
    checkInput(timeMinuteInput, 0, 59);
    timeInputListener();
});
//Time Second Input
timeSecondInput.addEventListener('input', function(e) {
    checkInput(timeSecondInput, 0, 59);
    timeInputListener();
});

//---pace action listeners---
function paceInputListener() {
    if ((paceMinuteInput.value !== "") || (paceSecondInput.value !== "")) {
        paceBusy = true;
    }
    checkBusy();
}
//Pace Unit Selector
paceUnitInput.onchange = function() {
    checkBusy();
};
//Pace Minute Input
paceMinuteInput.addEventListener('input', function(e) {
    checkInput(paceMinuteInput, 0, 59);
    paceInputListener();
});
//Pace Second Input
paceSecondInput.addEventListener('input', function(e) {
    checkInput(paceSecondInput, 0, 59);
    paceInputListener();
});
