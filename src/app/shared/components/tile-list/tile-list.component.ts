import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  OnDestroy,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { LayoutFunction, TileDetails } from './layout/types';

export type TileListDataSourceInput<T> = readonly T[];

export const TILE_LIST_TEMPLATE = `<ng-container appTileListTileOutlet />`;

export const TILE_LIST_SELECTOR = 'app-tile-list';

export interface ITileListOptions<T> {
  // this not only allows setting the layoutFunction for all tile grids in the app
  // but we need it for Storybook because we can't use function as inputs in Storybook
  defaultLayoutFunction?: LayoutFunction<T>;
}

export const TILE_LIST_OPTIONS = new InjectionToken<ITileListOptions<any>>(
  'tileListOptions'
);

@Directive({
  selector: '[appTileListTileOutlet]',
  standalone: true,
})
export class TileListTileOutletDirective {
  public readonly viewContainer = inject(ViewContainerRef);
}

@Directive({
  selector: '[appTileListTileDef]',
  standalone: true,
})
export class TileListTileDefDirective {
  public readonly template = inject(TemplateRef);
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'app-tile-list-tile, [app-tile-list-tile]',
  standalone: true,
  host: {
    class: 'app-tile-list-tile',
    role: 'listitem',
  },
})
export class TileListTileDirective {}

@Component({
  selector: TILE_LIST_SELECTOR,
  standalone: true,
  imports: [TileListTileOutletDirective],
  template: TILE_LIST_TEMPLATE,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }
    `,
  ],
  host: {
    role: 'list',
  },
  // The "OnPush" status for the `TileListComponent` component is effectively a noop.
  // The view for `TileListComponent` consists entirely of templates declared in other views. As they are
  // declared elsewhere, they are checked when their declaration points are checked.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TileListComponent<T> implements OnDestroy {
  #changeDetectorRef = inject(ChangeDetectorRef);
  #elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  #options = inject(TILE_LIST_OPTIONS, { optional: true });

  private _tileOutlet = viewChild.required(TileListTileOutletDirective);

  private _tileDef = contentChild.required(TileListTileDefDirective);

  dataSource = input.required<TileListDataSourceInput<T>>();

  layoutFunction = input<LayoutFunction<T> | undefined>(
    this.#options?.defaultLayoutFunction
  );

  tileGap = input<number>(0);

  minTileSize = input<number>(200);

  #tiles = computed(() => {
    return this.#layoutTiles(
      this.dataSource(),
      this.layoutFunction(),
      this.tileGap(),
      this.minTileSize()
    );
  });

  constructor() {
    effect(() => {
      this.#renderTiles(this.#tiles());
    });
  }

  ngOnDestroy(): void {
    this._tileOutlet().viewContainer.clear();
  }

  #layoutTiles(
    dataSource: TileListDataSourceInput<T>,
    layoutFunction: LayoutFunction<T> | undefined,
    tileGap: number,
    minTileSize: number
  ) {
    if (!layoutFunction) {
      return [];
    }
    const layoutWidth = this.#elementRef.nativeElement.clientWidth;
    return layoutFunction(dataSource as T[], layoutWidth, tileGap, minTileSize)
      .tiles;
  }

  #renderTiles(tiles: TileDetails<T>[]) {
    tiles.forEach((tile) => {
      const { item, bounds } = tile;

      const view = this._tileOutlet().viewContainer.createEmbeddedView(
        this._tileDef().template,
        {
          $implicit: item,
        }
      );

      const element = view.rootNodes[0] as HTMLElement;

      // need to convert all the numeric values in tile.bounds
      // to a string of the value with 'px' appended
      const tileBounds = Object.entries(bounds).reduce(
        (accumulator, [key, value]) => {
          return { ...accumulator, [key]: value + 'px' };
        },
        {}
      );

      Object.assign(element.style, {
        position: 'absolute',
        ...tileBounds,
      });
    });

    this.#changeDetectorRef.markForCheck();
  }
}
