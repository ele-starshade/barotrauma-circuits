# Barotrauma Abs Component

## Overview

The **Abs Component** (Absolute Value Component) is a mathematical signal processing component in Barotrauma's electrical system. It takes a numeric input signal and outputs its absolute value, effectively removing the sign (positive or negative) from the input value.

## Component Definition

### Basic Information
- **Identifier**: `abscomponent`
- **Category**: Electrical
- **Function**: `AbsoluteValue`
- **Component Color**: `#2fdca2` (Teal/Green)
- **Sprite**: `signalcomp.png` at position `160,96,32,32`

### Physical Properties
- **Size**: 32x26 pixels
- **Density**: 15
- **Scale**: 0.5
- **Max Stack Size**: 32 (inventory), 8 (character inventory)
- **Container**: Metal Crate
- **Fabrication**: Requires 1 FPGA Circuit, 10 seconds
- **Deconstruction**: Yields 1 FPGA Circuit, 10 seconds

## Input/Output Configuration

### Connection Panel
```
Input:  signal_in  (Signal Input)
Output: signal_out (Signal Output)
```

### Pin Details
- **Input Pin**: `signal_in`
  - **Display Name**: "Signal In"
  - **Purpose**: Receives the numeric value to be processed
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Output Pin**: `signal_out`
  - **Display Name**: "Signal Out"
  - **Purpose**: Outputs the absolute value of the input
  - **Signal Type**: Numeric

## Mathematical Function

### Absolute Value Operation
The Abs component implements the mathematical absolute value function:

```javascript
function absoluteValue(inputValue) {
    /**
     * Returns the absolute value of the input
     * 
     * @param {string|number} inputValue - Numeric value (can be positive, negative, or zero)
     * @returns {string|number|null} The absolute value (always non-negative)
     */
    if (inputValue === null || inputValue === undefined || inputValue === "") {
        return null; // No signal
    }
    
    try {
        // Convert to number and take absolute value
        const numericValue = Number(inputValue);
        if (isNaN(numericValue)) {
            // If input cannot be converted to number, return as-is
            return inputValue;
        }
        return Math.abs(numericValue);
    } catch (error) {
        // If input cannot be converted to number, return as-is
        return inputValue;
    }
}
```

### Behavior Examples

| Input Signal | Output Signal | Explanation |
|--------------|---------------|-------------|
| `"5"`        | `"5"`         | Positive number remains positive |
| `"-5"`       | `"5"`         | Negative number becomes positive |
| `"0"`        | `"0"`         | Zero remains zero |
| `"-12.5"`    | `"12.5"`      | Negative decimal becomes positive |
| `"100"`      | `"100"`       | Large positive number unchanged |
| `"-0.001"`   | `"0.001"`     | Small negative number becomes positive |
| `""`         | `""`          | No signal in = no signal out |
| `"abc"`      | `"abc"`       | Non-numeric input passed through unchanged |

## Signal Processing

### Input Signal Aggregation
When multiple wires are connected to the `signal_in` pin, the component follows Barotrauma's standard signal aggregation rules:

1. **OR Logic**: Any active wire provides a signal
2. **First Signal Priority**: When multiple signals exist, the first one is processed
3. **Signal Persistence**: Signals remain until explicitly changed

### Processing Algorithm
```javascript
function processAbsComponent(inputSignals) {
    /**
     * Process input signals for Abs component
     * 
     * @param {Array} inputSignals - List of signals from connected wires
     * @returns {string|number|null} The absolute value of the first valid signal
     */
    // Aggregate input signals (first signal wins)
    const inputSignal = aggregateSignals(inputSignals);
    
    if (inputSignal === null || inputSignal === undefined || inputSignal === "") {
        return null; // No output signal
    }
    
    // Apply absolute value function
    return absoluteValue(inputSignal);
}
```

## Real-World Applications

### Use Case 1: Distance Calculations
```
Sensor → Abs Component → Display
```
When calculating distances or magnitudes where direction doesn't matter.

### Use Case 2: Error Handling
```
Error Signal (-50) → Abs Component → Alarm System (50)
```
Converting error codes to positive values for consistent alarm thresholds.

### Use Case 3: Signal Normalization
```
Oscillating Signal (-100 to +100) → Abs Component → Always Positive (0 to 100)
```
Ensuring signals are always positive for downstream components that expect non-negative values.

### Use Case 4: Battery Level Monitoring
```
Battery Level (-90) → Abs Component → Display (90)
```
Displaying battery levels as positive values regardless of how the sensor reports them.

## Integration with Other Components

### Common Combinations

#### 1. Abs + Signal Check
```
Input → Abs Component → Signal Check (target="50") → Output
```
Useful for threshold detection with absolute values.

