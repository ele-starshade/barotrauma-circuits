# Barotrauma Asin Component

## Overview

The **Asin Component** is a mathematical signal processing component in Barotrauma's electrical system. It implements the arcsine (inverse sine) function, taking a sine value as input and outputting the corresponding angle in radians. This component is essential for trigonometric calculations, angle determination, and mathematical modeling in automated systems.

## Component Definition

### Basic Information
- **Identifier**: `asincomponent`
- **Category**: Electrical
- **Function**: `TrigonometricFunctionComponent` with `function="Asin"`
- **Component Color**: `#a56dc2` (Purple)
- **Sprite**: `signalcomp.png` at position `128,64,32,32`

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
  - **Purpose**: Receives the sine value (must be between -1 and 1)
  - **Supports Multiple Wires**: Yes (follows standard aggregation rules)

- **Output Pin**: `signal_out`
  - **Display Name**: "Signal Out"
  - **Purpose**: Outputs the angle in radians whose sine equals the input
  - **Signal Type**: Numeric (radians)

## Mathematical Function

### Arcsine Operation
The Asin component implements the mathematical arcsine function:

```javascript
function arcsine(input) {
    /**
     * Returns the angle whose sine is equal to the input
     * 
     * @param {string|number} input - The sine value (must be between -1 and 1)
     * @returns {string|number|null} The angle in radians, or null if invalid
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
        
        // Check domain: arcsine is only defined for values between -1 and 1
        if (numValue < -1 || numValue > 1) {
            return null; // Domain error
        }
        
        // Calculate arcsine (returns angle in radians)
        const result = Math.asin(numValue);
        
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
| `"0"` | `"0"` | arcsin(0) = 0 radians |
| `"1"` | `"1.5707963267948966"` | arcsin(1) = π/2 radians (90°) |
| `"-1"` | `"-1.5707963267948966"` | arcsin(-1) = -π/2 radians (-90°) |
| `"0.5"` | `"0.5235987755982989"` | arcsin(0.5) = π/6 radians (30°) |
| `"-0.5"` | `"-0.5235987755982989"` | arcsin(-0.5) = -π/6 radians (-30°) |
| `"0.7071067811865476"` | `"0.7853981633974483"` | arcsin(√2/2) = π/4 radians (45°) |
| `"2"` | `null` | Domain error: 2 > 1 |
| `"-2"` | `null` | Domain error: -2 < -1 |
| `"abc"` | `null` | Invalid input |
| `""` | `null` | Empty input |

## Mathematical Properties

### Domain and Range
- **Domain**: [-1, 1] (sine values)
- **Range**: [-π/2, π/2] radians (angles)
- **Principal Value**: The component returns the principal value of arcsine

### Key Mathematical Relationships
```javascript
// Inverse relationship with sine
Math.sin(Math.asin(x)) === x  // for x in [-1, 1]

// Symmetry property
Math.asin(-x) === -Math.asin(x)

// Special values
Math.asin(0) === 0
Math.asin(1) === Math.PI / 2
Math.asin(-1) === -Math.PI / 2
Math.asin(0.5) === Math.PI / 6
Math.asin(-0.5) === -Math.PI / 6
```

### Angle Conversion
```javascript
// Convert radians to degrees
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

// Convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Examples
radiansToDegrees(Math.asin(1));     // 90°
radiansToDegrees(Math.asin(0.5));   // 30°
radiansToDegrees(Math.asin(-0.5));  // -30°
```

## Signal Processing

### Input Signal Aggregation
When multiple wires are connected to the same input pin, the component follows Barotrauma's standard signal aggregation rules:

1. **OR Logic**: Any active wire provides a signal
2. **First Signal Priority**: When multiple signals exist, the first one is processed
3. **Signal Persistence**: Signals remain until explicitly changed

### Processing Algorithm
```javascript
function processAsinComponent(inputSignals) {
    /**
     * Process input signals for Asin component
     * 
     * @param {Array} inputSignals - List of signals from signal_in wires
     * @returns {string|number|null} The arcsine of the first valid signal
     */
    // Aggregate input signals (first signal wins)
    const input = aggregateSignals(inputSignals);
    
    // Apply arcsine function
    return arcsine(input);
}
```

## Real-World Applications

### Use Case 1: Angle Calculation from Sine Values
```
Sine Sensor → Asin Component → Angle Display
```
Converting sine wave sensor readings to actual angles.

### Use Case 2: Trigonometric Modeling
```
Sine Wave Input → Asin Component → Phase Angle
```
Determining phase angles in oscillating systems.

### Use Case 3: Navigation Systems
```
Sine of Heading → Asin Component → Heading Angle
```
Converting sine-based heading data to actual heading angles.

### Use Case 4: Mathematical Computations
```
Sine Value → Asin Component → Angle for Further Calculations
```
Part of complex mathematical operations requiring angle determination.

## Integration with Other Components

### Common Combinations

#### 1. Asin + Sin (Identity Verification)
```
Input → Sin Component → Asin Component → Should Equal Input
```
Verifying mathematical relationships and component accuracy.

#### 2. Asin + Multiply (Angle Scaling)
```
Sine Value → Asin Component → Multiply (180/π) → Angle in Degrees
```
Converting radians to degrees for display.

#### 3. Asin + Signal Check (Range Validation)
```
Sine Value → Asin Component → Signal Check (target="π/2") → Alarm
```
Detecting when angles reach specific thresholds.

#### 4. Asin + Memory (Angle Tracking)
```
Sine Value → Asin Component → Memory Component → Stored Angle
```
Maintaining a record of calculated angles over time.

## Implementation in Simulation

### JavaScript Class Implementation
```javascript
class AsinComponent {
    constructor(componentId, config = {}) {
        this.componentId = componentId;
        this.inputSignals = [];
        this.outputSignal = null;
        
        // Configurable properties
        this.outputFormat = config.outputFormat || 'radians'; // 'radians' or 'degrees'
        this.precision = config.precision || 6; // Number of decimal places
    }
    
    processInputs(inputSignals) {
        /** Process input signals and generate output */
        // Aggregate input signals
        const input = this.aggregateSignals(inputSignals);
        
        // Apply arcsine function
        const result = this.arcsine(input);
        
        // Format output
        if (result !== null) {
            if (this.outputFormat === 'degrees') {
                const degrees = this.radiansToDegrees(result);
                this.outputSignal = degrees.toFixed(this.precision);
            } else {
                this.outputSignal = result.toFixed(this.precision);
            }
        } else {
            this.outputSignal = null;
        }
    }
    
