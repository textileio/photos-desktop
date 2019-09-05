import React, { SyntheticEvent } from 'react'
import { Header, Grid, Card, Icon } from 'semantic-ui-react'
import { RouteComponentProps } from '@reach/router'
import { observer } from 'mobx-react'
import { ConnectedComponent, connect } from '../components/ConnectedComponent'
import { Stores } from '../stores'
import { Repo } from '../stores/models'
import { shell } from 'electron'
import path from 'path'
import BackArrow from '../components/back-arrow'

@connect(
  'user',
  'store',
)
@observer
export default class Start extends ConnectedComponent<RouteComponentProps, Stores> {
  handleChoice = (item: Repo) => {
    const { user } = this.stores
    user.setPage('loading')
    this.stores.store.startTextile(item.path)
  }
  componentDidMount() {
    const { user } = this.stores
    if ([...user.repos].length < 1) {
      user.setPage('signin')
    }
  }
  render() {
    const { user } = this.stores
    return (
      <Grid textAlign="center" centered style={{ height: '100vh' }}>
        <Grid.Row>
          <Grid.Column width={12} verticalAlign="middle">
            <Header as="h2">
              Welcome back!
              <Header.Subheader>Choose an existing account, or import from an account seed</Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={14} verticalAlign="top">
            <Card.Group centered itemsPerRow={4}>
              {user && user.repos.map(this.renderItem)}
              <Card link key="create-new" onClick={() => user.setPage('signin')}>
                <Card.Content textAlign="center">
                  <Card.Meta>From seed...</Card.Meta>
                  <Card.Description>
                    <Icon size="large" name="plus" />
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <BackArrow />
      </Grid>
    )
  }
  renderItem = (item: Repo) => {
    const { user } = this.stores
    return (
      <Card link key={path.basename(item.path)} onClick={() => this.handleChoice(item)}>
        <Card.Content textAlign="left">
          <Card.Header>{item.name || 'Unknown'}</Card.Header>
          <Card.Meta>{path.basename(item.path).slice(0, 16)}</Card.Meta>
          <Card.Description>
            <Icon
              title="Open repo folder"
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation()
                shell.openItem(item.path)
              }}
              name="folder"
              link
            />
            <Icon
              title="Move repo to trash"
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation()
                shell.moveItemToTrash(item.path)
                user.repos = user.repos.filter(repo => repo.path !== item.path)
              }}
              name="trash"
              link
            />
            {!item.valid && (
              <Icon
                float="right"
                color="red"
                title="Invalid repo (click to remove)"
                name="exclamation"
                link
                onClick={(event: SyntheticEvent) => {
                  event.stopPropagation()
                  user.repos = user.repos.filter(repo => repo.path !== item.path)
                }}
              />
            )}
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}
