class Calculator {
  constructor() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operator = null;
    this.shouldResetDisplay = false;
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operator = null;
    this.shouldResetDisplay = false;
  }

  inputDigit(digit) {
    if (this.shouldResetDisplay || this.currentValue === 'Error') {
      this.currentValue = String(digit);
      this.shouldResetDisplay = false;
    } else {
      this.currentValue =
        this.currentValue === '0' ? String(digit) : this.currentValue + digit;
    }
  }

  inputDecimal() {
    if (this.shouldResetDisplay) {
      this.currentValue = '0.';
      this.shouldResetDisplay = false;
      return;
    }
    if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
  }

  toggleSign() {
    this.currentValue = String(parseFloat(this.currentValue) * -1);
  }

  inputPercent() {
    this.currentValue = String(parseFloat(this.currentValue) / 100);
  }

  setOperator(op) {
    if (this.currentValue === 'Error') { this.clear(); return; }
    const current = parseFloat(this.currentValue);

    if (this.operator && !this.shouldResetDisplay) {
      const result = this._calculate(parseFloat(this.previousValue), current, this.operator);
      this.currentValue = String(result);
      this.previousValue = String(result);
    } else {
      this.previousValue = String(current);
    }

    this.operator = op;
    this.shouldResetDisplay = true;
  }

  calculate() {
    if (this.currentValue === 'Error') { this.clear(); return; }
    if (!this.operator || this.shouldResetDisplay) return;

    const previous = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    const result = this._calculate(previous, current, this.operator);

    this.currentValue = String(result);
    this.operator = null;
    this.previousValue = '';
    this.shouldResetDisplay = true;
  }

  _calculate(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 'Error';
      default:  return b;
    }
  }

  getDisplay() {
    return this.currentValue;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Calculator;
}
