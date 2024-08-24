export type LayoutResult<T> = { tiles: TileDetails<T>[] };

export type LayoutFunction<T> = (
  items: T[],
  layoutWidth: number,
  gap: number,
  minTileSize: number
) => LayoutResult<T>;

export type TileDetails<T> = {
  item: T;
  bounds: { left: number; top: number; width: number; height: number };
};
