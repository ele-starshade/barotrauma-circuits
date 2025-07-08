# Barotrauma Cos Component Documentation

## Overview

The **Cos Component** (Cosine) is a mathematical signal processing component in Barotrauma's electrical system that calculates the cosine of an input angle. It's part of the trigonometric function family and is essential for creating oscillating signals, wave patterns, and circular motion calculations.

## Component Details

- **Identifier**: `coscomponent`
- **Category**: Electrical
- **Function**: TrigonometricFunctionComponent with `Cos` function
- **Color**: `#3d9d9e` (teal)
- **Base Price**: 100 marks
- **Difficulty Level**: 15

## Input/Output Pins

### Input Pins
- **`signal_in`** - Input angle in radians

### Output Pins
- **`signal_out`** - Cosine value of the input angle

## Mathematical Function

### Basic Operation
```
output = cos(input)
```

### Mathematical Properties
- **Domain**: All real numbers (-∞ to +∞)
- **Range**: [-1, 1]
- **Periodicity**: 2π radians (360°)
- **Symmetry**: cos(-x) = cos(x) (even function)

## Mathematical Properties

### Key Characteristics
- **Periodic**: Repeats every 2π radians
- **Even Function**: cos(-x) = cos(x)
- **Maximum**: cos(0) = 1, cos(2π) = 1, cos(4π) = 1, etc.
- **Minimum**: cos(π) = -1, cos(3π) = -1, cos(5π) = -1, etc.
- **Zeros**: cos(π/2) = 0, cos(3π/2) = 0, cos(5π/2) = 0, etc.

### Common Values
```javascript
// Key cosine values
cos(0) = 1           // Maximum
cos(π/6) = 0.866     // 30 degrees
cos(π/4) = 0.707     // 45 degrees
cos(π/3) = 0.5       // 60 degrees
cos(π/2) = 0         // 90 degrees (zero crossing)
cos(2π/3) = -0.5     // 120 degrees
cos(3π/4) = -0.707   // 135 degrees
cos(5π/6) = -0.866   // 150 degrees
cos(π) = -1          // 180 degrees (minimum)
cos(3π/2) = 0        // 270 degrees (zero crossing)
cos(2π) = 1          // 360 degrees (maximum)
```

### Trigonometric Identities
- **Pythagorean Identity**: cos²(x) + sin²(x) = 1
- **Double Angle**: cos(2x) = 2cos²(x) - 1
- **Sum Formula**: cos(x + y) = cos(x)cos(y) - sin(x)sin(y)
- **Difference Formula**: cos(x - y) = cos(x)cos(y) + sin(x)sin(y)

## Signal Processing Behavior

### Signal Aggregation
- **Multiple Inputs**: If multiple wires connect to the input, signals are aggregated using OR logic
- **Priority**: First signal received takes precedence
- **Time-based**: Component processes signals in real-time

### Error Handling
- **Invalid Inputs**: Handles NaN and infinite values gracefully
- **Output Clamping**: Output is automatically clamped to [-1, 1] range
- **Precision**: Uses high-precision mathematical calculations

## Real-World Applications

### Oscillating Systems
```javascript
// Create oscillating signal for pulsing lights
const time = Date.now() / 1000;  // Current time in seconds
const frequency = 2;  // 2 Hz oscillation
const amplitude = 0.5;  // Amplitude of oscillation
const offset = 0.5;  // Center the oscillation around 0.5

const oscillatingSignal = amplitude * Math.cos(2 * Math.PI * frequency * time) + offset;
// Output oscillates between 0 and 1
```

### Wave Generation
```javascript
// Generate sine wave for audio or visual effects
const time = Date.now() / 1000;
const frequency = 1;  // 1 Hz wave
const waveSignal = Math.cos(2 * Math.PI * frequency * time);
// Output: smooth wave between -1 and 1
```

### Circular Motion
```javascript
// Calculate X position in circular motion
const radius = 100;
const angularVelocity = 0.5;  // radians per second
const time = Date.now() / 1000;

const xPosition = radius * Math.cos(angularVelocity * time);
// Output: X coordinate of point moving in circle
```

