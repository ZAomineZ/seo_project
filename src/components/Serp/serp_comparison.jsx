/* eslint-disable */
import React, {PureComponent} from 'react';
import connect from 'react-redux/es/connect/connect';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import TopTenComparaison from './top_comparaison';
import {CryptoTableProps} from '../../shared/prop-types/TablesProps';
import {deleteCryptoTableData} from '../../redux/actions/cryptoTableActions';
import axios from "axios";

class SerpComparison extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        cryptoTable: CryptoTableProps.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        console.error = () => {};
        console.error();
        this.state = {
            rank: [],
            url: []
        }
    }

    onDeleteCryptoTableData = (index, e) => {
        e.preventDefault();
        const arrayCopy = [...this.props.cryptoTable];
        arrayCopy.splice(index, 1);
        this.props.dispatch(deleteCryptoTableData(arrayCopy));
    };

    componentDidMount() {
        let route = '/ReactProject/App'
        axios.get('http://' + window.location.hostname + route + '/Ajax/SerpComparaison.php', {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                keyword: this.props.match.params.keyword
            }
        }).then((response) => {
            if (response && response.status === 200) {
                this.setState({
                    rank: response.data.rank,
                    url: response.data.url,
                })
            }
        });
    }

    render() {
        const {t} = this.props;

        const data_rank = Object.entries(this.state.rank).map((d) => {
                let array = [];
                for (let i = 0; i <= d[1].length - 1; i++) {
                    let url_title = d[1][i];
                    let title = '';
                    if (url_title) {
                        title = d[1][i]
                    }
                    array[d[1][i]] = {
                        rank: i + 1,
                        title: title
                    }
                }
                return array
            });
        const data_rank_create = Object.entries(data_rank).map((d, key) => {
            let array;
            if (key === data_rank.length - 1 || key === data_rank.length - 2) {
                array = this.state.url.map(((d, key) => {
                    if (data_rank[data_rank.length - 2]) {
                        let data_today = data_rank[data_rank.length - 1][d];
                        let data_yesterday = data_rank[data_rank.length - 2][d];
                        if (data_today && data_yesterday) {
                            return {
                                id: key + 1,
                                title: data_today.title,
                                rank: data_yesterday.rank - data_today.rank,
                                type: Math.sign(data_yesterday.rank - data_today.rank) === -1
                                    ? 'negative' :
                                    data_yesterday.rank - data_today.rank === 0
                                        ? '' : 'positive'
                            }
                        } else {
                            return 'null'
                        }
                    }
                }));
            }
            return array
        });
        const data_diff = data_rank_create;
        const data_top = Object.entries(data_diff);

        let data = [];

        // Create data !!!
        data_top.map((d) => {
            d.map(dd => {
                data = dd
            })
        });

        // Stock data_lose && data_top !!!
        let data_key_lose = [];
        let data_end_key = [];
        let data_lose = [];
        data.map((d, key) => {
            if (d === 'null') {
                return null
            } else {
                data_key_lose[key] = d;
                return data_key_lose
            }
        });

        data.map((d) => {
            if (data_rank.length >= 2) {
                data_end_key[d.id] = d;
                return data_end_key
            }
        });

        // Create Lose Data !!!
        let filter_last_lose = data_rank.length >= 2 ? data_key_lose.filter(d => d.type !== 'positive' && d.type !== '') : '';
        for (let i = 0; i <= filter_last_lose.length - 1; i++) {
            data_lose = filter_last_lose;
        }
        let array_rank_desc = data_lose.sort(function(a, b) { return a.rank - b.rank } );

        //Create Top Data
        let filter_last_top = data_rank.length >= 2 ? data_key_lose.filter(d => d.type === 'positive') : '';
        for (let i = 0; i <= filter_last_top.length - 1; i++) {
            data_lose = filter_last_top;
        }
        let array_rank_asc = data_lose.sort(function(a, b) { return b.rank - a.rank } );

        let data_lose_set = Array.from(new Set(array_rank_desc.slice(0, 10)));
        let data_end_top_set = Array.from(new Set(array_rank_asc.slice(0, 10)));

        return (
            <div className="dashboard container">
                <div className="row">
                    <h3 className="page-title">{t('Serp Comparison')}</h3>
                </div>
                <div className="row">
                    <div className="col-xl-6">
                        <TopTenComparaison
                            TopOrLose
                            title="Top Dashboard Serp"
                            cryptoTable={this.props.cryptoTable}
                            onDeleteCryptoTableData={this.onDeleteCryptoTableData}
                            array_rank={data_rank.length >= 2 ? data_end_top_set : ''}
                            keyword={this.props.match.params.keyword}
                        />
                    </div>
                    <div className="col-xl-6">
                        <TopTenComparaison
                            title="Lose Dashboard Serp"
                            cryptoTable={this.props.cryptoTable}
                            onDeleteCryptoTableData={this.onDeleteCryptoTableData}
                            array_rank={data_rank.length >= 2  ? data_lose_set : ''}
                            keyword={this.props.match.params.keyword}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    cryptoTable: state.cryptoTable.items,
}))(translate('common')(SerpComparison));
