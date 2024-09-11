  const LF = 0x0a;
  const FS = 0x1c;
  const FF = 0x0c; // Form FEED
  const GS = 0x1d; 
  const DLE = 0x10;
  const EOT = 0x04;
  const NUL = 0x00;
  const ESC = 0x1b;
  const TAB = 0x74;
  const EOL = 0x0a;
  const CR = 0x0d;
  

class Printer {
  out : string
  results : Array<Array<number>> = [[ESC, 0x40]]

  push(...vals : number[]) {
    let last = this.results.at(-1);
    if (last.length + vals.length > 512) {
      this.results.push([]);
      last = this.results.at(-1);
    }
    last.push(...vals);
  }


  _tabs : number[]  = [];
  set tabs(tbs: number[]) {
    this._tabs = tbs;
  }

  printRow(...row: string[]) {
    if (row.length != (this._tabs.length)) {
      console.log("ERROR");
    }
    let output = '';
    for(let i = 0; i < this._tabs.length; i++) {
      let t = this._tabs[i];
      let rightAlign = Object.is(t, -0)  ||  t < 0;
      t = Math.abs(t);

      const str =  row[i];
      
      const isLast = (i == this._tabs.length - 1)
      const next = Math.abs(isLast ? 46 : this._tabs[i+1]);
      const len = next - t - 1;
      if (str.length > len) {
        output += str.substring(0, len);
      } else if (rightAlign) {
        output += str.padStart(len, ' ');
      } else {
        output += str.padEnd(len, ' ');
      }
    }
    this.println(output);
  }

  print(str: string) {
    this.out += str;
    for (let i = 0; i < str.length; i++) {
      this.push(str.charCodeAt(i))
    }
  }

  newLine(n : number = 1) {
    this.printAndFeed(n);
  }

  println(str: string) {
    this.print(str);
    this.printAndFeed(1);
  }

  set align(n : 0 | 1 | 2) {
    this.push(ESC, 0x61, n);
  }

  _font : number = 0;
  set font(n : number) {
    this._font = n;
    this.push(ESC, 0x21, n);
  }

  get font() {
    return this._font;
  }


  setFont(fn : 0 | 1 = 0, bold : boolean = false, dh: boolean = false, dw : boolean = false,  underline : boolean = false) {
    var n = 0;
    n |= fn;
    if (bold) n |= 8;
    if (dh) n |= 16;
    if (dw) n |= 32;
    if (underline) n |= 128;
    this.font = n;
  }

  printAndFeed(n : number) {
    this.out += '\n'.repeat(n);
    this.push(ESC, 0x4A, n);
  }

  cut() {
    this.push(ESC, 0x69)
  }

  toBuffers() : Uint8Array[] {
    return this.results.map(r => new Uint8Array(r));
  }


}
  