# Barotrauma Round Component

## Overview

The **Round Component** is a mathematical signal processing component in Barotrauma's electrical system that performs rounding operations on electrical signals. It takes a numeric input and outputs the nearest integer value, implementing standard mathematical rounding (half-up rounding) to convert decimal values to whole numbers.

**Official Description:** "Rounds a numerical input to the nearest integer value."

## Component Properties

### Basic Information
- **Identifier:** `roundcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#404095` (Purple)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal (the number to be rounded)

#### Output Pins
- **`signal_out`** - Output signal (rounded to nearest integer)

### Configurable Properties

The RoundComponent uses a FunctionComponent with the "Round" function, which may support:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Precision`** - Decimal places for output (default: 0)

## Mathematical Function

The Round component performs the mathematical operation:

```
output = round(signal_in)
```

Or in mathematical notation:
```
output = ⌊signal_in + 0.5⌋
```

### Mathematical Properties

1. **Definition:** round(x) = nearest integer to x
2. **Range:** Always returns an integer
3. **Monotonicity:** Preserves order (if a ≤ b, then round(a) ≤ round(b))
4. **Idempotent:** round(round(x)) = round(x)
5. **Symmetry:** round(-x) = -round(x) for positive x

### Behavior Examples

| Input | Output | Notes |
|-------|--------|-------|
| 3.2 | 3 | Rounds down (3.2 < 3.5) |
| 3.5 | 4 | Rounds up (3.5 ≥ 3.5) |
| 3.7 | 4 | Rounds up (3.7 > 3.5) |
| 3.0 | 3 | Integer remains unchanged |
| -3.2 | -3 | Rounds up toward zero |
| -3.5 | -3 | Rounds up toward zero |
| -3.7 | -4 | Rounds down away from zero |
| 0.0 | 0 | Zero unchanged |
| 0.5 | 1 | Rounds up |
| -0.5 | 0 | Rounds up toward zero |

### Special Cases

1. **Positive Numbers:** Rounds to nearest integer (half-up)
2. **Negative Numbers:** Rounds to nearest integer (half-up toward zero)
3. **Integers:** Returns the same value
4. **Zero:** Returns zero
5. **Infinity:** Returns infinity
6. **NaN:** Returns NaN

## Signal Aggregation

Like other Barotrauma components, the Round component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 3.7 (arrives first)
Wire 2: 5.2 (arrives second)
Wire 3: 2.9 (arrives third)

// Result: signal_in = 3.7 (first signal wins)
// Output = round(3.7) = 4
```

## Component Definition

```xml
<Item identifier="roundcomponent" category="Electrical" Tags="smallitem,logic,circuitboxcomponent" maxstacksize="32" maxstacksizecharacterinventory="8" cargocontaineridentifier="metalcrate" scale="0.5" impactsoundtag="impact_metal_light" isshootable="true" GrabWhenSelected="true" signalcomponentcolor="#404095">
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
  <InventoryIcon texture="Content/Items/InventoryIconAtlas2.png" sourcerect="1,71,63,52" origin="0.5,0.5" />
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="32,96,32,32" origin="0.5,0.5" canflipx="false" />
  <FunctionComponent canbeselected="true" function="Round" />
  <Body width="31" height="25" density="15" />
  <ConnectionPanel selectkey="Action" canbeselected="true" msg="ItemMsgRewireScrewdriver" hudpriority="10">
    <GuiFrame relativesize="0.2,0.32" minsize="400,350" maxsize="480,420" anchor="Center" style="ConnectionPanel" />
    <RequiredItem identifier="screwdriver" type="Equipped" />
    <input name="signal_in" displayname="connection.signalin" />
    <output name="signal_out" displayname="connection.signalout" />
  </ConnectionPanel>
</Item>
```

## Real-World Applications

### 1. **Resource Allocation**
```javascript
// Calculate required units for resource allocation
const requiredAmount = 12.7; // units needed
const allocatedUnits = Math.round(requiredAmount); // 13 units
```

### 2. **Display Formatting**
```javascript
// Format sensor readings for display
const sensorReading = 23.456; // raw sensor value
const displayValue = Math.round(sensorReading); // 23 for display
```

### 3. **Time Calculations**
```javascript
// Round time durations to nearest unit
const duration = 2.7; // hours
const roundedDuration = Math.round(duration); // 3 hours
```

### 4. **Financial Calculations**
```javascript
// Round currency amounts
const price = 15.67; // currency
const roundedPrice = Math.round(price); // 16 currency
```

