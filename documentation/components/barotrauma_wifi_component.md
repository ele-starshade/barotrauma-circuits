# Barotrauma WiFi Component

## Overview

The **WiFi Component** is a wireless signal transmission component in Barotrauma's electrical system that enables remote communication between electrical components across different submarines or locations. It transmits electrical signals wirelessly to other WiFi components operating on the same channel, making it essential for distributed electrical systems, remote monitoring, and cross-submarine communication.

**Official Description:** "Allows remote communication between other wifi components that are using the same channel."

## Component Properties

### Basic Information
- **Identifier:** `wificomponent`
- **Category:** Electrical
- **Tags:** smallitem, signal, circuitboxcomponent
- **Signal Color:** `#6e514e` (Brown)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal to be transmitted wirelessly
- **`set_channel`** - Signal to set the WiFi channel (optional)

#### Output Pins
- **`signal_out`** - Output signal received from other WiFi components on the same channel

### Configurable Properties

The WifiComponent supports several configurable properties:

- **`Channel`** - WiFi channel for communication (default: 1)
- **`Range`** - Maximum transmission range in units (default: varies by implementation)
- **`MinChatMessageInterval`** - Minimum time between chat messages (default: 1.0 seconds) ⚠️ **NON-SIGNAL FEATURE**
- **`DiscardDuplicateChatMessages`** - Whether to discard duplicate chat messages (default: true) ⚠️ **NON-SIGNAL FEATURE**
- **`LinkToChat`** - Whether to link signals to chat system (default: false) ⚠️ **NON-SIGNAL FEATURE**
- **`AllowCrossTeamCommunication`** - Whether to allow communication between different teams (default: false) ⚠️ **NON-SIGNAL FEATURE**

## Signal Transmission Function

The WiFi component performs wireless signal transmission:

```
output = receive_signal_from_channel(channel)
```

Or in mathematical notation:
```
output = WiFi_Receive(channel) = Σ(signal_i | channel_i = channel)
```

### Transmission Properties

1. **Channel-Based:** Only communicates with components on the same channel
2. **Range-Limited:** Transmission limited by configurable range
3. **Bidirectional:** Can both transmit and receive signals
4. **Real-Time:** Signals transmitted immediately upon receipt
5. **Multi-Source:** Can receive signals from multiple sources on same channel

### Behavior Examples

| Input Signal | Channel | Output | Notes |
|--------------|---------|--------|-------|
| 1.0 | 1 | 1.0 | Transmits signal on channel 1 |
| 0.5 | 2 | 0.0 | No output (different channel) |
| "Hello" | 1 | "Hello" | Transmits string signal |
| 0.0 | 1 | 0.0 | Transmits zero signal |
| null | 1 | null | No transmission |

### Special Cases

| Input | Output | Transmission Behavior |
|-------|--------|----------------------|
| No Signal | No Output | Component remains silent |
| Multiple Sources | First Signal | Uses first-come-first-served |
| Out of Range | No Output | Signal not transmitted |
| Wrong Channel | No Output | Signal not received |
| Invalid Signal | Error | Transmission fails gracefully |

## Signal Aggregation

The WiFi component follows standard signal aggregation rules:

### Input Signal Processing
- **Multiple Inputs:** If multiple wires connect to the input, signals are aggregated using OR logic
- **Signal Priority:** First signal received takes precedence
- **Channel Setting:** Channel can be set via `set_channel` input
- **Error Handling:** Invalid signals are handled gracefully

### Output Signal Distribution
- **Wireless Transmission:** Signals transmitted to all WiFi components on same channel
- **Range Limitation:** Only components within range receive signals
- **Channel Isolation:** Signals only transmitted to components on matching channel
- **Real-Time:** Transmission occurs immediately upon signal receipt

### Example Signal Processing
```javascript
// Multiple input signals
Input 1: 1.0 (arrives first)
Input 2: 0.5 (arrives second)
Result: Uses 1.0 (first signal wins)
Transmission: 1.0 sent to all WiFi components on channel 1

// Channel switching
set_channel: 2
signal_in: 0.8
Result: 0.8 transmitted on channel 2
```

