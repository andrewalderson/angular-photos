import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChild,
  Directive,
  effect,
  inject,
  input,
  OnDestroy,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

export type TileListDataSourceInput<T> = readonly T[];

export const TILE_LIST_TEMPLATE = `<ng-container appTileListTileOutlet />`;

export const TILE_LIST_SELECTOR = 'app-tile-list';

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

  private _tileOutlet = viewChild.required(TileListTileOutletDirective);

  private _tileDef = contentChild.required(TileListTileDefDirective);

  dataSource = input.required<TileListDataSourceInput<T>>();

  constructor() {
    // update tiles when data changes
    effect(() => this.#renderTiles(this.dataSource()));
  }

  ngOnDestroy(): void {
    this._tileOutlet().viewContainer.clear();
  }

  #renderTiles(dataSource: TileListDataSourceInput<T>) {
    const viewContainer = this._tileOutlet().viewContainer;
    dataSource.forEach((item) => {
      viewContainer.createEmbeddedView(this._tileDef().template, {
        $implicit: item,
      });
    });

    this.#changeDetectorRef.markForCheck();
  }
}
