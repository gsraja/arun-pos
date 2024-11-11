interface EditItem {
    getProducts() : Product[],
    saveItems(): void,
    loadItems(): void,
}

document.addEventListener('alpine:init', () => {    
    function getItemService() : ItemService {
        return <ItemService>Alpine.store('itemService');
    }


    Alpine.data('edit_item', () => <EditItem>{
        getProducts() : Product[] {
             return <Product[]>Alpine.store('products');
        },

        saveItems() {
            
        },

        loadItems() {
            
        },
    });


    
});