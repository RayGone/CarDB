import { Button, Dialog, DialogActions,
    DialogContent, DialogTitle, Divider,
    FormControl, Stack, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '@mui/icons-material/Send';
import { columnDef } from "../model";
import { useReducer, useState } from "react";

const car = {
                "name":"",
                "mpg":"",
                "cylinders":"",
                "displacement":"",
                "horsepower":"",
                "weight":"",
                "acceleration":"",
                "model_year":"",
                "origin":"",
            }
        
const validation =  {
                "name":true,
                "mpg":true,
                "cylinders":true,
                "displacement":true,
                "horsepower":true,
                "weight":true,
                "acceleration":true,
                "model_year":true,
                "origin":true,
            }

const formReducer = (state, action) => {
    const new_state = {
        ...state,
        [action.key]: action.value
    }
    return new_state;
}
    
function formValidation(state, setter){
    const required = columnDef.filter((col) => col.required);
    const number = columnDef.filter((col) => col.type === "number");

    if( // Required fields are not set
        required.some((col) => {
            const status = (state[col.type] === "number" ? state[col.key] < 0 : state[col.key] === "") || state[col.key] === null;
            // console.log(status, col.header, state[col.key] )
            setter(val => {
                return {
                    ...val,
                    [col.key]: !status
                }
            });
            return status;
        })
    ) return false;

    if( // Number fields are below 0
        number.some((col) => {
            const status = state[col.key] < 0;
            setter(
                val => {
                    return {
                        ...val,
                        [col.key]: !status
                    }
                }
            )
            return status;
        })
    ) return false;

    return true;
}

export default function FormDialog({open=false, init=null, onSubmit, onClose}){
    const [carState, carDispatcher] = useReducer(formReducer, init ? init : car);
    // console.log({carState});
    const [validationState, validationSetter] = useState(validation)

    function handleSubmit(){
        if(formValidation(carState, validationSetter)){
            var car = {...carState};
            columnDef
                .filter((col) => col.type === "number")
                .forEach((col) => {
                    car[col.key] = car[col.key] === "" ? null : car[col.key];
                });
            
            delete(car.id);
            onSubmit(car);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle>
                Add Car
            </DialogTitle>
            <Divider />
            <DialogContent sx={{maxHeight: "60vh"}}>                  
                <form>
                    <Stack  sx={{minWidth:"400px"}} useFlexGap spacing={2}>           
                        {
                            columnDef.map((col)=> {
                                if(col.key === "id") return null;
                                return (
                                    <FormControl fullWidth key={col.key}>
                                        {/* <InputLabel id="attr-label">{col.header}</InputLabel> */}
                                        <TextField onChange={(e)=>{carDispatcher({key: col.key, value: e.target.value})}} label={col.header} type={col.type} name={col.key} required={col.required} value={carState[col.key]} error={!validationState[col.key]}></TextField>
                                    </FormControl>
                                );
                            })
                        }               
                    </Stack> 
                </form>   
            </DialogContent>
            <DialogActions sx={{boxShadow: "0 -2px 2px #ccc"}}>
                <Button onClick={handleSubmit} variant="contained" color="primary" endIcon={<SendIcon />}>Submit</Button>
                <Button onClick={onClose} variant="contained" color="warning" endIcon={<CloseIcon />}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}