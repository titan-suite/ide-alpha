import * as React from 'react'
import TitanLogo from '../static/titanLogo.svg'
import '../css/index.css'
import { ApolloConsumer } from 'react-apollo'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Select from '@material-ui/core/Select'
import Snackbar from '@material-ui/core/Snackbar'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import gql from 'graphql-tag'
import Notification from '../components/Notification'
import ReactTerminal from '../components/ReactTerminal'
import * as ReactGA from 'react-ga'
ReactGA.initialize('UA-123181437-1')
ReactGA.pageview(window.location.pathname + window.location.search)

import withStyles, {
  WithStyles,
  StyleRulesCallback
} from '@material-ui/core/styles/withStyles'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Info from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'

import MonacoEditor from 'react-monaco-editor'
import ReactJson from 'react-json-view'
import withRoot from '../withRoot'
import CompileContractButton from '../components/HandleContractCompilation'
import UnlockAccountButton from '../components/HandleAccountUnlock'
import DeployContractButton from '../components/HandleContractDeployment'
import Linting from '../components/HandleContractLinting'
import InfoModel from '../components/InfoModal'
const styles: StyleRulesCallback<'root'> = theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing.unit * 2
  },
  customPadding: {
    paddingRight: theme.spacing.unit * 1,
    paddingLeft: theme.spacing.unit * 1
  },
  avatar: {
    width: 50,
    height: 50,
    margin: 10
  },
  title: {
    flexGrow: 1,
    marginLeft: 15
  },
  tree: {
    paddingTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 5,
    flexGrow: 1
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
  playgroundButton: {
    borderRadius: 2,
    border: 0,
    color: '#FFAB00',
    boxShadow: '0 2px 5px 1px rgba(255, 105, 135, .3)'
  },
  unLockSnackBar: {
    background: '#1e1e1e',
    color: '#ffab00',
    boxShadow: '0 2px 5px 1px rgba(255, 105, 135, .3)'
  }
})

interface State {
  contract?: string
  web3Address?: string
  contractName?: string
  contractArguments: string
  mainAccount?: string
  mainAccountPass?: string
  gas?: number
  json?: object
  loading: boolean
  showPlayground: boolean
  isCompiled: boolean
  openDialog: boolean
  showAlert: boolean
  newWeb3Address: boolean
  alertMessage: string
  error: any
  mainAccounts: string[]
}

class Index extends React.Component<WithStyles<'root'>, State> {
  state = {
    contract: `pragma solidity ^0.4.9;


contract Example {

    uint128 public num = 5;
    event NumChanged (uint128);

    function add(uint128 a) public returns (uint128) {
        return num+a;
    }

    function setA(uint128 a) public {
        num = a;
        NumChanged(num);
    }
}`,
    web3Address: 'http://',
    contractName: 'Example',
    contractArguments: '',
    mainAccount: undefined,
    mainAccountPass: '',
    gas: 1500000,
    json: {},
    loading: false,
    showPlayground: false,
    isCompiled: false,
    openDialog: false,
    showAlert: false,
    newWeb3Address: true,
    alertMessage: '',
    error: null,
    mainAccounts: []
  }

  onDeployed = async ({ deployContract }: any) => {
    const parsedJson = JSON.parse(deployContract.data)
    await this.setState({
      json: {
        DeployedContract: parsedJson.deployedContract,
        CompiledCode: parsedJson.compiledCode
      },
      showPlayground: true,
      loading: false,
      error: null
    })
    this.logEventsToGA('Deployed')
  }

