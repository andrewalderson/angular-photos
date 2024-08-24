import { LayoutFunction, TileDetails } from './types';

export function gridLayout<T>(): LayoutFunction<T> {
  return (
    items: T[],
    layoutWidth: number,
    gap: number,
    minTileSize: number
  ) => {
    const columnCount = Math.max(1, Math.floor(layoutWidth / minTileSize));
    const columnWidth = (layoutWidth + gap) / columnCount - gap;
    const rowHeight = columnWidth;
    const tiles: TileDetails<T>[] = [];
    let left = 0;
    let top = 0;

    for (let i = 0; i < items.length; i++) {
      if (i > 0 && i % columnCount === 0) {
        left = 0;
        top += rowHeight + gap;
      }

      tiles.push({
        item: items[i],
        bounds: {
          left,
          top,
          width: columnWidth,
          height: rowHeight,
        },
      });

      left += columnWidth + gap;
    }

    return { tiles };
  };
}
