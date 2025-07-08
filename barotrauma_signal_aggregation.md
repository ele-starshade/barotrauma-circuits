# Barotrauma Signal Aggregation System

## Overview

This document describes the signal aggregation behavior in Barotrauma's electrical system, specifically how multiple wires connected to the same input are processed. This information is essential for accurately simulating the game's electrical components.

## Core Aggregation Logic

The system uses **OR-based aggregation** with specific signal handling rules:

```python
def aggregate_signals(wire_signals):
    """
    Aggregate multiple wire signals into a single input signal
    
    Args:
        wire_signals: List of signals from connected wires
                     Each signal can be: string, number, or None/empty
    
    Returns:
        The aggregated signal value
    """
    # Filter out None/empty signals
    active_signals = [signal for signal in wire_signals if signal is not None and signal != ""]
    
    if not active_signals:
        return None  # No signal received
    
    # Return the first active signal (first-come-first-served)
    return active_signals[0]
```

## Detailed Aggregation Rules

### 1. Signal Presence Detection

```python
def has_signal(wire_signals):
    """Check if any wire is carrying a signal"""
    return any(signal is not None and signal != "" for signal in wire_signals)
```

### 2. Signal Value Selection

```python
def select_signal_value(wire_signals):
    """Select which signal value to use when multiple are present"""
    active_signals = [s for s in wire_signals if s is not None and s != ""]
    
    if not active_signals:
        return None
    
    # Barotrauma uses "first signal wins" priority
    return active_signals[0]
```

## Signal Types and Handling

### Binary Signals (Boolean Logic)

```python
def aggregate_binary_signals(wire_signals):
    """
    For components that only care about signal presence/absence
    (like Not Component, basic logic gates)
    """
    return has_signal(wire_signals)
```

### Value-Based Signals (String/Numeric)

```python
def aggregate_value_signals(wire_signals):
    """
    For components that need specific signal values
    (like Signal Check Component, math operations)
    """
    return select_signal_value(wire_signals)
```

## Component-Specific Aggregation

### Not Component Aggregation

```python
def not_component_aggregate(wire_signals):
    """
    Not Component only cares about signal presence, not value
    """
    has_input_signal = has_signal(wire_signals)
    
    if has_input_signal:
        return "no_signal"  # Component outputs nothing
    else:
        return "signal"     # Component outputs a signal
```

### Signal Check Component Aggregation

```python
def signal_check_aggregate(wire_signals, target_signal):
    """
    Signal Check Component needs the actual signal value
    """
    input_signal = select_signal_value(wire_signals)
    
    if input_signal == target_signal:
        return "output_value"  # Component's configured output
    else:
        return "false_output_value"  # Component's configured false output
```

## Real-Time Processing Simulation

### Signal Update Cycle

```python
class SignalSimulator:
    def __init__(self):
        self.wires = {}  # wire_id -> signal_value
        self.components = {}  # component_id -> component_object
        self.connections = {}  # component_id -> {input_name: [wire_ids]}
    
    def update_signals(self):
        """Process one update cycle"""
        # 1. Update all component outputs based on current inputs
        for component_id, component in self.components.items():
            self.update_component(component_id)
        
        # 2. Propagate signals through wires
        self.propagate_wire_signals()
    
    def update_component(self, component_id):
        """Update a single component's output"""
        component = self.components[component_id]
        connections = self.connections[component_id]
        
        # Aggregate input signals
        input_signals = {}
        for input_name, wire_ids in connections.items():
            if input_name.startswith('signal_in'):
                wire_signals = [self.wires.get(wire_id) for wire_id in wire_ids]
                input_signals[input_name] = self.aggregate_signals(wire_signals)
        
        # Update component based on aggregated inputs
        component.process_inputs(input_signals)
```

## Wire Connection Management

### Multiple Wire Connections

```python
class WireConnection:
    def __init__(self):
        self.input_connections = {}  # component_id -> {input_name: [wire_ids]}
        self.output_connections = {}  # component_id -> {output_name: [wire_ids]}
    
    def connect_wire_to_input(self, wire_id, component_id, input_name):
        """Connect a wire to a component input (supports multiple wires)"""
        if component_id not in self.input_connections:
            self.input_connections[component_id] = {}
        
        if input_name not in self.input_connections[component_id]:
            self.input_connections[component_id][input_name] = []
        
        self.input_connections[component_id][input_name].append(wire_id)
    
    def get_input_wires(self, component_id, input_name):
        """Get all wires connected to a specific input"""
        return self.input_connections.get(component_id, {}).get(input_name, [])
```

## Complete Simulation Example

```python
class BarotraumaSignalSimulator:
    def __init__(self):
        self.wires = {}
        self.components = {}
        self.connections = WireConnection()
    
    def add_component(self, component_id, component_type, config):
        """Add a component to the simulation"""
        if component_type == "not":
            self.components[component_id] = NotComponent(config)
        elif component_type == "signal_check":
            self.components[component_id] = SignalCheckComponent(config)
        # Add other component types...
    
    def connect_wire(self, wire_id, from_component, from_output, to_component, to_input):
        """Connect a wire between components"""
        # Connect to output
        self.connections.connect_wire_to_output(wire_id, from_component, from_output)
        # Connect to input
        self.connections.connect_wire_to_input(wire_id, to_component, to_input)
    
    def set_wire_signal(self, wire_id, signal_value):
        """Set a wire's signal value"""
        self.wires[wire_id] = signal_value
    
    def get_component_input(self, component_id, input_name):
        """Get aggregated input signal for a component"""
        wire_ids = self.connections.get_input_wires(component_id, input_name)
        wire_signals = [self.wires.get(wire_id) for wire_id in wire_ids]
        return self.aggregate_signals(wire_signals)
    
    def aggregate_signals(self, wire_signals):
        """Main aggregation function"""
        active_signals = [s for s in wire_signals if s is not None and s != ""]
        return active_signals[0] if active_signals else None
    
    def simulate_step(self):
        """Run one simulation step"""
        # Update all components
        for component_id in self.components:
            self.update_component(component_id)
        
        # Propagate outputs to wires
        self.propagate_outputs()

# Usage example
simulator = BarotraumaSignalSimulator()

# Add components
simulator.add_component("not1", "not", {"continuous_output": False})
simulator.add_component("check1", "signal_check", {"target": "0", "output": "1", "false_output": ""})

# Connect wires
simulator.connect_wire("w1", "source", "signal_out", "not1", "signal_in")
simulator.connect_wire("w2", "source", "signal_out", "check1", "signal_in")

# Set wire signals
simulator.set_wire_signal("w1", "1")
simulator.set_wire_signal("w2", "0")

# Run simulation
simulator.simulate_step()
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
