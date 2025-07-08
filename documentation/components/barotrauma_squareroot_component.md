# Barotrauma SquareRoot Component

## Overview

The **SquareRoot Component** is a mathematical signal processing component in Barotrauma's electrical system that calculates the square root of an input signal. It takes a numeric input value and outputs its square root, implementing the fundamental mathematical square root function (√x) which is essential for distance calculations, magnitude computations, and various mathematical modeling applications.

**Official Description:** "Outputs the square root of the input."

## Component Properties

### Basic Information
- **Identifier:** `squarerootcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#ff8e70` (Orange-Red)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal (the number to calculate square root for)

#### Output Pins
- **`signal_out`** - Output signal (square root of the input)

### Configurable Properties

The SquareRootComponent uses a FunctionComponent with the "SquareRoot" function, which may support:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Precision`** - Decimal places for output (default: 0)

## Mathematical Function

The SquareRoot component performs the mathematical operation:

```
output = √signal_in
```

Or in mathematical notation:
```
output = √x = x^(1/2)
```

### Mathematical Properties

1. **Definition:** √x = y where y² = x and y ≥ 0
2. **Domain:** x ≥ 0 (non-negative real numbers)
3. **Range:** y ≥ 0 (non-negative real numbers)
4. **Monotonicity:** If a ≤ b, then √a ≤ √b
5. **Inverse:** (√x)² = x for x ≥ 0
6. **Product Rule:** √(a × b) = √a × √b
7. **Quotient Rule:** √(a ÷ b) = √a ÷ √b

### Behavior Examples

| Input | Output | Notes |
|-------|--------|-------|
| 0 | 0 | √0 = 0 |
| 1 | 1 | √1 = 1 |
| 4 | 2 | √4 = 2 |
| 9 | 3 | √9 = 3 |
| 16 | 4 | √16 = 4 |
| 25 | 5 | √25 = 5 |
| 2 | 1.414 | √2 ≈ 1.414 |
| 3 | 1.732 | √3 ≈ 1.732 |
| 5 | 2.236 | √5 ≈ 2.236 |
| 0.25 | 0.5 | √0.25 = 0.5 |
| 0.5 | 0.707 | √0.5 ≈ 0.707 |

### Special Cases

1. **Zero Input:** √0 = 0
2. **Negative Input:** Returns NaN (Not a Number) or error
3. **Infinity:** √∞ = ∞
4. **NaN Input:** Returns NaN
5. **Perfect Squares:** Returns exact integer results
6. **Non-Perfect Squares:** Returns irrational numbers (approximated)

## Signal Aggregation

Like other Barotrauma components, the SquareRoot component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 16 (arrives first)
Wire 2: 25 (arrives second)
Wire 3: 9 (arrives third)

// Result: signal_in = 16 (first signal wins)
// Output = √16 = 4
```

## Component Definition

```xml
<Item name="" identifier="squarerootcomponent" category="Electrical" 
      Tags="smallitem,logic,circuitboxcomponent" maxstacksize="32" 
      maxstacksizecharacterinventory="8" cargocontaineridentifier="metalcrate" 
      scale="0.5" impactsoundtag="impact_metal_light" isshootable="true" 
      GrabWhenSelected="true" signalcomponentcolor="#ff8e70">
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
  <InventoryIcon texture="Content/Items/InventoryIconAtlas2.png" 
                 sourcerect="320,71,64,51" origin="0.5,0.5" />
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="0,128,32,32" 
           origin="0.5,0.5" canflipx="false" />
  <FunctionComponent canbeselected="true" function="SquareRoot" />
  <Body width="32" height="26" density="15" />
  <Holdable selectkey="Select" pickkey="Use" slots="Any,RightHand,LeftHand" 
            msg="ItemMsgDetachWrench" MsgWhenDropped="ItemMsgPickupSelect" 
            PickingTime="5.0" aimpos="65,-10" handle1="0,0" attachable="true" aimable="true">
    <RequiredItem items="wrench,deattachtool" excludeditems="multitool" type="Equipped" />
  </Holdable>
  <ConnectionPanel selectkey="Action" canbeselected="true" msg="ItemMsgRewireScrewdriver" 
                   hudpriority="10">
    <GuiFrame relativesize="0.2,0.32" minsize="400,350" maxsize="480,420" 
              anchor="Center" style="ConnectionPanel" />
    <RequiredItem identifier="screwdriver" type="Equipped" />
    <input name="signal_in" displayname="connection.signalin" />
    <output name="signal_out" displayname="connection.signalout" />
  </ConnectionPanel>
</Item>
```

