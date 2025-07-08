# Barotrauma Delay Component Documentation

## Overview

The **Delay Component** is a time-based signal processing component in Barotrauma's electrical system that delays all received signals by a specified amount of time. It's essential for creating timing-based circuits, preventing signal bouncing, and implementing sequential logic systems.

## Component Details

- **Identifier**: `delaycomponent`
- **Category**: Electrical
- **Function**: DelayComponent with configurable timing properties
- **Color**: `#5e76a2` (blue-gray)
- **Base Price**: 100 marks
- **Difficulty Level**: 15

## Input/Output Pins

### Input Pins
- **`signal_in`** - Input signal to be delayed
- **`set_delay`** - Signal to set the delay time (optional)

### Output Pins
- **`signal_out`** - Delayed output signal

## Configurable Properties

### Delay Time
- **Default**: 15 seconds
- **Range**: 0 to any positive value
- **Purpose**: How long to delay incoming signals
- **Unit**: Seconds

### Reset When Signal Received
- **Default**: False
- **Purpose**: Whether to reset the delay buffer when a new signal is received
- **Behavior**: 
  - `True`: Clears all pending signals when new signal arrives
  - `False`: Continues processing existing signals normally

### Reset When Different Signal Received
- **Default**: False
- **Purpose**: Whether to reset when a different signal value is received
- **Behavior**:
  - `True`: Clears buffer when signal value changes
  - `False`: Processes all signals regardless of value changes

## Signal Processing Behavior

### Delay Mechanism
```javascript
// Basic delay operation
inputSignal → [Delay Buffer] → delayedOutput

// Example: 5-second delay
t=0s:  Input=1.0  →  Output=0.0
t=1s:  Input=0.5  →  Output=0.0
t=2s:  Input=0.0  →  Output=0.0
t=3s:  Input=0.0  →  Output=0.0
t=4s:  Input=0.0  →  Output=0.0
t=5s:  Input=0.0  →  Output=1.0  // First signal appears
t=6s:  Input=0.0  →  Output=0.5  // Second signal appears
```

### Signal Aggregation
- **Multiple Inputs**: If multiple wires connect to any input, signals are aggregated using OR logic
- **Priority**: First signal received takes precedence
- **Time-based**: Component processes signals based on configured delay time

### Buffer Management
- **FIFO Queue**: First-in, first-out signal processing
- **Memory Management**: Automatically manages buffer size based on delay time
- **Overflow Protection**: Handles buffer overflow gracefully

## Real-World Applications

### Signal Debouncing
```javascript
// Prevent rapid signal changes from causing issues
const buttonPress = 1.0;  // Button pressed
const delayTime = 0.1;    // 100ms delay

// Without delay: Multiple rapid signals
// With delay: Single clean signal after 100ms
const debouncedSignal = delayComponent.processInputs({
    signal_in: buttonPress,
    set_delay: delayTime
});
```

### Sequential Timing
```javascript
// Create sequential activation of systems
const activationSignal = 1.0;
const sequenceDelay = 2.0;  // 2 seconds between activations

// System 1 activates immediately
// System 2 activates after 2 seconds
// System 3 activates after 4 seconds
const delayedActivation = delayComponent.processInputs({
    signal_in: activationSignal,
    set_delay: sequenceDelay
});
```

### Safety Delays
```javascript
// Add safety delay to prevent immediate shutdown
const shutdownSignal = 1.0;
const safetyDelay = 5.0;  // 5-second safety delay

// Prevents accidental immediate shutdown
// Gives time to cancel if needed
const safeShutdown = delayComponent.processInputs({
    signal_in: shutdownSignal,
    set_delay: safetyDelay
});
```

### Echo Effects
```javascript
// Create echo/repeat effects for audio or visual systems
const inputSignal = 0.8;
const echoDelay = 0.5;  // 500ms echo delay

// Original signal + delayed echo
const echoEffect = delayComponent.processInputs({
    signal_in: inputSignal,
    set_delay: echoDelay
});
```

## Integration Examples

### With Signal Check Component
```javascript
// Delayed threshold checking
const sensorValue = 0.7;
const threshold = 0.5;
const delayTime = 1.0;

const isAboveThreshold = sensorValue > threshold;  // Signal Check component
const delayedCheck = delayComponent.processInputs({
    signal_in: isAboveThreshold,
    set_delay: delayTime
});
// Output: Threshold check result delayed by 1 second
```

### With Adder Component
```javascript
// Delayed signal combination
const signal1 = 0.5;
const signal2 = 0.3;
const delayTime = 2.0;

const combinedSignal = signal1 + signal2;  // Adder component
const delayedCombination = delayComponent.processInputs({
    signal_in: combinedSignal,
    set_delay: delayTime
});
// Output: Combined signal delayed by 2 seconds
```

### With Memory Component
```javascript
// Delayed memory storage
const inputData = 0.8;
const delayTime = 3.0;

const delayedData = delayComponent.processInputs({
    signal_in: inputData,
    set_delay: delayTime
});

// Memory component stores delayed data
const storedData = memoryComponent.processInputs({
    signal_in: delayedData,
    lock_state: 1.0
});
```

