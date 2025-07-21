const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  history: []
};

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) return;

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    calculator.displayValue = String(result);
    calculator.firstOperand = result;
    calculator.history.push(`${firstOperand} ${operator} ${inputValue} = ${result}`);
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
  if (operator === '+') {
    return firstOperand + secondOperand;
  } else if (operator === '-') {
    return firstOperand - secondOperand;
  } else if (operator === '*') {
    return firstOperand * secondOperand;
  } else if (operator === '/') {
    return firstOperand / secondOperand;
  } else if (operator === '%') {
    return firstOperand % secondOperand;
  } else if (operator === '√') {
    return Math.sqrt(secondOperand);
  } else if (operator === '^2') {
    return firstOperand * firstOperand;
  } else if (operator === '1/x') {
    return 1 / firstOperand;
  }

  return secondOperand;
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  calculator.history = [];
}

function updateDisplay() {
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.displayValue;
}

function updateHistory() {
  const history = document.querySelector('.calculator-history');
  history.innerHTML = '';
  calculator.history.forEach((entry) => {
    const entryElement = document.createElement('div');
    entryElement.textContent = entry;
    history.appendChild(entryElement);
  });
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;

  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('operator')) {
    handleOperator(target.value);
    updateDisplay();
    updateHistory();
    return;
  }

  if (target.classList.contains('all-clear')) {
    resetCalculator();
    updateDisplay();
    updateHistory();
    return;
  }

  inputDigit(target.value);
  updateDisplay();
});

document.addEventListener('DOMContentLoaded', updateDisplay);

const calculatorElement = document.querySelector('.calculator');
const keysElement = calculatorElement.querySelector('.calculator-keys');
const displayElement = calculatorElement.querySelector('.calculator-screen');
const historyElement = calculatorElement.querySelector('.calculator-history');

keysElement.addEventListener('click', (event) => {
  if (!event.target.matches('button')) return;

  const key = event.target;
  const action = key.value;

  if (action === 'backspace') {
    // Remove the last character from the display
    displayElement.value = displayElement.value.slice(0, -1);
  } else if (action === 'all-clear') {
    displayElement.value = '';
  } else if (action === '=') {
    // Evaluate the expression
    displayElement.value = eval(displayElement.value);
  } else {
    // Append the pressed key value to the display
    displayElement.value += action;
  }
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key >= 0 && key <= 9) {
    displayElement.value += key; // Number keys
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    displayElement.value += key; // Operator keys
  } else if (key === 'Backspace') {
    displayElement.value = displayElement.value.slice(0, -1); // Backspace key
  } else if (key === 'Enter') {
    displayElement.value = eval(displayElement.value); // Enter key
  } else if (key === 'Escape') {
    displayElement.value = ''; // Clear on Escape
  }
});