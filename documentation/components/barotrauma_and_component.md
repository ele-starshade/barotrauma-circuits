# Barotrauma And Component

## Overview

The **And Component** is a logical signal processing component in Barotrauma's electrical system. It implements the logical AND operation, sending a signal only when both inputs receive a signal within a set period of each other. This component is essential for creating conditional logic, safety systems, and coordinated activation sequences in automated systems.

## Component Definition

### Basic Information
- **Identifier**: `andcomponent`
- **Category**: Electrical
- **Function**: `AndComponent`
- **Component Color**: `#6c7dd5` (Blue-Purple)
- **Sprite**: `signalcomp.png` at position `0,0,32,32`

### Physical Properties
- **Size**: 31x25 pixels
- **Density**: 15
- **Scale**: 0.5
- **Max Stack Size**: 32 (inventory), 8 (character inventory)
- **Container**: Metal Crate
- **Fabrication**: Requires 1 FPGA Circuit, 10 seconds
- **Deconstruction**: Yields 1 FPGA Circuit, 10 seconds

## Input/Output Configuration

### Connection Panel
```
Input:  signal_in1 (Signal Input 1)
Input:  signal_in2 (Signal Input 2)
Input:  set_output (Set Output)
Output: signal_out (Signal Output)
```

### Pin Details
- **Input Pin 1**: `signal_in1`
  - **Display Name**: "Signal In 1"
  - **Purpose**: Receives the first signal for AND logic
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Input Pin 2**: `signal_in2`
  - **Display Name**: "Signal In 2"
  - **Purpose**: Receives the second signal for AND logic
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Input Pin 3**: `set_output`
  - **Display Name**: "Set Output"
  - **Purpose**: Forces the output to a specific value
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Output Pin**: `signal_out`
  - **Display Name**: "Signal Out"
  - **Purpose**: Outputs the result of the AND operation
  - **Signal Type**: Boolean/Logic

## Logical Function

### AND Operation
The And component implements the logical AND function with time-based coordination:

```javascript
function logicalAnd(input1, input2, setOutput, timeframe = 0) {
    /**
     * Returns true only when both inputs are active within the timeframe
     * 
     * @param {string|number|boolean} input1 - First input signal
     * @param {string|number|boolean} input2 - Second input signal
     * @param {string|number|boolean} setOutput - Force output value
     * @param {number} timeframe - Time window for signal coordination (seconds)
     * @returns {string|number|boolean|null} The result of the AND operation
     */
    
    // Handle set_output override
    if (setOutput !== null && setOutput !== undefined && setOutput !== "") {
        return setOutput;
    }
    
    // Check if inputs are active (non-null, non-empty, non-zero)
    const input1Active = isSignalActive(input1);
    const input2Active = isSignalActive(input2);
    
    // Both inputs must be active for AND logic
    return input1Active && input2Active;
}

function isSignalActive(signal) {
    /**
     * Determines if a signal is considered "active"
     * 
     * @param {string|number|boolean} signal - The signal to check
     * @returns {boolean} True if signal is active
     */
    if (signal === null || signal === undefined || signal === "") {
        return false;
    }
    
    // Convert to string for consistent checking
    const signalStr = String(signal).toLowerCase();
    
    // Check for common "false" values
    if (signalStr === "false" || signalStr === "0" || signalStr === "no" || signalStr === "off") {
        return false;
    }
    
    // Check for common "true" values
    if (signalStr === "true" || signalStr === "1" || signalStr === "yes" || signalStr === "on") {
        return true;
    }
    
    // For numeric values, check if non-zero
    const numValue = Number(signal);
    if (!isNaN(numValue)) {
        return numValue !== 0;
    }
    
    // For other values, consider non-empty strings as active
    return signalStr.length > 0;
}
```

### Behavior Examples

| Input 1 | Input 2 | Set Output | Output | Explanation |
|---------|---------|------------|--------|-------------|
| `"1"`   | `"1"`   | `null`     | `"1"`  | Both active = true |
| `"true"`| `"true"`| `null`     | `"true"` | Both active = true |
| `"1"`   | `"0"`   | `null`     | `"0"`  | One inactive = false |
| `"0"`   | `"1"`   | `null`     | `"0"`  | One inactive = false |
| `"0"`   | `"0"`   | `null`     | `"0"`  | Both inactive = false |
| `""`    | `"1"`   | `null`     | `"0"`  | One empty = false |
| `"1"`   | `""`    | `null`     | `"0"`  | One empty = false |
| `""`    | `""`    | `null`     | `"0"`  | Both empty = false |
| `"1"`   | `"1"`   | `"0"`      | `"0"`  | Set output overrides |
| `"0"`   | `"0"`   | `"1"`      | `"1"`  | Set output overrides |

