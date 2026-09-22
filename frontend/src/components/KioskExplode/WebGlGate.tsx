import { Component, type ReactNode } from 'react'

type WebGlGateProps = {
  children: ReactNode
  fallback: ReactNode
}

type WebGlGateState = {
  hasFailed: boolean
}

/** WebGL kurulumu patlarsa sahne yerine yedek UI kalır. */
export default class WebGlGate extends Component<WebGlGateProps, WebGlGateState> {
  state: WebGlGateState = { hasFailed: false }

  static getDerivedStateFromError(): WebGlGateState {
    return { hasFailed: true }
  }

  componentDidCatch() {
    this.setState({ hasFailed: true })
  }

  render() {
    return this.state.hasFailed ? this.props.fallback : this.props.children
  }
}
