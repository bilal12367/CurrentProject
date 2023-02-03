import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography/Typography';
import React from 'react'

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            {children}
          </Box>
        )}
      </div>
    );
  }

export default TabPanel