const productSearchServiceKey = "productSearchService";

interface Category {
    name : string,
    children : Map<string, Category>,
    items : Array<Product>,
}

interface ProductSearchService extends Dirtyable {
    rootCategory : Category,
    fuse : any,
    getCategories() : Category,
    fuzzySearch(searchText : string) : Product[],
}

function getProductSearchService() : ProductSearchService {
    return <ProductSearchService>Alpine.store(productSearchServiceKey);
}

document.addEventListener('alpine:init', () => {

    function initCategories(category : Category, depth : number) {
        let categoryMap = new Map<string, Array<Product>>();
        category.items
            .filter(item => item.category != '')
            .map(item => {return {item: item, category : item.category.split(':')}})
            .filter(itemCat => itemCat.category.length > depth)
            .forEach(itemCat => {
                let c = itemCat.category[depth];
                if (!categoryMap.has(c)) {
                    categoryMap.set(c, []);
                }
                categoryMap.get(c).push(itemCat.item);
            })
      
        categoryMap.forEach((value, key) => {
            let childCategory : Category = {
                name: key,
                children: new Map(),
                items: value,
            }
            category.children.set(key, childCategory);
            initCategories(childCategory, depth + 1);
        });
    }

    Alpine.store(productSearchServiceKey, <ProductSearchService>{
        rootCategory : null,
        fuse : null,
        
        getCategories(this: ProductSearchService) {
            if (this.isDirty()) {
                this.rootCategory = {
                    name : 'All',
                    children: new Map(),
                    items: getProductService().getProducts(),
                }

                initCategories(this.rootCategory, 0);
            }
            return this.rootCategory;
        },

        fuzzySearch(this: ProductSearchService, searchText : string) : Product[] {
            if (this.fuse == null) {
                const options = { keys: ['name', 'id'] };
                const products = getProductService().getProducts();
                const myIndex = window.Fuse.createIndex(options.keys, products);
                this.fuse = new window.Fuse(products, options, myIndex)
            }
            return this.fuse.search(searchText).map((f : any) => <Product>f.item);
        },

        isDirty() {
            return this.rootCategory === null;
        },

        setDirty() {
            this.rootCategory = null;
            this.fuse = null;
        },
    });


});