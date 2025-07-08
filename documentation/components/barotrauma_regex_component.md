# Barotrauma RegEx Component

## Overview

The **RegEx Component** (also known as **RegEx Find Component**) is a pattern matching component in Barotrauma's electrical system that uses regular expressions to analyze input signals and outputs signals based on pattern matches. It converts numeric inputs to strings and applies regex patterns for text processing, signal validation, and complex conditional logic.

**Official Description:** "Uses regular expressions to check if incoming signals match a pattern. Outputs a signal when the pattern matches."

## Component Properties

### Basic Information
- **Identifier:** `regexcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#d1b788` (Golden Brown)
- **Base Price:** 250 marks
- **Difficulty Level:** 30

### Input/Output Pins

#### Input Pins
- **`signal_in`** - The input signal to be analyzed (converted to string)
- **`set_output`** - Sets the output value when pattern matches

#### Output Pins
- **`signal_out`** - Output signal based on pattern matching results

### Configurable Properties

The RegExFindComponent supports:

- **`Expression`** - The regular expression pattern (default: empty string)
- **`Output`** - Value sent when pattern matches (default: 1)
- **`FalseOutput`** - Value sent when pattern doesn't match (default: 0)
- **`UseCaptureGroup`** - Whether to output capture group value (default: false)
- **`OutputEmptyCaptureGroup`** - Whether to output empty capture groups (default: false)
- **`ContinuousOutput`** - Whether to continuously output while matching (default: false)
- **`MaxOutputLength`** - Maximum output string length (default: 100)

## Mathematical Function

The RegEx component implements a pattern matching function:

```
output = regex_match(input_string, pattern) ? match_value : false_value
```

Or in mathematical notation:
```
output = χ(pattern, input_string) × match_value + (1 - χ(pattern, input_string)) × false_value
```

Where χ is the characteristic function:
```
χ(pattern, input_string) = { 1 if pattern matches input_string, 0 otherwise }
```

### Pattern Matching Logic

1. **Input Conversion:** Numeric input converted to string representation
2. **Pattern Application:** Regular expression applied to input string
3. **Match Detection:** Boolean result based on pattern match
4. **Output Selection:** Choose between match and false output values

### Mathematical Properties

1. **Non-Commutative:** Order of pattern and input matters
2. **Non-Associative:** Pattern matching is not associative
3. **Idempotent:** Same input with same pattern gives same result
4. **Deterministic:** Same inputs always produce same output
5. **String-Based:** All operations performed on string representations

### Behavior Examples

| Input Signal | Pattern | Match Output | False Output | Result | Notes |
|--------------|---------|--------------|--------------|--------|-------|
| "123" | `^\d+$` | 1 | 0 | 1 | Matches digits only |
| "abc" | `^\d+$` | 1 | 0 | 0 | No digits |
| "hello" | `hello\|world` | 1 | 0 | 1 | Matches hello |
| "world" | `hello\|world` | 1 | 0 | 1 | Matches world |
| "other" | `hello\|world` | 1 | 0 | 0 | No match |
| "temp:25" | `temp:(?<temp>\d+)` | "25" | 0 | "25" | Capture group |

### Special Cases

1. **Empty Pattern:** Always matches (returns match output)
2. **Invalid Pattern:** Treated as literal string
3. **Empty Input:** Pattern matching depends on regex
4. **Capture Groups:** Can extract specific parts of match
5. **Unicode Support:** Handles extended character sets

## Signal Aggregation

The RegEx component follows standard signal aggregation rules:

### Input Signal Processing
- **Signal Input:** Uses the most recent input signal value
- **Output Input:** Uses the most recent output value setting
- **String Conversion:** Numeric inputs converted to strings for matching
- **Signal Priority:** Latest input signal takes precedence

### Output Signal Distribution
- **Single Output:** Provides one match result signal
- **String Output:** Can output string values from capture groups
- **Numeric Output:** Can output numeric match/false values
- **Continuous Output:** Can maintain output while pattern matches

### Example Signal Processing
```javascript
// Multiple input signals
Input 1: "hello" (arrives first)
Input 2: "world" (arrives second)
Pattern: "hello|world"
Result: Matches "world" (latest input)

// Multiple output settings
Setting 1: 1 (arrives first)
Setting 2: 5 (arrives second)
Result: Uses 5 as match output (latest setting)
```

## Component Definition

