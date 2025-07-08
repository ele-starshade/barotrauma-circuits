# Barotrauma Adder Component

## Overview

The **Adder Component** is a mathematical signal processing component in Barotrauma's electrical system. It takes multiple numeric input signals and outputs their sum. This component is essential for combining multiple sensor readings, calculating totals, and performing basic arithmetic operations in automated systems.

## Component Definition

### Basic Information
- **Identifier**: `addercomponent`
- **Category**: Electrical
- **Function**: `AdderComponent`
- **Component Color**: `#a1d681` (Light Green)
- **Sprite**: `signalcomp.png` at position `96,0,32,32`

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
Output: signal_out (Signal Output)
```

### Pin Details
- **Input Pin 1**: `signal_in1`
  - **Display Name**: "Signal In 1"
  - **Purpose**: Receives the first numeric value to be added
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Input Pin 2**: `signal_in2`
  - **Display Name**: "Signal In 2"
  - **Purpose**: Receives the second numeric value to be added
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Output Pin**: `signal_out`
  - **Display Name**: "Signal Out"
  - **Purpose**: Outputs the sum of the input signals
  - **Signal Type**: Numeric

## Mathematical Function

### Addition Operation
The Adder component implements the mathematical addition function:

```javascript
function addition(input1, input2) {
    /**
     * Returns the sum of two input values
     * 
     * @param {string|number} input1 - First numeric value
     * @param {string|number} input2 - Second numeric value
     * @returns {string|number|null} The sum of the inputs
     */
    // Handle null/undefined/empty inputs
    if (input1 === null || input1 === undefined || input1 === "") {
        input1 = 0;
    }
    if (input2 === null || input2 === undefined || input2 === "") {
        input2 = 0;
    }
    
    try {
        // Convert to numbers
        const num1 = Number(input1);
        const num2 = Number(input2);
        
        if (isNaN(num1) || isNaN(num2)) {
            // If either input cannot be converted to number, return as-is
            return input1;
        }
        
        // Calculate sum
        return num1 + num2;
    } catch (error) {
        // If inputs cannot be processed, return first input as-is
        return input1;
    }
}
```

### Behavior Examples

| Input 1 | Input 2 | Output | Explanation |
|---------|---------|--------|-------------|
| `"5"`   | `"3"`   | `"8"`  | 5 + 3 = 8 |
| `"10.5"`| `"2.3"` | `"12.8"` | 10.5 + 2.3 = 12.8 |
| `"-5"`  | `"10"`  | `"5"`  | -5 + 10 = 5 |
| `"0"`   | `"7"`   | `"7"`  | 0 + 7 = 7 |
| `""`    | `"5"`   | `"5"`  | 0 + 5 = 5 (empty treated as 0) |
| `"3"`   | `""`    | `"3"`  | 3 + 0 = 3 (empty treated as 0) |
| `""`    | `""`    | `"0"`  | 0 + 0 = 0 |
| `"abc"` | `"5"`   | `"abc"` | Non-numeric input passed through unchanged |
| `"5"`   | `"abc"` | `"5"`  | Non-numeric input ignored, first input returned |

## Signal Processing

### Input Signal Aggregation
When multiple wires are connected to the same input pin, the component follows Barotrauma's standard signal aggregation rules:

1. **OR Logic**: Any active wire provides a signal
2. **First Signal Priority**: When multiple signals exist, the first one is processed
3. **Signal Persistence**: Signals remain until explicitly changed

### Processing Algorithm
```javascript
function processAdderComponent(inputSignals1, inputSignals2) {
    /**
     * Process input signals for Adder component
     * 
     * @param {Array} inputSignals1 - List of signals from signal_in1 wires
     * @param {Array} inputSignals2 - List of signals from signal_in2 wires
     * @returns {string|number|null} The sum of the first valid signals
     */
    // Aggregate input signals (first signal wins for each input)
    const input1 = aggregateSignals(inputSignals1);
    const input2 = aggregateSignals(inputSignals2);
    
    // Apply addition function
    return addition(input1, input2);
}
```

## Advanced Features

### Configurable Properties
The Adder component supports several configurable properties:

#### 1. Timeframe
- **Property**: `timeframe`
- **Purpose**: Sets the time window for signal processing
- **Default**: 0 (immediate processing)
- **Usage**: Can be used for time-based signal accumulation

#### 2. Clamp Minimum
- **Property**: `clampmin`
- **Purpose**: Sets the minimum output value
- **Default**: -999999
- **Usage**: Prevents output from going below a certain threshold

#### 3. Clamp Maximum
- **Property**: `clampmax`
- **Purpose**: Sets the maximum output value
- ** Default**: 999999
- **Usage**: Prevents output from exceeding a certain threshold

Only the properties listed above are player-configurable in-game. All other parameters are internal and cannot be changed by the player.

### Clamping Function
```javascript
function clampValue(value, min, max) {
    /**
     * Clamp a value between minimum and maximum bounds
     * 
     * @param {number} value - The value to clamp
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @returns {number} The clamped value
     */
    return Math.max(min, Math.min(max, value));
}
```

## Real-World Applications

### Use Case 1: Sensor Data Aggregation
```
Temperature Sensor 1 → Adder Component → Total Temperature
Temperature Sensor 2 ↗
```
Combining readings from multiple temperature sensors to get an average or total.

### Use Case 2: Resource Management
```
Battery Level 1 → Adder Component → Total Battery Level
Battery Level 2 ↗
```
Calculating total battery capacity across multiple battery systems.

### Use Case 3: Score Tracking
```
Points from Task 1 → Adder Component → Total Score
Points from Task 2 ↗
```
Accumulating points or scores from multiple sources.

### Use Case 4: Inventory Management
```
Item Count A → Adder Component → Total Items
Item Count B ↗
```
Tracking total quantities across different storage locations.

## Integration with Other Components

### Common Combinations

#### 1. Adder + Signal Check
```
Input A → Adder Component → Signal Check (target="100") → Alarm
Input B ↗
```
Triggering alarms when the sum reaches a specific threshold.

#### 2. Adder + Greater Component
```
Input A → Adder Component → Greater Component → Output
Input B ↗
```
Comparing the sum against a threshold value.

#### 3. Adder + Memory Component
```
Input A → Adder Component → Memory Component → Running Total
Input B ↗
```
Maintaining a running total of accumulated values.

#### 4. Multiple Adders (Cascading)
```
Input A → Adder 1 → Adder 3 → Final Sum
Input B ↗        ↗
Input C → Adder 2 ↗
Input D ↗
```
Adding more than two values by cascading multiple adders.

## Implementation in Simulation

### JavaScript Class Implementation
```javascript
class AdderComponent {
    constructor(componentId, config = {}) {
        this.componentId = componentId;
        this.inputSignals1 = [];
        this.inputSignals2 = [];
        this.outputSignal = null;
        
        // Configurable properties
        this.timeframe = config.timeframe || 0;
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
    }
    
