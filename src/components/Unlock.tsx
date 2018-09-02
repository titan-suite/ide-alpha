import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import * as React from 'react'

const UNLOCK_ACCOUNT = gql`
  mutation UnlockAccount(
    $web3Address: String!
    $mainAccount: String!
    $mainAccountPass: String!
  ) {
    unlockAccount(
      web3Address: $web3Address
      mainAccount: $mainAccount
      mainAccountPass: $mainAccountPass
    )
  }
`
interface UnlockArguments {
  web3Address?: string
  mainAccount?: string
  mainAccountPass?: string
  onUnlock: Function
  onError: Function
  onUnlocked: Function
  isLoading: Boolean
}
const UnlockAccount: React.SFC<UnlockArguments> = ({
  web3Address,
  mainAccount,
  mainAccountPass,
  onUnlock,
  onError,
  onUnlocked,
  isLoading
}) => {
  return (
    <Mutation
      mutation={UNLOCK_ACCOUNT}
      variables={{
        web3Address,
        mainAccount,
        mainAccountPass
      }}
      onError={error => onError(error)}
      onCompleted={data => onUnlocked(data)}
    >
      {(unlockAccount, { loading, error }) => (
        <Grid item sm={4} xs={4}>
          <Grid container justify={'center'} spacing={40}>
            {!isLoading && (
              <Button
                variant="raised"
                color="secondary"
                onClick={() => {
                  onUnlock()
                  unlockAccount()
                }}
              >
                Unlock
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Mutation>
  )
}

export default UnlockAccount
