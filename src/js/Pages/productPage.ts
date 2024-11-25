const productPageKey = "productPage"
interface ProductPage {
  products : Product[],
  loadItems(): void,
  saveItems(): void,
  export(): void,
  
  editIdx : number,
  editProduct: Product,
  editAmount: AmountText,

  // Category Editing !!
  getCategories(this: ProductPage, depth : number) : Category[],
  getDepth(this: ProductPage) :  number,
  newCategory(this: ProductPage) : void,


  // Editing !!
  showModal: boolean,

  edit(idx: number) : void,
  remove(this: ProductPage): void,
  save():  void,
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
      return `${this._p.price.Rupee}`;
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
  function createProduct() : Product {
    return {
      id : 0,
      name : '',
      printName: '',
      unit : '',
      price : new Amount(0),
      category : '',
    };
  }
  Alpine.data(productPageKey, () => (<ProductPage>{
      products: getProductService().getProducts(),
      showModal: false,
      editIdx : -1,
      editProduct: createProduct(),
      editAmount : null,

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
        this.editProduct = createProduct()
        this.editAmount = new AmountText(this.editProduct);
        this.showModal = true;
      },

    newCategory(this: ProductPage) { 
      const name = window.prompt("Category Name : ").trim().toUpperCase();
      let node = getProductSearchService().getCategories();
      const editCategory = this.editProduct.category == '' ? [] : this.editProduct.category.split(':');
      for (let k of editCategory) {
        node = node.children.get(k);
      }
      editCategory.push(name);
      const newCat = editCategory.join(':');
      node.children.set(name, {
        name: name,
        value: newCat,
        children: new Map(),
        items: [],
      }); 
      this.editProduct.category = newCat;
    },

    getCategories(this: ProductPage, depth : number) : Category[] {
        let node = getProductSearchService().getCategories();
        const editCategory = this.editProduct.category == '' ? [] : this.editProduct.category.split(':');
        if (depth > editCategory.length) return [];
        for (let i = 0; i < depth; i++) {
            node = node.children.get(editCategory[i]);
        }
        return Array.from(node.children.values()).sort((a, b) => a.name.localeCompare(b.name));
    },
    
    getDepth(this: ProductPage) :  number {
      if (this.editProduct.category == '') return 0;
      return this.editProduct.category.split(':').length;
    },

    remove(this: ProductPage) {
      let confirm  = window.confirm("Are you sure do you want to delete this product?");
      if (confirm) {
        this.products.splice(this.editIdx, 1);
        this.showModal = false;
        this.saveItems();
      }
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
        if (!file) {return;}
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