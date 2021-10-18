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
  @Input() selectedBrand: string;
  @Input() selectedStockOption: string;

  constructor(private _service: ProductsService) { }

  ngOnInit(): void {
    this.sub = this._service.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = this.products;
      }
    });
  }

  ngAfterViewInit(): void {
    fromEvent(document.getElementById('search'), 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(400)
      )
      .subscribe(() => {
        console.log(this.searchText);

        this.filteredProducts = this.performFilter();
      });

    fromEvent(document.getElementById('brands'), 'change')
      .subscribe(() => {
        console.log(this.selectedBrand);

        this.filteredProducts = this.performFilter();
    })

    fromEvent(document.getElementById('stockOption'), 'change')
    .subscribe(() => {
      console.log(this.selectedStockOption);

      this.filteredProducts = this.performFilter();
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  performFilter(): IProduct[] {
    return this.intersectProductArrays(
      !!this.searchText ? this.performSearchFilter(this.searchText) : this.products,
      !!this.selectedBrand ? this.performDropdownFilter(this.selectedBrand) : this.products,
      !!this.selectedStockOption ? this.performStockOptionFilter(this.selectedStockOption): this.products);
  }

  performStockOptionFilter(filterBy: string): IProduct[] {
    switch(filterBy) {
      case "all": {
        return this.filteredProducts = this.products;
      }
      case "in-stock": {
        return this.filteredProducts = this.products.filter(product => product.quantity > 0);
      }
      case "out-of-stock": {
        return this.filteredProducts = this.products.filter(product => product.quantity == 0);
      }
    }
  }

  performDropdownFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();

    if (filterBy == "") {
      this.filteredProducts = this.products;
    } else {
      return this.products.filter((product: IProduct) =>
        product.brand.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }
  }

  performSearchFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();

    if (filterBy.length >= 3) {
      return this.products.filter((product: IProduct) =>
      product.description.toLocaleLowerCase().indexOf(filterBy) !== -1
        || product.brand.toLocaleLowerCase().indexOf(filterBy) !== -1
        || product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    } else {
      return this.filteredProducts = this.products;
    }
  }

  intersectProductArrays(searchTextResults: IProduct[], brandResult: IProduct[], stockOptionResult: IProduct[]): IProduct[]{
    let result: IProduct[];

    const data = [searchTextResults, brandResult, stockOptionResult];

    result = data.reduce((a, b) => a.filter(c => b.includes(c)));

    console.log(result);

    return this.filteredProducts = result;
  }
}