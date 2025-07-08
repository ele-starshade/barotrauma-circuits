# Barotrauma Input Selector (Multiplexer) Component

## Overview

The **Input Selector Component** (also known as **Multiplexer Component**) is a signal routing component in Barotrauma's electrical system that selects one input from multiple available inputs and forwards it to the output. It acts as a digital switch that can dynamically choose which input signal to pass through based on control signals.

**Official Description:** "A multiplexer, or mux, component. The input data can be forwarded from one selected input out of multiple input connections."

## Component Properties

### Basic Information
- **Identifier:** `multiplexercomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#e44c43` (Red)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in0`** through **`signal_in9`** - Ten input signals (channels 0-9)
- **`set_input`** - Control input to set the selected channel directly
- **`move_input`** - Control input to increment/decrement the selected channel

#### Output Pins
- **`signal_out`** - Output signal (selected input channel value)
- **`selected_input_out`** - Output indicating which input channel is currently selected

### Configurable Properties

The MultiplexerComponent uses a MultiplexerComponent class, which may support:

- **`DefaultChannel`** - Default selected channel (default: 0)
- **`ChannelCount`** - Number of available channels (default: 10)
- **`WrapAround`** - Whether to wrap around when moving past channel limits (default: true)
- **`TimeFrame`** - Time-based processing window (default: 0)

## Mathematical Function

The Input Selector component performs the selection operation:

```
output = signal_in[selected_channel]
```

Or in mathematical notation:
```
output = {
    signal_in0, if selected_channel = 0
    signal_in1, if selected_channel = 1
    signal_in2, if selected_channel = 2
    ...
    signal_in9, if selected_channel = 9
}
```

### Mathematical Properties

1. **Selection Operation:** Single input selection from multiple sources
2. **Output Range:** Same as input signal range
3. **Commutativity:** Not applicable (single selection)
4. **Associativity:** Not applicable (single selection)
5. **Identity:** Output equals selected input

### Behavior Examples

| Selected Channel | signal_in0 | signal_in1 | signal_in2 | Output | Notes |
|------------------|------------|------------|------------|--------|-------|
| 0 | 5 | 10 | 15 | 5 | Selects channel 0 |
| 1 | 5 | 10 | 15 | 10 | Selects channel 1 |
| 2 | 5 | 10 | 15 | 15 | Selects channel 2 |
| 1 | 0 | 25 | 0 | 25 | Selects channel 1 |
| 0 | 100 | 50 | 75 | 100 | Selects channel 0 |

### Special Cases

1. **Invalid Channel:** Returns 0 or last valid channel
2. **Missing Inputs:** Treats missing inputs as 0
3. **Channel Overflow:** Wraps around or clamps to valid range
4. **Negative Channels:** Clamps to 0
5. **Non-Numeric Channels:** Treats as 0

## Signal Aggregation

Like other Barotrauma components, the Input Selector follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in0
Wire 1: 5 (arrives first)
Wire 2: 8 (arrives second)

// Multiple wires to set_input
Wire A: 1 (arrives first)
Wire B: 2 (arrives second)

// Result: signal_in0 = 5, selected_channel = 1
// Output = signal_in1 (from selected channel)
```

## Real-World Applications

### 1. **Sensor Selection System**
```javascript
// Select between multiple temperature sensors
const sensor0 = 23.5; // Engine room
const sensor1 = 25.8; // Reactor room
const sensor2 = 22.1; // Bridge
const selectedSensor = 1; // Choose reactor room

const temperature = [sensor0, sensor1, sensor2][selectedSensor]; // 25.8
```

### 2. **Audio Source Selection**
```javascript
// Select between different audio sources
const mic1 = 0.8; // Microphone 1
const mic2 = 0.6; // Microphone 2
const radio = 0.9; // Radio input
const selectedSource = 2; // Choose radio

const audioLevel = [mic1, mic2, radio][selectedSource]; // 0.9
```

### 3. **Power Source Selection**
```javascript
// Select between different power sources
const battery1 = 12.5; // Battery 1
const battery2 = 11.8; // Battery 2
const generator = 13.2; // Generator
const selectedSource = 2; // Choose generator

const voltage = [battery1, battery2, generator][selectedSource]; // 13.2
```

### 4. **Camera Feed Selection**
```javascript
// Select between multiple camera feeds
const camera1 = 1; // Forward camera
const camera2 = 1; // Aft camera
const camera3 = 0; // Port camera
const selectedCamera = 0; // Choose forward camera

const cameraActive = [camera1, camera2, camera3][selectedCamera]; // 1
```

