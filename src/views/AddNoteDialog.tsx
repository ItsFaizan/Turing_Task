import React from 'react';
import { Dialog, DialogActions, Button, TextField, Typography, Divider, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onAddNote: (noteContent: string) => void;
  noteContent: string;
  setNoteContent: React.Dispatch<React.SetStateAction<string>>;
  selectedCall: {
    id: string;
    duration: number;
    from: string;
    to: string;
    via: string;
    call_type: string;
  } | null;
}

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({ open, onClose, onAddNote, noteContent, setNoteContent, selectedCall }) => {
  if (!selectedCall) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Typography sx={{mx:1.4, fontWeight:'bold', mt:4}}>Add Notes</Typography>
      <IconButton
      edge="end"
      color="inherit"
      onClick={onClose}
      aria-label="close"
      sx={{ position: 'absolute', right: 20, top: 8 }} 
    >
      <CloseIcon />
    </IconButton>
      <Box sx={{mx:1.4}}>
        <Typography variant="body2" color="primary" sx={{my:1}}>Call ID {selectedCall.id}</Typography>
        <Divider />
        <Typography variant="body2" sx={{mt:4}}><strong>Call Type:</strong> {selectedCall.call_type}</Typography>
        <Typography variant="body2" sx={{my:2}}><strong>Duration:</strong> {Math.floor(selectedCall.duration / 60)} Minutes {selectedCall.duration % 60} Seconds</Typography>
        <Typography variant="body2" sx={{my:2}}><strong>From:</strong> {selectedCall.from}</Typography>
        <Typography variant="body2" sx={{my:2}}><strong>To:</strong> {selectedCall.to}</Typography>
        <Typography variant="body2" sx={{my:2}}><strong>Via:</strong> {selectedCall.via}</Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Add Notes"
          type="text"
          fullWidth
          multiline
          minRows={3}
          variant="outlined"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          sx={{ mt: 2 }}
        />
      </Box>
      <Divider />
      <DialogActions>
        <Button variant="contained" onClick={() => onAddNote(noteContent)} fullWidth>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNoteDialog;
