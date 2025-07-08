# Barotrauma OutputSelector (Demultiplexer) Component

## Overview

The **OutputSelector Component** (also known as **Demultiplexer** or **Demux**) is a signal routing component in Barotrauma's electrical system that takes a single input signal and routes it to one of multiple output channels based on a selection input. It implements a 1-to-N signal distribution system, making it essential for signal distribution and routing systems.

**Official Description:** "Routes a single input signal to one of multiple output channels based on a selection input. Only the selected output channel receives the input signal."

## Component Properties

### Basic Information
- **Identifier:** `demultiplexercomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#d1b788` (Golden Brown)
- **Base Price:** 200 marks
- **Difficulty Level:** 25

### Input/Output Pins

#### Input Pins
- **`signal_in`** - The input signal to be routed
- **`set_output`** - Sets the target output channel (0-9)
- **`move_output`** - Incrementally changes the selected output channel

#### Output Pins
- **`signal_out0`** through **`signal_out9`** - Individual output channels (10 total)
- **`selected_output_out`** - Outputs the currently selected channel number

### Configurable Properties

The DemultiplexerComponent supports:

- **`ChannelCount`** - Number of output channels (default: 10)
- **`DefaultChannel`** - Initial selected channel (default: 0)
- **`WrapAround`** - Whether to wrap around when moving past limits (default: true)
- **`AutoReset`** - Whether to reset to default channel on power loss (default: false)

## Mathematical Function

The OutputSelector component implements a multiplexing function:

```
output[i] = (i == selected_channel) ? input_signal : 0
```

Or in mathematical notation:
```
output[i] = δ(i, selected_channel) × input_signal
```

Where δ is the Kronecker delta function:
```
δ(i, j) = { 1 if i == j, 0 otherwise }
```

### Routing Logic

1. **Single Input Distribution:** One input signal distributed to N outputs
2. **Exclusive Selection:** Only one output channel active at a time
3. **Zero Output:** All non-selected outputs remain at 0
4. **Channel Validation:** Invalid channels are clamped to valid range

### Mathematical Properties

1. **Exclusivity:** Only one output can be active at a time
2. **Completeness:** All valid channels are selectable
3. **Idempotent:** Selecting the same channel multiple times has no effect
4. **Commutative:** Order of selection operations doesn't matter
5. **Associative:** Multiple selection operations can be combined

### Behavior Examples

| Input Signal | Selected Channel | Output 0 | Output 1 | Output 2 | Output 3 | Output 4 |
|--------------|------------------|----------|----------|----------|----------|----------|
| 5.5 | 0 | 5.5 | 0 | 0 | 0 | 0 |
| 3.2 | 2 | 0 | 0 | 3.2 | 0 | 0 |
| 7.8 | 4 | 0 | 0 | 0 | 0 | 7.8 |
| 1.0 | 1 | 0 | 1.0 | 0 | 0 | 0 |
| 0.0 | 3 | 0 | 0 | 0 | 0.0 | 0 |

### Special Cases

1. **Invalid Channel:** Clamped to valid range [0, channel_count-1]
2. **Negative Channel:** Treated as 0
3. **Overflow Channel:** Wrapped around or clamped to maximum
4. **Zero Input:** All outputs remain at 0 regardless of selection
5. **No Selection:** Uses default channel (usually 0)

## Signal Aggregation

The OutputSelector component follows standard signal aggregation rules:

### Input Signal Processing
- **Signal Input:** Uses the most recent input signal value
- **Selection Input:** Uses the most recent selection value
- **Move Input:** Increments/decrements current selection
- **Signal Priority:** Latest input signal takes precedence

### Output Signal Distribution
- **Single Active Output:** Only selected channel receives input signal
- **Inactive Outputs:** All non-selected outputs remain at 0
- **Selection Output:** Provides current channel number as output
- **Channel Validation:** Invalid selections are clamped to valid range

### Example Signal Processing
```javascript
// Multiple selection inputs
Input 1: Channel 3 (arrives first)
Input 2: Channel 7 (arrives second)
Result: Uses Channel 7 (latest input)

// Multiple move inputs
Current: Channel 2
Move 1: +1 (arrives first)
Move 2: +2 (arrives second)
Result: Channel 5 (2 + 1 + 2)
```

## Component Definition

