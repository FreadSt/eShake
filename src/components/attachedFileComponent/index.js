import React, {Component} from 'react';
import LinkIcon from '../../assets/agreement/link.svg';
import DownloadIcon from '../../assets/agreement/download.svg';
import './styles.scss';
import {handleGetAvatarFile} from "../../helpers/methods";

class AttachedFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            downloadLink: ''
        }
    }

    componentDidMount() {
        const {file} = this.props;
        if (file?.type && file?.filename) {
            handleGetAvatarFile(file.type, file.filename)
                .then((url) => {
                    this.setState({downloadLink: url})
                })
        }
    }

    render() {
        const {file} = this.props;
        const {downloadLink} = this.state;
        return (
            <div className={'attachment-card-component'}>
                <div className={'name-block'}>
                    <img src={LinkIcon} alt="link icon"/>
                    <span className={'name'}>{file.filename}</span>
                    {/*<span className={'size-img'}>1.32Mb</span>*/}
                </div>
                {!!downloadLink &&
                <a href={downloadLink} download>
                    <img src={DownloadIcon} alt="download"/>
                </a>
                }
            </div>
        );
    }
}

export default AttachedFile;
