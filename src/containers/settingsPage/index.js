import React, {Component} from 'react';
import './styles.scss';
import CustomContainer from "../../components/customContainer";

class SettingsPage extends Component {
    render() {
        return (
            <CustomContainer>
                <div className={'settings'}>
                    <p>Settings</p>
                </div>
            </CustomContainer>
        );
    }
}

export default SettingsPage;