### 5. **Measurement Conversions**
```javascript
// Convert measurements to nearest whole unit
const measurement = 7.3; // meters
const roundedMeasurement = Math.round(measurement); // 7 meters
```

## Integration Examples

### 1. **Sensor Data Processing**
```javascript
// Round sensor readings for display
const sensor = { value: 45.8 };
const rounder = new RoundComponent();

rounder.setInput('signal_in', sensor.value);
const displayValue = rounder.getOutput('signal_out'); // 46
```

### 2. **Resource Management**
```javascript
// Calculate required resources
const requiredResources = 8.3;
const rounder = new RoundComponent();

rounder.setInput('signal_in', requiredResources);
const actualResources = rounder.getOutput('signal_out'); // 8
```

### 3. **Time-Based Systems**
```javascript
// Round time values for scheduling
const timeValue = 12.5; // hours
const rounder = new RoundComponent();

rounder.setInput('signal_in', timeValue);
const scheduledTime = rounder.getOutput('signal_out'); // 13
```

## JavaScript Simulation Class

```javascript
class RoundComponent {
    constructor(config = {}) {
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        this.precision = config.precision || 0; // Decimal places for output
        
        // Input/output state
        this.signalIn = 0;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Process input signal and calculate rounded value
     * @param {number} input - Input signal
     * @returns {number} - Calculated rounded value
     */
    process(input) {
        try {
            // Update input signal
            this.signalIn = input;
            
            // Perform rounding calculation with error handling
            let result = this.performRound(input);
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            // Apply clamping
            result = this.clampValue(result);
            
            // Round to specified precision
            result = this.roundToPrecision(result);
            
            this.output = result;
            this.lastError = null;
            
            return result;
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`RoundComponent error: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Perform the round operation with error handling
     * @param {number} x - The input number
     * @returns {number} - The rounded value
     */
    performRound(x) {
        if (typeof x !== 'number' || isNaN(x)) {
            throw new Error('Input must be a valid number');
        }
        
        // Handle special cases
        if (x === Infinity) return Infinity;
        if (x === -Infinity) return -Infinity;
        
        // Perform standard rounding (half-up)
        return Math.round(x);
    }
    
    /**
     * Apply time-based processing
     * @param {number} value - Current value
     * @returns {number} - Time-processed value
     */
    applyTimeFrame(value) {
        const currentTime = Date.now();
        
        // Add current value to history
        this.signalHistory.push({
            value: value,
            timestamp: currentTime
        });
        
        // Remove old entries outside time frame
        const cutoffTime = currentTime - (this.timeFrame * 1000);
        this.signalHistory = this.signalHistory.filter(entry => 
            entry.timestamp >= cutoffTime
        );
        
        // Calculate average over time frame
        if (this.signalHistory.length === 0) {
            return 0;
        }
        
        const sum = this.signalHistory.reduce((acc, entry) => acc + entry.value, 0);
        return sum / this.signalHistory.length;
    }
    
    /**
     * Clamp value to specified range
     * @param {number} value - Value to clamp
     * @returns {number} - Clamped value
     */
    clampValue(value) {
        return Math.max(this.clampMin, Math.min(this.clampMax, value));
    }
    
    /**
     * Round to specified precision
     * @param {number} value - Value to round
     * @returns {number} - Rounded value
     */
    roundToPrecision(value) {
        if (this.precision === 0) {
            return Math.round(value);
        }
        
        const multiplier = Math.pow(10, this.precision);
        return Math.round(value * multiplier) / multiplier;
    }
    
    /**
     * Set input value
     * @param {string} inputName - Input pin name
     * @param {number} value - Input value
     */
    setInput(inputName, value) {
        if (inputName === 'signal_in') {
            this.process(value);
        }
    }
    
    /**
     * Get output value
     * @param {string} outputName - Output pin name
     * @returns {number} - Output value
     */
    getOutput(outputName) {
        if (outputName === 'signal_out') {
            return this.output;
        }
        return 0;
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn = 0;
        this.output = 0;
        this.signalHistory = [];
        this.lastError = null;
        this.errorCount = 0;
    }
    
    /**
     * Get component status
     * @returns {object} - Component status information
     */
    getStatus() {
        return {
            input: this.signalIn,
            output: this.output,
            lastError: this.lastError,
            errorCount: this.errorCount,
            signalHistoryLength: this.signalHistory.length,
            timeFrame: this.timeFrame,
            clampMin: this.clampMin,
            clampMax: this.clampMax
        };
    }
}

