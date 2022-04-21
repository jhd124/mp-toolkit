import '@mp-toolkit/chain';
import { chain } from './getChain';

chain().app({
  onLaunch(){
      setTimeout(() => { 
        this.$mpKit.eventBus.emit('a', 250) 
      }, 2000)
  }
}).create()