describe('e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should render', () => {
    cy.get('app-root').should('exist');
  });
});
