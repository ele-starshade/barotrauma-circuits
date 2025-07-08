# Barotrauma Atan Component Documentation

## Overview

The **Atan Component** (Arctangent) is a mathematical signal processing component in Barotrauma's electrical system that calculates the angle whose tangent equals the input value. It supports both single-input mode (standard arctangent) and dual-input mode (atan2 function) for vector-based angle calculations.

## Component Details

- **Identifier**: `atancomponent`
- **Category**: Electrical
- **Function**: TrigonometricFunctionComponent with `Atan` function
- **Color**: `#6cabbc` (light blue-cyan)
- **Base Price**: 100 marks
- **Difficulty Level**: 15

## Input/Output Pins

### Input Pins
- **`signal_in`** - Standard input for single-value arctangent calculation
- **`signal_in_x`** - X-component for vector-based atan2 calculation
- **`signal_in_y`** - Y-component for vector-based atan2 calculation

### Output Pins
- **`signal_out`** - Output angle in radians

## Mathematical Function

### Single Input Mode (Standard Atan)
When only `signal_in` is connected:
```
output = atan(input)
```

### Dual Input Mode (Atan2)
When both `signal_in_x` and `signal_in_y` are connected:
```
output = atan2(y, x)
```

## Mathematical Properties

### Domain and Range
- **Domain**: All real numbers (-∞ to +∞)
- **Range**: [-π/2, π/2] for single input, [-π, π] for dual input
- **Output Unit**: Radians

### Key Characteristics
- **Periodicity**: Not periodic (unlike sine/cosine)
- **Symmetry**: atan(-x) = -atan(x)
- **Limits**: 
  - lim(x→∞) atan(x) = π/2
  - lim(x→-∞) atan(x) = -π/2

### Atan2 Advantages
- **Full Range**: Returns angles in [-π, π] range
- **Quadrant Awareness**: Correctly handles all four quadrants
- **Zero Handling**: Properly handles cases where x or y is zero

## Signal Processing Behavior

### Signal Aggregation
- **Multiple Inputs**: If multiple wires connect to any input, signals are aggregated using OR logic
- **Priority**: First signal received takes precedence
- **Time-based**: Component processes signals in real-time

### Error Handling
- **Invalid Inputs**: Handles NaN and infinite values gracefully
- **Zero Division**: Atan2 handles zero values appropriately
- **Output Clamping**: Output is automatically clamped to valid range

## Real-World Applications

### Navigation Systems
```javascript
// Calculate heading from velocity vector
const velocityX = 10;  // Forward velocity
const velocityY = 5;   // Lateral velocity
const heading = Math.atan2(velocityY, velocityX);
```

### Steering Mechanisms
```javascript
// Calculate steering angle for submarine
const targetX = 100;  // Target X position
const currentX = 80;  // Current X position
const targetY = 50;   // Target Y position
const currentY = 45;  // Current Y position
const steeringAngle = Math.atan2(targetY - currentY, targetX - currentX);
```

### Sensor Processing
```javascript
// Process sonar data for object detection
const objectDistance = 150;  // Distance to object
const objectAngle = Math.atan(objectDistance / 1000);  // Angle calculation
```

### Camera Systems
```javascript
// Calculate camera pan angle
const targetX = 200;  // Target X coordinate
const targetY = 150;  // Target Y coordinate
const cameraX = 0;    // Camera X position
const cameraY = 0;    // Camera Y position
const panAngle = Math.atan2(targetY - cameraY, targetX - cameraX);
```

## Integration Examples

### With Adder Component
```javascript
// Calculate angle from combined sensor inputs
const sensor1 = 0.5;
const sensor2 = 0.3;
const combinedSignal = sensor1 + sensor2;  // Adder component
const angle = Math.atan(combinedSignal);   // Atan component
```

### With Multiplier Component
```javascript
// Scale angle calculation
const baseAngle = 0.8;
const scaleFactor = 2.0;
const scaledAngle = Math.atan(baseAngle * scaleFactor);  // Multiplier + Atan
```

