# Barotrauma Multiply Component

## Overview

The **Multiply Component** is a mathematical signal processing component in Barotrauma's electrical system that performs multiplication operations on electrical signals. It takes two input values and outputs their product, making it essential for scaling, amplification, and mathematical calculations in electrical circuits.

**Official Description:** "Outputs the product of the received signals."

## Component Properties

### Basic Information
- **Identifier:** `multiplycomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#8bafd7` (Light Blue)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in1`** - First input signal (first multiplicand)
- **`signal_in2`** - Second input signal (second multiplicand)

#### Output Pins
- **`signal_out`** - Output signal (product of the two inputs)

### Configurable Properties

The MultiplyComponent uses a MultiplyComponent class, which may support:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Precision`** - Decimal places for output (default: 0)

## Mathematical Function

The Multiply component performs the mathematical operation:

```
output = signal_in1 × signal_in2
```

Or in mathematical notation:
```
output = signal_in1 · signal_in2 = product(signal_in1, signal_in2)
```

### Mathematical Properties

1. **Commutative:** a × b = b × a
2. **Associative:** (a × b) × c = a × (b × c)
3. **Distributive:** a × (b + c) = (a × b) + (a × c)
4. **Identity:** a × 1 = a
5. **Zero Property:** a × 0 = 0
6. **Negative Property:** a × (-b) = -(a × b)

### Behavior Examples

| signal_in1 | signal_in2 | Output | Notes |
|------------|------------|--------|-------|
| 5 | 3 | 15 | Basic multiplication |
| -4 | 2 | -8 | Negative multiplicand |
| 7 | -3 | -21 | Negative multiplier |
| -6 | -2 | 12 | Negative × negative = positive |
| 0 | 5 | 0 | Zero property |
| 1 | 8 | 8 | Identity property |
| 2.5 | 4 | 10 | Decimal multiplication |
| 0.1 | 0.3 | 0.03 | Small decimal multiplication |

### Special Cases

1. **Zero Input:** Returns 0 (zero property)
2. **One Input:** Returns the other input (identity property)
3. **Negative Inputs:** Handles according to sign rules
4. **Decimal Inputs:** Performs floating-point multiplication
5. **Infinity:** Returns Infinity or -Infinity as appropriate
6. **NaN Input:** Returns NaN

## Signal Aggregation

Like other Barotrauma components, the Multiply component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in1
Wire 1: 5 (arrives first)
Wire 2: 8 (arrives second)

// Multiple wires to signal_in2
Wire A: 3 (arrives first)
Wire B: 7 (arrives second)

// Result: signal_in1 = 5, signal_in2 = 3
// Output = 5 × 3 = 15
```

## Real-World Applications

### 1. **Signal Amplification**
```javascript
// Amplify a sensor signal by a gain factor
const sensorValue = 2.5; // volts
const gainFactor = 10; // amplification
const amplifiedSignal = sensorValue * gainFactor; // 25 volts
```

### 2. **Scaling Operations**
```javascript
// Scale a value from one range to another
const inputValue = 0.5; // 0-1 range
const scaleFactor = 100; // scale to 0-100
const scaledValue = inputValue * scaleFactor; // 50
```

### 3. **Area Calculations**
```javascript
// Calculate area from length and width
const length = 5; // meters
const width = 3; // meters
const area = length * width; // 15 square meters
```

### 4. **Power Calculations**
```javascript
// Calculate electrical power (P = V × I)
const voltage = 12; // volts
const current = 2; // amperes
const power = voltage * current; // 24 watts
```

### 5. **Rate Calculations**
```javascript
// Calculate distance from speed and time
const speed = 60; // km/h
const time = 2.5; // hours
const distance = speed * time; // 150 km
```

## Integration Examples

### 1. **Advanced Amplification System**
```javascript
// Multi-stage amplification with feedback
const inputSignal = 1.0; // volts
const stage1Gain = 5; // first stage
const stage2Gain = 3; // second stage
const feedbackFactor = 0.1; // feedback

