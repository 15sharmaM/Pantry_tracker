'use client'
import Image from "next/image";
import { useState, useEffect } from "react";  
import { firestore } from '@/firebase'
import { Box, Button, IconButton, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import React from "react";
import styled from "@emotion/styled";
import videoBg from '../public/videoBg.mp4';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { light } from "@mui/material/styles/createPalette";
<style>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
</style>




// // Page component
// const Page = () => {
//   return (
//     <div>
//       <video src={require('../public/videoBg.mp4')} autoPlay loop/>
//     </div>
//   );
// };

// export { Page };


export default function Home() {
  const [inventory, setInventory] = useState ([])
  const [open, setOpen] = useState (false)
  const [itemName, setItemName] = useState ('')
  //guciiiiii
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([])

  // Create the theme with custom styles for the button
  const theme = createTheme({
    typography: {
      fontFamily: '"Urbanist", sans-serif',
      h2: {
        fontFamily: '"Urbanist", sans-serif',
        fontWeight: 700,
        letterSpacing: '16px',
        color: '#f4f6f3', // Default font color
      },
      h4:
      {
        fontFamily: '"Urbanist", sans-serif',
        fontWeight: 700,
        letterSpacing: '300px',
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

  const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 1,
    width: '5rem',
    height: '5rem',


  }

  


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    ///guciiii
    setFilteredInventory(inventoryList);
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc (docRef, {quantity: quantity+1}) 
    } 
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      //get quantity from data
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc (docRef, {quantity: quantity -1})
      }
    }

    await updateInventory()
  }


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

  useEffect( () => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true) 
  const handleClose = () => setOpen(false)

  return (
    // main background
    <Box 
    width = "100vw" 
    height="100vh" 
    display="flex" 
    justifyContent="center" 
    alignItems="center"
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
      <Box>
        <Typography variant="h2" >Pantry King</Typography>
      </Box>
    </ThemeProvider>







      <Modal
        open={open} 
        onClose={handleClose}>
          {/* The add items popup box */}
          <Box 
            position = "absolute" 
            top= "50%" 
            left = "50%" 
            width= {400}
            bgcolor = "white"
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
                  variant = "outlined"
                  fullWidth
                  value = {itemName}
                  display="flex"
                  onChange={(e) => {
                    setItemName(e.target.value)
                  }}  
                />
                <Button
                variant = "outlined"
                onClick={ () => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
                >Add
                </Button>
              </Stack>
          </Box>
      </Modal>

  <Box width= "100%" display="flex" alignItems="center" marginBottom="5px" outline="2px solid" >

   <Box alignItems="center"  display="flex" 
          justifyContent="center" padding="20px" paddingLeft="500px">   
    <ThemeProvider theme={theme}>
      <Box>
        {/* Search bar */}
        <TextField
          variant="outlined"
          width="800px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          placeholder="Search Items"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            marginBottom: 2,
            borderRadius: "10px", // Adjusted radius to match the style
            marginRight: 20,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f4f6f3', // Initial background color (light color)
              color: '#080404', // Initial font color (dark color)
              '&:hover': {
                backgroundColor: theme.palette.ochre.dark, // Background on hover
                color: theme.palette.ochre.contrastText,   // Font color on hover
              },
              '& fieldset': {
                borderColor: '#080404', // Initial outline color (dark color)
              },
              '&:hover fieldset': {
                borderColor: theme.palette.ochre.dark, // Outline color on hover
              },
              '& input': {
                color: '#080404', // Initial font color (dark color)
              },
              '&:hover input': {
                color: theme.palette.ochre.contrastText, // Font color on hover
              },
            },
            '& .MuiInputBase-input': {
              '&::placeholder': {
                color: '#9e9e9e', // Placeholder color (grey shade)
              },
            },
          }}
        />
      </Box>
    </ThemeProvider>
      <ThemeProvider theme={theme}> 
        <Box display="flex">
         
          <Button 
            variant = "contained"
            sx={{ borderRadius: 'inherit', height: "50px", marginLeft: "30px" }}
            paddingBottom = "30px"
            marginBottom= "30px"
            justifyContent= "center"
            alignItems="center"
            // color="ochre"
            onClick={ () => {
              handleOpen()
            }}
            >Add Items
          </Button>
        </Box> 
      </ThemeProvider>
   </Box>
      
  </Box>


  

  <Box border = "1px solid "
  opacity= "0.5"
  >
    <ThemeProvider theme={theme}>
      <Box
      width = "800px"
      height = "100px"
      display= "flex"
      alignItems= "center"
      justifyContent= "center"
      >
        
          <Typography 
          variant="h4"
          >
            Inventory Items
          </Typography>
        
      </Box>
      <Box border = "1px solid " width= "fill"></Box>
    </ThemeProvider>
    
  <ThemeProvider theme={theme}> 
    <Stack 
    width="800px"
    height="300px"
    spacing={2}
    overflow= "auto">
      {filteredInventory.map(({name, quantity}) => (
          <Box 
          key={name}
          width="100%"
          minHeight="150px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          //TABLE ITEMS quantity BACKGROUND
          
          padding={5}
          >
            <Typography 
            variant="h3"
            
            textAlign="center">
            {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Box direction="column"
            textAlign="center">
            <Typography 
            variant="h3"
            >
              {quantity}  
            </Typography>
            </Box>
            
            {/* Add items */}
            <ThemeProvider theme={theme}>  
              <Stack direction="row" spacing={2} >
              <Button
              variant="contained"
              sx={{borderRadius: 'inherit' }}
              onClick={() => {
                addItem(name)
              }}
              >ADD</Button>
            

            {/* Remove Items */}
            <Button
            variant="contained"
            sx={{borderRadius: 'inherit' }}
            onClick={() => {
              removeItem(name)
            }}
            >REMOVE</Button>
            </Stack>
            </ThemeProvider>
          </Box>
      ))}
    </Stack>
  </ThemeProvider>
  </Box>
</Box>
    
      
    
      )
}
