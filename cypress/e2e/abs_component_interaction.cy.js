describe('Abs Component Interaction', () => {
  before(() => {
    cy.visit('/')
  })

  it('places Abs and Constants, wires them, sets values, and verifies Abs behavior', () => {
    // Scroll to the top-left of the circuit board to start from a known position
    cy.get('#circuit-board-wrapper').scrollTo(0, 0)

    // Place Abs component
    cy.get('#component-tray').contains('Abs').scrollIntoView().should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(300, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="abs"]').should('exist')

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

    // Wait for simulation to start
    cy.wait(200)

    // Wire Constant to Abs input
    cy.get('#circuit-board .component[data-component-type="constant"]')
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="abs"] .component-pin.in[data-pin-name="SIGNAL_IN"] .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Wire Abs output to Display
    cy.get('#circuit-board .component[data-component-type="abs"] .component-pin.out[data-pin-name="SIGNAL_OUT"] .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="display"] .component-pin.in .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Test 1: Positive number
    cy.log('Testing positive number...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('42')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '42')

    // Test 2: Negative number
    cy.log('Testing negative number...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('-42')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '42')

    // Test 3: Zero
    cy.log('Testing zero...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('0')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '0')

    // Test 4: Decimal negative number
    cy.log('Testing decimal negative number...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('-15.7')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '15.7')

    // Test 5: String number (negative)
    cy.log('Testing string number...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('-123.45')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '123.45')

    // Test 6: Non-numeric string (should return 0)
    cy.log('Testing non-numeric string...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('hello')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '0')

    // Test 7: Large negative number
    cy.log('Testing large negative number...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('-999999')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '999999')

    // Test 8: Very small negative decimal
    cy.log('Testing very small negative decimal...')
    cy.get('#circuit-board .component[data-component-type="constant"]').click()
    cy.get('#signal-value').clear().type('-0.001')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '0.001')
  })
})
