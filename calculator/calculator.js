'use strict';

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  current: '0',       // value being entered
  previous: '',       // value before operator
  operator: null,     // pending operator symbol
  justEvaluated: false, // true after pressing "="
};

// ── Display helpers ────────────────────────────────────────────────────────
function updateDisplay() {
  resultEl.textContent = state.current;

  if (state.operator && state.previous !== '') {
    expressionEl.textContent = `${state.previous} ${state.operator}`;
  } else {
    expressionEl.textContent = '';
  }
}

// ── Core operations ────────────────────────────────────────────────────────
function evaluate(a, op, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  switch (op) {
    case '+': return numA + numB;
    case '−': return numA - numB;
    case '×': return numA * numB;
    case '÷': return numB !== 0 ? numA / numB : 'Error';
    default:  return numB;
  }
}

function formatResult(value) {
  if (value === 'Error') return 'Error';
  // Avoid floating-point noise (e.g. 0.1+0.2 = 0.30000…)
  const rounded = parseFloat(value.toPrecision(12));
  return String(rounded);
}

// ── Button handlers ────────────────────────────────────────────────────────
function handleNumber(digit) {
  if (state.justEvaluated) {
    state.current = digit;
    state.justEvaluated = false;
  } else if (state.current === '0' || state.current === 'Error') {
    state.current = digit;
  } else {
    if (state.current.replace('-', '').replace('.', '').length >= 12) return;
    state.current += digit;
  }
  updateDisplay();
}

function handleDecimal() {
  if (state.justEvaluated) {
    state.current = '0.';
    state.justEvaluated = false;
    updateDisplay();
    return;
  }
  if (state.current === 'Error') {
    state.current = '0.';
    updateDisplay();
    return;
  }
  if (!state.current.includes('.')) {
    state.current += '.';
    updateDisplay();
  }
}

function handleOperator(op) {
  if (state.current === 'Error') return;

  // Chain operations: evaluate pending operation first
  if (state.operator && !state.justEvaluated) {
    const result = evaluate(state.previous, state.operator, state.current);
    state.previous = formatResult(result);
    state.current = state.previous;
  } else {
    state.previous = state.current;
  }

  state.operator = op;
  state.justEvaluated = false;

  // Highlight the active operator button
  document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('[data-value]').forEach(btn => {
    if (btn.dataset.value === op) btn.classList.add('active');
  });

  updateDisplay();
}

function handleEquals() {
  if (!state.operator || state.current === 'Error') return;

  const result = evaluate(state.previous, state.operator, state.current);
  const formatted = formatResult(result);

  expressionEl.textContent = `${state.previous} ${state.operator} ${state.current} =`;
  state.current = formatted;
  state.previous = '';
  state.operator = null;
  state.justEvaluated = true;

  document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));

  resultEl.textContent = state.current;
}

function handleClear() {
  state.current = '0';
  state.previous = '';
  state.operator = null;
  state.justEvaluated = false;
  document.querySelectorAll('.btn-operator').forEach(btn => btn.classList.remove('active'));
  updateDisplay();
}

function handleSign() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay();
}

function handlePercent() {
  if (state.current === 'Error') return;
  state.current = formatResult(parseFloat(state.current) / 100);
  updateDisplay();
}

// ── Event delegation ───────────────────────────────────────────────────────
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  switch (action) {
    case 'number':   handleNumber(value);   break;
    case 'decimal':  handleDecimal();       break;
    case 'operator': handleOperator(value); break;
    case 'equals':   handleEquals();        break;
    case 'clear':    handleClear();         break;
    case 'sign':     handleSign();          break;
    case 'percent':  handlePercent();       break;
  }
});

// ── Keyboard support ───────────────────────────────────────────────────────
const KEY_MAP = {
  '0': () => handleNumber('0'),
  '1': () => handleNumber('1'),
  '2': () => handleNumber('2'),
  '3': () => handleNumber('3'),
  '4': () => handleNumber('4'),
  '5': () => handleNumber('5'),
  '6': () => handleNumber('6'),
  '7': () => handleNumber('7'),
  '8': () => handleNumber('8'),
  '9': () => handleNumber('9'),
  '.': () => handleDecimal(),
  ',': () => handleDecimal(),
  '+': () => handleOperator('+'),
  '-': () => handleOperator('−'),
  '*': () => handleOperator('×'),
  '/': () => handleOperator('÷'),
  'Enter':     () => handleEquals(),
  '=':         () => handleEquals(),
  'Backspace': () => {
    if (state.current.length > 1 && state.current !== 'Error') {
      state.current = state.current.slice(0, -1) || '0';
    } else {
      state.current = '0';
    }
    updateDisplay();
  },
  'Escape': () => handleClear(),
};

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const handler = KEY_MAP[e.key];
  if (handler) {
    e.preventDefault();
    handler();
  }
});

// ── Init ───────────────────────────────────────────────────────────────────
updateDisplay();
