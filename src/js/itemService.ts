interface ItemService {
  products : Product[],
  saveItems(): void,
  loadItems(): void,
}


document.addEventListener('alpine:init', () => {
  Alpine.data('itemService', () => (<ItemService>{
      saveItems() {
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
      loadItems(e: any) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = <string>e.target.result;
          localStorage.setItem(localStorageProductKey, contents);
        };
        reader.readAsText(file);
      },
  }));
});