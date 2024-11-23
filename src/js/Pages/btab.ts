interface Tab {
    tabs : Array<TabObj>,
    activeTab: number;
}

interface TabObj {
    id : number;
    name: number;
}

document.addEventListener('alpine:init', () => {
    Alpine.data('tabnav', () => (<Tab>{
        tabs:[{id: Date.now(), name: 1}],
        activeTab: -1,
        selectTab(this: Tab, idx : number){this.activeTab = idx},
        newTab(this: Tab) {
            const maxIdCount = this.tabs.map(k => k.name).reduce((a,b) => Math.max(a,b), 0);
            this.tabs.push({name: maxIdCount + 1, id: Date.now()});
            this.activeTab = this.tabs.length - 1;
        },
        removeActiveTab(this: Tab) {
            if (this.tabs.length == 1) {
                this.tabs.splice(0, 1, {id: Date.now(), name: 1});
            } else {
                const idx = this.activeTab;
                if (this.activeTab == this.tabs.length - 1) {
                    this.activeTab--;
                }
                this.tabs.splice(idx, 1);
            }
        }
    }));
  });