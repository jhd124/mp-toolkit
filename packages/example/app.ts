import '@mp-toolkit/chain';
import { chain } from './getChain';

chain()
  .app({
    onLaunch(){
      setTimeout(() => { 
        console.log('this', this)
        this.$mpKit.eventBus.emit('a', 250, 's') 
      }, 2000)
    }
  })
  .subscribeEvents('a', function(a){
    a
  })
  .subscribeEvents('a', function() {
    this.$mpKit
  })
  .create()


