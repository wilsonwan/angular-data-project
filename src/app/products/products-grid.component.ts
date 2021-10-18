import { Component, Input, SimpleChanges } from "@angular/core";
import { ProductsService } from "./products.service";
import { IProduct } from "../interfaces/product";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";

@Component({
  selector: "products-table",
  templateUrl: "products-grid.component.html",
  styleUrls: [],
  providers: [ProductsService]
})

export class ProductsGridComponent {
  products: IProduct[];
  filteredProducts: IProduct[];
  sub!: Subscription;

  @Input() searchText: string;

  constructor(private _service: ProductsService) { }

  ngOnInit(): void {
    this.sub = this._service.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = this.products;
      }
    });
  }

  ngAfterViewInit() {
    // need a better target as document is too broad
    fromEvent(document, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(400)
      )
      .subscribe(() => {
        if (this.searchText.length >= 3) {
          this.filteredProducts = this.searchText ? this.performSearchFilter(this.searchText) : this.products;
        } else {
          this.filteredProducts = this.products;
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  performSearchFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();

    return this.products.filter((product: IProduct) =>
      product.description.toLocaleLowerCase().indexOf(filterBy) !== -1
        || product.brand.toLocaleLowerCase().indexOf(filterBy) !== -1
        || product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
}