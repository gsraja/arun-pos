interface ItemService {
  products : Product[],
  saveItems(): void,
  loadItem(): void,
}


document.addEventListener('alpine:init', () => {
  Alpine.data('itemService', () => (<ItemService>{
      products: products1,
      saveItems() {
        const blob = new Blob(["This is a sample file content."], {type: "text/plain;charset=utf-8",});
        const a = document.createElement("a"),
        url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'hello.txt';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100); 
      },
      loadItem() {
        
      },
  }));
});