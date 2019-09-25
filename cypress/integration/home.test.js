/// <reference types="Cypress" />

describe('Home Page', () => {

  beforeEach(() => {
    cy.fixture('courses.json')
      .as('coursesJSON');
    // mock(initialize server) http backend
    cy.server();
    // use courses.json as response on api/courses
    cy.route('/api/courses', '@coursesJSON')
      .as('courses');
    // trigger visit
    cy.visit('/');
  });

  it('should display a list of courses', () => {

    cy.contains('All Courses');

    // wait response completed
    cy.wait('@courses');

    // get all cards
    cy.get('mat-card')
      .should("have.length", 9);

  });

  it('should display the advanced courses', () => {

    cy.get('.mat-tab-label')
      .should('have.length', 2);
    cy.get('.mat-tab-label').last()
      .click();

    cy.get('.mat-tab-body-active mat-card-title')
      .its('length')
      .should('be.gt', 1);

    cy.get('.mat-tab-body-active mat-card-title').first()
      .should('contain', 'Angular Security Course');
  });

});