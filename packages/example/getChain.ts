import { setup } from "@mp-toolkit/chain"
console.log('setup', setup)
export const chain = setup<{eventDefine: {
  a: (n: number) => void
}}>({
  eventNames: ['a']
})