### 5. **Alarm System Selection**
```javascript
// Select between different alarm types
const fireAlarm = 0; // Fire alarm status
const hullBreach = 1; // Hull breach status
const oxygenLow = 0; // Oxygen level status
const selectedAlarm = 1; // Choose hull breach

const alarmActive = [fireAlarm, hullBreach, oxygenLow][selectedAlarm]; // 1
```

## Integration Examples

### 1. **Advanced Sensor Network**
```javascript
// Multi-sensor monitoring system
const sensors = [23.5, 25.8, 22.1, 24.3, 26.7]; // 5 sensors
const currentChannel = 2; // Monitor sensor 2

const reading = sensors[currentChannel]; // 22.1
const isReadingValid = reading > 0; // true
```

### 2. **Dynamic Source Switching**
```javascript
// Automatic source switching based on priority
const sources = [12.5, 11.8, 13.2, 12.8]; // Power sources
const priorities = [1, 2, 0, 3]; // Priority levels

// Find highest priority source
const highestPriority = Math.max(...priorities);
const selectedSource = priorities.indexOf(highestPriority);
const selectedVoltage = sources[selectedSource]; // 12.8
```

### 3. **Conditional Channel Selection**
```javascript
// Select channel based on conditions
const channels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const emergencyMode = true;
const selectedChannel = emergencyMode ? 0 : 2; // Emergency uses channel 0

const output = channels[selectedChannel]; // 0 (emergency mode)
```

## JavaScript Simulation Class

