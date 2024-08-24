import { faker } from '@faker-js/faker';
import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { gridLayout } from './layout/grid';
import {
  TILE_LIST_OPTIONS,
  TileListComponent,
  TileListTileDefDirective,
  TileListTileDirective,
} from './tile-list.component';

const meta: Meta<TileListComponent<unknown>> = {
  component: TileListComponent,
  title: 'Shared/Components/TileList',
  parameters: {
    layout: 'fill',
  },
  render: ({ ...args }) => ({
    props: args,
    template: `
      <app-tile-list ${argsToTemplate(args)}>
        <app-tile-list-tile *appTileListTileDef="let item" style="display: flex; align-items: center; justify-content: center; background: grey">{{item}}</app-tile-list-tile>
      </app-tile-list>`,
  }),
  decorators: [
    moduleMetadata({
      imports: [TileListTileDefDirective, TileListTileDirective],
      providers: [
        {
          provide: TILE_LIST_OPTIONS,
          useValue: { defaultLayoutFunction: gridLayout() },
        },
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<TileListComponent<unknown>>;

export const Primary: Story = {
  args: {
    dataSource: faker.helpers.multiple(faker.lorem.word, { count: 10 }),
  },
};
