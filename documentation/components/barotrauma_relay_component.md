# Barotrauma Relay Component

## Overview

The **Relay Component** is a dual-purpose switching component in Barotrauma's electrical system that handles both **power distribution** and **signal routing**. When activated, it forwards all received signals from input connections to outputs, making it essential for power management and signal distribution systems.

**Official Description:** "Forwards all received signals from input connections to outputs when activated. Can handle both power and signal routing."

## Component Properties

### Basic Information
- **Identifier:** `relaycomponent`
- **Category:** Electrical
- **Tags:** smallitem, signal, logic, circuitboxcomponent
- **Signal Color:** `#d1b788` (Golden Brown)
- **Base Price:** 300 marks
- **Difficulty Level:** 35

### Input/Output Pins

#### Input Pins
- **`power_in`** ⚡ - **POWER**: Input power connection
- **`signal_in1`** - Signal input 1
- **`signal_in2`** - Signal input 2
- **`toggle`** - Toggles the relay state on/off
- **`set_state`** - Sets the relay state directly (1 = on, 0 = off)

#### Output Pins
- **`power_out`** ⚡ - **POWER**: Output power connection
- **`signal_out1`** - Signal output 1
- **`signal_out2`** - Signal output 2
- **`state_out`** - Current relay state (1 = on, 0 = off)
- **`load_value_out`** ⚡ - **POWER**: Current load value
- **`power_value_out`** ⚡ - **POWER**: Current power value

### Configurable Properties

The RelayComponent supports:

- **`MaxPower`** ⚡ - Maximum power capacity in watts (default: varies)
- **`IsOn`** - Initial relay state (default: true)
- **`VulnerableToEMP`** - Whether EMP can disable the relay (default: false)
- **`CanBeOverloaded`** - Whether power overload is possible (default: false)
- **`PowerEfficiency`** - Power transmission efficiency (default: 1.0)
- **`SignalDelay`** - Delay for signal transmission (default: 0)

## Mathematical Function

The Relay component implements a conditional forwarding function:

```
output = is_active ? input : 0
```

Or in mathematical notation:
```
output[i] = χ(is_active) × input[i]
```

Where χ is the characteristic function:
```
χ(is_active) = { 1 if relay is active, 0 otherwise }
```

### Power Distribution Logic ⚡

1. **Power Flow:** When active, power flows from `power_in` to `power_out`
2. **Load Monitoring:** Tracks current load and power consumption
3. **Overload Protection:** Can be configured to prevent overload conditions
4. **Power Limits:** Respects maximum power rating

### Signal Routing Logic

1. **Signal Forwarding:** When active, forwards signals from inputs to outputs
2. **State Control:** Can be toggled on/off via control inputs
3. **State Output:** Provides current relay state as output signal

### Mathematical Properties

1. **Conditional:** Output depends on relay state
2. **Linear:** When active, output is proportional to input
3. **Idempotent:** Multiple activations have no additional effect
4. **Commutative:** Order of input signals doesn't matter
5. **Associative:** Multiple signal inputs can be combined

### Behavior Examples

| Relay State | Power Input | Signal Input 1 | Signal Input 2 | Power Output | Signal Output 1 | Signal Output 2 | State Output |
|-------------|-------------|----------------|----------------|--------------|-----------------|-----------------|--------------|
| Off | 500W | 5.5 | 3.2 | 0W | 0 | 0 | 0 |
| On | 500W | 5.5 | 3.2 | 500W | 5.5 | 3.2 | 1 |
| On | 0W | 0 | 0 | 0W | 0 | 0 | 1 |
| On | 1000W | 7.8 | 1.0 | 1000W | 7.8 | 1.0 | 1 |
| Off | 1000W | 7.8 | 1.0 | 0W | 0 | 0 | 0 |

### Special Cases

1. **Overload Condition:** ⚡ Power output limited to max power rating
2. **EMP Disabled:** ⚡ Relay becomes inactive if vulnerable to EMP
3. **Power Loss:** All outputs become 0 regardless of state
4. **Invalid State:** State inputs are clamped to [0, 1]
5. **Multiple Toggles:** Each toggle inverts current state

