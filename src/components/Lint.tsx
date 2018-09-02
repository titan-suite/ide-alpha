import * as React from 'react'
import linter from 'solhint/lib/index'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
const configAsJson = {
  extends: 'default',
  rules: {
    'avoid-throw': false,
    'compiler-fixed': true,
    'avoid-suicide': 'error',
    'avoid-sha3': 'warn',
    indent: false,
    'payable-fallback': false
  }
}

interface Contract {
  contract: string
}
const Linting: React.SFC<Contract> = ({ contract }) => {
  const report = linter.processStr(contract, configAsJson)
  return (
    <Grid item xs={12}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography variant="title" style={{ margin: '5px' }}>
            {report.errorCount} Errors {report.warningCount} Warnings
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {report.messages.map((curError: any, index: number) => (
            <pre key={index} style={{ color: '#d4d4d4' }}>
              {curError.message} on Line {curError.line} Column{' '}
              {curError.column}
            </pre>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}
export default Linting
