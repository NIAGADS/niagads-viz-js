import { FilterValue, IdType, Row } from 'react-table';
import { parseFieldValue } from '@table/index'

export function globalTextFilter(rows: Array<Row<any>>, ids: Array<IdType<any>>, filterValue: FilterValue) {
    rows = rows.filter((row) => {
      return ids.some(id => {
        const rowValue = row.values[id];
        return rowValue && parseFieldValue(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
      })
    });
  
    return rows;
  }
  
  // Let the table remove the filter if the string is empty
  globalTextFilter.autoRemove = (val: any) => !val
  