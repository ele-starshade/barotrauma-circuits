# Barotrauma Divide Component

## Overview

The **Divide Component** is a mathematical signal processing component in Barotrauma's electrical system that performs division operations on electrical signals. It takes two input signals and outputs their quotient (dividend ÷ divisor).

**Official Description:** "Outputs the divided value of the received signals."

## Component Properties

### Basic Information
- **Identifier:** `dividecomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#8bafd7` (Light blue)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in1`** - First input signal (dividend)
- **`signal_in2`** - Second input signal (divisor)

#### Output Pins
- **`signal_out`** - Output signal (quotient)

### Configurable Properties

The DivideComponent supports several configurable properties:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)

## Mathematical Function

The Divide component performs the mathematical operation:

```
output = signal_in1 ÷ signal_in2
```

### Mathematical Properties

1. **Division by Zero:** When `signal_in2` is 0, the component typically outputs 0 or a special error value
2. **Sign Preservation:** The output maintains the correct mathematical sign based on the signs of both inputs
3. **Precision:** Maintains floating-point precision for accurate mathematical calculations
4. **Clamping:** Output values are clamped between `ClampMin` and `ClampMax` to prevent extreme values

### Behavior Examples

| Input 1 | Input 2 | Output | Notes |
|---------|---------|--------|-------|
| 10 | 2 | 5 | Basic division |
| 15 | 3 | 5 | Integer division |
| 10 | 0 | 0 | Division by zero (error handling) |
| -10 | 2 | -5 | Negative dividend |
| 10 | -2 | -5 | Negative divisor |
| 0 | 5 | 0 | Zero dividend |
| 3.5 | 2 | 1.75 | Decimal division |

## Signal Aggregation

Like other Barotrauma components, the Divide component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in1
Wire 1: 10 (arrives first)
Wire 2: 20 (arrives second)
Wire 3: 5 (arrives third)

// Result: signal_in1 = 10 (first signal wins)
// If signal_in2 = 2, then output = 10 ÷ 2 = 5
```

## Real-World Applications

### 1. **Power Distribution Systems**
```javascript
// Calculate power efficiency
const powerInput = 1000; // Watts from reactor
const powerOutput = 800; // Watts to systems
const efficiency = powerOutput / powerInput; // 0.8 or 80%
```

### 2. **Speed Calculations**
```javascript
// Calculate speed from distance and time
const distance = 1000; // meters
const time = 60; // seconds
const speed = distance / time; // 16.67 m/s
```

### 3. **Resource Management**
```javascript
// Calculate resource consumption rate
const totalOxygen = 1000; // liters
const timeRemaining = 120; // minutes
const consumptionRate = totalOxygen / timeRemaining; // 8.33 L/min
```

### 4. **Sensor Calibration**
```javascript
// Calibrate sensor readings
const rawReading = 50;
const calibrationFactor = 2.5;
const calibratedValue = rawReading / calibrationFactor; // 20
```

### 5. **Ratio Calculations**
```javascript
// Calculate fuel efficiency
const fuelConsumed = 100; // liters
const distanceTraveled = 500; // km
const efficiency = distanceTraveled / fuelConsumed; // 5 km/L
```

## Integration Examples

### 1. **Advanced Power Management**
```javascript
// Complex power distribution with multiple sources
const reactorPower = 1000;
const batteryPower = 200;
const totalPower = reactorPower + batteryPower; // 1200
const systemDemand = 800;
const efficiency = systemDemand / totalPower; // 0.67
```

### 2. **Environmental Monitoring**
```javascript
// Calculate pressure gradient
const surfacePressure = 101.3; // kPa
const depthPressure = 150.0; // kPa
const depth = 50; // meters
const pressureGradient = (depthPressure - surfacePressure) / depth; // 0.974 kPa/m
```

### 3. **Navigation Systems**
```javascript
// Calculate course correction
const targetHeading = 90; // degrees
const currentHeading = 85; // degrees
const correctionNeeded = targetHeading / currentHeading; // 1.059
```

