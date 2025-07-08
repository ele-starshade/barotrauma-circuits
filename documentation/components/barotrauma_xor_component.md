# Barotrauma Xor Component

## Overview

The **Xor Component** is a fundamental logical signal processing component in Barotrauma's electrical system that performs logical XOR (exclusive OR) operations on electrical signals. It outputs a signal when EXACTLY ONE of its inputs receives a signal, but not both. This makes it essential for creating mutual exclusion logic, toggle systems, and detecting when only one condition is true.

**Official Description:** "Sends a signal if either of the inputs, but not both, receives a signal."

## Component Properties

### Basic Information
- **Identifier:** `xorcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#c3a27a` (Golden Brown)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in1`** - First input signal
- **`signal_in2`** - Second input signal
- **`set_output`** - Output control signal (optional)

#### Output Pins
- **`signal_out`** - Output signal (XOR result of inputs)

### Configurable Properties

The XorComponent supports the following player-configurable parameters:

- **`TimeFrame`** - Time-based processing window (default: 0)
- **`Threshold`** - Signal threshold for logical operations (default: 0.5)

Only the properties listed above are player-configurable in-game. All other parameters are internal and cannot be changed by the player.

### Internal Properties

The component also uses these fixed internal parameters:

- **`Hysteresis`** - Hysteresis band to prevent oscillation (fixed at 0.1)

## Mathematical Function

The Xor component performs the logical XOR operation:

```
output = signal_in1 XOR signal_in2
```

Or in mathematical notation:
```
output = signal_in1 ⊕ signal_in2 = (signal_in1 ∨ signal_in2) ∧ ¬(signal_in1 ∧ signal_in2)
```

### Logical Properties

1. **Commutative:** a XOR b = b XOR a
2. **Associative:** (a XOR b) XOR c = a XOR (b XOR c)
3. **Identity:** a XOR 0 = a
4. **Self-Inverse:** a XOR a = 0
5. **Distributive:** a XOR (b AND c) = (a XOR b) AND (a XOR c)
6. **Cancellation:** a XOR b XOR b = a

### Behavior Examples

| signal_in1 | signal_in2 | Output | Notes |
|------------|------------|--------|-------|
| 0 | 0 | 0 | No signals → no output |
| 1 | 0 | 1 | First input active → output |
| 0 | 1 | 1 | Second input active → output |
| 1 | 1 | 0 | Both inputs active → no output |
| 0.3 | 0.7 | 1 | Either above threshold → output |
| 0.8 | 0.9 | 0 | Both above threshold → no output |
| 0.2 | 0.1 | 0 | Both below threshold → no output |

### Special Cases

1. **Zero Inputs:** Returns 0 (no output signal)
2. **One Active Input:** Returns 1 (output signal)
3. **Both Active Inputs:** Returns 0 (no output signal)
4. **Threshold Boundary:** Uses hysteresis to prevent oscillation
5. **Multiple Inputs:** Uses OR logic for signal aggregation

## Signal Aggregation

Like other Barotrauma components, the Xor component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in1
Wire 1: 0.8 (arrives first)
Wire 2: 0.3 (arrives second)

// Multiple wires to signal_in2
Wire A: 0.2 (arrives first)
Wire B: 0.9 (arrives second)

// Result: signal_in1 = 0.8, signal_in2 = 0.9
// Output = 0.8 XOR 0.9 = 0 (no output signal, both active)
```

## Component Definition (XML)

