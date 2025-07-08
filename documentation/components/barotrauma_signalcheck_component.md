# Barotrauma SignalCheck Component

## Overview

The **SignalCheck Component** is a conditional signal processing component in Barotrauma's electrical system that compares incoming signals against a configured target value and outputs different signals based on whether the input matches the target. It implements a simple equality comparison with configurable output values, making it essential for signal validation, conditional logic, and automated decision-making systems.

**Official Description:** "Sends a signal when a signal matching a specific value is received."

## Component Properties

### Basic Information
- **Identifier:** `signalcheckcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** #4f6e3f (green)
- **Base Price:** 100 marks
- **Difficulty Level:** 15
- **Max Stack Size:** 32 (inventory), 8 (character inventory)

### Physical Properties
- **Scale:** 0.5
- **Body:** 31×25 pixels, density 15
- **Impact Sound:** impact_metal_light
- **Sprite:** signalcomp.png (160,128,32,32)
- **Inventory Icon:** Content/Items/InventoryIconAtlas.png (448,388,63,57)

### Crafting Information
- **Deconstruct Time:** 10 seconds
- **Deconstruct Yield:** 1 FPGA Circuit
- **Fabricate Time:** 10 seconds
- **Fabricate Requirement:** 1 FPGA Circuit
- **Suitable Fabricators:** fabricator

## Component Definition

```xml
<Item name="" identifier="signalcheckcomponent" category="Electrical" 
      Tags="smallitem,logic,circuitboxcomponent" maxstacksize="32" 
      maxstacksizecharacterinventory="8" cargocontaineridentifier="metalcrate" 
      description="" scale="0.5" impactsoundtag="impact_metal_light" 
      isshootable="true" GrabWhenSelected="true" signalcomponentcolor="#4f6e3f">
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
  <InventoryIcon texture="Content/Items/InventoryIconAtlas.png" sourcerect="448,388,63,57" origin="0.5,0.5" />
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="160,128,32,32" origin="0.5,0.5" canflipx="false" />
  <SignalCheckComponent canbeselected="true" />
  <Body width="31" height="25" density="15" />
  <Holdable selectkey="Select" pickkey="Use" slots="Any,RightHand,LeftHand" 
            msg="ItemMsgDetachWrench" MsgWhenDropped="ItemMsgPickupSelect" 
            PickingTime="5.0" aimpos="65,-10" handle1="0,0" attachable="true" aimable="true">
    <RequiredItem items="wrench,deattachtool" excludeditems="multitool" type="Equipped" />
  </Holdable>
  <ConnectionPanel selectkey="Action" canbeselected="true" msg="ItemMsgRewireScrewdriver" hudpriority="10">
    <GuiFrame relativesize="0.2,0.32" minsize="400,350" maxsize="480,420" anchor="Center" style="ConnectionPanel" />
    <RequiredItem items="screwdriver" type="Equipped" />
    <input name="signal_in" displayname="connection.signalin" />
    <input name="set_output" displayname="connection.setoutput" />
    <input name="set_targetsignal" displayname="connection.settargetsignal" />
    <output name="signal_out" displayname="connection.signalout" />
  </ConnectionPanel>
