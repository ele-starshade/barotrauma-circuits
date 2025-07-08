# Barotrauma Color Component Documentation

## Overview

The **Color Component** is a specialized signal processing component in Barotrauma's electrical system that combines individual color channel signals (Red, Green, Blue, Alpha) into a unified color signal for lighting control. It supports both RGB and HSV color modes, making it essential for creating dynamic lighting systems and visual effects.

## Component Details

- **Identifier**: `colorcomponent`
- **Category**: Electrical
- **Function**: ColorComponent with RGB/HSV support
- **Color**: `#b3b3b4` (light gray)
- **Base Price**: 100 marks
- **Difficulty Level**: 15
- **Linkable**: false (cannot be linked to other components)

## Input/Output Pins

### Input Pins
- **`signal_r`** - Red channel input (0-1 range)
- **`signal_g`** - Green channel input (0-1 range)
- **`signal_b`** - Blue channel input (0-1 range)
- **`signal_a`** - Alpha/transparency channel input (0-1 range)

### Output Pins
- **`signal_out`** - Combined color signal for lighting control

## Color Modes

### RGB Mode (Default)
When HSV mode is disabled, the component operates in standard RGB color space:
- **Red**: 0-1 range (0 = no red, 1 = full red)
- **Green**: 0-1 range (0 = no green, 1 = full green)
- **Blue**: 0-1 range (0 = no blue, 1 = full blue)
- **Alpha**: 0-1 range (0 = transparent, 1 = opaque)

### HSV Mode
When the "Use HSV" property is enabled, the component interprets inputs as HSV values:
- **Red (Hue)**: 0-360 range (0° = red, 120° = green, 240° = blue)
- **Green (Saturation)**: 0-1 range (0 = grayscale, 1 = full color)
- **Blue (Value)**: 0-1 range (0 = black, 1 = full brightness)
- **Alpha**: 0-1 range (transparency)

## Signal Processing Behavior

### Signal Aggregation
- **Multiple Inputs**: If multiple wires connect to any color channel, signals are aggregated using OR logic
- **Priority**: First signal received takes precedence
- **Time-based**: Component processes signals in real-time

### Color Combination Logic
```javascript
// RGB Mode
output = {
    r: clamp(redInput, 0, 1),
    g: clamp(greenInput, 0, 1),
    b: clamp(blueInput, 0, 1),
    a: clamp(alphaInput, 0, 1)
}

// HSV Mode
output = hsvToRgb(hueInput, saturationInput, valueInput, alphaInput)
```

### Error Handling
- **Invalid Inputs**: Handles NaN and infinite values by clamping to valid range
- **Missing Channels**: Unconnected channels default to 0
- **HSV Conversion**: Handles edge cases in HSV to RGB conversion

## Real-World Applications

### Dynamic Lighting Systems
```javascript
// Create pulsing red emergency light
const time = Date.now() / 1000;
const pulseIntensity = (Math.sin(time * 2) + 1) / 2;  // 0-1 range
const emergencyLight = {
    r: pulseIntensity,  // Red channel
    g: 0,               // No green
    b: 0,               // No blue
    a: 1                // Fully opaque
};
```

### Status Indicators
```javascript
// Create status light based on system health
function createStatusLight(healthPercentage) {
    if (healthPercentage > 0.7) {
        return { r: 0, g: 1, b: 0, a: 1 };  // Green = good
    } else if (healthPercentage > 0.3) {
        return { r: 1, g: 1, b: 0, a: 1 };  // Yellow = warning
    } else {
        return { r: 1, g: 0, b: 0, a: 1 };  // Red = critical
    }
}
```

### Ambient Lighting
```javascript
// Create underwater ambient lighting
const depth = 500;  // meters
const ambientLight = {
    r: Math.max(0.1, 1 - depth / 1000),  // Red fades with depth
    g: Math.max(0.05, 0.8 - depth / 800), // Green fades faster
    b: Math.max(0.2, 1 - depth / 600),   // Blue persists longer
    a: 0.8  // Slightly transparent
};
```