const stage1Output = inputSignal * stage1Gain; // 5 volts
const stage2Output = stage1Output * stage2Gain; // 15 volts
const feedbackSignal = stage2Output * feedbackFactor; // 1.5 volts
const finalOutput = stage2Output - feedbackSignal; // 13.5 volts
```

### 2. **Multiplier Chain**
```javascript
// Chain multiple multipliers for complex calculations
const baseValue = 2;
const factor1 = 3;
const factor2 = 4;
const factor3 = 5;

const result1 = baseValue * factor1; // 6
const result2 = result1 * factor2; // 24
const finalResult = result2 * factor3; // 120
```

### 3. **Conditional Multiplication**
```javascript
// Multiply only when condition is met
const inputValue = 10;
const multiplier = 2;
const condition = true; // enable multiplication

const output = condition ? inputValue * multiplier : inputValue; // 20
```

## JavaScript Simulation Class

```javascript
class MultiplyComponent {
    constructor(config = {}) {
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        this.precision = config.precision || 0; // Decimal places for output
        
        // Input/output state
        this.signalIn1 = 0;
        this.signalIn2 = 0;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signals and calculate product
     * @param {number} input1 - First input signal
     * @param {number} input2 - Second input signal
     * @returns {number} - Calculated product
     */
    process(input1, input2) {
        try {
            // Update input signals
            this.signalIn1 = input1;
            this.signalIn2 = input2;
            
            // Perform multiplication with error handling
            let result = this.performMultiplication(input1, input2);
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            // Apply clamping
            result = this.clampValue(result);
            
            // Round to specified precision
            result = this.roundToPrecision(result);
            
            this.output = result;
            this.lastError = null;
            
            return result;
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`MultiplyComponent error: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Perform the multiplication operation with error handling
     * @param {number} multiplicand - The first number
     * @param {number} multiplier - The second number
     * @returns {number} - The product
     */
    performMultiplication(multiplicand, multiplier) {
        // Handle invalid inputs
        if (typeof multiplicand !== 'number' || typeof multiplier !== 'number') {
            throw new Error('Invalid input types');
        }
        
        // Handle special cases
        if (!isFinite(multiplicand) || !isFinite(multiplier)) {
            if (isNaN(multiplicand) || isNaN(multiplier)) return NaN;
            if (multiplicand === Infinity || multiplicand === -Infinity) {
                if (multiplier === 0) return NaN;
                return multiplicand * multiplier;
            }
            if (multiplier === Infinity || multiplier === -Infinity) {
                if (multiplicand === 0) return NaN;
                return multiplicand * multiplier;
            }
            return NaN;
        }
        
        // Perform multiplication operation
        return multiplicand * multiplier;
    }
    
    /**
     * Apply time-based processing window
     * @param {number} currentValue - Current calculated value
     * @returns {number} - Time-averaged result
     */
    applyTimeFrame(currentValue) {
        const currentTime = Date.now();
        
        // Add current value to history with timestamp
        this.signalHistory.push({
            value: currentValue,
            timestamp: currentTime
        });
        
        // Remove old values outside the time frame
        const cutoffTime = currentTime - this.timeFrame;
        this.signalHistory = this.signalHistory.filter(
            entry => entry.timestamp >= cutoffTime
        );
        
        // Calculate average if we have values
        if (this.signalHistory.length > 0) {
            const sum = this.signalHistory.reduce((acc, entry) => acc + entry.value, 0);
            return sum / this.signalHistory.length;
        }
        
        return currentValue;
    }
    
    /**
     * Clamp output value to configured range
     * @param {number} value - Value to clamp
     * @returns {number} - Clamped value
     */
    clampValue(value) {
        if (value < this.clampMin) {
            return this.clampMin;
        }
        if (value > this.clampMax) {
            return this.clampMax;
        }
        return value;
    }
    
    /**
     * Round value to specified precision
     * @param {number} value - Value to round
     * @returns {number} - Rounded value
     */
    roundToPrecision(value) {
        if (this.precision === 0) {
            return Math.round(value);
        }
        
        const factor = Math.pow(10, this.precision);
        return Math.round(value * factor) / factor;
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn1 = 0;
        this.signalIn2 = 0;
        this.output = 0;
        this.signalHistory = [];
        this.lastError = null;
        this.errorCount = 0;
        this.lastUpdateTime = Date.now();
    }
    
    /**
     * Get component status information
     * @returns {object} - Status object
     */
    getStatus() {
        return {
            signalIn1: this.signalIn1,
            signalIn2: this.signalIn2,
            output: this.output,
            clampMin: this.clampMin,
            clampMax: this.clampMax,
            timeFrame: this.timeFrame,
            precision: this.precision,
            lastError: this.lastError,
            errorCount: this.errorCount,
            signalHistoryLength: this.signalHistory.length
        };
    }
    
    /**
     * Update component configuration
     * @param {object} config - New configuration
     */
    updateConfig(config) {
        if (config.clampMin !== undefined) {
            this.clampMin = config.clampMin;
        }
        if (config.clampMax !== undefined) {
            this.clampMax = config.clampMax;
        }
        if (config.timeFrame !== undefined) {
            this.timeFrame = config.timeFrame;
        }
        if (config.precision !== undefined) {
            this.precision = config.precision;
        }
    }
}

// Usage Examples
class MultiplyComponentExamples {
    static basicMultiplication() {
        const multiply = new MultiplyComponent();
        
        console.log('Basic Multiplication Examples:');
        console.log('5 × 3 =', multiply.process(5, 3)); // 15
        console.log('7 × 4 =', multiply.process(7, 4)); // 28
        console.log('2.5 × 6 =', multiply.process(2.5, 6)); // 15
        console.log('0.1 × 0.3 =', multiply.process(0.1, 0.3)); // 0.03
    }
    
    static negativeInputs() {
        const multiply = new MultiplyComponent();
        
        console.log('\nNegative Input Examples:');
        console.log('-4 × 2 =', multiply.process(-4, 2)); // -8
        console.log('7 × -3 =', multiply.process(7, -3)); // -21
        console.log('-6 × -2 =', multiply.process(-6, -2)); // 12
        console.log('0 × -5 =', multiply.process(0, -5)); // 0
    }
    
    static specialCases() {
        const multiply = new MultiplyComponent();
        
        console.log('\nSpecial Cases:');
        console.log('5 × 0 =', multiply.process(5, 0)); // 0
        console.log('1 × 8 =', multiply.process(1, 8)); // 8
        console.log('0 × 0 =', multiply.process(0, 0)); // 0
        console.log('Infinity × 2 =', multiply.process(Infinity, 2)); // Infinity
        console.log('NaN × 3 =', multiply.process(NaN, 3)); // NaN
    }
    
    static errorHandling() {
        const multiply = new MultiplyComponent();
        
        console.log('\nError Handling Examples:');
        
        // Invalid inputs
        try {
            console.log('"5" × 3 =', multiply.process("5", 3)); // Error
        } catch (error) {
            console.log('Invalid input handled:', error.message);
        }
        
        // Infinity handling
        try {
            console.log('Infinity × 0 =', multiply.process(Infinity, 0)); // NaN
        } catch (error) {
            console.log('Infinity × 0 handled:', error.message);
        }
        
        console.log('Status:', multiply.getStatus());
    }
    
    static clampingExample() {
        const multiply = new MultiplyComponent({
            clampMin: -50,
            clampMax: 50
        });
        
        console.log('\nClamping Examples:');
        console.log('10 × 8 =', multiply.process(10, 8)); // 50 (clamped)
        console.log('-10 × 8 =', multiply.process(-10, 8)); // -50 (clamped)
        console.log('5 × 3 =', multiply.process(5, 3)); // 15 (not clamped)
    }
    
    static precisionExample() {
        const multiply = new MultiplyComponent({
            precision: 2
        });
        
        console.log('\nPrecision Examples:');
        console.log('2.345 × 3.456 =', multiply.process(2.345, 3.456)); // 8.10
        console.log('1.111 × 2.222 =', multiply.process(1.111, 2.222)); // 2.47
    }
    
    static timeFrameExample() {
        const multiply = new MultiplyComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial: 5 × 3 =', multiply.process(5, 3)); // 15
        console.log('After 500ms: 7 × 2 =', multiply.process(7, 2)); // 14.5 (average)
        console.log('After 1s: 4 × 6 =', multiply.process(4, 6)); // 24 (new average)
    }
    
    static realWorldExamples() {
        const multiply = new MultiplyComponent();
        
        console.log('\nReal-World Examples:');
        
        // Signal amplification
        const sensorValue = 2.5; // volts
        const gainFactor = 10; // amplification
        const amplifiedSignal = multiply.process(sensorValue, gainFactor);
        console.log(`Sensor: ${sensorValue}V × Gain: ${gainFactor} = ${amplifiedSignal}V`);
        
        // Area calculation
        const length = 5; // meters
        const width = 3; // meters
        const area = multiply.process(length, width);
        console.log(`Area: ${length}m × ${width}m = ${area}m²`);
        
        // Power calculation
        const voltage = 12; // volts
        const current = 2; // amperes
        const power = multiply.process(voltage, current);
        console.log(`Power: ${voltage}V × ${current}A = ${power}W`);
        
        // Distance calculation
        const speed = 60; // km/h
        const time = 2.5; // hours
        const distance = multiply.process(speed, time);
        console.log(`Distance: ${speed}km/h × ${time}h = ${distance}km`);
    }
    
    static advancedExamples() {
        const multiply = new MultiplyComponent();
        
        console.log('\nAdvanced Examples:');
        
        // Multi-stage amplification
        const inputSignal = 1.0; // volts
        const stage1Gain = 5; // first stage
        const stage2Gain = 3; // second stage
        
        const stage1Output = multiply.process(inputSignal, stage1Gain);
        const stage2Output = multiply.process(stage1Output, stage2Gain);
        console.log(`Multi-stage: ${inputSignal}V → ${stage1Output}V → ${stage2Output}V`);
        
        // Scaling operation
        const inputValue = 0.5; // 0-1 range
        const scaleFactor = 100; // scale to 0-100
        const scaledValue = multiply.process(inputValue, scaleFactor);
        console.log(`Scaling: ${inputValue} × ${scaleFactor} = ${scaledValue}`);
        
        // Conditional multiplication
        const baseValue = 10;
        const multiplier = 2;
        const condition = true; // enable multiplication
        const output = condition ? multiply.process(baseValue, multiplier) : baseValue;
        console.log(`Conditional: ${baseValue} × ${multiplier} = ${output}`);
    }
}

// Run examples
MultiplyComponentExamples.basicMultiplication();
MultiplyComponentExamples.negativeInputs();
MultiplyComponentExamples.specialCases();
MultiplyComponentExamples.errorHandling();
MultiplyComponentExamples.clampingExample();
MultiplyComponentExamples.precisionExample();
MultiplyComponentExamples.timeFrameExample();
MultiplyComponentExamples.realWorldExamples();
MultiplyComponentExamples.advancedExamples();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Types**
   - **Cause:** Non-numeric inputs
   - **Handling:** Throw error and return 0
   - **Prevention:** Use type validation components

2. **Non-Finite Inputs**
   - **Cause:** Infinity, -Infinity, or NaN
   - **Handling:** Return appropriate value or NaN
   - **Prevention:** Validate input ranges

3. **Overflow Conditions**
   - **Cause:** Very large numbers causing overflow
   - **Handling:** Return clamped value or Infinity
   - **Prevention:** Use appropriate clamp values

### Error Recovery Strategies

```javascript
// Example error recovery system
class MultiplyComponentWithRecovery extends MultiplyComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
        this.lastValidInputs = [0, 0];
    }
    
    process(input1, input2) {
        try {
            const result = super.process(input1, input2);
            this.recoveryMode = false;
            this.lastValidOutput = result;
            this.lastValidInputs = [input1, input2];
            return result;
        } catch (error) {
            this.recoveryMode = true;
            console.warn(`Using last valid output: ${this.lastValidOutput}`);
            return this.lastValidOutput;
        }
    }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(1) for basic multiplication
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Clamp Values**
   ```javascript
   // Good: Specific range for your application
   const multiply = new MultiplyComponent({
       clampMin: -1000,
       clampMax: 1000
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const multiply = new MultiplyComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Set Appropriate Precision**
   ```javascript
   // Use precision appropriate for your application
   const multiply = new MultiplyComponent({
       precision: 0 // Integer output
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Output Values**
   - **Cause:** Clamping or precision settings
   - **Solution:** Check configuration and expected behavior

2. **Overflow Issues**
   - **Cause:** Very large multiplication results
   - **Solution:** Use appropriate clamp values

3. **Precision Issues**
   - **Cause:** Floating-point arithmetic or precision settings
   - **Solution:** Adjust precision settings or use integer operations

4. **Negative Result Handling**
   - **Cause:** Negative inputs
   - **Solution:** Understand multiplication behavior with negatives

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugMultiplyComponent extends MultiplyComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input1, input2) {
        if (this.debugMode) {
            console.log(`MultiplyComponent: ${input1} × ${input2}`);
        }
        
        const result = super.process(input1, input2);
        
        if (this.debugMode) {
            this.operationLog.push({
                input1: input1,
                input2: input2,
                output: result,
                timestamp: Date.now()
            });
        }
        
        return result;
    }
    
    getDebugInfo() {
        return {
            operationLog: this.operationLog,
            status: this.getStatus()
        };
    }
}
```

## Component Comparison

### Multiply vs Other Mathematical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Multiply** | a × b | 2 | Product calculation, scaling |
| **Add** | a + b | 2 | Sum calculation |
| **Divide** | a ÷ b | 2 | Division with quotient |
| **Modulo** | a % b | 2 | Remainder calculation |

### When to Use Multiply Component

**Use Multiply when you need:**
- Product calculations
- Signal amplification
- Scaling operations
- Area/volume calculations
- Power calculations
- Rate calculations

**Consider alternatives when:**
- Sum is needed (use Add)
- Division is needed (use Divide)
- Remainder is needed (use Modulo)

## Advanced Usage Patterns

### 1. **Cascading Multiplication**
```javascript
// Multiple multiplication operations in series
const multiply1 = new MultiplyComponent();
const multiply2 = new MultiplyComponent();

const result1 = multiply1.process(2, 3); // 6
const result2 = multiply2.process(result1, 4); // 24
```

### 2. **Conditional Multiplication**
```javascript
// Multiply with conditional logic
class ConditionalMultiplyComponent extends MultiplyComponent {
    process(input1, input2, condition) {
        if (condition) {
            return super.process(input1, input2);
        } else {
            return input1; // Pass through first input
        }
    }
}
```

### 3. **Multi-Multiplier System**
```javascript
// Handle multiple multiplication operations
class MultiMultiplyComponent extends MultiplyComponent {
    processMultiple(inputs) {
        return inputs.reduce((product, input) => 
            this.performMultiplication(product, input), 1
        );
    }
}
```

## Mathematical References

### Multiplication Properties
- **Commutative:** a × b = b × a
- **Associative:** (a × b) × c = a × (b × c)
- **Distributive:** a × (b + c) = (a × b) + (a × c)
- **Identity:** a × 1 = a
- **Zero Property:** a × 0 = 0
- **Negative Property:** a × (-b) = -(a × b)

### Related Operations
- **Addition:** a + b = sum
- **Division:** a ÷ b = quotient
- **Exponentiation:** a^b = power
- **Square Root:** √a = square root

### Special Cases
- **Zero Input:** Returns 0 (zero property)
- **One Input:** Returns the other input (identity property)
- **Negative Inputs:** Handles according to sign rules
- **Decimal Inputs:** Performs floating-point multiplication
- **Infinity:** Returns Infinity or -Infinity as appropriate
- **NaN Input:** Returns NaN

### Precision Considerations
- **Floating-point arithmetic** may introduce small errors
- **Integer operations** are more efficient than floating-point
- **Precision settings** affect output format
- **Large numbers** may cause overflow

---

*This documentation provides a comprehensive guide to the Multiply component in Barotrauma's electrical system, including its mathematical behavior, practical applications, and implementation examples.* 
