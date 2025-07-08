# Barotrauma Memory Component

## Overview

The **Memory Component** is a storage and signal retention component in Barotrauma's electrical system that stores a value and outputs it continuously. It can be updated from external sources and maintains its stored value until explicitly changed. The component acts as a simple memory cell that can hold a signal value and output it persistently.

**Official Description:** "Outputs a stored value that can be updated from other sources. Use the signal_in connection to set the stored value, and the signal_store input to toggle whether the received signals should be stored."

## Component Properties

### Basic Information
- **Identifier:** `memorycomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#a66c6b` (Red-Brown)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal (value to potentially store)
- **`lock_state`** (aliases: `signal_store`) - Control input to toggle storage mode

#### Output Pins
- **`signal_out`** - Output signal (currently stored value)

### Configurable Properties

The MemoryComponent uses a MemoryComponent class, which may support:

- **`DefaultValue`** - Default stored value (default: 0)
- **`StorageMode`** - Storage behavior (continuous, edge-triggered, etc.)
- **`Persistent`** - Whether value persists across resets (default: false)
- **`TimeFrame`** - Time-based processing window (default: 0)

## Mathematical Function

The Memory component performs the storage operation:

```
if (lock_state > 0) {
    stored_value = signal_in
}
output = stored_value
```

Or in mathematical notation:
```
output(t) = {
    signal_in(t), if lock_state(t) > 0
    stored_value(t-1), otherwise
}
```

### Mathematical Properties

1. **Storage Operation:** Conditional value storage based on control signal
2. **Output Persistence:** Output maintains last stored value
3. **Stateful:** Component has internal state (stored value)
4. **Conditional Update:** Only updates when lock_state is active
5. **Memory Retention:** Value persists until explicitly changed

### Behavior Examples

| Time | signal_in | lock_state | stored_value | Output | Notes |
|------|-----------|------------|--------------|--------|-------|
| t=0 | 5 | 0 | 0 | 0 | Initial state |
| t=1 | 5 | 1 | 5 | 5 | Store value |
| t=2 | 10 | 0 | 5 | 5 | Maintain stored value |
| t=3 | 10 | 1 | 10 | 10 | Update stored value |
| t=4 | 15 | 0 | 10 | 10 | Continue outputting stored value |

### Special Cases

1. **No Lock Signal:** Outputs last stored value continuously
2. **Lock Signal Active:** Stores current input value
3. **Negative Lock:** Treats as inactive (no storage)
4. **Missing Inputs:** Treats as 0
5. **Initial State:** Outputs default value (usually 0)

## Signal Aggregation

Like other Barotrauma components, the Memory component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 5 (arrives first)
Wire 2: 10 (arrives second)

// Multiple wires to lock_state
Wire A: 0 (arrives first)
Wire B: 1 (arrives second)

// Result: signal_in = 5, lock_state = 1
// Output = 5 (stored and output)
```

## Real-World Applications

### 1. **State Retention System**
```javascript
// Remember last sensor reading
const currentReading = 23.5; // Current sensor value
const shouldStore = 1; // Store command
const storedValue = 20.0; // Previously stored value

const output = shouldStore > 0 ? currentReading : storedValue; // 23.5
```

### 2. **Configuration Storage**
```javascript
// Store system configuration
const newConfig = 0.8; // New configuration value
const updateConfig = 1; // Update command
const currentConfig = 0.5; // Current configuration

const activeConfig = updateConfig > 0 ? newConfig : currentConfig; // 0.8
```

### 3. **Threshold Memory**
```javascript
// Remember peak values
const currentValue = 85; // Current reading
const isPeak = currentValue > 80; // Peak detection
const lastPeak = 82; // Previously stored peak

const storedPeak = isPeak > 0 ? currentValue : lastPeak; // 85
```

### 4. **Alarm State Memory**
```javascript
// Remember alarm state
const alarmActive = 1; // Current alarm status
const shouldRemember = 1; // Remember command
const lastAlarmState = 0; // Previous alarm state