## Signal Aggregation

The Relay component follows standard signal aggregation rules:

### Input Signal Processing
- **Power Input:** ⚡ Uses the most recent power input value
- **Signal Inputs:** Uses the most recent signal input values
- **State Inputs:** Uses the most recent state control value
- **Signal Priority:** Latest input signals take precedence

### Output Signal Distribution
- **Conditional Output:** Outputs only active when relay is on
- **Power Distribution:** ⚡ Power flows through when active
- **Signal Forwarding:** Signals forwarded when active
- **State Monitoring:** Provides current relay state as output

### Example Signal Processing
```javascript
// Multiple power inputs
Input 1: 500W (arrives first)
Input 2: 800W (arrives second)
Result: Uses 800W (latest input)

// Multiple state inputs
State 1: 0 (off) (arrives first)
State 2: 1 (on) (arrives second)
Result: Uses 1 (on) (latest input)

// Multiple signal inputs
Signal 1: 5.5 (arrives first)
Signal 2: 3.2 (arrives second)
Result: Uses 3.2 (latest input)
```

## Component Definition

```xml
<Item identifier="relaycomponent" category="Electrical" Tags="smallitem,signal,logic,circuitboxcomponent">
  <RelayComponent canbeselected="true" vulnerabletoemp="false" canbeoverloaded="false">
    <GuiFrame relativesize="0.2,0.14" minsize="450,160" anchor="Center" style="ItemUI" />
  </RelayComponent>
  <ConnectionPanel>
    <input name="power_in" displayname="connection.powerin" />
    <input name="signal_in1" displayname="connection.signalinx~[num]=1" />
    <input name="signal_in2" displayname="connection.signalinx~[num]=2" />
    <input name="toggle" displayname="connection.togglestate" />
    <input name="set_state" displayname="connection.setstate" />
    <output name="power_out" displayname="connection.powerout" />
    <output name="signal_out1" displayname="connection.signaloutx~[num]=1" />
    <output name="signal_out2" displayname="connection.signaloutx~[num]=2" />
    <output name="state_out" displayname="connection.stateout" />
    <output name="load_value_out" displayname="connection.loadvalueout" />
    <output name="power_value_out" displayname="connection.powervalueout" />
  </ConnectionPanel>
</Item>
```

## Component Behavior

### Power Distribution Logic ⚡
- **Power Flow**: When active, power flows from `power_in` to `power_out`
- **Load Monitoring**: Tracks current load and power consumption
- **Overload Protection**: Can be configured to prevent overload conditions
- **Power Limits**: Respects maximum power rating

### Signal Routing Logic
- **Signal Forwarding**: When active, forwards signals from inputs to outputs
- **State Control**: Can be toggled on/off via control inputs
- **State Output**: Provides current relay state as output signal

### Dual Functionality
- **Power + Signals**: Handles both power distribution and signal routing simultaneously
- **Independent Control**: Power and signal routing are controlled by the same state
- **Monitoring**: Provides power and load monitoring outputs

## Real-World Applications

### 1. Power Distribution Hub ⚡
```javascript
// Create power distribution relay
const powerHub = new RelayComponent({
  maxPower: 1000,
  isOn: true
})

// Connect power sources and loads
powerHub.connect('power_in', reactor, 'power_out')
powerHub.connect('power_out', engineRoom, 'power_in')
powerHub.connect('power_out', bridge, 'power_in')
```

### 2. Emergency Power Switch ⚡
```javascript
// Emergency power control
const emergencyRelay = new RelayComponent({
  maxPower: 500,
  isOn: false
})

// Emergency shutdown system
emergencyRelay.connect('toggle', emergencyButton, 'signal_out')
emergencyRelay.connect('power_out', emergencySystems, 'power_in')
```

