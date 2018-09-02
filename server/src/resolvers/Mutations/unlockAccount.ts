import Web3 from 'aion-web3'
import { unlock } from '../../services/aion'
import { MutationToUnlockAccountArgs } from '../../schema'

export const unlockAccount = {
  async unlockAccount(
    _: any,
    { web3Address, mainAccount, mainAccountPass }: MutationToUnlockAccountArgs
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
