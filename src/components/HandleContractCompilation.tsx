import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import * as React from 'react'

const COMPILE_CONTRACT = gql`
  mutation CompileContract($contract: String!) {
    compileContract(contract: $contract) {
      data
    }
  }
`
interface ContractArguments {
  contract?: string
  onCompile: Function
  onError: Function
  onCompiled: Function
  isLoading: Boolean
}
const CompileContract: React.SFC<ContractArguments> = ({
  contract,
  onCompile,
  onError,
  onCompiled,
  isLoading
}) => {
  return (
    <Mutation
      mutation={COMPILE_CONTRACT}
      variables={{
        contract
      }}
      onError={(error) => onError(error)}
      onCompleted={(data) => onCompiled(data)}
    >
      {(compileContract, { loading, error }) => (
        <Grid item sm={4} xs={4}>
          <Grid container justify={'center'} spacing={40}>
            {!isLoading && (
              <Button
                variant="raised"
                color="secondary"
                onClick={() => {
                  onCompile()
                  compileContract()
                }}
              >
                Compile
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Mutation>
  )
}

export default CompileContract
