import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import Grid from '@material-ui/core/Grid'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FontAwesome from 'react-fontawesome'
import AddCard from '../modal/add-card'
import { RadioGroup } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import * as Actions from '../../../../Store/action/widget'
import { db } from '../../../../services/firebase'
import { makeStyles } from '@material-ui/core/styles'
import toastr from 'toastr'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'none !important',
  },
}))

export default function BoostAds(props) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const paymentInfo = useSelector((state) => state.widget.payment_data)
  const [selected, setSelected] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [boostData, setBoostData] = useState([])
  const [selectedBoost, setSelectedBoost] = useState(null)
  const [status, setStatus] = useState(false)

  // const [latLong, setLatLong] = useState([]);
  useEffect(() => {
    // L.esri.Geocoding.geocode()
    //   .text("380 New York St, Redlands, California, 92373")
    //   .run(function (err, results, response) {
    //     if (err) {
    //       console.log(err);
    //       return;
    //     }
    //     console.log(results);
    //   });
    // let google = window.google;
    // var geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ address: props.address }, function (results, status) {
    //   // var location = results[0].geometry.location;
    //   // setLatLong(["36.778261 ° N, 119.41793240000001 ° W"])
    // });
    dispatch(Actions.getPaymentInfo())
  }, [dispatch])

  useEffect(() => {
    db.collection('ad_subscription')
      .where('type', '==', 'boost')
      .get()
      .then((res) => {
        if (!res.empty) {
          const boostData = res.docs.map((doc) => doc.data())
          setBoostData(boostData)
        }
      })
      .catch((error) => {
        console.log(error, 'boost')
        setBoostData([])
      })
  }, [])

  const setBoostAds = () => {
    if (paymentId === '' || !selected) {
      toastr.info('Select card information or boost type!')
      return false
    }
    setStatus(true)
    dispatch(
      Actions.setBoostCamp(props.id, paymentId, selected, selectedBoost),
    ).then((res) => {
      if (res) {
        props.onClose(false)
        setStatus(false)
      }
    })
  }

  return (
    <div>
      <Dialog open={props.flag} maxWidth="md">
        <DialogTitle className="calendar-title">
          Boost Camp Payment
          <div
            className="top-cross-boost"
            onClick={(e) => props.onClose(false)}
          >
            <FontAwesome name="times" id="top-close" />
          </div>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={4} alignItems="center" justify="center">
            {boostData.length > 0 &&
              boostData.map((item, key) => {
                return (
                  <Grid item md={6} lg={6} sm={6} xs={6} key={key}>
                    <div
                      className={
                        selected === item.id
                          ? 'featured-plan pointer featured-selected'
                          : 'featured-plan pointer'
                      }
                      onClick={(e) => {
                        setSelected(item.id)
                        setSelectedBoost(item)
                      }}
                    >
                      <p>{item.plan_name}</p>
                      <h2>$ {item.fees}</h2>
                      <p>{item.day} Days</p>
                    </div>
                  </Grid>
                )
              })}
          </Grid>
          <div className="featured-card-list">
            <div className="card-list">
              <RadioGroup
                aria-label="delaied"
                name="delaied"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
              >
                {paymentInfo.length > 0 ? (
                  paymentInfo.map((item, key) => {
                    return (
                      <FormControlLabel
                        key={key}
                        value={item.id}
                        control={<Radio className="cu-icon-color" />}
                        label={'xxxx-xxxx-xxxx-' + item.card.last4}
                      />
                    )
                  })
                ) : (
                  <div>There is no card Information</div>
                )}
              </RadioGroup>
            </div>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-md-7 col-sm-7 position-relative">
                <button className={`boost-btn-pay`} onClick={setBoostAds}>
                  Pay
                </button>
                {status && <CircularProgress className={classes.root} />}
              </div>
              <div className="col-md-5 col-sm-5">
                <button
                  type="button"
                  className="btn btn-outline-success cu-radius add-card-btn"
                >
                  <FontAwesome name="credit-card" />
                  Add Card
                </button>
              </div>
            </div>
          </div>
          <AddCard />
        </DialogContent>
      </Dialog>
    </div>
  )
}