```xml
<Item identifier="regexcomponent" category="Electrical" Tags="smallitem,logic,circuitboxcomponent">
  <RegExFindComponent canbeselected="true" />
  <ConnectionPanel>
    <input name="signal_in" displayname="connection.signalin" />
    <output name="signal_out" displayname="connection.signalout" />
    <input name="set_output" displayname="connection.setoutput" />
  </ConnectionPanel>
</Item>
```

## Component Behavior

### Pattern Matching Logic
- **Input Conversion**: Converts numeric input to string for pattern matching
- **Regex Evaluation**: Applies configured regular expression to input string
- **Match Detection**: Determines if pattern matches or doesn't match
- **Output Selection**: Chooses between output and false_output based on match result

### Capture Group Support
- **Named Groups**: Supports named capture groups `(?<name>pattern)`
- **Group Extraction**: Can output specific capture group values
- **Empty Handling**: Configurable behavior for empty capture groups

### Signal Processing
- **String Conversion**: Numeric inputs are converted to strings for matching
- **Pattern Matching**: Uses standard regular expression syntax
- **Output Timing**: Can be continuous or single-shot based on configuration

## Real-World Applications

### 1. Text Pattern Detection
```javascript
// Detect specific text patterns in signals
const textDetector = new RegExComponent({
  expression: 'hello|world',
  output: 1,
  falseOutput: 0
})

// Input: "hello" -> Output: 1
// Input: "world" -> Output: 1
// Input: "other" -> Output: 0
```

### 2. Number Format Validation
```javascript
// Validate number formats
const numberValidator = new RegExComponent({
  expression: '^\\d+(\\.\\d+)?$',
  output: 1,
  falseOutput: 0
})

// Input: "123" -> Output: 1
// Input: "123.45" -> Output: 1
// Input: "abc" -> Output: 0
```

### 3. Command Recognition
```javascript
// Recognize command patterns
const commandParser = new RegExComponent({
  expression: '^(start|stop|reset)$',
  output: 1,
  falseOutput: 0
})

// Input: "start" -> Output: 1
// Input: "stop" -> Output: 1
// Input: "invalid" -> Output: 0
```

### 4. Data Extraction
```javascript
// Extract data using capture groups
const dataExtractor = new RegExComponent({
  expression: 'temp:(?<temperature>\\d+)',
  useCaptureGroup: true,
  output: 1,
  falseOutput: 0
})

// Input: "temp:25" -> Output: "25" (capture group)
// Input: "temp:invalid" -> Output: 0
```

## Integration Examples

### Basic Pattern Matching
```javascript
// Simple pattern matcher
const matcher = new RegExComponent({
  expression: 'alert|warning|error',
  output: 1,
  falseOutput: 0
})

// Connect input signal
matcher.setInput('signal_in', 'alert')

// Get output
const output = matcher.getOutput('signal_out') // Returns 1
```

### Capture Group Extraction
```javascript
// Extract values using capture groups
const extractor = new RegExComponent({
  expression: 'level:(?<level>\\d+)',
  useCaptureGroup: true,
  output: 1,
  falseOutput: 0
})

// Input with capture group
extractor.setInput('signal_in', 'level:42')
const output = extractor.getOutput('signal_out') // Returns "42"
```

### Complex Pattern Validation
```javascript
// Validate complex patterns
const validator = new RegExComponent({
  expression: '^[A-Z]{2}\\d{3}$',
  output: 1,
  falseOutput: 0
})

// Valid format: 2 letters + 3 digits
validator.setInput('signal_in', 'AB123') // Returns 1
validator.setInput('signal_in', 'A123')  // Returns 0
```

## JavaScript Simulation Class

