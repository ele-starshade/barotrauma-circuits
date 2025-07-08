# Barotrauma Factorial Component

## Overview

The **Factorial Component** is a mathematical signal processing component in Barotrauma's electrical system that calculates the factorial of an input signal. It takes a single input value and outputs its factorial (n!).

**Official Description:** "Outputs the factorial of the input."

## Component Properties

### Basic Information
- **Identifier:** `factorialcomponent`
- **Category:** Electrical
- **Tags:** smallitem, logic, circuitboxcomponent
- **Signal Color:** `#563697` (Purple)
- **Base Price:** 100 marks
- **Difficulty Level:** 15

### Input/Output Pins

#### Input Pins
- **`signal_in`** - Input signal (the number to calculate factorial for)

#### Output Pins
- **`signal_out`** - Output signal (factorial of the input)

### Configurable Properties

The FactorialComponent uses a FunctionComponent with the "Factorial" function, which may support:

- **`ClampMin`** - Minimum output value (default: -999999)
- **`ClampMax`** - Maximum output value (default: 999999)
- **`TimeFrame`** - Time-based processing window (default: 0)

## Mathematical Function

The Factorial component performs the mathematical operation:

```
output = signal_in!
```

Or in mathematical notation:
```
output = n! = n × (n-1) × (n-2) × ... × 2 × 1
```

### Mathematical Properties

1. **Definition:** n! = n × (n-1) × (n-2) × ... × 2 × 1
2. **Special Cases:** 0! = 1, 1! = 1
3. **Domain:** Only defined for non-negative integers
4. **Growth:** Factorial grows extremely rapidly with input size
5. **Precision:** May use approximation methods for large values

### Behavior Examples

| Input | Output | Notes |
|-------|--------|-------|
| 0 | 1 | 0! = 1 (by definition) |
| 1 | 1 | 1! = 1 |
| 2 | 2 | 2! = 2 × 1 = 2 |
| 3 | 6 | 3! = 3 × 2 × 1 = 6 |
| 4 | 24 | 4! = 4 × 3 × 2 × 1 = 24 |
| 5 | 120 | 5! = 5 × 4 × 3 × 2 × 1 = 120 |
| 6 | 720 | 6! = 6 × 5 × 4 × 3 × 2 × 1 = 720 |
| 10 | 3,628,800 | 10! = 10 × 9 × ... × 1 |

### Special Cases

1. **Zero Factorial:** 0! = 1 (mathematical convention)
2. **Negative Numbers:** Undefined, typically returns error or 0
3. **Non-Integers:** May use gamma function approximation
4. **Large Numbers:** May overflow or use approximation

## Signal Aggregation

Like other Barotrauma components, the Factorial component follows signal aggregation rules:

### Multiple Input Wires
- **OR Logic:** Multiple wires connected to the same input pin use OR logic
- **First Signal Wins:** When multiple signals arrive simultaneously, the first signal takes priority
- **Signal Persistence:** Signals persist until a new signal arrives or the component is reset

### Example Signal Aggregation
```javascript
// Multiple wires to signal_in
Wire 1: 3 (arrives first)
Wire 2: 5 (arrives second)
Wire 3: 2 (arrives third)

// Result: signal_in = 3 (first signal wins)
// Output = 3! = 6
```

## Real-World Applications

### 1. **Combinatorics and Probability**
```javascript
// Calculate number of permutations
const items = 5;
const permutations = factorial(items); // 120 different arrangements

// Calculate combinations (nCr = n! / (r!(n-r)!))
const n = 10;
const r = 3;
const combinations = factorial(n) / (factorial(r) * factorial(n - r)); // 120
```

### 2. **Statistical Analysis**
```javascript
// Calculate Poisson distribution
const lambda = 3; // average rate
const k = 2; // number of events
const probability = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k); // 0.224
```

### 3. **Taylor Series Expansions**
```javascript
// Calculate e^x using Taylor series
const x = 2;
let e_x = 0;
for (let n = 0; n <= 10; n++) {
    e_x += Math.pow(x, n) / factorial(n);
} // ≈ 7.389
```

