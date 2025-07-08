# Barotrauma Floor Component

## Overview

The **Floor Component** is a mathematical signal processing component in Barotrauma's electrical system that performs floor (downward rounding) operations on electrical signals. It takes a single input value and outputs the greatest integer that is less than or equal to the input.

**Official Description:** "Outputs the greatest integer value that is less than or equal to the input."

## Component Properties

### Basic Information
- **Identifier:** `floorcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#50884d` (Green)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal (the number to apply floor function to)

#### Output Pins
- **`signal_out`** - Output signal (floor of the input)

### Configurable Properties

The FloorComponent uses a FunctionComponent with the "Floor" function, which may support:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)

## Mathematical Function

The Floor component performs the mathematical operation:

```
output = ⌊signal_in⌋
```

Or in mathematical notation:
```
output = floor(x) = greatest integer ≤ x
```

### Mathematical Properties

1. **Definition:** ⌊x⌋ = greatest integer less than or equal to x
2. **Range:** Always returns an integer
3. **Monotonicity:** Preserves order (if a ≤ b, then ⌊a⌋ ≤ ⌊b⌋)
4. **Idempotent:** ⌊⌊x⌋⌋ = ⌊x⌋
5. **Additive Property:** ⌊x + n⌋ = ⌊x⌋ + n for integer n

### Behavior Examples

| Input | Output | Notes |
|-------|--------|-------|
| 3.7 | 3 | Rounds down to 3 |
| 3.0 | 3 | Integer remains unchanged |
| 3.1 | 3 | Rounds down to 3 |
| -3.7 | -4 | Negative numbers round down |
| -3.0 | -3 | Negative integer unchanged |
| 0.5 | 0 | Rounds down to 0 |
| -0.5 | -1 | Negative rounds down |
| 0.0 | 0 | Zero unchanged |

### Special Cases

1. **Positive Numbers:** Rounds down to the nearest integer
2. **Negative Numbers:** Rounds down (away from zero)
3. **Integers:** Returns the same value
4. **Zero:** Returns zero
5. **Infinity:** Returns infinity
6. **NaN:** Returns NaN

## Signal Aggregation

Like other Barotrauma components, the Floor component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 3.7 (arrives first)
Wire 2: 5.2 (arrives second)
Wire 3: 2.9 (arrives third)

// Result: signal_in = 3.7 (first signal wins)
// Output = ⌊3.7⌋ = 3
```

## Real-World Applications

### 1. **Resource Allocation**
```javascript
// Calculate maximum items that can fit in storage
const storageCapacity = 100.5; // cubic meters
const itemSize = 2.3; // cubic meters per item
const maxItems = Math.floor(storageCapacity / itemSize); // 43 items
```

### 2. **Time Calculations**
```javascript
// Calculate complete days from hours
const totalHours = 73.5; // hours
const completeDays = Math.floor(totalHours / 24); // 3 days

