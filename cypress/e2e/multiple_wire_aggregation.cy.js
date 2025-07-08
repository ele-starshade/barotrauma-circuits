describe('Multiple Wire Aggregation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#circuit-board-wrapper').scrollTo(0, 0)
  })

  it('should allow multiple wires to connect to input pins', () => {
    // Add components using click-to-place (positioned lower to avoid top bar)
    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(100, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0).should('exist')

    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(200, 300, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).should('exist')

    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(250, 400, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(2).should('exist')

    cy.get('#component-tray').contains('Adder').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(350, 500, { force: true })
    cy.get('#circuit-board .component[data-component-type="adder"]').should('exist')

    // Add Display
    cy.get('#component-tray').contains('Display').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(400, 600, { force: true })
    cy.get('#circuit-board .component[data-component-type="display"]').should('exist')

    // Start simulation
    cy.contains('Start Simulation').click()

    // Configure constants
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0).click()
    cy.get('#signal-value').clear().type('5')
    cy.get('body').click(0, 0)

    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).click()
    cy.get('#signal-value').clear().type('10')
    cy.get('body').click(0, 0)

    cy.get('#circuit-board .component[data-component-type="constant"]').eq(2).click()
    cy.get('#signal-value').clear().type('3')
    cy.get('body').click(0, 0)

    // Connect first wire to SIGNAL_IN_1
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="adder"] .component-pin.in[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').click({ force: true })

    // Connect second wire to the SAME input (SIGNAL_IN_1) - testing multiple wires to same pin
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="adder"] .component-pin.in[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').click({ force: true })

    // Connect third constant to SIGNAL_IN_2 (to provide the second required input)
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(2)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="adder"] .component-pin.in[data-pin-name="SIGNAL_IN_2"] .new-wire-zone').click({ force: true })

    // Connect Adder output to Display
    cy.get('#circuit-board .component[data-component-type="adder"] .component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="display"] .component-pin.in[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').click({ force: true })

    // Verify wires are connected by checking wire count
    cy.get('#wire-layer .wire').should('have.length', 4)

    // Check that the first signal wins for SIGNAL_IN_1 (5 wins over 10), so output should be 5 + 3 = 8
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display')
      .invoke('text')
      .then((text) => {
        cy.log('Display value:', text)
      })
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('contain', '8')
  })

  it('should demonstrate first-signal-wins behavior with Signal Check', () => {
    // Add components using click-to-place (positioned lower to avoid top bar)
    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(100, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0).should('exist')

    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(200, 300, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).should('exist')

    cy.get('#component-tray').contains('Signal Check').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(300, 400, { force: true })
    cy.get('#circuit-board .component[data-component-type="signalcheck"]').should('exist')

    // Add Display
    cy.get('#component-tray').contains('Display').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(400, 500, { force: true })
    cy.get('#circuit-board .component[data-component-type="display"]').should('exist')

    // Start simulation
    cy.contains('Start Simulation').click()

    // Configure constants with different values
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0).click()
    cy.get('#signal-value').clear().type('50')
    cy.get('body').click(0, 0)

    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).click()
    cy.get('#signal-value').clear().type('90')
    cy.get('body').click(0, 0)

    // Configure signal check to look for "50"
    cy.get('#circuit-board .component[data-component-type="signalcheck"]').click()
    cy.get('input[id*="target-signal"]').clear().type('50')
    cy.get('body').click(0, 0)

    // Connect both wires to same input
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="signalcheck"] .component-pin.in[data-pin-name="SIGNAL_IN"] .new-wire-zone').click({ force: true })

    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="signalcheck"] .component-pin.in[data-pin-name="SIGNAL_IN"] .new-wire-zone').click({ force: true })

    // Connect SignalCheck output to Display
    cy.get('#circuit-board .component[data-component-type="signalcheck"] .component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="display"] .component-pin.in[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').click({ force: true })

    // First signal (50) should win and match the target
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('contain', '1')
  })
})
