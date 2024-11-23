interface Search {
    searchCategory : Array<string>,
    searchText: string,
}


document.addEventListener('alpine:init', () => {    

    function getCategories() : Category {
        return getProductSearchService().getCategories();
    }

    Alpine.data('search', () => <Search> {
        searchCategory : [],
        searchText: '',

        clearCategory(this: Search) {
            this.searchCategory.splice(0);
        },
        
        setCategory(this: Search, category : string, depth: number) {
            this.searchCategory.splice(depth, this.searchCategory.length - depth, category);
        },

        getCategories(this: Search, depth : number) : string[] {
            let node = getCategories();
            if (depth > this.searchCategory.length) return [];
            for (let i = 0; i < depth; i++) {
                node = node.children.get(this.searchCategory[i]);
            }
            return Array.from(node.children.keys()).sort();
        },
        
        getDepth(this: Search) :  number {
            return this.searchCategory.length;
        },

        getFilteredProducts(this: Search) : Product[] {
            if (this.searchText === '') {
                let node = getCategories();
                for (let key of this.searchCategory) {
                    node = node.children.get(key);
                }
                return node.items;
            }
            
            let products = getProductSearchService().fuzzySearch(this.searchText);
            const categoryPrefix = this.searchCategory.join(':');
            return products.filter(p => p.category.startsWith(categoryPrefix));
        }

    });
});