## Signal Processing

### Input Signal Aggregation
When multiple wires are connected to the same input pin, the component follows Barotrauma's standard signal aggregation rules:

1. **OR Logic**: Any active wire provides a signal
2. **First Signal Priority**: When multiple signals exist, the first one is processed
3. **Signal Persistence**: Signals remain until explicitly changed

### Processing Algorithm
```javascript
function processAndComponent(inputSignals1, inputSignals2, setOutputSignals, timeframe = 0) {
    /**
     * Process input signals for And component
     * 
     * @param {Array} inputSignals1 - List of signals from signal_in1 wires
     * @param {Array} inputSignals2 - List of signals from signal_in2 wires
     * @param {Array} setOutputSignals - List of signals from set_output wires
     * @param {number} timeframe - Time window for coordination
     * @returns {string|number|boolean|null} The result of the AND operation
     */
    // Aggregate input signals (first signal wins for each input)
    const input1 = aggregateSignals(inputSignals1);
    const input2 = aggregateSignals(inputSignals2);
    const setOutput = aggregateSignals(setOutputSignals);
    
    // Apply logical AND function
    return logicalAnd(input1, input2, setOutput, timeframe);
}
```

## Advanced Features

### Configurable Properties
The And component supports one configurable property:

#### Timeframe
- **Property**: `timeframe`
- **Purpose**: Sets the time window for signal coordination
- **Default**: 0 (immediate coordination)
- **Usage**: Allows signals to be considered "simultaneous" within a time window

### Time-Based Coordination
```javascript
class TimeBasedAndLogic {
    constructor(timeframe = 0) {
        this.timeframe = timeframe;
        this.signalHistory = {
            input1: [],
            input2: []
        };
        this.lastUpdateTime = 0;
    }
    
    processSignals(input1, input2, currentTime) {
        /**
         * Process signals with time-based coordination
         * 
         * @param {string|number|boolean} input1 - First input signal
         * @param {string|number|boolean} input2 - Second input signal
         * @param {number} currentTime - Current simulation time
         * @returns {boolean} Result of time-based AND operation
         */
        
        // Update signal history
        if (isSignalActive(input1)) {
            this.signalHistory.input1.push(currentTime);
        }
        if (isSignalActive(input2)) {
            this.signalHistory.input2.push(currentTime);
        }
        
        // Clean old signals outside timeframe
        const cutoffTime = currentTime - this.timeframe;
        this.signalHistory.input1 = this.signalHistory.input1.filter(time => time >= cutoffTime);
        this.signalHistory.input2 = this.signalHistory.input2.filter(time => time >= cutoffTime);
        
        // Check if both inputs have recent signals
        const hasRecentInput1 = this.signalHistory.input1.length > 0;
        const hasRecentInput2 = this.signalHistory.input2.length > 0;
        
        return hasRecentInput1 && hasRecentInput2;
    }
}
```

## Real-World Applications

### Use Case 1: Safety Systems
```
Pressure Sensor → And Component → Emergency Shutdown
Temperature Sensor ↗
```
Only shutting down systems when both pressure AND temperature are critical.

### Use Case 2: Access Control
```
Key Card Reader → And Component → Door Unlock
Security Code Input ↗
```
Requiring both authentication methods for access.

### Use Case 3: Equipment Coordination
```
Engine Status → And Component → Fuel Pump Activation
Coolant Flow ↗
```
Only activating fuel pump when both engine is ready AND coolant is flowing.

### Use Case 4: Alarm Systems
```
Motion Detector → And Component → Intruder Alarm
Door Sensor ↗
```
Triggering alarms only when both motion is detected AND door is opened.

## Integration with Other Components

### Common Combinations

#### 1. And + Not (NAND)
```
Input A → And Component → Not Component → NAND Output
Input B ↗
```
Creating NAND logic for more complex circuits.

