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
                            <div><a href={`/api/tasks/download/${this.props.taskId}/${file}`} download={file}>{file}</a></div>
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