### With Signal Check Component
```javascript
// Conditional angle calculation
const inputSignal = 0.6;
const threshold = 0.5;
const isValid = inputSignal > threshold;  // Signal Check component
const angle = isValid ? Math.atan(inputSignal) : 0;  // Conditional Atan
```

## JavaScript Implementation

```javascript
class AtanComponent {
    constructor() {
        this.inputSignal = 0;
        this.inputX = 0;
        this.inputY = 0;
        this.outputSignal = 0;
        this.mode = 'single';  // 'single' or 'dual'
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // ~60 FPS
    }

    // Process input signals
    processInputs(inputs) {
        const currentTime = Date.now();
        
        // Check if enough time has passed for update
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return this.outputSignal;
        }

        // Determine mode based on available inputs
        if (inputs.signal_in_x !== undefined && inputs.signal_in_y !== undefined) {
            this.mode = 'dual';
            this.inputX = this.aggregateSignals(inputs.signal_in_x);
            this.inputY = this.aggregateSignals(inputs.signal_in_y);
        } else if (inputs.signal_in !== undefined) {
            this.mode = 'single';
            this.inputSignal = this.aggregateSignals(inputs.signal_in);
        }

        // Calculate output
        this.calculateOutput();
        this.lastUpdateTime = currentTime;
        
        return this.outputSignal;
    }

    // Aggregate multiple input signals using OR logic
    aggregateSignals(signals) {
        if (!Array.isArray(signals)) {
            return signals || 0;
        }
        
        // OR logic: return first non-zero signal, or 0 if all are zero
        for (const signal of signals) {
            if (signal !== 0 && !isNaN(signal)) {
                return signal;
            }
        }
        return 0;
    }

    // Calculate arctangent output
    calculateOutput() {
        try {
            if (this.mode === 'dual') {
                // Atan2 mode: calculate angle from vector components
                this.outputSignal = Math.atan2(this.inputY, this.inputX);
            } else {
                // Single input mode: standard arctangent
                this.outputSignal = Math.atan(this.inputSignal);
            }

            // Validate output
            if (isNaN(this.outputSignal) || !isFinite(this.outputSignal)) {
                this.outputSignal = 0;
            }

        } catch (error) {
            console.error('Atan calculation error:', error);
            this.outputSignal = 0;
        }
    }

    // Get current output
    getOutput() {
        return this.outputSignal;
    }

    // Get component state
    getState() {
        return {
            mode: this.mode,
            inputSignal: this.inputSignal,
            inputX: this.inputX,
            inputY: this.inputY,
            outputSignal: this.outputSignal,
            lastUpdateTime: this.lastUpdateTime
        };
    }

    // Reset component state
    reset() {
        this.inputSignal = 0;
        this.inputX = 0;
        this.inputY = 0;
        this.outputSignal = 0;
        this.mode = 'single';
        this.lastUpdateTime = 0;
    }
}

// Usage example
const atanComponent = new AtanComponent();

// Single input mode
const singleResult = atanComponent.processInputs({
    signal_in: 1.0  // tan(π/4) = 1, so output should be π/4 ≈ 0.785
});
console.log('Single input result:', singleResult);

// Dual input mode (atan2)
const dualResult = atanComponent.processInputs({
    signal_in_x: 1.0,
    signal_in_y: 1.0  // 45 degrees = π/4 radians
});
console.log('Dual input result:', dualResult);
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(1) for single calculation
- **Space Complexity**: O(1) for internal state
- **Update Rate**: ~60 FPS (16ms intervals)

### Memory Usage
- **State Variables**: 6 floating-point values
- **Total Memory**: ~48 bytes per component
- **Garbage Collection**: Minimal, no dynamic allocations

### Optimization Tips
- **Batch Processing**: Process multiple components together
- **Caching**: Cache frequently used angle calculations
- **Precision**: Use appropriate precision for your application

## Troubleshooting

### Common Issues

#### Incorrect Angle Output
```javascript
// Problem: Getting wrong quadrant
const angle = Math.atan2(y, x);  // Use atan2 for full range

