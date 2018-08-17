const Web3 = require('aion-web3')
import { ListAccountsQueryArgs } from '../../typings/types'
import { promisify } from 'bluebird'

export const listAccounts = {
  listAccounts: async (_: any, { web3Address }: ListAccountsQueryArgs) => {
    try {
      const { web3, accounts } = await getAccounts(web3Address)
      const mainAccounts =
        Array.isArray(accounts) &&
        accounts.map((account: string) => {
          return {
            account,
            balance: Number(
              web3.fromWei(web3.eth.getBalance(account), 'ether')
            ).toFixed(2)
          }
        })
      return {
        data: JSON.stringify(mainAccounts)
      }
    } catch (error) {
      error = `Couldn't connect to ${web3Address}`
      throw new Error(error)
    }
  }
}

const getAccounts = async (web3Address: string) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(web3Address))
  const accounts = await promisify(web3.eth.getAccounts, {
    context: web3.eth
  })()
  return {
    web3,
    accounts
  }
}
