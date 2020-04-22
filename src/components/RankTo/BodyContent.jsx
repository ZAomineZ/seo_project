/* eslint-disable */
import React, {PureComponent} from 'react';
import RankFront from "./RankFront";
import PropTypes from "prop-types";

export default class BodyContent extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        keywords: PropTypes.string.isRequired,
        dataRankKeywords: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        modalDelete: PropTypes.bool.isRequired,
        modal: PropTypes.bool.isRequired,
        history: PropTypes.object,
        toggleDelete: PropTypes.func.isRequired,
        deleteProject: PropTypes.func.isRequired
    };

    render() {
        return (
            <RankFront id={this.props.id}
                       project={this.props.project}
                       website={this.props.website}
                       date={this.props.date}
                       content={this.props.content}
                       keywords={this.props.keywords}
                       dataRankKeywords={this.props.dataRankKeywords}
                       deleteProject={this.props.deleteProject}
                       modalDelete={this.props.modalDelete}
                       modal={this.props.modal}
                       history={this.props.history}
                       toggleDelete={this.props.toggleDelete}/>
        )
    }
}
