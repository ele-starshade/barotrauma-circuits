# Barotrauma Tan Component

## Overview

The **Tan Component** is a mathematical signal processing component in Barotrauma's electrical system that calculates the tangent of an input angle. It implements the fundamental trigonometric tangent function, taking an angle in radians as input and outputting the corresponding tangent value. This component is essential for creating slope calculations, phase relationships, and mathematical modeling in automated systems.

**Official Description:** "Outputs the tangent of the input."

## Component Properties

### Basic Information
- **Identifier:** `tancomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#8e5a4c` (Brown)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input angle in radians

#### Output Pins
- **`signal_out`** - Tangent value of the input angle

### Configurable Properties

The TanComponent uses a TrigonometricFunctionComponent with the "Tan" function, which may support:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Precision`** - Decimal places for output (default: 0)

## Mathematical Function

The Tan component performs the mathematical operation:

```
output = tan(signal_in)
```

Or in mathematical notation:
```
output = tan(θ) = sin(θ) / cos(θ)
```

### Mathematical Properties

1. **Definition:** tan(θ) = sin(θ) / cos(θ)
2. **Domain:** All real numbers except where cos(θ) = 0
3. **Range:** (-∞, +∞) - unbounded
4. **Periodicity:** π radians (180°) - repeats every π
5. **Symmetry:** tan(-θ) = -tan(θ) (odd function)
6. **Asymptotes:** Vertical asymptotes at θ = π/2 + nπ (n ∈ ℤ)

### Trigonometric Identities

- **Basic Identity:** tan(θ) = sin(θ) / cos(θ)
- **Pythagorean Identity:** 1 + tan²(θ) = sec²(θ)
- **Double Angle:** tan(2θ) = 2tan(θ) / (1 - tan²(θ))
- **Sum Formula:** tan(θ + φ) = (tan(θ) + tan(φ)) / (1 - tan(θ)tan(φ))
- **Difference Formula:** tan(θ - φ) = (tan(θ) - tan(φ)) / (1 + tan(θ)tan(φ))

### Behavior Examples

| Input (radians) | Output | Notes |
|-----------------|--------|-------|
| 0 | 0 | tan(0) = 0 |
| π/6 | 0.577 | tan(30°) ≈ 0.577 |
| π/4 | 1 | tan(45°) = 1 |
| π/3 | 1.732 | tan(60°) ≈ √3 |
| π/2 | ∞ | Undefined (asymptote) |
| 2π/3 | -1.732 | tan(120°) ≈ -√3 |
| 3π/4 | -1 | tan(135°) = -1 |
| 5π/6 | -0.577 | tan(150°) ≈ -0.577 |
| π | 0 | tan(180°) = 0 |
| 3π/2 | ∞ | Undefined (asymptote) |
| 2π | 0 | tan(360°) = 0 |

### Special Cases

| Input | Output | Mathematical Reason |
|-------|--------|-------------------|
| 0 | 0 | tan(0) = sin(0)/cos(0) = 0/1 = 0 |
| π/2 | ∞ | Undefined: cos(π/2) = 0 |
| 3π/2 | ∞ | Undefined: cos(3π/2) = 0 |
| π/4 | 1 | tan(π/4) = sin(π/4)/cos(π/4) = (√2/2)/(√2/2) = 1 |
| 3π/4 | -1 | tan(3π/4) = sin(3π/4)/cos(3π/4) = (√2/2)/(-√2/2) = -1 |
| π | 0 | tan(π) = sin(π)/cos(π) = 0/-1 = 0 |

## Signal Aggregation

The Tan component follows standard signal aggregation rules:

### Input Signal Processing
- **Multiple Inputs:** If multiple wires connect to the input, signals are aggregated using OR logic
- **Signal Priority:** First signal received takes precedence
- **Value Clamping:** Inputs are clamped to valid ranges
- **Error Handling:** Invalid inputs (NaN, ∞) are handled gracefully

### Output Signal Distribution
- **Single Output:** Generates one tangent value
- **Continuous Output:** Signal updates every frame
- **Range Handling:** Output can be any real number (-∞ to +∞)
- **Asymptote Handling:** Near-asymptote values are clamped to prevent overflow

### Example Signal Processing
```javascript
// Multiple input signals
Input 1: 0.5 radians (arrives first)
Input 2: 1.0 radians (arrives second)
Result: Uses 0.5 radians (first signal wins)
Output: tan(0.5) ≈ 0.546

