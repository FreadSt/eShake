export const validate = values => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Required';
    }
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Email incorrect'
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    if (values.password && values.password.length < 3) {
        errors.password = 'Password too short';
    }

    return errors;
}
