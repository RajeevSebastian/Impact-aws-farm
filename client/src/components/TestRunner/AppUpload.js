import React, { Component } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import * as routes from './../authentication/constants/routes';

class AppUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      mimeType: '',
      size: '',
      contentType: '',
      appInfoReceived: false,
      inProgress: false,
      project: this.props,
    };
    this.handleUploadFile = this.handleUploadFile.bind(this);
  }

  handleUploadFile = (event) => {
    const data = new FormData();
    data.append('file', event.target.files[0]);
    console.log(event.target.files[0].name);
    this.setState({ inProgress: true });
    data.append('projectarn', this.state.project.projectarn);
    // '/files' is your node.js route that triggers our middleware
    axios.post('/api/aws-testrunner/createUpload', data).then((res) => {
      console.log(res);
      console.log(this.state.inProgress);
      if (res.status === 200) {
        console.log(res);
        let result = res.data;
        this.setState({
          appName: result.originalname,
          mimeType: result.mimetype,
          size: result.size,
          contentType: result.contentType,
          appInfoReceived: true,
          inProgress: false,
        });
        this.props.tabsHandler(true);
      }
    });
  };

  render() {
    let appInfo = '';
    let progressBar = '';
    let pHolder = (
      <Form.Control placeholder="By default, file name will be used." />
    );
    if (this.state.appInfoReceived !== false) {
      appInfo = (
        <div>
          <p>
            <strong>App Name: </strong>
            {this.state.appName}
          </p>
          <p>
            <strong>Mimetype: </strong>
            {this.state.mimeType}
          </p>
          <p>
            <strong>Content type: </strong>
            {this.state.contentType}
          </p>
          <p>
            <strong>File size: </strong>
            {this.state.size}
          </p>
        </div>
      );
      pHolder = <Form.Control placeholder={this.state.appName} />;
    }
    if (this.state.inProgress) {
      progressBar = (
        <div>
          <Spinner animation="border" /> Upload in progress
        </div>
      );
    }
    return (
      <div>
        <h3>Choose your application</h3>
        <br></br>
        <div>
          <Form>
            <Form.File
              id="custom-file"
              label="Choose File"
              onChange={this.handleUploadFile}
              custom
            />
          </Form>
          <br></br>
          {appInfo}
          <h5>Run name: </h5>
          <Form>
            <Form.Group controlId="formGridAddress1">{pHolder}</Form.Group>
          </Form>
        </div>
        {progressBar}
      </div>
    );
  }
}

export default AppUpload;