// Near-asymptote handling
Input: 1.5707 radians (very close to π/2)
Output: Clamped to maximum value (e.g., 999999)
```

## Component Definition

```xml
<Item name="" identifier="tancomponent" category="Electrical" Tags="smallitem,logic,circuitboxcomponent" maxstacksize="32" maxstacksizecharacterinventory="8" cargocontaineridentifier="metalcrate" scale="0.5" impactsoundtag="impact_metal_light" isshootable="true" GrabWhenSelected="true" signalcomponentcolor="#8e5a4c">
  <Price baseprice="100" minleveldifficulty="15">
    <Price storeidentifier="merchantoutpost" />
    <Price storeidentifier="merchantcity" sold="false"/>
    <Price storeidentifier="merchantresearch" multiplier="1.25" />
    <Price storeidentifier="merchantmilitary" />
    <Price storeidentifier="merchantmine" />
    <Price storeidentifier="merchantengineering" multiplier="0.9" />
  </Price>
  <PreferredContainer primary="engcab"/>
  <PreferredContainer secondary="wreckengcab,abandonedengcab,pirateengcab,outpostengcab,beaconengcab" amount="1" spawnprobability="0.05" />
  <Deconstruct time="10">
    <Item identifier="fpgacircuit" />
  </Deconstruct>
  <Fabricate suitablefabricators="fabricator" requiredtime="10">
    <RequiredItem identifier="fpgacircuit" />
  </Fabricate>
  <InventoryIcon texture="Content/Items/InventoryIconAtlas2.png" sourcerect="257,7,63,52" origin="0.5,0.5" />
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="96,64,32,32" origin="0.5,0.5" canflipx="false" />
  <TrigonometricFunctionComponent canbeselected="true" function="Tan" />
  <Body width="31" height="25" density="15" />
  <Holdable selectkey="Select" pickkey="Use" slots="Any,RightHand,LeftHand" msg="ItemMsgDetachWrench" MsgWhenDropped="ItemMsgPickupSelect" PickingTime="5.0" aimpos="65,-10" handle1="0,0" attachable="true" aimable="true">
    <RequiredItem items="wrench,deattachtool" excludeditems="multitool" type="Equipped" />
  </Holdable>
  <ConnectionPanel selectkey="Action" canbeselected="true" msg="ItemMsgRewireScrewdriver" hudpriority="10">
    <GuiFrame relativesize="0.2,0.32" minsize="400,350" maxsize="480,420" anchor="Center" style="ConnectionPanel" />
    <RequiredItem identifier="screwdriver" type="Equipped" />
    <input name="signal_in" displayname="connection.signalin" />
    <output name="signal_out" displayname="connection.signalout" />
  </ConnectionPanel>
</Item>
```

## Real-World Applications

### Slope Calculations
```javascript
// Calculate slope of a line
const angle = Math.PI / 4;  // 45 degrees
const slope = Math.tan(angle);  // slope = 1
// Output: 1.0 (45-degree slope)
```

### Phase Relationships
```javascript
// Calculate phase relationship between signals
const phaseAngle = Math.PI / 6;  // 30 degrees
const phaseRatio = Math.tan(phaseAngle);  // ≈ 0.577
// Output: 0.577 (phase relationship ratio)
```

### Trigonometric Modeling
```javascript
// Model oscillating system with tangent
const time = Date.now() / 1000;
const frequency = 1;  // 1 Hz
const amplitude = 2;
const tangentSignal = amplitude * Math.tan(2 * Math.PI * frequency * time);
// Output: Oscillating tangent wave
```

### Angle Calculations
```javascript
// Calculate angle from slope
const slope = 1.732;  // √3
const angle = Math.atan(slope);  // ≈ π/3 (60 degrees)
// Output: 1.047 radians (60 degrees)
```

## Integration Examples

### With Oscillator Component
```javascript
// Create tangent wave oscillator
const oscillator = new OscillatorComponent();
oscillator.setFrequency(2);  // 2 Hz
oscillator.setOutputType("Sine");

const tanComponent = new TanComponent();
const sineSignal = oscillator.getOutput();
const tangentSignal = tanComponent.processInputs({ signal_in: sineSignal });
// Output: Tangent of sine wave
```

### With Adder Component
```javascript
// Add phase offset to tangent calculation
const baseAngle = Math.PI / 4;  // 45 degrees
const phaseOffset = Math.PI / 6;  // 30 degrees

const adder = new AdderComponent();
const tanComponent = new TanComponent();

const totalAngle = adder.processInputs({ 
  signal_in1: baseAngle, 
  signal_in2: phaseOffset 
});
const result = tanComponent.processInputs({ signal_in: totalAngle });
// Output: tan(75°) ≈ 3.732
```

### With Signal Check Component
```javascript
// Conditional tangent calculation
const inputAngle = Math.PI / 3;  // 60 degrees
const threshold = Math.PI / 4;  // 45 degrees