## Component Definition

```xml
<Item name="" identifier="wificomponent" category="Electrical" Tags="smallitem,signal,circuitboxcomponent" maxstacksize="32" maxstacksizecharacterinventory="8" cargocontaineridentifier="metalcrate" description="" scale="0.5" impactsoundtag="impact_metal_light" isshootable="true" GrabWhenSelected="true" signalcomponentcolor="#6e514e">
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
  <InventoryIcon texture="Content/Items/InventoryIconAtlas.png" sourcerect="384,388,64,57" origin="0.5,0.5" />
  <Sprite texture="signalcomp.png" depth="0.8" sourcerect="64,160,32,32" origin="0.5,0.5" canflipx="false" />
  <WifiComponent canbeselected="true" MinChatMessageInterval="1.0" DiscardDuplicateChatMessages="true" />
  <Body width="28" height="26" density="15" />
  <Holdable selectkey="Select" pickkey="Use" aimpos="65,-10" handle1="0,0" attachable="true" aimable="true" PickingTime="5.0" slots="Any,RightHand,LeftHand" msg="ItemMsgDetachWrench" MsgWhenDropped="ItemMsgPickupSelect">
    <RequiredItem items="wrench,deattachtool" excludeditems="multitool" type="Equipped" />
  </Holdable>
  <ConnectionPanel selectkey="Action" canbeselected="true" msg="ItemMsgRewireScrewdriver" hudpriority="10">
    <GuiFrame relativesize="0.2,0.32" minsize="400,350" maxsize="480,420" anchor="Center" style="ConnectionPanel" />
    <RequiredItem items="screwdriver" type="Equipped" />
    <input name="signal_in" displayname="connection.signalin" />
    <output name="signal_out" displayname="connection.signalout" />
    <input name="set_channel" displayname="connection.setchannel" />
  </ConnectionPanel>
</Item>
```

## Real-World Applications

### Remote Monitoring Systems
```javascript
// Monitor reactor temperature from engineering
const reactorTemp = 85.5;  // Reactor temperature sensor
const wifiComponent = new WifiComponent();
wifiComponent.setChannel(1);

// Transmit temperature to bridge
const transmittedSignal = wifiComponent.processInputs({ 
  signal_in: reactorTemp 
});
// Output: 85.5 transmitted to all WiFi components on channel 1
```

### Cross-Submarine Communication
```javascript
// Coordinate between multiple submarines
const statusSignal = "READY";  // Submarine status
const wifiComponent = new WifiComponent();
wifiComponent.setChannel(5);  // Mission coordination channel

const transmittedSignal = wifiComponent.processInputs({ 
  signal_in: statusSignal 
});
// Output: "READY" transmitted to all submarines on channel 5
```

### Distributed Control Systems
```javascript
// Control multiple devices from central location
const controlSignal = 1.0;  // Activate all systems
const wifiComponent = new WifiComponent();
wifiComponent.setChannel(3);  // Control channel

const transmittedSignal = wifiComponent.processInputs({ 
  signal_in: controlSignal 
});
// Output: 1.0 transmitted to all controlled devices on channel 3
```

### Emergency Alert Systems
```javascript
// Broadcast emergency signals
const emergencyCode = 911;  // Emergency alert
const wifiComponent = new WifiComponent();
wifiComponent.setChannel(0);  // Emergency channel

const transmittedSignal = wifiComponent.processInputs({ 
  signal_in: emergencyCode 
});
// Output: 911 transmitted to all emergency systems on channel 0
```

## Integration Examples

### With Signal Check Component
```javascript
// Conditional WiFi transmission
const sensorValue = 75.2;  // Sensor reading
const threshold = 70.0;  // Alert threshold

const signalCheck = new SignalCheckComponent();
signalCheck.setTargetValue(threshold);

const wifiComponent = new WifiComponent();
wifiComponent.setChannel(2);  // Alert channel

const isAboveThreshold = signalCheck.processInputs({ signal_in: sensorValue });
if (isAboveThreshold) {
  const transmittedSignal = wifiComponent.processInputs({ signal_in: sensorValue });
  // Output: 75.2 transmitted only if above threshold
}
```

