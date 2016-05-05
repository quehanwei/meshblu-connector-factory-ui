import React, { Component, PropTypes } from 'react';

import {
  Page,
  PageHeader,
  Spinner,
  ErrorState,
  Button,
} from 'zooid-ui';

import FaApple from 'react-icons/lib/fa/apple';
import FaWindows from 'react-icons/lib/fa/windows';
import FaLinux from 'react-icons/lib/fa/linux';

import {
  getInstallerUri,
  getFileName,
  getDownloadUri,
} from '../../helpers/installer'

import './Download.css';

export default class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
    };
    this.download = this.download.bind(this);
    this.getButtonRow = this.getButtonRow.bind(this);
    this.getButton = this.getButton.bind(this);
  }

  componentDidMount() {
    const { otp } = this.props;
    if(!otp) {
      this.setState({ error: new Error('Invalid Key') })
    }
    this.setState({ loading: false });
  }

  download(platform) {
    const { otp } = this.props;
    return () => {
      this.setState({ loading: true });
      const uri = getInstallerUri({ platform });
      const fileName = getFileName({ otp, platform });
      const link = document.createElement('a');
      link.download = fileName;
      link.href = getDownloadUri({ uri, fileName });
      link.click();
    }
  }

  renderContent(content) {
    const { connector } = this.props;
    return (
      <div>
        {content}
      </div>
    );
  }

  getButtonRow(os, platforms) {
    const buttons = _.map(platforms, (platform) => {
      return this.getButton(platform)
    });
    return (
      <div className="Download--row">
        <h4>{os}</h4>
        {buttons}
      </div>
    );
  }

  getButton(platform) {
    let Icon = null;
    if (/^darwin/.test(platform)) {
      Icon = <FaApple />
    }
    if (/^windows/.test(platform)) {
      Icon = <FaWindows />
    }
    if (/^linux/.test(platform)) {
      Icon = <FaLinux />
    }
    let arch = '[x64]';
    if (/386$/.test(platform)) {
      arch = '[x86]';
    }
    return (
      <Button
        key={platform}
        kind="hollow-primary"
        onClick={this.download(platform)}
        ><i className="Download--icon">{Icon}</i> {arch} Download
      </Button>
    );
  }

  render() {
    const {
      error,
      loading,
    } = this.state;

    if (error) {
      return this.renderContent(<ErrorState description={error.message} />);
    }
    if (loading) {
      return this.renderContent(
        <div>
          <Spinner size="large" />
          <h1>Downloading...</h1>
        </div>
      );
    }

    return this.renderContent(
      <div className="Download--actions">
        {this.getButtonRow('Mac OS', ['darwin-amd64'])}
        {this.getButtonRow('Windows', ['windows-amd64', 'windows-386'])}
        {this.getButtonRow('Linux', ['linux-amd64', 'linux-386'])}
      </div>
    );
  }
}

Download.propTypes = {
  otp: PropTypes.string.isRequired
};