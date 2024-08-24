import { faker } from '@faker-js/faker';
import { gridLayout } from './grid';
import { LayoutFunction } from './types';

describe('Grid Layout', () => {
  let grid: LayoutFunction<string>;

  beforeEach(() => {
    grid = gridLayout();
  });

  const items = faker.helpers.multiple(faker.lorem.word, { count: 6 });
  const data = [
    {
      given:
        'the min tile size is evenly divisible by the layout width and there is no gap defined',
      then: 'should set the tile size to to the minTileSize',
      input: { items, layoutWidth: 800, gap: 0, minTileSize: 200 },
      output: {
        tiles: [
          {
            item: items[0],
            bounds: { left: 0, top: 0, width: 200, height: 200 },
          },
          {
            item: items[1],
            bounds: { left: 200, top: 0, width: 200, height: 200 },
          },
          {
            item: items[2],
            bounds: { left: 400, top: 0, width: 200, height: 200 },
          },
          {
            item: items[3],
            bounds: { left: 600, top: 0, width: 200, height: 200 },
          },
          {
            item: items[4],
            bounds: { left: 0, top: 200, width: 200, height: 200 },
          },
          {
            item: items[5],
            bounds: { left: 200, top: 200, width: 200, height: 200 },
          },
        ],
      },
    },
    {
      given: 'the min tile size is evenly divisible and there is a gap defined',
      then: 'should set the tile size smaller than the minTileSize',
      input: { items, layoutWidth: 800, gap: 10, minTileSize: 200 },
      output: {
        tiles: [
          {
            item: items[0],
            bounds: { left: 0, top: 0, width: 192.5, height: 192.5 },
          },
          {
            item: items[1],
            bounds: { left: 202.5, top: 0, width: 192.5, height: 192.5 },
          },
          {
            item: items[2],
            bounds: { left: 405, top: 0, width: 192.5, height: 192.5 },
          },
          {
            item: items[3],
            bounds: { left: 607.5, top: 0, width: 192.5, height: 192.5 },
          },
          {
            item: items[4],
            bounds: { left: 0, top: 202.5, width: 192.5, height: 192.5 },
          },
          {
            item: items[5],
            bounds: { left: 202.5, top: 202.5, width: 192.5, height: 192.5 },
          },
        ],
      },
    },
    {
      given:
        'the min tile size is not evenly divisible by the layout width and there is no gap defined',
      then: 'should set the tile size larger than the minTileSize and evenly divisible by the layout width',
      input: { items, layoutWidth: 700, gap: 0, minTileSize: 250 },
      output: {
        tiles: [
          {
            item: items[0],
            bounds: { left: 0, top: 0, width: 350, height: 350 },
          },
          {
            item: items[1],
            bounds: { left: 350, top: 0, width: 350, height: 350 },
          },
          {
            item: items[2],
            bounds: { left: 0, top: 350, width: 350, height: 350 },
          },
          {
            item: items[3],
            bounds: { left: 350, top: 350, width: 350, height: 350 },
          },
          {
            item: items[4],
            bounds: { left: 0, top: 700, width: 350, height: 350 },
          },
          {
            item: items[5],
            bounds: { left: 350, top: 700, width: 350, height: 350 },
          },
        ],
      },
    },
    {
      given:
        'the min tile size is not evenly divisible by the layout width and there is a gap defined',
      then: 'should set the tile size larger than the minTileSize and not evenly divisible by the layout width',
      input: { items, layoutWidth: 700, gap: 10, minTileSize: 250 },
      output: {
        tiles: [
          {
            item: items[0],
            bounds: { left: 0, top: 0, width: 345, height: 345 },
          },
          {
            item: items[1],
            bounds: { left: 355, top: 0, width: 345, height: 345 },
          },
          {
            item: items[2],
            bounds: { left: 0, top: 355, width: 345, height: 345 },
          },
          {
            item: items[3],
            bounds: { left: 355, top: 355, width: 345, height: 345 },
          },
          {
            item: items[4],
            bounds: { left: 0, top: 710, width: 345, height: 345 },
          },
          {
            item: items[5],
            bounds: { left: 355, top: 710, width: 345, height: 345 },
          },
        ],
      },
    },
  ];

  data.forEach(({ given, then, input, output }) => {
    describe(given, () => {
      it(then, () => {
        const { items, layoutWidth, gap, minTileSize } = input;

        const result = grid(items, layoutWidth, gap, minTileSize);

        expect(result).toEqual(output);
      });
    });
  });
});