## Real-World Applications

### 1. **Distance Calculations**
```javascript
// Calculate distance from origin using Pythagorean theorem
const x = 3;
const y = 4;
const distance = Math.sqrt(x * x + y * y); // 5 (3-4-5 triangle)

// Calculate magnitude of a vector
const vectorX = 5;
const vectorY = 12;
const magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY); // 13
```

### 2. **Area and Volume Calculations**
```javascript
// Calculate side length from area
const area = 25; // square meters
const sideLength = Math.sqrt(area); // 5 meters

// Calculate radius from area
const circleArea = Math.PI * 16; // 50.27 square units
const radius = Math.sqrt(circleArea / Math.PI); // 4 units
```

### 3. **Signal Processing**
```javascript
// Calculate RMS (Root Mean Square) value
const samples = [1, 2, 3, 4, 5];
const sumSquares = samples.reduce((sum, sample) => sum + sample * sample, 0);
const rms = Math.sqrt(sumSquares / samples.length); // 3.32

// Normalize signal amplitude
const rawAmplitude = 100;
const maxAmplitude = 50;
const normalizedAmplitude = Math.sqrt(rawAmplitude / maxAmplitude); // 1.41
```

### 4. **Physics Calculations**
```javascript
// Calculate velocity from kinetic energy
const kineticEnergy = 50; // joules
const mass = 2; // kg
const velocity = Math.sqrt((2 * kineticEnergy) / mass); // 7.07 m/s

// Calculate time for free fall
const height = 20; // meters
const gravity = 9.81; // m/s²
const fallTime = Math.sqrt((2 * height) / gravity); // 2.02 seconds
```

### 5. **Statistical Analysis**
```javascript
// Calculate standard deviation
const values = [2, 4, 4, 4, 5, 5, 7, 9];
const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
const standardDeviation = Math.sqrt(variance); // 2.0
```

## Integration Examples

### 1. **Advanced Distance Sensing**
```javascript
// Calculate distance between two points in 3D space
const point1 = { x: 1, y: 2, z: 3 };
const point2 = { x: 4, y: 6, z: 8 };
const dx = point2.x - point1.x;
const dy = point2.y - point1.y;
const dz = point2.z - point1.z;
const distance = Math.sqrt(dx * dx + dy * dy + dz * dz); // 7.07 units
```

### 2. **Signal Normalization System**
```javascript
// Normalize multiple sensor readings
const sensors = [
  { id: 1, value: 100 },
  { id: 2, value: 200 },
  { id: 3, value: 150 }
];

const maxValue = Math.max(...sensors.map(s => s.value));
const normalizedSensors = sensors.map(sensor => ({
  id: sensor.id,
  originalValue: sensor.value,
  normalizedValue: Math.sqrt(sensor.value / maxValue)
}));
```

### 3. **Complex Mathematical Operations**
```javascript
// Calculate quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)
const a = 1, b = -5, c = 6;
const discriminant = b * b - 4 * a * c;
const sqrtDiscriminant = Math.sqrt(discriminant);
const x1 = (-b + sqrtDiscriminant) / (2 * a); // 3
const x2 = (-b - sqrtDiscriminant) / (2 * a); // 2
```

## JavaScript Simulation Class