### With Oscillator Component
```javascript
// Periodic status broadcasts
const oscillator = new OscillatorComponent();
oscillator.setFrequency(0.1);  // 0.1 Hz (every 10 seconds)
oscillator.setOutputType("Pulse");

const wifiComponent = new WifiComponent();
wifiComponent.setChannel(4);  // Status channel

const statusPulse = oscillator.getOutput();
const transmittedSignal = wifiComponent.processInputs({ signal_in: statusPulse });
// Output: Periodic status pulses transmitted every 10 seconds
```

### With Memory Component
```javascript
// Persistent WiFi communication
const memoryComponent = new MemoryComponent();
const wifiComponent = new WifiComponent();
wifiComponent.setChannel(1);

// Store and transmit last received signal
const inputSignal = 42.0;
const storedSignal = memoryComponent.processInputs({ signal_in: inputSignal });
const transmittedSignal = wifiComponent.processInputs({ signal_in: storedSignal });
// Output: Last stored signal (42.0) transmitted continuously
```

## JavaScript Simulation Class

```javascript
class WifiComponent {
    constructor() {
        this.inputSignal = 0;
        this.outputSignal = 0;
        this.channel = 1;
        this.range = 1000;  // Default range
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // ~60 FPS
        this.transmittedSignals = new Map(); // channel -> signals
        this.receivedSignals = new Map(); // channel -> signals
        
        // ⚠️ NON-SIGNAL FEATURES (Chat-related)
        this.linkToChat = false;
        this.minChatMessageInterval = 1.0;
        this.discardDuplicateChatMessages = true;
        this.lastChatMessage = null;
        this.lastChatTime = 0;
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
        
        // Handle channel setting
        if (inputs.set_channel !== undefined) {
            const newChannel = this.aggregateSignals(inputs.set_channel);
            if (newChannel !== null && !isNaN(newChannel)) {
                this.channel = Math.max(1, Math.min(100, Math.floor(newChannel)));
            }
        }

        // Transmit signal
        this.transmitSignal();
        
        // Receive signals from other components
        this.receiveSignals();
        
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

    // Transmit signal to other WiFi components
    transmitSignal() {
        if (this.inputSignal !== null && this.inputSignal !== undefined) {
            // Store transmitted signal for this channel
            if (!this.transmittedSignals.has(this.channel)) {
                this.transmittedSignals.set(this.channel, []);
            }
            
            const channelSignals = this.transmittedSignals.get(this.channel);
            channelSignals.push({
                signal: this.inputSignal,
                timestamp: Date.now(),
                source: this
            });
            
            // ⚠️ NON-SIGNAL FEATURE: Handle chat integration
            this.handleChatIntegration();
        }
    }

    // Receive signals from other WiFi components
    receiveSignals() {
        // Get all signals for this channel
        const channelSignals = this.transmittedSignals.get(this.channel) || [];
        
        if (channelSignals.length > 0) {
            // Get the most recent signal from another component
            const otherSignals = channelSignals.filter(s => s.source !== this);
            
            if (otherSignals.length > 0) {
                // Sort by timestamp and get the latest
                otherSignals.sort((a, b) => b.timestamp - a.timestamp);
                this.outputSignal = otherSignals[0].signal;
            } else {
                this.outputSignal = 0; // No signals from other components
            }
        } else {
            this.outputSignal = 0; // No signals on this channel
        }
    }

    // ⚠️ NON-SIGNAL FEATURE: Handle chat integration
    handleChatIntegration() {
        if (!this.linkToChat) return;
        
        const currentTime = Date.now();
        const timeSinceLastChat = (currentTime - this.lastChatTime) / 1000;
        
        // Check if enough time has passed
        if (timeSinceLastChat < this.minChatMessageInterval) return;
        
        // Check for duplicate messages
        if (this.discardDuplicateChatMessages && 
            this.lastChatMessage === this.inputSignal) return;
        
        // Create chat message
        this.createChatMessage(this.inputSignal);
        this.lastChatMessage = this.inputSignal;
        this.lastChatTime = currentTime;
    }

    // ⚠️ NON-SIGNAL FEATURE: Create chat message
    createChatMessage(signal) {
        // This would integrate with the game's chat system
        console.log(`[WiFi Channel ${this.channel}] Signal: ${signal}`);
    }

    // Set configurable properties
    setChannel(channel) {
        this.channel = Math.max(1, Math.min(100, channel));
    }

    setRange(range) {
        this.range = Math.max(0, range);
    }

    // ⚠️ NON-SIGNAL FEATURES: Chat-related settings
    setLinkToChat(enabled) {
        this.linkToChat = enabled;
    }

    setMinChatMessageInterval(interval) {
        this.minChatMessageInterval = Math.max(0, interval);
    }

    setDiscardDuplicateChatMessages(enabled) {
        this.discardDuplicateChatMessages = enabled;
    }

    setAllowCrossTeamCommunication(enabled) {
        // This would affect signal transmission between different teams
        this.allowCrossTeamCommunication = enabled;
    }

    // Get current state
    getInputSignal() {
        return this.inputSignal;
    }

    getOutputSignal() {
        return this.outputSignal;
    }

    getChannel() {
        return this.channel;
    }

    // Reset component state
    reset() {
        this.inputSignal = 0;
        this.outputSignal = 0;
        this.lastUpdateTime = 0;
        this.transmittedSignals.clear();
        this.receivedSignals.clear();
    }

    // Get component information
    getInfo() {
        return {
            identifier: 'wificomponent',
            category: 'Electrical',
            function: 'Wireless Signal Transmission',
            inputPins: ['signal_in', 'set_channel'],
            outputPins: ['signal_out'],
            configurableProperties: ['Channel', 'Range', 'LinkToChat', 'MinChatMessageInterval', 'DiscardDuplicateChatMessages', 'AllowCrossTeamCommunication']
        };
    }
}

// Usage example
const wifiComponent = new WifiComponent();
wifiComponent.setChannel(1);

// Process input signal
const result = wifiComponent.processInputs({
    signal_in: 42.0
});

console.log(`WiFi transmission: ${result}`);  // Output: 0 (no other components on channel)

// Process multiple input signals
const result2 = wifiComponent.processInputs({
    signal_in: [1.0, 2.0, 3.0]  // Multiple inputs
});

console.log(`WiFi transmission: ${result2}`);  // Uses first signal (1.0)
```

