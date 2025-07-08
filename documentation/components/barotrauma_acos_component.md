# Barotrauma Acos Component

## Overview

The **Acos Component** (Arccosine Component) is a trigonometric signal processing component in Barotrauma's electrical system. It takes a numeric input signal representing a cosine value and outputs the corresponding angle in radians. This is the inverse function of the cosine operation.

## Component Definition

### Basic Information
- **Identifier**: `acoscomponent`
- **Category**: Electrical
- **Function**: `Acos` (TrigonometricFunctionComponent)
- **Component Color**: `#7594ba` (Blue-Gray)
- **Sprite**: `signalcomp.png` at position `160,64,32,32`

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
Input:  signal_in  (Signal Input)
Output: signal_out (Signal Output)
```

### Pin Details
- **Input Pin**: `signal_in`
  - **Display Name**: "Signal In"
  - **Purpose**: Receives the cosine value to be processed
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Output Pin**: `signal_out`
  - **Display Name**: "Signal Out"
  - **Purpose**: Outputs the angle in radians whose cosine equals the input
  - **Signal Type**: Numeric (radians)

## Mathematical Function

### Arccosine Operation
The Acos component implements the mathematical arccosine function:

```javascript
function arccosine(inputValue) {
    /**
     * Returns the arccosine (inverse cosine) of the input
     * 
     * @param {string|number} inputValue - Cosine value (must be between -1 and 1)
     * @returns {string|number|null} The angle in radians (0 to π)
     */
    if (inputValue === null || inputValue === undefined || inputValue === "") {
        return null; // No signal
    }
    
    try {
        // Convert to number
        const numericValue = Number(inputValue);
        if (isNaN(numericValue)) {
            // If input cannot be converted to number, return as-is
            return inputValue;
        }
        
        // Check domain: arccosine is only defined for values between -1 and 1
        if (numericValue < -1 || numericValue > 1) {
            return null; // Invalid input, no output
        }
        
        // Calculate arccosine (returns angle in radians)
        return Math.acos(numericValue);
    } catch (error) {
        // If input cannot be processed, return as-is
        return inputValue;
    }
}
```

### Behavior Examples

| Input Signal | Output Signal | Explanation |
|--------------|---------------|-------------|
| `"1"`        | `"0"`         | cos(0) = 1, so acos(1) = 0 |
| `"0"`        | `"1.5707963267948966"` | cos(π/2) = 0, so acos(0) = π/2 |
| `"-1"`       | `"3.141592653589793"` | cos(π) = -1, so acos(-1) = π |
| `"0.5"`      | `"1.0471975511965976"` | cos(π/3) = 0.5, so acos(0.5) = π/3 |
| `"0.7071067811865476"` | `"0.7853981633974483"` | cos(π/4) = √2/2, so acos(√2/2) = π/4 |
| `"2"`        | `""`          | Invalid input (> 1), no output |
| `"-2"`       | `""`          | Invalid input (< -1), no output |
| `""`         | `""`          | No signal in = no signal out |
| `"abc"`      | `"abc"`       | Non-numeric input passed through unchanged |

## Mathematical Properties

### Domain and Range
- **Domain**: [-1, 1] (cosine values)
- **Range**: [0, π] (angles in radians)
- **Invalid Inputs**: Values outside [-1, 1] produce no output

### Key Values
```javascript
const ACOS_SPECIAL_VALUES = {
    "1": 0,                    // acos(1) = 0
    "0.7071067811865476": Math.PI / 4,  // acos(√2/2) = π/4
    "0": Math.PI / 2,          // acos(0) = π/2
    "-0.7071067811865476": 3 * Math.PI / 4, // acos(-√2/2) = 3π/4
    "-1": Math.PI              // acos(-1) = π
};
```

### Relationship to Other Trigonometric Functions
- **Inverse of**: Cos component (cos(acos(x)) = x for x in [-1, 1])
- **Related to**: Asin component (asin(x) + acos(x) = π/2 for x in [-1, 1])
- **Complementary**: acos(x) = π/2 - asin(x)

## Signal Processing

### Input Signal Aggregation
When multiple wires are connected to the `signal_in` pin, the component follows Barotrauma's standard signal aggregation rules:

1. **OR Logic**: Any active wire provides a signal
2. **First Signal Priority**: When multiple signals exist, the first one is processed
3. **Signal Persistence**: Signals remain until explicitly changed

### Processing Algorithm
```javascript
function processAcosComponent(inputSignals) {
    /**
     * Process input signals for Acos component
     * 
     * @param {Array} inputSignals - List of signals from connected wires
     * @returns {string|number|null} The arccosine of the first valid signal
     */
    // Aggregate input signals (first signal wins)
    const inputSignal = aggregateSignals(inputSignals);
    
    if (inputSignal === null || inputSignal === undefined || inputSignal === "") {
        return null; // No output signal
    }
    
    // Apply arccosine function
    return arccosine(inputSignal);
}
```

## Real-World Applications

### Use Case 1: Angle Calculations from Cosine Values
```
Cosine Sensor → Acos Component → Angle Display
```
When you have a cosine value from a sensor and need to determine the corresponding angle.

### Use Case 2: Navigation Systems
```
Direction Cosine → Acos Component → Heading Angle
```
Converting directional cosines to actual heading angles in navigation systems.

### Use Case 3: Mechanical Systems
```
Position Cosine → Acos Component → Angular Position
```
Determining angular positions from cosine-based position sensors.

### Use Case 4: Signal Processing
```
Filtered Cosine → Acos Component → Phase Angle
```
Extracting phase angles from cosine signals in signal processing applications.

## Integration with Other Components

### Common Combinations

#### 1. Acos + Cos (Inverse Operations)
```
Input → Acos Component → Cos Component → Output
```
Should return the original input (within domain constraints).

#### 2. Acos + Signal Check
```
Input → Acos Component → Signal Check (target="1.570796") → Output
```
Checking if the angle equals π/2 (90 degrees).

#### 3. Acos + Multiply (Angle Conversion)
```
Input → Acos Component → Multiply (180/π) → Output
```
Converting radians to degrees.

#### 4. Acos + Asin (Complementary Angles)
```
Input → Acos Component → Subtract from π/2 → Output
```
Calculating complementary angles.

## Implementation in Simulation

### JavaScript Class Implementation
```javascript
class AcosComponent {
    constructor(componentId) {
        this.componentId = componentId;
        this.inputSignals = [];
        this.outputSignal = null;
    }
    
