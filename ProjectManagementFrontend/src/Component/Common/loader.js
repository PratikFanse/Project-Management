import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const style={
    minHeight: '100vh',
    with:"100%",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    left:'48%',
    position:'absolute'
}

export default function Loader(){
    return(
        <Box sx={style}>
          <CircularProgress disableShrink/>
        </Box>
    )
}