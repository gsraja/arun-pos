interface Search {
    searchCategory : string,
    searchText: string,
}


document.addEventListener('alpine:init', () => {    
    //Alpine.store('products', products1);
    const options = { keys: ['name', 'tag'] }
    // Create the Fuse index
    const myIndex = window.Fuse.createIndex(options.keys, products1)
    // initialize Fuse with the index
    const fuse = new window.Fuse(products1, options, myIndex)
    

    function getProducts() : Product[] {
        return getProductService().getProducts();
    }

    Alpine.data('search', () => <Search> {
        searchCategory : '',
        searchText: '',
        setCategory(this: Search, category : string, depth: number) {
            var temp = this.searchCategory.split(":");
            temp.length = depth;
            temp.push(category);
            this.searchCategory = temp.join(":")
        },

        getCategories(this: Search, depth : number) : string[] {
            var baseCategory = ''
            if (depth != 0) {
              var k = this.searchCategory.split(":")
              k.length = depth;
              baseCategory = k.join(':')
            }
            return  getProducts()
                    .map(p => p.category)
                    .filter(c => c.startsWith(baseCategory))
                    .map(c => c.substring(baseCategory.length === 0? 0 : baseCategory.length + 1))
                    .map(c => c.substring(0, c.indexOf(":") == -1? c.length : c.indexOf(":")))
                    .filter(c => c.length > 0)
                    .filter((value, index, array) => array.indexOf(value) === index)
        },
        

        getDepth(this: Search) :  number {
            if (this.searchCategory === '') return 0;
            return this.searchCategory.split(":").length;
        },

        getFilteredProducts(this: Search) : Product[] {
            let products = getProducts();
            if (this.searchText != '') {
                products =  fuse.search(this.searchText).map(f => f.item)
            }
            return products.filter(p => p.category.startsWith(this.searchCategory));
        }

    });
});