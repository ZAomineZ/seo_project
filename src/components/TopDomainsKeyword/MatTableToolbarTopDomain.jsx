import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from 'mdi-react/DeleteIcon';
import MatTableFilterButton from '../../containers/Tables/MaterialTable/components/MatTableFilterButton';

const MatTableToolbar = ({
  numSelected, handleDeleteSelected, onRequestSort, onChange, value,
}) => (
  <div className="material-table__toolbar-wrap">
    <Toolbar className="material-table__toolbar">
      <div className="input_style_form">
        <form className="form form--horizontal">
          <div className="form__form-group">
            <span className="form__form-group-label">Search</span>
            <div className="form__form-group-label">
              <input type="text" name="search" onChange={onChange} value={value} placeholder="Search Domain" />
            </div>
          </div>
        </form>
      </div>
      <div>
        {numSelected > 0 && (
        <h5 className="material-table__toolbar-selected">{numSelected} <span>selected</span></h5>
                )}
      </div>
      <div className="input_style">
        {numSelected > 0 ? (
          <IconButton
            onClick={handleDeleteSelected}
            className="material-table__toolbar-button"
          >
            <DeleteIcon />
          </IconButton>
                ) : (
                  <MatTableFilterButton onRequestSort={onRequestSort} />
                )}
      </div>
    </Toolbar>
  </div>
);

MatTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleDeleteSelected: PropTypes.func.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default MatTableToolbar;
