import { faker } from '@faker-js/faker';
import {
  TileListComponent,
  TileListTileDefDirective,
  TileListTileDirective,
} from './tile-list.component';

describe(TileListComponent.name, () => {
  const dataSource = faker.helpers.multiple(faker.lorem.word, { count: 10 });
  const tiles = dataSource.map((item, index) => ({
    item,
    bounds: { left: 200 * index, top: 200 * index, width: 200, height: 200 }, // these don't have to be an actual grid layout
  }));
  beforeEach(() => {
    cy.mount(
      `<app-tile-list [dataSource]="dataSource" [layoutFunction]="layoutFunction">
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
          layoutFunction: () => {
            return { tiles };
          },
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
  it('should position the tiles using the bounds returned from teh layoutFunction', () => {
    cy.get('app-tile-list')
      .findAllByRole('listitem')
      .should(($items) => {
        const actualBounds = $items.map((i, el) => {
          const { left, top, width, height } = el.getBoundingClientRect();

          return { left, top, width, height };
        });

        const expectedBounds = tiles.map((tile) => tile.bounds);
        expect(actualBounds.get()).to.deep.eq(expectedBounds);
      });
  });
});
