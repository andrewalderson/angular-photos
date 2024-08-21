import { faker } from '@faker-js/faker';
import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import {
  TileListComponent,
  TileListTileDefDirective,
  TileListTileDirective,
} from './tile-list.component';

const meta: Meta<TileListComponent<unknown>> = {
  component: TileListComponent,
  title: 'Shared/Components/TileList',
  render: ({ ...args }) => ({
    props: args,
    template: `
      <app-tile-list ${argsToTemplate(args)}>
        <app-tile-list-tile *appTileListTileDef="let item">{{item}}</app-tile-list-tile>
      </app-tile-list>`,
  }),
  decorators: [
    moduleMetadata({
      imports: [TileListTileDefDirective, TileListTileDirective],
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
