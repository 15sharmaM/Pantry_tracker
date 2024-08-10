'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import React from 'react';
// import styled from '@emotion/styled';
// import videoBg from '../public/videoBg.mp4';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Urbanist", sans-serif',
    h2: {
      fontFamily: '"Urbanist", sans-serif',
      fontWeight: 700,
      letterSpacing: '16px',
      color: '#f4f6f3', // Default font color
    },
    h4: {
      fontFamily: '"Urbanist", sans-serif',
      fontWeight: 700,
      letterSpacing: '16px',
      color: '#f4f6f3', // Default font color
    },
  },
  palette: {
    ochre: {
      main: '#ff6404',
      light: '#f4f6f3',
      dark: '#080404',
      contrastText: '#f4f6f3',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#f4f6f3', // Default background color
          color: '#080404', // Default font color
          '&:hover': {
            backgroundColor: '#080404', // Background color on hover
            color: '#f4f6f3', // Font color on hover
          },
        },
      },
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

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
  };

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
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = inventory.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (

  <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url('/green.jpeg')`, // Background image
        backgroundSize: 'cover', // Cover the whole container
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Do not repeat the image
        bgcolor: "#f4f6f3", // Fallback background color
        gap: 2
      }}
    >
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography variant="h2">Pantry King</Typography>
        </Grid>
      </ThemeProvider>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box width="100%" display="flex" marginBottom="5px" outline="2px solid">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
        <Box display="flex" padding="20px">
          <ThemeProvider theme={theme}>
            <TextField
              variant="outlined"
              width="800px"
              display="flex"
              placeholder="Search Items"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{
                marginBottom: 2,
                borderRadius: "10px",
                marginRight: 20,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f4f6f3',
                  color: '#080404',
                  '&:hover': {
                    backgroundColor: theme.palette.ochre.dark,
                    color: theme.palette.ochre.contrastText,
                  },
                  '& fieldset': {
                    borderColor: '#080404',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.ochre.dark,
                  },
                  '& input': {
                    color: '#080404',
                  },
                  '&:hover input': {
                    color: theme.palette.ochre.contrastText,
                  },
                },
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    color: '#9e9e9e',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{ borderRadius: 'inherit', height: "50px", marginLeft: "50px" }}
              onClick={handleOpen}
            >
              Add Items
            </Button>
          </ThemeProvider>
        </Box>
        </Grid>
      </Box>

      <Grid container direction="row" justifyContent="center" alignItems="center">
          <Box border="1px solid" opacity="0.5">
            <ThemeProvider theme={theme}>
              <Grid
                width="800px"
                height="100px"
                display="flex"
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <Typography variant="h4">Inventory Items</Typography>
              </Grid>
              <Box border="1px solid" width="fill"></Box>
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Stack width="800px" height="300px" spacing={2} overflow="auto">
                  {filteredInventory.map(({ name, quantity }) => (
                    <Grid
                      key={name}
                      display="flex"
                      padding={2}
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center" // This aligns all items horizontally
                    >
                      <Grid item xs={4}>
                        <Typography variant="h3" textAlign="center">
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h3" textAlign="center">
                          {quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} display="flex" justifyContent="flex-start" alignItems="center">
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 'inherit',opacity: 0.9 }}
                            onClick={() => addItem(name)}
                          >
                            ADD
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 'inherit', opacity:0.9 }}
                            onClick={() => removeItem(name)}
                          >
                            REMOVE
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              </Grid>
            </ThemeProvider>
          </Box>
        </Grid>
    </Box>
    </Grid>
  )}