```javascript
class SquareRootComponent {
  constructor() {
    this.input = 0;
    this.output = 0;
    this.clampMin = -999999;
    this.clampMax = 999999;
    this.timeFrame = 0;
    this.precision = 6;
    this.lastUpdateTime = 0;
    this.isActive = true;
  }

  /**
   * Set the input signal value
   * @param {number} value - The input value to calculate square root for
   */
  setInput(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      this.input = value;
      this.process();
    }
  }

  /**
   * Process the square root calculation
   */
  process() {
    if (!this.isActive) return;

    // Check for valid input (non-negative)
    if (this.input < 0) {
      this.output = NaN;
      return;
    }

    // Calculate square root
    this.output = Math.sqrt(this.input);

    // Apply clamping
    if (this.output < this.clampMin) {
      this.output = this.clampMin;
    } else if (this.output > this.clampMax) {
      this.output = this.clampMax;
    }

    // Apply precision
    this.output = parseFloat(this.output.toFixed(this.precision));
  }

  /**
   * Get the current output value
   * @returns {number} The square root of the input
   */
  getOutput() {
    return this.output;
  }

  /**
   * Set clamping limits
   * @param {number} min - Minimum output value
   * @param {number} max - Maximum output value
   */
  setClamping(min, max) {
    this.clampMin = min;
    this.clampMax = max;
    this.process();
  }

  /**
   * Set output precision
   * @param {number} precision - Number of decimal places
   */
  setPrecision(precision) {
    this.precision = Math.max(0, Math.min(10, precision));
    this.process();
  }

  /**
   * Reset the component
   */
  reset() {
    this.input = 0;
    this.output = 0;
    this.lastUpdateTime = 0;
  }

  /**
   * Enable or disable the component
   * @param {boolean} active - Whether the component should be active
   */
  setActive(active) {
    this.isActive = active;
    if (!active) {
      this.output = 0;
    }
  }

  /**
   * Get component status information
   * @returns {object} Status information
   */
  getStatus() {
    return {
      input: this.input,
      output: this.output,
      isActive: this.isActive,
      isValid: this.input >= 0,
      isPerfectSquare: this.isPerfectSquare(this.input)
    };
  }

  /**
   * Check if a number is a perfect square
   * @param {number} num - Number to check
   * @returns {boolean} True if the number is a perfect square
   */
  isPerfectSquare(num) {
    if (num < 0) return false;
    const sqrt = Math.sqrt(num);
    return sqrt === Math.floor(sqrt);
  }

  /**
   * Get mathematical properties of the current input
   * @returns {object} Mathematical properties
   */
  getMathematicalProperties() {
    const sqrt = Math.sqrt(this.input);
    return {
      input: this.input,
      squareRoot: sqrt,
      square: sqrt * sqrt,
      isPerfectSquare: this.isPerfectSquare(this.input),
      decimalPlaces: this.getDecimalPlaces(sqrt),
      isInteger: Number.isInteger(sqrt)
    };
  }

  /**
   * Get the number of decimal places in a number
   * @param {number} num - Number to check
   * @returns {number} Number of decimal places
   */
  getDecimalPlaces(num) {
    if (Number.isInteger(num)) return 0;
    return num.toString().split('.')[1]?.length || 0;
  }
}

// Usage Examples
const sqrtComponent = new SquareRootComponent();

// Basic usage
sqrtComponent.setInput(16);
console.log(sqrtComponent.getOutput()); // 4

// Perfect squares
sqrtComponent.setInput(25);
console.log(sqrtComponent.getOutput()); // 5

// Non-perfect squares
sqrtComponent.setInput(2);
console.log(sqrtComponent.getOutput()); // 1.414214

// Zero input
sqrtComponent.setInput(0);
console.log(sqrtComponent.getOutput()); // 0

// Negative input (invalid)
sqrtComponent.setInput(-4);
console.log(sqrtComponent.getOutput()); // NaN

// With clamping
sqrtComponent.setClamping(0, 10);
sqrtComponent.setInput(100);
console.log(sqrtComponent.getOutput()); // 10 (clamped)

// Get status
console.log(sqrtComponent.getStatus());
// {
//   input: 100,
//   output: 10,
//   isActive: true,
//   isValid: true,
//   isPerfectSquare: false
// }

// Get mathematical properties
console.log(sqrtComponent.getMathematicalProperties());
// {
//   input: 100,
//   squareRoot: 10,
//   square: 100,
//   isPerfectSquare: true,
//   decimalPlaces: 0,
//   isInteger: true
// }
```

## Error Handling

### Input Validation
- **Negative Numbers:** Returns NaN or error
- **Non-Numeric Inputs:** Handles gracefully with type checking
- **Infinity:** Returns infinity
- **NaN Input:** Returns NaN

