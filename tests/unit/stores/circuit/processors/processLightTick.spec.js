import { describe, it, expect } from 'vitest'
import processLightTick from '../../../../../src/stores/circuit/processors/processLightTick'

describe('processLightTick', () => {
  describe('TOGGLE_STATE functionality', () => {
    it('should toggle light state when TOGGLE_STATE is truthy', () => {
      const component = {
        isOn: false,
        inputs: { TOGGLE_STATE: 1 }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should toggle light state from true to false', () => {
      const component = {
        isOn: true,
        inputs: { TOGGLE_STATE: 'on' }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should not toggle when TOGGLE_STATE is falsy', () => {
      const component = {
        isOn: false,
        inputs: { TOGGLE_STATE: 0 }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should not toggle when TOGGLE_STATE is null', () => {
      const component = {
        isOn: false,
        inputs: { TOGGLE_STATE: null }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should not toggle when TOGGLE_STATE is undefined', () => {
      const component = {
        isOn: false,
        inputs: { TOGGLE_STATE: undefined }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should handle boolean true for TOGGLE_STATE', () => {
      const component = {
        isOn: false,
        inputs: { TOGGLE_STATE: true }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should handle boolean false for TOGGLE_STATE', () => {
      const component = {
        isOn: false,
        inputs: { TOGGLE_STATE: false }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })
  })

  describe('SET_STATE functionality', () => {
    it('should set light to on when SET_STATE is truthy', () => {
      const component = {
        isOn: false,
        inputs: { SET_STATE: 1 }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should set light to off when SET_STATE is falsy', () => {
      const component = {
        isOn: true,
        inputs: { SET_STATE: 0 }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should set light to on when SET_STATE is "0" (non-empty string is truthy)', () => {
      const component = {
        isOn: false,
        inputs: { SET_STATE: '0' }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should set light to on when SET_STATE is "1"', () => {
      const component = {
        isOn: false,
        inputs: { SET_STATE: '1' }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should set light to off when SET_STATE is empty string', () => {
      const component = {
        isOn: true,
        inputs: { SET_STATE: '' }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should set light to on when SET_STATE is "false" (non-empty string is truthy)', () => {
      const component = {
        isOn: false,
        inputs: { SET_STATE: 'false' }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should set light to on when SET_STATE is "true"', () => {
      const component = {
        isOn: false,
        inputs: { SET_STATE: 'true' }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should set light to off when SET_STATE is null', () => {
      const component = {
        isOn: true,
        inputs: { SET_STATE: null }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should not change light state when SET_STATE is undefined', () => {
      const component = {
        isOn: true,
        inputs: { SET_STATE: undefined }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should set light to off when SET_STATE is false', () => {
      const component = {
        isOn: true,
        inputs: { SET_STATE: false }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })
  })

  describe('SET_COLOR functionality', () => {
    it('should set color when SET_COLOR is a valid string', () => {
      const component = {
        color: 'red',
        inputs: { SET_COLOR: 'blue' }
      }

      processLightTick(component)

      expect(component.color).toBe('blue')
    })

    it('should not set color when SET_COLOR is empty string', () => {
      const component = {
        color: 'red',
        inputs: { SET_COLOR: '' }
      }

      processLightTick(component)

      expect(component.color).toBe('red')
    })

    it('should not set color when SET_COLOR is whitespace only', () => {
      const component = {
        color: 'red',
        inputs: { SET_COLOR: '   ' }
      }

      processLightTick(component)

      expect(component.color).toBe('red')
    })

    it('should not set color when SET_COLOR is not a string', () => {
      const component = {
        color: 'red',
        inputs: { SET_COLOR: 123 }
      }

      processLightTick(component)

      expect(component.color).toBe('red')
    })

    it('should not set color when SET_COLOR is null', () => {
      const component = {
        color: 'red',
        inputs: { SET_COLOR: null }
      }

      processLightTick(component)

      expect(component.color).toBe('red')
    })

    it('should not set color when SET_COLOR is undefined', () => {
      const component = {
        color: 'red',
        inputs: { SET_COLOR: undefined }
      }

      processLightTick(component)

      expect(component.color).toBe('red')
    })

    it('should handle color with spaces', () => {
      const component = {
        color: 'red',
        inputs: { SET_COLOR: 'light blue' }
      }

      processLightTick(component)

      expect(component.color).toBe('light blue')
    })
  })

  describe('Input precedence', () => {
    it('should prioritize SET_STATE over TOGGLE_STATE', () => {
      const component = {
        isOn: false,
        inputs: {
          TOGGLE_STATE: 1, // This would toggle to true
          SET_STATE: 0 // But this should set to false
        }
      }

      processLightTick(component)

      expect(component.isOn).toBe(false)
    })

    it('should handle all inputs together', () => {
      const component = {
        isOn: false,
        color: 'red',
        inputs: {
          TOGGLE_STATE: 1,
          SET_STATE: 1,
          SET_COLOR: 'green'
        }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
      expect(component.color).toBe('green')
    })
  })

  describe('Edge cases', () => {
    it('should handle component without isOn property', () => {
      const component = {
        inputs: { SET_STATE: 1 }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should handle component without color property', () => {
      const component = {
        inputs: { SET_COLOR: 'blue' }
      }

      processLightTick(component)

      expect(component.color).toBe('blue')
    })

    it('should handle component without inputs', () => {
      const component = {
        isOn: true,
        color: 'red'
      }
      const originalState = { ...component }

      processLightTick(component)

      expect(component).toEqual(originalState)
    })

    it('should handle component with empty inputs object', () => {
      const component = {
        isOn: true,
        color: 'red',
        inputs: {}
      }
      const originalState = { ...component }

      processLightTick(component)

      expect(component).toEqual(originalState)
    })

    it('should handle undefined inputs', () => {
      const component = {
        isOn: true,
        color: 'red',
        inputs: undefined
      }
      const originalState = { ...component }

      processLightTick(component)

      expect(component).toEqual(originalState)
    })
  })

  describe('Component state initialization', () => {
    it('should initialize isOn when not present', () => {
      const component = {
        inputs: { SET_STATE: 1 }
      }

      processLightTick(component)

      expect(component.isOn).toBe(true)
    })

    it('should initialize color when not present', () => {
      const component = {
        inputs: { SET_COLOR: 'yellow' }
      }

      processLightTick(component)

      expect(component.color).toBe('yellow')
    })
  })

  describe('Integration scenarios', () => {
    it('should simulate light control sequence', () => {
      const component = {
        isOn: false,
        color: 'white'
      }

      // Turn on light
      component.inputs = { SET_STATE: 1 }
      processLightTick(component)
      expect(component.isOn).toBe(true)

      // Change color
      component.inputs = { SET_COLOR: 'red' }
      processLightTick(component)
      expect(component.isOn).toBe(true)
      expect(component.color).toBe('red')

      // Toggle off
      component.inputs = { TOGGLE_STATE: 1 }
      processLightTick(component)
      expect(component.isOn).toBe(false)
      expect(component.color).toBe('red')

      // Turn back on
      component.inputs = { SET_STATE: 1 }
      processLightTick(component)
      expect(component.isOn).toBe(true)
    })
  })
})
