# Barotrauma Modulo Component

## Overview

The **Modulo Component** is a mathematical signal processing component in Barotrauma's electrical system that performs modulo (remainder) operations on electrical signals. It takes an input value and a modulus value, then outputs the remainder when the input is divided by the modulus.

**Official Description:** "Outputs the remainder when the input is divided by a specific number."

## Component Properties

### Basic Information
- **Identifier:** `modulocomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#1745b7` (Blue)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal (the dividend)
- **`set_modulus`** - Modulus value (the divisor)

#### Output Pins
- **`signal_out`** - Output signal (remainder of division)

### Configurable Properties

The ModuloComponent uses a ModuloComponent class, which may support:

- **`DefaultModulus`** - Default modulus value (default: 1)
- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)

## Mathematical Function

The Modulo component performs the mathematical operation:

```
output = signal_in % set_modulus
```

Or in mathematical notation:
```
output = signal_in mod set_modulus = remainder(signal_in ÷ set_modulus)
```

### Mathematical Properties

1. **Definition:** a mod b = remainder when a is divided by b
2. **Range:** 0 ≤ output < |set_modulus| (for positive modulus)
3. **Periodicity:** (a + b) mod b = a mod b
4. **Distributive:** (a + b) mod c = ((a mod c) + (b mod c)) mod c
5. **Associative:** ((a mod b) mod c) = (a mod (b × c)) mod c

### Behavior Examples

| signal_in | set_modulus | Output | Notes |
|-----------|-------------|--------|-------|
| 7 | 3 | 1 | 7 ÷ 3 = 2 remainder 1 |
| 10 | 4 | 2 | 10 ÷ 4 = 2 remainder 2 |
| 15 | 5 | 0 | 15 ÷ 5 = 3 remainder 0 |
| 8 | 3 | 2 | 8 ÷ 3 = 2 remainder 2 |
| -7 | 3 | -1 | Negative input handling |
| 7 | -3 | 1 | Negative modulus handling |
| 0 | 5 | 0 | Zero input |
| 5 | 0 | NaN | Division by zero |

### Special Cases

1. **Zero Modulus:** Returns NaN (division by zero)
2. **Negative Inputs:** Handles according to programming language rules
3. **Negative Modulus:** Handles according to programming language rules
4. **Zero Input:** Returns 0
5. **Infinity:** Returns NaN
6. **NaN Input:** Returns NaN

## Signal Aggregation

Like other Barotrauma components, the Modulo component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 15 (arrives first)
Wire 2: 23 (arrives second)

// Multiple wires to set_modulus
Wire A: 4 (arrives first)
Wire B: 7 (arrives second)

// Result: signal_in = 15, set_modulus = 4
// Output = 15 % 4 = 3
```

## Real-World Applications

### 1. **Clock/Counter Systems**
```javascript
// 12-hour clock system
const totalHours = 25; // hours
const clockModulus = 12; // 12-hour cycle
const currentHour = totalHours % clockModulus; // 1 (1 AM)
```

### 2. **Array Index Wrapping**
```javascript
// Circular array access
const arraySize = 5;
const index = 7; // desired index
const wrappedIndex = index % arraySize; // 2 (wraps around)
```

### 3. **Angle Normalization**
```javascript
// Normalize angles to 0-360 range
const angle = 450; // degrees
const normalizedAngle = angle % 360; // 90 degrees
```

### 4. **Resource Allocation**
```javascript
// Distribute resources in cycles
const totalResources = 23; // items
const cycleSize = 8; // items per cycle
const remainder = totalResources % cycleSize; // 7 items
```

### 5. **Signal Quantization**
```javascript
// Quantize signal to discrete levels
const analogValue = 7.8; // volts
const quantizationLevel = 0.5; // volts per level
const discreteLevel = analogValue % quantizationLevel; // 0.3 volts
```

## Integration Examples

### 1. **Advanced Clock System**
```javascript
// Multi-cycle clock with different periods
const totalTime = 125; // minutes
const hourModulus = 60; // minutes per hour
const dayModulus = 1440; // minutes per day

const hours = Math.floor(totalTime / hourModulus); // 2 hours
const minutes = totalTime % hourModulus; // 5 minutes
const days = Math.floor(totalTime / dayModulus); // 0 days
```

### 2. **Circular Buffer Management**
```javascript
// Circular buffer with modulo indexing
const bufferSize = 10;
const writeIndex = 15; // current write position
const readIndex = 8; // current read position

