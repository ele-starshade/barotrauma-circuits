# Barotrauma Signal Aggregation System

## Overview

This document describes the signal aggregation behavior in Barotrauma's electrical system, specifically how multiple wires connected to the same input are processed. This information is essential for accurately simulating the game's electrical components.

## Core Aggregation Logic

The system uses **OR-based aggregation** with specific signal handling rules:

```javascript
function aggregateSignals(wireSignals) {
    /**
     * Aggregate multiple wire signals into a single input signal
     * 
     * @param {Array} wireSignals - List of signals from connected wires
     *                              Each signal can be: string, number, null, or empty
     * @returns {string|number|null} The aggregated signal value
     */
    // Filter out null/empty signals
    const activeSignals = wireSignals.filter(signal => 
        signal !== null && signal !== undefined && signal !== ""
    );
    
    if (activeSignals.length === 0) {
        return null; // No signal received
    }
    
    // Return the first active signal (first-come-first-served)
    return activeSignals[0];
}
```

## Detailed Aggregation Rules

### 1. Signal Presence Detection

```javascript
function hasSignal(wireSignals) {
    /** Check if any wire is carrying a signal */
    return wireSignals.some(signal => 
        signal !== null && signal !== undefined && signal !== ""
    );
}
```

### 2. Signal Value Selection

```javascript
function selectSignalValue(wireSignals) {
    /** Select which signal value to use when multiple are present */
    const activeSignals = wireSignals.filter(s => 
        s !== null && s !== undefined && s !== ""
    );
    
    if (activeSignals.length === 0) {
        return null;
    }
    
    // Barotrauma uses "first signal wins" priority
    return activeSignals[0];
}
```

## Signal Types and Handling

### Binary Signals (Boolean Logic)

```javascript
function aggregateBinarySignals(wireSignals) {
    /**
     * For components that only care about signal presence/absence
     * (like Not Component, basic logic gates)
     */
    return hasSignal(wireSignals);
}
```

### Value-Based Signals (String/Numeric)

```javascript
function aggregateValueSignals(wireSignals) {
    /**
     * For components that need specific signal values
     * (like Signal Check Component, math operations)
     */
    return selectSignalValue(wireSignals);
}
```

## Component-Specific Aggregation

### Not Component Aggregation

```javascript
function notComponentAggregate(wireSignals) {
    /**
     * Not Component only cares about signal presence, not value
     */
    const hasInputSignal = hasSignal(wireSignals);
    
    if (hasInputSignal) {
        return "no_signal"; // Component outputs nothing
    } else {
        return "signal";    // Component outputs a signal
    }
}
```

### Signal Check Component Aggregation

```javascript
function signalCheckAggregate(wireSignals, targetSignal) {
    /**
     * Signal Check Component needs the actual signal value
     */
    const inputSignal = selectSignalValue(wireSignals);
    
    if (inputSignal === targetSignal) {
        return "output_value"; // Component's configured output
    } else {
        return "false_output_value"; // Component's configured false output
    }
}
```

## Real-Time Processing Simulation

### Signal Update Cycle

```javascript
class SignalSimulator {
    constructor() {
        this.wires = {}; // wire_id -> signal_value
        this.components = {}; // component_id -> component_object
        this.connections = {}; // component_id -> {input_name: [wire_ids]}
    }
    
    updateSignals() {
        /** Process one update cycle */
        // 1. Update all component outputs based on current inputs
        for (const [componentId, component] of Object.entries(this.components)) {
            this.updateComponent(componentId);
        }
        
        // 2. Propagate signals through wires
        this.propagateWireSignals();
    }
    
    updateComponent(componentId) {
        /** Update a single component's output */
        const component = this.components[componentId];
        const connections = this.connections[componentId];
        
        // Aggregate input signals
        const inputSignals = {};
        for (const [inputName, wireIds] of Object.entries(connections)) {
            if (inputName.startsWith('signal_in')) {
                const wireSignals = wireIds.map(wireId => this.wires[wireId]);
                inputSignals[inputName] = this.aggregateSignals(wireSignals);
            }
        }
        
        // Update component based on aggregated inputs
        component.processInputs(inputSignals);
    }
}
```

## Wire Connection Management

### Multiple Wire Connections

```javascript
class WireConnection {
    constructor() {
        this.inputConnections = {}; // component_id -> {input_name: [wire_ids]}
        this.outputConnections = {}; // component_id -> {output_name: [wire_ids]}
    }
    
    connectWireToInput(wireId, componentId, inputName) {
        /** Connect a wire to a component input (supports multiple wires) */
        if (!this.inputConnections[componentId]) {
            this.inputConnections[componentId] = {};
        }
        
        if (!this.inputConnections[componentId][inputName]) {
            this.inputConnections[componentId][inputName] = [];
        }
        
        this.inputConnections[componentId][inputName].push(wireId);
    }
    
    getInputWires(componentId, inputName) {
        /** Get all wires connected to a specific input */
        return this.inputConnections[componentId]?.[inputName] || [];
    }
}
```

## Complete Simulation Example

