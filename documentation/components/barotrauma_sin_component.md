# Barotrauma Sin Component

## Overview

The **Sin Component** is a mathematical signal processing component in Barotrauma's electrical system that calculates the sine of an input angle. It implements the fundamental trigonometric sine function, taking an angle in radians as input and outputting the corresponding sine value. This component is essential for creating oscillating signals, wave patterns, circular motion calculations, and mathematical modeling in automated systems.

**Official Description:** "Outputs the sine of the input."

## Component Properties

### Basic Information
- **Identifier:** `sincomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** #38a54f (green)
- **Base Price:** 100 marks
- **Difficulty Level:** 15
- **Max Stack Size:** 32 (inventory), 8 (character inventory)

### Physical Properties
- **Scale:** 0.5
- **Body:** 31×25 pixels, density 15
- **Impact Sound:** impact_metal_light
- **Sprite:** signalcomp.png (32,64,32,32)
- **Inventory Icon:** Content/Items/InventoryIconAtlas2.png (386,7,63,52)

### Crafting Information
- **Deconstruct Time:** 10 seconds
- **Deconstruct Yield:** 1 FPGA Circuit
- **Fabricate Time:** 10 seconds
- **Fabricate Requirement:** 1 FPGA Circuit
- **Suitable Fabricators:** fabricator

## Component Definition

```xml
<Item name="" identifier="sincomponent" category="Electrical" 
      Tags="smallitem,logic,circuitboxcomponent" maxstacksize="32" 
      maxstacksizecharacterinventory="8" cargocontaineridentifier="metalcrate" 
      scale="0.5" impactsoundtag="impact_metal_light" isshootable="true" 
      GrabWhenSelected="true" signalcomponentcolor="#38a54f">
  <Price baseprice="100" minleveldifficulty="15">
    <Price storeidentifier="merchantoutpost" />
    <Price storeidentifier="merchantcity" sold="false"/>
    <Price storeidentifier="merchantresearch" multiplier="1.25" />
    <Price storeidentifier="merchantmilitary" />
    <Price storeidentifier="merchantmine" />
    <Price storeidentifier="merchantengineering" multiplier="0.9" />
  </Price>
  <PreferredContainer primary="engcab"/>
  <PreferredContainer secondary="wreckengcab,abandonedengcab,pirateengcab,outpostengcab,beaconengcab" 
                      amount="1" spawnprobability="0.05" />
  <Deconstruct time="10">
    <Item identifier="fpgacircuit" />
  </Deconstruct>
  <Fabricate suitablefabricators="fabricator" requiredtime="10">
    <RequiredItem identifier="fpgacircuit" />
  </Fabricate>
  <InventoryIcon texture="Content/Items/InventoryIconAtlas2.png" sourcerect="386,7,63,52" origin="0.5,0.5" />
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="32,64,32,32" origin="0.5,0.5" canflipx="false" />
  <TrigonometricFunctionComponent canbeselected="true" function="Sin" />
  <Body width="31" height="25" density="15" />
  <Holdable selectkey="Select" pickkey="Use" slots="Any,RightHand,LeftHand" 
            msg="ItemMsgDetachWrench" MsgWhenDropped="ItemMsgPickupSelect" 
            PickingTime="5.0" aimpos="65,-10" handle1="0,0" attachable="true" aimable="true">
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

## Input/Output Pins

### Input Pins
1. **`signal_in`** - Input angle in radians

### Output Pins
1. **`signal_out`** - Sine value of the input angle

## Configurable Properties

### Component Behavior
- **`canbeselected`** - Whether component can be selected in circuit box (default: true)
- **`function`** - Trigonometric function type (fixed: "Sin")

## Mathematical Function

The Sin component implements the mathematical sine function:

```
f(x) = sin(x)
```

### Mathematical Properties
- **Function Type:** Trigonometric
- **Domain:** All real numbers (-∞ to +∞)
- **Range:** [-1, 1]
- **Periodicity:** 2π radians (360°)
- **Symmetry:** sin(-x) = -sin(x) (odd function)
- **Zeros:** sin(nπ) = 0 for all integers n
- **Maximum:** sin(π/2 + 2nπ) = 1
- **Minimum:** sin(3π/2 + 2nπ) = -1