### Warning Systems
```javascript
// Create flashing warning light
const warningLight = {
    r: 1,  // Full red
    g: 0.5, // Half green
    b: 0,   // No blue
    a: Math.sin(Date.now() / 200) > 0 ? 1 : 0.3  // Flashing alpha
};
```

## Integration Examples

### With Signal Check Component
```javascript
// Conditional color based on sensor reading
const sensorValue = 0.8;
const threshold = 0.5;
const isActive = sensorValue > threshold;  // Signal Check component

const color = isActive ? 
    { r: 0, g: 1, b: 0, a: 1 } :  // Green when active
    { r: 1, g: 0, b: 0, a: 0.5 }; // Red when inactive
```

### With Adder Component
```javascript
// Blend two color sources
const color1 = { r: 1, g: 0, b: 0, a: 0.5 };  // Red
const color2 = { r: 0, g: 0, b: 1, a: 0.5 };  // Blue

// Adder components for each channel
const blendedColor = {
    r: Math.min(1, color1.r + color2.r),  // Clamp to 1
    g: Math.min(1, color1.g + color2.g),
    b: Math.min(1, color1.b + color2.b),
    a: Math.min(1, color1.a + color2.a)
};
```

### With Multiplier Component
```javascript
// Dim lighting based on power level
const baseColor = { r: 1, g: 1, b: 1, a: 1 };  // White light
const powerLevel = 0.7;  // 70% power

const dimmedColor = {
    r: baseColor.r * powerLevel,  // Multiplier component
    g: baseColor.g * powerLevel,
    b: baseColor.b * powerLevel,
    a: baseColor.a  // Keep alpha unchanged
};
```

## JavaScript Implementation

