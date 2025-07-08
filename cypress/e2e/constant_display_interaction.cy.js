describe('Constant and Display Component Interaction', () => {
  before(() => {
    cy.visit('/')
  })

  it('places Constant and Display, then wires them together (click-to-connect)', () => {
    // Scroll to the top-left of the circuit board to start from a known position
    cy.get('#circuit-board-wrapper').scrollTo(0, 0)

    // Place Constant
    cy.get('#component-tray').contains('Constant').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(200, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="constant"]').should('exist')

    // Place Display
    cy.get('#component-tray').contains('Display').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(400, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="display"]').should('exist')

    // Wire them together (use data-component-type selectors for robustness)
    cy.get('#circuit-board .component[data-component-type="constant"] .component-pin[data-pin-name="VALUE_OUT"] .new-wire-zone').should('be.visible').click()
    cy.get('#circuit-board .component[data-component-type="display"] .component-pin[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').should('be.visible').click()
    // Verify a wire exists
    cy.get('#wire-layer .wire').should('exist')

    // Start the simulation to enable signal propagation
    cy.get('#top-bar').contains('Start Simulation').click()
    cy.get('#top-bar').should('contain', 'Running...')

    // Select the Constant component to open the config panel
    cy.get('#circuit-board .component[data-component-type="constant"]').click({ force: true })
    cy.get('#config-panel-container .config-panel').should('be.visible')
    cy.get('#config-panel-container .config-panel-header').should('contain', 'Constant Component')

    // Verify the initial value is '0' (default)
    cy.get('#signal-value').should('have.value', '0')

    // Change the value to 'Hello World'
    cy.get('#signal-value').clear().type('Hello World')

    // Verify the Display component shows the new value
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('contain', 'Hello World')

    // Change the value to a number
    cy.get('#signal-value').clear().type('42')

    // Verify the Display component shows the number
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('contain', '42')

    // Change the value to empty string
    cy.get('#signal-value').clear()

    // Verify the Display component shows empty string when value is empty
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('be.empty')
  })
})