#### 2. And + Or (Complex Logic)
```
Sensor A → And Component → Or Component → Final Output
Sensor B ↗        ↗
Sensor C → And Component ↗
Sensor D ↗
```
Creating complex logical conditions.

#### 3. And + Memory (State Machine)
```
Current State → And Component → Memory Component → Next State
Condition ↗
```
Building state machines with conditional transitions.

#### 4. Multiple Ands (Cascading)
```
Input A → And 1 → And 3 → Final Result
Input B ↗        ↗
Input C → And 2 ↗
Input D ↗
```
Creating multi-input AND logic.

## Implementation in Simulation

### JavaScript Class Implementation
```javascript
class AndComponent {
    constructor(componentId, config = {}) {
        this.componentId = componentId;
        this.inputSignals1 = [];
        this.inputSignals2 = [];
        this.setOutputSignals = [];
        this.outputSignal = null;
        
        // Configurable properties
        this.timeframe = config.timeframe || 0;
        this.timeBasedLogic = new TimeBasedAndLogic(this.timeframe);
        this.currentTime = 0;
    }
    
    processInputs(inputSignals1, inputSignals2, setOutputSignals, currentTime = 0) {
        /** Process input signals and generate output */
        this.currentTime = currentTime;
        
        // Aggregate input signals
        const input1 = this.aggregateSignals(inputSignals1);
        const input2 = this.aggregateSignals(inputSignals2);
        const setOutput = this.aggregateSignals(setOutputSignals);
        
        // Apply logical AND function
        if (this.timeframe > 0) {
            // Use time-based coordination
            const result = this.timeBasedLogic.processSignals(input1, input2, currentTime);
            this.outputSignal = setOutput !== null ? setOutput : (result ? "1" : "0");
        } else {
            // Use immediate coordination
            this.outputSignal = logicalAnd(input1, input2, setOutput, this.timeframe);
        }
    }
    
    aggregateSignals(wireSignals) {
        /** Standard Barotrauma signal aggregation */
        const activeSignals = wireSignals.filter(s => 
            s !== null && s !== undefined && s !== ""
        );
        return activeSignals.length > 0 ? activeSignals[0] : null;
    }
    
    getOutput() {
        /** Get current output signal */
        return this.outputSignal;
    }
    
    reset() {
        /** Reset component state */
        this.outputSignal = null;
        this.timeBasedLogic = new TimeBasedAndLogic(this.timeframe);
    }
}
```

### Integration with Signal Simulator
```javascript
class BarotraumaSignalSimulator {
    constructor() {
        this.components = {};
        this.wires = {};
        this.connections = {};
        this.currentTime = 0;
    }
    
    addAndComponent(componentId, config = {}) {
        /** Add an And component to the simulation */
        this.components[componentId] = new AndComponent(componentId, config);
    }
    
    updateAndComponent(componentId) {
        /** Update an And component's output */
        const component = this.components[componentId];
        
        // Get input signals from connected wires
        const inputWires1 = this.connections[componentId]?.['signal_in1'] || [];
        const inputWires2 = this.connections[componentId]?.['signal_in2'] || [];
        const setOutputWires = this.connections[componentId]?.['set_output'] || [];
        
        const inputSignals1 = inputWires1.map(wireId => this.wires[wireId]);
        const inputSignals2 = inputWires2.map(wireId => this.wires[wireId]);
        const setOutputSignals = setOutputWires.map(wireId => this.wires[wireId]);
        
        // Process inputs
        component.processInputs(inputSignals1, inputSignals2, setOutputSignals, this.currentTime);
        
        // Update output wire
        const outputWires = this.connections[componentId]?.['signal_out'] || [];
        for (const wireId of outputWires) {
            this.wires[wireId] = component.getOutput();
        }
    }
    
    advanceTime(deltaTime) {
        /** Advance simulation time */
        this.currentTime += deltaTime;
    }
}

// Usage example
const simulator = new BarotraumaSignalSimulator();

// Add And component with timeframe
simulator.addAndComponent("and1", {
    timeframe: 2.0  // 2 second coordination window
});

// Connect wires
simulator.connectWire("w1", "sensor1", "signal_out", "and1", "signal_in1");
simulator.connectWire("w2", "sensor2", "signal_out", "and1", "signal_in2");
simulator.connectWire("w3", "and1", "signal_out", "alarm", "signal_in");

// Set input signals
simulator.setWireSignal("w1", "1");
simulator.setWireSignal("w2", "1");

// Run simulation
simulator.simulateStep();
// Result: Wire w3 now carries signal "1" (both inputs active)
```

