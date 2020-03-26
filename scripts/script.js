/* Notes to self: 1L07HS60 min height = 3.0mm, max height = 5.2mm */
// At 5.2mm height, 34 strokes / in for this font
/*
    solution = {
        application: {
            printAreaLength
            numberOfChracters
            displayString
            printer {
                raster {
                    minHeight
                    maxHeight
                    maxStrokeRate
                    strokesPerChar
                }
                characterHeight
                strokeRate
            }
            linearSpeed
            charactersPerInch
            strokesPerInch
        }
        display {
            scaleFactor
            actualStrokePerInchAtHeight
        }
    }
*/

// _()_ (not used)
class Parameters {
    constructor() {
        this.printAreaLength = 3.5;                                                   // Default print area length of 3.5 inches
        this.numberOfCharacters = 50;                                                 // Default number of characters 50
        this.displayString = "4TNWB6J1jzE1VCnfId7tiYWV4JwPVMtKzSSTSRexWBxOZ6Q4hP";    // Default display string
        this._printerModel_ = 'A400CP';                                               // Printer Type;
        this._raster_ = '1L07HS60';                                                   // Raster
        this._characterHeight_ = '5.2mm';                                             // Character height (changing impacts display width)
        this.maxStrokeRate = 9142;                                                    // Max stroke rate of raster (currently fixed)
        this.strokeRate = this.maxStrokeRate;
        this.linearSpeed = 500;                                                       // Speed in feet per minute
        this.strokesPerChar = 6;
    }

    get linearSpeedInchPerSecond() {
        return this.linearSpeed/60.0*12.0;
    }

    get charactersPerInch() {
        return (this.strokeRate / this.strokesPerChar) / this.linearSpeedInchPerSecond;
    }

    get strokesPerInch() {
        return this.charactersPerInch * this.strokesPerChar;
    }

    get scaleFactor() {
        return 34.0 / this.strokesPerInch;
    }

    set length(val) {
        this.printAreaLength = val;
    }

    get length() {
        return this.printAreaLength;
    }

    set speed(val) {
        this.linearSpeed = val;
    }

    get speed() {
        return this.linearSpeed;
    }

    set characters(val) {
        this.numberOfCharacters = val;

        function getRandomString(length) {
            function getRandomCharacter() {
                const validCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabdefghijklmnopqrstuvwxyz0123456789"
                return validCharacters.charAt(Math.floor(Math.random() * validCharacters.length))
            }
    
            let result = '';
    
            for(let i = 0; i < length; i++) {
                result += getRandomCharacter();
            }
    
            return result;
        }
        this.displayString = getRandomString(this.numberOfCharacters);
    }

    get characters() {
        return this.numberOfCharacters;
    }

    set 'stroke-rate'(val) {
        this.strokeRate = val;
    }
}

const parameters = new Parameters();

const inputs = document.querySelectorAll('#controls input');
const strokeRateInput = document.getElementById('stroke-rate');
const printDisplay = document.getElementById('print');

function initializeDisplay() {
    inputs.forEach(input => input.placeholder = parameters[input.id]);
    strokeRateInput.value = strokeRateInput.max = parameters.maxStrokeRate;
}

function updateDisplay() {
    document.documentElement.style.setProperty('--length', `${parameters.printAreaLength}in`);
    printDisplay.textContent = parameters.displayString;
    document.documentElement.style.setProperty('--scale', parameters.scaleFactor);
    console.log(`The stroke rate is ${parameters.strokeRate} strokes per second.`);
    console.log(`The number of characters per inch is ${parameters.charactersPerInch}.`)
}

function updateProperty() {
    parameters[this.id] = this.valueAsNumber;
    updateDisplay();
}

inputs.forEach(input => input.addEventListener('change', updateProperty))

initializeDisplay();
updateDisplay();