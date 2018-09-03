import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import * as React from 'react'

const DEPLOY_CONTRACT = gql`
  mutation DeployContract(
    $alreadyDeployed: Boolean!
    $contract: String!
    $contractName: String!
    $web3Address: String!
    $mainAccount: String!
    $mainAccountPass: String!
    $gas: Int
    $contractArguments: String
  ) {
    deployContract(
      alreadyDeployed: $alreadyDeployed
      contract: $contract
      contractName: $contractName
      web3Address: $web3Address
      mainAccount: $mainAccount
      gas: $gas
      mainAccountPass: $mainAccountPass
      contractArguments: $contractArguments
    ) {
      data
    }
  }
`
interface ContractArguments {
  contract?: string
  contractName?: string
  web3Address?: string
  mainAccount?: string
  mainAccountPass?: string
  gas?: number
  contractArguments?: string
  onDeploy: Function
  onError: Function
  onDeployed: Function
  isLoading: Boolean
}
const DeployContract: React.SFC<ContractArguments> = ({
  contract,
  contractName,
  web3Address,
  mainAccount,
  mainAccountPass,
  gas,
  contractArguments,
  onDeploy,
  onError,
  onDeployed,
  isLoading
}) => {
  return (
    <Mutation
      mutation={DEPLOY_CONTRACT}
      variables={{
        contract,
        contractName,
        web3Address,
        mainAccount,
        mainAccountPass,
        gas,
        contractArguments,
        alreadyDeployed: false
      }}
      onError={error => onError(error)}
      onCompleted={data => onDeployed(data)}
    >
      {(deployContract, { loading, error }) => (
        <Grid item sm={4} xs={4}>
          <Grid container justify={'center'} spacing={40}>
            {!isLoading && (
              <Button
                variant="raised"
                color="secondary"
                onClick={() => {
                  onDeploy('Deploy')
                  deployContract()
                }}
              >
                Deploy
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Mutation>
  )
}

export default DeployContract
