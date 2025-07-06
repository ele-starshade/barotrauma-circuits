describe('Wiring', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('connects two components with a wire', () => {
    // 1. Add a Constant component
    cy.get('#component-tray').contains('Constant').dragTo('#circuit-board', { x: 200, y: 200 })

    // 2. Add an Add component
    cy.get('#component-tray').contains('Add').dragTo('#circuit-board', { x: 500, y: 200 })

    // 3. There should be no wires initially
    cy.get('#wire-layer .wire').should('not.exist')

    // 4. Connect the output of the Constant component to the input of the Add component
    cy.get('[data-component-type="constant"] [data-pin-name="VALUE_OUT"] .new-wire-zone').realMouseDown()
    cy.get('[data-component-type="add"] [data-pin-name="SIGNAL_IN_1"] .new-wire-zone').realMouseMove(0, 0, { position: 'center' }).realMouseUp()

    // 5. Assert that a wire has been created
    cy.get('#wire-layer .wire').should('exist')
  })

  it('does not connect an output to an output', () => {
    // 1. Add two Constant components
    cy.get('#component-tray').contains('Constant').dragTo('#circuit-board', { x: 200, y: 200 })
    cy.get('#component-tray').contains('Constant').dragTo('#circuit-board', { x: 500, y: 200 })

    // 2. Connect the output of the first Constant to the output of the second
    cy.get('#circuit-board [data-component-type="constant"]').first().find('[data-pin-name="VALUE_OUT"] .new-wire-zone').realMouseDown()
    cy.get('#circuit-board [data-component-type="constant"]').last().find('[data-pin-name="VALUE_OUT"] .new-wire-zone').realMouseMove(0, 0, { position: 'center' }).realMouseUp()

    // 3. Assert that no wire has been created
    cy.get('#wire-layer .wire').should('not.exist')
  })

  it('does not connect a pin to itself', () => {
    // 1. Add a Constant component
    cy.get('#component-tray').contains('Constant').dragTo('#circuit-board', { x: 200, y: 200 })

    // 2. Try to connect the output to itself
    cy.get('#circuit-board [data-component-type="constant"]').first().find('[data-pin-name="VALUE_OUT"] .new-wire-zone')
      .realMouseDown()
      .realMouseMove(0, 0, { position: 'center' })
      .realMouseUp()

    // 3. Assert that no wire has been created
    cy.get('#wire-layer .wire').should('not.exist')
  })
})
