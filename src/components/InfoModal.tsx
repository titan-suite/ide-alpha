import * as React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

function Transition(props: any) {
  return <Slide direction="up" {...props} />
}

interface Arguments {
  open: boolean
  handleClose: Function
  logEvent: Function
}

const InfoModal: React.SFC<Arguments> = ({ open, handleClose, logEvent }) => {
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
      >
        <DialogTitle>Instructions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Welcome to Titan IDE. To get started :
            <ol>
            <li>Download the IDE server</li>
            <li>Setup the server</li>
            <ul>
              <li>// with npm</li>
              cd server && npm install && npm run start
              <li>// with yarn</li> 
              cd server && yarn && yarn start
            </ul>
            </ol>
            Something wrong? Try updating the server
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              logEvent('Redirect to Github')
              window.open(
                'https://github.com/titan-suite/ide/blob/dev/README.md',
                '_blank'
              )
            }}
            color="secondary"
          >
            How to use
          </Button>
          <Button
            onClick={() => {
              logEvent('Redirect to Github')
              window.open(
                'https://github.com/titan-suite/ide/releases',
                '_blank'
              )
            }}
            color="secondary"
          >
            Get The Server
          </Button>
          <Button
            onClick={() => {
              logEvent('Report Issue')
              window.open(
                'https://github.com/titan-suite/ide/issues',
                '_blank'
              )
            }}
            color="secondary"
          >
            Report an Issue
          </Button>
          <Button onClick={() => handleClose()} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default InfoModal