    processInputs(inputSignals1, inputSignals2) {
        /** Process input signals and generate output */
        // Aggregate input signals
        const input1 = this.aggregateSignals(inputSignals1);
        const input2 = this.aggregateSignals(inputSignals2);
        
        // Apply addition function
        if (input1 !== null && input1 !== undefined && input1 !== "") {
            try {
                const num1 = Number(input1);
                const num2 = Number(input2 || 0);
                
                if (isNaN(num1) || isNaN(num2)) {
                    // Non-numeric input passed through unchanged
                    this.outputSignal = input1;
                } else {
                    // Calculate sum and apply clamping
                    const sum = num1 + num2;
                    const clampedSum = this.clampValue(sum);
                    this.outputSignal = String(clampedSum);
                }
            } catch (error) {
                // Non-numeric input passed through unchanged
                this.outputSignal = input1;
            }
        } else if (input2 !== null && input2 !== undefined && input2 !== "") {
            // Only input2 has a value
            this.outputSignal = input2;
        } else {
            // No inputs
            this.outputSignal = null;
        }
    }
    
    aggregateSignals(wireSignals) {
        /** Standard Barotrauma signal aggregation */
        const activeSignals = wireSignals.filter(s => 
            s !== null && s !== undefined && s !== ""
        );
        return activeSignals.length > 0 ? activeSignals[0] : null;
    }
    
    clampValue(value) {
        /** Clamp value between minimum and maximum bounds */
        return Math.max(this.clampMin, Math.min(this.clampMax, value));
    }
    
    getOutput() {
        /** Get current output signal */
        return this.outputSignal;
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
    }
    
    addAdderComponent(componentId, config = {}) {
        /** Add an Adder component to the simulation */
        this.components[componentId] = new AdderComponent(componentId, config);
    }
    
    updateAdderComponent(componentId) {
        /** Update an Adder component's output */
        const component = this.components[componentId];
        
        // Get input signals from connected wires
        const inputWires1 = this.connections[componentId]?.['signal_in1'] || [];
        const inputWires2 = this.connections[componentId]?.['signal_in2'] || [];
        
        const inputSignals1 = inputWires1.map(wireId => this.wires[wireId]);
        const inputSignals2 = inputWires2.map(wireId => this.wires[wireId]);
        
        // Process inputs
        component.processInputs(inputSignals1, inputSignals2);
        
        // Update output wire
        const outputWires = this.connections[componentId]?.['signal_out'] || [];
        for (const wireId of outputWires) {
            this.wires[wireId] = component.getOutput();
        }
    }
}