## JavaScript Implementation

```javascript
class DelayComponent {
    constructor(delayTime = 15, resetWhenSignalReceived = false, resetWhenDifferentSignalReceived = false) {
        this.delayTime = delayTime;
        this.resetWhenSignalReceived = resetWhenSignalReceived;
        this.resetWhenDifferentSignalReceived = resetWhenDifferentSignalReceived;
        this.signalBuffer = [];
        this.lastInputSignal = 0;
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
        const inputSignal = this.aggregateSignals(inputs.signal_in);
        const delaySetting = this.aggregateSignals(inputs.set_delay);

        // Update delay time if set_delay is provided
        if (delaySetting !== undefined && delaySetting !== 0) {
            this.delayTime = Math.max(0, delaySetting);
        }

        // Process input signal
        this.processInput(inputSignal, currentTime);

        // Update output
        this.updateOutput(currentTime);
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

    // Process input signal
    processInput(inputSignal, currentTime) {
        // Check if we should reset the buffer
        if (this.shouldResetBuffer(inputSignal)) {
            this.signalBuffer = [];
        }

        // Add signal to buffer with timestamp
        if (inputSignal !== 0 || this.signalBuffer.length > 0) {
            this.signalBuffer.push({
                value: inputSignal,
                timestamp: currentTime
            });
        }

        this.lastInputSignal = inputSignal;
    }

    // Determine if buffer should be reset
    shouldResetBuffer(inputSignal) {
        if (this.resetWhenSignalReceived && inputSignal !== 0) {
            return true;
        }
        
        if (this.resetWhenDifferentSignalReceived && inputSignal !== this.lastInputSignal) {
            return true;
        }
        
        return false;
    }

    // Update output based on delayed signals
    updateOutput(currentTime) {
        const delayMs = this.delayTime * 1000; // Convert to milliseconds
        let outputValue = 0;

        // Process signals in buffer
        const signalsToRemove = [];
        
        for (let i = 0; i < this.signalBuffer.length; i++) {
            const signal = this.signalBuffer[i];
            const timeDiff = currentTime - signal.timestamp;
            
            if (timeDiff >= delayMs) {
                // Signal has been delayed long enough
                outputValue = signal.value;
                signalsToRemove.push(i);
            }
        }

        // Remove processed signals (in reverse order to maintain indices)
        for (let i = signalsToRemove.length - 1; i >= 0; i--) {
            this.signalBuffer.splice(signalsToRemove[i], 1);
        }

        this.outputSignal = outputValue;
    }

    // Set delay time
    setDelayTime(delayTime) {
        this.delayTime = Math.max(0, delayTime);
    }

    // Set reset behavior
    setResetBehavior(resetWhenSignalReceived, resetWhenDifferentSignalReceived) {
        this.resetWhenSignalReceived = resetWhenSignalReceived;
        this.resetWhenDifferentSignalReceived = resetWhenDifferentSignalReceived;
    }

    // Get current output
    getOutput() {
        return this.outputSignal;
    }

    // Get buffer status
    getBufferStatus() {
        return {
            bufferSize: this.signalBuffer.length,
            delayTime: this.delayTime,
            pendingSignals: this.signalBuffer.map(signal => ({
                value: signal.value,
                remainingDelay: Math.max(0, this.delayTime - (Date.now() - signal.timestamp) / 1000)
            }))
        };
    }

    // Get component state
    getState() {
        return {
            delayTime: this.delayTime,
            resetWhenSignalReceived: this.resetWhenSignalReceived,
            resetWhenDifferentSignalReceived: this.resetWhenDifferentSignalReceived,
            lastInputSignal: this.lastInputSignal,
            outputSignal: this.outputSignal,
            bufferSize: this.signalBuffer.length,
            lastUpdateTime: this.lastUpdateTime
        };
    }

    // Reset component state
    reset() {
        this.signalBuffer = [];
        this.lastInputSignal = 0;
        this.outputSignal = 0;
        this.lastUpdateTime = 0;
    }
}

// Usage examples
const delayComponent = new DelayComponent(2.0); // 2-second delay

// Basic delay example
const basicResult = delayComponent.processInputs({
    signal_in: 1.0
});
console.log('Immediate output:', basicResult);  // Should be 0

// After 2 seconds, the same call would return 1.0
setTimeout(() => {
    const delayedResult = delayComponent.processInputs({
        signal_in: 0.0
    });
    console.log('Delayed output:', delayedResult);  // Should be 1.0
}, 2000);

// With reset behavior
const resetDelayComponent = new DelayComponent(1.0, true, false);
const resetResult = resetDelayComponent.processInputs({
    signal_in: 0.5
});
console.log('Reset component output:', resetResult);
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(n) where n is buffer size
- **Space Complexity**: O(n) for signal buffer storage
- **Update Rate**: ~60 FPS (16ms intervals)

### Memory Usage
- **State Variables**: 6 variables + signal buffer
- **Total Memory**: ~100-1000 bytes per component (varies with buffer size)
- **Garbage Collection**: Moderate, buffer operations create temporary objects

### Optimization Tips
- **Buffer Size**: Keep delay times reasonable to minimize memory usage
- **Update Frequency**: Use appropriate update intervals for your application
- **Reset Behavior**: Choose appropriate reset conditions to prevent buffer bloat

## Troubleshooting

### Common Issues

#### Signals Not Appearing
```javascript
// Problem: Delayed signals not appearing
// Solution: Check delay time and buffer status
const bufferStatus = delayComponent.getBufferStatus();
console.log('Buffer status:', bufferStatus);

