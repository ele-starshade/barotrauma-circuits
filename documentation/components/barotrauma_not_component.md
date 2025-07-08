# Barotrauma Not Component

## Overview

The **Not Component** is a fundamental logical signal processing component in Barotrauma's electrical system that performs logical NOT operations on electrical signals. It inverts the input signal - when the input receives a signal, the output is off; when the input receives no signal, the output is on. This makes it essential for creating inverse logic, safety systems, and control circuits.

**Official Description:** "Sends a signal when the input is NOT receiving a signal."

## Component Properties

### Basic Information
- **Identifier:** `notcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#ad7a79` (Reddish Brown)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal (the signal to be inverted)

#### Output Pins
- **`signal_out`** - Output signal (inverted input signal)

### Configurable Properties

The NotComponent supports the following player-configurable parameters:

- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Threshold`** - Signal threshold for logical operations (default: 0.5)

Only the properties listed above are player-configurable in-game. All other parameters are internal and cannot be changed by the player.

### Internal Properties

The component also uses these fixed internal parameters:

- **`Hysteresis`** - Hysteresis band to prevent oscillation (fixed at 0.1)

## Logical Function

The Not component performs the logical NOT operation:

```
output = NOT signal_in
```

Or in mathematical notation:
```
output = ¬signal_in = !signal_in
```

### Logical Properties

1. **Inversion:** NOT(1) = 0, NOT(0) = 1
2. **Double Negation:** NOT(NOT(x)) = x
3. **Identity:** NOT(0) = 1, NOT(1) = 0
4. **Signal Threshold:** Values above threshold are considered "true"
5. **Signal Persistence:** Output persists until input changes

### Behavior Examples

| signal_in | Output | Notes |
|-----------|--------|-------|
| 0 | 1 | No input signal → output signal |
| 1 | 0 | Input signal → no output signal |
| 0.3 | 1 | Below threshold → output signal |
| 0.7 | 0 | Above threshold → no output signal |
| -0.5 | 1 | Negative input → output signal |
| 2.0 | 0 | High input → no output signal |

### Special Cases

1. **Zero Input:** Returns 1 (output signal)
2. **High Input:** Returns 0 (no output signal)
3. **Negative Input:** Returns 1 (output signal)
4. **Threshold Boundary:** Uses hysteresis to prevent oscillation
5. **Multiple Inputs:** Uses OR logic for signal aggregation

## Signal Aggregation

Like other Barotrauma components, the Not component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 0.8 (arrives first)
Wire 2: 0.3 (arrives second)

// Result: signal_in = 0.8 (OR logic)
// Output = NOT(0.8) = 0 (no output signal)
```

## Real-World Applications

### 1. **Safety Systems**
```javascript
// Emergency shutdown when sensor fails
const sensorActive = 1; // sensor is working
const emergencyShutdown = !sensorActive; // 0 (no shutdown)
// If sensor fails (0), emergencyShutdown becomes 1
```

### 2. **Inverse Control**
```javascript
// Invert a button press for opposite action
const buttonPressed = 1; // button is pressed
const oppositeAction = !buttonPressed; // 0 (don't do opposite)
// When button is released (0), oppositeAction becomes 1
```

### 3. **Alarm Systems**
```javascript
// Alarm when door is NOT closed
const doorClosed = 1; // door is closed
const alarmActive = !doorClosed; // 0 (no alarm)
// If door opens (0), alarmActive becomes 1
```

### 4. **Backup Systems**
```javascript
// Activate backup when primary fails
const primaryActive = 1; // primary system working
const backupActive = !primaryActive; // 0 (backup off)
// If primary fails (0), backupActive becomes 1
```

### 5. **Logic Inversion**
```javascript
// Invert any logical signal
const originalSignal = 0.8; // some condition true
const invertedSignal = !originalSignal; // 0 (inverted)
```

## Integration Examples

### 1. **Advanced Safety System**
```javascript
// Multi-condition safety with NOT logic
const pressureNormal = 1; // pressure OK
const temperatureNormal = 1; // temperature OK
const oxygenNormal = 1; // oxygen OK

const anyConditionFailed = !(pressureNormal && temperatureNormal && oxygenNormal);
// If any condition fails, anyConditionFailed becomes 1
```