#### 2. Abs + Greater Component
```
Input → Abs Component → Greater Component → Output
```
Comparing absolute values against thresholds.

#### 3. Abs + Memory Component
```
Input → Abs Component → Memory Component → Output
```
Storing absolute values for later comparison.

## Implementation in Simulation

### Python Class Implementation
```javascript
class AbsComponent {
    constructor(componentId) {
        this.componentId = componentId;
        this.inputSignals = [];
        this.outputSignal = null;
    }
    
    processInputs(inputSignals) {
        /** Process input signals and generate output */
        // Aggregate input signals
        const inputSignal = this.aggregateSignals(inputSignals);
        
        // Apply absolute value function
        if (inputSignal !== null && inputSignal !== undefined && inputSignal !== "") {
            try {
                const numericValue = Number(inputSignal);
                if (isNaN(numericValue)) {
                    // Non-numeric input passed through unchanged
                    this.outputSignal = inputSignal;
                } else {
                    this.outputSignal = String(Math.abs(numericValue));
                }
            } catch (error) {
                // Non-numeric input passed through unchanged
                this.outputSignal = inputSignal;
            }
        } else {
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
    
    addAbsComponent(componentId) {
        /** Add an Abs component to the simulation */
        this.components[componentId] = new AbsComponent(componentId);
    }
    
    updateAbsComponent(componentId) {
        /** Update an Abs component's output */
        const component = this.components[componentId];
        
        // Get input signals from connected wires
        const inputWires = this.connections[componentId]?.['signal_in'] || [];
        const inputSignals = inputWires.map(wireId => this.wires[wireId]);
        
        // Process inputs
        component.processInputs(inputSignals);
        
        // Update output wire
        const outputWires = this.connections[componentId]?.['signal_out'] || [];
        for (const wireId of outputWires) {
            this.wires[wireId] = component.getOutput();
        }
    }
}

// Usage example
const simulator = new BarotraumaSignalSimulator();
simulator.addAbsComponent("abs1");
simulator.connectWire("w1", "sensor", "signal_out", "abs1", "signal_in");
simulator.connectWire("w2", "abs1", "signal_out", "display", "signal_in");

// Set input signal
simulator.setWireSignal("w1", "-75.5");

// Run simulation
simulator.simulateStep();
// Result: Wire w2 now carries signal "75.5"
```

## Error Handling and Edge Cases

### Non-Numeric Inputs
The Abs component handles non-numeric inputs gracefully:
- **Strings**: Passed through unchanged
- **Empty signals**: No output signal
- **Invalid numbers**: Passed through unchanged

### Floating Point Precision
- Maintains original precision of input
- No rounding or truncation
- Handles both integer and decimal inputs

### Signal Type Compatibility
- **Numeric strings**: Converted and processed
- **Pure numbers**: Processed directly
- **Other types**: Passed through unchanged

## Performance Characteristics

### Processing Speed
- **Real-time**: Processes signals immediately
- **No delay**: No internal timing or buffering
- **Efficient**: Simple mathematical operation

### Resource Usage
- **Low CPU**: Minimal computational overhead
- **No memory**: Stateless operation
- **No power**: Does not consume electrical power

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if input wire is connected
   - Verify input signal is not empty
   - Ensure proper signal aggregation

2. **Unexpected Output**
   - Verify input signal format
   - Check for non-numeric inputs
   - Confirm signal aggregation behavior

3. **Component Not Working**
   - Check wire connections
   - Verify component is powered (if applicable)
   - Ensure proper signal flow

### Best Practices

1. **Input Validation**: Ensure inputs are numeric when possible
2. **Signal Documentation**: Label wires clearly for debugging
3. **Testing**: Test with both positive and negative inputs
4. **Integration**: Verify downstream components can handle the output format

## Component Comparison

### Similar Components
- **Square Root Component**: Also processes numeric inputs
- **Round Component**: Also modifies numeric values
- **Floor/Ceiling Components**: Also handle numeric transformations

### When to Use Abs vs Alternatives
- **Use Abs**: When you need to remove sign from values
- **Use Square Root**: When you need magnitude calculations
- **Use Round**: When you need integer approximations
- **Use Floor/Ceiling**: When you need directional rounding

## Advanced Usage Patterns

### Pattern 1: Signal Conditioning
```
Raw Sensor → Abs Component → Filter → Display
```
Ensuring all sensor readings are positive for consistent processing.

### Pattern 2: Error Correction
```
Error Signal → Abs Component → Threshold Check → Alarm
```
Converting error codes to positive values for alarm systems.

### Pattern 3: Mathematical Operations
```
A - B → Abs Component → Result
```
Calculating the absolute difference between two values.

The Abs component is a fundamental mathematical tool in Barotrauma's electrical system, providing essential signal processing capabilities for handling signed numeric values in automated systems. 