    processInputs(inputSignals) {
        /** Process input signals and generate output */
        // Aggregate input signals
        const inputSignal = this.aggregateSignals(inputSignals);
        
        // Apply arccosine function
        if (inputSignal !== null && inputSignal !== undefined && inputSignal !== "") {
            try {
                const numericValue = Number(inputSignal);
                if (isNaN(numericValue)) {
                    // Non-numeric input passed through unchanged
                    this.outputSignal = inputSignal;
                } else {
                    // Check domain: arccosine is only defined for values between -1 and 1
                    if (numericValue >= -1 && numericValue <= 1) {
                        this.outputSignal = String(Math.acos(numericValue));
                    } else {
                        // Invalid input, no output
                        this.outputSignal = null;
                    }
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
    
    addAcosComponent(componentId) {
        /** Add an Acos component to the simulation */
        this.components[componentId] = new AcosComponent(componentId);
    }
    
    updateAcosComponent(componentId) {
        /** Update an Acos component's output */
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
simulator.addAcosComponent("acos1");
simulator.connectWire("w1", "cosine_sensor", "signal_out", "acos1", "signal_in");
simulator.connectWire("w2", "acos1", "signal_out", "angle_display", "signal_in");

// Set input signal (cosine value)
simulator.setWireSignal("w1", "0.5");

// Run simulation
simulator.simulateStep();
// Result: Wire w2 now carries signal "1.0471975511965976" (π/3 radians)
```

## Error Handling and Edge Cases

### Domain Validation
The Acos component strictly validates its input domain:
- **Valid inputs**: Values between -1 and 1 (inclusive)
- **Invalid inputs**: Values outside [-1, 1] produce no output
- **Boundary values**: -1 and 1 are valid and produce π and 0 respectively

### Non-Numeric Inputs
The component handles non-numeric inputs gracefully:
- **Strings**: Passed through unchanged
- **Empty signals**: No output signal
- **Invalid numbers**: Passed through unchanged

### Floating Point Precision
- Uses JavaScript's `Math.acos()` for calculations
- Maintains full floating-point precision
- No rounding or truncation of results

### Signal Type Compatibility
- **Numeric strings**: Converted and processed
- **Pure numbers**: Processed directly
- **Other types**: Passed through unchanged

## Performance Characteristics

### Processing Speed
- **Real-time**: Processes signals immediately
- **No delay**: No internal timing or buffering
- **Efficient**: Single mathematical operation

### Resource Usage
- **Low CPU**: Minimal computational overhead
- **No memory**: Stateless operation
- **No power**: Does not consume electrical power

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if input wire is connected
   - Verify input signal is not empty
   - Ensure input value is between -1 and 1
   - Check for proper signal aggregation

2. **Unexpected Output**
   - Verify input signal format
   - Check for non-numeric inputs
   - Confirm input is within valid domain
   - Verify signal aggregation behavior

3. **Component Not Working**
   - Check wire connections
   - Verify component is powered (if applicable)
   - Ensure proper signal flow
   - Validate input domain constraints

### Best Practices

1. **Input Validation**: Ensure inputs are within [-1, 1] range
2. **Signal Documentation**: Label wires clearly for debugging
3. **Testing**: Test with boundary values (-1, 0, 1)
4. **Integration**: Verify downstream components can handle radian outputs
5. **Domain Awareness**: Remember that arccosine is undefined outside [-1, 1]

## Component Comparison

### Similar Components
- **Asin Component**: Also calculates inverse trigonometric functions
- **Atan Component**: Also calculates inverse trigonometric functions
- **Cos Component**: Inverse operation of Acos
- **Sin Component**: Related trigonometric function

### When to Use Acos vs Alternatives
- **Use Acos**: When you have a cosine value and need the corresponding angle
- **Use Asin**: When you have a sine value and need the corresponding angle
- **Use Atan**: When you have a tangent value and need the corresponding angle
- **Use Cos**: When you have an angle and need the cosine value

## Advanced Usage Patterns

### Pattern 1: Angle Recovery
```
Cosine Value → Acos Component → Angle in Radians
```
Recovering angles from cosine measurements.

### Pattern 2: Coordinate Conversion
```
X-Coordinate → Acos Component → Angular Position
```
Converting Cartesian coordinates to angular positions.

### Pattern 3: Phase Analysis
```
Phase Cosine → Acos Component → Phase Angle
```
Analyzing phase relationships in oscillating systems.

### Pattern 4: Navigation Calculations
```
Direction Cosine → Acos Component → Heading Angle → Convert to Degrees
```
Calculating navigation headings from directional cosines.

## Mathematical Reference

### Trigonometric Relationships
```javascript
// Inverse relationship
Math.cos(Math.acos(x)) === x  // for x in [-1, 1]

// Complementary relationship
Math.asin(x) + Math.acos(x) === Math.PI / 2  // for x in [-1, 1]

// Domain and range
// Domain: [-1, 1]
// Range: [0, π]
```

### Common Values
```javascript
const COMMON_ACOS_VALUES = {
    "1": 0,                    // 0°
    "0.8660254037844387": Math.PI / 6,  // 30°
    "0.7071067811865476": Math.PI / 4,  // 45°
    "0.5": Math.PI / 3,        // 60°
    "0": Math.PI / 2,          // 90°
    "-0.5": 2 * Math.PI / 3,   // 120°
    "-0.7071067811865476": 3 * Math.PI / 4, // 135°
    "-0.8660254037844387": 5 * Math.PI / 6, // 150°
    "-1": Math.PI              // 180°
};
```

The Acos component is a fundamental trigonometric tool in Barotrauma's electrical system, providing essential inverse cosine calculations for angle determination in automated systems, navigation, and signal processing applications. 