```javascript
class InputSelectorComponent {
    constructor(config = {}) {
        this.defaultChannel = config.defaultChannel || 0;
        this.channelCount = config.channelCount || 10;
        this.wrapAround = config.wrapAround !== undefined ? config.wrapAround : true;
        this.timeFrame = config.timeFrame || 0;
        
        // Input/output state
        this.inputs = new Array(this.channelCount).fill(0);
        this.selectedChannel = this.defaultChannel;
        this.setInput = 0;
        this.moveInput = 0;
        this.output = 0;
        this.selectedInputOut = this.selectedChannel;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Channel selection history
        this.channelHistory = [];
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signals and select output
     * @param {Array} inputs - Array of input signals
     * @param {number} setInput - Direct channel selection (optional)
     * @param {number} moveInput - Channel increment/decrement (optional)
     * @returns {object} - Output object with signal and selected channel
     */
    process(inputs, setInput = null, moveInput = null) {
        try {
            // Update input signals
            this.updateInputs(inputs);
            
            if (setInput !== null) {
                this.setInput = setInput;
            }
            
            if (moveInput !== null) {
                this.moveInput = moveInput;
            }
            
            // Update selected channel
            this.updateSelectedChannel();
            
            // Get output from selected channel
            let result = this.getSelectedOutput();
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            // Update outputs
            this.output = result;
            this.selectedInputOut = this.selectedChannel;
            
            this.lastError = null;
            
            return {
                signalOut: this.output,
                selectedInputOut: this.selectedInputOut
            };
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`InputSelectorComponent error: ${error.message}`);
            return {
                signalOut: 0,
                selectedInputOut: this.selectedChannel
            };
        }
    }
    
    /**
     * Update input signal array
     * @param {Array} inputs - Array of input signals
     */
    updateInputs(inputs) {
        if (!Array.isArray(inputs)) {
            throw new Error('Inputs must be an array');
        }
        
        // Copy input values, pad with zeros if needed
        for (let i = 0; i < this.channelCount; i++) {
            this.inputs[i] = inputs[i] || 0;
        }
    }
    
    /**
     * Update selected channel based on control inputs
     */
    updateSelectedChannel() {
        // Handle direct channel selection
        if (this.setInput !== 0) {
            this.selectedChannel = this.validateChannel(this.setInput);
        }
        
        // Handle channel movement
        if (this.moveInput !== 0) {
            const newChannel = this.selectedChannel + this.moveInput;
            this.selectedChannel = this.validateChannel(newChannel);
        }
        
        // Record channel selection
        this.channelHistory.push({
            channel: this.selectedChannel,
            timestamp: Date.now()
        });
        
        // Keep only recent history
        if (this.channelHistory.length > 100) {
            this.channelHistory = this.channelHistory.slice(-50);
        }
    }
    
    /**
     * Validate and adjust channel number
     * @param {number} channel - Channel number to validate
     * @returns {number} - Valid channel number
     */
    validateChannel(channel) {
        // Ensure channel is a number
        if (typeof channel !== 'number' || isNaN(channel)) {
            return 0;
        }
        
        // Handle wrap-around
        if (this.wrapAround) {
            // Wrap around for both positive and negative values
            while (channel < 0) {
                channel += this.channelCount;
            }
            while (channel >= this.channelCount) {
                channel -= this.channelCount;
            }
        } else {
            // Clamp to valid range
            channel = Math.max(0, Math.min(channel, this.channelCount - 1));
        }
        
        return Math.floor(channel);
    }
    
    /**
     * Get output from selected channel
     * @returns {number} - Selected channel value
     */
    getSelectedOutput() {
        const channel = this.validateChannel(this.selectedChannel);
        return this.inputs[channel] || 0;
    }
    
    /**
     * Apply time-based processing window
     * @param {number} currentValue - Current selected value
     * @returns {number} - Time-averaged result
     */
    applyTimeFrame(currentValue) {
        const currentTime = Date.now();
        
        // Add current value to history with timestamp
        this.signalHistory.push({
            value: currentValue,
            channel: this.selectedChannel,
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
     * Set channel directly
     * @param {number} channel - Channel to select
     */
    setChannel(channel) {
        this.selectedChannel = this.validateChannel(channel);
    }
    
    /**
     * Move to next channel
     */
    nextChannel() {
        this.selectedChannel = this.validateChannel(this.selectedChannel + 1);
    }
    
    /**
     * Move to previous channel
     */
    previousChannel() {
        this.selectedChannel = this.validateChannel(this.selectedChannel - 1);
    }
    
    /**
     * Get current channel information
     * @returns {object} - Channel information
     */
    getChannelInfo() {
        return {
            currentChannel: this.selectedChannel,
            totalChannels: this.channelCount,
            currentValue: this.getSelectedOutput(),
            allValues: [...this.inputs]
        };
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.inputs = new Array(this.channelCount).fill(0);
        this.selectedChannel = this.defaultChannel;
        this.setInput = 0;
        this.moveInput = 0;
        this.output = 0;
        this.selectedInputOut = this.selectedChannel;
        this.signalHistory = [];
        this.channelHistory = [];
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
            inputs: [...this.inputs],
            selectedChannel: this.selectedChannel,
            setInput: this.setInput,
            moveInput: this.moveInput,
            output: this.output,
            selectedInputOut: this.selectedInputOut,
            defaultChannel: this.defaultChannel,
            channelCount: this.channelCount,
            wrapAround: this.wrapAround,
            timeFrame: this.timeFrame,
            lastError: this.lastError,
            errorCount: this.errorCount,
            signalHistoryLength: this.signalHistory.length,
            channelHistoryLength: this.channelHistory.length
        };
    }
    
    /**
     * Update component configuration
     * @param {object} config - New configuration
     */
    updateConfig(config) {
        if (config.defaultChannel !== undefined) {
            this.defaultChannel = config.defaultChannel;
        }
        if (config.channelCount !== undefined) {
            this.channelCount = config.channelCount;
            // Resize inputs array
            this.inputs = new Array(this.channelCount).fill(0);
        }
        if (config.wrapAround !== undefined) {
            this.wrapAround = config.wrapAround;
        }
        if (config.timeFrame !== undefined) {
            this.timeFrame = config.timeFrame;
        }
    }
}

// Usage Examples
class InputSelectorExamples {
    static basicSelection() {
        const selector = new InputSelectorComponent();
        
        const inputs = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
        
        console.log('Basic Selection Examples:');
        console.log('Channel 0:', selector.process(inputs).signalOut); // 5
        selector.setChannel(2);
        console.log('Channel 2:', selector.process(inputs).signalOut); // 15
        selector.setChannel(5);
        console.log('Channel 5:', selector.process(inputs).signalOut); // 30
    }
    
    static channelMovement() {
        const selector = new InputSelectorComponent();
        
        const inputs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        console.log('\nChannel Movement Examples:');
        console.log('Initial channel:', selector.getChannelInfo().currentChannel); // 0
        selector.nextChannel();
        console.log('Next channel:', selector.getChannelInfo().currentChannel); // 1
        selector.nextChannel();
        console.log('Next channel:', selector.getChannelInfo().currentChannel); // 2
        selector.previousChannel();
        console.log('Previous channel:', selector.getChannelInfo().currentChannel); // 1
    }
    
    static wrapAroundExample() {
        const selector = new InputSelectorComponent({
            wrapAround: true
        });
        
        const inputs = [10, 20, 30, 40, 50];
        
        console.log('\nWrap Around Examples:');
        selector.setChannel(4);
        console.log('Channel 4:', selector.process(inputs).signalOut); // 50
        selector.nextChannel();
        console.log('Next (wrapped):', selector.process(inputs).signalOut); // 10
        selector.setChannel(-1);
        console.log('Channel -1 (wrapped):', selector.process(inputs).signalOut); // 50
    }
    
    static noWrapAroundExample() {
        const selector = new InputSelectorComponent({
            wrapAround: false
        });
        
        const inputs = [10, 20, 30, 40, 50];
        
        console.log('\nNo Wrap Around Examples:');
        selector.setChannel(4);
        console.log('Channel 4:', selector.process(inputs).signalOut); // 50
        selector.nextChannel();
        console.log('Next (clamped):', selector.process(inputs).signalOut); // 50
        selector.setChannel(-1);
        console.log('Channel -1 (clamped):', selector.process(inputs).signalOut); // 10
    }
    
    static errorHandling() {
        const selector = new InputSelectorComponent();
        
        console.log('\nError Handling Examples:');
        
        // Invalid inputs
        try {
            selector.process('not an array');
        } catch (error) {
            console.log('Invalid inputs handled:', error.message);
        }
        
        // Invalid channel
        selector.setChannel(NaN);
        console.log('NaN channel handled:', selector.getChannelInfo().currentChannel); // 0
        
        // Status
        console.log('Status:', selector.getStatus());
    }
    
    static realWorldExamples() {
        const selector = new InputSelectorComponent();
        
        console.log('\nReal-World Examples:');
        
        // Sensor selection
        const temperatureSensors = [23.5, 25.8, 22.1, 24.3, 26.7];
        selector.setChannel(1);
        const reactorTemp = selector.process(temperatureSensors).signalOut;
        console.log(`Reactor temperature: ${reactorTemp}°C`);
        
        // Audio source selection
        const audioSources = [0.8, 0.6, 0.9, 0.7, 0.5];
        selector.setChannel(2);
        const radioLevel = selector.process(audioSources).signalOut;
        console.log(`Radio audio level: ${radioLevel}`);
        
        // Power source selection
        const powerSources = [12.5, 11.8, 13.2, 12.8, 12.0];
        selector.setChannel(2);
        const generatorVoltage = selector.process(powerSources).signalOut;
        console.log(`Generator voltage: ${generatorVoltage}V`);
    }
    
    static advancedExamples() {
        const selector = new InputSelectorComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nAdvanced Examples:');
        
        // Multi-sensor monitoring
        const sensors = [23.5, 25.8, 22.1, 24.3, 26.7, 21.9, 27.1, 23.8, 25.2, 24.7];
        
        // Cycle through sensors
        for (let i = 0; i < 5; i++) {
            selector.setChannel(i);
            const result = selector.process(sensors);
            console.log(`Sensor ${i}: ${result.signalOut}°C`);
        }
        
        // Channel info
        const info = selector.getChannelInfo();
        console.log('Channel info:', info);
    }
}

// Run examples
InputSelectorExamples.basicSelection();
InputSelectorExamples.channelMovement();
InputSelectorExamples.wrapAroundExample();
InputSelectorExamples.noWrapAroundExample();
InputSelectorExamples.errorHandling();
InputSelectorExamples.realWorldExamples();
InputSelectorExamples.advancedExamples();
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Array**
   - **Cause:** Non-array inputs
   - **Handling:** Throw error and return default values
   - **Prevention:** Validate input format

2. **Invalid Channel Numbers**
   - **Cause:** NaN, negative, or out-of-range channels
   - **Handling:** Clamp or wrap to valid range
   - **Prevention:** Validate channel values

3. **Missing Input Signals**
   - **Cause:** Unconnected input pins
   - **Handling:** Treat as 0
   - **Prevention:** Ensure all inputs are connected

### Error Recovery Strategies

```javascript
// Example error recovery system
class InputSelectorWithRecovery extends InputSelectorComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 0;
        this.lastValidChannel = 0;
    }
    
    process(inputs, setInput = null, moveInput = null) {
        try {
            const result = super.process(inputs, setInput, moveInput);
            this.recoveryMode = false;
            this.lastValidOutput = result.signalOut;
            this.lastValidChannel = result.selectedInputOut;
            return result;
        } catch (error) {
            this.recoveryMode = true;
            console.warn(`Using last valid output: ${this.lastValidOutput}`);
            return {
                signalOut: this.lastValidOutput,
                selectedInputOut: this.lastValidChannel
            };
        }
    }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(1) for basic selection
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Scales with channel count and time frame