</Item>
```

## Input/Output Pins

### Input Pins
1. **`signal_in`** - Main input signal to be compared against target
2. **`set_output`** - Configures the output value when input matches target
3. **`set_targetsignal`** - Configures the target signal value for comparison

### Output Pins
1. **`signal_out`** - Outputs configured value based on comparison result

## Configurable Properties

### Core Properties
- **`output`** - Signal value output when input matches target (default: "0")
- **`falseoutput`** - Signal value output when input doesn't match target (default: "")
- **`targetsignal`** - Target signal value for comparison (default: "0")

Only the properties listed above are player-configurable in-game. All other parameters are internal and cannot be changed by the player.

### Component Behavior
- **`canbeselected`** - Whether component can be selected in circuit box (default: true)

## Mathematical Function

The SignalCheck component implements a simple equality comparison function:

```
f(input) = {
    output_value     if input == target_signal
    false_output     if input != target_signal
}
```

### Mathematical Properties
- **Function Type:** Conditional (piecewise)
- **Domain:** All signal types (string, number, null)
- **Range:** {output_value, false_output}
- **Comparison:** Exact equality (==)
- **Signal Aggregation:** Value-based (uses actual signal value)

### Comparison Logic
```javascript
function signalCheck(input, target, outputValue, falseOutput) {
    if (input === target) {
        return outputValue;
    } else {
        return falseOutput;
    }
}
```

## Behavior Examples

| Input Signal | Target Signal | Output Value | False Output | Result | Description |
|--------------|---------------|--------------|--------------|--------|-------------|
| "1" | "1" | "100" | "" | "100" | Exact match outputs configured value |
| "0" | "1" | "100" | "" | "" | No match outputs false output |
| "hello" | "hello" | "success" | "error" | "success" | String comparison works |
| 5 | 5 | "true" | "false" | "true" | Numeric comparison works |
| null | null | "match" | "no_match" | "match" | Null comparison works |
| "1" | 1 | "100" | "" | "" | Type-sensitive comparison |
| "" | "" | "empty" | "not_empty" | "empty" | Empty string comparison |
| undefined | "0" | "100" | "" | "" | Undefined treated as no signal |

## Special Cases

### Signal Type Handling
- **String Comparison:** Exact string matching (case-sensitive)
- **Numeric Comparison:** Exact numeric equality
- **Null Handling:** null == null returns true
- **Type Sensitivity:** "1" ≠ 1 (string vs number)

### Empty Signal Handling
- **Empty String:** "" is a valid signal value
- **No Signal:** Component outputs false_output when no signal received
- **Multiple Wires:** Uses first signal value (OR aggregation)

### Edge Cases
- **Target Changes:** Component immediately responds to target signal changes
- **Output Changes:** Component immediately responds to output value changes
- **Continuous Operation:** Component processes every input signal update

## Signal Aggregation

The SignalCheck component follows value-based signal aggregation rules:

### Input Signal Processing
- **Primary Input:** Uses the actual signal value from `signal_in`
- **Configuration Inputs:** Uses the most recent configuration values
- **Signal Priority:** Latest input signal takes precedence
- **Value Preservation:** Maintains exact signal values for comparison

### Output Signal Distribution
- **Single Output:** Generates one signal based on comparison result
- **Conditional Output:** Output depends on input-target comparison
- **Value-Based:** Outputs specific configured values

### Example Signal Processing
```javascript
// Multiple input wires to signal_in
Input 1: "1" (arrives first)
Input 2: "0" (arrives second)
Target: "0"
Result: Outputs configured value (match found)

// Configuration changes
set_output: "success" (arrives first)
set_targetsignal: "5" (arrives second)
Input: "5"
Result: Outputs "success" (new configuration used)
```

## Real-World Applications

### 1. **Security Systems**
```javascript
// Door access control
const doorSensor = new SignalCheckComponent();
doorSensor.setTargetSignal("authorized");
doorSensor.setOutput("open");
doorSensor.setFalseOutput("locked");
```

### 2. **Environmental Monitoring**
```javascript
// Oxygen level monitoring
const oxygenMonitor = new SignalCheckComponent();
oxygenMonitor.setTargetSignal("low");
oxygenMonitor.setOutput("alarm");
oxygenMonitor.setFalseOutput("normal");
```

### 3. **Equipment Control**
```javascript
// Reactor temperature control
const tempController = new SignalCheckComponent();
tempController.setTargetSignal("critical");
tempController.setOutput("shutdown");
tempController.setFalseOutput("operational");
```

### 4. **Status Validation**
```javascript
// System status checking
const statusChecker = new SignalCheckComponent();
statusChecker.setTargetSignal("online");
statusChecker.setOutput("green");
statusChecker.setFalseOutput("red");
```

## Integration Examples

### With Oscillator Component
```javascript
// Periodic status checking
const oscillator = new OscillatorComponent();
const signalCheck = new SignalCheckComponent();

oscillator.setFrequency(1); // 1 Hz
signalCheck.setTargetSignal("1");
signalCheck.setOutput("checking");
signalCheck.setFalseOutput("idle");
```

### With Memory Component
```javascript
// State-based validation
const memory = new MemoryComponent();
const signalCheck = new SignalCheckComponent();

memory.setOutput("stored_value");
signalCheck.setTargetSignal("expected_value");
signalCheck.setOutput("valid");
signalCheck.setFalseOutput("invalid");
```

### With Multiple Components
```javascript
// Complex validation system
const input1 = new SignalCheckComponent();
const input2 = new SignalCheckComponent();
const andGate = new AndComponent();

input1.setTargetSignal("ready");
input2.setTargetSignal("authorized");
andGate.setOutput("proceed");
andGate.setFalseOutput("wait");
```

## JavaScript Simulation Class

```javascript
class SignalCheckComponent {
    constructor() {
        this.inputSignal = null;
        this.targetSignal = "0";
        this.outputValue = "0";
        this.falseOutput = "";
        this.outputSignal = "";
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
        this.inputSignal = this.aggregateSignals(inputs.signal_in);
        
        // Update configuration if provided
        if (inputs.set_output !== undefined) {
            this.outputValue = this.aggregateSignals(inputs.set_output);
        }
        if (inputs.set_targetsignal !== undefined) {
            this.targetSignal = this.aggregateSignals(inputs.set_targetsignal);
        }

        // Calculate output
        this.calculateOutput();
        this.lastUpdateTime = currentTime;
        
        return this.outputSignal;
    }

    // Aggregate multiple input signals using OR logic
    aggregateSignals(signals) {
        if (!Array.isArray(signals)) {
            return signals;
        }
        
        // OR logic: return first non-null signal, or null if all are null
        for (const signal of signals) {
            if (signal !== null && signal !== undefined && signal !== "") {
                return signal;
            }
        }
        return null;
    }

