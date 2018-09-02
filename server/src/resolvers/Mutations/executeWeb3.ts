import { MutationToExecuteWeb3Args } from '../../schema'
import Web3 from 'aion-web3'
let _web3Address = ''
let web3: any

const initWeb3 = async (web3Address: string) => {
  if (web3Address === _web3Address) {
    return
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(web3Address))
    _web3Address = web3Address
  }
}

export const executeWeb3 = {
  async executeWeb3(
    _: any,
    { web3Address, command }: MutationToExecuteWeb3Args
  ) {
    try {
      await initWeb3(web3Address)
      let res = await eval(command)
      if (res === undefined) {
        res = await web3[command]
      }
      return { data: JSON.stringify(res) }
    } catch (error) {
      throw error
    }
  }
}
