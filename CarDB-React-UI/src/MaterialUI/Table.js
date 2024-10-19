import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { columnDef } from '../model';
import { IconButton } from '@mui/material';

function EnhancedTableHead({ onRequestSort=(key)=>{}, order="asc", orderBy="id" }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
            {columnDef.map((col) => (
                <TableCell
                    key={col.key}
                    align='left'
                    sortDirection={orderBy === col.key ? order : false}
                >                        
                    <TableSortLabel
                        active={orderBy === col.key}
                        direction={orderBy === col.key ? order : 'asc'}
                        onClick={createSortHandler(col.key)}
                    >
                        {col.header}
                        {orderBy === col.key ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
            ))}
            <TableCell
                align='center'
            >Actions</TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
};

export default function EnhancedTable({data, total=0, order='asc', orderBy, page=0, pageSize=10, pageSizeOptions=[], 
                    onEdit=(id)=>{}, onDelete=(id)=>{}, onPageChange=(page)=>{}, onPageSizeChange=(size)=>{}, onSort=(key)=>{}}) {
    // const visibleRows = React.useMemo(
    //     () =>
    //     [...data]
    //         .sort(getComparator(order, orderBy))
    //         .slice(page * pageSize, page * pageSize + pageSize),
    //     [data, order, orderBy, page, pageSize],
    // );

    return (
        <Box sx={{ width: '75%', height:'80%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        size="small"
                        sx={{ minWidth: 550 }}
                        aria-labelledby="Car Table"
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={onSort}
                        />
                        <TableBody>
                        {data.map((row, index) => {
                            // const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    {
                                        columnDef.map((col)=> <TableCell key={col.key} scope={col.key==="id"?"row":""} align="left">
                                            {col.key==="name" ? row[col.key].toUpperCase() : row[col.key]}
                                        </TableCell>)
                                    }
                                    <TableCell sx={{minWidth: 120}}>
                                        <IconButton onClick={() => onEdit(row.id)} ><EditIcon/></IconButton>
                                        <IconButton onClick={() => onDelete(row.id)} ><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={pageSizeOptions}
                    component="div"
                    count={total}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={(e, p) => onPageChange(p)}
                    onRowsPerPageChange={(e) => onPageSizeChange(e.target.value)}
                />
            </Paper>
        </Box>
    );
}

EnhancedTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number,
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onSort: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
//   limit: PropTypes.number.isRequired,
};
