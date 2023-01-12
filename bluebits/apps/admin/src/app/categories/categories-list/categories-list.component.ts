import { Component,OnInit } from '@angular/core';
import { CategoriesService, Category } from '@bluebits/product';

@Component({
  selector: 'bluebits-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];


  constructor(private categorieServices:CategoriesService){}

  ngOnInit():void{

    this.categorieServices.getCategories().subscribe((cats)=>{
      this.categories=cats;
      console.log(this.categories)
    });



  }
}


