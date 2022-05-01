import { setup } from "@mp-toolkit/chain"

const mpToolkit = setup<{eventDefine: {
  a: (n: number) => void
}}>({
  eventNames: ['a'],
  isDev: true
})
console.log('mpToolkit', mpToolkit)
export const chain = mpToolkit.chain