## JavaScript Simulation Class

```javascript
class DivideComponent {
    constructor(config = {}) {
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        
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
     * Process input signals and calculate output
     * @param {number} signal1 - First input signal (dividend)
     * @param {number} signal2 - Second input signal (divisor)
     * @returns {number} - Calculated output
     */
    process(signal1, signal2) {
        try {
            // Update input signals
            this.signalIn1 = signal1;
            this.signalIn2 = signal2;
            
            // Perform division with error handling
            let result = this.performDivision(signal1, signal2);
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            // Apply clamping
            result = this.clampValue(result);
            
            this.output = result;
            this.lastError = null;
            
            return result;
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`DivideComponent error: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Perform the division operation with error handling
     * @param {number} dividend - The number to be divided
     * @param {number} divisor - The number to divide by
     * @returns {number} - The quotient
     */
    performDivision(dividend, divisor) {
        // Handle division by zero
        if (divisor === 0) {
            throw new Error('Division by zero');
        }
        
        // Handle invalid inputs
        if (typeof dividend !== 'number' || typeof divisor !== 'number') {
            throw new Error('Invalid input types');
        }
        
        // Handle special cases
        if (dividend === 0) {
            return 0;
        }
        
        // Perform division
        return dividend / divisor;
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
            input1: this.signalIn1,
            input2: this.signalIn2,
            output: this.output,
            clampMin: this.clampMin,
            clampMax: this.clampMax,
            timeFrame: this.timeFrame,
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
    }
}

// Usage Examples
class DivideComponentExamples {
    static basicDivision() {
        const divider = new DivideComponent();
        
        console.log('Basic Division Examples:');
        console.log('10 ÷ 2 =', divider.process(10, 2)); // 5
        console.log('15 ÷ 3 =', divider.process(15, 3)); // 5
        console.log('3.5 ÷ 2 =', divider.process(3.5, 2)); // 1.75
        console.log('-10 ÷ 2 =', divider.process(-10, 2)); // -5
    }
    
    static errorHandling() {
        const divider = new DivideComponent();
        
        console.log('\nError Handling Examples:');
        console.log('10 ÷ 0 =', divider.process(10, 0)); // 0 (with error)
        console.log('Status:', divider.getStatus());
    }
    
    static clampingExample() {
        const divider = new DivideComponent({
            clampMin: 0,
            clampMax: 100
        });
        
        console.log('\nClamping Examples:');
        console.log('200 ÷ 2 =', divider.process(200, 2)); // 100 (clamped)
        console.log('-50 ÷ 2 =', divider.process(-50, 2)); // 0 (clamped)
    }
    
    static timeFrameExample() {
        const divider = new DivideComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial:', divider.process(10, 2)); // 5
        console.log('After 500ms:', divider.process(20, 2)); // 12.5 (average)
        console.log('After 1s:', divider.process(30, 2)); // 20 (new average)
    }
}

