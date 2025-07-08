# Barotrauma Concatenation Component Documentation

## Overview

The **Concatenation Component** is a specialized signal processing component in Barotrauma's electrical system that combines multiple input signals into a single concatenated string output. It's designed for text processing and string manipulation, allowing you to build complex messages from individual signal components.

## Component Details

- **Identifier**: `concatcomponent`
- **Category**: Electrical
- **Function**: ConcatComponent with configurable properties
- **Color**: `#eb5505` (orange)
- **Base Price**: 100 marks
- **Difficulty Level**: 15

## Input/Output Pins

### Input Pins
- **`signal_in1`** - First input signal (converted to string)
- **`signal_in2`** - Second input signal (converted to string)

### Output Pins
- **`signal_out`** - Concatenated string output

## Configurable Properties

### Separator
- **Default**: `+` (plus sign)
- **Purpose**: Character(s) placed between input strings
- **Examples**: `+`, `-`, ` ` (space), `, ` (comma and space)

### Max Output Length
- **Default**: 256 characters
- **Purpose**: Maximum length of the output string
- **Warning**: Large values can cause high memory usage or network load

### Time Frame
- **Default**: 0 (immediate processing)
- **Purpose**: Time window for signal processing (in seconds)

## Signal Processing Behavior

### String Conversion
All input signals are automatically converted to strings:
- **Numbers**: Converted to string representation
- **Boolean**: `true` → `"1"`, `false` → `"0"`
- **Null/Undefined**: Converted to empty string `""`
- **Objects**: Converted to JSON string representation

### Concatenation Logic
```javascript
// Basic concatenation
output = string1 + separator + string2

// Example with separator "+"
// Input: "mud" + "raptor" → Output: "mud+raptor"

// Example with space separator
// Input: "mud" + "raptor" → Output: "mud raptor"
```

### Signal Aggregation
- **Multiple Inputs**: If multiple wires connect to any input, signals are aggregated using OR logic
- **Priority**: First signal received takes precedence
- **Time-based**: Component processes signals based on configured time frame

### Error Handling
- **Invalid Inputs**: Handles NaN and infinite values by converting to string
- **Length Limiting**: Output is automatically truncated to max output length
- **Empty Inputs**: Empty or null inputs are treated as empty strings

## Real-World Applications

### Status Message Generation
```javascript
// Create status message from multiple sensors
const systemStatus = "ONLINE";
const powerLevel = "85%";
const temperature = "23°C";

const statusMessage = systemStatus + " | " + powerLevel + " | " + temperature;
// Output: "ONLINE | 85% | 23°C"
```

### Coordinate Display
```javascript
// Display submarine coordinates
const xCoord = 1250;
const yCoord = 450;
const depth = 500;

const coordinates = "X:" + xCoord + " Y:" + yCoord + " Depth:" + depth + "m";
// Output: "X:1250 Y:450 Depth:500m"
```

### Alert System Messages
```javascript
// Create alert messages
const alertType = "WARNING";
const systemName = "REACTOR";
const message = "Temperature critical";

const alertMessage = alertType + " - " + systemName + ": " + message;
// Output: "WARNING - REACTOR: Temperature critical"
```

### Inventory Labels
```javascript
// Create item labels
const itemType = "MEDICAL";
const itemName = "BANDAGE";
const quantity = 5;

const label = itemType + " " + itemName + " x" + quantity;
// Output: "MEDICAL BANDAGE x5"
```

## Integration Examples

### With Signal Check Component
```javascript
// Conditional message based on sensor reading
const sensorValue = 0.8;
const threshold = 0.5;
const isActive = sensorValue > threshold;  // Signal Check component

const status = isActive ? "ACTIVE" : "INACTIVE";
const message = "Sensor Status: " + status;
// Output: "Sensor Status: ACTIVE" or "Sensor Status: INACTIVE"
```

### With Adder Component
```javascript
// Combine numerical values with text
const baseValue = 100;
const bonusValue = 25;
const totalValue = baseValue + bonusValue;  // Adder component

const displayText = "Total Score: " + totalValue + " points";
// Output: "Total Score: 125 points"
```

### With Multiplier Component
```javascript
// Scale values in messages
const baseAmount = 10;
const multiplier = 2.5;
const scaledAmount = baseAmount * multiplier;  // Multiplier component

const message = "Required: " + scaledAmount + " units";
// Output: "Required: 25 units"
```

## JavaScript Implementation

