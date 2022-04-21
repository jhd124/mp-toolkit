import { setup } from "@mp-toolkit/chain"

const mpToolkit = setup<{eventDefine: {
  a: (n: number) => void
}}>({
  eventNames: ['a'],
  isDev: true
})

export const chain = mpToolkit.chain