const rememberedState = shouldRemember > 0 ? alarmActive : lastAlarmState; // 1
```

### 5. **User Preference Storage**
```javascript
// Store user settings
const newSetting = 0.7; // New user preference
const saveSetting = 1; // Save command
const currentSetting = 0.5; // Current setting

const activeSetting = saveSetting > 0 ? newSetting : currentSetting; // 0.7
```

## Integration Examples

### 1. **Advanced State Management**
```javascript
// Multi-state memory system
const states = [0, 1, 2, 3]; // Possible states
const currentState = 2; // Current state
const shouldUpdate = 1; // Update command
const storedState = 1; // Previously stored state

const activeState = shouldUpdate > 0 ? currentState : storedState; // 2
```

### 2. **Conditional Storage**
```javascript
// Store only under certain conditions
const sensorValue = 75; // Sensor reading
const isValid = sensorValue > 0 && sensorValue < 100; // Validation
const shouldStore = isValid ? 1 : 0; // Conditional storage
const lastValidValue = 70; // Last valid value

const storedValue = shouldStore > 0 ? sensorValue : lastValidValue; // 75
```

### 3. **Multi-Memory System**
```javascript
// Multiple memory components working together
const memory1 = { stored: 10, output: 10 };
const memory2 = { stored: 20, output: 20 };
const memory3 = { stored: 30, output: 30 };

// Chain memory updates
const updateChain = 1;
const newValue = 50;

if (updateChain > 0) {
    memory3.stored = memory2.output;
    memory2.stored = memory1.output;
    memory1.stored = newValue;
}
```

## JavaScript Simulation Class

```javascript
class MemoryComponent {
    constructor(config = {}) {
        this.defaultValue = config.defaultValue || 0;
        this.storageMode = config.storageMode || 'continuous'; // 'continuous', 'edge-triggered'
        this.persistent = config.persistent || false;
        this.timeFrame = config.timeFrame || 0;
        
        // Input/output state
        this.signalIn = 0;
        this.lockState = 0;
        this.storedValue = this.defaultValue;
        this.output = this.defaultValue;
        
        // Edge detection for edge-triggered mode
        this.lastLockState = 0;
        this.risingEdge = false;
        this.fallingEdge = false;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Storage history for debugging
        this.storageHistory = [];
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signals and update storage
     * @param {number} signalIn - Input signal value
     * @param {number} lockState - Storage control signal
     * @returns {number} - Current output value
     */
    process(signalIn, lockState) {
        try {
            // Update input signals
            this.signalIn = signalIn;
            this.lockState = lockState;
            
            // Detect edges for edge-triggered mode
            this.detectEdges();
            
            // Update storage based on mode
            this.updateStorage();
            
            // Apply time-based processing if configured
            let result = this.storedValue;
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            // Update output
            this.output = result;
            
            this.lastError = null;
            
            return this.output;
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`MemoryComponent error: ${error.message}`);
            return this.output;
        }
    }
    
    /**
     * Detect rising and falling edges of lock signal
     */
    detectEdges() {
        this.risingEdge = this.lockState > 0 && this.lastLockState <= 0;
        this.fallingEdge = this.lockState <= 0 && this.lastLockState > 0;
        this.lastLockState = this.lockState;
    }
    
    /**
     * Update stored value based on storage mode
     */
    updateStorage() {
        let shouldStore = false;
        
        switch (this.storageMode) {
            case 'continuous':
                // Store whenever lock_state is active
                shouldStore = this.lockState > 0;
                break;
                
            case 'edge-triggered':
                // Store only on rising edge
                shouldStore = this.risingEdge;
                break;
                
            case 'level-sensitive':
                // Store when lock_state is above threshold
                shouldStore = this.lockState > 0.5;
                break;
                
            default:
                shouldStore = this.lockState > 0;
        }
        
        if (shouldStore) {
            const oldValue = this.storedValue;
            this.storedValue = this.signalIn;
            
            // Record storage operation
            this.storageHistory.push({
                timestamp: Date.now(),
                oldValue: oldValue,
                newValue: this.storedValue,
                trigger: this.lockState
            });
            
            // Keep only recent history
            if (this.storageHistory.length > 100) {
                this.storageHistory = this.storageHistory.slice(-50);
            }
        }
    }
    
