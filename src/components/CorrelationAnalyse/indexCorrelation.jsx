/* eslint-disable */
import React, {PureComponent} from "react";
import Form from "./form.jsx";

export default class indexCorrelation extends PureComponent
{
    render() {
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="page-title">Correlation Analyse</h3>
                    </div>
                </div>
                <div className="row">
                    <Form location={this.props.location.pathname} />
                </div>
            </div>
        )
    }
}
