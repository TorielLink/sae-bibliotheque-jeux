import React from 'react';
import { Button } from '@mui/material';

function ColorButtons() {
  return (
    <div>
      <Button variant="contained" sx={{ backgroundColor: 'green.main' }}>Vert</Button>
      <Button variant="contained" sx={{ backgroundColor: 'red.main' }}>Rouge</Button>
      <Button variant="contained" sx={{ backgroundColor: 'purple.main' }}>Violet</Button>
      <Button variant="contained" sx={{ backgroundColor: 'blue.main' }}>Bleu</Button>
      <Button variant="contained" sx={{ backgroundColor: 'orange.main' }}>Orange</Button>
    </div>
  );
}

export default ColorButtons
