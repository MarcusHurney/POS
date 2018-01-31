import React, { PropTypes } from 'react';
import ExpandProductIcon from 'ExpandProductIcon';

const SalesHistoryRow = ({ sale }) => {
  // only return a row containing a sale if there are items in the sale
  if (sale.items.length) {
    return (
      <tr className="salesHistoryRow wow flipInX">
        <td>{sale._id}</td>
        <td>{sale.date.year} / {sale.date.month + 1} / {sale.date.day}</td>
        <td>${sale.total}</td>
        <td>{sale.items.length >= 2 ? `${sale.items[0].itemName}, ${sale.items[1].itemName}...` : `${sale.items[0].itemName}...`}</td>
        <td><ExpandProductIcon route={`/saleDetails/${sale._id}`}/></td>
      </tr>
    );
  }
  // else return null
  return null;

};

SalesHistoryRow.propTypes = {
  sale: PropTypes.object
};

export default SalesHistoryRow;