### 4. **Permutation Calculations**
```javascript
// Calculate number of ways to arrange letters
const word = "HELLO";
const uniqueLetters = new Set(word).size;
const arrangements = factorial(word.length) / factorial(word.length - uniqueLetters); // 60
```

### 5. **Mathematical Modeling**
```javascript
// Stirling's approximation for large factorials
const n = 100;
const stirlingApprox = Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
// For very large n, this is more practical than exact calculation
```

## Integration Examples

### 1. **Advanced Probability Systems**
```javascript
// Calculate binomial probability
const n = 10; // trials
const k = 3; // successes
const p = 0.5; // probability of success
const binomialProb = (factorial(n) / (factorial(k) * factorial(n - k))) * 
                    Math.pow(p, k) * Math.pow(1 - p, n - k); // 0.117
```

### 2. **Combinatorial Optimization**
```javascript
// Calculate number of possible combinations
const totalItems = 8;
const selectedItems = 4;
const possibleCombinations = factorial(totalItems) / 
                            (factorial(selectedItems) * factorial(totalItems - selectedItems)); // 70
```

### 3. **Mathematical Series**
```javascript
// Calculate sum of reciprocals of factorials
let sum = 0;
for (let n = 0; n <= 10; n++) {
    sum += 1 / factorial(n);
} // ≈ 2.718 (approaches e)
```

## JavaScript Simulation Class