// Problem: Delay time too long
// Solution: Reduce delay time
delayComponent.setDelayTime(1.0);  // 1 second instead of 15
```

#### Buffer Overflow
```javascript
// Problem: Too many signals in buffer
// Solution: Enable reset behavior
delayComponent.setResetBehavior(true, false);

// Problem: Memory usage too high
// Solution: Clear buffer manually
delayComponent.reset();
```

#### Performance Issues
```javascript
// Problem: Too frequent updates
// Solution: Implement update throttling
if (currentTime - this.lastUpdateTime < this.updateInterval) {
    return this.outputSignal;
}
```

### Debug Techniques
```javascript
// Enable debug logging
class DelayComponent {
    constructor(debug = false) {
        this.debug = debug;
        // ... other initialization
    }

    processInputs(inputs) {
        if (this.debug) {
            console.log('Delay inputs:', inputs);
            console.log('Buffer status:', this.getBufferStatus());
        }
        
        // ... processing logic
        
        if (this.debug) {
            console.log('Delay output:', this.outputSignal);
        }
    }
}
```

## Advanced Usage Patterns

### Cascaded Delays
```javascript
// Create multiple delay stages
const delay1 = new DelayComponent(1.0);
const delay2 = new DelayComponent(2.0);
const delay3 = new DelayComponent(3.0);

const inputSignal = 1.0;
const stage1 = delay1.processInputs({ signal_in: inputSignal });
const stage2 = delay2.processInputs({ signal_in: stage1 });
const stage3 = delay3.processInputs({ signal_in: stage2 });
// Total delay: 6 seconds
```

### Variable Delays
```javascript
// Dynamic delay time based on conditions
const baseDelay = 1.0;
const condition = sensorValue > threshold;
const dynamicDelay = condition ? baseDelay * 2 : baseDelay;

const result = delayComponent.processInputs({
    signal_in: inputSignal,
    set_delay: dynamicDelay
});
```

### Signal Echo
```javascript
// Create echo effect with multiple delays
const inputSignal = 0.8;
const echoDelays = [0.1, 0.2, 0.3]; // Multiple echo delays

const echoes = echoDelays.map(delay => {
    const echoComponent = new DelayComponent(delay);
    return echoComponent.processInputs({ signal_in: inputSignal });
});

const echoSum = echoes.reduce((sum, echo) => sum + echo, 0);
```

## Timing References

### Common Delay Times
```javascript
const DelayTimes = {
    DEBOUNCE: 0.1,      // 100ms for button debouncing
    SAFETY: 1.0,        // 1 second for safety delays
    SEQUENCE: 2.0,      // 2 seconds for sequential operations
    ECHO: 0.5,          // 500ms for echo effects
    LONG: 5.0,          // 5 seconds for long delays
    VERY_LONG: 15.0     // 15 seconds for very long delays
};
```

### Performance Guidelines
- **Short Delays**: 0.1-1.0 seconds (good performance)
- **Medium Delays**: 1.0-5.0 seconds (moderate memory usage)
- **Long Delays**: 5.0+ seconds (high memory usage, use sparingly)

## Component Comparison

| Component | Function | Use Case |
|-----------|----------|----------|
| **Delay** | Time-based delay | Signal timing, debouncing |
| **Memory** | Signal storage | State retention |
| **Signal Check** | Threshold comparison | Conditional logic |
| **Timer** | Time-based triggers | Scheduled events |

## Integration with Other Systems

### Timing System Integration
```javascript
// Integrate with timing system
class TimingSystem {
    constructor() {
        this.delayComponent = new DelayComponent(1.0);
    }

    scheduleEvent(eventSignal, delayTime) {
        return this.delayComponent.processInputs({
            signal_in: eventSignal,
            set_delay: delayTime
        });
    }
}
```

### Safety System Integration
```javascript
// Integrate with safety system
class SafetySystem {
    constructor() {
        this.delayComponent = new DelayComponent(5.0, true, false);
    }

    safeShutdown(shutdownSignal) {
        return this.delayComponent.processInputs({
            signal_in: shutdownSignal
        });
    }
}
```

This comprehensive documentation provides everything needed to understand and implement the Delay component in Barotrauma's electrical system, from basic timing operations to advanced sequential logic applications. 
