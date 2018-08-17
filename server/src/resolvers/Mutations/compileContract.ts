const { compile } = require('../../services/aion')
import { CompileContractMutationArgs } from '../../typings/types'

export const compileContract = {
  async compileContract(_: any, { contract }: CompileContractMutationArgs) {
    try {
      const { contracts } = await compile(contract)
      return { data: JSON.stringify(contracts) }
    } catch (error) {
      throw error
    }
  }
}
