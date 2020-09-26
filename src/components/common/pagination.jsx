import React from "react";
import _ from "lodash";
import PropTypes from "prop-types"

const Pagination = (props) => {
  let { pageSize, totalMovies } = props;
  let pages = Math.ceil(totalMovies / pageSize);
  let page = _.range(1, pages + 1);

  if (page.length===1) return null

  return (
    <React.Fragment>
      <nav >
        <ul className="pagination">
          {page.map((page) => (
            <li key={page} className={props.currentPage===page?"page-item active":"page-item"}>
              <a className="page-link" onClick={()=>props.onClick(page)} >{page}</a>
            </li>
          ))}
        </ul>
      </nav>
    </React.Fragment>
  );
};

Pagination.propTypes={
    itemsCount:PropTypes.number.isRequired,
    pageSize:PropTypes.number.isRequired,
    currentPage:PropTypes.number.isRequired,
    onPageChange:PropTypes.func.isRequired
}

export default Pagination;
