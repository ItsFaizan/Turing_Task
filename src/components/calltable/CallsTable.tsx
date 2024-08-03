import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Pagination,
  SelectChangeEvent
} from "@mui/material";
import { formatDate, formatDuration } from "@/utils/helper";
import Filter from "../filter/filter";

interface Call {
  id: string;
  duration: number;
  is_archived: boolean;
  from: string;
  to: string;
  direction: string;
  call_type: string;
  via: string;
  created_at: string;
  notes: { id: string; content: string }[];
}

interface CallsTableProps {
  calls: Call[];
  onAddNote: (call: Call) => void;
  page: number;
  totalPages: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onArchiveCall: (callId: string) => void;
}

const CallsTable: React.FC<CallsTableProps> = ({
  calls,
  onAddNote,
  onArchiveCall,
  page,
  totalPages,
  onPageChange,
}) => {
  const [filter, setFilter] = useState<string>("all");

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  const filteredCalls = calls.filter(call => {
    if (filter === "all") return true;
    if (filter === "archived") return call.is_archived;
    if (filter === "unarchive") return !call.is_archived;
    return true;
  });

  return (
    <Paper>
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f4f9" }}>
              <TableCell>Call Type</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Via</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCalls.map((call) => (
              <TableRow key={call.id}>
                <TableCell
                  sx={{
                    color:
                      call.call_type === "answered"
                        ? "#4ed4c6"
                        : call.call_type === "voicemail"
                        ? "blue"
                        : call.call_type === "missed"
                        ? "red"
                        : "black",
                  }}
                >
                  {call.call_type}
                </TableCell>
                <TableCell sx={{ color: "blue" }}>{call.direction}</TableCell>
                <TableCell>{formatDuration(call.duration)}</TableCell>
                <TableCell>{call.from}</TableCell>
                <TableCell>{call.to}</TableCell>
                <TableCell>{call.via}</TableCell>
                <TableCell>{formatDate(call.created_at)}</TableCell>
                <TableCell>
                <span
                style={{
                  color: call.is_archived ? "#4ed4c6" : "black",
                  backgroundColor: call.is_archived ? "#edfbfa" : "#eeeeee",
                  padding: "4px 6px",
                  cursor: call.is_archived ? "pointer" : "default",
                }}
                onClick={() => onArchiveCall(call.id)}
              >
                {call.is_archived ? "Archived" : "Unarchive"}
              </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: "2px 8px", textTransform: "none" }}
                    onClick={() => onAddNote(call)}
                  >
                    Add Note
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 2 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(event, page) => onPageChange(event as React.MouseEvent<HTMLButtonElement>, page)}
            siblingCount={1}
            boundaryCount={1}
            shape="rounded"
            sx={{ "& .MuiPaginationItem-root.Mui-selected": { backgroundColor: "blue", color:'#fff' } }}
          />
          <Typography variant="caption" sx={{ mt: 1 }}>
            Showing {page * 10 + 1} - {Math.min((page + 1) * 10, 10 * totalPages)} of {totalPages * 10} items
          </Typography>
        </Box>
      </TableContainer>
    </Paper>
  );
};

export default CallsTable;