// Usage example
const rounder = new RoundComponent({
    clampMin: -100,
    clampMax: 100,
    timeFrame: 0,
    precision: 0
});

// Process input
rounder.setInput('signal_in', 3.7);
const output = rounder.getOutput('signal_out'); // Returns 4

// Process negative input
rounder.setInput('signal_in', -2.5);
const negativeOutput = rounder.getOutput('signal_out'); // Returns -2
```

## Error Handling

```javascript
class RoundComponent {
    constructor(config = {}) {
        // Validate configuration
        if (config.clampMin && config.clampMax && config.clampMin > config.clampMax) {
            throw new Error('ClampMin cannot be greater than ClampMax');
        }
        
        if (config.timeFrame && config.timeFrame < 0) {
            throw new Error('TimeFrame cannot be negative');
        }
        
        if (config.precision && (config.precision < 0 || config.precision > 10)) {
            throw new Error('Precision must be between 0 and 10');
        }
        
        // Initialize with validated values
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        this.precision = config.precision || 0;
    }

    performRound(x) {
        try {
            if (typeof x !== 'number' || isNaN(x)) {
                throw new Error('Input must be a valid number');
            }
            
            // Handle edge cases
            if (x === Infinity) return Infinity;
            if (x === -Infinity) return -Infinity;
            
            // Check for overflow
            if (Math.abs(x) > Number.MAX_SAFE_INTEGER) {
                console.warn('Input value exceeds safe integer range');
            }
            
            return Math.round(x);
            
        } catch (error) {
            console.error(`Round operation failed: ${error.message}`);
            return 0;
        }
    }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(1) per operation
- **Space Complexity**: O(n) where n is time frame history size
- **Memory Usage**: Minimal (few variables + optional history)

### Processing Speed
- **Real-time**: Processes signals immediately
- **No delay**: No internal timing or buffering
- **Efficient**: Simple mathematical operation

### Resource Usage
- **Low CPU**: Minimal computational overhead
- **Minimal memory**: Stateless operation (unless time frame enabled)
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
   - Understand round vs floor vs ceiling behavior
   - Check for negative number handling
   - Verify integer vs decimal expectations

### Best Practices

1. **Input Validation**: Ensure inputs are numeric
2. **Output Format**: Choose appropriate output format
3. **Mathematical Understanding**: Know when to use round vs other rounding
4. **Integration**: Verify downstream components can handle integer outputs
5. **Testing**: Test with various input types and edge cases

## Component Comparison

### Similar Components
- **Floor Component**: Rounds down to nearest integer
- **Ceil Component**: Rounds up to nearest integer
- **Abs Component**: Removes sign from values

### When to Use Round vs Alternatives
- **Use Round**: When you need nearest integer approximation
- **Use Floor**: When you need to round down (e.g., resource allocation)
- **Use Ceil**: When you need to round up (e.g., container capacity)
- **Use Abs**: When you need to remove sign from values

## Advanced Usage Patterns

### Pattern 1: Signal Conditioning
```
Raw Sensor → Round Component → Display
```
Converting continuous sensor readings to discrete display values.

### Pattern 2: Resource Management
```
Resource Calculator → Round Component → Allocation System
```
Ensuring whole number resource allocations.

### Pattern 3: Time Formatting
```
Time Calculator → Round Component → Schedule Display
```
Converting precise time calculations to display-friendly values.

## Mathematical References

### Rounding Methods
- **Half-up Rounding**: Standard mathematical rounding
- **Half-down Rounding**: Alternative rounding method
- **Banker's Rounding**: Round to even for tie-breaking

### Mathematical Properties
- **Commutative**: round(a + b) ≠ round(a) + round(b)
- **Associative**: round(round(a)) = round(a)
- **Distributive**: Not distributive over addition

### Edge Cases
- **Very Large Numbers**: Handled within JavaScript limits
- **Very Small Numbers**: Handled correctly
- **Negative Numbers**: Rounds toward zero for half values
- **Zero**: Returns zero
- **Infinity**: Returns infinity

## Conclusion

The Round component is a fundamental mathematical signal processor that provides nearest-integer approximation for electrical signals. Its simple yet essential functionality makes it useful for display formatting, resource allocation, and data conditioning in Barotrauma's electrical systems.

Understanding the component's mathematical behavior, signal aggregation rules, and integration patterns is crucial for designing effective electrical circuits. The component's predictable behavior and easy integration make it an essential tool for converting continuous values to discrete representations. 
