import { Component, Input, SimpleChanges } from "@angular/core";
import { ProductsService } from "./products.service";
import { IProduct } from "../interfaces/product";
import { Subscription } from "rxjs";

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

  ngOnChanges(changes: SimpleChanges) {
    if (this.searchText.length >= 3) {
      this.filteredProducts = this.searchText ? this.performSearchFilter(this.searchText) : this.products;
    } else {
      this.filteredProducts = this.products;
    }
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