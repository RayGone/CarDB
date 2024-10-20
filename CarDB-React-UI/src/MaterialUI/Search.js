import {
    InputBase,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import {styled, alpha} from "@mui/material/styles";
import PropTypes from 'prop-types';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.25),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.35),
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

export default function StyledSearch({search, onSearch}){
return (
    <Search>
    <SearchIconWrapper>
        <SearchIcon />
    </SearchIconWrapper>
    <StyledInputBase
        onChange={(e) => {onSearch(e.target.value)}}
        placeholder="Search…"
        value={search}
        inputProps={{ 'aria-label': 'search' }}
        />
    </Search>
)
}

StyledSearch.propTypes = {
    search: PropTypes.string,
    onSearch: PropTypes.func
}