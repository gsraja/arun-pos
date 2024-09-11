interface BtDevice {
  server: BluetoothRemoteGATTServer,
  connect() : void,
  print(buffers: Uint8Array[]) : void,
}

document.addEventListener('alpine:init', () => {
    const service_uuid = 'e7810a71-73ae-499d-8c15-faa9aef0c3f2'
    const characteristic_uuid = 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'

    Alpine.data('printer', () => <BtDevice> {
      server: null,
      async connect(this: BtDevice) {
        if (this.server != null && this.server.connected) {return}
        
        this.server = await navigator.bluetooth.requestDevice(
          {filters: [{namePrefix: 'Printer'}], 
          optionalServices : [service_uuid]}
        ).then(dev => dev.gatt.connect())
      },
      async print(this: BtDevice, buffers: Uint8Array[]) {
        await this.connect();
        let service = await this.server.getPrimaryService(service_uuid);
        let characteristic = await service.getCharacteristic(characteristic_uuid);
        const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

        for (let buf of buffers) {
          await characteristic.writeValue(buf);
          await delay(512)
        }
      },

      async printCart(this: BtDevice, cart : Cart) {
        let p = new Printer();
        p.newLine(5); 
        p.align = 1;
        p.setFont(0, true, true, true, false);
        p.println("ARUNN CRACKERS");
        p.setFont(1, true, false, false, false);
        p.println("ESTIMATE BILL")
        p.font = 0;
        p.newLine(3)

        /*
        // split 31 - 14
        p.tabs = [0, 31];
        /// DATE 
        const today = new Date();
        const yy = today.getFullYear() - 2000;
        const mm = today.getMonth() + 1; // Months start at 0!
        const dd = today.getDate();
        const formattedToday = dd.toString().padStart(2, '0') + '/' + mm.toString().padStart(2, '0') + '/' + yy;

        const hh = today.getHours();
        const min = today.getMinutes();
        const formattedTime = hh.toString().padStart(2, '0') + ':' + min.toString().padStart(2, '0');
        ///

        p.printRow(' ', `DATE: ${formattedToday}`)
        p.printRow(`BILL NO: ${cart.id}`, `TIME: ${formattedTime}`)
        */
        // split id 3-18-4-7-8
        
        p.println('-'.repeat(45))
        p.tabs = [0, 22, 30, 37]
        p.printRow('ITEM NAME', 'QTY', 'PRICE', 'AMOUNT')
        p.println('-'.repeat(45))
        p.tabs = [0, 4, -22, -30, -37]
        for (let item of cart.items) {
           p.printRow(item.product.id.toString(), item.product.printName, item.quantity + 'Pk', item.price.toString(), item.total.toString())
        }
        p.println('-'.repeat(45))
        p.tabs = [0, -30]
        p.printRow(`TOTAL ITEM(S): ${cart.items.length} / QTY: ${cart.totalQuantity}`, `${cart.total}`)
        p.printRow(`DISCOUNT AMOUNT @ ${cart.discount.toFixed(2)} %`, `${cart.total.multiply(cart.discount/100)}`)
        p.println('-'.repeat(45))
        p.setFont(0, true)
        p.printRow('TOTAL', `${cart.total.multiply(1 - (cart.discount/100)).roundPaise().toString()}`)
        p.println('-'.repeat(45))
        p.newLine(5);
        p.cut();
        p.newLine(5);
        this.print(p.toBuffers())
      }


    });
});