'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Typography, Modal, Stack, TextField, Button, Container, Grid, Paper, InputBase, IconButton } from '@mui/material';
import { collection, getDocs, query, doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => { setOpen(true); }
  const handleClose = () => { setOpen(false); }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredInventory(filtered);
  }

  return (
    <Box sx={{ bgcolor: '#ADD8E6', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
          <Modal open={open} onClose={handleClose}>
            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" bgcolor="white"
              width={400} border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3}>
              <Typography variant="h6">Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant='outlined'
                  fullWidth
                  label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                <Button variant="outlined" onClick={() => {
                  addItem(itemName)
                  setItemName('');
                  handleClose();
                }}>
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Button variant="contained" onClick={handleOpen}>
              Add New Item
            </Button>
            <Box display="flex" alignItems="center" bgcolor="white" borderRadius={1} p={1} boxShadow={1}>
              <InputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchTerm}
                onChange={handleSearch}
              />
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          <Paper elevation={3} sx={{ width: '100%', padding: 2, mt: 2 }}>
            <Box bgcolor="#ADD8E6" alignItems="center" justifyContent="center" display="flex" py={2}>
              <Typography variant="h4" color="#333">
                Inventory Items
              </Typography>
            </Box>

            <Grid container spacing={2} mt={2} style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredInventory.map((item) => (
                <Grid item xs={12} key={item.name}>
                  <Paper elevation={1} sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="h6">{item.quantity}</Typography>
                    <Button variant="contained" color="primary" onClick={() => removeItem(item.name)}>
                      Remove
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