### 2. **Inverted Control Chain**
```javascript
// Chain of NOT operations
const inputSignal = 1;
const firstInversion = !inputSignal; // 0
const secondInversion = !firstInversion; // 1 (back to original)
const thirdInversion = !secondInversion; // 0
```

### 3. **Conditional NOT Logic**
```javascript
// NOT with conditional logic
const baseCondition = 1;
const enableInversion = 1; // enable NOT operation
const result = enableInversion ? !baseCondition : baseCondition; // 0
```

## JavaScript Simulation Class

```javascript
class NotComponent {
    constructor(config = {}) {
        this.threshold = config.threshold || 0.5;
        this.hysteresis = config.hysteresis || 0.1;
        this.timeFrame = config.timeFrame || 0;
        
        // Input/output state
        this.signalIn = 0;
        this.output = 1; // Default output when no input
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Hysteresis state
        this.lastOutput = 1;
        this.hysteresisState = 'low'; // 'low' or 'high'
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signal and calculate NOT operation
     * @param {number} input - Input signal
     * @returns {number} - Inverted output signal
     */
    process(input) {
        try {
            // Update input signal
            this.signalIn = input;
            
            // Perform NOT operation with hysteresis
            let result = this.performNotOperation(input);
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            this.output = result;
            this.lastError = null;
            
            return result;
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`NotComponent error: ${error.message}`);
            return 1; // Default to output signal on error
        }
    }
    
    /**
     * Perform the NOT operation with hysteresis
     * @param {number} input - The input signal
     * @returns {number} - The inverted output (0 or 1)
     */
    performNotOperation(input) {
        // Handle invalid inputs
        if (typeof input !== 'number') {
            throw new Error('Invalid input type');
        }
        
        // Handle special cases
        if (!isFinite(input)) {
            if (isNaN(input)) return 1; // NaN input → output signal
            return 0; // Infinity input → no output signal
        }
        
        // Apply hysteresis to prevent oscillation
        const highThreshold = this.threshold + this.hysteresis;
        const lowThreshold = this.threshold - this.hysteresis;
        
        let result;
        
        if (this.hysteresisState === 'low') {
            // Currently in low state
            if (input >= highThreshold) {
                this.hysteresisState = 'high';
                result = 0; // No output signal
            } else {
                result = 1; // Output signal
            }
        } else {
            // Currently in high state
            if (input <= lowThreshold) {
                this.hysteresisState = 'low';
                result = 1; // Output signal
            } else {
                result = 0; // No output signal
            }
        }
        
        this.lastOutput = result;
        return result;
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
            const average = sum / this.signalHistory.length;
            
            // Convert average back to binary (0 or 1)
            return average > 0.5 ? 1 : 0;
        }
        
        return currentValue;
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn = 0;
        this.output = 1;
        this.signalHistory = [];
        this.lastOutput = 1;
        this.hysteresisState = 'low';
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
            output: this.output,
            threshold: this.threshold,
            hysteresis: this.hysteresis,
            timeFrame: this.timeFrame,
            hysteresisState: this.hysteresisState,
            lastOutput: this.lastOutput,
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
        if (config.threshold !== undefined) {
            this.threshold = config.threshold;
        }
        if (config.hysteresis !== undefined) {
            this.hysteresis = config.hysteresis;
        }
        if (config.timeFrame !== undefined) {
            this.timeFrame = config.timeFrame;
        }
    }
}

// Usage Examples
class NotComponentExamples {
    static basicNotOperation() {
        const not = new NotComponent();
        
        console.log('Basic NOT Operation Examples:');
        console.log('NOT(0) =', not.process(0)); // 1
        console.log('NOT(1) =', not.process(1)); // 0
        console.log('NOT(0.3) =', not.process(0.3)); // 1
        console.log('NOT(0.7) =', not.process(0.7)); // 0
    }
    
    static hysteresisExample() {
        const not = new NotComponent({
            threshold: 0.5,
            hysteresis: 0.1
        });
        
        console.log('\nHysteresis Examples:');
        console.log('Input: 0.3 → Output:', not.process(0.3)); // 1
        console.log('Input: 0.4 → Output:', not.process(0.4)); // 1
        console.log('Input: 0.6 → Output:', not.process(0.6)); // 0 (switches at 0.6)
        console.log('Input: 0.5 → Output:', not.process(0.5)); // 0 (stays in high state)
        console.log('Input: 0.3 → Output:', not.process(0.3)); // 1 (switches back at 0.4)
    }
    
    static specialCases() {
        const not = new NotComponent();
        
        console.log('\nSpecial Cases:');
        console.log('NOT(-0.5) =', not.process(-0.5)); // 1
        console.log('NOT(2.0) =', not.process(2.0)); // 0
        console.log('NOT(Infinity) =', not.process(Infinity)); // 0
        console.log('NOT(NaN) =', not.process(NaN)); // 1
    }
    
    static errorHandling() {
        const not = new NotComponent();
        
        console.log('\nError Handling Examples:');
        
        // Invalid inputs
        try {
            console.log('NOT("string") =', not.process("string")); // Error
        } catch (error) {
            console.log('Invalid input handled:', error.message);
        }
        
        console.log('Status:', not.getStatus());
    }
    
    static timeFrameExample() {
        const not = new NotComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial: NOT(0) =', not.process(0)); // 1
        console.log('After 500ms: NOT(1) =', not.process(1)); // 0.5 (average)
        console.log('After 1s: NOT(0) =', not.process(0)); // 1 (new average)
    }
    
    static realWorldExamples() {
        const not = new NotComponent();
        
        console.log('\nReal-World Examples:');
        
        // Safety system
        const sensorActive = 1; // sensor is working
        const emergencyShutdown = not.process(sensorActive);
        console.log(`Sensor active: ${sensorActive} → Emergency shutdown: ${emergencyShutdown}`);
        
        // Door alarm
        const doorClosed = 1; // door is closed
        const alarmActive = not.process(doorClosed);
        console.log(`Door closed: ${doorClosed} → Alarm active: ${alarmActive}`);
        
        // Backup system
        const primaryActive = 1; // primary system working
        const backupActive = not.process(primaryActive);
        console.log(`Primary active: ${primaryActive} → Backup active: ${backupActive}`);
        
        // Button inversion
        const buttonPressed = 0; // button not pressed
        const oppositeAction = not.process(buttonPressed);
        console.log(`Button pressed: ${buttonPressed} → Opposite action: ${oppositeAction}`);
    }
    
    static advancedExamples() {
        const not = new NotComponent();
        
        console.log('\nAdvanced Examples:');
        
        // Multi-condition safety
        const pressureNormal = 1; // pressure OK
        const temperatureNormal = 1; // temperature OK
        const oxygenNormal = 1; // oxygen OK
        
        // Simulate AND logic with NOT
        const allConditionsOK = pressureNormal && temperatureNormal && oxygenNormal;
        const anyConditionFailed = not.process(allConditionsOK);
        console.log(`All conditions OK: ${allConditionsOK} → Any failed: ${anyConditionFailed}`);
        
        // Double negation
        const originalSignal = 1;
        const firstInversion = not.process(originalSignal); // 0
        const secondInversion = not.process(firstInversion); // 1
        console.log(`Double negation: ${originalSignal} → ${firstInversion} → ${secondInversion}`);
        
        // Conditional NOT
        const baseCondition = 1;
        const enableInversion = 1; // enable NOT operation
        const result = enableInversion ? not.process(baseCondition) : baseCondition;
        console.log(`Conditional NOT: ${baseCondition} (inverted: ${enableInversion}) → ${result}`);
    }
}

// Run examples
NotComponentExamples.basicNotOperation();
NotComponentExamples.hysteresisExample();
NotComponentExamples.specialCases();
NotComponentExamples.errorHandling();
NotComponentExamples.timeFrameExample();
NotComponentExamples.realWorldExamples();
NotComponentExamples.advancedExamples();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Types**
   - **Cause:** Non-numeric inputs
   - **Handling:** Throw error and return 1 (output signal)
   - **Prevention:** Use type validation components

2. **Non-Finite Inputs**
   - **Cause:** Infinity, -Infinity, or NaN
   - **Handling:** Return appropriate value (0 for Infinity, 1 for NaN)
   - **Prevention:** Validate input ranges

3. **Hysteresis Oscillation**
   - **Cause:** Input signals near threshold causing rapid switching
   - **Handling:** Use hysteresis band to prevent oscillation
   - **Prevention:** Set appropriate hysteresis values

### Error Recovery Strategies

```javascript
// Example error recovery system
class NotComponentWithRecovery extends NotComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 1;
        this.lastValidInput = 0;
    }
    
    process(input) {
        try {
            const result = super.process(input);
            this.recoveryMode = false;
            this.lastValidOutput = result;
            this.lastValidInput = input;
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
- **Time Complexity:** O(1) for basic NOT operation
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Threshold Values**
   ```javascript
   // Good: Specific threshold for your application
   const not = new NotComponent({
       threshold: 0.3 // Lower threshold for sensitive detection
   });
   ```

2. **Set Appropriate Hysteresis**
   ```javascript
   // Prevent oscillation in noisy signals
   const not = new NotComponent({
       threshold: 0.5,
       hysteresis: 0.2 // Wider hysteresis band
   });
   ```

3. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const not = new NotComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Output Values**
   - **Cause:** Threshold or hysteresis settings
   - **Solution:** Check configuration and expected behavior

2. **Oscillation Issues**
   - **Cause:** Input signals near threshold
   - **Solution:** Increase hysteresis band

3. **Slow Response**
   - **Cause:** Time frame processing
   - **Solution:** Reduce time frame or disable it

4. **Incorrect Logic**
   - **Cause:** Misunderstanding of NOT operation
   - **Solution:** Remember: NOT outputs when input is absent

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugNotComponent extends NotComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input) {
        if (this.debugMode) {
            console.log(`NotComponent: NOT(${input})`);
        }
        
        const result = super.process(input);
        
        if (this.debugMode) {
            this.operationLog.push({
                input: input,
                output: result,
                hysteresisState: this.hysteresisState,
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

### NOT vs Other Logical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **NOT** | ¬a | 1 | Signal inversion, safety systems |
| **AND** | a ∧ b | 2 | All conditions must be true |
| **OR** | a ∨ b | 2 | Any condition can be true |
| **XOR** | a ⊕ b | 2 | Exactly one condition true |

### When to Use NOT Component

**Use NOT when you need:**
- Signal inversion
- Safety systems (alarm when condition fails)
- Backup system activation
- Inverse control logic
- Logic complement operations

**Consider alternatives when:**
- Multiple conditions needed (use AND/OR)
- Complex logic needed (use combinations)
- Signal processing needed (use mathematical components)

## Advanced Usage Patterns

### 1. **Cascading NOT Operations**
```javascript
// Multiple NOT operations in series
const not1 = new NotComponent();
const not2 = new NotComponent();

const result1 = not1.process(1); // 0
const result2 = not2.process(result1); // 1 (double negation)
```

### 2. **Conditional NOT Logic**
```javascript
// NOT with conditional logic
class ConditionalNotComponent extends NotComponent {
    process(input, enableInversion) {
        if (enableInversion) {
            return super.process(input);
        } else {
            return input; // Pass through without inversion
        }
    }
}
```

### 3. **Multi-Input NOT System**
```javascript
// Handle multiple inputs with OR logic
class MultiInputNotComponent extends NotComponent {
    processMultiple(inputs) {
        // Use OR logic for multiple inputs
        const combinedInput = inputs.reduce((max, input) => 
            Math.max(max, input), 0
        );
        return this.performNotOperation(combinedInput);
    }
}
```

## Logical References

### NOT Function Properties
- **Inversion:** NOT(1) = 0, NOT(0) = 1
- **Double Negation:** NOT(NOT(x)) = x
- **Identity:** NOT(0) = 1, NOT(1) = 0
- **Signal Threshold:** Values above threshold are considered "true"
- **Signal Persistence:** Output persists until input changes

### Related Operations
- **AND:** a ∧ b = both must be true
- **OR:** a ∨ b = either can be true
- **XOR:** a ⊕ b = exactly one must be true
- **NAND:** NOT(a ∧ b) = NOT AND
- **NOR:** NOT(a ∨ b) = NOT OR

### Special Cases
- **Zero Input:** Returns 1 (output signal)
- **High Input:** Returns 0 (no output signal)
- **Negative Input:** Returns 1 (output signal)
- **Threshold Boundary:** Uses hysteresis to prevent oscillation
- **Multiple Inputs:** Uses OR logic for signal aggregation

### Hysteresis Considerations
- **Prevents oscillation** in noisy signals
- **Creates switching bands** around threshold
- **Improves stability** in control systems
- **Reduces component wear** from rapid switching

---

*This documentation provides a comprehensive guide to the NOT component in Barotrauma's electrical system, including its logical behavior, practical applications, and implementation examples.* 