```javascript
class ColorComponent {
    constructor(useHsv = false) {
        this.inputR = 0;
        this.inputG = 0;
        this.inputB = 0;
        this.inputA = 1;
        this.outputColor = { r: 0, g: 0, b: 0, a: 1 };
        this.useHsv = useHsv;
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // ~60 FPS
    }

    // Process input signals
    processInputs(inputs) {
        const currentTime = Date.now();
        
        // Check if enough time has passed for update
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return this.outputColor;
        }

        // Update input values with signal aggregation
        this.inputR = this.aggregateSignals(inputs.signal_r);
        this.inputG = this.aggregateSignals(inputs.signal_g);
        this.inputB = this.aggregateSignals(inputs.signal_b);
        this.inputA = this.aggregateSignals(inputs.signal_a);

        // Calculate output color
        this.calculateOutput();
        this.lastUpdateTime = currentTime;
        
        return this.outputColor;
    }

    // Aggregate multiple input signals using OR logic
    aggregateSignals(signals) {
        if (!Array.isArray(signals)) {
            return this.clamp(signals || 0, 0, 1);
        }
        
        // OR logic: return first non-zero signal, or 0 if all are zero
        for (const signal of signals) {
            if (signal !== 0 && !isNaN(signal)) {
                return this.clamp(signal, 0, 1);
            }
        }
        return 0;
    }

    // Calculate color output
    calculateOutput() {
        try {
            if (this.useHsv) {
                // Convert HSV to RGB
                this.outputColor = this.hsvToRgb(
                    this.inputR * 360,  // Hue: 0-360
                    this.inputG,        // Saturation: 0-1
                    this.inputB,        // Value: 0-1
                    this.inputA         // Alpha: 0-1
                );
            } else {
                // Direct RGB mode
                this.outputColor = {
                    r: this.clamp(this.inputR, 0, 1),
                    g: this.clamp(this.inputG, 0, 1),
                    b: this.clamp(this.inputB, 0, 1),
                    a: this.clamp(this.inputA, 0, 1)
                };
            }

            // Validate output
            this.validateColor(this.outputColor);

        } catch (error) {
            console.error('Color calculation error:', error);
            this.outputColor = { r: 0, g: 0, b: 0, a: 1 };
        }
    }

    // Convert HSV to RGB
    hsvToRgb(h, s, v, a = 1) {
        h = h % 360;
        if (h < 0) h += 360;
        
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;

        let r, g, b;
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        return {
            r: this.clamp(r + m, 0, 1),
            g: this.clamp(g + m, 0, 1),
            b: this.clamp(b + m, 0, 1),
            a: this.clamp(a, 0, 1)
        };
    }

    // Convert RGB to HSV
    rgbToHsv(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        let h = 0;
        if (diff === 0) {
            h = 0;
        } else if (max === r) {
            h = ((g - b) / diff) % 6;
        } else if (max === g) {
            h = (b - r) / diff + 2;
        } else {
            h = (r - g) / diff + 4;
        }

        h = h * 60;
        if (h < 0) h += 360;

        const s = max === 0 ? 0 : diff / max;
        const v = max;

        return { h, s, v };
    }

    // Clamp value to range
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Validate color values
    validateColor(color) {
        color.r = this.clamp(color.r, 0, 1);
        color.g = this.clamp(color.g, 0, 1);
        color.b = this.clamp(color.b, 0, 1);
        color.a = this.clamp(color.a, 0, 1);
    }

    // Get current output
    getOutput() {
        return this.outputColor;
    }

    // Get component state
    getState() {
        return {
            useHsv: this.useHsv,
            inputR: this.inputR,
            inputG: this.inputG,
            inputB: this.inputB,
            inputA: this.inputA,
            outputColor: this.outputColor,
            lastUpdateTime: this.lastUpdateTime
        };
    }

    // Set HSV mode
    setHsvMode(enabled) {
        this.useHsv = enabled;
    }

    // Reset component state
    reset() {
        this.inputR = 0;
        this.inputG = 0;
        this.inputB = 0;
        this.inputA = 1;
        this.outputColor = { r: 0, g: 0, b: 0, a: 1 };
        this.lastUpdateTime = 0;
    }
}

// Usage examples
const colorComponent = new ColorComponent();

// RGB mode example
const rgbResult = colorComponent.processInputs({
    signal_r: 1.0,  // Full red
    signal_g: 0.5,  // Half green
    signal_b: 0.0,  // No blue
    signal_a: 1.0   // Fully opaque
});
console.log('RGB result:', rgbResult);

// HSV mode example
const hsvComponent = new ColorComponent(true);
const hsvResult = hsvComponent.processInputs({
    signal_r: 120,  // 120° = green hue
    signal_g: 1.0,  // Full saturation
    signal_b: 0.8,  // 80% brightness
    signal_a: 1.0   // Fully opaque
});
console.log('HSV result:', hsvResult);
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(1) for RGB mode, O(1) for HSV conversion
- **Space Complexity**: O(1) for internal state
- **Update Rate**: ~60 FPS (16ms intervals)

### Memory Usage
- **State Variables**: 8 floating-point values + color object
- **Total Memory**: ~64 bytes per component
- **Garbage Collection**: Minimal, no dynamic allocations

### Optimization Tips
- **Batch Processing**: Process multiple color components together
- **Caching**: Cache frequently used color calculations
- **HSV Conversion**: Only convert when HSV mode is enabled

## Troubleshooting

### Common Issues

#### Incorrect Color Output
```javascript
// Problem: Colors appearing wrong
// Solution: Check HSV mode setting
colorComponent.setHsvMode(false);  // Ensure RGB mode

// Problem: Alpha not working
// Solution: Verify alpha channel connection
const alphaSignal = 0.5;  // 50% transparency
```

#### Signal Aggregation Problems
```javascript
// Problem: Multiple color inputs not blending
// Solution: Use separate components for blending
const blendedColor = blendColors(color1, color2);
```

#### Performance Issues
```javascript
// Problem: Too frequent updates
// Solution: Implement update throttling
if (currentTime - this.lastUpdateTime < this.updateInterval) {
    return this.outputColor;
}
```

### Debug Techniques
```javascript
// Enable debug logging
class ColorComponent {
    constructor(debug = false) {
        this.debug = debug;
        // ... other initialization
    }