const wrappedWriteIndex = writeIndex % bufferSize; // 5
const wrappedReadIndex = readIndex % bufferSize; // 8
const availableSpace = (wrappedWriteIndex - wrappedReadIndex + bufferSize) % bufferSize; // 7
```

### 3. **Phase Calculation**
```javascript
// Calculate phase in periodic systems
const time = 3.7; // seconds
const period = 2.0; // seconds per cycle
const phase = time % period; // 1.7 seconds into current cycle
const cycleNumber = Math.floor(time / period); // 1 (second cycle)
```

## JavaScript Simulation Class

```javascript
class ModuloComponent {
    constructor(config = {}) {
        this.defaultModulus = config.defaultModulus || 1;
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        this.precision = config.precision || 0; // Decimal places for output
        
        // Input/output state
        this.signalIn = 0;
        this.setModulus = this.defaultModulus;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signal and calculate modulo
     * @param {number} input - Input signal (dividend)
     * @param {number} modulus - Modulus value (divisor)
     * @returns {number} - Calculated modulo result
     */
    process(input, modulus = null) {
        try {
            // Update input signals
            this.signalIn = input;
            
            if (modulus !== null) {
                this.setModulus = modulus;
            }
            
            // Perform modulo calculation with error handling
            let result = this.performModulo(input, this.setModulus);
            
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
            console.warn(`ModuloComponent error: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Perform the modulo operation with error handling
     * @param {number} dividend - The dividend
     * @param {number} divisor - The divisor
     * @returns {number} - The modulo result
     */
    performModulo(dividend, divisor) {
        // Handle invalid inputs
        if (typeof dividend !== 'number' || typeof divisor !== 'number') {
            throw new Error('Invalid input types');
        }
        
        // Handle special cases
        if (!isFinite(dividend) || !isFinite(divisor)) {
            if (isNaN(dividend) || isNaN(divisor)) return NaN;
            if (divisor === 0) return NaN;
            if (dividend === Infinity || dividend === -Infinity) return NaN;
            return NaN;
        }
        
        // Handle division by zero
        if (divisor === 0) {
            throw new Error('Division by zero');
        }
        
        // Perform modulo operation
        return dividend % divisor;
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
        this.signalIn = 0;
        this.setModulus = this.defaultModulus;
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
            signalIn: this.signalIn,
            setModulus: this.setModulus,
            output: this.output,
            defaultModulus: this.defaultModulus,
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
        if (config.defaultModulus !== undefined) {
            this.defaultModulus = config.defaultModulus;
        }
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
class ModuloComponentExamples {
    static basicModulo() {
        const modulo = new ModuloComponent();
        
        console.log('Basic Modulo Examples:');
        console.log('7 % 3 =', modulo.process(7, 3)); // 1
        console.log('10 % 4 =', modulo.process(10, 4)); // 2
        console.log('15 % 5 =', modulo.process(15, 5)); // 0
        console.log('8 % 3 =', modulo.process(8, 3)); // 2
    }
    
    static negativeInputs() {
        const modulo = new ModuloComponent();
        
        console.log('\nNegative Input Examples:');
        console.log('-7 % 3 =', modulo.process(-7, 3)); // -1
        console.log('7 % -3 =', modulo.process(7, -3)); // 1
        console.log('-7 % -3 =', modulo.process(-7, -3)); // -1
    }
    
    static errorHandling() {
        const modulo = new ModuloComponent();
        
        console.log('\nError Handling Examples:');
        
        // Division by zero
        try {
            console.log('5 % 0 =', modulo.process(5, 0)); // Error
        } catch (error) {
            console.log('Division by zero handled:', error.message);
        }
        
        // Invalid inputs
        try {
            console.log('NaN % 3 =', modulo.process(NaN, 3)); // NaN
        } catch (error) {
            console.log('NaN input handled:', error.message);
        }
        
        console.log('Status:', modulo.getStatus());
    }
    
    static clampingExample() {
        const modulo = new ModuloComponent({
            clampMin: 0,
            clampMax: 10
        });
        
        console.log('\nClamping Examples:');
        console.log('15 % 3 =', modulo.process(15, 3)); // 0 (clamped)
        console.log('-5 % 3 =', modulo.process(-5, 3)); // 0 (clamped)
    }
    
    static precisionExample() {
        const modulo = new ModuloComponent({
            precision: 2
        });
        
        console.log('\nPrecision Examples:');
        console.log('7.123 % 3 =', modulo.process(7.123, 3)); // 1.12
        console.log('10.789 % 4 =', modulo.process(10.789, 4)); // 2.79
    }
    
    static timeFrameExample() {
        const modulo = new ModuloComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial: 7 % 3 =', modulo.process(7, 3)); // 1
        console.log('After 500ms: 10 % 3 =', modulo.process(10, 3)); // 1.5 (average)
        console.log('After 1s: 8 % 3 =', modulo.process(8, 3)); // 2 (new average)
    }
    
    static realWorldExamples() {
        const modulo = new ModuloComponent();
        
        console.log('\nReal-World Examples:');
        
        // Clock system
        const totalHours = 25;
        const clockModulus = 12;
        const currentHour = modulo.process(totalHours, clockModulus);
        console.log(`Time: ${totalHours} hours = ${currentHour} o'clock`);
        
        // Array wrapping
        const index = 7;
        const arraySize = 5;
        const wrappedIndex = modulo.process(index, arraySize);
        console.log(`Array index ${index} wrapped to ${wrappedIndex}`);
        
        // Angle normalization
        const angle = 450;
        const normalizedAngle = modulo.process(angle, 360);
        console.log(`Angle ${angle}° normalized to ${normalizedAngle}°`);
        
        // Resource allocation
        const totalResources = 23;
        const cycleSize = 8;
        const remainder = modulo.process(totalResources, cycleSize);
        console.log(`${totalResources} resources, ${cycleSize} per cycle, ${remainder} remaining`);
    }
    
    static advancedExamples() {
        const modulo = new ModuloComponent();
        
        console.log('\nAdvanced Examples:');
        
        // Multi-cycle calculations
        const totalTime = 125; // minutes
        const hourModulus = 60;
        const dayModulus = 1440;
        
        const hours = Math.floor(totalTime / hourModulus);
        const minutes = modulo.process(totalTime, hourModulus);
        const days = Math.floor(totalTime / dayModulus);
        
        console.log(`${totalTime} minutes = ${days} days, ${hours} hours, ${minutes} minutes`);
        
        // Circular buffer
        const bufferSize = 10;
        const writeIndex = 15;
        const readIndex = 8;
        
        const wrappedWriteIndex = modulo.process(writeIndex, bufferSize);
        const wrappedReadIndex = modulo.process(readIndex, bufferSize);
        
        console.log(`Buffer: write=${wrappedWriteIndex}, read=${wrappedReadIndex}`);
        
        // Phase calculation
        const time = 3.7; // seconds
        const period = 2.0; // seconds per cycle
        const phase = modulo.process(time, period);
        const cycleNumber = Math.floor(time / period);
        
        console.log(`Time ${time}s = cycle ${cycleNumber}, phase ${phase}s`);
    }
}

// Run examples
ModuloComponentExamples.basicModulo();
ModuloComponentExamples.negativeInputs();
ModuloComponentExamples.errorHandling();
ModuloComponentExamples.clampingExample();
ModuloComponentExamples.precisionExample();
ModuloComponentExamples.timeFrameExample();
ModuloComponentExamples.realWorldExamples();
ModuloComponentExamples.advancedExamples();
```

## Error Handling

### Common Error Scenarios

1. **Division by Zero**
   - **Cause:** Modulus value of 0
   - **Handling:** Throw error and return 0
   - **Prevention:** Validate modulus values

2. **Invalid Input Types**
   - **Cause:** Non-numeric inputs
   - **Handling:** Throw error and return 0
   - **Prevention:** Use type validation components

3. **Non-Finite Inputs**
   - **Cause:** Infinity, -Infinity, or NaN
   - **Handling:** Return NaN or appropriate error value
   - **Prevention:** Validate input ranges

### Error Recovery Strategies

```javascript
// Example error recovery system
class ModuloComponentWithRecovery extends ModuloComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
        this.lastValidModulus = 1;
    }
    
    process(input, modulus = null) {
        try {
            const result = super.process(input, modulus);
            this.recoveryMode = false;
            this.lastValidOutput = result;
            this.lastValidModulus = modulus || this.setModulus;
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
- **Time Complexity:** O(1) for basic modulo operation
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Clamp Values**
   ```javascript
   // Good: Specific range for your application
   const modulo = new ModuloComponent({
       clampMin: 0,
       clampMax: 100
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const modulo = new ModuloComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Set Appropriate Precision**
   ```javascript
   // Use precision appropriate for your application
   const modulo = new ModuloComponent({
       precision: 0 // Integer output
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Output Values**
   - **Cause:** Clamping or precision settings
   - **Solution:** Check configuration and expected behavior

2. **Division by Zero Errors**
   - **Cause:** Modulus value of 0
   - **Solution:** Validate modulus inputs

3. **Negative Result Handling**
   - **Cause:** Negative inputs or modulus
   - **Solution:** Understand modulo behavior with negatives

4. **Precision Issues**
   - **Cause:** Floating-point arithmetic or precision settings
   - **Solution:** Adjust precision settings or use integer operations

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugModuloComponent extends ModuloComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input, modulus = null) {
        if (this.debugMode) {
            console.log(`ModuloComponent: ${input} % ${modulus || this.setModulus}`);
        }
        
        const result = super.process(input, modulus);
        
        if (this.debugMode) {
            this.operationLog.push({
                input: input,
                modulus: modulus || this.setModulus,
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

### Modulo vs Other Mathematical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Modulo** | a % b | 2 | Remainder calculation, wrapping |
| **Divide** | a ÷ b | 2 | Division with quotient |
| **Floor** | ⌊a⌋ | 1 | Downward rounding |
| **Ceil** | ⌈a⌉ | 1 | Upward rounding |

### When to Use Modulo Component

**Use Modulo when you need:**
- Remainder calculations
- Circular/wrapping operations
- Clock and counter systems
- Array index wrapping
- Angle normalization
- Resource allocation cycles

**Consider alternatives when:**
- Division quotient is needed (use Divide)
- Rounding is needed (use Floor/Ceil)
- Simple arithmetic is needed (use Adder/Multiply)

## Advanced Usage Patterns

### 1. **Cascading Modulo Operations**
```javascript
// Multiple modulo operations in series
const modulo1 = new ModuloComponent();
const modulo2 = new ModuloComponent();

const result1 = modulo1.process(25, 12); // 1
const result2 = modulo2.process(result1, 3); // 1
```

### 2. **Conditional Modulo**
```javascript
// Modulo with conditional logic
class ConditionalModuloComponent extends ModuloComponent {
    process(input, modulus, condition) {
        if (condition) {
            return super.process(input, modulus);
        } else {
            return input; // Pass through without modulo
        }
    }
}
```

### 3. **Multi-Modulo System**
```javascript
// Handle multiple modulo operations
class MultiModuloComponent extends ModuloComponent {
    processMultiple(input, moduli) {
        return moduli.map(modulus => this.performModulo(input, modulus));
    }
}
```

## Mathematical References

### Modulo Function Properties
- **Definition:** a mod b = remainder when a is divided by b
- **Range:** 0 ≤ result < |b| (for positive b)
- **Periodicity:** (a + b) mod b = a mod b
- **Distributive:** (a + b) mod c = ((a mod c) + (b mod c)) mod c
- **Associative:** ((a mod b) mod c) = (a mod (b × c)) mod c

### Related Operations
- **Division:** a ÷ b = quotient
- **Floor Division:** ⌊a ÷ b⌋
- **Ceiling Division:** ⌈a ÷ b⌉
- **Remainder:** a mod b (same as modulo)

### Special Cases
- **Zero Modulus:** Undefined (division by zero)
- **Negative Inputs:** Handles according to programming language rules
- **Negative Modulus:** Handles according to programming language rules
- **Zero Input:** Returns 0
- **Infinity:** Returns NaN

### Precision Considerations
- **Floating-point arithmetic** may introduce small errors
- **Integer operations** are more efficient than floating-point
- **Precision settings** affect output format
- **Large numbers** may cause overflow

---

*This documentation provides a comprehensive guide to the Modulo component in Barotrauma's electrical system, including its mathematical behavior, practical applications, and implementation examples.* 
