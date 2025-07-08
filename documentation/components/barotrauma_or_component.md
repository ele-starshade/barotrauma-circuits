# Barotrauma Or Component

## Overview

The **Or Component** is a fundamental logical signal processing component in Barotrauma's electrical system that performs logical OR operations on electrical signals. It outputs a signal when ANY of its inputs receive a signal, making it essential for creating alternative activation paths, combining multiple triggers, and implementing "either/or" logic in electrical circuits.

**Official Description:** "Sends a signal if either of the inputs receives a signal."

## Component Properties

### Basic Information
- **Identifier:** `orcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#d1b788` (Golden Brown)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in1`** - First input signal
- **`signal_in2`** - Second input signal
- **`set_output`** - Output control signal (optional)

#### Output Pins
- **`signal_out`** - Output signal (OR result of inputs)

### Configurable Properties

The OrComponent supports the following player-configurable parameters:

- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Threshold`** - Signal threshold for logical operations (default: 0.5)

Only the properties listed above are player-configurable in-game. All other parameters are internal and cannot be changed by the player.

### Internal Properties

The component also uses these fixed internal parameters:

- **`Hysteresis`** - Hysteresis band to prevent oscillation (fixed at 0.1)

## Logical Function

The Or component performs the logical OR operation:

```
output = signal_in1 OR signal_in2
```

Or in mathematical notation:
```
output = signal_in1 ∨ signal_in2 = signal_in1 || signal_in2
```

### Logical Properties

1. **Commutative:** a OR b = b OR a
2. **Associative:** (a OR b) OR c = a OR (b OR c)
3. **Idempotent:** a OR a = a
4. **Identity:** a OR 0 = a
5. **Domination:** a OR 1 = 1
6. **Distributive:** a OR (b AND c) = (a OR b) AND (a OR c)

### Behavior Examples

| signal_in1 | signal_in2 | Output | Notes |
|------------|------------|--------|-------|
| 0 | 0 | 0 | No signals → no output |
| 1 | 0 | 1 | First input active → output |
| 0 | 1 | 1 | Second input active → output |
| 1 | 1 | 1 | Both inputs active → output |
| 0.3 | 0.7 | 1 | Either above threshold → output |
| 0.2 | 0.1 | 0 | Both below threshold → no output |

### Special Cases

1. **Zero Inputs:** Returns 0 (no output signal)
2. **One Active Input:** Returns 1 (output signal)
3. **Both Active Inputs:** Returns 1 (output signal)
4. **Threshold Boundary:** Uses hysteresis to prevent oscillation
5. **Multiple Inputs:** Uses OR logic for signal aggregation

## Signal Aggregation

Like other Barotrauma components, the Or component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in1
Wire 1: 0.8 (arrives first)
Wire 2: 0.3 (arrives second)

// Multiple wires to signal_in2
Wire A: 0.2 (arrives first)
Wire B: 0.9 (arrives second)

// Result: signal_in1 = 0.8, signal_in2 = 0.9
// Output = 0.8 OR 0.9 = 1 (output signal)
```

## Real-World Applications

### 1. **Alternative Activation Systems**
```javascript
// Multiple ways to activate a system
const button1Pressed = 1; // primary button
const button2Pressed = 0; // secondary button
const systemActive = button1Pressed || button2Pressed; // 1 (active)
```

### 2. **Emergency Override Systems**
```javascript
// Normal operation OR emergency override
const normalOperation = 0; // normal control inactive
const emergencyOverride = 1; // emergency active
const systemEnabled = normalOperation || emergencyOverride; // 1 (enabled)
```

### 3. **Multi-Sensor Detection**
```javascript
// Any sensor can trigger an alarm
const motionSensor = 0; // no motion detected
const pressureSensor = 1; // pressure detected
const alarmActive = motionSensor || pressureSensor; // 1 (alarm on)
```

### 4. **Backup Power Systems**
```javascript
// Primary OR backup power source
const primaryPower = 0; // primary power failed
const backupPower = 1; // backup power active
const powerAvailable = primaryPower || backupPower; // 1 (power available)
```

### 5. **Multi-Input Control**
```javascript
// Multiple control inputs for one system
const remoteControl = 0; // remote inactive
const localControl = 1; // local control active
const systemControlled = remoteControl || localControl; // 1 (controlled)
```

## Integration Examples

### 1. **Advanced Control System**
```javascript
// Multiple control paths with OR logic
const automaticMode = 1; // automatic control active
const manualMode = 0; // manual control inactive
const emergencyMode = 0; // emergency mode inactive
const remoteControl = 0; // remote control inactive