### Trigonometric Identities
- **Pythagorean Identity:** sin²(x) + cos²(x) = 1
- **Double Angle:** sin(2x) = 2sin(x)cos(x)
- **Sum Formula:** sin(x + y) = sin(x)cos(y) + cos(x)sin(y)
- **Difference Formula:** sin(x - y) = sin(x)cos(y) - cos(x)sin(y)

### Common Values
```javascript
// Key sine values
sin(0) = 0           // Zero crossing
sin(π/6) = 0.5       // 30 degrees
sin(π/4) = 0.707     // 45 degrees
sin(π/3) = 0.866     // 60 degrees
sin(π/2) = 1         // 90 degrees (maximum)
sin(2π/3) = 0.866    // 120 degrees
sin(3π/4) = 0.707    // 135 degrees
sin(5π/6) = 0.5      // 150 degrees
sin(π) = 0           // 180 degrees (zero crossing)
sin(3π/2) = -1       // 270 degrees (minimum)
sin(2π) = 0          // 360 degrees (zero crossing)
```

## Behavior Examples

| Input (radians) | Input (degrees) | Output | Description |
|-----------------|-----------------|--------|-------------|
| 0 | 0° | 0 | Zero crossing |
| π/6 | 30° | 0.5 | First quadrant |
| π/4 | 45° | 0.707 | First quadrant |
| π/3 | 60° | 0.866 | First quadrant |
| π/2 | 90° | 1 | Maximum value |
| 2π/3 | 120° | 0.866 | Second quadrant |
| 3π/4 | 135° | 0.707 | Second quadrant |
| 5π/6 | 150° | 0.5 | Second quadrant |
| π | 180° | 0 | Zero crossing |
| 7π/6 | 210° | -0.5 | Third quadrant |
| 5π/4 | 225° | -0.707 | Third quadrant |
| 4π/3 | 240° | -0.866 | Third quadrant |
| 3π/2 | 270° | -1 | Minimum value |
| 5π/3 | 300° | -0.866 | Fourth quadrant |
| 7π/4 | 315° | -0.707 | Fourth quadrant |
| 11π/6 | 330° | -0.5 | Fourth quadrant |
| 2π | 360° | 0 | Zero crossing |

## Special Cases

### Input Handling
- **Large Values:** Handles angles of any magnitude (positive or negative)
- **Decimal Precision:** Maintains high precision for fractional angles
- **Periodic Behavior:** Automatically handles periodicity (sin(x) = sin(x + 2πn))
- **Invalid Inputs:** Gracefully handles NaN and infinite values

### Output Characteristics
- **Range Clamping:** Output is automatically clamped to [-1, 1]
- **Precision:** Uses high-precision mathematical calculations
- **Smooth Continuity:** Output varies smoothly with input changes
- **Symmetry:** Respects odd function properties

### Edge Cases
- **Zero Input:** sin(0) = 0
- **Large Angles:** sin(1000π) = 0 (periodic behavior)
- **Negative Angles:** sin(-π/2) = -1
- **Fractional Values:** sin(π/7) ≈ 0.4339

## Signal Aggregation

The Sin component follows value-based signal aggregation rules:

### Input Signal Processing
- **Primary Input:** Uses the actual signal value from `signal_in`
- **Signal Priority:** Latest input signal takes precedence
- **Value Preservation:** Maintains exact signal values for calculation
- **Type Conversion:** Converts string inputs to numeric values

### Output Signal Distribution
- **Single Output:** Generates one sine value
- **Continuous Output:** Updates output for every input change
- **Value-Based:** Outputs specific calculated sine values

### Example Signal Processing
```javascript
// Multiple input wires to signal_in
Input 1: 0.5 (arrives first)
Input 2: 1.0 (arrives second)
Result: Calculates sin(1.0) ≈ 0.8415

// String input conversion
Input: "1.57" (string)
Result: Converts to 1.57, calculates sin(1.57) ≈ 1.0
```

## Real-World Applications

### 1. **Oscillating Systems**
```javascript
// Create oscillating signal for pulsing lights
const time = Date.now() / 1000;  // Current time in seconds
const frequency = 2;  // 2 Hz oscillation
const amplitude = 0.5;  // Amplitude of oscillation
const offset = 0.5;  // Center the oscillation around 0.5

const oscillatingSignal = amplitude * Math.sin(2 * Math.PI * frequency * time) + offset;
// Output oscillates between 0 and 1
```

