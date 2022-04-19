import { setup } from "@mp-toolkit/chain"

export const chain = setup<{eventDefine: {
  a: (n: number) => void
}}>({
  eventNames: ['a']
})