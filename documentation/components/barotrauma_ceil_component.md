# Barotrauma Ceil Component

## Overview

The **Ceil Component** is a mathematical signal processing component in Barotrauma's electrical system. It implements the ceiling function, taking a numeric input and outputting the smallest integer value that is greater than or equal to the input. This component is essential for rounding up values, resource allocation calculations, and ensuring minimum thresholds in automated systems.

## Component Definition

### Basic Information
- **Identifier**: `ceilcomponent`
- **Category**: Electrical
- **Function**: `FunctionComponent` with `function="Ceil"`
- **Component Color**: `#983f3c` (Red-Brown)
- **Sprite**: `signalcomp.png` at position `64,96,32,32`

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
Input:  signal_in (Signal Input)
Output: signal_out (Signal Output)
```

### Pin Details
- **Input Pin**: `signal_in`
  - **Display Name**: "Signal In"
  - **Purpose**: Receives the numeric value to be rounded up
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Output Pin**: `signal_out`
  - **Display Name**: "Signal Out"
  - **Purpose**: Outputs the smallest integer greater than or equal to the input
  - **Signal Type**: Numeric (integer)

## Mathematical Function

### Ceiling Operation
The Ceil component implements the mathematical ceiling function:

```javascript
function ceiling(input) {
    /**
     * Returns the smallest integer greater than or equal to the input
     * 
     * @param {string|number} input - The numeric value to round up
     * @returns {string|number|null} The ceiling value, or null if invalid
     */
    
    // Handle null/undefined/empty inputs
    if (input === null || input === undefined || input === "") {
        return null;
    }
    
    try {
        // Convert to number
        const numValue = Number(input);
        
        // Check if conversion was successful
        if (isNaN(numValue)) {
            return null;
        }
        
        // Calculate ceiling (smallest integer >= input)
        const result = Math.ceil(numValue);
        
        // Check if result is valid (not NaN)
        if (isNaN(result)) {
            return null;
        }
        
        return result;
    } catch (error) {
        return null;
    }
}
```

### Behavior Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| `"3.2"` | `"4"` | ceil(3.2) = 4 |
| `"3.0"` | `"3"` | ceil(3.0) = 3 |
| `"3.9"` | `"4"` | ceil(3.9) = 4 |
| `"-3.2"` | `"-3"` | ceil(-3.2) = -3 |
| `"-3.0"` | `"-3"` | ceil(-3.0) = -3 |
| `"-3.9"` | `"-3"` | ceil(-3.9) = -3 |
| `"0"` | `"0"` | ceil(0) = 0 |
| `"0.1"` | `"1"` | ceil(0.1) = 1 |
| `"-0.1"` | `"0"` | ceil(-0.1) = 0 |
| `"abc"` | `null` | Invalid input |
| `""` | `null` | Empty input |

## Mathematical Properties

### Ceiling Function Properties
- **Domain**: All real numbers
- **Range**: All integers
- **Monotonic**: Always increases or stays the same
- **Idempotent**: ceil(ceil(x)) = ceil(x)

### Key Mathematical Relationships
```javascript
// Basic properties
Math.ceil(x) >= x  // Ceiling is always >= input
Math.ceil(x) === x  // Only when x is already an integer

// Relationship with floor
Math.ceil(x) === -Math.floor(-x)  // For positive x
Math.ceil(-x) === -Math.floor(x)  // For negative x

// Special cases
Math.ceil(0) === 0
Math.ceil(1) === 1
Math.ceil(-1) === -1
Math.ceil(0.5) === 1
Math.ceil(-0.5) === 0
```

### Comparison with Other Rounding Functions
```javascript
// Examples comparing different rounding methods
const x = 3.7;

Math.ceil(x);   // 4 (rounds up)
Math.floor(x);  // 3 (rounds down)
Math.round(x);  // 4 (rounds to nearest)

const y = -3.7;