// Calculate complete weeks from days
const totalDays = 15.8; // days
const completeWeeks = Math.floor(totalDays / 7); // 2 weeks
```

### 3. **Financial Calculations**
```javascript
// Calculate whole units that can be purchased
const availableFunds = 150.75; // currency
const unitPrice = 12.50; // currency per unit
const unitsToBuy = Math.floor(availableFunds / unitPrice); // 12 units
```

### 4. **Signal Processing**
```javascript
// Quantize analog signal to discrete levels
const analogValue = 7.8; // volts
const quantizationLevel = 0.5; // volts per level
const discreteLevel = Math.floor(analogValue / quantizationLevel) * quantizationLevel; // 7.5 volts
```

### 5. **Inventory Management**
```javascript
// Calculate complete containers from items
const totalItems = 250; // items
const containerCapacity = 24; // items per container
const completeContainers = Math.floor(totalItems / containerCapacity); // 10 containers
```

## Integration Examples

### 1. **Advanced Resource Management**
```javascript
// Calculate resource consumption with floor rounding
const resourceAvailable = 1000.7; // units
const consumptionRate = 15.3; // units per cycle
const cyclesPossible = Math.floor(resourceAvailable / consumptionRate); // 65 cycles
```

### 2. **Precision Control Systems**
```javascript
// Limit precision in control systems
const sensorReading = 23.456789; // high precision
const precisionLimit = 0.1; // desired precision
const limitedValue = Math.floor(sensorReading / precisionLimit) * precisionLimit; // 23.4
```

### 3. **Batch Processing**
```javascript
// Calculate complete batches from total items
const totalProduction = 1234; // items
const batchSize = 50; // items per batch
const completeBatches = Math.floor(totalProduction / batchSize); // 24 batches
const remainingItems = totalProduction % batchSize; // 34 items
```

## JavaScript Simulation Class

```javascript
class FloorComponent {
    constructor(config = {}) {
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        this.precision = config.precision || 0; // Decimal places for output
        
        // Input/output state
        this.signalIn = 0;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signal and calculate floor
     * @param {number} input - Input signal
     * @returns {number} - Calculated floor value
     */
    process(input) {
        try {
            // Update input signal
            this.signalIn = input;
            
            // Perform floor calculation with error handling
            let result = this.performFloor(input);
            
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
            console.warn(`FloorComponent error: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Perform the floor operation with error handling
     * @param {number} x - The input number
     * @returns {number} - The floor of x
     */
    performFloor(x) {
        // Handle invalid inputs
        if (typeof x !== 'number') {
            throw new Error('Invalid input type');
        }
        
        // Handle special cases
        if (!isFinite(x)) {
            if (x === Infinity) return Infinity;
            if (x === -Infinity) return -Infinity;
            if (isNaN(x)) return NaN;
        }
        
        // Perform floor operation
        return Math.floor(x);
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
            return Math.floor(sum / this.signalHistory.length);
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
            return Math.floor(value);
        }
        
        const factor = Math.pow(10, this.precision);
        return Math.floor(value * factor) / factor;
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn = 0;
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
            input: this.signalIn,
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
class FloorComponentExamples {
    static basicFloor() {
        const floor = new FloorComponent();
        
        console.log('Basic Floor Examples:');
        console.log('⌊3.7⌋ =', floor.process(3.7)); // 3
        console.log('⌊3.0⌋ =', floor.process(3.0)); // 3
        console.log('⌊-3.7⌋ =', floor.process(-3.7)); // -4
        console.log('⌊0.5⌋ =', floor.process(0.5)); // 0
    }
    
    static errorHandling() {
        const floor = new FloorComponent();
        
        console.log('\nError Handling Examples:');
        console.log('⌊Infinity⌋ =', floor.process(Infinity)); // Infinity
        console.log('⌊-Infinity⌋ =', floor.process(-Infinity)); // -Infinity
        console.log('⌊NaN⌋ =', floor.process(NaN)); // NaN
        console.log('Status:', floor.getStatus());
    }
    
    static clampingExample() {
        const floor = new FloorComponent({
            clampMin: 0,
            clampMax: 100
        });
        
        console.log('\nClamping Examples:');
        console.log('⌊-5.7⌋ =', floor.process(-5.7)); // 0 (clamped)
        console.log('⌊150.3⌋ =', floor.process(150.3)); // 100 (clamped)
    }
    
    static precisionExample() {
        const floor = new FloorComponent({
            precision: 1
        });
        
        console.log('\nPrecision Examples:');
        console.log('⌊3.75⌋ (precision 1) =', floor.process(3.75)); // 3.7
        console.log('⌊-2.89⌋ (precision 1) =', floor.process(-2.89)); // -2.9
    }
    
    static timeFrameExample() {
        const floor = new FloorComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial:', floor.process(3.7)); // 3
        console.log('After 500ms:', floor.process(4.2)); // 4
        console.log('After 1s:', floor.process(5.8)); // 5 (new average)
    }
    
    static realWorldExamples() {
        const floor = new FloorComponent();
        
        console.log('\nReal-World Examples:');
        
        // Resource allocation
        const storageCapacity = 100.5;
        const itemSize = 2.3;
        const maxItems = floor.process(storageCapacity / itemSize);
        console.log(`Max items in storage: ${maxItems}`);
        
        // Time calculations
        const totalHours = 73.5;
        const completeDays = floor.process(totalHours / 24);
        console.log(`Complete days: ${completeDays}`);
        
        // Financial calculations
        const availableFunds = 150.75;
        const unitPrice = 12.50;
        const unitsToBuy = floor.process(availableFunds / unitPrice);
        console.log(`Units to buy: ${unitsToBuy}`);
    }
}

// Run examples
FloorComponentExamples.basicFloor();
FloorComponentExamples.errorHandling();
FloorComponentExamples.clampingExample();
FloorComponentExamples.precisionExample();
FloorComponentExamples.timeFrameExample();
FloorComponentExamples.realWorldExamples();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Types**
   - **Cause:** Non-numeric inputs
   - **Handling:** Throw error and output 0
   - **Prevention:** Use type validation components

2. **Non-Finite Inputs**
   - **Cause:** Infinity, -Infinity, or NaN
   - **Handling:** Return the same value (Infinity → Infinity, etc.)
   - **Prevention:** Validate input ranges

3. **Extreme Values**
   - **Cause:** Very large or small results
   - **Handling:** Apply clamping to `ClampMin`/`ClampMax`
   - **Prevention:** Configure appropriate clamp values

### Error Recovery Strategies

```javascript
// Example error recovery system
class FloorComponentWithRecovery extends FloorComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
    }
    
    process(input) {
        try {
            const result = super.process(input);
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
- **Time Complexity:** O(1) for basic floor operation
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Clamp Values**
   ```javascript
   // Good: Specific range for your application
   const floor = new FloorComponent({
       clampMin: 0,
       clampMax: 1000
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const floor = new FloorComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Set Appropriate Precision**
   ```javascript
   // Use precision appropriate for your application
   const floor = new FloorComponent({
       precision: 0 // Integer output
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Output Values**
   - **Cause:** Clamping or precision settings
   - **Solution:** Check configuration and expected behavior

2. **Output Not Updating**
   - **Cause:** Signal aggregation issues or time frame delays
   - **Solution:** Verify signal connections and time frame settings

3. **Precision Issues**
   - **Cause:** Floating-point arithmetic or precision settings
   - **Solution:** Adjust precision settings or use integer operations

4. **Performance Issues**
   - **Cause:** Large time frame windows or frequent updates
   - **Solution:** Optimize time frame size and update frequency

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugFloorComponent extends FloorComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input) {
        if (this.debugMode) {
            console.log(`FloorComponent: ⌊${input}⌋`);
        }
        
        const result = super.process(input);
        
        if (this.debugMode) {
            this.operationLog.push({
                input: input,
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

### Floor vs Other Mathematical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Floor** | ⌊x⌋ | 1 | Downward rounding, integer conversion |
| **Ceil** | ⌈x⌉ | 1 | Upward rounding, integer conversion |
| **Round** | round(x) | 1 | Nearest integer rounding |
| **Truncate** | trunc(x) | 1 | Remove decimal part |

### When to Use Floor Component

**Use Floor when you need:**
- Downward rounding to integers
- Calculate maximum whole units
- Resource allocation calculations
- Time period calculations
- Financial calculations requiring conservative estimates

**Consider alternatives when:**
- Upward rounding is needed (use Ceil)
- Nearest integer rounding is needed (use Round)
- Simple integer conversion is needed (use Truncate)

## Advanced Usage Patterns

### 1. **Cascading Floor Operations**
```javascript
// Multiple floor operations in series
const floor1 = new FloorComponent();
const floor2 = new FloorComponent();

const result1 = floor1.process(7.8); // 7
const result2 = floor2.process(result1); // 7 (no change)
```

### 2. **Conditional Floor**
```javascript
// Floor with conditional logic
class ConditionalFloorComponent extends FloorComponent {
    process(input, condition) {
        if (condition) {
            return super.process(input);
        } else {
            return input; // Pass through without floor
        }
    }
}
```

### 3. **Multi-Input Floor**
```javascript
// Handle multiple inputs
class MultiFloorComponent extends FloorComponent {
    processMultiple(inputs) {
        return inputs.map(input => this.performFloor(input));
    }
}
```

## Mathematical References

### Floor Function Properties
- **Definition:** ⌊x⌋ = greatest integer ≤ x
- **Range:** Always returns an integer
- **Monotonicity:** If a ≤ b, then ⌊a⌋ ≤ ⌊b⌋
- **Idempotent:** ⌊⌊x⌋⌋ = ⌊x⌋
- **Additive:** ⌊x + n⌋ = ⌊x⌋ + n for integer n

### Related Functions
- **Ceiling:** ⌈x⌉ = smallest integer ≥ x
- **Round:** round(x) = nearest integer to x
- **Truncate:** trunc(x) = integer part of x
- **Fractional Part:** {x} = x - ⌊x⌋

### Special Cases
- **Positive Numbers:** Rounds down to nearest integer
- **Negative Numbers:** Rounds down (away from zero)
- **Integers:** Returns the same value
- **Zero:** Returns zero
- **Infinity:** Returns infinity

### Precision Considerations
- **Floating-point arithmetic** may introduce small errors
- **Large numbers** may cause overflow
- **Precision settings** affect output format
- **Integer operations** are more efficient than floating-point

---

*This documentation provides a comprehensive guide to the Floor component in Barotrauma's electrical system, including its mathematical behavior, practical applications, and implementation examples.* 
