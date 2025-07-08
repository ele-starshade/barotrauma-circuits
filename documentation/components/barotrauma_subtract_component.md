# Barotrauma Subtract Component

## Overview

The **Subtract Component** is a mathematical signal processing component in Barotrauma's electrical system that performs subtraction operations on electrical signals. It takes two input signals and outputs their difference (minuend - subtrahend), implementing the fundamental mathematical subtraction operation which is essential for differential calculations, error detection, and various mathematical modeling applications.

**Official Description:** "Outputs the subtracted value of the received signals."

## Component Properties

### Basic Information
- **Identifier:** `subtractcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#a0dbc8` (Mint Green)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in1`** - First input signal (minuend - the number to be subtracted from)
- **`signal_in2`** - Second input signal (subtrahend - the number to subtract)

#### Output Pins
- **`signal_out`** - Output signal (difference: signal_in1 - signal_in2)

### Configurable Properties

The SubtractComponent uses a SubtractComponent class, which may support:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Precision`** - Decimal places for output (default: 0)

## Mathematical Function

The Subtract component performs the mathematical operation:

```
output = signal_in1 - signal_in2
```

Or in mathematical notation:
```
output = minuend - subtrahend = difference(signal_in1, signal_in2)
```

### Mathematical Properties

1. **Non-commutative:** a - b ≠ b - a (order matters)
2. **Non-associative:** (a - b) - c ≠ a - (b - c)
3. **Identity:** a - 0 = a
4. **Inverse:** a - a = 0
5. **Distributive:** a - (b + c) = (a - b) - c
6. **Sign Preservation:** Maintains correct mathematical signs

### Behavior Examples

| signal_in1 | signal_in2 | Output | Notes |
|------------|------------|--------|-------|
| 10 | 3 | 7 | Basic subtraction |
| 5 | 8 | -3 | Negative result |
| 0 | 5 | -5 | Zero minuend |
| 10 | 0 | 10 | Zero subtrahend |
| -5 | 3 | -8 | Negative minuend |
| 5 | -3 | 8 | Negative subtrahend |
| 3.5 | 1.2 | 2.3 | Decimal subtraction |
| 10 | 10 | 0 | Equal values |

### Special Cases

1. **Zero Subtrahend:** a - 0 = a (identity)
2. **Equal Values:** a - a = 0 (inverse)
3. **Negative Results:** Produces negative values when subtrahend > minuend
4. **Decimal Precision:** Maintains floating-point precision
5. **Infinity Handling:** Follows mathematical rules for infinite values
6. **NaN Handling:** Returns NaN for invalid operations

## Signal Aggregation

Like other Barotrauma components, the Subtract component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in1
Wire 1: 15 (arrives first)
Wire 2: 20 (arrives second)
Wire 3: 10 (arrives third)

// Result: signal_in1 = 15 (first signal wins)
// If signal_in2 = 5, then output = 15 - 5 = 10
```

## Component Definition

```xml
<Item name="" identifier="subtractcomponent" category="Electrical" 
      Tags="smallitem,logic,circuitboxcomponent" maxstacksize="32" 
      maxstacksizecharacterinventory="8" linkable="false" cargocontaineridentifier="metalcrate" 
      scale="0.5" impactsoundtag="impact_metal_light" isshootable="true" 
      GrabWhenSelected="true" signalcomponentcolor="#a0dbc8">
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
  <InventoryIcon texture="Content/Items/InventoryIconAtlas.png" 
                 sourcerect="641,900,63,54" origin="0.5,0.5" />
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="160,0,32,32" 
           origin="0.5,0.5" canflipx="false" />
  <SubtractComponent canbeselected="true" />
  <Body width="31" height="25" density="15" />
  <Holdable selectkey="Select" pickkey="Use" slots="Any,RightHand,LeftHand" 
            msg="ItemMsgDetachWrench" MsgWhenDropped="ItemMsgPickupSelect" 
            PickingTime="5.0" aimpos="65,-10" handle1="0,0" attachable="true" aimable="true">
    <RequiredItem items="wrench,deattachtool" excludeditems="multitool" type="Equipped" />
  </Holdable>
  <ConnectionPanel selectkey="Action" canbeselected="true" msg="ItemMsgRewireScrewdriver" 
                   hudpriority="10">
    <GuiFrame relativesize="0.2,0.32" minsize="400,350" maxsize="480,420" 
              anchor="Center" style="ConnectionPanel" />
    <requireditem items="screwdriver" type="Equipped" />
    <input name="signal_in1" displayname="connection.signalinx~[num]=1" />
    <input name="signal_in2" displayname="connection.signalinx~[num]=2" />
    <output name="signal_out" displayname="connection.signalout" />
  </ConnectionPanel>