Math.ceil(y);   // -3 (rounds up toward zero)
Math.floor(y);  // -4 (rounds down away from zero)
Math.round(y);  // -4 (rounds to nearest)
```

## Signal Processing

### Input Signal Aggregation
When multiple wires are connected to the same input pin, the component follows Barotrauma's standard signal aggregation rules:

1. **OR Logic**: Any active wire provides a signal
2. **First Signal Priority**: When multiple signals exist, the first one is processed
3. **Signal Persistence**: Signals remain until explicitly changed

### Processing Algorithm
```javascript
function processCeilComponent(inputSignals) {
    /**
     * Process input signals for Ceil component
     * 
     * @param {Array} inputSignals - List of signals from signal_in wires
     * @returns {string|number|null} The ceiling of the first valid signal
     */
    // Aggregate input signals (first signal wins)
    const input = aggregateSignals(inputSignals);
    
    // Apply ceiling function
    return ceiling(input);
}
```

## Real-World Applications

### Use Case 1: Resource Allocation
```
Resource Usage → Ceil Component → Required Units
```
Ensuring sufficient resource allocation by rounding up partial units.

### Use Case 2: Container Capacity
```
Item Count → Ceil Component → Container Count
```
Calculating the number of containers needed to hold items.

### Use Case 3: Time Calculations
```
Time Duration → Ceil Component → Rounded Time
```
Rounding up time durations to the nearest whole unit.

### Use Case 4: Threshold Enforcement
```
Minimum Value → Ceil Component → Enforced Minimum
```
Ensuring values meet minimum integer thresholds.

## Integration with Other Components

### Common Combinations

#### 1. Ceil + Floor (Range Validation)
```
Input → Ceil Component → Floor Component → Should Equal Input
```
Verifying that input is already an integer.

#### 2. Ceil + Multiply (Scaling)
```
Value → Multiply (1.5) → Ceil Component → Scaled Up Value
```
Scaling values and rounding up to ensure sufficient capacity.

#### 3. Ceil + Signal Check (Threshold Detection)
```
Value → Ceil Component → Signal Check (target="5") → Alarm
```
Detecting when ceiling values reach specific thresholds.

#### 4. Ceil + Memory (Capacity Tracking)
```
Usage → Ceil Component → Memory Component → Stored Capacity
```
Maintaining a record of required capacity over time.

## Implementation in Simulation

### JavaScript Class Implementation
```javascript
class CeilComponent {
    constructor(componentId, config = {}) {
        this.componentId = componentId;
        this.inputSignals = [];
        this.outputSignal = null;
        
        // Configurable properties
        this.outputFormat = config.outputFormat || 'integer'; // 'integer' or 'string'
        this.precision = config.precision || 0; // Number of decimal places (0 for integers)
    }
    
    processInputs(inputSignals) {
        /** Process input signals and generate output */
        // Aggregate input signals
        const input = this.aggregateSignals(inputSignals);
        
        // Apply ceiling function
        const result = this.ceiling(input);
        
        // Format output
        if (result !== null) {
            if (this.outputFormat === 'string') {
                this.outputSignal = String(result);
            } else {
                this.outputSignal = result;
            }
        } else {
            this.outputSignal = null;
        }
    }
    