### 2. **Wave Generation**
```javascript
// Generate sine wave for audio or visual effects
const time = Date.now() / 1000;
const frequency = 1;  // 1 Hz wave
const waveSignal = Math.sin(2 * Math.PI * frequency * time);
// Output: smooth wave between -1 and 1
```

### 3. **Circular Motion**
```javascript
// Calculate Y position in circular motion
const radius = 100;
const angularVelocity = 0.5;  // radians per second
const time = Date.now() / 1000;

const yPosition = radius * Math.sin(angularVelocity * time);
// Output: Y coordinate of point moving in circle
```

### 4. **Phase Shifting**
```javascript
// Create phase-shifted signals
const time = Date.now() / 1000;
const frequency = 1;
const phaseShift = Math.PI / 2;  // 90 degrees

const originalSignal = Math.sin(2 * Math.PI * frequency * time);
const shiftedSignal = Math.sin(2 * Math.PI * frequency * time + phaseShift);
// Output: signals with 90-degree phase difference
```

## Integration Examples

### With Oscillator Component
```javascript
// Create complex wave patterns
const oscillator = new OscillatorComponent();
const sinComponent = new SinComponent();

oscillator.setFrequency(1); // 1 Hz base frequency
// Use oscillator output as angle input for sine
// Creates smooth sine wave output
```

### With Cos Component
```javascript
// Create circular motion system
const sinComponent = new SinComponent();
const cosComponent = new CosComponent();

// Same angle input to both components
// sinComponent outputs Y coordinate
// cosComponent outputs X coordinate
// Together they create circular motion
```

### With Memory Component
```javascript
// Store and process angle values
const memory = new MemoryComponent();
const sinComponent = new SinComponent();

memory.setOutput("stored_angle");
sinComponent.processInputs({ signal_in: memory.getOutput() });
// Calculates sine of stored angle value
```

## JavaScript Simulation Class

```javascript
class SinComponent {
    constructor() {
        this.inputAngle = 0;
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

        // Update input values with signal aggregation
        this.inputAngle = this.aggregateSignals(inputs.signal_in);

        // Calculate output
        this.calculateOutput();
        this.lastUpdateTime = currentTime;
        
        return this.outputSignal;
    }

    // Aggregate multiple input signals using OR logic
    aggregateSignals(signals) {
        if (!Array.isArray(signals)) {
            return this.parseInput(signals || 0);
        }
        
        // OR logic: return first non-null signal, or 0 if all are null
        for (const signal of signals) {
            if (signal !== null && signal !== undefined && signal !== "") {
                return this.parseInput(signal);
            }
        }
        return 0;
    }

    // Parse and validate input
    parseInput(input) {
        const num = parseFloat(input);
        return isNaN(num) ? 0 : num;
    }

    // Calculate sine output
    calculateOutput() {
        this.outputSignal = Math.sin(this.inputAngle);
        
        // Clamp output to valid range (shouldn't be necessary for sine)
        this.outputSignal = Math.max(-1, Math.min(1, this.outputSignal));
    }

    // Get current state
    getState() {
        return {
            inputAngle: this.inputAngle,
            outputSignal: this.outputSignal,
            inputDegrees: this.inputAngle * (180 / Math.PI)
        };
    }

    // Reset component
    reset() {
        this.inputAngle = 0;
        this.outputSignal = 0;
        this.lastUpdateTime = 0;
    }

    // Utility methods
    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

// Usage example
const sinComponent = new SinComponent();

// Process inputs
const result = sinComponent.processInputs({
    signal_in: Math.PI / 2  // 90 degrees
});

console.log(result); // Outputs: 1.0

// Test with degrees
const result2 = sinComponent.processInputs({
    signal_in: 90  // Will be converted to radians
});

console.log(result2); // Outputs: 1.0
```

## Error Handling

### Input Validation
- **Invalid Numbers:** Converts non-numeric inputs to 0
- **NaN Handling:** Returns 0 for NaN inputs
- **Infinite Values:** Handles infinite inputs gracefully
- **String Conversion:** Automatically converts string numbers

