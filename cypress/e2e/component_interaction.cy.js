describe('Component Interaction', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('drags a component from the tray to the board', () => {
    // There should be no components on the board initially
    cy.get('#circuit-board .component').should('not.exist')

    // Find the "Add" component in the tray and drag it to the board
    cy.get('#component-tray').contains('Add').dragTo('#circuit-board', { x: 400, y: 300 })

    // Now, there should be exactly one component on the board
    cy.get('#circuit-board .component').should('have.length', 1)

    // And that component should contain the name "ADD" (in caps)
    cy.get('#circuit-board .component').contains('ADD').should('be.visible')
  })
})
