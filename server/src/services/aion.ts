import Web3 from 'aion-web3'

export const web3CompileContract = async ({
  contract,
  web3
}: {
  contract: string;
  web3: Web3;
}): Promise<object> => {
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

export const unlock = async ({
  mainAccount,
  mainAccountPass,
  web3
}: {
  mainAccount: string;
  mainAccountPass: string;
  web3: Web3;
}) => {
  console.info('Unlocking...')
  return new Promise((resolve, reject) => {
    web3.personal
      ? web3.personal.unlockAccount(
          mainAccount,
          mainAccountPass,
          999999,
          (err: any, isUnlocked: boolean) => {
            if (err) {
              return reject(err)
            } else if (isUnlocked && isUnlocked === true) {
              return resolve(isUnlocked)
            } else {
              return reject('unlock failed')
            }
          }
        )
      : reject('Invalid Web3')
  })
}

const Web3DeployContract = async ({
  mainAccount,
  abi,
  code,
  web3,
  contractArguments,
  gas
}: {
  mainAccount: string;
  abi: [];
  code: string;
  web3: Web3;
  gas: number;
  contractArguments: string | null | undefined;
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

export const deploy = async ({
  contract,
  contractName,
  mainAccount,
  mainAccountPass,
  web3,
  contractArguments,
  gas
}: {
  contract: string;
  contractName: string;
  mainAccount: string;
  mainAccountPass: string;
  gas: number;
  web3: Web3;
  contractArguments: string | null | undefined;
}) => {
  const compiledCode: { [key: string]: any } = await web3CompileContract({
    contract,
    web3
  })
  await unlock({ mainAccount, mainAccountPass, web3 })
  let deployedContract

  try {
    if (contractName in compiledCode) {
      deployedContract = await Web3DeployContract({
        mainAccount,
        abi: compiledCode[contractName].info.abiDefinition,
        code: compiledCode[contractName].code,
        web3,
        contractArguments,
        gas
      })
    } else {
      throw new Error(`Contract "${contractName}" not found`)
    }
  } catch (e) {
    throw e
  }
  return {
    deployedContract,
    compiledCode
  }
}
