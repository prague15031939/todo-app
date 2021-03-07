import React, { Component } from 'react';

class FileList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.files.length) {
            return (
                <div>
                    {
                        this.props.files.map(file =>
                            <div key={file}><a id="downloadLink" onClick={this.props.onFileDownload.bind(null, this.props.taskId, file)}>{file}</a></div>
                        )
                    }
                </div>
            )
        }
        else 
            return (<div></div>)
    }
}

export default FileList;