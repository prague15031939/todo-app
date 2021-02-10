import React, { Component } from 'react';
import Masonry from 'react-masonry-component';

class EditorFileList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const taskFiles = !this.props.editingTaskId ? <div></div> : this.props.files.map(file => {
            return (
                <div id="taskFileItem" key={file}>
                    <div><a href={`/api/tasks/download/${this.props.editingTaskId}/${file}`} download={file}>{file}</a></div>
                    <div id="taskFileDelete" onClick={this.props.onFileDelete.bind(null, file)}>x</div>
                </div>
            );
        });
        return (
            <Masonry className="taskFilesList">
                {taskFiles}
            </Masonry> 
        )
    }
}

export default EditorFileList;