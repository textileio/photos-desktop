import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import GroupList from './GroupList'
import PhotoGrid from './PhotoGrid'
import GroupSummary from './GroupSummary'
import { Grid, Segment } from 'semantic-ui-react'

@inject('store') @observer
class Main extends Component {
  render () {
    return (
      <Grid style={{ height: '100vh' }} columns={2}>
        <Grid.Row stretched>
          <Grid.Column width={3}>
            <GroupList />
          </Grid.Column>
          <Grid.Column stretched width={13}>
            <GroupSummary />
            <Segment basic>
              <PhotoGrid />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Main
