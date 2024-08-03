'use client'
import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import CallsTable from '@/components/calltable/CallsTable';
import AddNoteDialog from '@/views/AddNoteDialog';
import Navbar from '@/components/navbar/Navbar';
import { setUpTokenRefresh } from '@/utils/tokenHelper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Dashboard: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(true);    
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit] = useState<number>(10); // Limit per page
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setUpTokenRefresh();
  }, []);

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://frontend-test-api.aircall.dev/calls?page=${page + 1}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/'); 
          } else {
            throw new Error('Failed to fetch calls');
          }
        }

        const data = await response.json();
        setCalls(data.nodes);
        setTotalPages(Math.ceil(data.totalCount / limit)); 
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [page, limit, router]);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage - 1); 
  };

  const handleAddNote = async (noteContent: string) => {
    if (selectedCall) {
      try {
        const response = await fetch(`https://frontend-test-api.aircall.dev/calls/${selectedCall.id}/note`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: noteContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to add note');
        }

        setCalls(calls.map(call => 
          call.id === selectedCall.id 
          ? { ...call, notes: [...call.notes, { id: '', content: noteContent }] } 
          : call
        ));

        setNoteContent('');
        setDialogOpen(false);

        // Show success toast
        toast.success('Note added successfully!');
      } catch (error: any) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleArchiveCall = async (callId: string) => {
    try {
      const response = await fetch(`https://frontend-test-api.aircall.dev/calls/${callId}/archive`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to archive/unarchive call');
      }

      const updatedCall = await response.json();
      setCalls(calls.map(call => 
        call.id === callId ? { ...call, is_archived: updatedCall.is_archived } : call
      ));

      // Show success toast
      toast.success(updatedCall.is_archived ? 'Call archived successfully!' : 'Call unarchived successfully!');
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  const openAddNoteDialog = (call: Call) => {
    setSelectedCall(call);
    setDialogOpen(true);
  };

  const closeAddNoteDialog = () => {
    setSelectedCall(null);
    setNoteContent('');
    setDialogOpen(false);
  };

  return (
    <>
    <Navbar/>
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{mt:4}}>
        Dashboard of Turing Technologies Frontend Test
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <>
          <CallsTable
            calls={calls}
            onAddNote={openAddNoteDialog}
            onArchiveCall={handleArchiveCall}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          {selectedCall && (
            <AddNoteDialog
              open={dialogOpen}
              onClose={closeAddNoteDialog}
              onAddNote={handleAddNote}
              noteContent={noteContent}
              setNoteContent={setNoteContent}
              selectedCall={selectedCall}
            />
          )}
        </>
      )}
    </Container>
    <ToastContainer  position="top-center" 
        autoClose={1000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick  />
    </>
  );
};

export default Dashboard;
