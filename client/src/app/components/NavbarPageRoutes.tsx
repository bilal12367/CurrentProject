import { Button, Grid } from '@mui/material'
import React, { useEffect } from 'react'

interface propType {
  onLg: boolean
}

const NavbarPageRoutes: React.FC<propType> = ({ onLg }: propType): any => {
  var display = {}
  var direction = {}
  if (onLg == true) {
    display = { xs: 'none', lg: 'flex', xl: 'flex' }
    direction = 'row'
  } else if (onLg == false) {
    display = { xs: 'block', lg: 'none', xl: 'none' }
    direction = { xs: 'column', lg: 'row', md: 'column', xl: 'row' }
  }
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 2, lg: 5, xl: 5 }}
      display={display}
      direction={direction}
    >
      <Grid item>
        <Button variant="text">Home</Button>
      </Grid>
      <Grid item>
        <Button variant="text">Download</Button>
      </Grid>
      <Grid item>
        <Button variant="text">Support</Button>
      </Grid>
      <Grid item>
        <Button variant="text">About Us</Button>
      </Grid>
      <Grid item>
        <Button variant="text">Contact</Button>
      </Grid>
    </Grid>
  )
}

export default NavbarPageRoutes