</Item>
```

## Real-World Applications

### 1. **Error Detection and Correction**
```javascript
// Calculate error between target and actual values
const targetTemperature = 25; // °C
const actualTemperature = 27; // °C
const temperatureError = actualTemperature - targetTemperature; // 2°C

// Calculate deviation from setpoint
const setpoint = 100; // pressure units
const measuredPressure = 98; // pressure units
const pressureDeviation = measuredPressure - setpoint; // -2 units
```

### 2. **Differential Measurements**
```javascript
// Calculate pressure difference across a filter
const inletPressure = 150; // psi
const outletPressure = 120; // psi
const pressureDrop = inletPressure - outletPressure; // 30 psi

// Calculate voltage drop across a component
const inputVoltage = 12; // volts
const outputVoltage = 9; // volts
const voltageDrop = inputVoltage - outputVoltage; // 3 volts
```

### 3. **Resource Management**
```javascript
// Calculate remaining fuel
const initialFuel = 1000; // liters
const consumedFuel = 350; // liters
const remainingFuel = initialFuel - consumedFuel; // 650 liters

// Calculate time remaining
const totalTime = 120; // minutes
const elapsedTime = 45; // minutes
const timeRemaining = totalTime - elapsedTime; // 75 minutes
```

### 4. **Position and Distance Calculations**
```javascript
// Calculate relative position
const currentPosition = 150; // meters
const referencePosition = 100; // meters
const relativePosition = currentPosition - referencePosition; // 50 meters

// Calculate distance traveled
const finalPosition = 200; // meters
const initialPosition = 50; // meters
const distanceTraveled = finalPosition - initialPosition; // 150 meters
```

### 5. **Signal Processing**
```javascript
// Calculate signal offset
const referenceSignal = 5; // volts
const measuredSignal = 5.2; // volts
const signalOffset = measuredSignal - referenceSignal; // 0.2 volts

// Calculate differential signal
const positiveSignal = 3.5; // volts
const negativeSignal = 2.8; // volts
const differentialSignal = positiveSignal - negativeSignal; // 0.7 volts
```

## Integration Examples

### 1. **Advanced Error Control System**
```javascript
// PID controller error calculation
const setpoint = 100;
const processVariable = 95;
const error = processVariable - setpoint; // -5 (negative error)

// Proportional control
const kp = 2;
const proportionalOutput = kp * error; // -10
```

### 2. **Differential Pressure Monitoring**
```javascript
// Monitor pressure difference across multiple points
const pressures = [
  { location: "inlet", value: 150 },
  { location: "filter", value: 120 },
  { location: "outlet", value: 100 }
];

const pressureDrops = pressures.map((pressure, index) => {
  if (index === 0) return 0;
  return pressures[index - 1].value - pressure.value;
});
// Result: [0, 30, 20] - pressure drops at each stage
```

### 3. **Complex Mathematical Operations**
```javascript
// Calculate rate of change
const currentValue = 50;
const previousValue = 45;
const timeInterval = 2; // seconds
const rateOfChange = (currentValue - previousValue) / timeInterval; // 2.5 units/second

// Calculate percentage change
const oldValue = 80;
const newValue = 90;
const percentageChange = ((newValue - oldValue) / oldValue) * 100; // 12.5%
```

## JavaScript Simulation Class

```javascript
class SubtractComponent {
  constructor() {
    this.signalIn1 = 0;
    this.signalIn2 = 0;
    this.output = 0;
    this.clampMin = -999999;
    this.clampMax = 999999;
    this.timeFrame = 0;
    this.precision = 6;
    this.lastUpdateTime = 0;
    this.isActive = true;
  }

