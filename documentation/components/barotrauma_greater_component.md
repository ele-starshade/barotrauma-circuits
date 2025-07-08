# Barotrauma Greater Component

## Overview

The **Greater Component** is a comparison signal processing component in Barotrauma's electrical system that performs greater-than comparisons between two electrical signals. It takes two input values and outputs a signal (typically 1) if the first input is greater than the second input, otherwise outputs 0.

**Official Description:** "Sends a signal if the value the signal_in1 input is larger than the signal_in2 input."

## Component Properties

### Basic Information
- **Identifier:** `greatercomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#a1d681` (Light Green)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in1`** - First input signal (left operand for comparison)
- **`signal_in2`** - Second input signal (right operand for comparison)
- **`set_output`** - Control input to set the output value directly

#### Output Pins
- **`signal_out`** - Output signal (1 if signal_in1 > signal_in2, 0 otherwise)

### Configurable Properties

The GreaterComponent supports the following player-configurable parameters:

- **`TimeFrame`** - Time-based processing window (default: 0)

Only the properties listed above are player-configurable in-game. All other parameters are internal and cannot be changed by the player.

### Internal Properties

The component also uses these fixed internal parameters:

- **`Hysteresis`** - Hysteresis threshold to prevent oscillation (fixed at 0)
- **`OutputFormat`** - Output format (boolean, numeric, etc.) (fixed)

## Mathematical Function

The Greater component performs the mathematical comparison:

```
output = (signal_in1 > signal_in2) ? 1 : 0
```

Or in mathematical notation:
```
output = {
    1, if signal_in1 > signal_in2
    0, otherwise
}
```

### Mathematical Properties

1. **Comparison Operation:** Strictly greater than (>)
2. **Output Range:** Binary (0 or 1)
3. **Commutativity:** Not commutative (a > b ≠ b > a)
4. **Transitivity:** If a > b and b > c, then a > c
5. **Reflexivity:** Not reflexive (a > a is always false)

### Behavior Examples

| signal_in1 | signal_in2 | Output | Notes |
|------------|------------|--------|-------|
| 5 | 3 | 1 | 5 > 3 is true |
| 3 | 5 | 0 | 3 > 5 is false |
| 5 | 5 | 0 | 5 > 5 is false (not ≥) |
| 0 | -2 | 1 | 0 > -2 is true |
| -3 | -1 | 0 | -3 > -1 is false |
| 10.5 | 10.4 | 1 | 10.5 > 10.4 is true |
| 0 | 0 | 0 | 0 > 0 is false |

### Special Cases

1. **Equal Values:** Returns 0 (not greater than)
2. **Negative Numbers:** Works correctly with negative values
3. **Floating Point:** Handles decimal values accurately
4. **Infinity:** Infinity > any finite number returns 1
5. **NaN:** NaN comparisons return 0 (false)
6. **Missing Inputs:** Treats missing inputs as 0

## Signal Aggregation

Like other Barotrauma components, the Greater component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in1
Wire 1: 5 (arrives first)
Wire 2: 8 (arrives second)
Wire 3: 3 (arrives third)

// Multiple wires to signal_in2
Wire A: 2 (arrives first)
Wire B: 4 (arrives second)

// Result: signal_in1 = 5, signal_in2 = 2
// Output = (5 > 2) ? 1 : 0 = 1
```

## Real-World Applications

### 1. **Threshold Monitoring**
```javascript
// Monitor if temperature exceeds safe limit
const currentTemp = 85; // degrees Celsius
const safeLimit = 80; // degrees Celsius
const isOverheating = currentTemp > safeLimit; // true
```

### 2. **Resource Management**
```javascript
// Check if fuel level is above minimum
const currentFuel = 25.5; // liters
const minFuelLevel = 20.0; // liters
const hasSufficientFuel = currentFuel > minFuelLevel; // true
```

### 3. **Pressure Monitoring**
```javascript
// Monitor if pressure exceeds safety threshold
const currentPressure = 2.8; // atmospheres
const maxSafePressure = 3.0; // atmospheres
const isPressureSafe = currentPressure > maxSafePressure; // false
```

