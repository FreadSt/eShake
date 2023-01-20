import React, {PureComponent} from 'react';
import ArrowDownIcon from '../../assets/agreement/arrow-down.svg';
import './styles.scss'

class DescriptionBlock extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            customHeight: 175
        }
    }

    handleReadMore = () => {
        this.setState({customHeight: 'auto'})
    }

    truncate = (str, n) => {
        if(this.state.customHeight !== 'auto')
            return (str.length > n) ? str.substr(0, n-1) + '...' : str;
        else
            return str;
    };

    render() {
        const {title, description} = this.props;
        const {customHeight} = this.state;
        return (
            <div className={'custom-description-block'} key={customHeight}>
                <h3 className={'title'}>{title}</h3>
                <p
                    className={'description'}
                    style={{maxHeight: customHeight}}
                >{this.truncate(description, 260)}</p>
                {description.length > 260 && customHeight !== 'auto' &&
                    <span
                        onClick={this.handleReadMore}
                        className={'read-more'}
                    >
                        Read More
                        <img
                            src={ArrowDownIcon}
                            alt="read more"
                            className={'read-more-icon'}
                        />
                    </span>
                }
            </div>
        );
    }
}

export default DescriptionBlock;