// Usage example
const simulator = new BarotraumaSignalSimulator();

// Add Adder component with custom configuration
simulator.addAdderComponent("adder1", {
    clampMin: 0,
    clampMax: 100,
    timeframe: 0
});

// Connect wires
simulator.connectWire("w1", "sensor1", "signal_out", "adder1", "signal_in1");
simulator.connectWire("w2", "sensor2", "signal_out", "adder1", "signal_in2");
simulator.connectWire("w3", "adder1", "signal_out", "display", "signal_in");

// Set input signals
simulator.setWireSignal("w1", "25");
simulator.setWireSignal("w2", "35");

// Run simulation
simulator.simulateStep();
// Result: Wire w3 now carries signal "60"
```

## Error Handling and Edge Cases

### Input Validation
The Adder component handles various input scenarios:
- **Null/undefined inputs**: Treated as 0
- **Empty strings**: Treated as 0
- **Non-numeric inputs**: Passed through unchanged
- **Mixed inputs**: Non-numeric inputs are ignored, numeric inputs are processed

### Overflow Protection
- **Clamping**: Output is clamped between configured min/max values
- **Floating point precision**: Maintains full precision of calculations
- **Large numbers**: Handles large values within clamp limits

### Signal Type Compatibility
- **Numeric strings**: Converted and processed
- **Pure numbers**: Processed directly
- **Other types**: Passed through unchanged or ignored

## Performance Characteristics

### Processing Speed
- **Real-time**: Processes signals immediately
- **No delay**: No internal timing or buffering (unless timeframe > 0)
- **Efficient**: Simple mathematical operation

### Resource Usage
- **Low CPU**: Minimal computational overhead
- **No memory**: Stateless operation (unless timeframe > 0)
- **No power**: Does not consume electrical power

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if input wires are connected
   - Verify input signals are not empty
   - Ensure proper signal aggregation
   - Check clamp settings

2. **Unexpected Output**
   - Verify input signal format
   - Check for non-numeric inputs
   - Confirm clamp settings are appropriate
   - Verify signal aggregation behavior

3. **Component Not Working**
   - Check wire connections
   - Verify component is powered (if applicable)
   - Ensure proper signal flow
   - Check timeframe settings

### Best Practices

1. **Input Validation**: Ensure inputs are numeric when possible
2. **Clamp Configuration**: Set appropriate min/max values for your use case
3. **Signal Documentation**: Label wires clearly for debugging
4. **Testing**: Test with various input combinations
5. **Integration**: Verify downstream components can handle the output format

## Component Comparison

### Similar Components
- **Subtract Component**: Performs subtraction instead of addition
- **Multiply Component**: Performs multiplication
- **Divide Component**: Performs division
- **Memory Component**: Can be used for running totals

### When to Use Adder vs Alternatives
- **Use Adder**: When you need to sum multiple values
- **Use Subtract**: When you need to find the difference between values
- **Use Multiply**: When you need to find the product of values
- **Use Memory**: When you need to maintain a running total over time

## Advanced Usage Patterns

### Pattern 1: Weighted Sum
```
Value A → Multiply (Weight A) → Adder → Weighted Sum
Value B → Multiply (Weight B) ↗
```
Calculating weighted averages or weighted sums.

### Pattern 2: Running Total
```
New Value → Adder → Memory → Running Total
Previous Total ↗
```
Maintaining a running total of accumulated values.

### Pattern 3: Threshold Detection
```
Sensor A → Adder → Signal Check → Alarm
Sensor B ↗
```
Triggering alarms when combined sensor readings exceed thresholds.

### Pattern 4: Resource Pooling
```
Battery A → Adder → Total Capacity
Battery B ↗
```
Calculating total available resources across multiple sources.

## Mathematical Reference

### Addition Properties
```javascript
// Commutative property
a + b === b + a

// Associative property
(a + b) + c === a + (b + c)

// Identity property
a + 0 === a

// Inverse property
a + (-a) === 0
```

### Clamping Function
```javascript
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Examples
clamp(150, 0, 100);  // Returns 100
clamp(-10, 0, 100);  // Returns 0
clamp(50, 0, 100);   // Returns 50
```

The Adder component is a fundamental mathematical tool in Barotrauma's electrical system, providing essential addition capabilities for combining multiple signals, calculating totals, and performing basic arithmetic operations in automated systems. 
