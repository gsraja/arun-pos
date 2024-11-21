const productServiceKey = "productService";
const localStorageProductKey = "products";
interface ProductService {
    _products: Product[],
    getProducts() : Product[],
    setProducts(products : Product[]) : void,
    setIsDirty() : void,
    toJson(product: Product) : string,
    fromJson(product: string) : Product,
    clone(product: Product) : Product,
}

function getProductService() : ProductService {
    return <ProductService>Alpine.store(productServiceKey);
}

document.addEventListener('alpine:init', () => {
    Alpine.store(productServiceKey, <ProductService>{
        _products : null,
        getProducts(this: ProductService) : Product[] {
            if (this._products == null) {
                let productsJson = localStorage.getItem(localStorageProductKey);
                if (productsJson !== null) {
                    this._products =  JSON.parse(productsJson, (key, value) => {
                        if (key == 'price') {
                          return new Amount(value.paise_value)
                        }
                        return value;
                      })
                } else {
                    this._products = [];
                }
            }
            return this._products;
        },

        setProducts(this: ProductService, products : Product[]) : void {
            this.setIsDirty();
            localStorage.setItem(localStorageProductKey, JSON.stringify(products));
        },

        setIsDirty(this: ProductService) {
            this._products = null;
        },

        toJson(product : Product) : string {
            return JSON.stringify(product);
        },

        fromJson(productJson : string) : Product {
            return JSON.parse(productJson, (key, value) => {
                if (key == 'price') {
                  return new Amount(value.paise_value)
                }
                return value;
              });
        },

        clone(product : Product) : Product {
            return this.fromJson(this.toJson(product));
        },


    });
});