import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import withStyles, {
  WithStyles,
  StyleRulesCallback
} from '@material-ui/core/styles/withStyles'
const styles: StyleRulesCallback<'root'> = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%'
  },
  input: {
    color: '#FFAB00'
  },
  label: {
    color: '#d4d4d4'
  },
  button: {
    marginBottom: theme.spacing.unit * 2
  },
  panel: {
    backgroundColor: '#1e1e1e',
    color: '#FFAB00',
    boxShadow: '0 2px 5px 1px rgba(255, 105, 135, .3)'
  }
})
const DEPLOY_CONTRACT = gql`
  mutation DeployContract(
    $alreadyDeployed: Boolean!
    $abi: String!
    $deployedContractAddress: String!
    $web3Address: String!
    $mainAccount: String!
    $gas: Int
  ) {
    deployContract(
      alreadyDeployed: $alreadyDeployed
      abi: $abi
      deployedContractAddress: $deployedContractAddress
      web3Address: $web3Address
      mainAccount: $mainAccount
      gas: $gas
    ) {
      data
    }
  }
`
interface Props extends WithStyles<'root'> {
  web3Address?: string
  mainAccount?: string
  gas?: number
  onDeploy: Function
  onError: Function
  onDeployed: Function
  isLoading: Boolean
}
interface State {
  abi: any[]
  deployedContractAddress: string
}
class AlreadyDeployed extends React.Component<Props, State> {
  state = {
    abi: [],
    deployedContractAddress: ''
  }
  handleInputChange = (name: string) => (event: any) => {
    this.setState({
      [name]: event.target.value
    } as any)
  }
  render() {
    const {
      onError,
      onDeployed,
      isLoading,
      onDeploy,
      web3Address,
      mainAccount,
      gas
    } = this.props
    const { abi, deployedContractAddress } = this.state
    const classes: any = this.props.classes
    return (
      <Mutation
        mutation={DEPLOY_CONTRACT}
        onError={error => onError(error)}
        onCompleted={data => onDeployed(data)}
      >
        {(deployContract, { loading, error }) => (
          <Grid item sm={12} xs={12} className={classes.root}>
            <ExpansionPanel className={classes.panel}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className={classes.input} />}
              >
                <Typography className={classes.input}>
                  Already Deployed Contract ?
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container justify={'center'} spacing={40}>
                  <Grid item sm={12} xs={12}>
                    <TextField
                      label={'Abi'}
                      onChange={this.handleInputChange('abi')}
                      placeholder={'[]'}
                      margin="normal"
                      className={classes.textField}
                      value={this.state.abi}
                      InputProps={{
                        className: classes.input
                      }}
                      InputLabelProps={{
                        className: classes.label
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <TextField
                      label={'Deployed Contract Address'}
                      onChange={this.handleInputChange(
                        'deployedContractAddress'
                      )}
                      value={this.state.deployedContractAddress}
                      className={classes.textField}
                      margin="normal"
                      InputProps={{
                        className: classes.input
                      }}
                      InputLabelProps={{
                        className: classes.label
                      }}
                    />
                  </Grid>
                  {!isLoading && (
                    <Button
                      variant="raised"
                      color="secondary"
                      className={classes.button}
                      onClick={() => {
                        onDeploy()
                        deployContract({
                          variables: {
                            alreadyDeployed: true,
                            abi,
                            deployedContractAddress,
                            web3Address,
                            mainAccount,
                            gas
                          }
                        })
                      }}
                    >
                      Enable Playground
                    </Button>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        )}
      </Mutation>
    )
  }
}
export default withStyles(styles)(AlreadyDeployed)