```javascript
class ConcatenationComponent {
    constructor(separator = "+", maxOutputLength = 256, timeFrame = 0) {
        this.input1 = "";
        this.input2 = "";
        this.output = "";
        this.separator = separator;
        this.maxOutputLength = maxOutputLength;
        this.timeFrame = timeFrame;
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // ~60 FPS
        this.inputBuffer = [];
    }

    // Process input signals
    processInputs(inputs) {
        const currentTime = Date.now();
        
        // Check if enough time has passed for update
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return this.output;
        }

        // Update input values with signal aggregation
        this.input1 = this.aggregateSignals(inputs.signal_in1);
        this.input2 = this.aggregateSignals(inputs.signal_in2);

        // Calculate output
        this.calculateOutput();
        this.lastUpdateTime = currentTime;
        
        return this.output;
    }

    // Aggregate multiple input signals using OR logic
    aggregateSignals(signals) {
        if (!Array.isArray(signals)) {
            return this.convertToString(signals || "");
        }
        
        // OR logic: return first non-empty signal, or empty string if all are empty
        for (const signal of signals) {
            const stringValue = this.convertToString(signal);
            if (stringValue !== "") {
                return stringValue;
            }
        }
        return "";
    }

    // Convert any value to string
    convertToString(value) {
        if (value === null || value === undefined) {
            return "";
        }
        
        if (typeof value === "boolean") {
            return value ? "1" : "0";
        }
        
        if (typeof value === "number") {
            if (isNaN(value) || !isFinite(value)) {
                return "";
            }
            return value.toString();
        }
        
        if (typeof value === "object") {
            try {
                return JSON.stringify(value);
            } catch (error) {
                return "[Object]";
            }
        }
        
        return String(value);
    }

    // Calculate concatenated output
    calculateOutput() {
        try {
            // Convert inputs to strings
            const string1 = this.convertToString(this.input1);
            const string2 = this.convertToString(this.input2);

            // Perform concatenation
            if (string1 === "" && string2 === "") {
                this.output = "";
            } else if (string1 === "") {
                this.output = string2;
            } else if (string2 === "") {
                this.output = string1;
            } else {
                this.output = string1 + this.separator + string2;
            }

            // Apply length limit
            if (this.output.length > this.maxOutputLength) {
                this.output = this.output.substring(0, this.maxOutputLength);
            }

        } catch (error) {
            console.error('Concatenation error:', error);
            this.output = "";
        }
    }

    // Set separator
    setSeparator(separator) {
        this.separator = separator || "+";
    }

    // Set max output length
    setMaxOutputLength(length) {
        this.maxOutputLength = Math.max(1, length || 256);
    }

    // Set time frame
    setTimeFrame(timeFrame) {
        this.timeFrame = Math.max(0, timeFrame || 0);
    }

    // Get current output
    getOutput() {
        return this.output;
    }

    // Get component state
    getState() {
        return {
            input1: this.input1,
            input2: this.input2,
            output: this.output,
            separator: this.separator,
            maxOutputLength: this.maxOutputLength,
            timeFrame: this.timeFrame,
            lastUpdateTime: this.lastUpdateTime
        };
    }

    // Reset component state
    reset() {
        this.input1 = "";
        this.input2 = "";
        this.output = "";
        this.lastUpdateTime = 0;
        this.inputBuffer = [];
    }
}

// Usage examples
const concatComponent = new ConcatenationComponent();

// Basic concatenation
const basicResult = concatComponent.processInputs({
    signal_in1: "mud",
    signal_in2: "raptor"
});
console.log('Basic result:', basicResult);  // "mud+raptor"

// With custom separator
const customComponent = new ConcatenationComponent(" - ", 100);
const customResult = customComponent.processInputs({
    signal_in1: "WARNING",
    signal_in2: "Reactor overheating"
});
console.log('Custom result:', customResult);  // "WARNING - Reactor overheating"

// With numerical inputs
const numberResult = concatComponent.processInputs({
    signal_in1: 1250,
    signal_in2: 450
});
console.log('Number result:', numberResult);  // "1250+450"
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(n) where n is the length of concatenated string
- **Space Complexity**: O(n) for output string storage
- **Update Rate**: ~60 FPS (16ms intervals)

### Memory Usage
- **State Variables**: 6 variables + string buffers
- **Total Memory**: ~100-500 bytes per component (varies with string length)
- **Garbage Collection**: Moderate, string operations create temporary objects

### Optimization Tips
- **String Length**: Keep max output length reasonable (256-1024 characters)
- **Separator Choice**: Use short separators to minimize memory usage
- **Input Validation**: Validate inputs before concatenation to avoid errors

## Troubleshooting

### Common Issues

#### Output Too Long
```javascript
// Problem: Output exceeds max length
// Solution: Adjust max output length
concatComponent.setMaxOutputLength(512);

