describe('Adder Component Interaction', () => {
  before(() => {
    cy.visit('/')
  })

  it('places Adder and Constants, wires them, sets values, and verifies Adder behavior', () => {
    // Scroll to the top-left of the circuit board to start from a known position
    cy.get('#circuit-board-wrapper').scrollTo(0, 0)

    // Place Adder component
    cy.get('#component-tray').contains('Adder').scrollIntoView().should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(300, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="adder"]').should('exist')

    // Place Constants for both inputs
    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(100, 150, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0).should('exist')

    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(100, 250, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).should('exist')

    // Place Display component to see the output
    cy.get('#component-tray').contains('Display').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(500, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="display"]').should('exist')

    // Start simulation
    cy.contains('Start Simulation').click()
    cy.wait(200)

    // Wire Constant1 to Adder SIGNAL_IN_1
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="adder"] .component-pin.in[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Wire Constant2 to Adder SIGNAL_IN_2
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="adder"] .component-pin.in[data-pin-name="SIGNAL_IN_2"] .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Wire Adder output to Display
    cy.get('#circuit-board .component[data-component-type="adder"] .component-pin.out[data-pin-name="SIGNAL_OUT"] .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="display"] .component-pin.in .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Helper to set constant values
    function setConstant (idx, value) {
      cy.get('#circuit-board .component[data-component-type="constant"]').eq(idx).click()
      cy.get('#signal-value').clear().type(value)
      cy.get('body').click(0, 0)
      cy.wait(200)
    }

    // Test 1: 2 + 3 = 5
    cy.log('Testing 2 + 3...')
    setConstant(0, '2')
    setConstant(1, '3')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '5')

    // Test 2: -5 + 10 = 5
    cy.log('Testing -5 + 10...')
    setConstant(0, '-5')
    setConstant(1, '10')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '5')

    // Test 3: 0 + 0 = 0
    cy.log('Testing 0 + 0...')
    setConstant(0, '0')
    setConstant(1, '0')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '0')

    // Test 4: 1.5 + 2.5 = 4
    cy.log('Testing 1.5 + 2.5...')
    setConstant(0, '1.5')
    setConstant(1, '2.5')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '4')

    // Test 5: string numbers "7" + "8" = 15
    cy.log('Testing "7" + "8"...')
    setConstant(0, '7')
    setConstant(1, '8')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '15')

    // Test 6: non-numeric input "foo" + 3 = 3
    cy.log('Testing "foo" + 3...')
    setConstant(0, 'foo')
    setConstant(1, '3')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '3')

    // Test 7: 4 + "bar" = 4
    cy.log('Testing 4 + "bar"...')
    setConstant(0, '4')
    setConstant(1, 'bar')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .should('contain', '4')
  })
})
