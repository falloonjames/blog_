const name = 'newUser';

context('Actions', () => {
    beforeEach(() => {
      cy.visit('localhost:5000')
    })
  
  
    it('signs up using UI', () => {
    //   cy.contains('Login')
    //     .should('have.attr', 'href', '/login');
    //   cy.contains('Sign Up')
    //     .should('have.attr', 'href', '/register');

      cy.visit('/register');
      cy.get('#name')
        .clear()
        .type(name)
      cy.get('#password')
        .clear()
        .type('password')
      cy.get('[type=submit]')
        .click();

      cy.contains(`Hi ${name}`)
   
    //   cy.visit('/login');
    //   cy.get('#name')
    //     .clear()
    //     .type('test')
    //   cy.get('#password')
    //     .clear()
    //     .type('password')
    //   cy.get('[type=submit]')
    //     .click();
  
    //   cy.get('.action-form').submit()
    //     .next().should('contain', 'Your form has been submitted!')
    })

    // it.only('signs up using REST', () => {
    //     //   cy.contains('Login')
    //     //     .should('have.attr', 'href', '/login');
    //     //   cy.contains('Sign Up')
    //     //     .should('have.attr', 'href', '/register');
    
    //     cy.request('POST','/register', {'username':'ass3000', 'password':'ass3000'});
       
    //     //   cy.visit('/login');
    //     //   cy.get('#name')
    //     //     .clear()
    //     //     .type('test')
    //     //   cy.get('#password')
    //     //     .clear()
    //     //     .type('password')
    //     //   cy.get('[type=submit]')
    //     //     .click();
      
    //     //   cy.get('.action-form').submit()
    //     //     .next().should('contain', 'Your form has been submitted!')
    //     })
  
})