```xml
<Item identifier="demultiplexercomponent" category="Electrical" Tags="smallitem,logic,circuitboxcomponent">
  <DemultiplexerComponent canbeselected="true" />
  <ConnectionPanel>
    <input name="signal_in" displayname="connection.signalin" />
    <input name="set_output" displayname="connection.setoutput" />
    <input name="move_output" displayname="connection.moveoutput" />
    <output name="signal_out0" displayname="connection.signaloutx~[num]=0" />
    <output name="signal_out1" displayname="connection.signaloutx~[num]=1" />
    <output name="signal_out2" displayname="connection.signaloutx~[num]=2" />
    <output name="signal_out3" displayname="connection.signaloutx~[num]=3" />
    <output name="signal_out4" displayname="connection.signaloutx~[num]=4" />
    <output name="signal_out5" displayname="connection.signaloutx~[num]=5" />
    <output name="signal_out6" displayname="connection.signaloutx~[num]=6" />
    <output name="signal_out7" displayname="connection.signaloutx~[num]=7" />
    <output name="signal_out8" displayname="connection.signaloutx~[num]=8" />
    <output name="signal_out9" displayname="connection.signaloutx~[num]=9" />
    <output name="selected_output_out" displayname="connection.selectedoutputout" />
  </ConnectionPanel>
</Item>
```

## Component Behavior

### Signal Routing Logic
- **Single Input**: Takes one input signal
- **Multiple Outputs**: Has 10 output channels (0-9)
- **Selection Control**: Routes input to only one selected output
- **Inactive Outputs**: All non-selected outputs remain at 0

### Selection Methods
1. **Direct Selection** (`set_output`): Set specific output channel
2. **Incremental Selection** (`move_output`): Move to next/previous channel
3. **Range**: Valid channels are 0-9 (10 total outputs)

## Real-World Applications

### 1. Multi-Zone Lighting Control
```javascript
// Route lighting control to different zones
const lightRouter = new OutputSelectorComponent()

// Connect to different lighting zones
lightRouter.connect('signal_out0', zone1Lights, 'power')
lightRouter.connect('signal_out1', zone2Lights, 'power')
lightRouter.connect('signal_out2', zone3Lights, 'power')

// Select zone 1
lightRouter.setInput('set_output', 0)
```

### 2. Audio System Routing
```javascript
// Route audio to different speakers
const audioRouter = new OutputSelectorComponent()

// Connect to different speaker systems
audioRouter.connect('signal_out0', bridgeSpeakers, 'volume')
audioRouter.connect('signal_out1', engineSpeakers, 'volume')
audioRouter.connect('signal_out2', crewSpeakers, 'volume')

// Route audio to bridge
audioRouter.setInput('set_output', 0)
```

### 3. Sensor Data Distribution
```javascript
// Route sensor data to different monitoring stations
const sensorRouter = new OutputSelectorComponent()

// Connect to different monitoring displays
sensorRouter.connect('signal_out0', bridgeDisplay, 'sensor_data')
sensorRouter.connect('signal_out1', engineDisplay, 'sensor_data')
sensorRouter.connect('signal_out2', securityDisplay, 'sensor_data')

// Route to bridge display
sensorRouter.setInput('set_output', 0)
```

### 4. Emergency System Control
```javascript
// Route emergency signals to different systems
const emergencyRouter = new OutputSelectorComponent()

// Connect to different emergency systems
emergencyRouter.connect('signal_out0', fireSuppression, 'trigger')
emergencyRouter.connect('signal_out1', emergencyLights, 'activate')
emergencyRouter.connect('signal_out2', alarmSystem, 'sound')

// Activate fire suppression
emergencyRouter.setInput('set_output', 0)
```

## Integration Examples

### Basic Signal Routing
```javascript
// Simple signal router
const router = new OutputSelectorComponent()

// Connect input signal
router.setInput('signal_in', 5.5)

// Route to output 3
router.setInput('set_output', 3)

// Get output from channel 3
const output = router.getOutput('signal_out3') // Returns 5.5
```

### Sequential Channel Selection
```javascript
// Create sequential channel selector
const sequencer = new OutputSelectorComponent()

// Use oscillator to cycle through channels
const clock = new OscillatorComponent({
  frequency: 1,
  outputType: 'Pulse'
})

// Connect clock to move output
clock.connect('signal_out', sequencer, 'move_output')
```

### Manual Channel Control
```javascript
// Manual channel selection with buttons
const router = new OutputSelectorComponent()

// Button inputs for channel selection
const button0 = { value: 0 }
const button1 = { value: 0 }
const button2 = { value: 0 }

// Connect buttons to set output
button0.connect('value', router, 'set_output')
button1.connect('value', router, 'set_output')
button2.connect('value', router, 'set_output')
```

