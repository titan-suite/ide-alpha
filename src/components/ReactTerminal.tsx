import { Mutation } from 'react-apollo'
import Terminal from 'terminal-in-react'
import gql from 'graphql-tag'
import * as React from 'react'

const EXECUTE_WEB3 = gql`
  mutation executeWeb3($web3Address: String!, $command: String!) {
    executeWeb3(web3Address: $web3Address, command: $command) {
      data
    }
  }
`
interface Props {
  web3Address: string
  logEvent: Function
}
class ReactTerminal extends React.Component<Props, {}> {
  render() {
    return (
      <Mutation mutation={EXECUTE_WEB3}>
        {(executeWeb3, { loading, error }) => (
          <Terminal
            color="#ffab00"
            backgroundColor="#1e1e1e"
            barColor="#1e1e1e"
            hideTopBar
            msg="Execute 'help' to view list of available commands"
            style={{
              marginTop: '1rem',
              fontSize: '1rem'
            }}
            commands={{
              titan: (args: string[], print: (arg: string) => void) => {
                this.props.logEvent('titan bash')
                Promise.resolve(
                  executeWeb3({
                    variables: {
                      web3Address: this.props.web3Address,
                      command: args.splice(1).join('')
                    }
                  })
                )
                  .then((res: any) => {
                    console.log(JSON.parse(res.data.executeWeb3.data))
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            }}
            descriptions={{
              titan: 'Access web3. Usage: titan web3.eth.getAccounts',
              show: false
            }}
            watchConsoleLogging
          />
        )}
      </Mutation>
    )
  }
}

export default ReactTerminal