    /**
     * Apply time-based processing window
     * @param {number} currentValue - Current stored value
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
     * Set stored value directly
     * @param {number} value - Value to store
     */
    setValue(value) {
        this.storedValue = value;
        this.output = value;
    }
    
    /**
     * Get current stored value
     * @returns {number} - Currently stored value
     */
    getValue() {
        return this.storedValue;
    }
    
    /**
     * Clear stored value (reset to default)
     */
    clear() {
        this.storedValue = this.defaultValue;
        this.output = this.defaultValue;
    }
    
    /**
     * Get storage history
     * @returns {Array} - Array of storage operations
     */
    getStorageHistory() {
        return [...this.storageHistory];
    }
    
    /**
     * Reset component state
     */
    reset() {
        if (!this.persistent) {
            this.storedValue = this.defaultValue;
            this.output = this.defaultValue;
        }
        this.signalIn = 0;
        this.lockState = 0;
        this.lastLockState = 0;
        this.risingEdge = false;
        this.fallingEdge = false;
        this.signalHistory = [];
        this.storageHistory = [];
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
            lockState: this.lockState,
            storedValue: this.storedValue,
            output: this.output,
            defaultValue: this.defaultValue,
            storageMode: this.storageMode,
            persistent: this.persistent,
            timeFrame: this.timeFrame,
            risingEdge: this.risingEdge,
            fallingEdge: this.fallingEdge,
            lastError: this.lastError,
            errorCount: this.errorCount,
            signalHistoryLength: this.signalHistory.length,
            storageHistoryLength: this.storageHistory.length
        };
    }
    
    /**
     * Update component configuration
     * @param {object} config - New configuration
     */
    updateConfig(config) {
        if (config.defaultValue !== undefined) {
            this.defaultValue = config.defaultValue;
        }
        if (config.storageMode !== undefined) {
            this.storageMode = config.storageMode;
        }
        if (config.persistent !== undefined) {
            this.persistent = config.persistent;
        }
        if (config.timeFrame !== undefined) {
            this.timeFrame = config.timeFrame;
        }
    }
}

// Usage Examples
class MemoryComponentExamples {
    static basicStorage() {
        const memory = new MemoryComponent();
        
        console.log('Basic Storage Examples:');
        console.log('Initial output:', memory.process(5, 0)); // 0
        console.log('Store value:', memory.process(5, 1)); // 5
        console.log('Maintain value:', memory.process(10, 0)); // 5
        console.log('Update value:', memory.process(10, 1)); // 10
        console.log('Continue output:', memory.process(15, 0)); // 10
    }
    
    static edgeTriggeredMode() {
        const memory = new MemoryComponent({
            storageMode: 'edge-triggered'
        });
        
        console.log('\nEdge-Triggered Examples:');
        console.log('Initial:', memory.process(5, 0)); // 0
        console.log('Rising edge:', memory.process(5, 1)); // 5 (stores on rising edge)
        console.log('High level:', memory.process(10, 1)); // 5 (no new edge)
        console.log('Falling edge:', memory.process(15, 0)); // 5 (no storage)
        console.log('Rising edge again:', memory.process(15, 1)); // 15 (stores on rising edge)
    }
    
    static levelSensitiveMode() {
        const memory = new MemoryComponent({
            storageMode: 'level-sensitive'
        });
        
        console.log('\nLevel-Sensitive Examples:');
        console.log('Low level:', memory.process(5, 0.3)); // 0 (below threshold)
        console.log('High level:', memory.process(5, 0.7)); // 5 (above threshold)
        console.log('Maintain high:', memory.process(10, 0.8)); // 10 (above threshold)
        console.log('Drop to low:', memory.process(15, 0.2)); // 10 (below threshold)
    }
    
