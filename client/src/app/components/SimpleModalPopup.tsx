import React, { ReactElement, ReactNode } from 'react'
import { Modal, Typography, Box } from '@mui/material'
interface PropType {
    children: ReactElement
}

const SimpleModalPopup = ({children}: PropType) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
           {children}
        </Modal>
    )
}

export default SimpleModalPopup