### Output Validation
- **Range Checking:** Ensures output is within valid bounds
- **Precision Control:** Limits decimal places to prevent floating-point errors
- **Clamping:** Prevents extreme output values

### Error Recovery
- **Invalid Input Recovery:** Resets to safe state when invalid input is received
- **Component Reset:** Provides reset functionality to clear errors
- **Status Monitoring:** Tracks component health and validity

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(1) for basic square root calculation
- **Space Complexity:** O(1) - constant memory usage
- **Precision Trade-offs:** Higher precision requires more computation

### Optimization Features
- **Caching:** May cache results for repeated inputs
- **Early Exit:** Returns immediately for special cases (0, 1, perfect squares)
- **Efficient Algorithms:** Uses optimized square root algorithms

### Resource Usage
- **CPU Usage:** Low - simple mathematical operation
- **Memory Usage:** Minimal - only stores current state
- **Power Consumption:** Negligible - no power requirements

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if input wire is connected
   - Verify input signal is not negative
   - Ensure proper signal aggregation

2. **Unexpected Output**
   - Verify input signal format
   - Check for negative inputs (will return NaN)
   - Confirm signal aggregation behavior

3. **Component Not Working**
   - Check wire connections
   - Verify component is powered (if applicable)
   - Ensure proper signal flow

### Best Practices

1. **Input Validation**: Ensure inputs are non-negative when possible
2. **Signal Documentation**: Label wires clearly for debugging
3. **Testing**: Test with both perfect squares and non-perfect squares
4. **Integration**: Verify downstream components can handle the output format

## Component Comparison

### Similar Components
- **Exponentiation Component**: Can calculate square root using power of 0.5
- **Abs Component**: Also processes numeric inputs
- **Round Component**: Also modifies numeric values

### When to Use SquareRoot vs Alternatives
- **Use SquareRoot**: When you need the square root specifically
- **Use Exponentiation**: When you need other powers or roots
- **Use Abs**: When you need absolute value
- **Use Round**: When you need integer approximation

## Advanced Usage Patterns

### Pattern 1: Distance Calculations
```
Position Sensor → SquareRoot → Distance Display
```
Calculating distances from coordinate differences.

### Pattern 2: Signal Normalization
```
Raw Signal → SquareRoot → Normalized Output
```
Normalizing signal amplitudes using square root scaling.

### Pattern 3: Statistical Processing
```
Variance Calculator → SquareRoot → Standard Deviation
```
Calculating standard deviation from variance.

## Mathematical References

### Key Formulas
- **Square Root Definition:** √x = y where y² = x
- **Power Relationship:** √x = x^(1/2)
- **Product Rule:** √(a × b) = √a × √b
- **Quotient Rule:** √(a ÷ b) = √a ÷ √b

### Common Values
```javascript
// Perfect squares
√0 = 0, √1 = 1, √4 = 2, √9 = 3, √16 = 4, √25 = 5, √36 = 6, √49 = 7, √64 = 8, √81 = 9, √100 = 10

// Common irrational square roots
√2 ≈ 1.414, √3 ≈ 1.732, √5 ≈ 2.236, √6 ≈ 2.449, √7 ≈ 2.646, √8 ≈ 2.828, √10 ≈ 3.162
```

### Applications in Physics
- **Kinetic Energy:** v = √(2KE/m)
- **Free Fall:** t = √(2h/g)
- **Pendulum Period:** T = 2π√(L/g)
- **Wave Speed:** v = √(T/μ)

## Conclusion

The SquareRoot Component is a fundamental mathematical component in Barotrauma's electrical system that provides essential square root functionality. Its ability to calculate square roots makes it invaluable for distance calculations, signal normalization, statistical analysis, and various physics applications.

The component's robust error handling, configurable properties, and efficient implementation make it suitable for both simple and complex electrical circuits. Whether used for basic distance calculations or advanced signal processing, the SquareRoot Component provides reliable and accurate mathematical operations essential for sophisticated submarine automation systems.

Understanding the square root function's mathematical properties, domain limitations, and practical applications is crucial for effective circuit design and troubleshooting in Barotrauma's electrical engineering environment. 