```javascript
class FactorialComponent {
    constructor(config = {}) {
        this.clampMin = config.clampMin || -999999;
        this.clampMax = config.clampMax || 999999;
        this.timeFrame = config.timeFrame || 0;
        this.maxInput = config.maxInput || 170; // JavaScript Number.MAX_SAFE_INTEGER limit
        this.useStirlingApproximation = config.useStirlingApproximation || false;
        
        // Input/output state
        this.signalIn = 0;
        this.output = 0;
        
        // Signal history for time-based processing
        this.signalHistory = [];
        this.lastUpdateTime = Date.now();
        
        // Error handling
        this.lastError = null;
        this.errorCount = 0;
        
        // Cache for performance
        this.factorialCache = new Map();
        this.initializeCache();
    }
    
    /**
     * Initialize factorial cache for small values
     */
    initializeCache() {
        for (let i = 0; i <= 20; i++) {
            this.factorialCache.set(i, this.calculateFactorial(i));
        }
    }
    
    /**
     * Process input signal and calculate factorial
     * @param {number} input - Input signal
     * @returns {number} - Calculated factorial
     */
    process(input) {
        try {
            // Update input signal
            this.signalIn = input;
            
            // Perform factorial calculation with error handling
            let result = this.performFactorial(input);
            
            // Apply time-based processing if configured
            if (this.timeFrame > 0) {
                result = this.applyTimeFrame(result);
            }
            
            // Apply clamping
            result = this.clampValue(result);
            
            this.output = result;
            this.lastError = null;
            
            return result;
            
        } catch (error) {
            this.lastError = error.message;
            this.errorCount++;
            console.warn(`FactorialComponent error: ${error.message}`);
            return 0;
        }
    }
    
    /**
     * Perform the factorial operation with error handling
     * @param {number} n - The input number
     * @returns {number} - The factorial of n
     */
    performFactorial(n) {
        // Handle invalid inputs
        if (typeof n !== 'number') {
            throw new Error('Invalid input type');
        }
        
        // Handle negative numbers
        if (n < 0) {
            throw new Error('Factorial is not defined for negative numbers');
        }
        
        // Handle non-integers
        if (!Number.isInteger(n)) {
            throw new Error('Factorial is only defined for integers');
        }
        
        // Handle overflow cases
        if (n > this.maxInput) {
            throw new Error(`Input too large for factorial calculation (max: ${this.maxInput})`);
        }
        
        // Use Stirling's approximation for large numbers
        if (this.useStirlingApproximation && n > 20) {
            return this.stirlingApproximation(n);
        }
        
        // Calculate factorial
        return this.calculateFactorial(n);
    }
    
    /**
     * Calculate factorial using iterative method
     * @param {number} n - The input number
     * @returns {number} - The factorial of n
     */
    calculateFactorial(n) {
        // Check cache first
        if (this.factorialCache.has(n)) {
            return this.factorialCache.get(n);
        }
        
        // Calculate iteratively
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        
        // Cache result for small values
        if (n <= 20) {
            this.factorialCache.set(n, result);
        }
        
        return result;
    }
    
    /**
     * Stirling's approximation for large factorials
     * @param {number} n - The input number
     * @returns {number} - Approximate factorial
     */
    stirlingApproximation(n) {
        return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
    }
    
    /**
     * Apply time-based processing window
     * @param {number} currentValue - Current calculated value
     * @returns {number} - Time-averaged result
     */
    applyTimeFrame(currentValue) {
        const currentTime = Date.now();
        
        // Add current value to history with timestamp
        this.signalHistory.push({
            value: currentValue,
            timestamp: currentTime
        });
        
        // Remove old values outside the time frame
        const cutoffTime = currentTime - this.timeFrame;
        this.signalHistory = this.signalHistory.filter(
            entry => entry.timestamp >= cutoffTime
        );
        
        // Calculate average if we have values
        if (this.signalHistory.length > 0) {
            const sum = this.signalHistory.reduce((acc, entry) => acc + entry.value, 0);
            return sum / this.signalHistory.length;
        }
        
        return currentValue;
    }
    
    /**
     * Clamp output value to configured range
     * @param {number} value - Value to clamp
     * @returns {number} - Clamped value
     */
    clampValue(value) {
        if (value < this.clampMin) {
            return this.clampMin;
        }
        if (value > this.clampMax) {
            return this.clampMax;
        }
        return value;
    }
    
    /**
     * Reset component state
     */
    reset() {
        this.signalIn = 0;
        this.output = 0;
        this.signalHistory = [];
        this.lastError = null;
        this.errorCount = 0;
        this.lastUpdateTime = Date.now();
    }
    
    /**
     * Get component status information
     * @returns {object} - Status object
     */
    getStatus() {
        return {
            input: this.signalIn,
            output: this.output,
            clampMin: this.clampMin,
            clampMax: this.clampMax,
            timeFrame: this.timeFrame,
            maxInput: this.maxInput,
            useStirlingApproximation: this.useStirlingApproximation,
            lastError: this.lastError,
            errorCount: this.errorCount,
            signalHistoryLength: this.signalHistory.length,
            cacheSize: this.factorialCache.size
        };
    }
    
    /**
     * Update component configuration
     * @param {object} config - New configuration
     */
    updateConfig(config) {
        if (config.clampMin !== undefined) {
            this.clampMin = config.clampMin;
        }
        if (config.clampMax !== undefined) {
            this.clampMax = config.clampMax;
        }
        if (config.timeFrame !== undefined) {
            this.timeFrame = config.timeFrame;
        }
        if (config.maxInput !== undefined) {
            this.maxInput = config.maxInput;
        }
        if (config.useStirlingApproximation !== undefined) {
            this.useStirlingApproximation = config.useStirlingApproximation;
        }
    }
}

// Usage Examples
class FactorialComponentExamples {
    static basicFactorial() {
        const factorial = new FactorialComponent();
        
        console.log('Basic Factorial Examples:');
        console.log('0! =', factorial.process(0)); // 1
        console.log('1! =', factorial.process(1)); // 1
        console.log('5! =', factorial.process(5)); // 120
        console.log('10! =', factorial.process(10)); // 3,628,800
    }
    
    static errorHandling() {
        const factorial = new FactorialComponent();
        
        console.log('\nError Handling Examples:');
        console.log('(-1)! =', factorial.process(-1)); // Error
        console.log('(3.5)! =', factorial.process(3.5)); // Error
        console.log('Status:', factorial.getStatus());
    }
    
    static clampingExample() {
        const factorial = new FactorialComponent({
            clampMin: 0,
            clampMax: 1000
        });
        
        console.log('\nClamping Examples:');
        console.log('7! =', factorial.process(7)); // 5040 (clamped to 1000)
        console.log('(-2)! =', factorial.process(-2)); // 0 (clamped)
    }
    
    static stirlingApproximation() {
        const factorial = new FactorialComponent({
            useStirlingApproximation: true
        });
        
        console.log('\nStirling Approximation Examples:');
        console.log('25! (exact) =', factorial.process(25));
        console.log('50! (approximation) =', factorial.process(50));
    }
    
    static timeFrameExample() {
        const factorial = new FactorialComponent({
            timeFrame: 1000 // 1 second window
        });
        
        console.log('\nTime Frame Examples:');
        console.log('Initial:', factorial.process(3)); // 6
        console.log('After 500ms:', factorial.process(4)); // 24
        console.log('After 1s:', factorial.process(5)); // 120 (new average)
    }
    
    static performanceExample() {
        const factorial = new FactorialComponent();
        
        console.log('\nPerformance Examples:');
        console.log('Cache size before:', factorial.getStatus().cacheSize);
        
        // Calculate multiple factorials
        for (let i = 0; i <= 15; i++) {
            factorial.process(i);
        }
        
        console.log('Cache size after:', factorial.getStatus().cacheSize);
    }
}

// Run examples
FactorialComponentExamples.basicFactorial();
FactorialComponentExamples.errorHandling();
FactorialComponentExamples.clampingExample();
FactorialComponentExamples.stirlingApproximation();
FactorialComponentExamples.timeFrameExample();
FactorialComponentExamples.performanceExample();
```

