import React, {useState} from 'react';
import './styles.scss';

const CustomInput = ({ input, label, iconName, type, meta: { touched, error } }) => {
    const [showPass, setShowPass] = useState(false);
    return(
        <div className={'custom-input'}>
            <div>
                <img
                    src={iconName}
                    alt="icon input"
                    className={'input-icon'}
                />
                <input
                    className={touched && error ? 'field error-border' : 'field'}
                    {...input}
                    placeholder={label}
                    type={showPass ? 'text' : type}
                />
                {type === 'password' &&
                <i
                    className={!showPass ? 'far fa-eye-slash show-pass-icon' : 'far fa-eye show-pass-icon'}
                    onClick={() => setShowPass(!showPass)}
                />
                }
                {touched && error && <span className={'error-text'}>{error}</span>}
            </div>
        </div>
    )
};

export default CustomInput;