    ceiling(input) {
        /** Calculate ceiling with error handling */
        if (input === null || input === undefined || input === "") {
            return null;
        }
        
        try {
            const numValue = Number(input);
            
            if (isNaN(numValue)) {
                return null;
            }
            
            const result = Math.ceil(numValue);
            
            if (isNaN(result)) {
                return null;
            }
            
            return result;
        } catch (error) {
            return null;
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
    
    addCeilComponent(componentId, config = {}) {
        /** Add a Ceil component to the simulation */
        this.components[componentId] = new CeilComponent(componentId, config);
    }
    
    updateCeilComponent(componentId) {
        /** Update a Ceil component's output */
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

// Add Ceil component
simulator.addCeilComponent("ceil1", {
    outputFormat: 'string'
});

// Connect wires
simulator.connectWire("w1", "usageSensor", "signal_out", "ceil1", "signal_in");
simulator.connectWire("w2", "ceil1", "signal_out", "display", "signal_in");

// Set input signals
simulator.setWireSignal("w1", "3.7");

// Run simulation
simulator.simulateStep();
// Result: Wire w2 now carries signal "4" (ceil(3.7) = 4)
```

## Error Handling and Edge Cases

### Input Validation
The Ceil component handles various input scenarios:
- **Null/undefined inputs**: Returns null
- **Empty strings**: Returns null
- **Non-numeric inputs**: Returns null
- **Valid numbers**: Processes correctly

### Mathematical Edge Cases
- **Integers**: Returns the same value
- **Very large numbers**: Handles correctly within JavaScript limits
- **Very small numbers**: Handles correctly
- **Negative numbers**: Rounds up toward zero
- **Zero**: Returns zero

### Signal Type Compatibility
- **Numeric strings**: Converted and processed
- **Pure numbers**: Processed directly
- **Other types**: Return null for non-numeric inputs

## Performance Characteristics

### Processing Speed
- **Real-time**: Processes signals immediately
- **Efficient**: Simple mathematical operation
- **No delay**: No internal timing or buffering

### Resource Usage
- **Low CPU**: Minimal computational overhead
- **No memory**: Stateless operation
- **No power**: Does not consume electrical power

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if input wire is connected
   - Verify input signal is numeric
   - Check signal aggregation
   - Verify input validation

2. **Unexpected Output**
   - Verify input signal format
   - Check for non-numeric inputs
   - Confirm mathematical expectations
   - Verify output format settings

3. **Rounding Issues**
   - Understand ceiling vs floor vs round behavior
   - Check for negative number handling
   - Verify integer vs decimal expectations

### Best Practices

1. **Input Validation**: Ensure inputs are numeric
2. **Output Format**: Choose appropriate output format
3. **Mathematical Understanding**: Know when to use ceiling vs other rounding
4. **Integration**: Verify downstream components can handle integer outputs
5. **Testing**: Test with various input types and edge cases

## Component Comparison

### Similar Components
- **Floor Component**: Rounds down to nearest integer
- **Round Component**: Rounds to nearest integer
- **Abs Component**: Returns absolute value
- **Modulo Component**: Returns remainder after division

### When to Use Ceil vs Alternatives
- **Use Ceil**: When you need to round up (ensure minimum capacity)
- **Use Floor**: When you need to round down (ensure maximum capacity)
- **Use Round**: When you need to round to nearest
- **Use Abs**: When you need absolute value

## Advanced Usage Patterns

### Pattern 1: Capacity Planning
```
Current Usage → Ceil Component → Required Capacity
```
Planning for sufficient capacity by rounding up usage.

### Pattern 2: Resource Allocation
```
Resource Need → Ceil Component → Allocated Resources
```
Ensuring adequate resource allocation.

### Pattern 3: Container Management
```
Item Count → Ceil Component → Container Count
```
Calculating required containers for items.

### Pattern 4: Threshold Enforcement
```
Minimum Value → Ceil Component → Enforced Minimum
```
Enforcing minimum integer thresholds.

## Mathematical Reference

### Ceiling Function Properties
```javascript
// Basic properties
Math.ceil(x) >= x  // Always greater than or equal to input
Math.ceil(x) === x  // Only when x is already an integer

// Relationship with floor
Math.ceil(x) === -Math.floor(-x)  // For positive x
Math.ceil(-x) === -Math.floor(x)  // For negative x

// Special values
Math.ceil(0) === 0
Math.ceil(1) === 1
Math.ceil(-1) === -1
Math.ceil(0.5) === 1
Math.ceil(-0.5) === 0
Math.ceil(3.7) === 4
Math.ceil(-3.7) === -3
```

### Common Use Cases
```javascript
// Resource allocation
function calculateRequiredUnits(usage, unitSize) {
    return Math.ceil(usage / unitSize);
}

// Container calculation
function calculateContainers(itemCount, containerCapacity) {
    return Math.ceil(itemCount / containerCapacity);
}

// Time rounding
function roundUpTime(hours) {
    return Math.ceil(hours);
}

// Threshold enforcement
function enforceMinimum(value, minimum) {
    return Math.max(Math.ceil(value), minimum);
}
```

### Comparison Examples
```javascript
const values = [3.2, 3.5, 3.7, -3.2, -3.5, -3.7];

values.forEach(x => {
    console.log(`x=${x}: ceil=${Math.ceil(x)}, floor=${Math.floor(x)}, round=${Math.round(x)}`);
});

// Output:
// x=3.2: ceil=4, floor=3, round=3
// x=3.5: ceil=4, floor=3, round=4
// x=3.7: ceil=4, floor=3, round=4
// x=-3.2: ceil=-3, floor=-4, round=-3
// x=-3.5: ceil=-3, floor=-4, round=-3
// x=-3.7: ceil=-3, floor=-4, round=-4
```

The Ceil component is a fundamental mathematical tool in Barotrauma's electrical system, providing essential ceiling function capabilities for rounding up values, resource allocation, capacity planning, and threshold enforcement in automated systems. 
