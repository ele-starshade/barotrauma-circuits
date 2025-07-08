# Barotrauma Exponentiation Component

## Overview

The **Exponentiation Component** is a mathematical signal processing component in Barotrauma's electrical system that performs power operations on electrical signals. It takes a base input signal and raises it to a specified exponent, outputting the result.

**Official Description:** "Outputs the input raised to a given power."

## Component Properties

### Basic Information
- **Identifier:** `powcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#9b7eff` (Purple)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Base input signal (the number to be raised to a power)
- **`set_exponent`** - Exponent input signal (the power to raise the base to)

#### Output Pins
- **`signal_out`** - Output signal (base raised to the exponent)

### Configurable Properties

The ExponentiationComponent supports several configurable properties:

- **`Exponent`** - The exponent of the operation (can be set via `set_exponent` input)
- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)

## Mathematical Function

The Exponentiation component performs the mathematical operation:

```
output = signal_in ^ set_exponent
```

Or in mathematical notation:
```
output = base^exponent
```

### Mathematical Properties

1. **Power Laws:** Follows standard mathematical power laws
2. **Domain Handling:** Handles various input domains appropriately
3. **Precision:** Maintains floating-point precision for accurate calculations
4. **Clamping:** Output values are clamped between `ClampMin` and `ClampMax` to prevent extreme values

### Behavior Examples

| Base | Exponent | Output | Notes |
|------|----------|--------|-------|
| 2 | 3 | 8 | Basic power (2³) |
| 5 | 2 | 25 | Square (5²) |
| 10 | 0 | 1 | Zero power |
| 2 | -1 | 0.5 | Negative power (1/2) |
| 0 | 5 | 0 | Zero base |
| 1 | 10 | 1 | One to any power |
| 2.5 | 2 | 6.25 | Decimal base |
| 4 | 0.5 | 2 | Square root (4^½) |

### Special Cases

1. **Zero Exponent:** Any number raised to 0 equals 1
2. **Negative Exponents:** Results in reciprocal (1/base^|exponent|)
3. **Fractional Exponents:** Results in roots (e.g., 0.5 = square root)
4. **Zero Base:** Zero raised to any positive power equals 0
5. **Negative Base:** Results depend on exponent parity

## Signal Aggregation

Like other Barotrauma components, the Exponentiation component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 3 (arrives first)
Wire 2: 5 (arrives second)
Wire 3: 2 (arrives third)

// Result: signal_in = 3 (first signal wins)
// If set_exponent = 2, then output = 3² = 9
```

## Real-World Applications

### 1. **Area and Volume Calculations**
```javascript
// Calculate area of a square
const sideLength = 5; // meters
const area = Math.pow(sideLength, 2); // 25 m²

// Calculate volume of a cube
const edgeLength = 3; // meters
const volume = Math.pow(edgeLength, 3); // 27 m³
```

### 2. **Exponential Growth/Decay**
```javascript
// Population growth with 5% annual increase
const initialPopulation = 1000;
const years = 10;
const growthRate = 1.05;
const finalPopulation = initialPopulation * Math.pow(growthRate, years); // 1629
```

### 3. **Signal Amplification**
```javascript
// Amplify signal with exponential curve
const inputSignal = 0.5;
const amplificationFactor = 3;
const amplifiedSignal = Math.pow(inputSignal, amplificationFactor); // 0.125
```

### 4. **Root Calculations**
```javascript
// Calculate square root
const number = 16;
const squareRoot = Math.pow(number, 0.5); // 4

