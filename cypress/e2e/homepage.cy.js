describe('Homepage Functionality Tests', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:5173/homepage');
  });

  describe('Homepage load tests', () => {
    it('Test should load all buttons and UI elements on homepage on visit', () => {
      cy.get('.food-spots-button').should('be.visible').and('contain', 'Food');
      cy.get('.housing-button').should('be.visible').and('contain', 'Housing');
      cy.get('.activities-button').should('be.visible').and('contain', 'Activities');

      cy.get('button.filter-button').should('be.visible').click({ force: true });
      cy.get('.search-button').should('be.visible').click({ force: true });
      cy.get('.dashboard-button-2').should('be.visible').and('contain', 'Dashboard');
  
      cy.get('button').contains(/log in/i).should('exist');
      cy.get('button').contains(/sign up/i).should('exist');
  
      cy.get('.search-input').should('exist').and('have.attr', 'placeholder');
    });
  });

  describe('Category buttons tests', () => {
    it('Test should load homepage with category buttons and search bar', () => {
      cy.get('.food-spots-button').should('exist');
      cy.get('.housing-button').should('exist');
      cy.get('.activities-button').should('exist');
      cy.get('.search-input').should('exist');
    });
  });

  describe('Filter sliders tests', () => {
    it('Test should toggle filter sliders when filter button is clicked', () => {
      cy.get('button.filter-button').click({ force: true });
      cy.get('.sliders-container').should('be.visible');
    });

    it('Test should update results when distance slider is changed', () => {
      cy.get('button.filter-button').click({ force: true });
    
      cy.get('.slider .MuiSlider-thumb')
        .first()
        .trigger('mousedown', { which: 1, pageX: 100, force: true })
        .trigger('mousemove', { which: 1, pageX: 50, force: true }) 
        .trigger('mouseup', { force: true });
    
      cy.wait(1000); 
      cy.get('.places-box').should('exist');
    });
    
    it('Test should update results when budget slider is changed', () => {
      cy.get('button.filter-button').click({ force: true });
    
      cy.get('.slider .MuiSlider-thumb')
        .first()
        .trigger('mousedown', { which: 1, pageX: 100, force: true })
        .trigger('mousemove', { which: 1, pageX: 50, force: true }) 
        .trigger('mouseup', { force: true });
    
      cy.wait(1000);
      cy.get('.places-box').should('exist');
    }); 
  });

  describe('User login navigation test cases', () => {
    it('Test should navigate to login after dashboard clicked when logged out', () => {
      cy.visit('http://localhost:5173/homepage');
      cy.get('.dashboard-button-2', { timeout: 10000 }).should('be.visible');
      cy.get('.dashboard-button-2').click({ force: true });
      cy.url().should('include', '/login');
    });
  });

  describe('Top rating tests', () => {
    it('Test should show top rated places when filters are hidden', () => {
      cy.intercept('GET', '**/api/top-rated').as('topRated');
      cy.get('button.filter-button').click({ force: true });
      cy.wait('@topRated');
      cy.get('.places-box').should('exist');
    });
  });

  describe('Search Bar Functionality', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080); 
      cy.visit('http://localhost:5173/homepage');
    });

    it('Test should allow typing in the search bar', () => {
      cy.get('.search-input').type('tacos').should('have.value', 'tacos');
    });

    it('Test should allow searching for a place within a selected category', () => {
      cy.intercept('GET', '**/places/search**').as('placesSearch');
      cy.get('.food-spots-button').click({ force: true });
      cy.wait('@placesSearch');
  
      cy.get('.search-input').type('Pizza');
      cy.get('.search-button').click({ force: true });
  
      cy.get('.places-box').should('exist');
      cy.intercept('GET', '**/places/search**', {
        statusCode: 200,
        body: {
          results: [
            {
              fsq_id: 'abc123',
              name: 'Pizza Palace',
              photos: [],
              location: { formatted_address: '123 Pizza St' },
              categories: [{ name: 'Pizza' }],
              geocodes: { main: { latitude: 0, longitude: 0 } },
            }
          ]
        }
      }).as('placesSearch');
    });

    it('Test should show pizza search results when search button is clicked after typing', () => {
      cy.get('.search-input').type('pizza');
      cy.get('.search-button').click({ force: true });
      cy.get('.places-container .places-box').should('exist');
    });

    it('Test should search for boba results on pressing Enter key', () => {
      cy.get('.search-input').type('boba{enter}');
      cy.get('.places-container .places-box').should('exist');
    });    
  });
});
