import { faker } from '@faker-js/faker';
import {
  TileListComponent,
  TileListTileDefDirective,
  TileListTileDirective,
} from './tile-list.component';

describe(TileListComponent.name, () => {
  const dataSource = faker.helpers.multiple(faker.lorem.word, { count: 10 });
  beforeEach(() => {
    cy.mount(
      `<app-tile-list [dataSource]="dataSource" >
        <app-tile-list-tile *appTileListTileDef="let item">{{item}}</app-tile-list-tile>
      </app-tile-list>`,
      {
        imports: [
          TileListComponent,
          TileListTileDefDirective,
          TileListTileDirective,
        ],
        componentProperties: {
          dataSource,
        },
      }
    );
  });

  it('should have a list role', () => {
    cy.get('app-tile-list').should('have.attr', 'role', 'list');
  });
  it('should add the tiles to the dom', () => {
    cy.get('app-tile-list')
      .findAllByRole('listitem')
      .should('have.length', dataSource.length);
  });
  it('should render the data source as text content in each tile', () => {
    cy.get('app-tile-list')
      .findAllByRole('listitem')
      .should(($items) => {
        const text = $items.map((i, el) => {
          return Cypress.$(el).text();
        });

        expect(text.get()).to.deep.eq(dataSource);
      });
  });
});
