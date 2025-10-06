import React, { useMemo, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  TextField,
  TablePagination,
  Box,
} from '@mui/material';

interface GlobalTableProps<T> {
  columns: Array<{
    label: string;
    key: keyof T | string;
    render?: (row: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    filterable?: boolean;
  }>;
  rows: T[];
  noDataText?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
}

function GlobalTable<T extends { id?: string | number }>({
    columns,
    rows,
    noDataText = 'No data available.',
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage = 10,
  }: GlobalTableProps<T>) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  
    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const filteredRows = useMemo(() => {
      if (!search.trim()) return rows;
  
      return rows.filter((row) =>
        columns.some((col) => {
          if (col.key === 'slNo') return false; // skip Sl No for filtering
          const key = col.key as keyof T;
          const value = row[key];
          return value && value.toString().toLowerCase().includes(search.toLowerCase());
        })
      );
    }, [rows, search, columns]);
  
    const paginatedRows = useMemo(() => {
      const start = page * rowsPerPage;
      return filteredRows.slice(start, start + rowsPerPage);
    }, [filteredRows, page, rowsPerPage]);
  
    return (
      <Box>
        <Box mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </Box>
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col, idx) => (
                  <TableCell key={idx} align={col.align || 'left'}>
                    <Typography fontWeight={600}>{col.label}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, rowIndex) => {
                  const globalIndex = page * rowsPerPage + rowIndex + 1;
                  return (
                    <TableRow key={row?.id || rowIndex}>
                      {columns.map((col, colIndex) => (
                        <TableCell key={colIndex} align={col.align || 'left'}>
                          {col.key === 'slNo'
                            ? globalIndex
                            : col.render
                            ? col.render(row)
                            : (row as any)[col.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography color="text.secondary">{noDataText}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
  
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Box>
    );
  }
  
  export default GlobalTable;
  
