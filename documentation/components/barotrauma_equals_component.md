# Barotrauma Equals Component

## Overview

The **Equals Component** is a logical comparison component in Barotrauma's electrical system that performs equality checks on electrical signals. It compares two input signals and outputs a signal when they are equal, with optional false output when they are not equal.

**Official Description:** "Sends a signal when both inputs receive the same signal."

## Component Properties

### Basic Information
- **Identifier:** `equalscomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#694341` (Dark brown)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in1`** - First input signal for comparison
- **`signal_in2`** - Second input signal for comparison
- **`set_output`** - Optional input to set the output value

#### Output Pins
- **`signal_out`** - Output signal when inputs are equal
- **`false_output`** - Output signal when inputs are not equal (optional)

### Configurable Properties

The EqualsComponent supports several configurable properties:

- **`TimeFrame`** - Time-based processing window for comparison coordination
- **`Output`** - Custom output value when inputs are equal
- **`FalseOutput`** - Custom output value when inputs are not equal

Only the properties listed above are player-configurable in-game. All other parameters are internal and cannot be changed by the player.

## Logical Function

The Equals component performs the logical comparison:

```
output = (signal_in1 == signal_in2)
```

### Comparison Behavior

1. **Exact Equality:** Compares the exact values of both input signals
2. **Type Coercion:** May perform type conversion for comparison (e.g., string to number)
3. **Precision:** Handles floating-point precision for numerical comparisons
4. **Null/Empty Handling:** Treats null, undefined, or empty signals appropriately

### Behavior Examples

| Input 1 | Input 2 | Output | False Output | Notes |
|---------|---------|--------|--------------|-------|
| 10 | 10 | 1 | 0 | Exact match |
| 5.5 | 5.5 | 1 | 0 | Decimal match |
| 10 | 5 | 0 | 1 | No match |
| "test" | "test" | 1 | 0 | String match |
| 0 | 0 | 1 | 0 | Zero values |
| null | null | 1 | 0 | Null values |
| 10 | "10" | 1 | 0 | Type coercion |

## Signal Aggregation

Like other Barotrauma components, the Equals component follows signal aggregation rules:

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
// If signal_in2 = 10, then output = 1 (true)
// If signal_in2 = 5, then output = 0 (false)
```

## Real-World Applications

### 1. **Threshold Monitoring**
```javascript
// Monitor if temperature reaches target
const currentTemp = 75; // Current temperature
const targetTemp = 75; // Target temperature
const isAtTarget = currentTemp === targetTemp; // true
```

### 2. **Password/Code Verification**
```javascript
// Verify access codes
const enteredCode = 1234;
const correctCode = 1234;
const accessGranted = enteredCode === correctCode; // true
```

### 3. **State Synchronization**
```javascript
// Check if two systems are in sync
const system1State = "ready";
const system2State = "ready";
const systemsSynced = system1State === system2State; // true
```

### 4. **Quality Control**
```javascript
// Verify product specifications
const measuredWeight = 100.0; // grams
const targetWeight = 100.0; // grams
const weightCorrect = measuredWeight === targetWeight; // true
```

### 5. **Safety Systems**
```javascript
// Check if safety conditions are met
const pressure1 = 50; // psi
const pressure2 = 50; // psi
const pressuresBalanced = pressure1 === pressure2; // true
```

## Integration Examples

### 1. **Advanced Access Control**
```javascript
// Multi-factor authentication system
const cardCode = 1234;
const pinCode = 5678;
const biometricMatch = true;

const cardVerified = cardCode === 1234; // true
const pinVerified = pinCode === 5678; // true
const biometricVerified = biometricMatch === true; // true

const accessGranted = cardVerified && pinVerified && biometricVerified; // true
```

### 2. **Environmental Monitoring**
```javascript
// Check environmental conditions
const temp1 = 22.5; // Sensor 1
const temp2 = 22.5; // Sensor 2
const temp3 = 22.5; // Sensor 3

const tempsConsistent = temp1 === temp2 && temp2 === temp3; // true
```

### 3. **Inventory Management**
```javascript
// Verify inventory counts
const expectedCount = 100;
const actualCount = 100;
const countCorrect = expectedCount === actualCount; // true
```

## JavaScript Simulation Class

