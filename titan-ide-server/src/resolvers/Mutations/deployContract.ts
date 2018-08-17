const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const { genGraphQlProperties } = require('@titan-suite/aion-to-graphql')
const tcpPortUsed = require('tcp-port-used')
const Web3 = require('aion-web3')

import { deploy } from '../../services/aion'
import { DeployContractMutationArgs } from '../../typings/types'

let server: any
const PORT = 4001

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
    }: DeployContractMutationArgs
  ) {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(web3Address))

      const SELECTED_ACCOUNT: string = !mainAccount
        ? web3.personal.listAccounts[0]
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
      await saveGasAndAccountGlobally(SELECTED_ACCOUNT, GAS)
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
  const inUse = await tcpPortUsed.check(PORT, '127.0.0.1')
  if (inUse) {
    server.close()
  }
}
const saveGasAndAccountGlobally = async (mainAccount: string, gas: number) => {
  interface Global {
    [key: string]: any
  }
  let g: Global
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
  server = app.listen(PORT, () => {
    console.log(
      `Visit http://localhost:${PORT}/graphql to interact with contracts`
    )
  })
}
