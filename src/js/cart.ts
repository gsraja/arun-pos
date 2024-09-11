interface Cart {
    id: string
    items: Array<CartItem>
    itemMap : Map<Product, CartItem>,
    getItem(product : Product) : CartItem | undefined,
    discount: number,
    get total() : Amount,
    get totalQuantity() : number,
}
 
interface CartItem {
    product: Product,
    price : Amount,
    quantity: number,
    get total() : Amount,
}


document.addEventListener('alpine:init', () => {
    Alpine.data('cart', () => <Cart> {
        id: '1',
        items: [],
        discount: 55,
        itemMap : new Map<Product, CartItem>(),
        
        getItem(this: Cart, product: Product) {
            return this.itemMap.get(product);
        },
        getItemCount(this: Cart, product: Product) {
            return this.getItem(product)?.quantity ?? 0;
        },
        add(this: Cart, product: Product) {
            const p = this.getItem(product);
            if (p == undefined) {
                var item : CartItem = {
                    product: product,
                    price: product.price,
                    quantity: 1,
                    get total() {
                        return (<CartItem>this).price.multiply((<CartItem>this).quantity);
                    }
                }
                this.items.push(item);
                this.itemMap.set(product, item);
            } else {
                p.quantity++;
            } 
        },
        remove(this: Cart, product: Product){
            const item = this.getItem(product);
            if (!(--item.quantity)) {
                const idx = this.items.findIndex(it => it.product == product)
                this.items.splice(idx, 1);
                this.itemMap.delete(product);
            }
        },
        get total() {
            return (<Cart>this).items.map(p => p.total).reduce((p1, p2) => p1.add(p2), Amount.from(0));
        },
        get totalQuantity() {
            return (<Cart>this).items.map(p => p.quantity).reduce((a, b) => a + b, 0);
        }
    });
});