```javascript
class RegExComponent {
  constructor(config = {}) {
    this.expression = config.expression || ''
    this.output = config.output || 1
    this.falseOutput = config.falseOutput || 0
    this.useCaptureGroup = config.useCaptureGroup || false
    this.outputEmptyCaptureGroup = config.outputEmptyCaptureGroup || false
    this.continuousOutput = config.continuousOutput || false
    this.maxOutputLength = config.maxOutputLength || 100
    
    this.inputSignal = ''
    this.lastOutput = 0
    this.lastMatch = null
    this.connectedOutputs = []
    
    // Compile regex pattern
    this.compilePattern()
  }

  // Compile the regex pattern
  compilePattern() {
    try {
      if (this.expression) {
        this.regex = new RegExp(this.expression, 'g')
      } else {
        this.regex = null
      }
    } catch (error) {
      console.warn(`Invalid regex pattern: ${this.expression}`)
      this.regex = null
    }
  }

  // Update the component
  update() {
    if (!this.regex) {
      this.lastOutput = this.falseOutput
      return
    }

    // Convert input to string
    const inputString = String(this.inputSignal)
    
    // Reset regex state
    this.regex.lastIndex = 0
    
    // Test for match
    const match = this.regex.exec(inputString)
    
    if (match) {
      this.lastMatch = match
      
      if (this.useCaptureGroup && match.groups) {
        // Extract capture group value
        const groupNames = Object.keys(match.groups)
        if (groupNames.length > 0) {
          const groupValue = match.groups[groupNames[0]]
          if (groupValue || this.outputEmptyCaptureGroup) {
            this.lastOutput = groupValue || ''
          } else {
            this.lastOutput = this.falseOutput
          }
        } else {
          this.lastOutput = this.output
        }
      } else {
        this.lastOutput = this.output
      }
    } else {
      this.lastMatch = null
      this.lastOutput = this.falseOutput
    }
    
    // Limit output length if it's a string
    if (typeof this.lastOutput === 'string') {
      this.lastOutput = this.lastOutput.substring(0, this.maxOutputLength)
    }
    
    // Broadcast output
    this.broadcastOutput()
  }

  // Set input values
  setInput(inputName, value) {
    switch (inputName) {
      case 'signal_in':
        this.inputSignal = value
        break
      case 'set_output':
        this.output = value
        break
    }
    
    // Update immediately
    this.update()
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

  // Get output value
  getOutput(outputName) {
    if (outputName === 'signal_out') {
      return this.lastOutput
    }
    return 0
  }

  // Get component status
  getStatus() {
    return {
      expression: this.expression,
      inputSignal: this.inputSignal,
      lastOutput: this.lastOutput,
      lastMatch: this.lastMatch,
      useCaptureGroup: this.useCaptureGroup,
      connectedOutputs: this.connectedOutputs.length
    }
  }

  // Reset the component
  reset() {
    this.inputSignal = ''
    this.lastOutput = 0
    this.lastMatch = null
  }

  // Test pattern without updating
  testPattern(input) {
    if (!this.regex) return false
    
    const inputString = String(input)
    this.regex.lastIndex = 0
    return this.regex.test(inputString)
  }

  // Get all capture groups from last match
  getCaptureGroups() {
    if (!this.lastMatch || !this.lastMatch.groups) {
      return {}
    }
    return { ...this.lastMatch.groups }
  }

  // Update regex pattern
  setExpression(expression) {
    this.expression = expression
    this.compilePattern()
    this.update()
  }
}

// Usage example
const regexComponent = new RegExComponent({
  expression: 'hello|world',
  output: 1,
  falseOutput: 0
})

// Test pattern matching
regexComponent.setInput('signal_in', 'hello')
const output = regexComponent.getOutput('signal_out') // Returns 1

// Test with capture groups
const captureComponent = new RegExComponent({
  expression: 'temp:(?<temperature>\\d+)',
  useCaptureGroup: true,
  output: 1,
  falseOutput: 0
})

captureComponent.setInput('signal_in', 'temp:25')
const captured = captureComponent.getOutput('signal_out') // Returns "25"
```

## Error Handling

```javascript
class RegExComponent {
  constructor(config = {}) {
    // Validate regex pattern
    if (config.expression) {
      try {
        new RegExp(config.expression)
      } catch (error) {
        console.warn(`Invalid regex pattern: ${config.expression}`)
        this.expression = ''
      }
    }
    
    // Validate output length
    if (config.maxOutputLength && config.maxOutputLength > 1000) {
      console.warn('Max output length should be <= 1000 for performance')
      this.maxOutputLength = Math.min(config.maxOutputLength, 1000)
    }
  }

  setInput(inputName, value) {
    try {
      switch (inputName) {
        case 'signal_in':
          this.inputSignal = value
          break
        case 'set_output':
          if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Output must be a valid number')
          }
          this.output = value
          break
        default:
          console.warn(`Unknown input: ${inputName}`)
      }
      
      this.update()
    } catch (error) {
      console.error(`RegEx input error: ${error.message}`)
    }
  }

  setExpression(expression) {
    try {
      if (typeof expression !== 'string') {
        throw new Error('Expression must be a string')
      }
      
      // Test compile the pattern
      new RegExp(expression)
      
      this.expression = expression
      this.compilePattern()
      this.update()
    } catch (error) {
      console.error(`Invalid regex expression: ${error.message}`)
    }
  }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity**: O(n) where n is input string length
- **Space Complexity**: O(m) where m is regex pattern complexity
- **Memory Usage**: Moderate (regex compilation + match storage)

### Pattern Limits
- **Max Output Length**: 1000 characters (recommended)
- **Pattern Complexity**: Standard regex engine limits
- **Capture Groups**: Unlimited (within engine limits)

### Signal Processing
- **Input Types**: Any (converted to string)
- **Output Types**: Number or string (capture groups)
- **Latency**: Immediate pattern matching

## Troubleshooting

### Common Issues

1. **No Pattern Match**
   - Check regex syntax validity
   - Verify input string format
   - Test pattern separately

2. **Invalid Regex**
   - Validate regex syntax
   - Check for special character escaping
   - Test in regex tester first

3. **Capture Group Issues**
   - Ensure named groups syntax `(?<name>pattern)`
   - Check useCaptureGroup setting
   - Verify group exists in pattern

### Debug Methods

```javascript
// Enable debug logging
regexComponent.debug = true

