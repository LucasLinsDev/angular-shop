import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'bluebits-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [],
})
export class CategoriesFormComponent implements OnInit {
  form:any

  isSubmited:boolean=false;
constructor(private formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.form=this.formBuilder.group({
      name:['',Validators.required],
      icon:['',Validators.required],

    })
  }

  onSubmit(){
    this.isSubmited=true;
    if(this.form.invalid){
      return;
    }
    console.log('I am the button');
    console.log(this.categoryForm.name.value);
    console.log(this.categoryForm.icon.value);
  }
  get categoryForm(){
    return this.form.controls;
  }
}