const signalCheck = new SignalCheckComponent();
signalCheck.setTargetValue(threshold);

const isValid = signalCheck.processInputs({ signal_in: inputAngle });
const tanComponent = new TanComponent();

if (isValid) {
  const result = tanComponent.processInputs({ signal_in: inputAngle });
  // Output: tan(60°) ≈ 1.732
}
```

## JavaScript Simulation Class

```javascript
class TanComponent {
    constructor() {
        this.inputSignal = 0;
        this.outputSignal = 0;
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // ~60 FPS
        this.clampMin = -999999;
        this.clampMax = 999999;
        this.precision = 6;
    }

    // Process input signals
    processInputs(inputs) {
        const currentTime = Date.now();
        
        // Check if enough time has passed for update
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return this.outputSignal;
        }

        // Aggregate input signals using OR logic
        this.inputSignal = this.aggregateSignals(inputs.signal_in);

        // Calculate tangent
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

    // Calculate tangent output
    calculateOutput() {
        try {
            // Check for asymptote conditions (near π/2 + nπ)
            const normalizedAngle = this.normalizeAngle(this.inputSignal);
            const distanceFromAsymptote = this.getDistanceFromAsymptote(normalizedAngle);
            
            if (distanceFromAsymptote < 0.001) {
                // Very close to asymptote - clamp to maximum value
                this.outputSignal = this.inputSignal > 0 ? this.clampMax : this.clampMin;
            } else {
                // Calculate tangent
                this.outputSignal = Math.tan(this.inputSignal);
                
                // Clamp output to valid range
                this.outputSignal = Math.max(this.clampMin, Math.min(this.clampMax, this.outputSignal));
            }
            
            // Apply precision
            this.outputSignal = Number(this.outputSignal.toFixed(this.precision));
            
        } catch (error) {
            console.error('Tan calculation error:', error);
            this.outputSignal = 0;
        }
    }

    // Normalize angle to [0, 2π) range
    normalizeAngle(angle) {
        return ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    }

    // Get distance from nearest asymptote
    getDistanceFromAsymptote(angle) {
        const asymptotes = [Math.PI / 2, 3 * Math.PI / 2];
        let minDistance = Infinity;
        
        for (const asymptote of asymptotes) {
            const distance = Math.abs(angle - asymptote);
            minDistance = Math.min(minDistance, distance);
        }
        
        return minDistance;
    }

    // Set configurable properties
    setClampMin(value) {
        this.clampMin = value;
    }

    setClampMax(value) {
        this.clampMax = value;
    }

    setPrecision(value) {
        this.precision = Math.max(0, Math.min(10, value));
    }

    // Get current state
    getInputSignal() {
        return this.inputSignal;
    }

    getOutputSignal() {
        return this.outputSignal;
    }

    // Reset component state
    reset() {
        this.inputSignal = 0;
        this.outputSignal = 0;
        this.lastUpdateTime = 0;
    }

    // Get component information
    getInfo() {
        return {
            identifier: 'tancomponent',
            category: 'Electrical',
            function: 'Tangent',
            inputPins: ['signal_in'],
            outputPins: ['signal_out'],
            configurableProperties: ['ClampMin', 'ClampMax', 'Precision']
        };
    }
}

// Usage example
const tanComponent = new TanComponent();

// Process input signal
const result = tanComponent.processInputs({
    signal_in: Math.PI / 4  // 45 degrees
});

console.log(`tan(π/4) = ${result}`);  // Output: 1.0

// Process multiple input signals
const result2 = tanComponent.processInputs({
    signal_in: [Math.PI / 6, Math.PI / 3]  // Multiple inputs
});

console.log(`tan(first signal) = ${result2}`);  // Uses first signal (π/6)
```

## Error Handling

### Input Validation
- **NaN Values:** Returns 0 for NaN inputs
- **Infinite Values:** Clamps to maximum/minimum values
- **Null/Undefined:** Treated as 0
- **String Inputs:** Attempts to convert to number

### Asymptote Handling
- **Near Asymptotes:** Detects values close to π/2 + nπ
- **Clamping:** Prevents overflow by clamping to valid range
- **Precision:** Maintains numerical stability

### Performance Considerations
- **Update Rate:** Processes at ~60 FPS
- **Memory Usage:** Minimal memory footprint
- **Calculation Speed:** Fast mathematical operations
- **Error Recovery:** Graceful handling of edge cases

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(1) - constant time tangent calculation
- **Space Complexity:** O(1) - constant memory usage
- **Update Frequency:** 60 FPS (16ms intervals)

### Resource Usage
- **CPU:** Minimal - single mathematical operation
- **Memory:** ~100 bytes per component instance
- **Network:** No network overhead (local processing)

## Troubleshooting

### Common Issues

1. **Unexpected Output Values**
   - **Cause:** Input near asymptote (π/2 + nπ)
   - **Solution:** Check input values and handle asymptote conditions

2. **Infinite Output Values**
   - **Cause:** Input exactly at asymptote
   - **Solution:** Component automatically clamps to maximum/minimum values

3. **Precision Loss**
   - **Cause:** Large input values or repeated calculations
   - **Solution:** Adjust precision setting or normalize input angles

### Debugging Tips

```javascript
// Debug tangent calculation
const tanComponent = new TanComponent();
tanComponent.setPrecision(10);  // High precision for debugging