## JavaScript Simulation Class

```javascript
class OutputSelectorComponent {
  constructor(config = {}) {
    this.selectedOutput = config.selectedOutput || 0
    this.inputSignal = 0
    this.outputs = new Array(10).fill(0)
    this.connectedOutputs = []
    
    // Validate initial selection
    this.selectedOutput = Math.max(0, Math.min(9, this.selectedOutput))
  }

  // Update the component
  update() {
    // Reset all outputs
    this.outputs.fill(0)
    
    // Route input signal to selected output
    if (this.selectedOutput >= 0 && this.selectedOutput < 10) {
      this.outputs[this.selectedOutput] = this.inputSignal
    }
    
    // Broadcast outputs to connected components
    this.broadcastOutputs()
  }

  // Set input values
  setInput(inputName, value) {
    switch (inputName) {
      case 'signal_in':
        this.inputSignal = value
        break
      case 'set_output':
        this.selectedOutput = Math.max(0, Math.min(9, Math.floor(value)))
        break
      case 'move_output':
        // Increment or decrement based on value
        if (value > 0) {
          this.selectedOutput = (this.selectedOutput + 1) % 10
        } else if (value < 0) {
          this.selectedOutput = (this.selectedOutput - 1 + 10) % 10
        }
        break
    }
    
    // Update outputs immediately
    this.update()
  }

  // Connect output to another component
  connect(outputName, targetComponent, targetInput) {
    if (outputName.startsWith('signal_out') || outputName === 'selected_output_out') {
      this.connectedOutputs.push({
        output: outputName,
        component: targetComponent,
        input: targetInput
      })
    }
  }

  // Broadcast outputs to connected components
  broadcastOutputs() {
    this.connectedOutputs.forEach(connection => {
      const outputValue = this.getOutput(connection.output)
      connection.component.setInput(connection.input, outputValue)
    })
  }

  // Get output value
  getOutput(outputName) {
    if (outputName === 'selected_output_out') {
      return this.selectedOutput
    }
    
    // Extract channel number from output name
    const match = outputName.match(/signal_out(\d+)/)
    if (match) {
      const channel = parseInt(match[1])
      return this.outputs[channel] || 0
    }
    
    return 0
  }

  // Get component status
  getStatus() {
    return {
      selectedOutput: this.selectedOutput,
      inputSignal: this.inputSignal,
      outputs: [...this.outputs],
      connectedOutputs: this.connectedOutputs.length
    }
  }

  // Reset the component
  reset() {
    this.selectedOutput = 0
    this.inputSignal = 0
    this.outputs.fill(0)
  }

  // Get all active outputs
  getActiveOutputs() {
    return this.outputs.map((value, index) => ({
      channel: index,
      value: value,
      active: index === this.selectedOutput
    }))
  }

  // Check if a specific channel is active
  isChannelActive(channel) {
    return channel === this.selectedOutput
  }

  // Get the currently active output value
  getActiveOutputValue() {
    return this.outputs[this.selectedOutput]
  }
}

// Usage example
const outputSelector = new OutputSelectorComponent({
  selectedOutput: 2
})

// Set input signal
outputSelector.setInput('signal_in', 7.5)

// Route to channel 2
outputSelector.setInput('set_output', 2)

// Get output from channel 2
const output = outputSelector.getOutput('signal_out2') // Returns 7.5

// Get selected channel
const selected = outputSelector.getOutput('selected_output_out') // Returns 2
```

## Error Handling

