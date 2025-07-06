describe('Smoke Test', () => {
  it('Visits the app root url and checks for the component tray', () => {
    cy.visit('/')
    cy.get('#component-tray').should('be.visible')
  })
})
