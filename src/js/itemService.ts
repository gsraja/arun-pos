interface ItemService {
  products : Product[],
  saveItems(): void,
  loadItems(): void,
}


document.addEventListener('alpine:init', () => {
  Alpine.data('itemService', () => (<ItemService>{
      products: products1,
      saveItems() {
        const json = JSON.stringify(products1, null, 2);
        const blob = new Blob([json], {type: "application/json;charset=utf-8",});
        const a = document.createElement("a"),
        url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'products.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100); 
      },
      loadItems(e: any) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = <string>e.target.result;
          JSON.parse(contents, (key, value) => {
            if (key == 'price') {
              return new Amount(value.paise_value)
            }
            return value;
          })
        };
        reader.readAsText(file);
      },
  }));
});