  logEventsToGA = async (event: string) => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }
    ReactGA.event({
      category: 'IDE',
      action: event,
      label: event
    })
  }
  onCompiled = async ({ compileContract }: any) => {
    const parsedJson = JSON.parse(compileContract.data)
    await this.setState({
      json: parsedJson,
      loading: false,
      isCompiled: true,
      error: null
    })
    this.logEventsToGA('Compiled')
  }

  onUnlocked = async ({ unlockContract }: any) => {
    await this.setState({
      loading: false,
      showAlert: true,
      alertMessage: 'Unlock successful',
      error: null
    })
    this.logEventsToGA('Unlocked')
  }

  showLoading = async () => {
    await this.setState({
      loading: true
    })
  }

  getAccounts = async (client: any, web3Address: string) => {
    await this.setState({
      web3Address
    })
    if (web3Address.length < 16) {
      return
    }
    await this.setState({
      error: null,
      mainAccounts: [],
      loading: true
    })
    try {
      const {
        data: {
          listAccounts: { data }
        }
      } = await client.query({
        query: gql`
          query ListAccounts($web3Address: String!) {
            listAccounts(web3Address: $web3Address) {
              data
            }
          }
        `,
        variables: { web3Address }
      })
      await this.setState({
        mainAccounts: JSON.parse(data),
        loading: false,
        error: null
      })
    } catch (e) {
      // console.error(e)
      // this.handleError(e.graphQLErrors[0].message)s
    }
  }

  handleError = async (error: any) => {
    console.log(error)
    await this.setState({
      loading: false,
      showPlayground: false,
      isCompiled: false,
      error
    })
  }

  handleEditorChange = (data: string) => {
    this.setState({ contract: data })
  }

  handleInputChange = (name: string) => (event: any) => {
    this.setState({
      [name]: event.target.value
    } as any)
  }

  handleDialogOpen = async () => {
    await this.setState({ openDialog: true })
    this.logEventsToGA('Show Info')
  }

  handleDialogClose = async () => {
    await this.setState({ openDialog: false })
  }
  handleAlertClose = (event: any) => {
    this.setState({ showAlert: false })
  }
  async componentDidMount() {
    let state: any = await localStorage.getItem('state')
    state = { ...JSON.parse(state), loading: false }
    if (state) {
      this.setState(state)
    }
  }
  componentDidUpdate() {
    localStorage.setItem('state', JSON.stringify(this.state))
  }

  renderTextField(
    label?: any,
    value?: any,
    onChange?: any,
    type: any = 'text'
  ) {
    const classes: any = this.props.classes
    return (
      <TextField
        label={label}
        type={type}
        onChange={onChange}
        value={value}
        className={classes.textField}
        margin="normal"
        InputProps={{
          className: classes.input
        }}
        InputLabelProps={{
          className: classes.label
        }}
      />
    )
  }

  render() {
    const classes: any = this.props.classes

    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <Avatar
              alt="Logo"
              src={TitanLogo}
              className={['App-logo', classes.avatar].join(' ')}
            />
            <Typography
              variant="title"
              color="inherit"
              className={classes.title}
            >
              TITAN IDE
            </Typography>
            {this.state.showPlayground && (
              <Button
                className={classes.playgroundButton}
                onClick={() => {
                  this.logEventsToGA('Go to Playground')
                  window.open('http://localhost:4001/playground', '_blank')
                }}
              >
                Interact with Functions
              </Button>
            )}
            <IconButton
              color="secondary"
              aria-label="Info"
              onClick={this.handleDialogOpen}
            >
              <Info />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Notification />
        {this.state.loading && (
          <LinearProgress color="secondary" style={{ background: '#101010' }} />
        )}
        <Grid container className={classes.root}>
          <Grid item md={8} xs={12}>
            <MonacoEditor
              theme="vs-dark"
              height="500"
              language="sol"
              editorDidMount={() => null}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                automaticLayout: true
              }}
              value={this.state.contract}
              onChange={this.handleEditorChange}
            />
            {/* <Grid item sm={12} xs={12} className={classes.customPadding}> */}
            <Grid item sm={12} xs={12}>
              <Grid container spacing={24}>
                <Linting contract={this.state.contract} />
                {(this.state.showPlayground || this.state.isCompiled) && (
                  <Grid item xs={12}>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <Typography variant="title">Contract Info</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <ReactJson
                          src={this.state.json}
                          theme="summerfruit"
                          iconStyle="square"
                          indentWidth={2}
                          collapsed={2}
                          displayDataTypes={false}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12} className={classes.customPadding}>
            <Grid container>
              <MuiThemeProvider
                theme={createMuiTheme({
                  palette: {
                    primary: {
                      main: '#d4d4d4',
                      contrastText: '#d4d4d4'
                    },
                    secondary: {
                      main: '#FFAB00'
                    }
                  }
                })}
              >
                <Grid item sm={12} xs={12}>
                  <ApolloConsumer>
                    {client =>
                      this.renderTextField(
                        'Web3 Provider URL',
                        this.state.web3Address,
                        async (event: any) => {
                          await this.getAccounts(client, event.target.value)
                        }
                      )
                    }
                  </ApolloConsumer>
                </Grid>
                <Grid
                  item
                  sm={12}
                  xs={12}
                  style={
                    this.state.mainAccounts &&
                    this.state.mainAccounts.length > 0
                      ? undefined
                      : { display: 'none' }
                  }
                >
                  <FormControl className={classes.textField}>
                    <InputLabel className={classes.label} htmlFor="age-simple">
                      Main Account
                    </InputLabel>

                    <Select
                      value={this.state.mainAccount || ''}
                      inputProps={{
                        className: classes.input,
                        id: 'selectMainAccount'
                      }}
                      onChange={this.handleInputChange('mainAccount')}
                    >
                      {this.state.mainAccounts.map(
                        ({ account, balance }: any, index: number) => (
                          <MenuItem value={account} key={index}>
                            {account.substring(0, 20)} ({balance})
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  container
                  style={
                    this.state.mainAccounts &&
                    this.state.mainAccounts.length > 0
                      ? undefined
                      : { display: 'none' }
                  }
                >
                  {[
                    [
                      'Contract To Deploy',
                      this.state.contractName,
                      this.handleInputChange('contractName')
                    ],
                    [
                      'Contract Arguments (a,b,..)',
                      this.state.contractArguments,
                      this.handleInputChange('contractArguments')
                    ],
                    ['Gas', this.state.gas, this.handleInputChange('gas')],
                    [
                      'Main Account Password',
                      this.state.mainAccountPass,
                      this.handleInputChange('mainAccountPass'),
                      'password'
                    ]
                  ].map((field, index) => (
                    <Grid item sm={12} xs={12} key={index}>
                      {this.renderTextField(...field)}
                    </Grid>
                  ))}
                </Grid>

                <Grid item sm={12} xs={12}>
                  <Grid container className={classes.tree}>
                    <CompileContractButton
                      contract={this.state.contract}
                      web3Address={this.state.web3Address}
                      onCompile={this.showLoading}
                      onError={this.handleError}
                      onCompiled={this.onCompiled}
                      isLoading={this.state.loading}
                    />

                    <UnlockAccountButton
                      web3Address={this.state.web3Address}
                      mainAccountPass={this.state.mainAccountPass}
                      mainAccount={this.state.mainAccount}
                      onUnlock={this.showLoading}
                      onUnlocked={this.onUnlocked}
                      onError={this.handleError}
                      isLoading={this.state.loading}
                    />
                    <DeployContractButton
                      contract={this.state.contract}
                      contractName={this.state.contractName}
                      web3Address={this.state.web3Address}
                      mainAccount={this.state.mainAccount}
                      mainAccountPass={this.state.mainAccountPass}
                      gas={this.state.gas}
                      contractArguments={this.state.contractArguments}
                      onDeploy={this.showLoading}
                      onError={this.handleError}
                      onDeployed={this.onDeployed}
                      isLoading={this.state.loading}
                    />
                  </Grid>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Grid container justify={'center'} spacing={24}>
                    <ReactTerminal
                      web3Address={this.state.web3Address}
                      logEvent={this.logEventsToGA}
                    />
                  </Grid>
                </Grid>
              </MuiThemeProvider>
            </Grid>
          </Grid>

          <InfoModel
            open={this.state.openDialog}
            handleClose={this.handleDialogClose}
            logEvent={this.logEventsToGA}
          />
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.showAlert}
          ContentProps={{
            'aria-describedby': 'message-id',
            classes: {
              root: classes.unLockSnackBar
            }
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleAlertClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </React.Fragment>
    )
  }
}

export default withRoot(withStyles(styles)(Index))