    // Calculate output based on comparison
    calculateOutput() {
        if (this.inputSignal === this.targetSignal) {
            this.outputSignal = this.outputValue;
        } else {
            this.outputSignal = this.falseOutput;
        }
    }

    // Configuration methods
    setTargetSignal(target) {
        this.targetSignal = target;
    }

    setOutput(output) {
        this.outputValue = output;
    }

    setFalseOutput(falseOutput) {
        this.falseOutput = falseOutput;
    }

    // Get current state
    getState() {
        return {
            inputSignal: this.inputSignal,
            targetSignal: this.targetSignal,
            outputValue: this.outputValue,
            falseOutput: this.falseOutput,
            outputSignal: this.outputSignal
        };
    }

    // Reset component
    reset() {
        this.inputSignal = null;
        this.outputSignal = "";
        this.lastUpdateTime = 0;
    }
}

// Usage example
const signalCheck = new SignalCheckComponent();
signalCheck.setTargetSignal("1");
signalCheck.setOutput("success");
signalCheck.setFalseOutput("error");

// Process inputs
const result = signalCheck.processInputs({
    signal_in: "1",
    set_output: "match",
    set_targetsignal: "1"
});

console.log(result); // Outputs: "match"
```

## Error Handling

### Input Validation
- **Null Inputs:** Treated as no signal (outputs false_output)
- **Invalid Types:** Maintains type sensitivity for comparison
- **Configuration Errors:** Uses default values if invalid

### Performance Considerations
- **Update Rate:** Processes at ~60 FPS
- **Memory Usage:** Minimal state storage
- **Processing Time:** O(1) comparison operation

### Troubleshooting
- **No Output:** Check if input signal matches target exactly
- **Wrong Output:** Verify target signal and output value configuration
- **Type Issues:** Ensure input and target are same type (string vs number)

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(1) for comparison operation
- **Space Complexity:** O(1) for state storage
- **Update Frequency:** ~60 FPS (16ms intervals)

### Memory Usage
- **State Variables:** 6 primitive values
- **Configuration:** 3 configurable properties
- **Temporary Storage:** Minimal

### Processing Efficiency
- **Signal Aggregation:** O(n) where n = number of input wires
- **Comparison:** Constant time equality check
- **Output Generation:** Immediate response

## Troubleshooting

### Common Issues
1. **No Output Signal**
   - Check if input signal matches target exactly
   - Verify target signal configuration
   - Ensure input signal is not null/empty

2. **Wrong Output Value**
   - Verify output value configuration
   - Check false output configuration
   - Confirm signal type matching

3. **Unexpected Behavior**
   - Check signal aggregation rules
   - Verify multiple wire connections
   - Confirm configuration input timing

### Debugging Steps
1. **Check Input Signal:** Verify signal value and type
2. **Verify Target:** Confirm target signal configuration
3. **Test Outputs:** Check both output and false output values
4. **Monitor Timing:** Ensure proper update intervals

## Advanced Usage Patterns

### 1. **Cascading Validation**
```javascript
// Multiple validation stages
const stage1 = new SignalCheckComponent();
const stage2 = new SignalCheckComponent();
const stage3 = new SignalCheckComponent();

stage1.setTargetSignal("ready");
stage2.setTargetSignal("authorized");
stage3.setTargetSignal("confirmed");
```

### 2. **Dynamic Configuration**
```javascript
// Runtime configuration changes
const dynamicCheck = new SignalCheckComponent();
dynamicCheck.setTargetSignal("initial");
// Later change target based on conditions
dynamicCheck.setTargetSignal("updated");
```

### 3. **Multi-Value Validation**
```javascript
// Check multiple possible values
const multiCheck = new SignalCheckComponent();
multiCheck.setTargetSignal("value1");
// Use with OR gates for multiple valid values
```

## Component Comparison

### vs Equals Component
- **SignalCheck:** Configurable output values, single comparison
- **Equals:** Boolean output, two-input comparison

### vs Greater Component
- **SignalCheck:** Exact equality, configurable outputs
- **Greater:** Numeric comparison, configurable outputs

### vs Not Component
- **SignalCheck:** Value-based comparison, configurable outputs
- **Not:** Binary logic, fixed output behavior

## Conclusion

The SignalCheck Component is a fundamental conditional logic component that provides precise signal validation and configurable output behavior. Its ability to compare input signals against a target value and output different signals based on the result makes it essential for:

- **Signal Validation:** Ensuring signals match expected values
- **Conditional Logic:** Creating decision-making systems
- **Status Monitoring:** Checking system states and conditions
- **Security Systems:** Validating access and authorization

The component's simple but powerful comparison logic, combined with configurable output values, makes it a versatile tool for creating sophisticated electrical systems in Barotrauma submarines. 