// Test pattern without updating
const isValid = regexComponent.testPattern('test input')

// Monitor component state
setInterval(() => {
  const status = regexComponent.getStatus()
  console.log('RegEx Status:', status)
  
  const groups = regexComponent.getCaptureGroups()
  console.log('Capture Groups:', groups)
}, 1000)
```

## Advanced Usage Patterns

### Complex Pattern Matching
```javascript
// Multi-condition pattern matching
const complexMatcher = new RegExComponent({
  expression: '^(emergency|warning|info):(?<level>\\w+):(?<message>.+)$',
  useCaptureGroup: true,
  output: 1,
  falseOutput: 0
})

// Input: "emergency:high:system failure"
// Output: "high" (level capture group)
```

### Data Validation Pipeline
```javascript
// Create validation pipeline
const validators = [
  new RegExComponent({ expression: '^\\d+$', output: 1, falseOutput: 0 }),
  new RegExComponent({ expression: '^[A-Z]{2}\\d{3}$', output: 1, falseOutput: 0 }),
  new RegExComponent({ expression: '^temp:\\d+$', output: 1, falseOutput: 0 })
]

// Chain validators
validators[0].connect('signal_out', validators[1], 'signal_in')
validators[1].connect('signal_out', validators[2], 'signal_in')
```

### Pattern-Based Routing
```javascript
// Route based on pattern matches
const router = new RegExComponent({
  expression: '^(start|stop|reset)$',
  output: 1,
  falseOutput: 0
})

// Connect to different systems based on pattern
router.connect('signal_out', (value) => {
  if (value === 1) {
    // Pattern matched, route to appropriate system
    const input = router.inputSignal
    if (input === 'start') {
      startSystem()
    } else if (input === 'stop') {
      stopSystem()
    } else if (input === 'reset') {
      resetSystem()
    }
  }
})
```

## Component Comparison

| Component | Purpose | Input | Output | Pattern Support |
|-----------|---------|-------|--------|-----------------|
| RegEx | Pattern matching | String | Match result | Full regex |
| Equals | Exact comparison | Any | Boolean | None |
| Greater | Numeric comparison | Numbers | Boolean | None |
| Signal Check | Threshold check | Numbers | Boolean | None |

## Regular Expression Reference

### Common Patterns

**Numbers**: `^\d+$` - Only digits
**Decimals**: `^\d+\.\d+$` - Decimal numbers
**Letters**: `^[A-Za-z]+$` - Only letters
**Alphanumeric**: `^[A-Za-z0-9]+$` - Letters and numbers
**Email**: `^[^\s@]+@[^\s@]+\.[^\s@]+$` - Basic email format
**Commands**: `^(start|stop|reset)$` - Specific commands

### Capture Groups

**Named Groups**: `(?<name>pattern)` - Extract named values
**Numbered Groups**: `(pattern)` - Extract by position
**Multiple Groups**: `(?<type>\w+):(?<value>\d+)` - Multiple captures

### Special Characters

**Escaping**: `\.` - Literal dot
**Quantifiers**: `+`, `*`, `?` - Repetition
**Anchors**: `^`, `$` - Start/end of string
**Character Classes**: `[A-Z]`, `\d`, `\w` - Character sets

## Conclusion

The RegEx component is a powerful pattern matching tool that enables sophisticated text processing and signal validation in Barotrauma. Its support for regular expressions, capture groups, and configurable outputs makes it essential for complex conditional logic, data validation, and command parsing.

Understanding regex syntax and the component's configuration options is crucial for designing effective pattern matching systems. The component's flexibility and power make it an invaluable tool for advanced electrical system design. 
