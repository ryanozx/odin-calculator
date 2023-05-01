const topScreen = document.querySelector(".top-screen");
const bottomScreen = document.querySelector(".bottom-screen");
const acButton = document.querySelector(".ac-button");
const cButton = document.querySelector(".c-button");
const numButtons = document.querySelectorAll(".num-button");
const opButtons = document.querySelectorAll(".op-button");
const decimalButton = document.querySelector(".decimal-button");
const posnegButton = document.querySelector(".posneg-button");
const equalButton = document.querySelector(".equals-button");

const digitLimit = 12;

let charDigits = 0;
let hasDecimal = false;
let currOperator = null;
let firstNumber = null;
let isNegative = false;

function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

function operate(operator, x, y) {
    switch(operator) {
        case '+':
            return add(x, y);
        case '-':
            return subtract(x, y);
        case '*':
            return multiply(x, y);
        case '÷':
            if (y == 0) {
                alert("You can't divide by 0!")
                return null;
            }
            return divide(x, y);
        default:
            return null;
    }
}

function inputNumber(num) {
    if (charDigits == digitLimit || (isZero() && num == 0)) {
        return;
    }
    if (isZero()) {
        bottomScreen.textContent = (isNegative ? "-" : "") + num;
    } else {
        bottomScreen.textContent += num;
    }
    ++charDigits;
}

function clearScreen() {
    topScreen.textContent = "";
    currOperator = null;
    firstNumber = null;
    resetBottomScreen();
}

function deleteLastChar() {
    const bottomNumText = bottomScreen.textContent;
    let deletingDecimal = false;
    if (!isZero()) {
        if (bottomNumText.charAt(bottomNumText.length - 1) == ".") {
            deletingDecimal = true;
            hasDecimal = false;
        }
        if (bottomNumText.length - isNegative == 1) {
            bottomScreen.textContent = (isNegative ? "-" : "") + "0";
        } else {
            bottomScreen.textContent = bottomNumText.slice(0, -1);
        }
        if (!deletingDecimal || isZero()) {
            --charDigits;
        }
    }
}

function isZero() {
    return bottomScreen.textContent == "0" || bottomScreen.textContent == "-0";
}

function addDecimal() {
    if (!hasDecimal) {
        if (isZero()) {
            ++charDigits;
        }
        bottomScreen.textContent += ".";
        hasDecimal = true;
    }
}

function flipPosNeg() {
    if (!isNegative) {
        bottomScreen.textContent = "-" + bottomScreen.textContent;
    } else {
        bottomScreen.textContent = bottomScreen.textContent.slice(1);
    }
    isNegative = !isNegative;
}

function resetBottomScreen() {
    bottomScreen.textContent = "0";
    charDigits = 0;
    hasDecimal = false;
    isNegative = false;
}

function assignOperator(op) {
    if (topScreen.textContent != "" && topScreen.textContent != NaN) {
        evaluate();
    }
    if (topScreen.textContent != "NaN") {
        currOperator = op;
        firstNumber = parseFloat(bottomScreen.textContent);
        topScreen.textContent = firstNumber + " " + op;
        resetBottomScreen();
    }
}

function evaluate() {
    if (currOperator != null) {
        let result = operate(currOperator, firstNumber, parseFloat(bottomScreen.textContent));
        if (result != null) {
            const intPart = Math.trunc(result);
            if (intPart > -1 * (10 ** digitLimit) && intPart < (10 ** digitLimit)) {
                if (result != intPart) {
                    const decDigits = digitLimit - intPart.toString().length;
                    result = intPart + Math.round((result - intPart) * (10 ** decDigits)) / (10 ** decDigits); 
                }
                topScreen.textContent = firstNumber + " " + currOperator + " " + bottomScreen.textContent + " =";
                firstNumber = null;
                currOperator = null;
                bottomScreen.textContent = result;
                isNegative = result < 0;
                hasDecimal = result % 1 != 0;
                charDigits = result.toString().length - isNegative - hasDecimal;
            } else {
                console.log("exceed");
                firstNumber = null;
                currOperator = null;
                topScreen.textContent = "NaN";
                resetBottomScreen();
            }
        }
    }
    else {
        topScreen.textContent = bottomScreen.textContent + " =";
        firstNumber = null;
        currOperator = null;
    }
}

function convertOperator(op) {
    if (op === "/") {
        return "÷";
    }
    return op;
}

function handleKeyboardInput(e) {
    if (e.key >= 0 && e.key <= 9) {
        inputNumber(e.key);
    } else if (e.key === ".") {
        addDecimal();
    } else if (e.key === "=" || e.key === "Enter") {
        evaluate();
    } else if (e.key === "Backspace") {
        deleteLastChar();
    } else if (e.key === "Escape") {
        clearScreen();
    } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        assignOperator(convertOperator(e.key));
    }
}

numButtons.forEach((numButton) => numButton.addEventListener("click",
() => inputNumber(numButton.textContent)));
opButtons.forEach((opButton) => opButton.addEventListener("click",
() => assignOperator(opButton.textContent)));

acButton.addEventListener("click", () => {
    clearScreen();
})

cButton.addEventListener("click", () => deleteLastChar());
decimalButton.addEventListener("click", () => addDecimal());
posnegButton.addEventListener("click", () => flipPosNeg());
equalButton.addEventListener("click", () => evaluate());

document.body.addEventListener("keypress", (e) => {
    if (!e.repeat) {
        handleKeyboardInput(e);
    }
})

resetBottomScreen();