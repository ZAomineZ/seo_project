/* eslint-disable */
import React, {PureComponent} from 'react';
import SuggestCurrent from './suggest_current';
import SuggestQuestion from './suggest_questions';
import SuggestPreposition from './suggest_preposition';
import SuggestComparison from './suggest_comparison';
import SuggestAlpha from './suggest_alpha';
import axios from "axios";

class SuggestDetails extends PureComponent{
    constructor ()
    {
        super();
        console.error = () => {};
        console.error();
        this.state = {
            data_current: [],
            data_questions: [],
            data_preposition: [],
            data_comparisons: [],
            data_alpha: [],
            loading: true,
            loaded: false,
        }
    }

    componentDidMount() {
        let route = '/ReactProject/App'
        axios.get("http://" + window.location.hostname + route + "/Ajax/Suggest.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'keyword': this.props.match.params.keyword
            }
        }).then((response) => {
            if (response && response.status === 200) {
                this.setState({
                    data_current: response.data.current,
                    data_questions: response.data.questions,
                    data_preposition: response.data.prepositions,
                    data_comparisons: response.data.comparisons,
                    data_alpha: response.data.alpha,
                    loading: false
                });
                setTimeout(() => this.setState({ loaded: true }), 500);
            }
        })
    }

    render() {
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
                        <h3 className="page-title">Suggest</h3>
                    </div>
                </div>
                <div className="row">
                    <SuggestCurrent data={this.state.data_current}/>
                    <SuggestQuestion data={this.state.data_questions}/>
                    <SuggestPreposition data={this.state.data_preposition}/>
                    <SuggestComparison data={this.state.data_comparisons}/>
                </div>
                <SuggestAlpha data={this.state.data_alpha}/>
            </div>
        );
    }
}

export default SuggestDetails;