## Error Handling

### Common Error Scenarios

1. **Negative Numbers**
   - **Cause:** Factorial is not defined for negative integers
   - **Handling:** Throw error and output 0
   - **Prevention:** Validate input range before processing

2. **Non-Integer Inputs**
   - **Cause:** Factorial is only defined for integers
   - **Handling:** Throw error and output 0
   - **Prevention:** Use integer validation

3. **Overflow**
   - **Cause:** Very large inputs cause numerical overflow
   - **Handling:** Use Stirling's approximation or throw error
   - **Prevention:** Limit input range or use approximation

4. **Non-Finite Inputs**
   - **Cause:** Infinity or NaN inputs
   - **Handling:** Throw error and output 0
   - **Prevention:** Validate input types

### Error Recovery Strategies

```javascript
// Example error recovery system
class FactorialComponentWithRecovery extends FactorialComponent {
    constructor(config) {
        super(config);
        this.recoveryMode = false;
        this.lastValidOutput = 1;
    }
    
    process(input) {
        try {
            const result = super.process(input);
            this.recoveryMode = false;
            this.lastValidOutput = result;
            return result;
        } catch (error) {
            this.recoveryMode = true;
            console.warn(`Using last valid output: ${this.lastValidOutput}`);
            return this.lastValidOutput;
        }
    }
}
```

## Performance Characteristics

### Computational Complexity
- **Time Complexity:** O(n) for iterative calculation
- **Space Complexity:** O(n) where n is the time frame window size
- **Memory Usage:** Minimal for basic operation, scales with time frame and cache

### Optimization Tips

1. **Use Caching for Small Values**
   ```javascript
   // Good: Cache small factorials for performance
   const factorial = new FactorialComponent({
       maxInput: 20 // Cache up to 20!
   });
   ```

2. **Use Stirling's Approximation for Large Values**
   ```javascript
   // Good: Use approximation for large numbers
   const factorial = new FactorialComponent({
       useStirlingApproximation: true
   });
   ```