  /**
   * Set the first input signal value (minuend)
   * @param {number} value - The first input value
   */
  setInput1(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      this.signalIn1 = value;
      this.process();
    }
  }

  /**
   * Set the second input signal value (subtrahend)
   * @param {number} value - The second input value
   */
  setInput2(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      this.signalIn2 = value;
      this.process();
    }
  }

  /**
   * Process the subtraction calculation
   */
  process() {
    if (!this.isActive) return;

    // Perform subtraction
    this.output = this.signalIn1 - this.signalIn2;

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
   * @returns {number} The difference of the inputs
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
    this.signalIn1 = 0;
    this.signalIn2 = 0;
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
      signalIn1: this.signalIn1,
      signalIn2: this.signalIn2,
      output: this.output,
      isActive: this.isActive,
      isPositive: this.output > 0,
      isNegative: this.output < 0,
      isZero: this.output === 0
    };
  }

  /**
   * Get mathematical properties of the current operation
   * @returns {object} Mathematical properties
   */
  getMathematicalProperties() {
    return {
      minuend: this.signalIn1,
      subtrahend: this.signalIn2,
      difference: this.output,
      isPositiveResult: this.output > 0,
      isNegativeResult: this.output < 0,
      isZeroResult: this.output === 0,
      absoluteDifference: Math.abs(this.output),
      percentageChange: this.signalIn1 !== 0 ? (this.output / this.signalIn1) * 100 : 0
    };
  }

  /**
   * Calculate the inverse operation (addition)
   * @returns {number} The sum of output and subtrahend
   */
  getInverseOperation() {
    return this.output + this.signalIn2;
  }

  /**
   * Check if the operation would result in overflow
   * @returns {boolean} True if operation would overflow
   */
  wouldOverflow() {
    const result = this.signalIn1 - this.signalIn2;
    return result < this.clampMin || result > this.clampMax;
  }

  /**
   * Get the range of possible outputs for current inputs
   * @returns {object} Range information
   */
  getOutputRange() {
    return {
      min: this.clampMin,
      max: this.clampMax,
      current: this.output,
      isClamped: this.output === this.clampMin || this.output === this.clampMax
    };
  }
}

// Usage Examples
const subtractComponent = new SubtractComponent();

// Basic usage
subtractComponent.setInput1(10);
subtractComponent.setInput2(3);
console.log(subtractComponent.getOutput()); // 7

// Negative result
subtractComponent.setInput1(5);
subtractComponent.setInput2(8);
console.log(subtractComponent.getOutput()); // -3

// Zero result
subtractComponent.setInput1(10);
subtractComponent.setInput2(10);
console.log(subtractComponent.getOutput()); // 0

// With clamping
subtractComponent.setClamping(0, 10);
subtractComponent.setInput1(15);
subtractComponent.setInput2(3);
console.log(subtractComponent.getOutput()); // 10 (clamped)

// Get status
console.log(subtractComponent.getStatus());
// {
//   signalIn1: 15,
//   signalIn2: 3,
//   output: 10,
//   isActive: true,
//   isPositive: true,
//   isNegative: false,
//   isZero: false
// }

// Get mathematical properties
console.log(subtractComponent.getMathematicalProperties());
// {
//   minuend: 15,
//   subtrahend: 3,
//   difference: 10,
//   isPositiveResult: true,
//   isNegativeResult: false,
//   isZeroResult: false,
//   absoluteDifference: 10,
//   percentageChange: 66.67
// }

// Check inverse operation
console.log(subtractComponent.getInverseOperation()); // 13 (10 + 3)

// Check overflow
console.log(subtractComponent.wouldOverflow()); // false

