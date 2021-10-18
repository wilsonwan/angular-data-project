import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductsService } from "./products/products.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [ProductsService]
})

export class AppComponent {
  title = "ir-dev-test";
  searchText: string;
  selectedBrand: string;
  brands: string[] = [];
  sub!: Subscription;

  constructor(private _service: ProductsService) { }

  ngOnInit(): void {
    this.sub = this._service.getProducts().subscribe({
      next: products => {
        this.brands.push("");

        products.forEach((element) => {
          if (this.brands.indexOf(element.brand) === -1){
            this.brands.push(element.brand);
          }
        })
      }
    });
  }
}