    arcsine(input) {
        /** Calculate arcsine with error handling */
        if (input === null || input === undefined || input === "") {
            return null;
        }
        
        try {
            const numValue = Number(input);
            
            if (isNaN(numValue)) {
                return null;
            }
            
            // Check domain
            if (numValue < -1 || numValue > 1) {
                return null;
            }
            
            const result = Math.asin(numValue);
            
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
    
    radiansToDegrees(radians) {
        /** Convert radians to degrees */
        return radians * (180 / Math.PI);
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
    
    addAsinComponent(componentId, config = {}) {
        /** Add an Asin component to the simulation */
        this.components[componentId] = new AsinComponent(componentId, config);
    }
    
    updateAsinComponent(componentId) {
        /** Update an Asin component's output */
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

// Add Asin component with degree output
simulator.addAsinComponent("asin1", {
    outputFormat: 'degrees',
    precision: 2
});

// Connect wires
simulator.connectWire("w1", "sineSensor", "signal_out", "asin1", "signal_in");
simulator.connectWire("w2", "asin1", "signal_out", "display", "signal_in");

// Set input signals
simulator.setWireSignal("w1", "0.5");

// Run simulation
simulator.simulateStep();
// Result: Wire w2 now carries signal "30.00" (arcsin(0.5) = 30°)
```

## Error Handling and Edge Cases

### Input Validation
The Asin component handles various input scenarios:
- **Null/undefined inputs**: Returns null
- **Empty strings**: Returns null
- **Non-numeric inputs**: Returns null
- **Domain violations**: Returns null for values outside [-1, 1]

### Mathematical Edge Cases
- **Exact boundary values**: Handles -1, 0, and 1 correctly
- **Very small values**: Maintains precision for values close to zero
- **Floating point precision**: Handles floating point arithmetic correctly
- **NaN results**: Returns null for invalid mathematical operations

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
   - Ensure input is within domain [-1, 1]
   - Check signal aggregation

2. **Unexpected Output**
   - Verify input signal format
   - Check for domain violations
   - Confirm output format settings
   - Verify mathematical expectations

3. **Domain Errors**
   - Input values must be between -1 and 1
   - Check sensor calibration
   - Verify signal scaling
   - Use signal clamping if needed

### Best Practices

1. **Input Validation**: Ensure inputs are within valid domain
2. **Signal Scaling**: Scale inputs to [-1, 1] range if needed
3. **Output Format**: Choose appropriate output format (radians/degrees)
4. **Precision**: Set appropriate precision for your application
5. **Integration**: Verify downstream components can handle output format

## Component Comparison

### Similar Components
- **Sin Component**: Calculates sine of an angle
- **Cos Component**: Calculates cosine of an angle
- **Acos Component**: Calculates arccosine
- **Atan Component**: Calculates arctangent

### When to Use Asin vs Alternatives
- **Use Asin**: When you have a sine value and need the angle
- **Use Sin**: When you have an angle and need the sine value
- **Use Acos**: When you have a cosine value and need the angle
- **Use Atan**: When you have a tangent value and need the angle

## Advanced Usage Patterns

### Pattern 1: Angle Recovery
```
Sine Wave → Asin Component → Angle Display
```
Recovering angles from sine wave measurements.

### Pattern 2: Trigonometric Identity Verification
```
Angle → Sin Component → Asin Component → Should Equal Original Angle
```
Verifying mathematical relationships.

### Pattern 3: Phase Angle Calculation
```
Sine of Phase → Asin Component → Phase Angle
```
Calculating phase angles in oscillating systems.

### Pattern 4: Navigation Angle Determination
```
Sine of Heading → Asin Component → Heading Angle → Navigation System
```
Determining heading angles for navigation.

## Mathematical Reference

### Arcsine Properties
```javascript
// Domain and range
Math.asin(x) // Domain: [-1, 1], Range: [-π/2, π/2]

// Symmetry
Math.asin(-x) === -Math.asin(x)

// Special values
Math.asin(0) === 0
Math.asin(1) === Math.PI / 2
Math.asin(-1) === -Math.PI / 2
Math.asin(0.5) === Math.PI / 6
Math.asin(-0.5) === -Math.PI / 6
Math.asin(Math.sqrt(2) / 2) === Math.PI / 4
```

### Common Angle Conversions
```javascript
// Radians to degrees
function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

// Degrees to radians
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// Common angles
radToDeg(Math.asin(0.5));    // 30°
radToDeg(Math.asin(1));      // 90°
radToDeg(Math.asin(-0.5));   // -30°
```

### Trigonometric Relationships
```javascript
// Inverse relationship
Math.sin(Math.asin(x)) === x  // for x in [-1, 1]

// Pythagorean identity
Math.sin(angle) ** 2 + Math.cos(angle) ** 2 === 1

// Complementary angles
Math.asin(x) + Math.acos(x) === Math.PI / 2  // for x in [-1, 1]
```

The Asin component is a fundamental trigonometric tool in Barotrauma's electrical system, providing essential inverse sine capabilities for angle determination, mathematical modeling, and trigonometric calculations in automated systems. 
