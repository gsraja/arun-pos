const productPageKey = "productPage"
interface ProductPage {
  products : Product[],
  loadItems(): void,
  saveItems(): void,
  export(): void,
  

  editIdx : number,
  editProduct: Product,
  editAmount: AmountText,


  // Editing !!
  showModal: boolean,

  edit(idx: number) : void,
  delete(idx: number): void,
  newProduct(): void,
  save():  void,
  cancel(): void,
  add() : void,
}

interface GetSet<T> {
  get() : T,
  set(val : T) : void,
}


class AmountText implements GetSet<string> {
  _p : Product;
  constructor(p : Product) {
    this._p =  p;
  }

  get(): string {
      return "" + this._p.price.Rupee;
  }

  set(val: string): void {
    val = val.trim();
    if (val === '') {
      this._p.price = Amount.from(0);
      return;
    }
 
    this._p.price = Amount.from(Number.parseInt(val));
  }
}


document.addEventListener('alpine:init', () => {
  Alpine.data(productPageKey, () => (<ProductPage>{
      products: getProductService().getProducts(),
      showModal: false,
      editIdx : -1,
      editProduct: <Product>{},
      editAmount : null,

      newProduct(this: ProductPage) {
        this.editIdx = -1;
        this.editProduct = {
          id: -1,
          name: '',
          printName: '',
          unit: '',
          price: Amount.from(0),
          category: '',
        };

        this.showModal = true;
      },

      save(this: ProductPage) {
        let isNew = this.editIdx == -1;
        if (isNew) {
          this.products.push(this.editProduct);
        } else {
          this.products.splice(this.editIdx, 1, this.editProduct);
        }
        this.showModal = false;
        this.saveItems();
      },

      edit(this: ProductPage, idx : number) {
        this.editIdx = idx;
        this.editProduct = getProductService().clone(this.products[idx]);
        this.editAmount = new AmountText(this.editProduct);
        this.showModal = true;
      },

      add(this: ProductPage) {
        this.editIdx = -1;
        this.editProduct = {
          id : 1000,
          name : '',
          printName: '',
          unit : '',
          price : new Amount(0),
          category : '',
        }
        this.editAmount = new AmountText(this.editProduct);
        this.showModal = true;
      },

      delete(this: ProductPage, idx: number) {
        this.products.splice(idx, 1);
        this.showModal = false;
        this.saveItems();
      },
      
      export() {
        const json = localStorage.getItem(localStorageProductKey);
        const blob = new Blob([json], {type: "application/json;charset=utf-8",});
        const a = document.createElement("a"),
        url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'products.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100); 
      },

      saveItems() {
        getProductService().setProducts(this.products);
      },
      loadItems(e: any) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = <string>e.target.result;
          localStorage.setItem(localStorageProductKey, contents);
          getProductService().setIsDirty();
        };
        reader.readAsText(file);
      },
      
  }));
});