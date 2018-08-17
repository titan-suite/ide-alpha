const { compileContract } = require('./Mutations/compileContract')
const { unlockAccount } = require('./Mutations/unlockAccount')
const { deployContract } = require('./Mutations/deployContract')
const { listAccounts } = require('./Queries/listAccounts')

export default {
  Query: {
    ...listAccounts
  },
  Mutation: {
    ...compileContract,
    ...unlockAccount,
    ...deployContract
  }
}
