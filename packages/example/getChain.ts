import { setup } from "@mp-toolkit/chain"

const initialState = {
  userInfo: {
    name: 'Tony',
    gender: 'male'
  }
}

const eventDefine = {
  a: (n: number, s: string) => {n;s}
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