## Error Handling and Edge Cases

### Input Validation
The And component handles various input scenarios:
- **Null/undefined inputs**: Treated as inactive (false)
- **Empty strings**: Treated as inactive (false)
- **Non-boolean inputs**: Converted using standard rules
- **Mixed inputs**: Handled according to signal activity rules

### Time-Based Edge Cases
- **Zero timeframe**: Immediate coordination (default behavior)
- **Large timeframe**: Allows delayed coordination
- **Signal timing**: Handles signals arriving at different times
- **Signal persistence**: Maintains signal history within timeframe

### Signal Type Compatibility
- **Boolean values**: Processed directly
- **Numeric values**: Non-zero treated as active
- **String values**: Converted using standard rules
- **Mixed types**: Handled consistently

## Performance Characteristics

### Processing Speed
- **Real-time**: Processes signals immediately
- **Time-based**: Minimal overhead for timeframe calculations
- **Efficient**: Simple logical operation

### Resource Usage
- **Low CPU**: Minimal computational overhead
- **Memory usage**: Signal history for time-based coordination
- **No power**: Does not consume electrical power

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if both input wires are connected
   - Verify both input signals are active
   - Ensure proper signal aggregation
   - Check timeframe settings

2. **Unexpected Output**
   - Verify input signal format
   - Check for set_output override
   - Confirm timeframe is appropriate
   - Verify signal aggregation behavior

3. **Time-Based Issues**
   - Check timeframe configuration
   - Verify signal timing
   - Ensure proper time advancement
   - Check signal persistence

### Best Practices

1. **Signal Validation**: Ensure inputs are in expected format
2. **Timeframe Configuration**: Set appropriate coordination window
3. **Signal Documentation**: Label wires clearly for debugging
4. **Testing**: Test with various input combinations and timing
5. **Integration**: Verify downstream components can handle output format

## Component Comparison

### Similar Components
- **Or Component**: Outputs true if either input is active
- **Not Component**: Inverts the input signal
- **Xor Component**: Outputs true if exactly one input is active
- **Equals Component**: Outputs true if both inputs are equal

### When to Use And vs Alternatives
- **Use And**: When you need both conditions to be true
- **Use Or**: When you need either condition to be true
- **Use Xor**: When you need exactly one condition to be true
- **Use Not**: When you need to invert a condition

## Advanced Usage Patterns

### Pattern 1: Multi-Condition Safety
```
Condition A → And Component → Safety System
Condition B ↗
Condition C → And Component ↗
Condition D ↗
```
Requiring multiple safety conditions to be met.

### Pattern 2: Sequential Activation
```
Step 1 Complete → And Component → Step 2 Start
Step 2 Complete ↗
```
Coordinating sequential processes.

### Pattern 3: Resource Coordination
```
Resource A Available → And Component → Process Start
Resource B Available ↗
```
Starting processes only when all resources are available.

### Pattern 4: Access Control
```
Authentication A → And Component → Access Granted
Authentication B ↗
```
Requiring multiple authentication methods.

## Logical Reference

### Boolean Algebra
```javascript
// AND properties
true && true === true
true && false === false
false && true === false
false && false === false

// Commutative property
a && b === b && a

// Associative property
(a && b) && c === a && (b && c)

// Identity property
a && true === a

// Annihilator property
a && false === false
```

### Truth Table
| Input 1 | Input 2 | Output |
|---------|---------|--------|
| false   | false   | false  |
| false   | true    | false  |
| true    | false   | false  |
| true    | true    | true   |

### Time-Based Coordination
```javascript
function timeBasedAnd(input1, input2, timeframe) {
    const now = Date.now();
    const input1Time = input1.timestamp;
    const input2Time = input2.timestamp;
    
    const timeDiff = Math.abs(input1Time - input2Time);
    return timeDiff <= timeframe && input1.active && input2.active;
}
```

The And component is a fundamental logical tool in Barotrauma's electrical system, providing essential conditional logic capabilities for creating safety systems, access controls, and coordinated activation sequences in automated systems. 