    static persistentMode() {
        const memory = new MemoryComponent({
            persistent: true
        });
        
        console.log('\nPersistent Mode Examples:');
        memory.setValue(25);
        console.log('Set value:', memory.getValue()); // 25
        memory.reset();
        console.log('After reset:', memory.getValue()); // 25 (persistent)
    }
    
    static timeFrameExample() {
        const memory = new MemoryComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        memory.setValue(10);
        console.log('Initial value:', memory.process(10, 0)); // 10
        memory.setValue(20);
        console.log('New value:', memory.process(20, 0)); // 15 (average)
        memory.setValue(30);
        console.log('Another value:', memory.process(30, 0)); // 20 (average)
    }
    
    static errorHandling() {
        const memory = new MemoryComponent();
        
        console.log('\nError Handling Examples:');
        
        // Invalid inputs
        try {
            memory.process('not a number', 1);
        } catch (error) {
            console.log('Invalid input handled:', error.message);
        }
        
        // Status
        console.log('Status:', memory.getStatus());
    }
    
    static realWorldExamples() {
        const memory = new MemoryComponent();
        
        console.log('\nReal-World Examples:');
        
        // Sensor reading memory
        const sensorReading = 23.5;
        const shouldStore = 1;
        const storedReading = memory.process(sensorReading, shouldStore);
        console.log(`Stored sensor reading: ${storedReading}°C`);
        
        // Configuration storage
        const newConfig = 0.8;
        const updateConfig = 1;
        const activeConfig = memory.process(newConfig, updateConfig);
        console.log(`Active configuration: ${activeConfig}`);
        
        // Alarm state memory
        const alarmActive = 1;
        const rememberAlarm = 1;
        const alarmState = memory.process(alarmActive, rememberAlarm);
        console.log(`Remembered alarm state: ${alarmState ? 'Active' : 'Inactive'}`);
    }
    
    static advancedExamples() {
        const memory = new MemoryComponent();
        
        console.log('\nAdvanced Examples:');
        
        // Multi-value storage
        const values = [10, 20, 30, 40, 50];
        const storeCommands = [1, 0, 1, 0, 1];
        
        for (let i = 0; i < values.length; i++) {
            const output = memory.process(values[i], storeCommands[i]);
            console.log(`Step ${i}: Input=${values[i]}, Store=${storeCommands[i]}, Output=${output}`);
        }
        
        // Storage history
        const history = memory.getStorageHistory();
        console.log('Storage history:', history);
        
        // Channel info
        const status = memory.getStatus();
        console.log('Component status:', status);
    }
}

// Run examples
MemoryComponentExamples.basicStorage();
MemoryComponentExamples.edgeTriggeredMode();
MemoryComponentExamples.levelSensitiveMode();
MemoryComponentExamples.persistentMode();
MemoryComponentExamples.timeFrameExample();
MemoryComponentExamples.errorHandling();
MemoryComponentExamples.realWorldExamples();
MemoryComponentExamples.advancedExamples();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Types**
   - **Cause:** Non-numeric inputs
   - **Handling:** Throw error and maintain last valid output
   - **Prevention:** Use type validation components

2. **Storage Overflow**
   - **Cause:** Too many storage operations
   - **Handling:** Limit history size and continue operation
   - **Prevention:** Configure appropriate history limits

3. **Missing Inputs**
   - **Cause:** Unconnected input pins
   - **Handling:** Treat as 0
   - **Prevention:** Ensure all inputs are connected

### Error Recovery Strategies