    processInputs(inputs) {
        if (this.debug) {
            console.log('Color inputs:', inputs);
        }
        
        // ... processing logic
        
        if (this.debug) {
            console.log('Color output:', this.outputColor);
        }
    }
}
```

## Advanced Usage Patterns

### Color Blending
```javascript
// Blend two colors with alpha
function blendColors(color1, color2, alpha) {
    return {
        r: color1.r * (1 - alpha) + color2.r * alpha,
        g: color1.g * (1 - alpha) + color2.g * alpha,
        b: color1.b * (1 - alpha) + color2.b * alpha,
        a: Math.max(color1.a, color2.a)
    };
}
```

### Color Interpolation
```javascript
// Smoothly interpolate between colors
function interpolateColors(color1, color2, t) {
    return {
        r: color1.r + (color2.r - color1.r) * t,
        g: color1.g + (color2.g - color1.g) * t,
        b: color1.b + (color2.b - color1.b) * t,
        a: color1.a + (color2.a - color1.a) * t
    };
}
```

### Color Temperature
```javascript
// Convert color temperature to RGB
function temperatureToRgb(kelvin) {
    const temp = kelvin / 100;
    let r, g, b;
    
    if (temp <= 66) {
        r = 255;
        g = temp <= 19 ? 0 : 99.4708025861 * Math.log(temp - 10) - 161.1195681661;
        b = temp >= 66 ? 255 : temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    } else {
        r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
        g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
        b = 255;
    }
    
    return {
        r: this.clamp(r / 255, 0, 1),
        g: this.clamp(g / 255, 0, 1),
        b: this.clamp(b / 255, 0, 1),
        a: 1
    };
}
```

## Color Theory References

### RGB Color Space
- **Red + Green = Yellow**
- **Red + Blue = Magenta**
- **Green + Blue = Cyan**
- **Red + Green + Blue = White**

### HSV Color Space
- **Hue**: Color wheel position (0-360°)
- **Saturation**: Color intensity (0-1)
- **Value**: Brightness (0-1)

### Common Color Values
```javascript
const Colors = {
    RED: { r: 1, g: 0, b: 0, a: 1 },
    GREEN: { r: 0, g: 1, b: 0, a: 1 },
    BLUE: { r: 0, g: 0, b: 1, a: 1 },
    YELLOW: { r: 1, g: 1, b: 0, a: 1 },
    CYAN: { r: 0, g: 1, b: 1, a: 1 },
    MAGENTA: { r: 1, g: 0, b: 1, a: 1 },
    WHITE: { r: 1, g: 1, b: 1, a: 1 },
    BLACK: { r: 0, g: 0, b: 0, a: 1 }
};
```

## Component Comparison

| Component | Function | Use Case |
|-----------|----------|----------|
| **Color** | RGB/HSV combination | Lighting control |
| **Signal Check** | Threshold comparison | Conditional logic |
| **Adder** | Signal addition | Signal combination |
| **Multiplier** | Signal multiplication | Signal scaling |

## Integration with Other Systems

### Lighting System Integration
```javascript
// Integrate with submarine lighting
class LightingSystem {
    constructor() {
        this.colorComponent = new ColorComponent();
    }

    updateLighting(red, green, blue, alpha) {
        const color = this.colorComponent.processInputs({
            signal_r: red,
            signal_g: green,
            signal_b: blue,
            signal_a: alpha
        });
        return this.applyLighting(color);
    }
}
```

### Status Display Integration
```javascript
// Integrate with status display
class StatusDisplay {
    constructor() {
        this.colorComponent = new ColorComponent();
    }

    updateStatusColor(status) {
        const colorMap = {
            'normal': { r: 0, g: 1, b: 0, a: 1 },
            'warning': { r: 1, g: 1, b: 0, a: 1 },
            'critical': { r: 1, g: 0, b: 0, a: 1 }
        };
        
        return this.colorComponent.processInputs(colorMap[status]);
    }
}
```

This comprehensive documentation provides everything needed to understand and implement the Color component in Barotrauma's electrical system, from basic RGB/HSV color handling to advanced lighting applications. 
