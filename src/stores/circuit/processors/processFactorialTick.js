/**
 * Processes a single tick for a Factorial component in the circuit simulation.
 *
 * Outputs the factorial of the input.
 *
 * @param {Object} component - The Factorial component to process.
 * @returns {number|undefined} The result of the factorial, or undefined.
 */
export default function processFactorialTick (component) {
  const signalIn = component.inputs?.SIGNAL_IN

  if (signalIn !== undefined) {
    const n = parseInt(signalIn, 10)

    // Factorial is only defined for non-negative integers.
    // Let's also set a reasonable limit to prevent performance issues.
    if (isNaN(n) || n < 0 || n > 20) {
      return 0
    }

    if (n === 0) {
      return 1
    }

    let result = 1

    for (let i = 2; i <= n; i++) {
      result *= i
    }

    return { SIGNAL_OUT: result }
  }
}