### 3. Signal and Power Routing
```javascript
// Combined signal and power routing
const mainRelay = new RelayComponent({
  maxPower: 2000,
  isOn: true
})

// Power distribution
mainRelay.connect('power_in', mainReactor, 'power_out')
mainRelay.connect('power_out', subsystems, 'power_in')

// Signal routing
mainRelay.connect('signal_in1', controlPanel, 'signal_out')
mainRelay.connect('signal_out1', actuators, 'signal_in')
```

### 4. Load Monitoring System ⚡
```javascript
// Power monitoring relay
const monitorRelay = new RelayComponent({
  maxPower: 1500,
  isOn: true
})

// Monitor power consumption
monitorRelay.connect('load_value_out', powerMeter, 'signal_in')
monitorRelay.connect('power_value_out', loadDisplay, 'signal_in')

// Automatic shutdown on overload
monitorRelay.connect('load_value_out', (load) => {
  if (load > 1400) {
    monitorRelay.setInput('set_state', 0) // Shutdown
  }
})
```

## Integration Examples

### Basic Power Relay ⚡
```javascript
// Simple power relay
const relay = new RelayComponent({
  maxPower: 1000,
  isOn: true
})

// Connect power
relay.setInput('power_in', 500) // 500W input
const powerOut = relay.getOutput('power_out') // 500W output
```

### Signal-Controlled Power Switch ⚡
```javascript
// Signal-controlled power relay
const controlledRelay = new RelayComponent({
  maxPower: 800,
  isOn: false
})

// Control via signal
controlledRelay.setInput('set_state', 1) // Turn on
controlledRelay.setInput('power_in', 600) // Power input

// Get outputs
const powerOut = controlledRelay.getOutput('power_out') // 600W
const state = controlledRelay.getOutput('state_out') // 1 (on)
```

### Power Monitoring System ⚡
```javascript
// Power monitoring relay
const monitor = new RelayComponent({
  maxPower: 1200,
  isOn: true
})

// Set power input
monitor.setInput('power_in', 900)

// Monitor power values
const load = monitor.getOutput('load_value_out') // Current load
const power = monitor.getOutput('power_value_out') // Current power

console.log(`Load: ${load}W, Power: ${power}W`)
```

## JavaScript Simulation Class