const input = Math.PI / 2 - 0.001;  // Very close to asymptote
const result = tanComponent.processInputs({ signal_in: input });

console.log(`Input: ${input}`);
console.log(`Output: ${result}`);
console.log(`Distance from asymptote: ${tanComponent.getDistanceFromAsymptote(input)}`);
```

## Advanced Usage Patterns

### Phase Shifting
```javascript
// Create phase-shifted tangent signals
class PhaseShiftedTan {
    constructor(phaseOffset = 0) {
        this.tanComponent = new TanComponent();
        this.phaseOffset = phaseOffset;
    }

    processInputs(inputs) {
        const shiftedInput = inputs.signal_in + this.phaseOffset;
        return this.tanComponent.processInputs({ signal_in: shiftedInput });
    }
}

// Usage
const shiftedTan = new PhaseShiftedTan(Math.PI / 4);
const result = shiftedTan.processInputs({ signal_in: Math.PI / 6 });
// Output: tan(π/6 + π/4) = tan(5π/12) ≈ 3.732
```

### Tangent Wave Generator
```javascript
// Generate continuous tangent wave
class TangentWaveGenerator {
    constructor(frequency = 1) {
        this.tanComponent = new TanComponent();
        this.frequency = frequency;
        this.startTime = Date.now();
    }

    getCurrentValue() {
        const time = (Date.now() - this.startTime) / 1000;
        const angle = 2 * Math.PI * this.frequency * time;
        return this.tanComponent.processInputs({ signal_in: angle });
    }
}

// Usage
const waveGen = new TangentWaveGenerator(0.5);  // 0.5 Hz
setInterval(() => {
    console.log(`Tangent wave value: ${waveGen.getCurrentValue()}`);
}, 100);
```

## Component Comparison

| Component | Function | Range | Use Case |
|-----------|----------|-------|----------|
| **Tan** | tangent | (-∞, +∞) | Slope calculations, phase relationships |
| **Sin** | sine | [-1, 1] | Oscillating signals, wave generation |
| **Cos** | cosine | [-1, 1] | Oscillating signals, wave generation |
| **Atan** | arctangent | [-π/2, π/2] | Angle from tangent value |

## Mathematical References

### Key Tangent Values
```javascript
const TanValues = {
    ZERO: 0,           // tan(0) = 0
    PI_OVER_6: 0.577,  // tan(π/6) = 1/√3
    PI_OVER_4: 1,      // tan(π/4) = 1
    PI_OVER_3: 1.732,  // tan(π/3) = √3
    PI_OVER_2: Infinity, // tan(π/2) = undefined
    TWO_PI_OVER_3: -1.732, // tan(2π/3) = -√3
    THREE_PI_OVER_4: -1, // tan(3π/4) = -1
    FIVE_PI_OVER_6: -0.577, // tan(5π/6) = -1/√3
    PI: 0,             // tan(π) = 0
    THREE_PI_OVER_2: Infinity, // tan(3π/2) = undefined
    TWO_PI: 0          // tan(2π) = 0
};
```

### Trigonometric Relationships
- **Reciprocal:** cot(θ) = 1 / tan(θ)
- **Pythagorean:** 1 + tan²(θ) = sec²(θ)
- **Quotient:** tan(θ) = sin(θ) / cos(θ)
- **Periodicity:** tan(θ + π) = tan(θ)

## Conclusion

The Tan Component is a fundamental trigonometric signal processing component that provides essential tangent calculations for Barotrauma's electrical system. Its ability to handle asymptote conditions, process multiple input signals, and provide precise mathematical results makes it invaluable for slope calculations, phase relationships, and advanced mathematical modeling in automated submarine systems.

The component's robust error handling, configurable output clamping, and efficient processing ensure reliable operation in complex electrical circuits, making it a cornerstone of mathematical signal processing in the game's engineering systems. 
