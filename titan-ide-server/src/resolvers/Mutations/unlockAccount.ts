const Web3 = require('aion-web3')
const { unlock } = require('../../services/aion')
import { UnlockAccountMutationArgs } from '../../typings/types'

export const unlockAccount = {
  async unlockAccount(
    _: any,
    { web3Address, mainAccount, mainAccountPass }: UnlockAccountMutationArgs
  ) {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(web3Address))
      await unlock({
        web3,
        mainAccount,
        mainAccountPass
      })
      return true
    } catch (error) {
      throw error
    }
  }
}