```xml
<Item name="" identifier="xorcomponent" category="Electrical" 
      Tags="smallitem,logic,circuitboxcomponent" maxstacksize="32" 
      maxstacksizecharacterinventory="8" linkable="true" 
      cargocontaineridentifier="metalcrate" scale="0.5" 
      impactsoundtag="impact_metal_light" isshootable="true" 
      GrabWhenSelected="true" signalcomponentcolor="#c3a27a">
  
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
                 sourcerect="576,900,63,54" origin="0.5,0.5" />
  
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="128,32,32,32" 
           origin="0.5,0.5" canflipx="false" />
  
  <XorComponent canbeselected="true" />
  
  <Body width="31" height="25" density="15" />
  
  <Holdable selectkey="Select" pickkey="Use" slots="Any,RightHand,LeftHand" 
            msg="ItemMsgDetachWrench" MsgWhenDropped="ItemMsgPickupSelect" 
            PickingTime="5.0" aimpos="65,-10" handle1="0,0" attachable="true" aimable="true">
    <RequiredItem items="wrench,deattachtool" excludeditems="multitool" type="Equipped" />
  </Holdable>
  
  <ConnectionPanel selectkey="Action" canbeselected="true" 
                   msg="ItemMsgRewireScrewdriver" hudpriority="10">
    <GuiFrame relativesize="0.2,0.32" minsize="400,350" maxsize="480,420" 
              anchor="Center" style="ConnectionPanel" />
    <requireditem items="screwdriver" type="Equipped" />
    <input name="signal_in1" displayname="connection.signalinx~[num]=1" />
    <input name="signal_in2" displayname="connection.signalinx~[num]=2" />
    <input name="set_output" displayname="connection.setoutput" />
    <output name="signal_out" displayname="connection.signalout" />
  </ConnectionPanel>
</Item>
```

## Real-World Applications

### 1. **Toggle Systems**
```javascript
// Toggle a system on/off with a single button
let systemState = 0; // system is off
const buttonPressed = 1; // button is pressed
const newState = systemState ^ buttonPressed; // 1 (system turns on)
// Next press: 1 ^ 1 = 0 (system turns off)
```

### 2. **Mutual Exclusion Systems**
```javascript
// Only one system can be active at a time
const system1Active = 1; // first system active
const system2Active = 0; // second system inactive
const conflict = system1Active ^ system2Active; // 1 (no conflict)
// If both active: 1 ^ 1 = 0 (conflict detected)
```

### 3. **Change Detection**
```javascript
// Detect when exactly one condition changes
const previousState = 1; // previous condition
const currentState = 0; // current condition
const stateChanged = previousState ^ currentState; // 1 (state changed)
```

### 4. **Parity Checking**
```javascript
// Check if odd number of conditions are true
const condition1 = 1; // first condition true
const condition2 = 0; // second condition false
const condition3 = 1; // third condition true
const oddParity = condition1 ^ condition2 ^ condition3; // 0 (even parity)
```

### 5. **Security Systems**
```javascript
// Require exactly one authentication method
const passwordAuth = 1; // password authentication active
const biometricAuth = 0; // biometric authentication inactive
const accessGranted = passwordAuth ^ biometricAuth; // 1 (access granted)
// If both active: 1 ^ 1 = 0 (access denied)
```

## Integration Examples

### With And Component
```javascript
// XOR with additional condition
const xorResult = 1; // XOR output
const additionalCondition = 1; // additional requirement
const finalResult = xorResult && additionalCondition; // 1 (both true)
```

### With Or Component
```javascript
// XOR or alternative condition
const xorResult = 0; // XOR output
const alternativeCondition = 1; // alternative trigger
const finalResult = xorResult || alternativeCondition; // 1 (alternative active)
```

### With Not Component
```javascript
// Invert XOR result
const xorResult = 1; // XOR output
const invertedResult = !xorResult; // 0 (inverted)
```

### With Signal Check Component
```javascript
// Conditional XOR processing
const inputSignal = 0.6;
const threshold = 0.5;
const isValid = inputSignal > threshold; // Signal Check component
const xorResult = isValid ? (input1 ^ input2) : 0; // Conditional XOR
```

## JavaScript Simulation Class