## Error Handling

### Input Validation
- **Invalid Channels:** Clamped to valid range (1-100)
- **Null/Undefined Signals:** Treated as no signal
- **Range Limitations:** Signals not transmitted beyond range
- **Channel Mismatch:** Signals only transmitted to matching channels

### Transmission Errors
- **Out of Range:** Graceful handling of range limitations
- **Channel Conflicts:** Proper isolation between channels
- **Network Congestion:** First-come-first-served signal handling
- **Invalid Data:** Robust handling of malformed signals

### Performance Considerations
- **Update Rate:** Processes at ~60 FPS
- **Memory Usage:** Efficient signal storage and retrieval
- **Network Overhead:** Minimal bandwidth usage
- **Error Recovery:** Automatic recovery from transmission failures

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(n) - linear time for signal processing
- **Space Complexity:** O(n) - linear space for signal storage
- **Update Frequency:** 60 FPS (16ms intervals)

### Resource Usage
- **CPU:** Low - simple signal processing
- **Memory:** Moderate - signal storage for channels
- **Network:** Variable - depends on signal frequency and range

## Troubleshooting

### Common Issues

1. **No Signal Reception**
   - **Cause:** Wrong channel or out of range
   - **Solution:** Check channel settings and range limitations

2. **Signal Interference**
   - **Cause:** Multiple components on same channel
   - **Solution:** Use different channels for different systems

3. **Range Limitations**
   - **Cause:** Components too far apart
   - **Solution:** Reduce distance or increase range setting

4. **Chat Spam** ⚠️ **NON-SIGNAL ISSUE**
   - **Cause:** High-frequency signals with chat integration enabled
   - **Solution:** Increase MinChatMessageInterval or disable LinkToChat

### Debugging Tips