### 4. **Speed Control**
```javascript
// Check if speed exceeds limit
const currentSpeed = 45; // knots
const speedLimit = 50; // knots
const isOverSpeed = currentSpeed > speedLimit; // false
```

### 5. **Battery Management**
```javascript
// Monitor if battery charge is above critical level
const batteryCharge = 15; // percent
const criticalLevel = 10; // percent
const isBatteryCritical = batteryCharge > criticalLevel; // true
```

## Integration Examples

### 1. **Advanced Threshold System**
```javascript
// Multi-level threshold monitoring
const sensorValue = 75;
const warningThreshold = 60;
const criticalThreshold = 80;

const isWarning = sensorValue > warningThreshold; // true
const isCritical = sensorValue > criticalThreshold; // false
```

### 2. **Comparative Analysis**
```javascript
// Compare multiple sensor readings
const sensor1Reading = 23.5;
const sensor2Reading = 22.8;
const sensor3Reading = 24.1;

const isSensor1Highest = sensor1Reading > sensor2Reading && 
                        sensor1Reading > sensor3Reading; // false
```

### 3. **Conditional Control**
```javascript
// Conditional system activation
const systemLoad = 85; // percent
const activationThreshold = 90; // percent
const isSystemActive = systemLoad > activationThreshold; // false
```

## JavaScript Simulation Class