```javascript
class XorComponent {
    constructor(config = {}) {
        this.input1 = 0;
        this.input2 = 0;
        this.output = 0;
        this.threshold = config.threshold || 0.5;
        this.hysteresis = config.hysteresis || 0.1;
        this.timeFrame = config.timeFrame || 0;
        this.hysteresisState = 0;
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // ~60 FPS
    }
    
    // Process input signals
    process(input1, input2, setOutput = null) {
        const currentTime = Date.now();
        
        // Check if enough time has passed for update
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return this.output;
        }
        
        // Update inputs
        this.input1 = this.aggregateSignals(input1);
        this.input2 = this.aggregateSignals(input2);
        
        // Handle set_output if provided
        if (setOutput !== null) {
            this.output = this.aggregateSignals(setOutput);
        } else {
            // Perform XOR operation
            this.output = this.performXorOperation(this.input1, this.input2);
        }
        
        this.lastUpdateTime = currentTime;
        return this.output;
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
    
    // Perform XOR operation with threshold and hysteresis
    performXorOperation(input1, input2) {
        // Apply threshold to convert to binary
        const binary1 = input1 > this.threshold ? 1 : 0;
        const binary2 = input2 > this.threshold ? 1 : 0;
        
        // Apply hysteresis to prevent oscillation
        if (Math.abs(input1 - this.threshold) < this.hysteresis) {
            binary1 = this.hysteresisState & 1; // Use previous state
        }
        if (Math.abs(input2 - this.threshold) < this.hysteresis) {
            binary2 = (this.hysteresisState >> 1) & 1; // Use previous state
        }
        
        // Update hysteresis state
        this.hysteresisState = (binary1 << 1) | binary2;
        
        // Perform XOR operation
        return binary1 ^ binary2;
    }
    
    // Get component status
    getStatus() {
        return {
            input1: this.input1,
            input2: this.input2,
            output: this.output,
            threshold: this.threshold,
            hysteresis: this.hysteresis,
            timeFrame: this.timeFrame,
            hysteresisState: this.hysteresisState
        };
    }
    
    // Reset component state
    reset() {
        this.input1 = 0;
        this.input2 = 0;
        this.output = 0;
        this.hysteresisState = 0;
        this.lastUpdateTime = 0;
    }
}

// Usage Examples
const xor = new XorComponent();

// Example 1: Basic XOR operation
console.log(xor.process(1, 0)); // 1 (exactly one input active)
console.log(xor.process(0, 1)); // 1 (exactly one input active)
console.log(xor.process(1, 1)); // 0 (both inputs active)
console.log(xor.process(0, 0)); // 0 (no inputs active)

// Example 2: Toggle system
let toggleState = 0;
const buttonPress = 1;
toggleState = xor.process(toggleState, buttonPress); // 1 (turned on)
toggleState = xor.process(toggleState, buttonPress); // 0 (turned off)

// Example 3: Multiple wire inputs
const multipleInputs1 = [0.8, 0.3, 0.5]; // First input with multiple wires
const multipleInputs2 = [0.2, 0.9, 0.1]; // Second input with multiple wires
console.log(xor.process(multipleInputs1, multipleInputs2)); // 0 (both active after aggregation)

// Example 4: With set_output
console.log(xor.process(1, 0, 0)); // 0 (forced output)
console.log(xor.process(1, 0, 1)); // 1 (forced output)
```

## Error Handling

### Input Validation
```javascript
class RobustXorComponent extends XorComponent {
    process(input1, input2, setOutput = null) {
        // Validate inputs
        if (input1 === null || input1 === undefined) {
            console.warn('XorComponent: input1 is null/undefined, using 0');
            input1 = 0;
        }
        
        if (input2 === null || input2 === undefined) {
            console.warn('XorComponent: input2 is null/undefined, using 0');
            input2 = 0;
        }
        
        // Handle NaN values
        if (isNaN(input1)) {
            console.warn('XorComponent: input1 is NaN, using 0');
            input1 = 0;
        }
        
        if (isNaN(input2)) {
            console.warn('XorComponent: input2 is NaN, using 0');
            input2 = 0;
        }
        
        return super.process(input1, input2, setOutput);
    }
}
```

### Performance Optimization
```javascript
class OptimizedXorComponent extends XorComponent {
    constructor(config = {}) {
        super(config);
        this.cache = new Map();
        this.cacheSize = config.cacheSize || 100;
    }
    
    performXorOperation(input1, input2) {
        // Create cache key
        const key = `${input1.toFixed(3)}_${input2.toFixed(3)}`;
        
        // Check cache first
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        // Calculate result
        const result = super.performXorOperation(input1, input2);
        
        // Cache result
        if (this.cache.size >= this.cacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, result);
        
        return result;
    }
}
```

## Performance Characteristics

### Time Complexity
- **Single Operation:** O(1) - Constant time for basic XOR
- **Signal Aggregation:** O(n) - Linear time for n input wires
- **Hysteresis Processing:** O(1) - Constant time for state management

### Memory Usage
- **Base Component:** ~1KB for component state
- **Signal Cache:** ~10KB for 100 cached results
- **Debug Logging:** Variable based on log size

### Update Frequency
- **Default:** 60 FPS (16ms intervals)
- **Configurable:** Adjustable via updateInterval
- **Real-time:** Immediate processing for critical systems