```javascript
class RelayComponent {
  constructor(config = {}) {
    this.maxPower = config.maxPower || 1000
    this.isOn = config.isOn !== undefined ? config.isOn : true
    this.vulnerableToEmp = config.vulnerableToEmp || false
    this.canBeOverloaded = config.canBeOverloaded || false
    
    // Power-related properties ⚡
    this.powerIn = 0
    this.powerOut = 0
    this.loadValue = 0
    this.powerValue = 0
    this.isOverloaded = false
    
    // Signal properties
    this.signalIn1 = 0
    this.signalIn2 = 0
    this.signalOut1 = 0
    this.signalOut2 = 0
    
    this.connectedOutputs = []
  }

  // Update the component
  update() {
    if (this.isOn && !this.isOverloaded) {
      // Power distribution ⚡
      this.powerOut = this.powerIn
      this.loadValue = this.powerIn
      this.powerValue = this.powerOut
      
      // Check for overload ⚡
      if (this.canBeOverloaded && this.powerIn > this.maxPower) {
        this.isOverloaded = true
        this.powerOut = 0
        this.loadValue = 0
        this.powerValue = 0
      }
      
      // Signal forwarding
      this.signalOut1 = this.signalIn1
      this.signalOut2 = this.signalIn2
    } else {
      // Relay is off or overloaded
      this.powerOut = 0
      this.signalOut1 = 0
      this.signalOut2 = 0
      this.loadValue = 0
      this.powerValue = 0
    }
    
    // Broadcast outputs
    this.broadcastOutputs()
  }

  // Set input values
  setInput(inputName, value) {
    switch (inputName) {
      case 'power_in':
        this.powerIn = Math.max(0, value)
        break
      case 'signal_in1':
        this.signalIn1 = value
        break
      case 'signal_in2':
        this.signalIn2 = value
        break
      case 'toggle':
        if (value > 0) {
          this.isOn = !this.isOn
        }
        break
      case 'set_state':
        this.isOn = value > 0
        break
    }
    
    // Update immediately
    this.update()
  }

  // Connect output to another component
  connect(outputName, targetComponent, targetInput) {
    this.connectedOutputs.push({
      output: outputName,
      component: targetComponent,
      input: targetInput
    })
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
    switch (outputName) {
      case 'power_out':
        return this.powerOut
      case 'signal_out1':
        return this.signalOut1
      case 'signal_out2':
        return this.signalOut2
      case 'state_out':
        return this.isOn ? 1 : 0
      case 'load_value_out':
        return this.loadValue
      case 'power_value_out':
        return this.powerValue
      default:
        return 0
    }
  }

  // Get component status
  getStatus() {
    return {
      isOn: this.isOn,
      maxPower: this.maxPower,
      powerIn: this.powerIn,
      powerOut: this.powerOut,
      loadValue: this.loadValue,
      powerValue: this.powerValue,
      isOverloaded: this.isOverloaded,
      signalIn1: this.signalIn1,
      signalIn2: this.signalIn2,
      signalOut1: this.signalOut1,
      signalOut2: this.signalOut2,
      connectedOutputs: this.connectedOutputs.length
    }
  }

  // Reset the component
  reset() {
    this.powerIn = 0
    this.powerOut = 0
    this.loadValue = 0
    this.powerValue = 0
    this.signalIn1 = 0
    this.signalIn2 = 0
    this.signalOut1 = 0
    this.signalOut2 = 0
    this.isOverloaded = false
  }

  // Check if overloaded ⚡
  isOverloaded() {
    return this.isOverloaded
  }

  // Get power efficiency ⚡
  getPowerEfficiency() {
    if (this.powerIn === 0) return 1
    return this.powerOut / this.powerIn
  }

  // Reset overload condition ⚡
  resetOverload() {
    this.isOverloaded = false
    this.update()
  }
}

// Usage example
const relay = new RelayComponent({
  maxPower: 1000,
  isOn: true,
  canBeOverloaded: true
})

// Set power input ⚡
relay.setInput('power_in', 800)

// Get power outputs ⚡
const powerOut = relay.getOutput('power_out') // 800W
const load = relay.getOutput('load_value_out') // 800W
const efficiency = relay.getPowerEfficiency() // 1.0 (100%)

// Control relay
relay.setInput('toggle', 1) // Toggle state
```

## Error Handling

```javascript
class RelayComponent {
  constructor(config = {}) {
    // Validate power limits ⚡
    if (config.maxPower && config.maxPower <= 0) {
      console.warn('Max power must be positive')
      this.maxPower = 1000
    } else {
      this.maxPower = config.maxPower || 1000
    }
    
    // Validate overload protection
    if (config.canBeOverloaded && !config.maxPower) {
      console.warn('Overload protection requires max power setting')
    }
  }

  setInput(inputName, value) {
    try {
      switch (inputName) {
        case 'power_in':
          if (typeof value !== 'number' || isNaN(value) || value < 0) {
            throw new Error('Power input must be a non-negative number')
          }
          this.powerIn = value
          break
        case 'set_state':
          if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('State must be a valid number')
          }
          this.isOn = value > 0
          break
        default:
          // Handle other inputs
          super.setInput(inputName, value)
      }
      
      this.update()
    } catch (error) {
      console.error(`Relay input error: ${error.message}`)
    }
  }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(1) per update
- **Space Complexity**: O(n) where n is number of connected outputs
- **Memory Usage**: Minimal (power values + connections)

### Power Limits ⚡
- **Max Power**: Configurable (typically 500-2000W)
- **Overload Protection**: Optional automatic shutdown
- **Efficiency**: 100% when not overloaded

### Signal Processing
- **Input Types**: Power (watts) and signals (any)
- **Output Types**: Power (watts) and signals (any)
- **Latency**: Immediate forwarding

## Troubleshooting

### Common Issues

1. **No Power Output** ⚡
   - Check if relay is turned on (`isOn` state)
   - Verify power input is connected
   - Check for overload condition
   - Ensure max power limit is sufficient

2. **Overload Shutdown** ⚡
   - Reduce power input below max power
   - Increase max power limit
   - Reset overload condition
   - Check power consumption of connected devices

3. **Signal Not Forwarding**
   - Verify relay is active
   - Check input signal connections
   - Ensure output connections are properly wired

### Debug Methods

```javascript
// Enable debug logging
relay.debug = true