```javascript
class OutputSelectorComponent {
  constructor(config = {}) {
    // Validate selected output
    if (config.selectedOutput && (config.selectedOutput < 0 || config.selectedOutput > 9)) {
      console.warn('Selected output must be between 0 and 9')
      this.selectedOutput = Math.max(0, Math.min(9, config.selectedOutput))
    } else {
      this.selectedOutput = config.selectedOutput || 0
    }
  }

  setInput(inputName, value) {
    try {
      switch (inputName) {
        case 'signal_in':
          if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Input signal must be a valid number')
          }
          this.inputSignal = value
          break
        case 'set_output':
          if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Output selection must be a valid number')
          }
          const channel = Math.floor(value)
          if (channel < 0 || channel > 9) {
            throw new Error('Output channel must be between 0 and 9')
          }
          this.selectedOutput = channel
          break
        case 'move_output':
          if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Move value must be a valid number')
          }
          if (value > 0) {
            this.selectedOutput = (this.selectedOutput + 1) % 10
          } else if (value < 0) {
            this.selectedOutput = (this.selectedOutput - 1 + 10) % 10
          }
          break
        default:
          console.warn(`Unknown input: ${inputName}`)
      }
      
      this.update()
    } catch (error) {
      console.error(`OutputSelector input error: ${error.message}`)
    }
  }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(1) per update
- **Space Complexity**: O(n) where n is number of connected outputs
- **Memory Usage**: Minimal (array of 10 values + connections)

### Channel Limits
- **Total Channels**: 10 (0-9)
- **Active Channels**: 1 at a time
- **Selection Range**: 0-9 (integer values)

### Signal Routing
- **Input**: Single signal value
- **Output**: One active channel, others at 0
- **Latency**: Immediate routing

## Troubleshooting

### Common Issues

1. **No Output Signal**
   - Check if input signal is connected
   - Verify selected output channel is valid (0-9)
   - Ensure target component is properly connected

2. **Wrong Channel Selected**
   - Validate set_output value range (0-9)
   - Check for floating-point values (will be floored)
   - Verify move_output logic

3. **Multiple Active Outputs**
   - Component should only have one active output
   - Check for multiple set_output calls
   - Verify update logic

### Debug Methods

```javascript
// Enable debug logging
outputSelector.debug = true

// Monitor component state
setInterval(() => {
  const status = outputSelector.getStatus()
  console.log('OutputSelector Status:', status)
  
  const activeOutputs = outputSelector.getActiveOutputs()
  console.log('Active Outputs:', activeOutputs)
}, 1000)
```

## Advanced Usage Patterns

### Channel Cycling
```javascript
// Create automatic channel cycler
const cycler = new OutputSelectorComponent()

// Use oscillator to cycle through channels
const clock = new OscillatorComponent({
  frequency: 0.5,
  outputType: 'Pulse'
})

// Connect clock to move output
clock.connect('signal_out', cycler, 'move_output')

// This will cycle through channels 0-9 automatically
```

### Priority-Based Routing
```javascript
// Create priority-based router
const priorityRouter = new OutputSelectorComponent()

// Connect priority signals
const highPriority = { value: 0 }
const mediumPriority = { value: 0 }
const lowPriority = { value: 0 }

// Priority logic
if (highPriority.value > 0) {
  priorityRouter.setInput('set_output', 0)
} else if (mediumPriority.value > 0) {
  priorityRouter.setInput('set_output', 1)
} else if (lowPriority.value > 0) {
  priorityRouter.setInput('set_output', 2)
}
```

### Signal Distribution Network
```javascript
// Create signal distribution network
const mainRouter = new OutputSelectorComponent()
const subRouter1 = new OutputSelectorComponent()
const subRouter2 = new OutputSelectorComponent()

// Connect main router to sub-routers
mainRouter.connect('signal_out0', subRouter1, 'signal_in')
mainRouter.connect('signal_out1', subRouter2, 'signal_in')

// This creates a hierarchical routing system
```

## Component Comparison

| Component | Purpose | Inputs | Outputs | Selection |
|-----------|---------|--------|---------|-----------|
| OutputSelector | Signal routing | 1 | 10 | 1 active |
| InputSelector | Signal selection | 10 | 1 | 1 active |
| And | Logic gate | Multiple | 1 | All inputs |
| Or | Logic gate | Multiple | 1 | Any input |

## Mathematical References

### Routing Logic
- **Selection**: `output[i] = (i == selected) ? input : 0`
- **Channel Count**: 10 channels (0-9)
- **Active Outputs**: Exactly 1 at any time

### Channel Selection
- **Direct**: `selected = floor(set_output)`
- **Incremental**: `selected = (selected + sign(move_output)) % 10`
- **Range**: `0 ≤ selected ≤ 9`

## Conclusion

The OutputSelector (Demultiplexer) component is a powerful signal routing tool that enables complex signal distribution systems in Barotrauma. Its ability to route a single input to one of ten possible outputs makes it essential for multi-zone control systems, audio routing, sensor distribution, and emergency system management.

Understanding the component's selection logic and integration patterns is crucial for designing effective signal routing networks. The component's predictable behavior and easy integration make it an essential tool for complex electrical system design. 
