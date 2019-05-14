import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FilterListIcon from 'mdi-react/FilterListIcon';

class MatTableFilterButton extends React.Component {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
  };

  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSort = property => (event) => {
    this.props.onRequestSort(event, property);
    this.handleClose();
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div className="">
        <IconButton
          className="material-table__toolbar-button"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          className="material-table__filter-menu"
        >
          <MenuItem onClick={this.handleSort('domains')} className="material-table__filter-menu-item">Domain</MenuItem>
          <MenuItem onClick={this.handleSort('traffic')} className="material-table__filter-menu-item">
            Traffic
          </MenuItem>
          <MenuItem onClick={this.handleSort('top3')} className="material-table__filter-menu-item">Top 3</MenuItem>
          <MenuItem onClick={this.handleSort('top4a10')} className="material-table__filter-menu-item">
              Top 4-10
          </MenuItem>
          <MenuItem onClick={this.handleSort('top11a20')} className="material-table__filter-menu-item">
              Top 11-20
          </MenuItem>
          <MenuItem onClick={this.handleSort('top21a50')} className="material-table__filter-menu-item">
              Top 21-50
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default MatTableFilterButton;
