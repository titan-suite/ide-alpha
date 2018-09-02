import { compileContract } from './Mutations/compileContract'
import { unlockAccount } from './Mutations/unlockAccount'
import { deployContract } from './Mutations/deployContract'
import { executeWeb3 } from './Mutations/executeWeb3'
import { listAccounts } from './Queries/listAccounts'

export default {
  Query: {
    ...listAccounts
  },
  Mutation: {
    ...executeWeb3,
    ...compileContract,
    ...unlockAccount,
    ...deployContract
  }
} as any
