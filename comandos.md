nx generate @nrwl/angular:app admi
ng serve ngshop
ng serve admin
ng g component pages/home-page --project=ngshop
nx g component shared/header --project-ngshop

npx nx g @nrwl/workspace:lib ui 

ng genereate @nrwl/angular:component --name=banner --project=ui --style=scss --prefix=ui --selector=banner


ng generate  @nrwl/angular:component --name=banner --project=ui --style=scss --export  --selector=banner --skip-import
ng generate @nrwl/angular:library --nameproducts --style=scss -no-interactive