/* eslint-disable */
import React, {PureComponent} from 'react';
import DefaultPanelDivider from '../../containers/UI/Panels/components/DefaultPanelDivider';

class linkprofile extends PureComponent {
    constructor() {
        super()
        console.error = () => {};
        console.error();
    }

    render() {
        const param_domain = this.props.match.params.domain;
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="page-title">Link Profile</h3>
                    </div>
                </div>
                <div className="row">
                    <DefaultPanelDivider domain={param_domain}/>
                </div>
            </div>
        );
    }
}

export default linkprofile;
