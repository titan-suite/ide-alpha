import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import tcpPortUsed from 'tcp-port-used'
import Web3 from 'aion-web3'
import { genGraphQlProperties } from '@titan-suite/aion-to-graphql'

import { deploy } from '../../services/aion'
import { MutationToDeployContractArgs } from '../../schema'

let server: any
const options = {
  port: 4001
}

export const deployContract = {
  async deployContract(
    _: any,
    {
      contract,
      contractName,
      web3Address,
      mainAccount,
      mainAccountPass,
      gas,
      contractArguments
    }: MutationToDeployContractArgs
  ) {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(web3Address))
      const _mainAccounts = (web3.personal &&
        web3.personal.listAccounts) as any[]
      const SELECTED_ACCOUNT: string = !mainAccount
        ? _mainAccounts[0]
        : mainAccount

      const GAS: number = !gas ? 1500000 : gas

      const { deployedContract, compiledCode }: any = await deploy({
        contract,
        contractName,
        mainAccountPass,
        web3,
        mainAccount: SELECTED_ACCOUNT,
        contractArguments,
        gas: GAS
      })
      console.log('Contract Deployed at ' + deployedContract.address)

      await verifyPortUnused()
      await setGlobals(SELECTED_ACCOUNT, GAS)
      await startTitanPlayground(deployedContract, web3)

      return {
        data: JSON.stringify({
          deployedContract,
          compiledCode
        })
      }
    } catch (error) {
      throw error
    }
  }
}

const verifyPortUnused = async () => {
  const inUse = await tcpPortUsed.check(options.port, '127.0.0.1')
  if (inUse) {
    server.close()
  }
}
const setGlobals = async (mainAccount: string, gas: number) => {
  let g: global
  g = global
  g.mainAccount = mainAccount
  g.gas = gas
}

const startTitanPlayground = async (deployedContract: any, web3: any) => {
  const { schema, rootValue } = await genGraphQlProperties({
    artifact: {
      abi: deployedContract.abi
    },
    contract: web3.eth
      .contract(deployedContract.abi)
      .at(deployedContract.address)
  })

  const app = express()
  const apolloServer = new ApolloServer({
    schema,
    rootValue
  })
  apolloServer.applyMiddleware({ app })
  server = await app.listen(options.port)
  console.log(
    `Visit http://localhost:${options.port}/graphql to interact with contracts`
  )
}
