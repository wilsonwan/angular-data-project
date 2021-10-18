import { Component } from "@angular/core";
import { ProductsService } from "./products.service";
import { IProduct } from "../interfaces/product";

@Component({
  selector: "products-table",
  templateUrl: "products-grid.component.html",
  styleUrls: [],
  providers: [ProductsService]
})

export class ProductsGridComponent {
  products: IProduct[];

  constructor(private _service: ProductsService) { }

  ngOnInit() {
    this._service.getProducts().subscribe(products => this.products = products);
  }
}