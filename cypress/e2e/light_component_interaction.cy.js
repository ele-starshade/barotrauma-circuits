describe('Light Component Interaction', () => {
  before(() => {
    cy.visit('/')
  })

  it('places Light and Constants, wires them, sets values, and verifies Light behavior', () => {
    // Scroll to the top-left of the circuit board to start from a known position
    cy.get('#circuit-board-wrapper').scrollTo(0, 0)

    // Place Light
    cy.get('#component-tray').contains('Light').should('be.visible').click()
    cy.get('#circuit-board').should('be.visible').click(300, 200, { force: true })
    cy.get('#circuit-board .component[data-component-type="light"]').should('exist')

    // Place Constants for each input
    const constantPositions = [
      { label: 'TOGGLE_STATE', x: 100, y: 100 },
      { label: 'SET_STATE', x: 100, y: 300 },
      { label: 'SET_COLOR', x: 100, y: 500 }
    ]

    constantPositions.forEach((pos, i) => {
      cy.get('#component-tray').contains('Constant').should('be.visible').click()
      cy.get('#circuit-board').should('be.visible').click(pos.x, pos.y, { force: true })
      cy.get('#circuit-board .component[data-component-type="constant"]').eq(i).should('exist')
    })

    // Start simulation
    cy.contains('Start Simulation').click()

    // Wait for simulation to start
    cy.wait(200)

    // Wire SET_COLOR constant to Light (this can stay connected throughout)
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(2)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="light"] .component-pin.in[data-pin-name="SET_COLOR"] .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Set initial color to red
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(2).click()
    cy.get('#signal-value').clear().type('#ff0000')
    cy.get('body').click(0, 0)
    cy.wait(200)

    // Test 1: SET_STATE functionality (direct control)
    // Wire SET_STATE constant to Light
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="light"] .component-pin.in[data-pin-name="SET_STATE"] .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Turn on the light via SET_STATE
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).click()
    cy.get('#signal-value').clear().type('1')
    cy.get('body').click(0, 0)
    cy.wait(200)

    // Light should be ON and red
    cy.log('Testing SET_STATE ON...')
    cy.get('#circuit-board .component[data-component-type="light"] .light-indicator')
      .should('have.css', 'background-color', 'rgb(255, 0, 0)') // Red
      .and('have.css', 'box-shadow') // Should have a glow

    // Turn off the light via SET_STATE
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).click()
    cy.get('#signal-value').clear().type('0')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="light"] .light-indicator')
      .should('have.css', 'background-color', 'rgb(0, 0, 0)')

    // Test 2: TOGGLE_STATE functionality (when SET_STATE is not connected)
    // Wire TOGGLE_STATE constant to Light (SET_STATE is still connected but set to 0)
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0)
      .find('.component-pin.out .new-wire-zone').click({ force: true })
    cy.get('#circuit-board .component[data-component-type="light"] .component-pin.in[data-pin-name="TOGGLE_STATE"] .new-wire-zone').click({ force: true })
    cy.wait(200)

    // Toggle ON via TOGGLE_STATE (should NOT work because SET_STATE=0 overrides it)
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0).click()
    cy.get('#signal-value').clear().type('1')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="light"] .light-indicator')
      .should('have.css', 'background-color', 'rgb(0, 0, 0)') // Should stay OFF (SET_STATE=0 overrides TOGGLE_STATE)

    // Test 3: SET_STATE priority over TOGGLE_STATE
    // Set SET_STATE to 1 (should override TOGGLE_STATE and turn light ON)
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).click()
    cy.get('#signal-value').clear().type('1')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="light"] .light-indicator')
      .should('have.css', 'background-color', 'rgb(255, 0, 0)') // Should be ON (SET_STATE takes precedence)

    // Now toggle ON via TOGGLE_STATE (should still be ON because SET_STATE=1 takes precedence)
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(0).click()
    cy.get('#signal-value').clear().type('1')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="light"] .light-indicator')
      .should('have.css', 'background-color', 'rgb(255, 0, 0)') // Should still be ON (SET_STATE=1 takes precedence)

    // Test 4: SET_COLOR functionality
    // Turn on the light first via SET_STATE
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(1).click()
    cy.get('#signal-value').clear().type('1')
    cy.get('body').click(0, 0)
    cy.wait(200)

    // Change color to green
    cy.get('#circuit-board .component[data-component-type="constant"]').eq(2).click()
    cy.get('#signal-value').clear().type('#00ff00')
    cy.get('body').click(0, 0)
    cy.wait(200)
    cy.get('#circuit-board .component[data-component-type="light"] .light-indicator')
      .should('have.css', 'background-color', 'rgb(0, 255, 0)') // Should be green
  })
})
