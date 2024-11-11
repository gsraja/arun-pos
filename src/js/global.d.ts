import { Alpine as AlpineType } from 'alpinejs'
import Fuse  from 'fuse.js'


declare global {
  var Alpine: AlpineType;
  interface Window {
    Fuse: typeof Fuse;
  }
}