```javascript
class EqualsComponent {
    constructor(config = {}) {
        this.timeFrame = config.timeFrame || 0;
        this.outputValue = config.outputValue || 1;
        this.falseOutputValue = config.falseOutputValue || 0;
        this.tolerance = config.tolerance || 0; // For floating-point comparisons
        
        // Input/output state
        this.signalIn1 = null;
        this.signalIn2 = null;
        this.output = 0;
        this.falseOutput = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Comparison state
        this.lastComparison = false;
        this.comparisonCount = 0;
    }
    
    /**
     * Process input signals and perform comparison
     * @param {*} signal1 - First input signal
     * @param {*} signal2 - Second input signal
     * @returns {object} - Object containing output and falseOutput
     */
    process(signal1, signal2) {
        try {
            // Update input signals
            this.signalIn1 = signal1;
            this.signalIn2 = signal2;
            
            // Perform comparison
            const isEqual = this.performComparison(signal1, signal2);
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                const timeBasedResult = this.applyTimeFrame(isEqual);
                this.output = timeBasedResult ? this.outputValue : 0;
                this.falseOutput = timeBasedResult ? 0 : this.falseOutputValue;
            } else {
                // Immediate output
                this.output = isEqual ? this.outputValue : 0;
                this.falseOutput = isEqual ? 0 : this.falseOutputValue;
            }
            
            this.lastComparison = isEqual;
            this.comparisonCount++;
            
            return {
                output: this.output,
                falseOutput: this.falseOutput,
                isEqual: isEqual
            };
            
        } catch (error) {
            console.warn(`EqualsComponent error: ${error.message}`);
            return {
                output: 0,
                falseOutput: this.falseOutputValue,
                isEqual: false
            };
        }
    }
    
    /**
     * Perform the equality comparison
     * @param {*} value1 - First value to compare
     * @param {*} value2 - Second value to compare
     * @returns {boolean} - True if values are equal
     */
    performComparison(value1, value2) {
        // Handle null/undefined cases
        if (value1 === null && value2 === null) return true;
        if (value1 === undefined && value2 === undefined) return true;
        if (value1 === null || value2 === null) return false;
        if (value1 === undefined || value2 === undefined) return false;
        
        // Handle numeric comparisons with tolerance
        if (typeof value1 === 'number' && typeof value2 === 'number') {
            if (this.tolerance > 0) {
                return Math.abs(value1 - value2) <= this.tolerance;
            }
            return value1 === value2;
        }
        
        // Handle string comparisons
        if (typeof value1 === 'string' && typeof value2 === 'string') {
            return value1 === value2;
        }
        
        // Handle boolean comparisons
        if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
            return value1 === value2;
        }
        
        // Handle mixed types (try type coercion)
        if (typeof value1 !== typeof value2) {
            // Try converting to numbers
            const num1 = Number(value1);
            const num2 = Number(value2);
            if (!isNaN(num1) && !isNaN(num2)) {
                if (this.tolerance > 0) {
                    return Math.abs(num1 - num2) <= this.tolerance;
                }
                return num1 === num2;
            }
            
            // Try converting to strings
            return String(value1) === String(value2);
        }
        
        // Default strict equality
        return value1 === value2;
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
        
        // Remove old results outside the time frame
        const cutoffTime = currentTime - this.timeFrame;
        this.signalHistory = this.signalHistory.filter(
            entry => entry.timestamp >= cutoffTime
        );
        
        // Calculate majority result if we have values
        if (this.signalHistory.length > 0) {
            const trueCount = this.signalHistory.filter(entry => entry.result).length;
            const falseCount = this.signalHistory.length - trueCount;
            return trueCount > falseCount;
        }
        
        return currentResult;
    }
    
    /**
     * Set custom output values
     * @param {*} outputValue - Value to output when inputs are equal
     * @param {*} falseOutputValue - Value to output when inputs are not equal
     */
    setOutputValues(outputValue, falseOutputValue) {
        this.outputValue = outputValue;
        this.falseOutputValue = falseOutputValue;
    }
    
    /**
     * Set comparison tolerance for floating-point numbers
     * @param {number} tolerance - Tolerance value
     */
    setTolerance(tolerance) {
        this.tolerance = tolerance;
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn1 = null;
        this.signalIn2 = null;
        this.output = 0;
        this.falseOutput = 0;
        this.signalHistory = [];
        this.lastComparison = false;
        this.comparisonCount = 0;
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
            falseOutput: this.falseOutput,
            isEqual: this.lastComparison,
            timeFrame: this.timeFrame,
            tolerance: this.tolerance,
            comparisonCount: this.comparisonCount,
            signalHistoryLength: this.signalHistory.length
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
        if (config.outputValue !== undefined) {
            this.outputValue = config.outputValue;
        }
        if (config.falseOutputValue !== undefined) {
            this.falseOutputValue = config.falseOutputValue;
        }
        if (config.tolerance !== undefined) {
            this.tolerance = config.tolerance;
        }
    }
}

// Usage Examples
class EqualsComponentExamples {
    static basicComparison() {
        const equals = new EqualsComponent();
        
        console.log('Basic Comparison Examples:');
        console.log('10 == 10:', equals.process(10, 10).isEqual); // true
        console.log('10 == 5:', equals.process(10, 5).isEqual); // false
        console.log('"test" == "test":', equals.process("test", "test").isEqual); // true
        console.log('true == true:', equals.process(true, true).isEqual); // true
    }
    
    static toleranceExample() {
        const equals = new EqualsComponent({
            tolerance: 0.1
        });
        
        console.log('\nTolerance Examples:');
        console.log('5.1 == 5.0 (tolerance 0.1):', equals.process(5.1, 5.0).isEqual); // true
        console.log('5.2 == 5.0 (tolerance 0.1):', equals.process(5.2, 5.0).isEqual); // false
    }
    
    static customOutputExample() {
        const equals = new EqualsComponent({
            outputValue: "MATCH",
            falseOutputValue: "NO_MATCH"
        });
        
        console.log('\nCustom Output Examples:');
        console.log('10 == 10:', equals.process(10, 10).output); // "MATCH"
        console.log('10 == 5:', equals.process(10, 5).falseOutput); // "NO_MATCH"
    }
    
    static timeFrameExample() {
        const equals = new EqualsComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial:', equals.process(10, 10).isEqual); // true
        console.log('After 500ms:', equals.process(10, 5).isEqual); // true (majority)
        console.log('After 1s:', equals.process(10, 5).isEqual); // false (new majority)
    }
    
    static typeCoercionExample() {
        const equals = new EqualsComponent();
        
        console.log('\nType Coercion Examples:');
        console.log('10 == "10":', equals.process(10, "10").isEqual); // true
        console.log('true == 1:', equals.process(true, 1).isEqual); // true
        console.log('false == 0:', equals.process(false, 0).isEqual); // true
    }
}

// Run examples
EqualsComponentExamples.basicComparison();
EqualsComponentExamples.toleranceExample();
EqualsComponentExamples.customOutputExample();
EqualsComponentExamples.timeFrameExample();
EqualsComponentExamples.typeCoercionExample();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Types**
   - **Cause:** Non-comparable data types
   - **Handling:** Attempt type coercion or return false
   - **Prevention:** Use type validation components

2. **Null/Undefined Values**
   - **Cause:** Missing or uninitialized signals
   - **Handling:** Treat as special cases in comparison logic
   - **Prevention:** Use signal validation components

3. **Floating-Point Precision Issues**
   - **Cause:** Small differences in floating-point arithmetic
   - **Handling:** Use tolerance-based comparison
   - **Prevention:** Configure appropriate tolerance values

### Error Recovery Strategies

```javascript
// Example error recovery system
class EqualsComponentWithRecovery extends EqualsComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidResult = false;
    }
    
    process(signal1, signal2) {
        try {
            const result = super.process(signal1, signal2);
            this.recoveryMode = false;
            this.lastValidResult = result.isEqual;
            return result;
        } catch (error) {
            this.recoveryMode = true;
            console.warn(`Using last valid result: ${this.lastValidResult}`);
            return {
                output: this.lastValidResult ? this.outputValue : 0,
                falseOutput: this.lastValidResult ? 0 : this.falseOutputValue,
                isEqual: this.lastValidResult
            };
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

1. **Use Appropriate Tolerance Values**
   ```javascript
   // Good: Specific tolerance for your application
   const equals = new EqualsComponent({
       tolerance: 0.01 // 1% tolerance
   });
   
   // Avoid: Very small tolerances unless necessary
   const equals = new EqualsComponent({
       tolerance: 0.0000001 // Too precise
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for stability
   const equals = new EqualsComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Efficient Type Handling**
   ```javascript
   // Pre-convert types when possible
   const value1 = Number(signal1);
   const value2 = Number(signal2);
   const result = equals.process(value1, value2);
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected False Results**
   - **Cause:** Type mismatches or precision issues
   - **Solution:** Check data types and configure tolerance

2. **Output Not Updating**
   - **Cause:** Signal aggregation issues or time frame delays
   - **Solution:** Verify signal connections and time frame settings

3. **Inconsistent Results**
   - **Cause:** Floating-point precision or tolerance issues
   - **Solution:** Adjust tolerance values or use integer comparisons

4. **Performance Issues**
   - **Cause:** Large time frame windows or frequent updates
   - **Solution:** Optimize time frame size and update frequency

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugEqualsComponent extends EqualsComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.comparisonLog = [];
    }
    
    process(signal1, signal2) {
        if (this.debugMode) {
            console.log(`EqualsComponent: ${signal1} == ${signal2}`);
        }
        
        const result = super.process(signal1, signal2);
        
        if (this.debugMode) {
            this.comparisonLog.push({
                input1: signal1,
                input2: signal2,
                result: result.isEqual,
                timestamp: Date.now()
            });
        }
        
        return result;
    }
    
    getDebugInfo() {
        return {
            comparisonLog: this.comparisonLog,
            status: this.getStatus()
        };
    }
}
```

## Component Comparison

### Equals vs Other Comparison Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Equals** | Equality (==) | 2 | Exact matching, verification |
| **Greater** | Greater than (>) | 2 | Threshold checking, ranking |
| **Less** | Less than (<) | 2 | Minimum checking, limits |
| **Greater or Equal** | Greater or equal (>=) | 2 | Range checking, minimums |
| **Less or Equal** | Less or equal (<=) | 2 | Range checking, maximums |

### When to Use Equals Component

**Use Equals when you need:**
- Exact value matching
- Password/code verification
- State synchronization
- Quality control checks
- Safety condition verification

**Consider alternatives when:**
- Range checking is needed (use Greater/Less)
- Threshold monitoring (use Greater/Less)
- Ranking or sorting (use Greater/Less)

## Advanced Usage Patterns

### 1. **Multi-Value Comparison**
```javascript
// Compare multiple values for equality
class MultiEqualsComponent extends EqualsComponent {
    processMultiple(values) {
        if (values.length < 2) return { isEqual: true, output: this.outputValue };
        
        for (let i = 1; i < values.length; i++) {
            if (!this.performComparison(values[i-1], values[i])) {
                return { isEqual: false, output: 0, falseOutput: this.falseOutputValue };
            }
        }
        
        return { isEqual: true, output: this.outputValue, falseOutput: 0 };
    }
}
```

### 2. **Conditional Comparison**
```javascript
// Comparison with conditional logic
class ConditionalEqualsComponent extends EqualsComponent {
    process(signal1, signal2, condition) {
        if (condition) {
            return super.process(signal1, signal2);
        } else {
            return { isEqual: false, output: 0, falseOutput: this.falseOutputValue };
        }
    }
}
```

### 3. **Pattern Matching**
```javascript
// String pattern matching
class PatternEqualsComponent extends EqualsComponent {
    processPattern(input, pattern) {
        const regex = new RegExp(pattern);
        const isMatch = regex.test(String(input));
        
        return {
            isEqual: isMatch,
            output: isMatch ? this.outputValue : 0,
            falseOutput: isMatch ? 0 : this.falseOutputValue
        };
    }
}
```

## Logical References

### Equality Properties
- **Reflexive:** a == a (always true)
- **Symmetric:** a == b implies b == a
- **Transitive:** a == b and b == c implies a == c
- **Substitution:** a == b implies f(a) == f(b)

### Comparison Considerations
- **Type Safety:** Consider whether type coercion is desired
- **Precision:** Floating-point comparisons may need tolerance
- **Null Handling:** Decide how to handle null/undefined values
- **Performance:** Simple comparisons are faster than complex ones

### Best Practices
- **Use appropriate tolerance** for floating-point comparisons
- **Validate input types** when precision is critical
- **Consider time-based processing** for noisy signals
- **Document comparison logic** for complex scenarios

---

*This documentation provides a comprehensive guide to the Equals component in Barotrauma's electrical system, including its comparison behavior, practical applications, and implementation examples.* 
