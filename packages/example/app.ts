import '@mp-toolkit/chain';
import { chain } from './setup-mp-toolkit';

chain()
  .app({
    onLaunch(e){
      console.log('onLaunch ', e)
    }
  })
  .create()


