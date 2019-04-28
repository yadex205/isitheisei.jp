import React from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import axios from 'axios';

const BEGINNING_OF_REIWA = new Date('2019-05-01T00:00:00+09:00').getTime();

const Page = styled.div``;

const Stage = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  justify-content: center;
  align-items: center;
`;

const Result = styled.div`
  font-size: 40px;
`;

interface State {
  usingRemoteTime: 'notyet' | 'success' | 'failed';
  isitheisei: boolean;
};

export default class IndexPage extends React.Component<{}, State> {
  private remoteCurrentTime?: number;
  private remoteCurrentTimeReceivedAt?: number;
  private updateTimer?: number;
  private triggerFirstUpdateTimer?: number;
  private checkTimer?: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      usingRemoteTime: 'notyet',
      isitheisei: Date.now() < BEGINNING_OF_REIWA
    };
  }

  async componentDidMount() {
    this.triggerFirstUpdateTimer = window.setTimeout(() => {
      this.updateNtpCurrent();
    }, 1000);

    this.checkTimer = window.setInterval(() => {
      this.checkIsitheisei();
    }, 1000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.triggerFirstUpdateTimer);
    window.clearInterval(this.checkTimer);
  }

  private async updateNtpCurrent() {
    try {
      const { headers } = await axios.head('/void.txt');
      const currentDate = new Date();

      this.remoteCurrentTimeReceivedAt = currentDate.getTime();

      if (typeof headers.date === 'string') {
        this.remoteCurrentTime = (new Date(headers.date)).getTime() + currentDate.getMilliseconds();
        this.setState({ usingRemoteTime: 'success' });
      }
    } finally {
      if (!this.remoteCurrentTime || !this.remoteCurrentTimeReceivedAt) {
        this.setState({ usingRemoteTime: 'failed' });
      }
    }
  }

  private checkIsitheisei() {
    let current = Date.now();
    if (this.remoteCurrentTime && this.remoteCurrentTimeReceivedAt) {
      current = this.remoteCurrentTime + (current - this.remoteCurrentTimeReceivedAt);
    }

    this.setState({ isitheisei: current < BEGINNING_OF_REIWA });

    if (BEGINNING_OF_REIWA > current) {
      window.clearTimeout(this.updateTimer);
      this.updateTimer = window.setTimeout(() => {
        this.setState({ isitheisei: true });
      }, BEGINNING_OF_REIWA - current);
    }
  }

  private get resultWord(): string {
    return this.state.isitheisei ? 'はい' : 'いいえ';
  }

  render() {
    return (
      <Page>
        <Stage>
          <Result>{this.resultWord}</Result>
        </Stage>
      </Page>
    );
  }
}
