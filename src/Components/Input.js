import React from 'react';
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';

const Input = ({ name, autoFocus, half, label, value, type, handleChange, handleShowPassword, required , error}) => {

    return (
        <Grid item xs={12} sm={half ? 6 : 12}>
            <TextField
                name={name}
                onChange={handleChange}
                autoFocus={autoFocus}
                value={value}
                label={label}
                type={type}
                variant='outlined'
                fullWidth
                error={error}
                required={required}
                InputProps={(name === 'confirmPassword' || name === 'password') && {
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton onClick={handleShowPassword}>
                                {type==='password' ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {error? (name==='username'? <FormHelperText id="component-error-text">{name} should be in between 3 to 8 characters</FormHelperText>:<FormHelperText id="component-error-text">{name} should be greater than or equal to 8 characters</FormHelperText>):<></>}
        </Grid>
    )
};

export default Input;