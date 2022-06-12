import { setup } from "@mp-toolkit/chain"

const initialState = {
  user: {
    name: '猫咪',
    avatar: '/images/cat-1.jpeg',
  }
}

const eventDefine = {
  event: (b: boolean) => { b }
}

const mpToolkit = setup({
  eventDefine,
  initialState,
  componentOptionInterceptor(option: any){
    console.log('option', option)
    return option
  },
  isDev: true
})

export const chain = mpToolkit.chain