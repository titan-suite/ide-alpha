import {
  Web3DeployContractArguments,
  Web3CompileContractArguments,
  Unlock,
  Compile,
  Deploy
} from '../typings/aion.types'

export const compile: (contract: Compile) => Promise<any> = async contract => {
  console.info('Compiling...')
  const res = await require('solc').compile(contract, 1)
  return res
}

const web3CompileContract: (
  args: Web3CompileContractArguments
) => Promise<any> = async ({ contract, web3 }) => {
  return new Promise((resolve, reject) => {
    web3.eth.compile.solidity(contract, (err: any, res: any) => {
      if (err) {
        return reject(err)
      }
      if ('compile-error' in res) {
        return reject(res['compile-error'].error)
      }
      if (res) {
        return resolve(res)
      }
    })
  })
}

export const unlock: (args: Unlock) => Promise<any> = async ({
  mainAccount,
  mainAccountPass,
  web3
}) => {
  console.info('Unlocking...')
  return new Promise((resolve, reject) => {
    web3.personal.unlockAccount(
      mainAccount,
      mainAccountPass,
      999999,
      (err: any, isUnlocked: boolean) => {
        if (err) {
          reject(err)
        } else if (isUnlocked && isUnlocked === true) {
          resolve(isUnlocked)
        } else {
          reject('unlock failed')
        }
      }
    )
  })
}

const Web3DeployContract: (
  args: Web3DeployContractArguments
) => Promise<object> = async ({
  mainAccount,
  abi,
  code,
  web3,
  contractArguments,
  gas
}) => {
  console.info('Deploying...')
  return new Promise((resolve, reject) => {
    if (contractArguments && contractArguments.length > 0) {
      web3.eth.contract(abi).new(
        ...contractArguments.split(','),
        {
          from: mainAccount,
          data: code,
          gas
        },
        (err: any, contract: any) => {
          if (err) {
            reject(err)
          } else if (contract && contract.address) {
            resolve(contract)
          }
        }
      )
    } else {
      web3.eth.contract(abi).new(
        {
          from: mainAccount,
          data: code,
          gas
        },
        (err: any, contract: any) => {
          if (err) {
            reject(err)
          } else if (contract && contract.address) {
            resolve(contract)
          }
        }
      )
    }
  })
}

export const deploy: (args: Deploy) => object = async ({
  contract,
  contractName,
  mainAccount,
  mainAccountPass,
  web3,
  contractArguments,
  gas
}) => {
  const compiledCode = await web3CompileContract({ contract, web3 })
  await unlock({ mainAccount, mainAccountPass, web3 })
  const deployedContract = await Web3DeployContract({
    mainAccount,
    abi: compiledCode[contractName].info.abiDefinition,
    code: compiledCode[contractName].code,
    web3,
    contractArguments,
    gas
  })
  return {
    deployedContract,
    compiledCode
  }
}