```javascript
// Example error recovery system
class MemoryComponentWithRecovery extends MemoryComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
        this.lastValidStoredValue = 0;
    }
    
    process(signalIn, lockState) {
        try {
            const result = super.process(signalIn, lockState);
            this.recoveryMode = false;
            this.lastValidOutput = result;
            this.lastValidStoredValue = this.storedValue;
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
- **Time Complexity:** O(1) for basic storage operation
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Scales with history size and time frame

### Optimization Tips

1. **Use Appropriate Storage Mode**
   ```javascript
   // Good: Use edge-triggered for precise control
   const memory = new MemoryComponent({
       storageMode: 'edge-triggered'
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const memory = new MemoryComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Configure History Limits**
   ```javascript
   // Limit storage history to prevent memory issues
   const memory = new MemoryComponent({
       // History limits are handled internally
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Output Values**
   - **Cause:** Wrong storage mode or timing issues
   - **Solution:** Check storage mode and control signals

2. **Output Not Updating**
   - **Cause:** Lock signal not active or edge-triggered timing
   - **Solution:** Verify lock signal and storage mode

3. **Value Not Persisting**
   - **Cause:** Persistent mode disabled or reset called
   - **Solution:** Check persistent configuration and reset calls

4. **Performance Issues**
   - **Cause:** Large time frame windows or excessive history
   - **Solution:** Optimize time frame size and history limits

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugMemoryComponent extends MemoryComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(signalIn, lockState) {
        if (this.debugMode) {
            console.log(`MemoryComponent: Input=${signalIn}, Lock=${lockState}, Stored=${this.storedValue}`);
        }
        
        const result = super.process(signalIn, lockState);
        
        if (this.debugMode) {
            this.operationLog.push({
                signalIn: signalIn,
                lockState: lockState,
                storedValue: this.storedValue,
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

### Memory vs Other Storage Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Memory** | Conditional storage | 2 | Value retention, state storage |
| **Delay** | Time-based delay | 1 | Signal timing, synchronization |
| **Buffer** | Signal buffering | 1 | Signal conditioning |
| **Register** | Multi-bit storage | Multiple | Data storage |

### When to Use Memory Component

**Use Memory when you need:**
- Conditional value storage
- State retention across time
- Configuration storage
- Peak value memory
- Alarm state memory
- User preference storage

**Consider alternatives when:**
- Simple signal delay is needed (use Delay)
- Signal buffering is needed (use Buffer)
- Multi-bit storage is needed (use Register)

## Advanced Usage Patterns

### 1. **Cascading Memory**
```javascript
// Multiple memory components in series
const memory1 = new MemoryComponent();
const memory2 = new MemoryComponent();

memory1.setValue(10);
memory2.setValue(memory1.getValue());
console.log('Cascaded value:', memory2.getValue()); // 10
```

### 2. **Conditional Memory**
```javascript
// Memory with conditional logic
class ConditionalMemoryComponent extends MemoryComponent {
    process(signalIn, lockState, condition) {
        if (condition) {
            return super.process(signalIn, lockState);
        } else {
            return this.getValue(); // Always return stored value
        }
    }
}
```

### 3. **Multi-Value Memory**
```javascript
// Memory with multiple storage locations
class MultiMemoryComponent extends MemoryComponent {
    constructor(config) {
        super(config);
        this.memorySlots = new Map();
    }
    
    setSlotValue(slot, value) {
        this.memorySlots.set(slot, value);
    }
    
    getSlotValue(slot) {
        return this.memorySlots.get(slot) || 0;
    }
}
```

## Mathematical References

### Storage Function Properties
- **Definition:** f(input, lock) = { input, if lock > 0; stored_value, otherwise }
- **Range:** Same as input signal range
- **Stateful:** Component maintains internal state
- **Conditional:** Update only when lock signal is active
- **Persistent:** Value maintains until explicitly changed

### Related Operations
- **Delay:** Time-based signal delay
- **Buffer:** Signal buffering and conditioning
- **Register:** Multi-bit data storage
- **Latch:** Level-sensitive storage element

### Special Cases
- **No Lock Signal:** Outputs last stored value continuously
- **Active Lock:** Stores current input value
- **Negative Lock:** Treats as inactive (no storage)
- **Missing Inputs:** Treats as 0
- **Initial State:** Outputs default value

### Precision Considerations
- **Input values** maintain their original precision
- **Time-based processing** may affect signal accuracy
- **Storage operations** preserve exact values
- **History management** may limit precision over time

---

*This documentation provides a comprehensive guide to the Memory component in Barotrauma's electrical system, including its storage behavior, practical applications, and implementation examples.* 
