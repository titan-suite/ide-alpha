import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import tcpPortUsed from 'tcp-port-used'
import Web3 from 'aion-web3'
import { genGraphQlProperties } from '@titan-suite/aion-to-graphql'

import { deploy } from '../../services/aion'
import { MutationToDeployContractArgs } from '../../schema'

let server: any = {}
const options = {
  port1: 4001,
  port2: 4002
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
      contractArguments,
      alreadyDeployed,
      abi,
      deployedContractAddress
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

      let deployedContract, compiledCode
      if (alreadyDeployed === false) {
        if (contract && contractName && mainAccountPass) {
          const res = await deploy({
            contract,
            contractName,
            mainAccountPass,
            web3,
            mainAccount: SELECTED_ACCOUNT,
            contractArguments,
            gas: GAS
          })
          deployedContract = res.deployedContract
          compiledCode = res.compiledCode
          console.log('Contract Deployed at ' + deployedContract.address)
          await verifyPortUnused(options.port1)
          await startTitanPlayground(
            deployedContract,
            web3,
            SELECTED_ACCOUNT,
            GAS,
            options.port1
          )
        } else {
          throw new Error('Invalid Arguments')
        }
      } else {
        let _abi = []
        try {
          if (!abi || !deployedContractAddress) {
            throw new Error('Invalid Arguments')
          }
          _abi = JSON.parse(abi)
        } catch (error) {
          throw new Error('Invalid ABI')
        }
        compiledCode = {}
        deployedContract = { abi: _abi, address: deployedContractAddress }
        console.log('Using Contract' + deployedContractAddress)
        await verifyPortUnused(options.port2)
        await startTitanPlayground(
          deployedContract,
          web3,
          SELECTED_ACCOUNT,
          GAS,
          options.port2
        )
      }

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

const verifyPortUnused = async (port: number) => {
  const inUse = await tcpPortUsed.check(port, '127.0.0.1')
  if (inUse) {
    server[port].close()
  }
}

const startTitanPlayground = async (
  deployedContract: { abi: any[]; address: string },
  web3: Web3,
  mainAccount: string,
  gas: number,
  port: number
) => {
  const { schema, rootValue } = await genGraphQlProperties({
    artifact: {
      abi: deployedContract.abi
    },
    contract: web3.eth
      .contract(deployedContract.abi)
      .at(deployedContract.address),
    mainAccount,
    gas
  })

  const app = express()
  const apolloServer = new ApolloServer({
    schema,
    rootValue
  })
  apolloServer.applyMiddleware({ app })
  server[port] = await app.listen(port)
  console.log(
    `Visit http://localhost:${port}/graphql to interact with contracts`
  )
}
