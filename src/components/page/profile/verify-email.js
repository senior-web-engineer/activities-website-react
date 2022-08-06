import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'react-phone-input-2/lib/style.css';

import React, { Fragment } from 'react';
import Img from 'react-cool-img';
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import toastr from 'toastr';

import loadinggif from '../../../assets/img/loading.gif';
import logo from '../../../assets/img/logo@2.png';
import back from '../../../assets/img/signup-back.jpg';
import { auth } from '../../../services/firebase';

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      validCode: null,
      verifiedCode: false,
      emailSent: false,
    }
  }
  componentDidMount() {
    const script = document.createElement('script')
    script.src = './assets/js/bundle-0c6e0e19e1.js'
    script.async = true
    document.body.appendChild(script)

    if (this.props.actionCode) {
      auth.applyActionCode(this.props.actionCode).then(
        (res) => {
          // Email address has been verified.
          this.setState({ validCode: true, verifiedCode: true })
          toastr.success('Email verify successfully!')
        },
        (error) => {
          // Code is invalid or expired. Ask the user to verify their email address
          // again.
          this.setState({
            error: error.message,
            validCode: false,
            verifiedCode: true,
          })
        },
      )
    }

    auth.onAuthStateChanged((user) => {
      // debugger;
      // if (!user) {
      //   // this.props.history.push("/");
      // } else {
      //   this.setState({ user });
      // }
    })
  }

  verifyEmail = () => {
    auth.currentUser.sendEmailVerification().then(() => {
      toastr.success('Verification email sent!')
      this.setState({ emailSent: true })
    })
  }

  render() {
    const { error, validCode, verifiedCode } = this.state
    return (
      <Fragment>
        <div className="full-screen auth-page">
          <div className="auth-content">
            <NavLink to="/">
              <img src={logo} className="auth-logo" alt="" />
            </NavLink>
            <div className="login-content position-relative">
              <div className="login-header">
                <h3>Verify Email</h3>
              </div>
              <div className="login-body">
                <div className="custom-container1">
                  {verifiedCode && !validCode && (
                    <div className="mt-5">
                      <div className="VerifyEmail">
                        <h3>Try verify your email again</h3>
                        <p className="error">{error}</p>
                      </div>
                      {this.state.emailSent && (
                        <div className="text-success mt-3 mb-2">
                          Verification email sent!
                        </div>
                      )}
                      <button
                        className="btn btn-xs btn-gradient btn-gradient-two m-top-10"
                        onClick={this.verifyEmail}
                      >
                        SEND VERIFICATION EMAIL
                      </button>
                    </div>
                  )}
                  {!verifiedCode && (
                    <div className="custom-loader">
                      <Loader
                        type="Oval"
                        color="#afdb30"
                        height={70}
                        width={70}
                      />
                    </div>
                  )}
                  {verifiedCode && validCode && (
                    <div className="mt-5">
                      <div>
                        <h3>Your email has been verified</h3>
                        <p className="m-top-10">
                          You can now sign in with your account
                        </p>
                      </div>
                      <div>
                        <NavLink to="/sign-in">
                          <h5 className="to-signup">
                            <span style={{ color: '#358804' }}> Sign In</span>
                          </h5>
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="signup-back">
            <Img
              placeholder={loadinggif}
              src={back}
              className="auth-backimg"
              cache
              alt=""
            />
          </div>
        </div>
      </Fragment>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    logo: state.logo,
  }
}

export default connect(mapStateToProps)(VerifyEmail)
