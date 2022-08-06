import { DialogContentText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useEffect, useState } from 'react';

import { addSIBContact } from '../../../../Store/action/sendInBlueAction';

export default function CSVSelectEmailField({
  open = false,
  closeModal = console.log,
  csvDatas = [],
  onFinish = console.log,
  ...props
}) {
  const [key, setKey] = useState('')
  const [countDone, setCountDone] = useState(0)

  const handleSelect = (selectedKey) => {
    setKey(selectedKey)
    const emailList = csvDatas?.map((item) => item?.[selectedKey])
    handleCreate(
      emailList,
      0,
      () => {
        setCountDone((s) => s + 1)
      },
      () => {
        onFinish()
      },
    )
  }

  const handleCreate = (
    list = [],
    currentIndex = 0,
    onEach = console.log,
    onFinish = console.log,
  ) => {
    if (currentIndex >= list?.length) {
      onFinish()
      return
    }
    addSIBContact(
      {
        email: list?.[currentIndex],
        name: list?.[currentIndex],
      },
      () => {
        handleCreate(list, currentIndex + 1, onEach, onFinish)
        onEach()
      },
    )
  }

  const handleClose = () => {
    closeModal()
  }

  useEffect(() => {
    setKey('')
  }, [open])

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Contact</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Select Column that is containing Email address.
          </DialogContentText>
          {Boolean(key?.length) ? (
            <div>
              {countDone}/{csvDatas.length} uploaded.
            </div>
          ) : (
            <div>
              {Object.keys(csvDatas?.[0] ?? {}).map((data, index) => (
                <button
                  key={index}
                  className="btn btn-xs btn-gradient btn-gradient-two"
                  style={{ marginRight: 10 }}
                  onClick={() => handleSelect(data)}
                >
                  {data}
                </button>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onFinish} type="submit" color="primary">
            Add
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
