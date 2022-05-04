import { setup } from "@mp-toolkit/chain"

const initialState = {
  userInfo: {
    name: 'Tony',
    gender: 'male'
  }
}

const mpToolkit = setup<{
    a: (n: number) => void
    b: (s: string) => void
  }, typeof initialState>({
  eventNames: ['a'],
  initialState,
  isDev: true
})
console.log('mpToolkit', mpToolkit)
export const chain = mpToolkit.chain