// Problem: Angle in wrong units
const radians = Math.atan2(y, x);
const degrees = radians * (180 / Math.PI);  // Convert if needed
```

#### Signal Aggregation Problems
```javascript
// Problem: Multiple inputs not working
// Solution: Ensure proper signal aggregation logic
const aggregatedSignal = this.aggregateSignals(inputSignals);
```

#### Performance Issues
```javascript
// Problem: Too frequent updates
// Solution: Implement update throttling
if (currentTime - this.lastUpdateTime < this.updateInterval) {
    return this.outputSignal;
}
```

### Debug Techniques
```javascript
// Enable debug logging
class AtanComponent {
    constructor(debug = false) {
        this.debug = debug;
        // ... other initialization
    }

    processInputs(inputs) {
        if (this.debug) {
            console.log('Atan inputs:', inputs);
        }
        
        // ... processing logic
        
        if (this.debug) {
            console.log('Atan output:', this.outputSignal);
        }
    }
}
```

## Advanced Usage Patterns

### Angle Normalization
```javascript
// Normalize angle to [0, 2π] range
function normalizeAngle(angle) {
    while (angle < 0) angle += 2 * Math.PI;
    while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
    return angle;
}

const rawAngle = Math.atan2(y, x);
const normalizedAngle = normalizeAngle(rawAngle);
```

### Smooth Angle Interpolation
```javascript
// Smoothly interpolate between angles
function interpolateAngles(angle1, angle2, t) {
    const diff = angle2 - angle1;
    const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
    return angle1 + normalizedDiff * t;
}
```

### Angle Difference Calculation
```javascript
// Calculate shortest angular distance
function angleDifference(angle1, angle2) {
    const diff = angle2 - angle1;
    return Math.atan2(Math.sin(diff), Math.cos(diff));
}
```

## Mathematical References

### Trigonometric Identities
- `atan(x) = -atan(-x)` (odd function)
- `atan(x) + atan(1/x) = π/2` (for x > 0)
- `atan(x) + atan(1/x) = -π/2` (for x < 0)

### Atan2 Properties
- `atan2(y, x) = atan(y/x)` (when x > 0)
- `atan2(y, x) = atan(y/x) + π` (when x < 0 and y ≥ 0)
- `atan2(y, x) = atan(y/x) - π` (when x < 0 and y < 0)
- `atan2(y, x) = π/2` (when x = 0 and y > 0)
- `atan2(y, x) = -π/2` (when x = 0 and y < 0)

### Common Values
- `atan(0) = 0`
- `atan(1) = π/4 ≈ 0.785`
- `atan(∞) = π/2 ≈ 1.571`
- `atan(-∞) = -π/2 ≈ -1.571`

## Component Comparison

| Component | Function | Range | Use Case |
|-----------|----------|-------|----------|
| **Atan** | arctangent | [-π/2, π/2] | Single-value angle calculation |
| **Atan2** | arctangent2 | [-π, π] | Vector-based angle calculation |
| **Asin** | arcsine | [-π/2, π/2] | Sine-based angle calculation |
| **Acos** | arccosine | [0, π] | Cosine-based angle calculation |

## Integration with Other Systems

### Navigation Integration
```javascript
// Integrate with compass system
class CompassSystem {
    constructor() {
        this.atanComponent = new AtanComponent();
    }

    updateHeading(velocityX, velocityY) {
        const heading = this.atanComponent.processInputs({
            signal_in_x: velocityX,
            signal_in_y: velocityY
        });
        return this.normalizeHeading(heading);
    }
}
```

### Steering Integration
```javascript
// Integrate with steering system
class SteeringSystem {
    constructor() {
        this.atanComponent = new AtanComponent();
    }

    calculateSteeringAngle(targetX, targetY, currentX, currentY) {
        return this.atanComponent.processInputs({
            signal_in_x: targetX - currentX,
            signal_in_y: targetY - currentY
        });
    }
}
```

This comprehensive documentation provides everything needed to understand and implement the Atan component in Barotrauma's electrical system, from basic usage to advanced mathematical applications. 
