describe('Random and Display Component Interaction', () => {
  before(() => {
    cy.visit('/')
  })

  it('places Random and Display, wires them, configures Random settings, and verifies periodic value generation', () => {
    // Scroll to the top-left of the circuit board to start from a known position
    cy.get('#circuit-board-wrapper').scrollTo(0, 0)

    // Place Random
    cy.get('#component-tray').contains('Random').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(200, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="random"]').should('exist')

    // Place Display
    cy.get('#component-tray').contains('Display').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(400, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="display"]').should('exist')

    // Wire them together
    cy.get('#circuit-board .component[data-component-type="random"] .component-pin[data-pin-name="VALUE_OUT"] .new-wire-zone').should('be.visible').click()
    cy.get('#circuit-board .component[data-component-type="display"] .component-pin[data-pin-name="SIGNAL_IN_1"] .new-wire-zone').should('be.visible').click()
    // Verify a wire exists
    cy.get('#wire-layer .wire').should('exist')

    // Start the simulation to enable signal propagation
    cy.get('#top-bar').contains('Start Simulation').click()
    cy.get('#top-bar').should('contain', 'Running...')

    // Select the Random component to open the config panel
    cy.get('#circuit-board .component[data-component-type="random"]').click({ force: true })
    cy.get('#config-panel-container .config-panel').should('be.visible')
    cy.get('#config-panel-container .config-panel-header').should('contain', 'Random Component')

    // Verify the initial settings
    cy.get('input[id^="min-"]').should('have.value', '0')
    cy.get('input[id^="max-"]').should('have.value', '1')
    cy.get('input[id^="period-"]').should('have.value', '1000')

    // Change the settings to generate values between 1 and 10 every 500ms
    cy.get('input[id^="min-"]').clear().type('1')
    cy.get('input[id^="max-"]').clear().type('10')
    cy.get('input[id^="period-"]').clear().type('500')

    // Wait a moment for the new period to take effect and verify the Display shows a value
    cy.wait(600) // Wait slightly longer than the period to ensure a new value is generated
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('not.be.empty')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').invoke('text').then((value) => {
      const numValue = parseInt(value)

      expect(numValue).to.be.at.least(1)
      expect(numValue).to.be.at.most(10)
    })

    // Change settings to generate values between 100 and 200 every 200ms
    cy.get('input[id^="min-"]').clear().type('100')
    cy.get('input[id^="max-"]').clear().type('200')
    cy.get('input[id^="period-"]').clear().type('200')

    // Wait for the new period and verify the Display shows a value in the new range
    cy.wait(300) // Wait for new value generation
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('not.be.empty')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').invoke('text').then((value) => {
      const numValue = parseInt(value)

      expect(numValue).to.be.at.least(100)
      expect(numValue).to.be.at.most(200)
    })

    // Test edge case: same min and max values
    cy.get('input[id^="min-"]').clear().type('42')
    cy.get('input[id^="max-"]').clear().type('42')
    cy.get('input[id^="period-"]').clear().type('100')

    // Wait and verify the Display shows the constant value
    cy.wait(150)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('contain', '42')

    // Test negative values
    cy.get('input[id^="min-"]').clear().type('-10')
    cy.get('input[id^="max-"]').clear().type('-5')
    cy.get('input[id^="period-"]').clear().type('100')

    // Wait and verify the Display shows a negative value in range
    cy.wait(150)
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').should('not.be.empty')
    cy.get('#circuit-board .component[data-component-type="display"] .component-value-display').invoke('text').then((value) => {
      const numValue = parseInt(value)

      expect(numValue).to.be.at.least(-10)
      expect(numValue).to.be.at.most(-5)
    })

    // Verify the wire shows the value (animated when simulation is running)
    cy.get('#wire-layer .wire.animated').should('exist')
  })
})