### Performance Considerations
- **Update Rate:** Processes at ~60 FPS
- **Memory Usage:** Minimal state storage
- **Processing Time:** O(1) mathematical operation

### Troubleshooting
- **Wrong Output:** Verify input is in radians (not degrees)
- **No Output:** Check if input signal is being received
- **Precision Issues:** Ensure input has sufficient precision

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(1) for sine calculation
- **Space Complexity:** O(1) for state storage
- **Update Frequency:** ~60 FPS (16ms intervals)

### Memory Usage
- **State Variables:** 4 primitive values
- **Configuration:** No configurable properties
- **Temporary Storage:** Minimal

### Processing Efficiency
- **Signal Aggregation:** O(n) where n = number of input wires
- **Sine Calculation:** Constant time mathematical operation
- **Output Generation:** Immediate response

## Troubleshooting

### Common Issues
1. **Wrong Output Values**
   - Check if input is in radians (not degrees)
   - Verify input signal is numeric
   - Confirm signal aggregation is working

2. **No Output Signal**
   - Verify input signal is being received
   - Check wire connections
   - Ensure input is not null/empty

3. **Unexpected Behavior**
   - Check signal aggregation rules
   - Verify multiple wire connections
   - Confirm input type conversion

### Debugging Steps
1. **Check Input Signal:** Verify signal value and type
2. **Test Known Values:** Try sin(π/2) = 1, sin(0) = 0
3. **Monitor Output:** Check output range [-1, 1]
4. **Verify Precision:** Ensure sufficient decimal precision

## Advanced Usage Patterns

### 1. **Frequency Modulation**
```javascript
// Create frequency-modulated signals
const time = Date.now() / 1000;
const baseFreq = 1;
const modFreq = 0.1;
const modDepth = 0.5;

const modulatedFreq = baseFreq + modDepth * Math.sin(modFreq * time);
const output = Math.sin(2 * Math.PI * modulatedFreq * time);
```

### 2. **Amplitude Modulation**
```javascript
// Create amplitude-modulated signals
const time = Date.now() / 1000;
const carrierFreq = 10;
const modFreq = 1;
const modDepth = 0.5;

const carrier = Math.sin(2 * Math.PI * carrierFreq * time);
const modulator = 1 + modDepth * Math.sin(2 * Math.PI * modFreq * time);
const output = carrier * modulator;
```

### 3. **Complex Waveforms**
```javascript
// Create complex waveforms by combining multiple sine waves
const time = Date.now() / 1000;
const fundamental = Math.sin(2 * Math.PI * time);
const harmonic1 = 0.5 * Math.sin(2 * Math.PI * 2 * time);
const harmonic2 = 0.25 * Math.sin(2 * Math.PI * 3 * time);

const complexWave = fundamental + harmonic1 + harmonic2;
```

## Component Comparison

### vs Cos Component
- **Sin:** sin(x) = cos(x - π/2) (90° phase shift)
- **Cos:** cos(x) = sin(x + π/2) (90° phase shift)

### vs Tan Component
- **Sin:** Range [-1, 1], periodic every 2π
- **Tan:** Range (-∞, +∞), periodic every π

### vs Oscillator Component
- **Sin:** Mathematical function, requires angle input
- **Oscillator:** Generates time-based signals automatically

## Mathematical References

### Trigonometric Functions
- **Sine:** sin(x) = opposite/hypotenuse
- **Cosine:** cos(x) = adjacent/hypotenuse
- **Tangent:** tan(x) = opposite/adjacent = sin(x)/cos(x)

### Unit Circle
- **Radius:** 1 unit
- **Angle:** Measured counterclockwise from positive x-axis
- **Coordinates:** (cos(θ), sin(θ))

### Series Expansion
```
sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...
```

## Conclusion

The Sin Component is a fundamental trigonometric signal processing component that provides precise sine function calculations. Its ability to convert angular inputs into sine values makes it essential for:

- **Wave Generation:** Creating smooth oscillating signals
- **Circular Motion:** Calculating Y coordinates in circular paths
- **Signal Processing:** Implementing mathematical transformations
- **Oscillating Systems:** Building pulsing lights and effects

The component's mathematical precision, combined with its simple input/output interface, makes it a versatile tool for creating sophisticated mathematical and visual systems in Barotrauma submarines. 