3. **Limit Input Range**
   ```javascript
   // Good: Set reasonable limits
   const factorial = new FactorialComponent({
       maxInput: 100 // Prevent overflow
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Unexpected Zero Output**
   - **Cause:** Error conditions or invalid inputs
   - **Solution:** Check input validation and error handling

2. **Output Not Updating**
   - **Cause:** Signal aggregation issues or time frame delays
   - **Solution:** Verify signal connections and time frame settings

3. **Performance Issues**
   - **Cause:** Large inputs or inefficient calculation
   - **Solution:** Use caching or Stirling's approximation

4. **Overflow Errors**
   - **Cause:** Input too large for exact calculation
   - **Solution:** Use approximation or limit input range

### Debugging Techniques

```javascript
// Enhanced debugging version
class DebugFactorialComponent extends FactorialComponent {
    constructor(config) {
        super(config);
        this.debugMode = config.debugMode || false;
        this.operationLog = [];
    }
    
    process(input) {
        if (this.debugMode) {
            console.log(`FactorialComponent: ${input}!`);
        }
        
        const result = super.process(input);
        
        if (this.debugMode) {
            this.operationLog.push({
                input: input,
                output: result,
                timestamp: Date.now()
            });
        }
        
        return result;
    }
    
    getDebugInfo() {
        return {
            operationLog: this.operationLog,
            status: this.getStatus()
        };
    }
}
```

## Component Comparison

### Factorial vs Other Mathematical Components

| Component | Operation | Inputs | Use Case |
|-----------|-----------|--------|----------|
| **Factorial** | n! | 1 | Combinatorics, probability, series |
| **Exponentiation** | a^b | 2 | Powers, roots, exponential growth |
| **Multiply** | a × b | 2 | Scaling, amplification |
| **Adder** | a + b | 2+ | Summing, accumulation |

### When to Use Factorial Component

**Use Factorial when you need:**
- Calculate permutations and combinations
- Probability calculations
- Mathematical series expansions
- Combinatorial problems
- Statistical analysis

**Consider alternatives when:**
- Simple multiplication is needed (use Multiply)
- Power operations (use Exponentiation)
- Addition operations (use Adder)

## Advanced Usage Patterns

### 1. **Cascading Factorial**
```javascript
// Multiple factorial operations in series
const factorial1 = new FactorialComponent();
const factorial2 = new FactorialComponent();

const result1 = factorial1.process(5); // 120
const result2 = factorial2.process(result1); // Overflow!
```

### 2. **Conditional Factorial**
```javascript
// Factorial with conditional logic
class ConditionalFactorialComponent extends FactorialComponent {
    process(input, condition) {
        if (condition) {
            return super.process(input);
        } else {
            return input; // Pass through without factorial
        }
    }
}
```

### 3. **Multi-Input Factorial**
```javascript
// Handle multiple inputs
class MultiFactorialComponent extends FactorialComponent {
    processMultiple(inputs) {
        return inputs.map(input => this.performFactorial(input));
    }
}
```

## Mathematical References

### Factorial Properties
- **Definition:** n! = n × (n-1) × (n-2) × ... × 2 × 1
- **Special Cases:** 0! = 1, 1! = 1
- **Recursion:** n! = n × (n-1)!
- **Gamma Function:** n! = Γ(n+1) for non-negative integers

### Stirling's Approximation
- **Formula:** n! ≈ √(2πn) × (n/e)^n
- **Accuracy:** Improves with larger n
- **Use Case:** Large factorial calculations

### Related Functions
- **Double Factorial:** n!! = n × (n-2) × (n-4) × ...
- **Subfactorial:** !n = n! × Σ(-1)^k / k!
- **Multifactorial:** n!(k) = n × (n-k) × (n-2k) × ...

### Precision Considerations
- **Integer overflow** occurs around n = 21 for 64-bit integers
- **Floating-point precision** limits exact calculation
- **Stirling's approximation** provides good estimates for large n
- **Caching** improves performance for repeated calculations

---

*This documentation provides a comprehensive guide to the Factorial component in Barotrauma's electrical system, including its mathematical behavior, practical applications, and implementation examples.* 
