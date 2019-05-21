/* eslint-disable */
import React, {PureComponent} from 'react';
import PasswordFagotForm from './password_forgot_form'

class PasswordFagot extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="account">
                <div className="account__wrapper">
                    <div className="account__card">
                        <div className="account__head">
                            <h3 className="account__title">Welcome to
                                <span className="account__logo"> Easy
              <span className="account__logo-accent">DEV</span>
            </span>
                            </h3>
                            <h4 className="account__subhead subhead">Did you forget your password ?</h4>
                        </div>
                        <PasswordFagotForm typeFuncSubmit={false} />
                    </div>
                </div>
            </div>
        )
    }
}

export default PasswordFagot
