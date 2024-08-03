import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

interface FilterProps {
  filter: string;
  onFilterChange: (event: SelectChangeEvent) => void;
}

const Filter: React.FC<FilterProps> = ({ filter, onFilterChange }) => (
  <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
     <Typography variant="h6" sx={{mr:2}}>Filter by:</Typography>
    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={filter}
        onChange={onFilterChange}
        label="Status"
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="archived">Archived</MenuItem>
        <MenuItem value="unarchive">Unarchive</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

export default Filter;
