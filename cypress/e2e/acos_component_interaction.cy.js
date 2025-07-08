describe('Acos Component Interaction', () => {
  before(() => {
    cy.visit('/')
  })

  it('places Acos and Constant, wires them, sets values, and verifies Acos behavior', () => {
    // Scroll to the top-left of the circuit board to start from a known position
    cy.get('#circuit-board-wrapper').scrollTo(0, 0)

    // Place Acos component
    cy.get('#component-tray').contains('Acos').scrollIntoView().should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(300, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="acos"]').should('exist')

    // Place Constant for input
    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(100, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').should('exist')

    // Place Display component to see the output
    cy.get('#component-tray').contains('Display').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(500, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="display"]').should('exist')

    // Start simulation
    cy.contains('Start Simulation').click()
    cy.wait(200)

    // Wire Constant to Acos input
    cy.get('#circuit-board .component[data-component-type="constant"]')
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="acos"] .component-pin.in[data-pin-name="SIGNAL_IN"] .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Wire Acos output to Display
    cy.get('#circuit-board .component[data-component-type="acos"] .component-pin.out[data-pin-name="SIGNAL_OUT"] .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="display"] .component-pin.in .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Test 1: Input 1 (should be 0 degrees)
    cy.log('Testing input 1...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('1')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '0')

    // Test 2: Input 0.5 (should be 60 degrees)
    cy.log('Testing input 0.5...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('0.5')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '60')

    // Test 3: Input 0 (should be 90 degrees)
    cy.log('Testing input 0...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('0')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '90')

    // Test 4: Input -1 (should be 180 degrees)
    cy.log('Testing input -1...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('-1')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '180')

    // Test 5: Input out of bounds (>1, should clamp to 1, output 0)
    cy.log('Testing input 2 (out of bounds)...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('2')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '0')

    // Test 6: Input out of bounds (<-1, should clamp to -1, output 180)
    cy.log('Testing input -2 (out of bounds)...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('-2')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '180')

    // Test 7: String input (should parse to 0, output 90)
    cy.log('Testing string input "0.5"...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('0.5')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '60')

    // Test 8: Non-numeric string (should parse to 0, output 90)
    cy.log('Testing non-numeric string...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('hello')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '90')
  })
})