### Phase Shifting
```javascript
// Create phase-shifted signals
const time = Date.now() / 1000;
const frequency = 1;
const phaseShift = Math.PI / 2;  // 90 degrees

const originalSignal = Math.cos(2 * Math.PI * frequency * time);
const shiftedSignal = Math.cos(2 * Math.PI * frequency * time + phaseShift);
// shiftedSignal is 90 degrees ahead of originalSignal
```

## Integration Examples

### With Adder Component
```javascript
// Create offset cosine wave
const time = Date.now() / 1000;
const baseSignal = Math.cos(2 * Math.PI * time);
const offset = 0.5;

const offsetSignal = baseSignal + offset;  // Adder component
// Output: cosine wave oscillating between -0.5 and 1.5
```

### With Multiplier Component
```javascript
// Amplify cosine signal
const time = Date.now() / 1000;
const baseSignal = Math.cos(2 * Math.PI * time);
const amplitude = 2.0;

const amplifiedSignal = baseSignal * amplitude;  // Multiplier component
// Output: cosine wave with amplitude 2 (range: -2 to 2)
```

### With Signal Check Component
```javascript
// Conditional cosine processing
const time = Date.now() / 1000;
const cosineSignal = Math.cos(2 * Math.PI * time);
const threshold = 0.5;

const isPositive = cosineSignal > threshold;  // Signal Check component
const processedSignal = isPositive ? cosineSignal : 0;
// Output: cosine signal only when above threshold
```

## JavaScript Implementation

```javascript
class CosComponent {
    constructor() {
        this.inputSignal = 0;
        this.outputSignal = 0;
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

        // Update input value with signal aggregation
        this.inputSignal = this.aggregateSignals(inputs.signal_in);

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

    // Calculate cosine output
    calculateOutput() {
        try {
            // Calculate cosine of input
            this.outputSignal = Math.cos(this.inputSignal);

            // Validate output
            if (isNaN(this.outputSignal) || !isFinite(this.outputSignal)) {
                this.outputSignal = 0;
            }

            // Clamp to valid range (though cosine is naturally bounded)
            this.outputSignal = Math.max(-1, Math.min(1, this.outputSignal));

        } catch (error) {
            console.error('Cosine calculation error:', error);
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
            inputSignal: this.inputSignal,
            outputSignal: this.outputSignal,
            lastUpdateTime: this.lastUpdateTime
        };
    }

    // Reset component state
    reset() {
        this.inputSignal = 0;
        this.outputSignal = 1; // cos(0) = 1
        this.lastUpdateTime = 0;
    }
}

// Usage examples
const cosComponent = new CosComponent();

// Basic cosine calculation
const basicResult = cosComponent.processInputs({
    signal_in: Math.PI / 2  // 90 degrees
});
console.log('Cosine of π/2:', basicResult);  // Should be 0

// Cosine of 0
const zeroResult = cosComponent.processInputs({
    signal_in: 0
});
console.log('Cosine of 0:', zeroResult);  // Should be 1

// Cosine of π
const piResult = cosComponent.processInputs({
    signal_in: Math.PI
});
console.log('Cosine of π:', piResult);  // Should be -1
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(1) for single calculation
- **Space Complexity**: O(1) for internal state
- **Update Rate**: ~60 FPS (16ms intervals)

### Memory Usage
- **State Variables**: 3 floating-point values
- **Total Memory**: ~24 bytes per component
- **Garbage Collection**: Minimal, no dynamic allocations

### Optimization Tips
- **Batch Processing**: Process multiple components together
- **Caching**: Cache frequently used cosine calculations
- **Precision**: Use appropriate precision for your application

## Troubleshooting

### Common Issues

#### Incorrect Output Values
```javascript
// Problem: Getting wrong cosine values
// Solution: Ensure input is in radians
const degrees = 90;
const radians = degrees * (Math.PI / 180);
const cosine = Math.cos(radians);  // Correct: cos(π/2) = 0
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
class CosComponent {
    constructor(debug = false) {
        this.debug = debug;
        // ... other initialization
    }

    processInputs(inputs) {
        if (this.debug) {
            console.log('Cos inputs:', inputs);
        }
        
        // ... processing logic
        
        if (this.debug) {
            console.log('Cos output:', this.outputSignal);
        }
    }
}
```

## Advanced Usage Patterns

### Frequency Modulation
```javascript
// Create frequency-modulated cosine wave
const time = Date.now() / 1000;
const baseFrequency = 1;
const modulationFrequency = 0.5;
const modulationDepth = 0.2;

