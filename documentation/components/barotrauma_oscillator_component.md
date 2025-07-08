# Barotrauma Oscillator Component

## Overview

The **Oscillator Component** is a fundamental signal generator in Barotrauma's electrical system that produces periodic waveforms at a specified frequency. It generates continuous, time-varying signals that are essential for creating timing signals, control systems, and automated behaviors in submarines.

**Official Description:** "Generates a periodic signal at a specified frequency. The signal can be a pulse, sawtooth, sine, square, or triangle wave."

## Component Properties

### Basic Information
- **Identifier:** `oscillator`
- **Category:** Electrical
- **Tags:** smallitem, signal, circuitboxcomponent
- **Signal Color:** `#d1b788` (Golden Brown)
- **Base Price:** 150 marks
- **Difficulty Level:** 20

### Input/Output Pins

#### Input Pins
- **`set_frequency`** - Sets the oscillation frequency in Hz
- **`set_outputtype`** - Changes the waveform type (Pulse, Sawtooth, Sine, Square, Triangle)

#### Output Pins
- **`signal_out`** - The generated periodic waveform signal

### Configurable Properties

The OscillatorComponent supports:

- **`Frequency`** - Oscillation frequency in Hz (default: 1)
- **`OutputType`** - Waveform type (default: Pulse)
- **`Amplitude`** - Signal amplitude (default: 1.0)
- **`Phase`** - Initial phase offset (default: 0)

## Mathematical Function

The Oscillator component generates periodic waveforms based on time and frequency:

```
output = waveform_function(2π × frequency × time + phase)
```

### Waveform Functions

1. **Pulse Wave:**
   ```
   output = (time % period) < (period / 2) ? amplitude : 0
   ```

2. **Sawtooth Wave:**
   ```
   output = amplitude × ((time % period) / period)
   ```

3. **Sine Wave:**
   ```
   output = amplitude × sin(2π × frequency × time + phase)
   ```

4. **Square Wave:**
   ```
   output = sin(2π × frequency × time + phase) > 0 ? amplitude : -amplitude
   ```

5. **Triangle Wave:**
   ```
   phase = (time % period) / period
   output = phase < 0.5 ? 
     amplitude × (4 × phase - 1) : 
     amplitude × (3 - 4 × phase)
   ```

### Mathematical Properties

1. **Periodicity:** All waveforms repeat with period T = 1/frequency
2. **Amplitude:** Peak-to-peak range is 2×amplitude for bipolar waves
3. **Frequency Response:** Linear frequency scaling
4. **Phase Continuity:** Smooth phase transitions between cycles
5. **Harmonic Content:** Varies by waveform type

### Behavior Examples

| Time (s) | Frequency (Hz) | Pulse | Sawtooth | Sine | Square | Triangle |
|----------|----------------|-------|----------|------|--------|----------|
| 0.0 | 1.0 | 1 | 0.0 | 0.0 | 1 | -1 |
| 0.25 | 1.0 | 1 | 0.25 | 1.0 | 1 | -0.5 |
| 0.5 | 1.0 | 0 | 0.5 | 0.0 | -1 | 0 |
| 0.75 | 1.0 | 0 | 0.75 | -1.0 | -1 | 0.5 |
| 1.0 | 1.0 | 1 | 0.0 | 0.0 | 1 | 1 |

### Special Cases

1. **Zero Frequency:** Output remains constant at initial value
2. **Negative Frequency:** Treated as positive frequency
3. **Very High Frequency:** May cause performance issues
4. **Phase Wrapping:** Phase automatically wraps to [0, 2π]
5. **Amplitude Limits:** Clamped to prevent overflow

## Signal Aggregation

The Oscillator component follows standard signal aggregation rules:

### Input Signal Processing
- **Frequency Input:** Uses the most recent frequency value
- **Type Input:** Uses the most recent output type value
- **Signal Priority:** Latest input signal takes precedence
- **Value Clamping:** Inputs are clamped to valid ranges

### Output Signal Distribution
- **Single Output:** Generates one waveform signal
- **Continuous Output:** Signal updates every frame
- **Time-Based:** Output depends on elapsed time
- **Phase Continuity:** Maintains phase across updates

