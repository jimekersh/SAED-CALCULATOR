(function() {
    "use strict";

    // DOM references
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');

    // Calculator state
    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let shouldResetDisplay = false;

    // Update display
    function updateDisplay(value) {
        display.value = (value !== undefined) ? value : currentInput;
    }

    // Handle number or decimal input
    function inputDigit(digit) {
        if (shouldResetDisplay) {
            currentInput = digit;
            shouldResetDisplay = false;
        } else {
            if (digit === '.' && currentInput.includes('.')) return;
            if (currentInput === '0' && digit !== '.') {
                currentInput = digit;
            } else {
                currentInput += digit;
            }
        }
        updateDisplay();
    }

    // Handle operator
    function handleOperator(op) {
        const current = parseFloat(currentInput);
        if (operator && !shouldResetDisplay) {
            const result = compute(parseFloat(previousInput), current, operator);
            currentInput = String(result);
            updateDisplay();
        }
        previousInput = currentInput;
        operator = op;
        shouldResetDisplay = true;
    }

    // Perform calculation
    function compute(a, b, op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 'Error';
            default: return b;
        }
    }

    // Evaluate equals
    function evaluate() {
        if (!operator || shouldResetDisplay) return;
        const current = parseFloat(currentInput);
        const result = compute(parseFloat(previousInput), current, operator);
        
        if (result === 'Error') {
            currentInput = 'Error';
            updateDisplay();
            operator = null;
            previousInput = '';
            shouldResetDisplay = true;
            return;
        }
        
        currentInput = String(result);
        updateDisplay();
        operator = null;
        previousInput = '';
        shouldResetDisplay = true;
    }

    // Clear all
    function clearAll() {
        currentInput = '0';
        previousInput = '';
        operator = null;
        shouldResetDisplay = false;
        updateDisplay();
    }

    // Toggle sign
    function toggleSign() {
        if (currentInput === '0') return;
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }

    // Percent
    function percent() {
        const num = parseFloat(currentInput);
        if (isNaN(num)) return;
        currentInput = String(num / 100);
        updateDisplay();
    }

    // Glow effect on button click
    function addGlow(btn) {
        btn.classList.add('btn-glow');
        setTimeout(() => {
            btn.classList.remove('btn-glow');
        }, 150);
    }

    // Main click handler
    function onButtonClick(e) {
        const btn = e.currentTarget;
        const value = btn.dataset.value;

        // Apply glow effect
        addGlow(btn);

        // Handle button actions
        switch (value) {
            case 'clear':
                clearAll();
                break;
            case 'sign':
                toggleSign();
                break;
            case 'percent':
                percent();
                break;
            case '=':
                evaluate();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                handleOperator(value);
                break;
            default:
                inputDigit(value);
        }
    }

    // Attach click listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', onButtonClick);
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        let targetBtn = null;

        if (key >= '0' && key <= '9') {
            targetBtn = document.querySelector(`.btn[data-value="${key}"]`);
        } else if (key === '.') {
            targetBtn = document.querySelector(`.btn[data-value="."]`);
        } else if (key === '+') {
            targetBtn = document.querySelector(`.btn[data-value="+"]`);
        } else if (key === '-') {
            targetBtn = document.querySelector(`.btn[data-value="-"]`);
        } else if (key === '*') {
            targetBtn = document.querySelector(`.btn[data-value="*"]`);
        } else if (key === '/') {
            targetBtn = document.querySelector(`.btn[data-value="/"]`);
        } else if (key === 'Enter' || key === '=') {
            targetBtn = document.querySelector(`.btn[data-value="="]`);
            e.preventDefault();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            targetBtn = document.querySelector(`.btn[data-value="clear"]`);
        } else if (key === '%') {
            targetBtn = document.querySelector(`.btn[data-value="percent"]`);
        }

        if (targetBtn) {
            targetBtn.click();
        }
    });

    // Initialize display
    updateDisplay();
})();