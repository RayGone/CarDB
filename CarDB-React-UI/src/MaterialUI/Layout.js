import { Link } from "react-router-dom";
import {
    CssBaseline, 
    Box, 
    AppBar,
    IconButton, 
    Typography, 
    Toolbar,
    InputBase,
    Button,
    Stack
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from '@mui/icons-material/Add';

import {styled, alpha} from "@mui/material/styles";

import {downloadURL} from "../fetch";

export default function MUILayout({children, search="", onSearch, onAdd, onDownload, footerEl}){
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
      }));
      
      const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));
      
      const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
      }));

    return (
        <>
            <CssBaseline />            
                
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{backgroundColor: "#eff3f5"}}> 
                    <Toolbar sx={{flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
                        <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
                            <IconButton aria-label="Logo" disableTouchRipple><img className="logo" src="/car.jpg" alt="Logo - a Car" /></IconButton>
                            <Typography component="div" variant="h4" sx={{ fontWeight:"bolder", color: "rgb(170, 127, 255)", textShadow:"2px 2px 8px rgba(107, 113, 73, 0.8)"}}>CarDB</Typography>
                        </Stack>

                        <Box color="#333">Switch to: <Link to="/custom">Custom View</Link></Box>
                        
                        <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    />
                            </Search>
                            <Button startIcon={<AddIcon />} color="primary" variant="contained">Add Car</Button>
                            <Button href={downloadURL} startIcon={<DownloadIcon />} color="secondary" variant="contained">Download</Button>
                        </Stack>
                    </Toolbar>            
                </AppBar>

                <Stack spacing={3} sx={{marginTop: "10px", padding:"5px 10px"}}>                    
                    <Stack direction="row" spacing={2}>
                        {children}
                    </Stack>

                    <div>
                        
                    </div>
                    {footerEl}
                </Stack>
            </Box>
        </>
    )
}