### Example Signal Processing
```javascript
// Multiple frequency inputs
Input 1: 2.0 Hz (arrives first)
Input 2: 1.5 Hz (arrives second)
Result: Uses 1.5 Hz (latest input)

// Multiple type inputs
Input 1: "Sine" (arrives first)
Input 2: "Pulse" (arrives second)
Result: Uses "Pulse" (latest input)
```

## Component Definition

```xml
<Item identifier="oscillator" category="Electrical" Tags="smallitem,signal,circuitboxcomponent">
  <OscillatorComponent canbeselected="true" outputtype="Pulse" frequency="1" />
  <ConnectionPanel>
    <input name="set_frequency" displayname="connection.setfrequency" />
    <input name="set_outputtype" displayname="connection.setoutputtype" />
    <output name="signal_out" displayname="connection.signalout" />
  </ConnectionPanel>
</Item>
```

## Waveform Types

### 1. Pulse
- **Behavior**: Periodically sends out a signal of 1
- **Pattern**: 0 → 1 → 0 → 1...
- **Duty Cycle**: 50% (configurable in some implementations)
- **Use Case**: Clock signals, timing triggers, digital control

### 2. Sawtooth
- **Behavior**: Sends out a periodic wave that increases linearly from 0 to 1
- **Pattern**: 0 → 1 → 0 → 1...
- **Characteristics**: Linear ramp up, instant reset
- **Use Case**: Sweep generators, time-based controls

### 3. Sine
- **Behavior**: Sends out a sine wave oscillating between -1 and 1
- **Pattern**: Smooth sinusoidal oscillation
- **Characteristics**: Continuous, smooth transitions
- **Use Case**: Audio signals, smooth control systems

### 4. Square
- **Behavior**: Sends out a signal that alternates between 0 and 1
- **Pattern**: 0 → 1 → 0 → 1...
- **Characteristics**: Sharp transitions, 50% duty cycle
- **Use Case**: Digital logic, on/off controls

### 5. Triangle
- **Behavior**: Sends out a wave that increases linearly from -1 to 1 and decreases from 1 to -1
- **Pattern**: Linear ramp up and down
- **Characteristics**: Smooth linear transitions
- **Use Case**: Smooth control systems, audio synthesis

## Real-World Applications

### 1. Timing Systems
```javascript
// Create a 2Hz pulse oscillator for timing
const timer = new OscillatorComponent({
  frequency: 2,
  outputType: 'Pulse'
})
```

### 2. Automated Door Systems
```javascript
// Sine wave for smooth door movement
const doorController = new OscillatorComponent({
  frequency: 0.5,
  outputType: 'Sine'
})
```

### 3. Warning Systems
```javascript
// Fast pulse for emergency alerts
const alarm = new OscillatorComponent({
  frequency: 5,
  outputType: 'Pulse'
})
```

### 4. Environmental Controls
```javascript
// Triangle wave for gradual temperature changes
const tempControl = new OscillatorComponent({
  frequency: 0.1,
  outputType: 'Triangle'
})
```

## Integration Examples

### Basic Clock Signal
```javascript
// Simple 1Hz clock
const clock = new OscillatorComponent({
  frequency: 1,
  outputType: 'Pulse'
})

// Connect to other components
clock.connect('signal_out', someComponent, 'trigger')
```

### Variable Frequency Control
```javascript
// Oscillator with external frequency control
const osc = new OscillatorComponent({
  frequency: 1,
  outputType: 'Sine'
})

// External frequency input
osc.setInput('set_frequency', 2.5) // Change to 2.5 Hz
```

### Waveform Switching
```javascript
// Oscillator with configurable waveform
const osc = new OscillatorComponent({
  frequency: 1,
  outputType: 'Pulse'
})

// Switch to sine wave
osc.setInput('set_outputtype', 'Sine')
```

## JavaScript Simulation Class