### Optimization Tips

1. **Use Appropriate Channel Count**
   ```javascript
   // Good: Use only needed channels
   const selector = new InputSelectorComponent({
       channelCount: 5 // Only 5 channels needed
   });
   ```

2. **Minimize Time Frame Usage**
   ```javascript
   // Only use time frame when needed for smoothing
   const selector = new InputSelectorComponent({
       timeFrame: 0 // Disable if not needed
   });
   ```

3. **Choose Appropriate Wrap Behavior**
   ```javascript
   // Use wrap-around for circular selection
   const selector = new InputSelectorComponent({
       wrapAround: true // For cycling through options
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Output Values**
   - **Cause:** Wrong channel selected or invalid inputs
   - **Solution:** Check channel selection and input values

2. **Output Not Updating**
   - **Cause:** Channel not changing or time frame delays
   - **Solution:** Verify channel control signals and time frame settings

3. **Channel Selection Issues**
   - **Cause:** Invalid channel numbers or wrap-around settings
   - **Solution:** Check channel validation and wrap-around configuration

4. **Performance Issues**
   - **Cause:** Large time frame windows or many channels
   - **Solution:** Optimize time frame size and channel count

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugInputSelectorComponent extends InputSelectorComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(inputs, setInput = null, moveInput = null) {
        if (this.debugMode) {
            console.log(`InputSelector: Channel ${this.selectedChannel}, Inputs:`, inputs);
        }
        
        const result = super.process(inputs, setInput, moveInput);
        
        if (this.debugMode) {
            this.operationLog.push({
                inputs: [...inputs],
                selectedChannel: this.selectedChannel,
                output: result.signalOut,
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

### Input Selector vs Other Selection Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Input Selector** | Select one from many | 10+ inputs | Signal routing, source selection |
| **Output Selector** | Route one to many | 1 input, 10+ outputs | Signal distribution |
| **Relay** | Simple on/off routing | 1 input, 1 output | Basic signal switching |
| **Switch** | Manual selection | Multiple inputs | User-controlled selection |

### When to Use Input Selector Component

**Use Input Selector when you need:**
- Dynamic signal routing between multiple sources
- Sensor selection systems
- Audio/video source switching
- Power source selection
- Camera feed selection
- Alarm system routing

**Consider alternatives when:**
- Simple on/off switching is needed (use Relay)
- Manual control is required (use Switch)
- Signal distribution is needed (use Output Selector)

## Advanced Usage Patterns

### 1. **Cascading Selectors**
```javascript
// Multiple selectors in series
const selector1 = new InputSelectorComponent();
const selector2 = new InputSelectorComponent();