```javascript
class GreaterComponent {
    constructor(config = {}) {
        this.timeFrame = config.timeFrame || 0;
        this.hysteresis = config.hysteresis || 0;
        this.outputFormat = config.outputFormat || 'numeric'; // 'numeric', 'boolean'
        
        // Input/output state
        this.signalIn1 = 0;
        this.signalIn2 = 0;
        this.setOutput = 0;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Hysteresis state
        this.lastComparison = false;
        this.hysteresisState = false;
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signals and perform comparison
     * @param {number} input1 - First input signal
     * @param {number} input2 - Second input signal
     * @param {number} setOutput - Direct output control (optional)
     * @returns {number|boolean} - Comparison result
     */
    process(input1, input2, setOutput = null) {
        try {
            // Update input signals
            this.signalIn1 = input1;
            this.signalIn2 = input2;
            
            if (setOutput !== null) {
                this.setOutput = setOutput;
            }
            
            // Perform comparison with error handling
            let result = this.performComparison(input1, input2);
            
            // Apply hysteresis if configured
            if (this.hysteresis > 0) {
                result = this.applyHysteresis(result, input1, input2);
            }
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            // Format output based on configuration
            result = this.formatOutput(result);
            
            this.output = result;
            this.lastError = null;
            
            return result;
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`GreaterComponent error: ${error.message}`);
            return this.outputFormat === 'boolean' ? false : 0;
        }
    }
    
    /**
     * Perform the greater-than comparison with error handling
     * @param {number} a - First value
     * @param {number} b - Second value
     * @returns {boolean} - True if a > b
     */
    performComparison(a, b) {
        // Handle invalid inputs
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Invalid input types');
        }
        
        // Handle special cases
        if (isNaN(a) || isNaN(b)) {
            return false; // NaN comparisons return false
        }
        
        if (!isFinite(a) || !isFinite(b)) {
            // Handle infinity cases
            if (a === Infinity && b !== Infinity) return true;
            if (a === -Infinity) return false;
            if (b === Infinity) return false;
            if (b === -Infinity && a !== -Infinity) return true;
            return false; // Both infinite, same sign
        }
        
        // Perform comparison
        return a > b;
    }
    
    /**
     * Apply hysteresis to prevent oscillation
     * @param {boolean} currentResult - Current comparison result
     * @param {number} input1 - First input
     * @param {number} input2 - Second input
     * @returns {boolean} - Hysteresis-adjusted result
     */
    applyHysteresis(currentResult, input1, input2) {
        const difference = input1 - input2;
        
        if (this.hysteresisState) {
            // Currently in "true" state, need significant drop to switch
            if (difference < -this.hysteresis) {
                this.hysteresisState = false;
            }
        } else {
            // Currently in "false" state, need significant rise to switch
            if (difference > this.hysteresis) {
                this.hysteresisState = true;
            }
        }
        
        return this.hysteresisState;
    }
    
    /**
     * Apply time-based processing window
     * @param {boolean} currentResult - Current comparison result
     * @returns {boolean} - Time-averaged result
     */
    applyTimeFrame(currentResult) {
        const currentTime = Date.now();
        
        // Add current result to history with timestamp
        this.signalHistory.push({
            result: currentResult,
            timestamp: currentTime
        });
        
        // Remove old values outside the time frame
        const cutoffTime = currentTime - this.timeFrame;
        this.signalHistory = this.signalHistory.filter(
            entry => entry.timestamp >= cutoffTime
        );
        
        // Calculate majority result if we have values
        if (this.signalHistory.length > 0) {
            const trueCount = this.signalHistory.filter(entry => entry.result).length;
            const totalCount = this.signalHistory.length;
            return trueCount > totalCount / 2;
        }
        
        return currentResult;
    }
    
    /**
     * Format output based on configuration
     * @param {boolean} result - Boolean comparison result
     * @returns {number|boolean} - Formatted output
     */
    formatOutput(result) {
        if (this.outputFormat === 'boolean') {
            return result;
        } else {
            return result ? 1 : 0;
        }
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn1 = 0;
        this.signalIn2 = 0;
        this.setOutput = 0;
        this.output = 0;
        this.signalHistory = [];
        this.lastComparison = false;
        this.hysteresisState = false;
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
            setOutput: this.setOutput,
            output: this.output,
            timeFrame: this.timeFrame,
            hysteresis: this.hysteresis,
            outputFormat: this.outputFormat,
            lastError: this.lastError,
            errorCount: this.errorCount,
            signalHistoryLength: this.signalHistory.length,
            hysteresisState: this.hysteresisState
        };
    }
    
    /**
     * Update component configuration
     * @param {object} config - New configuration
     */
    updateConfig(config) {
        if (config.timeFrame !== undefined) {
            this.timeFrame = config.timeFrame;
        }
        if (config.hysteresis !== undefined) {
            this.hysteresis = config.hysteresis;
        }
        if (config.outputFormat !== undefined) {
            this.outputFormat = config.outputFormat;
        }
    }
}

// Usage Examples
class GreaterComponentExamples {
    static basicComparison() {
        const greater = new GreaterComponent();
        
        console.log('Basic Comparison Examples:');
        console.log('5 > 3 =', greater.process(5, 3)); // 1
        console.log('3 > 5 =', greater.process(3, 5)); // 0
        console.log('5 > 5 =', greater.process(5, 5)); // 0
        console.log('0 > -2 =', greater.process(0, -2)); // 1
    }
    
    static booleanOutput() {
        const greater = new GreaterComponent({
            outputFormat: 'boolean'
        });
        
        console.log('\nBoolean Output Examples:');
        console.log('10 > 5 =', greater.process(10, 5)); // true
        console.log('2 > 8 =', greater.process(2, 8)); // false
        console.log('7.5 > 7.4 =', greater.process(7.5, 7.4)); // true
    }
    
    static errorHandling() {
        const greater = new GreaterComponent();
        
        console.log('\nError Handling Examples:');
        console.log('Infinity > 100 =', greater.process(Infinity, 100)); // 1
        console.log('-Infinity > 100 =', greater.process(-Infinity, 100)); // 0
        console.log('NaN > 5 =', greater.process(NaN, 5)); // 0
        console.log('Status:', greater.getStatus());
    }
    
    static hysteresisExample() {
        const greater = new GreaterComponent({
            hysteresis: 2.0
        });
        
        console.log('\nHysteresis Examples:');
        console.log('Initial: 5 > 3 =', greater.process(5, 3)); // 1
        console.log('Small drop: 4 > 3 =', greater.process(4, 3)); // 1 (stays true)
        console.log('Below threshold: 2 > 3 =', greater.process(2, 3)); // 0 (switches)
        console.log('Small rise: 4 > 3 =', greater.process(4, 3)); // 0 (stays false)
        console.log('Above threshold: 6 > 3 =', greater.process(6, 3)); // 1 (switches)
    }
    
    static timeFrameExample() {
        const greater = new GreaterComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial: 5 > 3 =', greater.process(5, 3)); // 1
        console.log('After 500ms: 2 > 3 =', greater.process(2, 3)); // 1 (majority still true)
        console.log('After 1s: 2 > 3 =', greater.process(2, 3)); // 0 (new majority)
    }
    
    static realWorldExamples() {
        const greater = new GreaterComponent();
        
        console.log('\nReal-World Examples:');
        
        // Temperature monitoring
        const currentTemp = 85;
        const safeLimit = 80;
        const isOverheating = greater.process(currentTemp, safeLimit);
        console.log(`Temperature ${currentTemp}°C > ${safeLimit}°C: ${isOverheating ? 'OVERHEATING' : 'Safe'}`);
        
        // Fuel level check
        const currentFuel = 25.5;
        const minFuelLevel = 20.0;
        const hasSufficientFuel = greater.process(currentFuel, minFuelLevel);
        console.log(`Fuel ${currentFuel}L > ${minFuelLevel}L: ${hasSufficientFuel ? 'Sufficient' : 'Low'}`);
        
        // Pressure monitoring
        const currentPressure = 2.8;
        const maxSafePressure = 3.0;
        const isPressureSafe = greater.process(currentPressure, maxSafePressure);
        console.log(`Pressure ${currentPressure}atm > ${maxSafePressure}atm: ${isPressureSafe ? 'UNSAFE' : 'Safe'}`);
        
        // Speed control
        const currentSpeed = 45;
        const speedLimit = 50;
        const isOverSpeed = greater.process(currentSpeed, speedLimit);
        console.log(`Speed ${currentSpeed}kts > ${speedLimit}kts: ${isOverSpeed ? 'OVER LIMIT' : 'Within limit'}`);
    }
    
    static advancedExamples() {
        const greater = new GreaterComponent();
        
        console.log('\nAdvanced Examples:');
        
        // Multi-threshold system
        const sensorValue = 75;
        const warningThreshold = 60;
        const criticalThreshold = 80;
        
        const isWarning = greater.process(sensorValue, warningThreshold);
        const isCritical = greater.process(sensorValue, criticalThreshold);
        
        console.log(`Sensor: ${sensorValue}`);
        console.log(`Warning threshold (${warningThreshold}): ${isWarning ? 'WARNING' : 'OK'}`);
        console.log(`Critical threshold (${criticalThreshold}): ${isCritical ? 'CRITICAL' : 'OK'}`);
        
        // Comparative analysis
        const sensor1 = 23.5;
        const sensor2 = 22.8;
        const sensor3 = 24.1;
        
        const isSensor1Highest = greater.process(sensor1, sensor2) && 
                                greater.process(sensor1, sensor3);
        
        console.log(`Sensor 1 (${sensor1}) is highest: ${isSensor1Highest ? 'Yes' : 'No'}`);
    }
}

// Run examples
GreaterComponentExamples.basicComparison();
GreaterComponentExamples.booleanOutput();
GreaterComponentExamples.errorHandling();
GreaterComponentExamples.hysteresisExample();
GreaterComponentExamples.timeFrameExample();
GreaterComponentExamples.realWorldExamples();
GreaterComponentExamples.advancedExamples();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Types**
   - **Cause:** Non-numeric inputs
   - **Handling:** Throw error and return false/0
   - **Prevention:** Use type validation components

2. **Non-Finite Inputs**
   - **Cause:** Infinity, -Infinity, or NaN
   - **Handling:** Return appropriate boolean result
   - **Prevention:** Validate input ranges

3. **Missing Inputs**
   - **Cause:** Unconnected input pins
   - **Handling:** Treat as 0
   - **Prevention:** Ensure all inputs are connected

### Error Recovery Strategies

```javascript
// Example error recovery system
class GreaterComponentWithRecovery extends GreaterComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = false;
    }
    
    process(input1, input2, setOutput = null) {
        try {
            const result = super.process(input1, input2, setOutput);
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
- **Time Complexity:** O(1) for basic comparison
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Hysteresis**
   ```javascript
   // Good: Prevent oscillation in noisy signals
   const greater = new GreaterComponent({
       hysteresis: 0.5
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const greater = new GreaterComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Choose Appropriate Output Format**
   ```javascript
   // Use boolean for logical operations, numeric for calculations
   const greater = new GreaterComponent({
       outputFormat: 'boolean' // For logical gates
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Output Values**
   - **Cause:** Hysteresis or time frame settings
   - **Solution:** Check configuration and expected behavior

2. **Output Not Updating**
   - **Cause:** Signal aggregation issues or time frame delays
   - **Solution:** Verify signal connections and time frame settings

3. **Oscillating Output**
   - **Cause:** Noisy signals near threshold
   - **Solution:** Increase hysteresis value

4. **Performance Issues**
   - **Cause:** Large time frame windows or frequent updates
   - **Solution:** Optimize time frame size and update frequency

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugGreaterComponent extends GreaterComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input1, input2, setOutput = null) {
        if (this.debugMode) {
            console.log(`GreaterComponent: ${input1} > ${input2}`);
        }
        
        const result = super.process(input1, input2, setOutput);
        
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

### Greater vs Other Comparison Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Greater** | a > b | 2 | Strictly greater than comparison |
| **GreaterEqual** | a ≥ b | 2 | Greater than or equal comparison |
| **Less** | a < b | 2 | Strictly less than comparison |
| **LessEqual** | a ≤ b | 2 | Less than or equal comparison |
| **Equals** | a == b | 2 | Equality comparison |

### When to Use Greater Component

**Use Greater when you need:**
- Strictly greater than comparisons
- Threshold monitoring (above limit)
- Resource level checking (above minimum)
- Speed control (above limit)
- Temperature monitoring (above safe level)

**Consider alternatives when:**
- Greater than or equal is needed (use GreaterEqual)
- Less than comparisons are needed (use Less)
- Equality comparisons are needed (use Equals)

## Advanced Usage Patterns

### 1. **Cascading Comparisons**
```javascript
// Multiple greater comparisons in series
const greater1 = new GreaterComponent();
const greater2 = new GreaterComponent();

const result1 = greater1.process(10, 5); // 1
const result2 = greater2.process(result1, 0); // 1 (true > false)
```

### 2. **Conditional Comparison**
```javascript
// Greater with conditional logic
class ConditionalGreaterComponent extends GreaterComponent {
    process(input1, input2, condition) {
        if (condition) {
            return super.process(input1, input2);
        } else {
            return false; // Always false when condition is false
        }
    }
}
```

### 3. **Multi-Input Comparison**
```javascript
// Compare against multiple thresholds
class MultiThresholdComponent extends GreaterComponent {
    processMultiple(value, thresholds) {
        return thresholds.map(threshold => 
            this.performComparison(value, threshold)
        );
    }
}
```

## Mathematical References

### Comparison Function Properties
- **Definition:** f(a,b) = (a > b)
- **Range:** Boolean (true/false) or numeric (1/0)
- **Commutativity:** Not commutative (f(a,b) ≠ f(b,a))
- **Transitivity:** If f(a,b) and f(b,c), then f(a,c)
- **Reflexivity:** Not reflexive (f(a,a) is always false)

### Related Operations
- **Greater Equal:** a ≥ b = (a > b) || (a == b)
- **Less:** a < b = !(a > b) && !(a == b)
- **Less Equal:** a ≤ b = !(a > b)
- **Not Equal:** a ≠ b = (a > b) || (b > a)

### Special Cases
- **Equal Values:** Always returns false
- **Negative Numbers:** Works correctly with negative values
- **Floating Point:** Handles decimal values accurately
- **Infinity:** Infinity > any finite number returns true
- **NaN:** NaN comparisons return false

### Precision Considerations
- **Floating-point arithmetic** may introduce small errors
- **Hysteresis** helps prevent oscillation near thresholds
- **Time-based processing** can smooth noisy signals
- **Integer comparisons** are more efficient than floating-point

---

*This documentation provides a comprehensive guide to the Greater component in Barotrauma's electrical system, including its comparison behavior, practical applications, and implementation examples.* 
