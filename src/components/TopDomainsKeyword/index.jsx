/* eslint-disable */
import React, { PureComponent } from 'react';
import TabMaterielTopDomains from './TabMaterielTopDomains';
import axios from "axios";
import {Redirect} from "react-router-dom";

class DomainsKeyword extends PureComponent {
    constructor(props) {
        super(props);
        console.error = () => {};
        console.error();
        this.state = {
            data: [],
            loading: true,
            loaded: false,
            error_message: ''
        }
    }

    componentDidMount() {
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/TopKeyword.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'domain': this.PropsChange(this.props.match.params.keyword)
            }
        }).then(response => {
            if (response && response.status === 200) {
                if (response.data === "You have enjoyed more to 10 domain, while the limit 10 !!!") {
                    this.setState({ error_message : response.data })
                } else {
                    this.setState({ data: response.data, loading: false });
                    setTimeout(() => this.setState({ loaded: true }), 500);
                }
            }
        })
    }

    PropsChange (string) {
        let str_last =  string.lastIndexOf('-');
        let replace_str = string.slice(0, str_last);
        let replace_str2 = string.slice(str_last, string.length);
        let string_end = replace_str2.replace('-', '.');
        return replace_str + string_end
    }

    render() {
        if (this.state.error_message === "You have enjoyed more to 5 domain, while the limit 5 !!!") {
            return (
                <Redirect to={{
                    pathname: '/keyworddomains',
                    state: {error: this.state.error_message}
                }}/>
            );
        } else {
            return (
                <div className="dashboard container">
                    {!this.state.loaded &&
                    <div className="panel__refresh">
                        <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                        </svg>
                    </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="page-title">Top keyword by Domains</h3>
                        </div>
                    </div>
                    <div className="row">
                        <TabMaterielTopDomains data={this.state.data} keyword={this.props.match.params.keyword}/>
                    </div>
                </div>
            );
        }
  }
}

export default DomainsKeyword;