```javascript
class OscillatorComponent {
  constructor(config = {}) {
    this.frequency = config.frequency || 1
    this.outputType = config.outputType || 'Pulse'
    this.time = 0
    this.lastOutput = 0
    this.connectedOutputs = []
    
    // Waveform type mapping
    this.waveformTypes = {
      'Pulse': this.generatePulse.bind(this),
      'Sawtooth': this.generateSawtooth.bind(this),
      'Sine': this.generateSine.bind(this),
      'Square': this.generateSquare.bind(this),
      'Triangle': this.generateTriangle.bind(this)
    }
  }

  // Update the oscillator
  update(deltaTime) {
    this.time += deltaTime
    const period = 1 / this.frequency
    
    // Generate output based on waveform type
    const generator = this.waveformTypes[this.outputType]
    if (generator) {
      this.lastOutput = generator(this.time, period)
    }
    
    // Send output to connected components
    this.broadcastOutput()
  }

  // Pulse waveform generator
  generatePulse(time, period) {
    const phase = (time % period) / period
    return phase < 0.5 ? 1 : 0
  }

  // Sawtooth waveform generator
  generateSawtooth(time, period) {
    const phase = (time % period) / period
    return phase
  }

  // Sine waveform generator
  generateSine(time, period) {
    const phase = (time % period) / period
    return Math.sin(2 * Math.PI * phase)
  }

  // Square waveform generator
  generateSquare(time, period) {
    const phase = (time % period) / period
    return phase < 0.5 ? 1 : 0
  }

  // Triangle waveform generator
  generateTriangle(time, period) {
    const phase = (time % period) / period
    if (phase < 0.5) {
      return -1 + 4 * phase // -1 to 1
    } else {
      return 1 - 4 * (phase - 0.5) // 1 to -1
    }
  }

  // Set input values
  setInput(inputName, value) {
    switch (inputName) {
      case 'set_frequency':
        this.frequency = Math.max(0.1, Math.min(10, value))
        break
      case 'set_outputtype':
        if (this.waveformTypes[value]) {
          this.outputType = value
        }
        break
    }
  }

  // Connect output to another component
  connect(outputName, targetComponent, targetInput) {
    if (outputName === 'signal_out') {
      this.connectedOutputs.push({
        component: targetComponent,
        input: targetInput
      })
    }
  }

  // Broadcast output to connected components
  broadcastOutput() {
    this.connectedOutputs.forEach(connection => {
      connection.component.setInput(connection.input, this.lastOutput)
    })
  }

  // Get current output value
  getOutput(outputName) {
    if (outputName === 'signal_out') {
      return this.lastOutput
    }
    return 0
  }

  // Reset the oscillator
  reset() {
    this.time = 0
    this.lastOutput = 0
  }

  // Get component status
  getStatus() {
    return {
      frequency: this.frequency,
      outputType: this.outputType,
      currentOutput: this.lastOutput,
      time: this.time,
      connectedOutputs: this.connectedOutputs.length
    }
  }
}

// Usage example
const oscillator = new OscillatorComponent({
  frequency: 2,
  outputType: 'Sine'
})

// Simulation loop
let lastTime = 0
function update(currentTime) {
  const deltaTime = currentTime - lastTime
  oscillator.update(deltaTime)
  lastTime = currentTime
  
  // Use the output
  const output = oscillator.getOutput('signal_out')
  console.log(`Oscillator output: ${output.toFixed(3)}`)
}

// Change frequency dynamically
oscillator.setInput('set_frequency', 3)
oscillator.setInput('set_outputtype', 'Triangle')
```

## Error Handling