// Run examples
DivideComponentExamples.basicDivision();
DivideComponentExamples.errorHandling();
DivideComponentExamples.clampingExample();
DivideComponentExamples.timeFrameExample();
```

## Error Handling

### Common Error Scenarios

1. **Division by Zero**
   - **Cause:** `signal_in2` equals 0
   - **Handling:** Output 0 and log error
   - **Prevention:** Use signal validation components

2. **Invalid Input Types**
   - **Cause:** Non-numeric signals
   - **Handling:** Convert to number or output 0
   - **Prevention:** Use type validation components

3. **Extreme Values**
   - **Cause:** Very large or small results
   - **Handling:** Apply clamping to `ClampMin`/`ClampMax`
   - **Prevention:** Configure appropriate clamp values

### Error Recovery Strategies

```javascript
// Example error recovery system
class DivideComponentWithRecovery extends DivideComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
    }
    
    process(signal1, signal2) {
        try {
            const result = super.process(signal1, signal2);
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
- **Time Complexity:** O(1) for basic division
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Clamp Values**
   ```javascript
   // Good: Specific range for your application
   const divider = new DivideComponent({
       clampMin: 0,
       clampMax: 100
   });
   
   // Avoid: Very wide ranges unless necessary
   const divider = new DivideComponent({
       clampMin: -999999,
       clampMax: 999999
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const divider = new DivideComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Batch Processing**
   ```javascript
   // Process multiple calculations efficiently
   const results = [];
   for (let i = 0; i < 1000; i++) {
       results.push(divider.process(i, 2));
   }
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Zero Output**
   - **Cause:** Division by zero or invalid inputs
   - **Solution:** Check input signals and add validation

2. **Output Not Updating**
   - **Cause:** Signal aggregation issues or time frame delays
   - **Solution:** Verify signal connections and time frame settings

3. **Extreme Output Values**
   - **Cause:** Insufficient clamping or large input values
   - **Solution:** Configure appropriate clamp values

4. **Performance Issues**
   - **Cause:** Large time frame windows or frequent updates
   - **Solution:** Optimize time frame size and update frequency

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugDivideComponent extends DivideComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(signal1, signal2) {
        if (this.debugMode) {
            console.log(`DivideComponent: ${signal1} ÷ ${signal2}`);
        }
        
        const result = super.process(signal1, signal2);
        
        if (this.debugMode) {
            this.operationLog.push({
                input1: signal1,
                input2: signal2,
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

### Divide vs Other Mathematical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Divide** | Division (÷) | 2 | Ratios, efficiency, calibration |
| **Adder** | Addition (+) | 2+ | Summing, accumulation |
| **Multiply** | Multiplication (×) | 2 | Scaling, amplification |
| **Subtract** | Subtraction (-) | 2 | Differences, offsets |

### When to Use Divide Component

**Use Divide when you need:**
- Calculate ratios and proportions
- Determine efficiency percentages
- Calibrate sensor readings
- Normalize values
- Calculate rates and speeds

**Consider alternatives when:**
- Simple addition is needed (use Adder)
- Scaling values (use Multiply)
- Finding differences (use Subtract)

## Advanced Usage Patterns

### 1. **Cascading Division**
```javascript
// Multiple division operations in series
const divider1 = new DivideComponent();
const divider2 = new DivideComponent();

const result1 = divider1.process(100, 2); // 50
const result2 = divider2.process(result1, 5); // 10
```

### 2. **Conditional Division**
```javascript
// Division with conditional logic
class ConditionalDivideComponent extends DivideComponent {
    process(signal1, signal2, condition) {
        if (condition) {
            return super.process(signal1, signal2);
        } else {
            return signal1; // Pass through without division
        }
    }
}
```

### 3. **Multi-Input Division**
```javascript
// Handle multiple divisors
class MultiDivideComponent extends DivideComponent {
    processMultiple(dividend, divisors) {
        let result = dividend;
        for (const divisor of divisors) {
            result = this.performDivision(result, divisor);
        }
        return this.clampValue(result);
    }
}
```

## Mathematical References

### Division Properties
- **Commutative:** No (a ÷ b ≠ b ÷ a)
- **Associative:** No ((a ÷ b) ÷ c ≠ a ÷ (b ÷ c))
- **Distributive:** No (a ÷ (b + c) ≠ (a ÷ b) + (a ÷ c))

### Special Cases
- **Division by 1:** a ÷ 1 = a
- **Division by -1:** a ÷ (-1) = -a
- **Division of 0:** 0 ÷ a = 0 (for a ≠ 0)
- **Division by 0:** Undefined (handled as error)

### Precision Considerations
- **Floating-point arithmetic** may introduce small errors
- **Large numbers** may cause overflow
- **Small divisors** may cause underflow
- **Significant digits** should be considered for accuracy

---

*This documentation provides a comprehensive guide to the Divide component in Barotrauma's electrical system, including its mathematical behavior, practical applications, and implementation examples.* 