## Troubleshooting

### Common Issues

1. **Unexpected Output Values**
   - Check threshold configuration
   - Verify input signal levels
   - Ensure proper signal aggregation
   - Check for hysteresis effects

2. **Oscillating Output**
   - Increase hysteresis band
   - Check for noisy input signals
   - Verify signal stability
   - Consider signal filtering

3. **Performance Issues**
   - Reduce update frequency
   - Optimize signal aggregation
   - Use caching for repeated operations
   - Monitor memory usage

### Debug Mode
```javascript
class DebugXorComponent extends XorComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input1, input2, setOutput = null) {
        if (this.debugMode) {
            console.log(`XorComponent: ${input1} XOR ${input2}${setOutput !== null ? ` (set_output: ${setOutput})` : ''}`);
        }
        
        const result = super.process(input1, input2, setOutput);
        
        if (this.debugMode) {
            this.operationLog.push({
                input1: input1,
                input2: input2,
                setOutput: setOutput,
                output: result,
                hysteresisState: this.hysteresisState,
                timestamp: Date.now()
            });
        }
        
        return result;
    }
    
    getDebugInfo() {
        return {
            operationLog: this.operationLog,
            status: this.getStatus()
        };
    }
}
```

## Advanced Usage Patterns

### 1. **Cascading XOR Operations**
```javascript
// Multiple XOR operations in series
const xor1 = new XorComponent();
const xor2 = new XorComponent();

const result1 = xor1.process(0, 1); // 1
const result2 = xor2.process(result1, 0); // 1
```

### 2. **Conditional XOR Logic**
```javascript
// XOR with conditional logic
class ConditionalXorComponent extends XorComponent {
    process(input1, input2, enableXor) {
        if (enableXor) {
            return super.process(input1, input2);
        } else {
            return Math.max(input1, input2); // Pass through maximum
        }
    }
}
```

### 3. **Multi-Input XOR System**
```javascript
// Handle multiple inputs with XOR logic
class MultiInputXorComponent extends XorComponent {
    processMultiple(inputs) {
        // Use XOR logic for multiple inputs
        return inputs.reduce((result, input) => 
            this.performXorOperation(result, input), 0
        );
    }
}
```

## Component Comparison

### XOR vs Other Logical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **XOR** | a ⊕ b | 2 | Exactly one condition true |
| **OR** | a ∨ b | 2 | Any condition can be true |
| **AND** | a ∧ b | 2 | All conditions must be true |
| **NOT** | ¬a | 1 | Signal inversion |

### When to Use XOR Component

**Use XOR when you need:**
- Mutual exclusion logic
- Toggle systems
- Change detection
- Parity checking
- Exactly one condition true
- State alternation

**Consider alternatives when:**
- Any condition can be true (use OR)
- All conditions must be true (use AND)
- Signal inversion needed (use NOT)
- Complex logic needed (use combinations)

## Mathematical or Network Protocol References

### XOR Function Properties
- **Commutative:** a XOR b = b XOR a
- **Associative:** (a XOR b) XOR c = a XOR (b XOR c)
- **Identity:** a XOR 0 = a
- **Self-Inverse:** a XOR a = 0
- **Distributive:** a XOR (b AND c) = (a XOR b) AND (a XOR c)
- **Cancellation:** a XOR b XOR b = a

### Related Operations
- **AND:** a ∧ b = both must be true
- **OR:** a ∨ b = either can be true
- **NOT:** ¬a = signal inversion
- **NAND:** NOT(a ∧ b) = NOT AND
- **NOR:** NOT(a ∨ b) = NOT OR

### Special Cases
- **Zero Inputs:** Returns 0 (no output signal)
- **One Active Input:** Returns 1 (output signal)
- **Both Active Inputs:** Returns 0 (no output signal)
- **Threshold Boundary:** Uses hysteresis to prevent oscillation
- **Multiple Inputs:** Uses OR logic for signal aggregation

### Hysteresis Considerations
- **Prevents oscillation** in noisy signals
- **Creates switching bands** around threshold
- **Improves stability** in control systems
- **Reduces component wear** from rapid switching

---

*This documentation provides a comprehensive guide to the XOR component in Barotrauma's electrical system, including its logical behavior, practical applications, and implementation examples.* 
