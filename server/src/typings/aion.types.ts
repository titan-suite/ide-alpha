export interface Web3DeployContractArguments {
  mainAccount: string
  abi: object
  code: string
  web3: any
  gas: number
  contractArguments: string | null | undefined
}

export interface Web3CompileContractArguments {
  contract: string
  web3: any
}

export interface Unlock {
  mainAccount: string
  mainAccountPass: string
  web3: any
}

export interface Compile {
  contract: string
}
export interface Deploy {
  contract: string
  contractName: string
  mainAccount: string
  mainAccountPass: string
  gas: number
  web3: any
  contractArguments: string | null | undefined
}