// Problem: Separator too long
// Solution: Use shorter separator
concatComponent.setSeparator(" ");
```

#### Incorrect Concatenation
```javascript
// Problem: Numbers not converting properly
// Solution: Ensure proper string conversion
const numberInput = 42;
const stringInput = "test";
// Both will be converted to strings automatically
```

#### Performance Issues
```javascript
// Problem: Too frequent updates
// Solution: Implement update throttling
if (currentTime - this.lastUpdateTime < this.updateInterval) {
    return this.output;
}
```

### Debug Techniques
```javascript
// Enable debug logging
class ConcatenationComponent {
    constructor(debug = false) {
        this.debug = debug;
        // ... other initialization
    }

    processInputs(inputs) {
        if (this.debug) {
            console.log('Concat inputs:', inputs);
        }
        
        // ... processing logic
        
        if (this.debug) {
            console.log('Concat output:', this.output);
        }
    }
}
```

## Advanced Usage Patterns

### Dynamic Separator Selection
```javascript
// Choose separator based on input type
function getSeparator(input1, input2) {
    if (typeof input1 === "number" && typeof input2 === "number") {
        return " + ";  // Mathematical separator
    } else {
        return " | ";  // Text separator
    }
}

const separator = getSeparator(input1, input2);
concatComponent.setSeparator(separator);
```

### Conditional Concatenation
```javascript
// Only concatenate if both inputs are valid
function conditionalConcat(input1, input2) {
    if (input1 && input2) {
        return input1 + " + " + input2;
    } else if (input1) {
        return input1;
    } else if (input2) {
        return input2;
    } else {
        return "";
    }
}
```

### Multi-Input Concatenation
```javascript
// Extend component for multiple inputs
class MultiConcatComponent extends ConcatenationComponent {
    constructor(separator = "+", maxOutputLength = 256) {
        super(separator, maxOutputLength);
        this.inputs = [];
    }

    addInput(input) {
        this.inputs.push(this.convertToString(input));
    }

    calculateOutput() {
        this.output = this.inputs
            .filter(input => input !== "")
            .join(this.separator);
        
        if (this.output.length > this.maxOutputLength) {
            this.output = this.output.substring(0, this.maxOutputLength);
        }
    }
}
```

## String Processing References

### Common Separators
```javascript
const Separators = {
    PLUS: "+",
    DASH: "-",
    SPACE: " ",
    COMMA: ",",
    COMMA_SPACE: ", ",
    PIPE: "|",
    COLON: ":",
    SEMICOLON: ";",
    SLASH: "/",
    BACKSLASH: "\\"
};
```

### String Length Guidelines
- **Short Messages**: 64-128 characters
- **Standard Messages**: 256-512 characters
- **Long Messages**: 1024+ characters (use sparingly)

### Performance Considerations
- **String Concatenation**: O(n) time complexity
- **Memory Allocation**: Each concatenation may allocate new memory
- **Garbage Collection**: Frequent string operations increase GC pressure

## Component Comparison

| Component | Function | Use Case |
|-----------|----------|----------|
| **Concatenation** | String combination | Text processing |
| **Adder** | Numerical addition | Mathematical operations |
| **Signal Check** | Threshold comparison | Conditional logic |
| **Color** | RGB/HSV combination | Lighting control |

## Integration with Other Systems

### Display System Integration
```javascript
// Integrate with status display
class StatusDisplay {
    constructor() {
        this.concatComponent = new ConcatenationComponent(" | ");
    }

    updateStatus(systemName, status, details) {
        const message = this.concatComponent.processInputs({
            signal_in1: systemName,
            signal_in2: status + ": " + details
        });
        return this.displayMessage(message);
    }
}
```

### Logging System Integration
```javascript
// Integrate with logging system
class LoggingSystem {
    constructor() {
        this.concatComponent = new ConcatenationComponent(" - ");
    }

    createLogEntry(timestamp, level, message) {
        const logEntry = this.concatComponent.processInputs({
            signal_in1: timestamp + " [" + level + "]",
            signal_in2: message
        });
        return this.writeLog(logEntry);
    }
}
```

This comprehensive documentation provides everything needed to understand and implement the Concatenation component in Barotrauma's electrical system, from basic string operations to advanced text processing applications. 
