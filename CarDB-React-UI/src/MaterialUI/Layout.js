import { Link } from "react-router-dom";
import {
    CssBaseline, 
    Box, 
    AppBar,
    IconButton, 
    Typography, 
    Toolbar,
    Button,
    Stack
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from '@mui/icons-material/Add';


import {downloadURL} from "../fetch";
import StyledSearch from "./Search";
import PropTypes from 'prop-types';



export default function MUILayout({children, search, onSearch, onAdd, onDownload, footerEl}){
  return (
      <>
          <CssBaseline />            
              
          <Box sx={{ flexGrow: 1, height: "100%" }}>
              <AppBar position="sticky" sx={{backgroundColor: "#eff3f5"}}> 
                  <Toolbar sx={{flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
                      <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
                        <IconButton aria-label="Logo" disableTouchRipple><img className="logo" src="/car.jpg" alt="Logo - a Car" /></IconButton>
                        <Typography component="div" variant="h4" sx={{ fontWeight:"bolder", color: "rgb(170, 127, 255)", textShadow:"2px 2px 8px rgba(107, 113, 73, 0.8)"}}>CarDB</Typography>
                      </Stack>

                      <Box color="#333">Switch to: <Link to="/custom">Custom View</Link></Box>
                      
                      <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
                        <StyledSearch search={search} onSearch={onSearch}/>
                        <Button onClick={onAdd} startIcon={<AddIcon />} color="primary" variant="contained">Add Car</Button>
                        <Button href={downloadURL} startIcon={<DownloadIcon />} color="secondary" variant="contained">Download</Button>
                      </Stack>
                  </Toolbar>            
              </AppBar>

              <Stack spacing={3} sx={{marginTop: "10px", padding:"5px 10px"}}>                    
                <Stack direction="row" spacing={2}>
                  {children}
                </Stack>

                  <br />
                  {footerEl}
              </Stack>
          </Box>
      </>
  )
}

MUILayout.propTypes = {
  children: PropTypes.any,
  search: PropTypes.string,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  footerEl: PropTypes.any,
//   limit: PropTypes.number.isRequired,
};