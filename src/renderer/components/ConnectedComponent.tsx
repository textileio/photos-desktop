import { Component } from 'react'
import { inject } from 'mobx-react'
import { Stores } from '../stores'

export class ConnectedComponent<T, S, X = {}> extends Component<T, X> {
  public get stores() {
    return (this.props as any) as S
  }
}

export const connect = (...args: (keyof Stores)[]) => inject(...args)
