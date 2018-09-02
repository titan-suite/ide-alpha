import 'isomorphic-fetch'
import * as React from 'react'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import withStyles, {
  WithStyles,
  StyleRulesCallback
} from '@material-ui/core/styles/withStyles'

let messages: any = null

const styles: StyleRulesCallback<'root'> = theme => ({
  root: {
    background: '#1e1e1e',
    color: '#ffab00',
    boxShadow: '0 2px 5px 1px rgba(255, 105, 135, .3)'
  }
})
function sleep(delay: number = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

function getLastSeenNotification() {
  const seen = document.cookie.replace(
    /(?:(?:^|.*;\s*)lastSeenNotification\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  return seen === '' ? 0 : parseInt(seen, 10)
}

async function getMessages() {
  try {
    if (!messages) {
      await sleep(1e3) // Soften the pressure on the main thread.
      const result = await fetch(
        'https://raw.githubusercontent.com/titan-suite/ide/dev/notifications.json'
      )
      messages = await result.json()
    }
  } catch (err) {
    // Swallow the exceptions.
  }

  messages = messages || []
}
interface State {
  open: boolean
  message: { id: number; text: string }
}

class Notification extends React.Component<WithStyles<'root'>, State> {
  mounted = false

  state = {
    open: false,
    message: {} as { id: number; text: string }
  }

  async componentDidMount() {
    this.mounted = true

    // Prevent search engines from indexing the notification.
    if (/glebot/.test(navigator.userAgent)) {
      return
    }

    await getMessages()
    this.handleMessage()
  }

  handleMessage = () => {
    const lastSeen = getLastSeenNotification()
    const unseenMessages = messages.filter(
      (message: any) => message.id > lastSeen
    )
    if (unseenMessages.length > 0 && this.mounted) {
      this.setState({ message: unseenMessages[0], open: true })
    }
  }

  handleClose = () => {
    this.setState({ open: false })
    document.cookie = `lastSeenNotification=${
      this.state.message.id
    };path=/;max-age=31536000`
  }

  componentWillUnmout() {
    this.mounted = false
  }

  render() {
    const { message, open } = this.state
    const { classes } = this.props
    return (
      <Snackbar
        key={message.id}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{
          'aria-describedby': 'notification-message',
          classes: {
            root: classes.root
          }
        }}
        message={
          <span
            id="notification-message"
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        }
        action={
          <Button size="small" color="secondary" onClick={this.handleClose}>
            Close
          </Button>}
        open={open}
        autoHideDuration={20e3}
        onClose={this.handleClose}
        onExited={this.handleMessage}
      />
    )
  }
}

export default withStyles(styles)(Notification)
