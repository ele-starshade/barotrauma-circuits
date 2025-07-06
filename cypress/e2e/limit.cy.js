describe('Component Limiter', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('allows adding components freely when the limit is disabled', () => {
    // 1. Disable the component limit
    cy.get('#limitSwitch').uncheck()
    cy.get('#limitSwitch').should('not.be.checked')
    cy.get('.component-counter').should('contain', 'Components: 0')
    cy.get('.component-counter').should('not.contain', '/ 2')

    // 2. Drag a component to the board and check that the count increments
    cy.get('#component-tray').contains('Constant').dragTo('#circuit-board', { x: 200, y: 200 })
    cy.get('.component-counter').should('contain', 'Components: 1')
    cy.get('.component-counter').should('not.contain', '/ 2')
    cy.get('#circuit-board .component').should('have.length', 1)

    // 3. Re-enable the limit and check that the text updates
    cy.get('#limitSwitch').check()
    cy.get('#limitSwitch').should('be.checked')
    cy.get('.component-counter').should('contain', 'Components: 1 / 2')
  })

  it('does not allow adding more components than the limit', () => {
    // 1. Check that the limit is enabled and the text reflects the new limit
    cy.get('#limitSwitch').should('be.checked')
    cy.get('.component-counter').should('contain', 'Components: 0 / 2')

    // 2. Add two components
    cy.get('#component-tray').contains('Constant').dragTo('#circuit-board', { x: 200, y: 200 })
    cy.get('#component-tray').contains('Constant').dragTo('#circuit-board', { x: 400, y: 200 })

    // 3. Assert that there are 2 components and the counter is updated
    cy.get('#circuit-board .component').should('have.length', 2)
    cy.get('.component-counter').should('contain', 'Components: 2 / 2')

    // 4. Attempt to add a third component
    cy.get('#component-tray').contains('Add').dragTo('#circuit-board', { x: 800, y: 400 })

    // 5. Assert that the third component was not added
    cy.get('#circuit-board .component').should('have.length', 2)
    cy.get('.component-counter').should('contain', 'Components: 2 / 2')
  })
})
