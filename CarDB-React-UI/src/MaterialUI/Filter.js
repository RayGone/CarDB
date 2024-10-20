import { 
    Box,
    Button,
    Divider,
    Stack, 
    Paper,
    Typography,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
import { filter1, columnDef, filterOps } from "../model";
import { useState } from "react";
import PropType from "prop-types";

export function AddFilterForm({onSubmit, onClose}){
    const [attr, setAttr] = useState("");
    const [isAttrSet, setIsAttrSet] = useState(true);
    const [operator, setOperator] = useState("");
    const [isOpSet, setIsOpSet] = useState(true);
    const [value, setValue] = useState(null);
    const [isValueNegative, setIsValueNegative] = useState(false);

    function handleSubmit(){
        if(isValueNegative) return;
        
        if(attr==="" || attr===null) setIsAttrSet(false);
        else if(operator === "" || operator===null) setIsOpSet(false);
        else if(value===null || value < 0) setIsValueNegative(true);
        else onSubmit({
            field: attr,
            ops: operator,
            value: value
        });
    }

    return (
        <Stack direction="row" useFlexGap spacing={2} sx={{alignItems:"center"}}>
            <Paper sx={{padding:"5px 10px", flexGrow:"2"}}>
                <Typography variant="subtitle2">Add Filter</Typography>
                <Divider />
                <br />
                <form>
                    <Stack useFlexGap spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id="attr-label">Attribute</InputLabel>
                            <Select
                                labelId="attr-label"
                                label="Attribute"
                                value={attr}
                                error={!isAttrSet}

                                onChange={(e)=>{
                                    setAttr(e.target.value);
                                    setIsAttrSet(true);
                                }}
                            >
                                {columnDef.map((col) => ["id","name","origin"].every(key => col.key!==key) && <MenuItem key={col.key} value={col.key}>{col.header.toUpperCase()}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="op-label">Operators</InputLabel>
                            <Select
                                labelId="attr-label"
                                label="Operators"
                                value={operator}
                                error={!isOpSet}

                                onChange={(e)=>{
                                    setOperator(e.target.value);
                                    setIsOpSet(true);
                                }}
                            >
                                {filterOps.map((op) => <MenuItem key={op.key} value={op.key}>{op.value.toUpperCase()}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                            <TextField label="Value" aria-describedby="my-helper-text" type="number" 
                                defaultValue={value}
                                error={isValueNegative}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value)
                                    setValue(v);
                                    if(v < 0){
                                        setIsValueNegative(true);
                                        return;
                                    }
                                    setIsValueNegative(false);
                                }}
                            />
                        </FormControl>
                    </Stack>
                </form>
                <br />
            </Paper>
            <Stack spacing={2}>
                <IconButton onClick={handleSubmit}><CheckIcon color="success" /></IconButton>
                <IconButton onClick={onClose}><CloseIcon color="warning" /></IconButton>
            </Stack>
        </Stack>
    )
}

AddFilterForm.propTypes = {
    onSubmit: PropType.func,
    onClose: PropType.func
}

export function FilterDisplay({filter, onDelete}){
    filter = {
        ...filter1,
        ...filter
    }
    function fieldMap(field){
        return columnDef.filter((c)=>c.key===field)[0]["header"];
    }

    function opMap(op){
        return filterOps.filter((c)=>c.key===op)[0]["value"];
    }
    return (
        <Stack direction="row" useFlexGap spacing={{xs:2,md:4}} sx={{alignItems:"center"}}>
            <Paper sx={{padding:"5px 10px", width: "80%"}}>
                <Stack useFlexGap sx={{alignItems: "center"}}>
                    <Typography variant="h6" sx={{fontWeight:"bold"}}>{fieldMap(filter.field)}</Typography>
                    <Typography>{opMap(filter.ops)}</Typography>
                    <Chip label={filter.value} />
                </Stack>
            </Paper>
                
            <IconButton onClick={onDelete}><DeleteIcon color="warning" /></IconButton>            
        </Stack>
    )
}

FilterDisplay.propTypes = {
    filter: PropType.any.isRequired,
    onDelete: PropType.func
}

export default function MUIFilterLayout({filters=[], onAdd, onDelete}){
    const [isAdd, setIsAdd] = useState(filters.length===0);
    return (
        <Box sx={{width: '30%', padding: "20px"}}>
            <Stack width="100%" direction={"row"} spacing={3} useFlexGap sx={{justifyContent: "space-between", alignItems:"center", mb:"10px"}}>
                <Typography variant="h6" sx={{fontWeight:"bolder"}}>Filters</Typography>
                <Button onClick={()=>{setIsAdd(true)}} startIcon={<AddIcon />} color="primary" variant="outlined"> Add</Button>
            </Stack>
            <Divider />
            <Stack width={"100%"} spacing={3} sx={{mx: "5px", mt: "10px"}}>
                {isAdd && <AddFilterForm 
                            onClose={()=>{
                                if(filters.length>0) setIsAdd(false);
                            }} 
                            onSubmit={onAdd} />}
                            
                {filters.map(
                    (f, i) => <FilterDisplay 
                                key={f.field+i} 
                                filter={f} 
                                onDelete={() => {
                                    if(filters.length===1) setIsAdd(true);
                                    onDelete(i);
                                }}/>
                    )
                }
            </Stack>
        </Box>
    )
}

MUIFilterLayout.propTypes = {
    filters: PropType.arrayOf(PropType.any),
    onAdd: PropType.func,
    onDelete: PropType.func
}