const systemControlled = automaticMode || manualMode || emergencyMode || remoteControl;
// 1 (system is controlled by automatic mode)
```

### 2. **Safety System with Multiple Triggers**
```javascript
// Any safety condition can trigger shutdown
const temperatureHigh = 0; // temperature normal
const pressureHigh = 1; // pressure too high
const oxygenLow = 0; // oxygen normal
const radiationHigh = 0; // radiation normal

const safetyShutdown = temperatureHigh || pressureHigh || oxygenLow || radiationHigh;
// 1 (shutdown due to high pressure)
```

### 3. **Multi-Source Alarm System**
```javascript
// Multiple alarm sources
const fireAlarm = 0; // no fire
const smokeAlarm = 0; // no smoke
const intrusionAlarm = 1; // intrusion detected
const medicalAlarm = 0; // no medical emergency

const anyAlarmActive = fireAlarm || smokeAlarm || intrusionAlarm || medicalAlarm;
// 1 (intrusion alarm active)
```

## JavaScript Simulation Class

```javascript
class OrComponent {
    constructor(config = {}) {
        this.threshold = config.threshold || 0.5;
        this.hysteresis = config.hysteresis || 0.1;
        this.timeFrame = config.timeFrame || 0;
        
        // Input/output state
        this.signalIn1 = 0;
        this.signalIn2 = 0;
        this.setOutput = 0;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Hysteresis state
        this.lastOutput = 0;
        this.hysteresisState = 'low'; // 'low' or 'high'
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signals and calculate OR operation
     * @param {number} input1 - First input signal
     * @param {number} input2 - Second input signal
     * @param {number} setOutput - Output control signal (optional)
     * @returns {number} - OR result output signal
     */
    process(input1, input2, setOutput = null) {
        try {
            // Update input signals
            this.signalIn1 = input1;
            this.signalIn2 = input2;
            
            if (setOutput !== null) {
                this.setOutput = setOutput;
            }
            
            // Perform OR operation with hysteresis
            let result = this.performOrOperation(input1, input2);
            
            // Apply set_output if provided
            if (this.setOutput > this.threshold) {
                result = 1; // Force output on
            }
            
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
            console.warn(`OrComponent error: ${error.message}`);
            return 0; // Default to no output signal on error
        }
    }
    
    /**
     * Perform the OR operation with hysteresis
     * @param {number} input1 - The first input signal
     * @param {number} input2 - The second input signal
     * @returns {number} - The OR result (0 or 1)
     */
    performOrOperation(input1, input2) {
        // Handle invalid inputs
        if (typeof input1 !== 'number' || typeof input2 !== 'number') {
            throw new Error('Invalid input types');
        }
        
        // Handle special cases
        if (!isFinite(input1) || !isFinite(input2)) {
            if (isNaN(input1) || isNaN(input2)) return 0; // NaN input → no output
            return 1; // Infinity input → output signal
        }
        
        // Determine if either input is above threshold
        const input1Active = input1 >= this.threshold;
        const input2Active = input2 >= this.threshold;
        const logicalOr = input1Active || input2Active;
        
        // Apply hysteresis to prevent oscillation
        const highThreshold = this.threshold + this.hysteresis;
        const lowThreshold = this.threshold - this.hysteresis;
        
        let result;
        
        if (this.hysteresisState === 'low') {
            // Currently in low state
            if (logicalOr && (input1 >= highThreshold || input2 >= highThreshold)) {
                this.hysteresisState = 'high';
                result = 1; // Output signal
            } else {
                result = 0; // No output signal
            }
        } else {
            // Currently in high state
            if (!logicalOr && input1 <= lowThreshold && input2 <= lowThreshold) {
                this.hysteresisState = 'low';
                result = 0; // No output signal
            } else {
                result = 1; // Output signal
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
        this.signalIn1 = 0;
        this.signalIn2 = 0;
        this.setOutput = 0;
        this.output = 0;
        this.signalHistory = [];
        this.lastOutput = 0;
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
            signalIn1: this.signalIn1,
            signalIn2: this.signalIn2,
            setOutput: this.setOutput,
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
class OrComponentExamples {
    static basicOrOperation() {
        const or = new OrComponent();
        
        console.log('Basic OR Operation Examples:');
        console.log('0 OR 0 =', or.process(0, 0)); // 0
        console.log('1 OR 0 =', or.process(1, 0)); // 1
        console.log('0 OR 1 =', or.process(0, 1)); // 1
        console.log('1 OR 1 =', or.process(1, 1)); // 1
        console.log('0.3 OR 0.7 =', or.process(0.3, 0.7)); // 1
        console.log('0.2 OR 0.1 =', or.process(0.2, 0.1)); // 0
    }
    
    static hysteresisExample() {
        const or = new OrComponent({
            threshold: 0.5,
            hysteresis: 0.1
        });
        
        console.log('\nHysteresis Examples:');
        console.log('Input1: 0.3, Input2: 0.4 → Output:', or.process(0.3, 0.4)); // 0
        console.log('Input1: 0.6, Input2: 0.3 → Output:', or.process(0.6, 0.3)); // 1 (switches at 0.6)
        console.log('Input1: 0.5, Input2: 0.3 → Output:', or.process(0.5, 0.3)); // 1 (stays in high state)
        console.log('Input1: 0.3, Input2: 0.2 → Output:', or.process(0.3, 0.2)); // 0 (switches back)
    }
    
    static setOutputExample() {
        const or = new OrComponent();
        
        console.log('\nSet Output Examples:');
        console.log('Normal: 0 OR 0 =', or.process(0, 0)); // 0
        console.log('With set_output: 0 OR 0 =', or.process(0, 0, 1)); // 1 (forced on)
        console.log('Normal: 1 OR 0 =', or.process(1, 0)); // 1
        console.log('With set_output: 1 OR 0 =', or.process(1, 0, 0)); // 1 (normal OR)
    }
    
    static specialCases() {
        const or = new OrComponent();
        
        console.log('\nSpecial Cases:');
        console.log('Infinity OR 0 =', or.process(Infinity, 0)); // 1
        console.log('0 OR Infinity =', or.process(0, Infinity)); // 1
        console.log('NaN OR 1 =', or.process(NaN, 1)); // 0
        console.log('1 OR NaN =', or.process(1, NaN)); // 0
    }
    
    static errorHandling() {
        const or = new OrComponent();
        
        console.log('\nError Handling Examples:');
        
        // Invalid inputs
        try {
            console.log('"string" OR 1 =', or.process("string", 1)); // Error
        } catch (error) {
            console.log('Invalid input handled:', error.message);
        }
        
        console.log('Status:', or.getStatus());
    }
    
    static timeFrameExample() {
        const or = new OrComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial: 0 OR 0 =', or.process(0, 0)); // 0
        console.log('After 500ms: 1 OR 0 =', or.process(1, 0)); // 0.5 (average)
        console.log('After 1s: 0 OR 1 =', or.process(0, 1)); // 1 (new average)
    }
    
    static realWorldExamples() {
        const or = new OrComponent();
        
        console.log('\nReal-World Examples:');
        
        // Alternative activation
        const button1Pressed = 1; // primary button
        const button2Pressed = 0; // secondary button
        const systemActive = or.process(button1Pressed, button2Pressed);
        console.log(`Button1: ${button1Pressed}, Button2: ${button2Pressed} → System: ${systemActive}`);
        
        // Emergency override
        const normalOperation = 0; // normal control inactive
        const emergencyOverride = 1; // emergency active
        const systemEnabled = or.process(normalOperation, emergencyOverride);
        console.log(`Normal: ${normalOperation}, Emergency: ${emergencyOverride} → Enabled: ${systemEnabled}`);
        
        // Multi-sensor detection
        const motionSensor = 0; // no motion detected
        const pressureSensor = 1; // pressure detected
        const alarmActive = or.process(motionSensor, pressureSensor);
        console.log(`Motion: ${motionSensor}, Pressure: ${pressureSensor} → Alarm: ${alarmActive}`);
        
        // Backup power
        const primaryPower = 0; // primary power failed
        const backupPower = 1; // backup power active
        const powerAvailable = or.process(primaryPower, backupPower);
        console.log(`Primary: ${primaryPower}, Backup: ${backupPower} → Power: ${powerAvailable}`);
    }
    
    static advancedExamples() {
        const or = new OrComponent();
        
        console.log('\nAdvanced Examples:');
        
        // Multi-input control system
        const automaticMode = 1; // automatic control active
        const manualMode = 0; // manual control inactive
        const emergencyMode = 0; // emergency mode inactive
        const remoteControl = 0; // remote control inactive
        
        // Chain OR operations
        const mode1 = or.process(automaticMode, manualMode); // 1
        const mode2 = or.process(emergencyMode, remoteControl); // 0
        const systemControlled = or.process(mode1, mode2); // 1
        console.log(`Multi-mode control: ${systemControlled}`);
        
        // Safety system
        const temperatureHigh = 0; // temperature normal
        const pressureHigh = 1; // pressure too high
        const oxygenLow = 0; // oxygen normal
        const radiationHigh = 0; // radiation normal
        
        // Chain OR operations for safety
        const condition1 = or.process(temperatureHigh, pressureHigh); // 1
        const condition2 = or.process(oxygenLow, radiationHigh); // 0
        const safetyShutdown = or.process(condition1, condition2); // 1
        console.log(`Safety shutdown: ${safetyShutdown}`);
        
        // Alarm system
        const fireAlarm = 0; // no fire
        const smokeAlarm = 0; // no smoke
        const intrusionAlarm = 1; // intrusion detected
        const medicalAlarm = 0; // no medical emergency
        
        // Chain OR operations for alarms
        const alarm1 = or.process(fireAlarm, smokeAlarm); // 0
        const alarm2 = or.process(intrusionAlarm, medicalAlarm); // 1
        const anyAlarmActive = or.process(alarm1, alarm2); // 1
        console.log(`Any alarm active: ${anyAlarmActive}`);
    }
}

// Run examples
OrComponentExamples.basicOrOperation();
OrComponentExamples.hysteresisExample();
OrComponentExamples.setOutputExample();
OrComponentExamples.specialCases();
OrComponentExamples.errorHandling();
OrComponentExamples.timeFrameExample();
OrComponentExamples.realWorldExamples();
OrComponentExamples.advancedExamples();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Types**
   - **Cause:** Non-numeric inputs
   - **Handling:** Throw error and return 0 (no output signal)
   - **Prevention:** Use type validation components

2. **Non-Finite Inputs**
   - **Cause:** Infinity, -Infinity, or NaN
   - **Handling:** Return appropriate value (1 for Infinity, 0 for NaN)
   - **Prevention:** Validate input ranges

3. **Hysteresis Oscillation**
   - **Cause:** Input signals near threshold causing rapid switching
   - **Handling:** Use hysteresis band to prevent oscillation
   - **Prevention:** Set appropriate hysteresis values

### Error Recovery Strategies

```javascript
// Example error recovery system
class OrComponentWithRecovery extends OrComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
        this.lastValidInputs = [0, 0];
    }
    
    process(input1, input2, setOutput = null) {
        try {
            const result = super.process(input1, input2, setOutput);
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
- **Time Complexity:** O(1) for basic OR operation
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame

### Optimization Tips

1. **Use Appropriate Threshold Values**
   ```javascript
   // Good: Specific threshold for your application
   const or = new OrComponent({
       threshold: 0.3 // Lower threshold for sensitive detection
   });
   ```

2. **Set Appropriate Hysteresis**
   ```javascript
   // Prevent oscillation in noisy signals
   const or = new OrComponent({
       threshold: 0.5,
       hysteresis: 0.2 // Wider hysteresis band
   });
   ```

3. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const or = new OrComponent({
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
   - **Cause:** Misunderstanding of OR operation
   - **Solution:** Remember: OR outputs when ANY input is active

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugOrComponent extends OrComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input1, input2, setOutput = null) {
        if (this.debugMode) {
            console.log(`OrComponent: ${input1} OR ${input2}${setOutput !== null ? ` (set_output: ${setOutput})` : ''}`);
        }
        
        const result = super.process(input1, input2, setOutput);
        
        if (this.debugMode) {
            this.operationLog.push({
                input1: input1,
                input2: input2,
                setOutput: setOutput,
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

### OR vs Other Logical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **OR** | a ∨ b | 2 | Alternative activation, any condition |
| **AND** | a ∧ b | 2 | All conditions must be true |
| **NOT** | ¬a | 1 | Signal inversion |
| **XOR** | a ⊕ b | 2 | Exactly one condition true |

### When to Use OR Component

**Use OR when you need:**
- Alternative activation paths
- Multiple trigger conditions
- Emergency override systems
- Multi-sensor detection
- Backup system activation
- "Either/or" logic

**Consider alternatives when:**
- All conditions must be true (use AND)
- Signal inversion needed (use NOT)
- Exactly one condition (use XOR)
- Complex logic needed (use combinations)

## Advanced Usage Patterns

### 1. **Cascading OR Operations**
```javascript
// Multiple OR operations in series
const or1 = new OrComponent();
const or2 = new OrComponent();

const result1 = or1.process(0, 1); // 1
const result2 = or2.process(result1, 0); // 1
```

### 2. **Conditional OR Logic**
```javascript
// OR with conditional logic
class ConditionalOrComponent extends OrComponent {
    process(input1, input2, enableOr) {
        if (enableOr) {
            return super.process(input1, input2);
        } else {
            return Math.max(input1, input2); // Pass through maximum
        }
    }
}
```

### 3. **Multi-Input OR System**
```javascript
// Handle multiple inputs with OR logic
class MultiInputOrComponent extends OrComponent {
    processMultiple(inputs) {
        // Use OR logic for multiple inputs
        return inputs.reduce((result, input) => 
            this.performOrOperation(result, input), 0
        );
    }
}
```

## Logical References

### OR Function Properties
- **Commutative:** a OR b = b OR a
- **Associative:** (a OR b) OR c = a OR (b OR c)
- **Idempotent:** a OR a = a
- **Identity:** a OR 0 = a
- **Domination:** a OR 1 = 1
- **Distributive:** a OR (b AND c) = (a OR b) AND (a OR c)

### Related Operations
- **AND:** a ∧ b = both must be true
- **NOT:** ¬a = signal inversion
- **XOR:** a ⊕ b = exactly one must be true
- **NAND:** NOT(a ∧ b) = NOT AND
- **NOR:** NOT(a ∨ b) = NOT OR

### Special Cases
- **Zero Inputs:** Returns 0 (no output signal)
- **One Active Input:** Returns 1 (output signal)
- **Both Active Inputs:** Returns 1 (output signal)
- **Threshold Boundary:** Uses hysteresis to prevent oscillation
- **Multiple Inputs:** Uses OR logic for signal aggregation

### Hysteresis Considerations
- **Prevents oscillation** in noisy signals
- **Creates switching bands** around threshold
- **Improves stability** in control systems
- **Reduces component wear** from rapid switching

---

*This documentation provides a comprehensive guide to the OR component in Barotrauma's electrical system, including its logical behavior, practical applications, and implementation examples.* 
