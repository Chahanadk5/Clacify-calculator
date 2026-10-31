
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");
const historyList = document.getElementById("history");

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;

// Update calculator screen
function updateDisplay() {
    currentDisplay.textContent = current;
}

// Add a number
function addNumber(number) {
    if (resetNext || current === "Error") {
        current = number;
        resetNext = false;
    } else {
        if (current.replace("-", "").length >= 12) return;

        current = current === "0" ? number : current + number;
    }

    updateDisplay();
}

// Add decimal point
function addDecimal() {
    if (resetNext || current === "Error") {
        current = "0.";
        resetNext = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateDisplay();
}

// Select an operator
function chooseOperator(selectedOperator) {
    if (current === "Error") return;

    if (operator !== null && !resetNext) {
        calculate();
    }

    previous = current;
    operator = selectedOperator;
    previousDisplay.textContent = `${previous} ${getSymbol(operator)}`;
    resetNext = true;
}

// Convert operator symbols
function getSymbol(op) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[op];
}

// Perform calculation
function calculate() {
    if (operator === null || previous === null) return;

    const first = Number(previous);
    const second = Number(current);

    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":
            if (second === 0) {
                current = "Error";
                previousDisplay.textContent = "Cannot divide by zero";
                operator = null;
                previous = null;
                resetNext = true;
                updateDisplay();
                return;
            }
            result = first / second;
            break;
    }

    const expression =
        `${previous} ${getSymbol(operator)} ${current}`;

    // Avoid long floating-point decimal results
    result = Number(result.toPrecision(12));

    current = String(result);

    previousDisplay.textContent = `${expression} =`;

    addHistory(expression, current);

    previous = null;
    operator = null;
    resetNext = true;

    updateDisplay();
}

// Add result to history
function addHistory(expression, result) {
    const emptyMessage = historyList.querySelector(".empty");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const item = document.createElement("li");
    item.textContent = `${expression} = ${result}`;

    historyList.prepend(item);

    // Keep only the latest five calculations
    while (historyList.children.length > 5) {
        historyList.lastElementChild.remove();
    }
}

// Clear everything
function clearCalculator() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;

    previousDisplay.textContent = "Ready to calculate?";

    updateDisplay();
}

// Delete last digit
function deleteDigit() {
    if (resetNext || current === "Error") {
        current = "0";
        resetNext = false;
    } else {
        current = current.length > 1
            ? current.slice(0, -1)
            : "0";

        if (current === "-") current = "0";
    }

    updateDisplay();
}

// Change positive to negative or negative to positive
function changeSign() {
    if (current === "0" || current === "Error") return;

    current = current.startsWith("-")
        ? current.slice(1)
        : "-" + current;

    resetNext = false;
    updateDisplay();
}

// Percentage calculation
function percentage() {
    if (current === "Error") return;

    current = String(Number(current) / 100);
    resetNext = true;
    updateDisplay();
}

// Handle all calculator buttons
document.querySelector(".buttons").addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        addNumber(button.dataset.number);
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteDigit();
            break;

        case "decimal":
            addDecimal();
            break;

        case "equals":
            calculate();
            break;

        case "sign":
            changeSign();
            break;

        case "percent":
            percentage();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (key >= "0" && key <= "9") {
        addNumber(key);
    } else if (key === ".") {
        addDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteDigit();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});

// Clear calculation history
document.getElementById("clearHistory").addEventListener("click", function() {
    historyList.innerHTML =
        '<li class="empty">Your calculations will appear here.</li>';
});