```javascript
class BarotraumaSignalSimulator {
    constructor() {
        this.wires = {};
        this.components = {};
        this.connections = new WireConnection();
    }
    
    addComponent(componentId, componentType, config) {
        /** Add a component to the simulation */
        if (componentType === "not") {
            this.components[componentId] = new NotComponent(config);
        } else if (componentType === "signal_check") {
            this.components[componentId] = new SignalCheckComponent(config);
        }
        // Add other component types...
    }
    
    connectWire(wireId, fromComponent, fromOutput, toComponent, toInput) {
        /** Connect a wire between components */
        // Connect to output
        this.connections.connectWireToOutput(wireId, fromComponent, fromOutput);
        // Connect to input
        this.connections.connectWireToInput(wireId, toComponent, toInput);
    }
    
    setWireSignal(wireId, signalValue) {
        /** Set a wire's signal value */
        this.wires[wireId] = signalValue;
    }
    
    getComponentInput(componentId, inputName) {
        /** Get aggregated input signal for a component */
        const wireIds = this.connections.getInputWires(componentId, inputName);
        const wireSignals = wireIds.map(wireId => this.wires[wireId]);
        return this.aggregateSignals(wireSignals);
    }
    
    aggregateSignals(wireSignals) {
        /** Main aggregation function */
        const activeSignals = wireSignals.filter(s => s !== null && s !== undefined && s !== "");
        return activeSignals.length > 0 ? activeSignals[0] : null;
    }
    
    simulateStep() {
        /** Run one simulation step */
        // Update all components
        for (const componentId in this.components) {
            this.updateComponent(componentId);
        }
        
        // Propagate outputs to wires
        this.propagateOutputs();
    }
}

// Usage example
const simulator = new BarotraumaSignalSimulator();

// Add components
simulator.addComponent("not1", "not", { continuousOutput: false });
simulator.addComponent("check1", "signal_check", { target: "0", output: "1", falseOutput: "" });

// Connect wires
simulator.connectWire("w1", "source", "signal_out", "not1", "signal_in");
simulator.connectWire("w2", "source", "signal_out", "check1", "signal_in");

// Set wire signals
simulator.setWireSignal("w1", "1");
simulator.setWireSignal("w2", "0");

// Run simulation
simulator.simulateStep();
```

## Signal Aggregation Examples

### Example 1: Multiple Wires to Not Component

```
Wire A (signal="1") + Wire B (no signal) → Not Component
```

**Processing:**
1. Input receives signal "1" (from Wire A)
2. Not Component processes: signal present → output "no signal"
3. Result: No signal sent to output

### Example 2: Multiple Wires to Signal Check Component

```
Wire A (signal="50") + Wire B (signal="90") → Signal Check (target="0")
```

**Processing:**
1. Input receives signal "50" (from Wire A - first signal wins)
2. Signal Check compares: "50" ≠ "0"
3. Result: Outputs `FalseOutput` value

### Example 3: Complex Battery Controller Logic

```
Memory (90) → Wire 1104 → Greater Component (signal_in2)
Memory (50) → Wire 1103 → Greater Component (signal_in1)
```

**Processing:**
1. Two separate inputs to Greater Component
2. Compares signal_in1 (50) vs signal_in2 (90)
3. Result: 50 < 90, so outputs configured signal

## Wire Connection Patterns

### Pattern 1: Fan-Out (Distribution)

```
Single Source → Multiple Destinations
```

**Use Case:** Broadcasting a signal to multiple components
**Example:** Terminal output sending state to multiple lights

### Pattern 2: Fan-In (Aggregation)

```
Multiple Sources → Single Destination
```

**Use Case:** Combining signals from multiple sources
**Example:** Multiple sensors feeding into one alarm system

### Pattern 3: Bidirectional

```
Component A ↔ Component B (multiple wires in both directions)
```

**Use Case:** Complex feedback loops
**Example:** Generator state monitoring and control

## Signal Priority and Timing

### Signal Priority

- **First Signal Wins:** When multiple wires carry different signals, the first one received is processed
- **Signal Persistence:** Signals remain active until the source changes or wire is disconnected
- **Real-time Processing:** All signal changes are processed immediately

### Timing Considerations

- **Propagation Delay:** Signals travel through wires with minimal delay
- **Synchronization:** Multiple wires to the same input are processed simultaneously
- **State Consistency:** All connected components receive updated signals at the same time

## Key Implementation Points

1. **OR Logic:** Any active wire provides a signal to the input
2. **First Signal Priority:** When multiple signals exist, use the first one
3. **Real-time Updates:** Process all components simultaneously
4. **Signal Persistence:** Signals remain until explicitly changed
5. **Type Handling:** Support both binary (presence/absence) and value-based signals

## Troubleshooting Multiple Wire Connections

### Common Issues

1. **Signal Conflicts:** Multiple sources sending different signals
2. **Wire Capacity:** Circuit box has 10-wire limit
3. **Signal Loss:** Long wire runs or too many connections
4. **Logic Confusion:** Complex networks hard to debug

### Best Practices

1. **Use Color-Coded Wires:** Different colors for different signal types
2. **Limit Fan-Out:** Don't connect too many destinations to one source
3. **Document Connections:** Keep track of wire IDs and purposes
4. **Test Incrementally:** Add wires one at a time and test

## Component Reference

### Not Component

- **Input:** `signal_in` (supports multiple wires)
- **Output:** `signal_out`
- **Logic:** Outputs signal when input has no signal, outputs nothing when input has signal
- **Aggregation:** Binary (presence/absence only)

### Signal Check Component

- **Input:** `signal_in` (supports multiple wires)
- **Output:** `signal_out`
- **Logic:** Compares input signal against target signal, outputs configured value based on match
- **Aggregation:** Value-based (uses actual signal value)

### Greater Component

- **Input:** `signal_in1`, `signal_in2` (each supports multiple wires)
- **Output:** `signal_out`
- **Logic:** Compares two input values, outputs configured signal based on comparison
- **Aggregation:** Value-based for each input separately

This aggregation system allows for the creation of sophisticated electrical systems, from simple on/off controls to complex automated systems with multiple sensors and actuators. 
