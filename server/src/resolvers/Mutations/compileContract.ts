import { web3CompileContract } from '../../services/aion'
import { MutationToCompileContractArgs } from '../../schema'
import Web3 from 'aion-web3'

export const compileContract = {
  async compileContract(
    _: any,
    { contract, web3Address }: MutationToCompileContractArgs
  ) {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(web3Address))
      const contracts = await web3CompileContract({
        contract,
        web3
      })
      return { data: JSON.stringify(contracts) }
    } catch (error) {
      throw error
    }
  }
}
