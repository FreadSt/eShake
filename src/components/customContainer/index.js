import React, {PureComponent} from 'react';
import './styles.scss';

class CustomContainer extends PureComponent {
    render() {
        const {children} = this.props;
        return (
            <div className={'custom-container'}>
                {children}
            </div>
        );
    }
}

export default CustomContainer;