const modulatedFrequency = baseFrequency + modulationDepth * Math.cos(2 * Math.PI * modulationFrequency * time);
const modulatedSignal = Math.cos(2 * Math.PI * modulatedFrequency * time);
```

### Amplitude Modulation
```javascript
// Create amplitude-modulated cosine wave
const time = Date.now() / 1000;
const carrierFrequency = 2;
const modulationFrequency = 0.5;
const modulationDepth = 0.5;

const carrier = Math.cos(2 * Math.PI * carrierFrequency * time);
const modulator = 1 + modulationDepth * Math.cos(2 * Math.PI * modulationFrequency * time);
const modulatedSignal = carrier * modulator;
```

### Harmonic Generation
```javascript
// Generate harmonic series
const time = Date.now() / 1000;
const fundamentalFrequency = 1;

const fundamental = Math.cos(2 * Math.PI * fundamentalFrequency * time);
const secondHarmonic = Math.cos(2 * Math.PI * 2 * fundamentalFrequency * time);
const thirdHarmonic = Math.cos(2 * Math.PI * 3 * fundamentalFrequency * time);

const harmonicSum = fundamental + 0.5 * secondHarmonic + 0.25 * thirdHarmonic;
```

## Mathematical References

### Trigonometric Identities
- **Pythagorean**: cos²(x) + sin²(x) = 1
- **Double Angle**: cos(2x) = 2cos²(x) - 1
- **Half Angle**: cos(x/2) = ±√[(1 + cos(x))/2]
- **Sum**: cos(x + y) = cos(x)cos(y) - sin(x)sin(y)
- **Difference**: cos(x - y) = cos(x)cos(y) + sin(x)sin(y)

### Series Expansion
```javascript
// Taylor series for cosine (for small angles)
function cosTaylor(x, terms = 5) {
    let result = 0;
    for (let n = 0; n < terms; n++) {
        const term = Math.pow(-1, n) * Math.pow(x, 2 * n) / factorial(2 * n);
        result += term;
    }
    return result;
}

function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

### Common Values Reference
```javascript
const CosValues = {
    ZERO: 1,           // cos(0) = 1
    PI_OVER_6: 0.866,  // cos(π/6) = √3/2
    PI_OVER_4: 0.707,  // cos(π/4) = 1/√2
    PI_OVER_3: 0.5,    // cos(π/3) = 1/2
    PI_OVER_2: 0,      // cos(π/2) = 0
    TWO_PI_OVER_3: -0.5, // cos(2π/3) = -1/2
    THREE_PI_OVER_4: -0.707, // cos(3π/4) = -1/√2
    FIVE_PI_OVER_6: -0.866, // cos(5π/6) = -√3/2
    PI: -1,            // cos(π) = -1
    THREE_PI_OVER_2: 0, // cos(3π/2) = 0
    TWO_PI: 1          // cos(2π) = 1
};
```

## Component Comparison

| Component | Function | Range | Use Case |
|-----------|----------|-------|----------|
| **Cos** | cosine | [-1, 1] | Oscillating signals, wave generation |
| **Sin** | sine | [-1, 1] | Oscillating signals, wave generation |
| **Tan** | tangent | (-∞, +∞) | Slope calculations, phase relationships |
| **Acos** | arccosine | [0, π] | Angle from cosine value |

## Integration with Other Systems

### Wave Generator Integration
```javascript
// Integrate with wave generation system
class WaveGenerator {
    constructor() {
        this.cosComponent = new CosComponent();
    }

    generateWave(frequency, amplitude, offset) {
        const time = Date.now() / 1000;
        const cosineSignal = this.cosComponent.processInputs({
            signal_in: 2 * Math.PI * frequency * time
        });
        return amplitude * cosineSignal + offset;
    }
}
```

### Oscillator Integration
```javascript
// Integrate with oscillator system
class Oscillator {
    constructor() {
        this.cosComponent = new CosComponent();
    }

    updateOscillation(frequency, phase = 0) {
        const time = Date.now() / 1000;
        return this.cosComponent.processInputs({
            signal_in: 2 * Math.PI * frequency * time + phase
        });
    }
}
```

This comprehensive documentation provides everything needed to understand and implement the Cos component in Barotrauma's electrical system, from basic trigonometric calculations to advanced wave generation applications. 