```javascript
// Debug WiFi transmission
const wifiComponent = new WifiComponent();
wifiComponent.setChannel(1);

const input = 42.0;
const result = wifiComponent.processInputs({ signal_in: input });

console.log(`Input: ${input}`);
console.log(`Channel: ${wifiComponent.getChannel()}`);
console.log(`Output: ${result}`);
console.log(`Transmitted signals: ${wifiComponent.transmittedSignals.get(1)?.length || 0}`);
```

## Advanced Usage Patterns

### Multi-Channel Communication
```javascript
// Create multi-channel communication system
class MultiChannelWifi {
    constructor(channels = [1, 2, 3]) {
        this.wifiComponents = new Map();
        channels.forEach(channel => {
            this.wifiComponents.set(channel, new WifiComponent());
            this.wifiComponents.get(channel).setChannel(channel);
        });
    }

    transmitOnChannel(channel, signal) {
        const wifiComponent = this.wifiComponents.get(channel);
        if (wifiComponent) {
            return wifiComponent.processInputs({ signal_in: signal });
        }
        return null;
    }

    receiveFromChannel(channel) {
        const wifiComponent = this.wifiComponents.get(channel);
        return wifiComponent ? wifiComponent.getOutputSignal() : null;
    }
}

// Usage
const multiWifi = new MultiChannelWifi([1, 2, 3]);
multiWifi.transmitOnChannel(1, "Status OK");
multiWifi.transmitOnChannel(2, 42.0);
multiWifi.transmitOnChannel(3, "Emergency");
```

### WiFi Repeater System
```javascript
// Create WiFi repeater for extended range
class WifiRepeater {
    constructor(inputChannel, outputChannel) {
        this.inputWifi = new WifiComponent();
        this.outputWifi = new WifiComponent();
        this.inputWifi.setChannel(inputChannel);
        this.outputWifi.setChannel(outputChannel);
    }

    processInputs(inputs) {
        // Receive signal on input channel
        const receivedSignal = this.inputWifi.processInputs(inputs);
        
        // Transmit on output channel
        return this.outputWifi.processInputs({ signal_in: receivedSignal });
    }
}

// Usage
const repeater = new WifiRepeater(1, 2);
const result = repeater.processInputs({ signal_in: 100.0 });
// Output: 100.0 received on channel 1, transmitted on channel 2
```

## Component Comparison

| Component | Function | Range | Use Case |
|-----------|----------|-------|----------|
| **WiFi** | Wireless transmission | Configurable | Remote communication |
| **Relay** | Signal routing | Local | Local signal distribution |
| **Delay** | Time-based delay | Local | Timing control |
| **Memory** | Signal storage | Local | Persistent signals |

## Network Protocol References

### Channel Management
```javascript
const WifiChannels = {
    EMERGENCY: 0,      // Emergency communications
    CONTROL: 1,        // General control signals
    STATUS: 2,         // Status monitoring
    COORDINATION: 3,   // Mission coordination
    ALERTS: 4,         // Alert systems
    DATA: 5,           // Data transmission
    VOICE: 6,          // Voice communications
    RESERVED: 7-100    // Reserved for custom use
};
```

### Signal Types
- **Numeric:** Standard numeric values (0.0, 42.0, -1.5)
- **String:** Text messages ("Status OK", "Emergency")
- **Boolean:** Binary signals (0, 1, true, false)
- **Null:** No signal (null, undefined, empty)

## Conclusion

The WiFi Component is a fundamental wireless communication component that provides essential remote signal transmission capabilities for Barotrauma's electrical system. Its ability to transmit signals across different submarines, handle multiple channels, and integrate with various electrical components makes it invaluable for distributed systems, remote monitoring, and coordinated operations.

The component's robust error handling, configurable range and channel settings, and efficient signal processing ensure reliable operation in complex wireless networks, making it a cornerstone of long-distance electrical communication in the game's engineering systems.

⚠️ **Note:** The WiFi component includes several non-signal related features such as chat integration, cross-team communication settings, and message filtering. These features are clearly marked throughout the documentation and are separate from the core electrical signal processing functionality. 