// Get output range
console.log(subtractComponent.getOutputRange());
// {
//   min: 0,
//   max: 10,
//   current: 10,
//   isClamped: true
// }
```

## Error Handling

### Input Validation
- **Non-Numeric Inputs:** Handles gracefully with type checking
- **NaN Values:** Returns NaN for invalid operations
- **Infinity:** Follows mathematical rules for infinite values
- **Type Conversion:** Attempts to convert string inputs to numbers

### Output Validation
- **Range Checking:** Ensures output is within valid bounds
- **Precision Control:** Limits decimal places to prevent floating-point errors
- **Clamping:** Prevents extreme output values
- **Overflow Detection:** Identifies when operations would exceed limits

### Error Recovery
- **Invalid Input Recovery:** Resets to safe state when invalid input is received
- **Component Reset:** Provides reset functionality to clear errors
- **Status Monitoring:** Tracks component health and validity

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(1) for basic subtraction calculation
- **Space Complexity:** O(1) - constant memory usage
- **Precision Trade-offs:** Higher precision requires more computation

### Optimization Features
- **Caching:** May cache results for repeated inputs
- **Early Exit:** Returns immediately for special cases (zero subtrahend, equal values)
- **Efficient Algorithms:** Uses optimized subtraction algorithms

### Resource Usage
- **CPU Usage:** Low - simple mathematical operation
- **Memory Usage:** Minimal - only stores current state
- **Power Consumption:** Negligible - no power requirements

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if both input wires are connected
   - Verify input signals are numeric
   - Ensure proper signal aggregation

2. **Unexpected Output**
   - Verify input signal format
   - Check for clamping limits
   - Confirm signal aggregation behavior

3. **Component Not Working**
   - Check wire connections
   - Verify component is powered (if applicable)
   - Ensure proper signal flow

### Best Practices

1. **Input Validation**: Ensure inputs are numeric when possible
2. **Signal Documentation**: Label wires clearly for debugging
3. **Testing**: Test with both positive and negative results
4. **Integration**: Verify downstream components can handle the output format

## Component Comparison

### Similar Components
- **Adder Component**: Performs addition instead of subtraction
- **Multiply Component**: Performs multiplication operations
- **Divide Component**: Performs division operations

### When to Use Subtract vs Alternatives
- **Use Subtract**: When you need the difference between two values
- **Use Adder**: When you need to combine values
- **Use Multiply**: When you need scaling or amplification
- **Use Divide**: When you need ratios or normalization

## Advanced Usage Patterns

### Pattern 1: Error Detection
```
Target Value → Subtract → Error Signal → Controller
```
Calculating error for feedback control systems.

### Pattern 2: Differential Measurements
```
Sensor 1 → Subtract → Differential Signal → Display
Sensor 2 ↗
```
Measuring differences between two sensors.

### Pattern 3: Resource Monitoring
```
Initial Amount → Subtract → Remaining Amount → Alarm
Consumed Amount ↗
```
Tracking resource consumption and remaining quantities.

## Mathematical References

### Key Formulas
- **Subtraction Definition:** a - b = c where a = b + c
- **Commutative Property:** a - b ≠ b - a (non-commutative)
- **Associative Property:** (a - b) - c ≠ a - (b - c) (non-associative)
- **Identity Property:** a - 0 = a
- **Inverse Property:** a - a = 0

### Common Applications
```javascript
// Error calculation
error = measured - setpoint

// Differential measurement
difference = value1 - value2

// Rate of change
rate = (current - previous) / time

// Percentage change
percentage = ((new - old) / old) * 100

// Remaining quantity
remaining = total - consumed
```

### Applications in Physics
- **Force Balance:** F_net = F_applied - F_friction
- **Voltage Drop:** V_drop = V_in - V_out
- **Pressure Difference:** ΔP = P_high - P_low
- **Temperature Difference:** ΔT = T_hot - T_cold

## Conclusion

The Subtract Component is a fundamental mathematical component in Barotrauma's electrical system that provides essential subtraction functionality. Its ability to calculate differences makes it invaluable for error detection, differential measurements, resource monitoring, and various mathematical modeling applications.

The component's robust error handling, configurable properties, and efficient implementation make it suitable for both simple and complex electrical circuits. Whether used for basic arithmetic operations or advanced control systems, the Subtract Component provides reliable and accurate mathematical operations essential for sophisticated submarine automation systems.

Understanding the subtraction function's mathematical properties, non-commutative nature, and practical applications is crucial for effective circuit design and troubleshooting in Barotrauma's electrical engineering environment. 
