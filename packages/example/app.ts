import '@mp-toolkit/chain';
import { chain } from './getChain';

chain()
  .app({
    onLaunch(){
      debugger
        setTimeout(() => { 
          console.log('this', this)
          this.$mpKit.eventBus.emit('a', 250, 's') 
        }, 2000)
        this.$mpKit.eventBus.emit('a', 250, 's') 
        console.log('this', 'onLaunch')
        this
    }
  })
  .subscribeEvents('a', function() {
    console.log('this', this)
    this.$mpKit
  })
  .create()