// Monitor power and state
setInterval(() => {
  const status = relay.getStatus()
  console.log('Relay Status:', status)
  
  if (relay.isOverloaded()) {
    console.warn('Relay is overloaded!')
  }
  
  const efficiency = relay.getPowerEfficiency()
  console.log(`Power Efficiency: ${(efficiency * 100).toFixed(1)}%`)
}, 1000)
```

## Advanced Usage Patterns

### Power Distribution Network ⚡
```javascript
// Create power distribution network
const mainRelay = new RelayComponent({ maxPower: 2000, isOn: true })
const subRelay1 = new RelayComponent({ maxPower: 800, isOn: true })
const subRelay2 = new RelayComponent({ maxPower: 800, isOn: true })

// Connect power distribution
mainRelay.connect('power_out', subRelay1, 'power_in')
mainRelay.connect('power_out', subRelay2, 'power_in')

// Monitor total power consumption
const totalLoad = subRelay1.getOutput('load_value_out') + 
                  subRelay2.getOutput('load_value_out')
```

### Automatic Load Balancing ⚡
```javascript
// Automatic load balancing relay
const balancer = new RelayComponent({
  maxPower: 1500,
  isOn: true,
  canBeOverloaded: true
})

// Monitor and balance load
setInterval(() => {
  const load = balancer.getOutput('load_value_out')
  const maxPower = balancer.maxPower
  
  if (load > maxPower * 0.9) {
    // Reduce load by shedding non-essential systems
    balancer.setInput('signal_out1', 0) // Disconnect non-essential
  }
}, 1000)
```

### Emergency Power Management ⚡
```javascript
// Emergency power management system
const emergencyRelay = new RelayComponent({
  maxPower: 500,
  isOn: false
})

// Emergency power priority system
const criticalSystems = ['lifeSupport', 'navigation', 'communications']
const nonCriticalSystems = ['entertainment', 'decorativeLights']

// Emergency shutdown
emergencyRelay.connect('power_out', (power) => {
  if (power < 100) {
    // Disconnect non-critical systems
    nonCriticalSystems.forEach(system => {
      system.disconnect()
    })
  }
})
```

## Component Comparison

| Component | Purpose | Power Support | Signal Support | Overload Protection |
|-----------|---------|---------------|----------------|-------------------|
| Relay | Power + Signal routing | ⚡ Yes | Yes | Optional |
| Power Transfer | Power only | ⚡ Yes | No | No |
| Signal Check | Signal only | No | Yes | No |
| And/Or | Logic gates | No | Yes | No |

## Power System Integration ⚡

### Power Flow
- **Input**: `power_in` receives power from source
- **Processing**: Relay forwards power when active
- **Output**: `power_out` distributes power to loads
- **Monitoring**: `load_value_out` and `power_value_out` provide feedback

### Overload Protection
- **Detection**: Monitors power input against max power
- **Response**: Automatically shuts down when overloaded
- **Recovery**: Can be reset after overload condition
- **Configuration**: Optional feature via `canBeOverloaded`

### Power Efficiency
- **Normal Operation**: 100% efficiency (no power loss)
- **Overload Condition**: 0% efficiency (no power output)
- **Monitoring**: Real-time power and load tracking

## Conclusion

The Relay component is a versatile dual-purpose component that serves as both a power distribution hub and signal routing switch in Barotrauma's electrical system. Its ability to handle power distribution with overload protection while simultaneously routing signals makes it essential for complex electrical systems.

Understanding the component's power-related features, overload protection mechanisms, and integration patterns is crucial for designing effective power distribution networks. The component's reliability and monitoring capabilities make it an invaluable tool for submarine power management. 