const inputs = [1, 2, 3, 4, 5];
selector1.setChannel(2);
const result1 = selector1.process(inputs).signalOut; // 3
selector2.setChannel(0);
const result2 = selector2.process([result1]).signalOut; // 3
```

### 2. **Conditional Selection**
```javascript
// Select channel based on conditions
class ConditionalInputSelector extends InputSelectorComponent {
    process(inputs, condition) {
        if (condition) {
            return super.process(inputs);
        } else {
            return { signalOut: 0, selectedInputOut: 0 };
        }
    }
}
```

### 3. **Multi-Level Selection**
```javascript
// Hierarchical selection system
class MultiLevelSelector extends InputSelectorComponent {
    constructor(config) {
        super(config);
        this.subSelectors = [];
    }
    
    addSubSelector(selector) {
        this.subSelectors.push(selector);
    }
    
    processHierarchical(inputs) {
        const mainResult = this.process(inputs);
        const subResults = this.subSelectors.map(selector => 
            selector.process(inputs)
        );
        return { main: mainResult, sub: subResults };
    }
}
```

## Mathematical References

### Selection Function Properties
- **Definition:** f(inputs, channel) = inputs[channel]
- **Range:** Same as input signal range
- **Commutativity:** Not applicable (single selection)
- **Associativity:** Not applicable (single selection)
- **Identity:** f(inputs, 0) = inputs[0]

### Related Operations
- **Output Selection:** Route one input to multiple outputs
- **Signal Routing:** Direct signals between components
- **Channel Switching:** Change active channel
- **Signal Distribution:** Split one signal to multiple destinations

### Special Cases
- **Empty Inputs:** Returns 0 for all channels
- **Invalid Channels:** Clamps or wraps to valid range
- **Missing Inputs:** Treats as 0
- **Channel Overflow:** Handles based on wrap-around setting

### Precision Considerations
- **Channel numbers** are converted to integers
- **Input values** maintain their original precision
- **Time-based processing** may affect signal accuracy
- **Wrap-around arithmetic** uses modulo operations

---

*This documentation provides a comprehensive guide to the Input Selector (Multiplexer) component in Barotrauma's electrical system, including its selection behavior, practical applications, and implementation examples.* 
