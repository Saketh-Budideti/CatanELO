import { Typography }  from '@mui/material'
import React from 'react'

// Prop for the Logo 
function Logo({fontSize = "50px"}) {
    return (
        <Typography 
        variant='h1'
        sx = {{
            fontSize: fontSize,        // font-size
            fontFamily: '"League Spartan", sans-serif',  // font-family
            fontWeight: 900  
        }}
        >
            @wrapper.
        </Typography>
    )
}
export default Logo;