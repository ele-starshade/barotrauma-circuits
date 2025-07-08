/**
 * Processes a single tick for a Memory component in the circuit simulation.
 *
 * Stores a value and outputs it based on lock state.
 * Handles different storage modes and invalid inputs gracefully.
 * Non-numeric inputs are handled by converting to numbers.
 *
 * @param {Object} component - The Memory component to process.
 * @param {Object} component.inputs - The input signal values
 * @param {number|string} [component.inputs.SIGNAL_IN] - The input signal to store
 * @param {number|string} [component.inputs.LOCK_STATE] - Storage control signal
 * @param {Object} component.settings - The component's configuration settings
 * @param {number} [component.settings.value] - Currently stored value (default: 0)
 * @param {boolean} [component.settings.writeable] - Whether component can be written to (default: true)
 * @param {string} [component.settings.storageMode] - Storage mode: 'continuous', 'edge-triggered', 'level-sensitive' (default: 'continuous')
 * @param {number} [component.settings.maxValueLength] - Maximum length of stored value (default: 100)
 * @param {number} [component.settings.defaultValue] - Default value when no value is stored (default: 0)
 * @param {number} [component.settings.timeFrame] - Time-based processing window (default: 0)
 * @returns {Object} Object with SIGNAL_OUT containing the stored value
 *
 * @example
 * // Basic memory storage
 * const component = {
 *   inputs: { SIGNAL_IN: 5, LOCK_STATE: 1 },
 *   settings: { value: 0, writeable: true, storageMode: 'continuous' }
 * }
 * const result = processMemoryTick(component)
 * console.log(result.SIGNAL_OUT) // 5
 *
 * @example
 * // Memory with lock inactive
 * const component = {
 *   inputs: { SIGNAL_IN: 10, LOCK_STATE: 0 },
 *   settings: { value: 5, writeable: true, storageMode: 'continuous' }
 * }
 * const result = processMemoryTick(component)
 * console.log(result.SIGNAL_OUT) // 5 (unchanged)
 */
export default function processMemoryTick (component) {
  const { settings, inputs } = component
  const signalIn = inputs?.SIGNAL_IN
  const lockState = inputs?.LOCK_STATE

  // Get current stored value
  let storedValue = settings?.value ?? settings?.defaultValue ?? 0
  const writeable = settings?.writeable ?? true
  const storageMode = settings?.storageMode ?? 'continuous'
  const maxValueLength = settings?.maxValueLength ?? 100
  const timeFrame = settings?.timeFrame ?? 0

  try {
    // Handle null/undefined/empty inputs
    const inputSignal = (signalIn === null || signalIn === undefined || signalIn === '') ? 0 : signalIn
    const inputLockState = (lockState === null || lockState === undefined || lockState === '') ? 0 : lockState

    // Convert to numbers
    const numSignalIn = Number(inputSignal)
    const numLockState = Number(inputLockState)

    if (isNaN(numSignalIn) || isNaN(numLockState)) {
      // If inputs cannot be converted to numbers, return stored value
      return { SIGNAL_OUT: storedValue }
    }

    // Determine if we should store the value based on storage mode
    let shouldStore = false

    switch (storageMode) {
      case 'continuous':
        // Store whenever lock_state is active
        shouldStore = numLockState > 0
        break

      case 'edge-triggered':
        // Store only on rising edge (would need component state for this)
        shouldStore = numLockState > 0
        break

      case 'level-sensitive':
        // Store when lock_state is above threshold
        shouldStore = numLockState > 0.5
        break

      default:
        shouldStore = numLockState > 0
    }

    // Update stored value if conditions are met
    if (writeable && shouldStore) {
      // Convert to string and truncate if needed
      const newValue = String(numSignalIn).substring(0, maxValueLength)

      storedValue = newValue

      // Update component's internal state
      if (component.value !== undefined) {
        component.value = newValue
      }

      // Update settings to persist the value
      if (settings) {
        settings.value = newValue
      }
    }

    // Apply time-based processing if configured
    if (timeFrame > 0) {
      // Initialize signal history if not exists
      if (!component.signalHistory) {
        component.signalHistory = []
      }

      const currentTime = Date.now()

      // Add current result to history
      component.signalHistory.push({
        value: storedValue,
        timestamp: currentTime
      })

      // Remove old entries outside time frame
      const cutoffTime = currentTime - (timeFrame * 1000)

      component.signalHistory = component.signalHistory.filter(entry =>
        entry.timestamp >= cutoffTime
      )

      // Use the most recent result in time frame (for memory, averaging doesn't make sense)
      if (component.signalHistory.length > 0) {
        storedValue = component.signalHistory[component.signalHistory.length - 1].value
      }
    }

    return { SIGNAL_OUT: storedValue }
  } catch (error) {
    // If calculation fails, return stored value
    return { SIGNAL_OUT: storedValue }
  }
}
