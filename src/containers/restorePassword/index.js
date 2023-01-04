import React, {Component} from 'react';
import {Field, reduxForm} from "redux-form";
import {validate} from "./validation";
import './styles.scss'
import CustomInput from "../../components/customInput";
import EnvelopeIcon from "../../assets/login/envelope.svg";
import ArrowRightIcon from "../../assets/login/arrow-right.png";
import CrossIcon from '../../assets/buttonsGroup/cross.svg';

class RestorePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successRestore: false
    };
  }

  render() {
    const {handleSubmit} = this.props;
    const {successRestore} = this.state;
    return (
      <div className={'restore-password'}>
        <div className={'restore-block'}>
          {!successRestore ?
            <>
              <h1 className={'title'}>Restore Password</h1>
              <p className={'sub-title'}>Please enter validated eShake moderator Email</p>
              <Field
                name={'email'}
                label={'Email'}
                component={CustomInput}
                type={'text'}
                iconName={EnvelopeIcon}
              />
              <button className={'restore-button'} onClick={handleSubmit}>
                Restore Pass
                <img
                  src={ArrowRightIcon}
                  alt="restore icon"
                  className={'right-icon'}
                />
              </button>
            </> :
            <>
              <h1 className={'title'}>Restore Password</h1>
              <p className={'description-text'}>
                Your Password Restoration Application was accepted for processing. <br/>
                You will get an Email with new password after verification.
              </p>
              <button className={'restore-button'} onClick={() => this.props.history.push('/login')}>
                Close
                <img
                  src={CrossIcon}
                  alt="restore icon"
                  className={'cross-icon'}
                />
              </button>
            </>
          }
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'login',
  validate: validate
})(RestorePassword);
