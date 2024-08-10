import { firestore } from '@/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import React from 'react';

// Import required components from @mui/material
import { Box, Button, Modal, Stack, TextField, Typography, Grid } from '@mui/material';

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
    <Grid container direction="row" justifyContent="center" alignItems="center">
  <Box
    border={1}
    opacity={0.5}
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: 'background.paper', // Use theme colors
      borderRadius: 2, // Add border radius
      boxShadow: 2, // Add box shadow
      p: 4, // Add padding
    }}
  >
    <ThemeProvider theme={theme}>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Typography variant="h4">Inventory Items</Typography>
      </Grid>
      <Box border={1} width="100%" />
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack width="100%" height={300} spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Grid
              key={name}
              display="flex"
              padding={2}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
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
                    sx={{ borderRadius: 1, opacity: 0.9 }}
                    onClick={() => addItem(name)}
                  >
                    ADD
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 1, opacity: 0.9 }}
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


    )
}