```javascript
class OscillatorComponent {
  constructor(config = {}) {
    // Validate frequency
    if (config.frequency && (config.frequency < 0.1 || config.frequency > 10)) {
      console.warn('Frequency should be between 0.1 and 10 Hz')
      this.frequency = Math.max(0.1, Math.min(10, config.frequency))
    } else {
      this.frequency = config.frequency || 1
    }
    
    // Validate output type
    const validTypes = ['Pulse', 'Sawtooth', 'Sine', 'Square', 'Triangle']
    if (config.outputType && !validTypes.includes(config.outputType)) {
      console.warn(`Invalid output type: ${config.outputType}. Using Pulse.`)
      this.outputType = 'Pulse'
    } else {
      this.outputType = config.outputType || 'Pulse'
    }
  }

  setInput(inputName, value) {
    try {
      switch (inputName) {
        case 'set_frequency':
          if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Frequency must be a valid number')
          }
          this.frequency = Math.max(0.1, Math.min(10, value))
          break
        case 'set_outputtype':
          const validTypes = ['Pulse', 'Sawtooth', 'Sine', 'Square', 'Triangle']
          if (!validTypes.includes(value)) {
            throw new Error(`Invalid output type: ${value}`)
          }
          this.outputType = value
          break
        default:
          console.warn(`Unknown input: ${inputName}`)
      }
    } catch (error) {
      console.error(`Oscillator input error: ${error.message}`)
    }
  }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(1) per update
- **Space Complexity**: O(n) where n is number of connected outputs
- **Memory Usage**: Minimal (few variables)

### Frequency Limits
- **Minimum**: 0.1 Hz (10-second period)
- **Maximum**: 10 Hz (0.1-second period)
- **Recommended**: 0.5 Hz to 5 Hz for most applications

### Waveform Accuracy
- **Pulse/Square**: Perfect digital accuracy
- **Sine**: High precision mathematical calculation
- **Sawtooth/Triangle**: Linear interpolation accuracy

## Troubleshooting

### Common Issues

1. **No Output**
   - Check if frequency is set correctly
   - Verify output type is valid
   - Ensure component is properly connected

2. **Wrong Frequency**
   - Validate frequency range (0.1-10 Hz)
   - Check for NaN or invalid values
   - Verify time calculations

3. **Incorrect Waveform**
   - Confirm output type spelling
   - Check waveform generator functions
   - Validate phase calculations

### Debug Methods

```javascript
// Enable debug logging
oscillator.debug = true

// Monitor component state
setInterval(() => {
  const status = oscillator.getStatus()
  console.log('Oscillator Status:', status)
}, 1000)
```

## Advanced Usage Patterns

### Frequency Modulation
```javascript
// Create frequency-modulated oscillator
const fmOsc = new OscillatorComponent({
  frequency: 1,
  outputType: 'Sine'
})

// Modulate frequency with another oscillator
const modulator = new OscillatorComponent({
  frequency: 0.5,
  outputType: 'Sine'
})

// Apply frequency modulation
modulator.connect('signal_out', fmOsc, 'set_frequency')
```

### Waveform Sequencing
```javascript
// Create waveform sequencer
const sequencer = new OscillatorComponent({
  frequency: 0.2,
  outputType: 'Pulse'
})

const waveforms = ['Pulse', 'Sine', 'Triangle', 'Square']
let currentIndex = 0

sequencer.connect('signal_out', (value) => {
  if (value > 0.5) {
    currentIndex = (currentIndex + 1) % waveforms.length
    sequencer.setInput('set_outputtype', waveforms[currentIndex])
  }
})
```

### Synchronized Oscillators
```javascript
// Create master clock
const masterClock = new OscillatorComponent({
  frequency: 1,
  outputType: 'Pulse'
})

// Create synchronized oscillators
const osc1 = new OscillatorComponent({
  frequency: 2,
  outputType: 'Sine'
})

const osc2 = new OscillatorComponent({
  frequency: 4,
  outputType: 'Triangle'
})

// Synchronize to master clock
masterClock.connect('signal_out', osc1, 'sync')
masterClock.connect('signal_out', osc2, 'sync')
```

## Component Comparison

| Component | Purpose | Output | Frequency Control |
|-----------|---------|--------|-------------------|
| Oscillator | Signal generation | Periodic waveforms | Yes |
| Delay | Signal delay | Delayed input | No |
| Memory | Signal storage | Stored value | No |
| Timer | Time-based triggers | Pulse output | Limited |

## Mathematical References

### Waveform Equations

**Sine Wave**: `y = sin(2π × f × t)`
- f = frequency in Hz
- t = time in seconds

**Sawtooth**: `y = (t × f) mod 1`
- Linear ramp from 0 to 1

**Triangle**: `y = 2 × |(2 × t × f) mod 2 - 1| - 1`
- Linear ramp from -1 to 1

**Square**: `y = sign(sin(2π × f × t))`
- Binary output based on sine sign

## Conclusion

The Oscillator component is a versatile signal generator that provides the foundation for timing and control systems in Barotrauma. Its configurable frequency and multiple waveform types make it suitable for a wide range of applications, from simple clock signals to complex control systems.

Understanding the different waveform types and their characteristics is crucial for designing effective electrical systems. The component's predictable behavior and easy integration make it an essential tool for submarine automation and control. 