// Calculate cube root
const cube = 27;
const cubeRoot = Math.pow(cube, 1/3); // 3
```

### 5. **Scientific Calculations**
```javascript
// Calculate kinetic energy (KE = ½mv²)
const mass = 10; // kg
const velocity = 5; // m/s
const kineticEnergy = 0.5 * mass * Math.pow(velocity, 2); // 125 J
```

## Integration Examples

### 1. **Advanced Power Systems**
```javascript
// Calculate power consumption with exponential scaling
const baseLoad = 100; // watts
const scalingFactor = 1.2;
const timeMultiplier = 2;
const totalPower = baseLoad * Math.pow(scalingFactor, timeMultiplier); // 144 W
```

### 2. **Environmental Modeling**
```javascript
// Temperature change with exponential decay
const initialTemp = 100; // °C
const coolingRate = 0.9;
const timeSteps = 5;
const finalTemp = initialTemp * Math.pow(coolingRate, timeSteps); // 59.05 °C
```

### 3. **Signal Processing**
```javascript
// Audio signal compression
const inputLevel = 0.8;
const compressionRatio = 2;
const compressedLevel = Math.pow(inputLevel, 1/compressionRatio); // 0.894
```

## JavaScript Simulation Class

```javascript
class ExponentiationComponent {
    constructor(config = {}) {
        this.defaultExponent = config.defaultExponent || 2;
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        this.precision = config.precision || 6; // Decimal places
        
        // Input/output state
        this.signalIn = 0;
        this.setExponent = this.defaultExponent;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signals and calculate output
     * @param {number} base - Base input signal
     * @param {number} exponent - Exponent input signal (optional)
     * @returns {number} - Calculated output
     */
    process(base, exponent = null) {
        try {
            // Update input signals
            this.signalIn = base;
            if (exponent !== null) {
                this.setExponent = exponent;
            }
            
            // Perform exponentiation with error handling
            let result = this.performExponentiation(base, this.setExponent);
            
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
            console.warn(`ExponentiationComponent error: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Perform the exponentiation operation with error handling
     * @param {number} base - The base number
     * @param {number} exponent - The exponent
     * @returns {number} - The result of base^exponent
     */
    performExponentiation(base, exponent) {
        // Handle invalid inputs
        if (typeof base !== 'number' || typeof exponent !== 'number') {
            throw new Error('Invalid input types');
        }
        
        // Handle special cases
        if (base === 0 && exponent <= 0) {
            throw new Error('Zero raised to non-positive power is undefined');
        }
        
        if (base < 0 && !Number.isInteger(exponent)) {
            throw new Error('Negative base with non-integer exponent');
        }
        
        // Handle infinity cases
        if (!isFinite(base) || !isFinite(exponent)) {
            throw new Error('Non-finite inputs');
        }
        
        // Perform exponentiation
        return Math.pow(base, exponent);
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
        const factor = Math.pow(10, this.precision);
        return Math.round(value * factor) / factor;
    }
    
    /**
     * Set default exponent
     * @param {number} exponent - New default exponent
     */
    setDefaultExponent(exponent) {
        this.defaultExponent = exponent;
        this.setExponent = exponent;
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn = 0;
        this.setExponent = this.defaultExponent;
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
            base: this.signalIn,
            exponent: this.setExponent,
            output: this.output,
            defaultExponent: this.defaultExponent,
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
        if (config.defaultExponent !== undefined) {
            this.defaultExponent = config.defaultExponent;
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
class ExponentiationComponentExamples {
    static basicExponentiation() {
        const pow = new ExponentiationComponent();
        
        console.log('Basic Exponentiation Examples:');
        console.log('2^3 =', pow.process(2, 3)); // 8
        console.log('5^2 =', pow.process(5, 2)); // 25
        console.log('10^0 =', pow.process(10, 0)); // 1
        console.log('2^-1 =', pow.process(2, -1)); // 0.5
    }
    
    static errorHandling() {
        const pow = new ExponentiationComponent();
        
        console.log('\nError Handling Examples:');
        console.log('0^0 =', pow.process(0, 0)); // Error
        console.log('(-2)^0.5 =', pow.process(-2, 0.5)); // Error
        console.log('Status:', pow.getStatus());
    }
    
    static clampingExample() {
        const pow = new ExponentiationComponent({
            clampMin: 0,
            clampMax: 100
        });
        
        console.log('\nClamping Examples:');
        console.log('10^3 =', pow.process(10, 3)); // 100 (clamped)
        console.log('(-5)^2 =', pow.process(-5, 2)); // 0 (clamped)
    }
    
    static precisionExample() {
        const pow = new ExponentiationComponent({
            precision: 3
        });
        
        console.log('\nPrecision Examples:');
        console.log('2.5^2 =', pow.process(2.5, 2)); // 6.25
        console.log('3.14159^2 =', pow.process(3.14159, 2)); // 9.87 (rounded)
    }
    
    static timeFrameExample() {
        const pow = new ExponentiationComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial:', pow.process(2, 3)); // 8
        console.log('After 500ms:', pow.process(3, 2)); // 9
        console.log('After 1s:', pow.process(4, 2)); // 16 (new average)
    }
    
    static rootCalculations() {
        const pow = new ExponentiationComponent();
        
        console.log('\nRoot Calculation Examples:');
        console.log('√16 =', pow.process(16, 0.5)); // 4
        console.log('∛27 =', pow.process(27, 1/3)); // 3
        console.log('∜81 =', pow.process(81, 0.25)); // 3
    }
}

// Run examples
ExponentiationComponentExamples.basicExponentiation();
ExponentiationComponentExamples.errorHandling();
ExponentiationComponentExamples.clampingExample();
ExponentiationComponentExamples.precisionExample();
ExponentiationComponentExamples.timeFrameExample();
ExponentiationComponentExamples.rootCalculations();
```

## Error Handling

### Common Error Scenarios

1. **Zero to Non-Positive Power**
   - **Cause:** 0^0 or 0^(-n) where n > 0
   - **Handling:** Throw error and output 0
   - **Prevention:** Validate inputs before processing

2. **Negative Base with Non-Integer Exponent**
   - **Cause:** (-2)^0.5 results in complex number
   - **Handling:** Throw error and output 0
   - **Prevention:** Use absolute value or validate exponent

3. **Non-Finite Inputs**
   - **Cause:** Infinity or NaN inputs
   - **Handling:** Throw error and output 0
   - **Prevention:** Validate input ranges

4. **Extreme Results**
   - **Cause:** Very large or small results
   - **Handling:** Apply clamping to `ClampMin`/`ClampMax`
   - **Prevention:** Configure appropriate clamp values

### Error Recovery Strategies

```javascript
// Example error recovery system
class ExponentiationComponentWithRecovery extends ExponentiationComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
    }
    
    process(base, exponent = null) {
        try {
            const result = super.process(base, exponent);
            this.recoveryMode = false;
            this.lastValidOutput = result;
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
- **Time Complexity:** O(1) for basic exponentiation
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Clamp Values**
   ```javascript
   // Good: Specific range for your application
   const pow = new ExponentiationComponent({
       clampMin: 0,
       clampMax: 1000
   });
   
   // Avoid: Very wide ranges unless necessary
   const pow = new ExponentiationComponent({
       clampMin: -999999,
       clampMax: 999999
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const pow = new ExponentiationComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Set Appropriate Precision**
   ```javascript
   // Use precision appropriate for your application
   const pow = new ExponentiationComponent({
       precision: 2 // 2 decimal places
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Zero Output**
   - **Cause:** Error conditions or invalid inputs
   - **Solution:** Check input validation and error handling

2. **Output Not Updating**
   - **Cause:** Signal aggregation issues or time frame delays
   - **Solution:** Verify signal connections and time frame settings

3. **Extreme Output Values**
   - **Cause:** Insufficient clamping or large exponents
   - **Solution:** Configure appropriate clamp values

4. **Precision Issues**
   - **Cause:** Floating-point arithmetic errors
   - **Solution:** Adjust precision settings or use integer operations

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugExponentiationComponent extends ExponentiationComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(base, exponent = null) {
        if (this.debugMode) {
            console.log(`ExponentiationComponent: ${base}^${exponent || this.setExponent}`);
        }
        
        const result = super.process(base, exponent);
        
        if (this.debugMode) {
            this.operationLog.push({
                base: base,
                exponent: exponent || this.setExponent,
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

### Exponentiation vs Other Mathematical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Exponentiation** | Power (^) | 2 | Powers, roots, exponential growth |
| **Multiply** | Multiplication (×) | 2 | Scaling, amplification |
| **Divide** | Division (÷) | 2 | Ratios, efficiency, calibration |
| **Adder** | Addition (+) | 2+ | Summing, accumulation |

### When to Use Exponentiation Component

**Use Exponentiation when you need:**
- Calculate powers and roots
- Model exponential growth/decay
- Perform scientific calculations
- Signal amplification with curves
- Area/volume calculations

**Consider alternatives when:**
- Simple multiplication is needed (use Multiply)
- Addition operations (use Adder)
- Division operations (use Divide)

## Advanced Usage Patterns

### 1. **Cascading Exponentiation**
```javascript
// Multiple exponentiation operations in series
const pow1 = new ExponentiationComponent();
const pow2 = new ExponentiationComponent();

const result1 = pow1.process(2, 3); // 8
const result2 = pow2.process(result1, 2); // 64
```

### 2. **Conditional Exponentiation**
```javascript
// Exponentiation with conditional logic
class ConditionalExponentiationComponent extends ExponentiationComponent {
    process(base, exponent, condition) {
        if (condition) {
            return super.process(base, exponent);
        } else {
            return base; // Pass through without exponentiation
        }
    }
}
```

### 3. **Multi-Input Exponentiation**
```javascript
// Handle multiple bases with same exponent
class MultiExponentiationComponent extends ExponentiationComponent {
    processMultiple(bases, exponent) {
        return bases.map(base => this.performExponentiation(base, exponent));
    }
}
```

## Mathematical References

### Power Laws
- **Product Rule:** a^m × a^n = a^(m+n)
- **Quotient Rule:** a^m ÷ a^n = a^(m-n)
- **Power Rule:** (a^m)^n = a^(m×n)
- **Zero Power:** a^0 = 1 (for a ≠ 0)
- **Negative Power:** a^(-n) = 1/a^n

### Special Cases
- **Square:** a^2 = a × a
- **Cube:** a^3 = a × a × a
- **Square Root:** a^0.5 = √a
- **Cube Root:** a^(1/3) = ∛a
- **Reciprocal:** a^(-1) = 1/a

### Precision Considerations
- **Floating-point arithmetic** may introduce small errors
- **Large exponents** may cause overflow
- **Small bases** with large exponents may cause underflow
- **Significant digits** should be considered for accuracy

---

*This documentation provides a comprehensive guide to the Exponentiation component in Barotrauma's electrical system, including its mathematical behavior, practical applications, and implementation examples.* 
