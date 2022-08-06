import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import toastr from 'toastr';

import { addGroup } from '../../../../Store/action/contactActions';

export default function AddContactGroup({ onCreate = console.log, ...props }) {
  const user = JSON.parse(sessionStorage.getItem('user'))
  const [name, setName] = useState()

  const handleClose = () => {
    props.closeModal()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toastr.info('Just seconds.')
    addGroup(
      {
        id: user?.id ?? '',
        name: name,
      },
      (res) => {
        console.log(res)
        toastr.success(`Successfully Added.`)
        onCreate(res)
        handleClose()
      },
      () => {
        onCreate(false)
        handleClose()
      },
    )
    setName('')
  }

  const handleName = (e) => {
    setName(e.target.value)
  }
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={props.open}
        onClose={props.closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Contact</DialogTitle>
        <ValidatorForm
          // ref="form"
          onSubmit={handleSubmit}
          onError={(errors) => console.log(errors)}
        >
          <DialogContent>
            <TextValidator
              label="Name"
              onChange={handleName}
              name="name"
              fullWidth
              value={name ?? ''}
              validators={['required']}
              errorMessages={['this field is required']}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Add
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </>
  )
}
