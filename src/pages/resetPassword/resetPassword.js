import React from "react";
import AdminLayout from "../../components/layout/adminLayout";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./resetPassword.css";
import SendCode from "../../components/sendcode/sendcode";
import axios from "axios";
import { withAlert } from "react-alert";
import UserTypeSelector from "../../components/usertypes/usertypeselector";
import UserManager from "../../manager/usermanager";
import Global from "../../global/global";
import Captcha from "react-captcha-code";
import Utils from "../../utils/utils"
class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.email=""
    this.phoneinput = {};
    this.phoneinput.country = "cn";
    this.phoneinput.number = "";
    this.phoneinput.countrycode = "86";
    this.passwd = "";
    this.passwd2 = "";
    this.vcode = "";
    

    this.captchaId = 0;
    this.inputCode = "";
    this.captchaRef = null;
    this.captchaCode = "";

    this.state={
      loginType:"email",//"email" or "phone"
      captchaBase64: ""
    }
  }

  async GetCaptchaFromServer(){
    let url = "/api/v1/user/getcaptcha"
    axios
      .get(Global.apiHost + url)
      .then((response) => {
        if (response&&response.data.status == 108){
          this.props.alert.error("Please wait at least 5 seconds before refresh");
          return;
        }
        if (response&&response.data.status == 0){
          this.setState({
            captchaBase64:response.data.data.base64Code
          })
          this.captchaId=response.data.data.id
          return;
        }
      })
  }

  async componentDidMount() {
    if (UserManager.GetUserInfo() == null) {
      await UserManager.UpdateUserInfo();
    }
    this.GetCaptchaFromServer()
  }

  checkCaptcha() {
    // if (this.captchaCode != this.inputCode) {
    //   this.props.alert.error("please input correct captcha");
    //   return false;
    // }
    if (this.inputCode.length!=4) {
      this.props.alert.error("please input correct captcha");
      return false;
    }
    return true;
  }

  
  checkphonenumber() {
    if (this.state.loginType!="phone") {
      return true
    }

    if (this.phoneinput.number.length<=6) {
      this.props.alert.error("please input correct phone number");
      return false;
    }

    let reg=/^[0-9]*$/
    let pattern = new RegExp(reg)

    if (!pattern.test(this.phoneinput.number)){
      this.props.alert.error("please input correct phone number");
      return false;
    }

    return true;
  }

  checkemail(){
    if (this.state.loginType!="email") {
      return true
    }

    if (this.email.length<=4) {
      this.props.alert.error("please input correct email address");
      return false;
    }

    let reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    let pattern = new RegExp(reg)

    if (!pattern.test(this.email)){
      this.props.alert.error("please input correct email address");
      return false;
    }

    return true;
  }

  checkvcode() {
    if (this.vcode.length<4||this.vcode.length>6) {
      this.props.alert.error("please input correct vcode");
      return false;
    }
    return true;
  }

  checkpasswd() {
    if (this.passwd != this.passwd2) {
      this.props.alert.error("please input the same password!");
      return false;
    }

    if (this.passwd.length < 5) {
      this.props.alert.error("password length should be longer then 5");
      return false;
    }

    return true;
  }


  clicksendvcode() {
    if(this.state.loginType=="phone"&&!this.checkphonenumber()){
      return
    }

    axios
      .post(Global.apiHost + "/api/v1/user/resetgetvcode", {
        phonecountrycode: "+" + this.phoneinput.countrycode,
        phonenumber: this.phoneinput.number,
      })
      .then((response) => {
        //console.log(response);

        if (response.data.status == 2103) {
          this.props.alert.error("Phone not exist");
          return;
        }

        if (response && response.data.status == 102) {
          this.props.alert.error(
            "please wait 60 seconds before you send verify code again"
          );
          return
        }

        if (response && response.data.status == 0) {
          this.props.alert.success(
            "VCode send"
          );
          return
        }
      });
  }

  clicksendemailvcode(){
    if (this.state.loginType=="email"&&!this.checkemail()) {
      return;
    }

    axios
      .post(Global.apiHost + "/api/v1/user/resetgetemailvcode", {
        email: this.email
      })
      .then((response) => {
        //console.log(response);

        if (response&&response.data.status == 2006){
          this.props.alert.error("Email format is not correct");
          return;
        }

        if (response.data.status == 2102) {
          this.props.alert.error("Email not exist");
          return;
        }

        if (response && response.data.status == 102) {
          this.props.alert.error(
            "please wait 60 seconds before you send verify code again"
          );
          return
        }

        if (response && response.data.status == 0) {
          this.props.alert.success(
            "VCode send"
          );
          return
        }
      });

  }

  resetPassword() {
    if (!this.checkCaptcha()) {
      return;
    }

    if (!this.checkpasswd()) {
      return;
    }

    if (!this.checkphonenumber()) {
      return;
    }

    if (!this.checkvcode()) {
      return;
    }

    this.GetCaptchaFromServer()

    // type resetPasswordMsg struct{
    //   Email     string   `json:"email"`
    //   PhoneCode string   `json:"phonecountrycode"`
    //   PhoneNum  string   `json:"phonenumber"`
    //   Password  string   `json:"passwd" binding:"required"`
    //   Vcode     string   `json:"vcode" binding:"required"`
    //   Type     string `json:"type" binding:"required"`
    // }

    axios
      .post(Global.apiHost + "/api/v1/user/resetpassword", {
        email: this.email,
        phonecountrycode: "+" + this.phoneinput.countrycode,
        phonenumber: this.phoneinput.number,
        passwd: this.passwd,
        vcode: this.vcode,
        type: this.state.loginType,
        captcha:this.inputCode,
        captchaId:this.captchaId,
      })
      .then((response) => {
        switch (response.data.status) {
          case 107:
            this.props.alert.error("Captcha wrong");
            return;
          case 2006:
            this.props.alert.error("Email format error");            
            return;
          case 2102:
            this.props.alert.error("Email not exist!");
            return;
          case 2103:
            this.props.alert.error("Phone not exist!");
            return;
          case 2004:
            this.props.alert.error("verify code wrong!");
            return;
          case 0:
            this.props.alert.success("Password reset");
            setTimeout(() => {
              if (UserManager.GetUserToken() == null) {
                window.location.href = "/welcome";
              }
            }, 1500);
            return;
          default:
            this.props.alert.error("some thing wrong,please contact us!");
            return;
        }
      });
  }

  render() {
    return (
      <AdminLayout name="User" description="Reset Password">
        <div className="card border-light shadow-sm">
          <div className="card-body" style={{ color: "#555e68" }}>
            <form style={{ textAlign: "left" }}>
            {this.state.loginType=="phone"&&
              <div className="form-group">
              <label className="small mb-1" htmlFor="inputConfirmPassword">
                PhoneNumber
              </label>
              <div className="phoneinputwrapper">
                <PhoneInput
                  onChange={(value, data, event, formattedValue) => {
                    this.phoneinput.countrycode = data.dialCode;
                    this.phoneinput.number = value.slice(data.dialCode.length);
                    this.phoneinput.countrycode = this.phoneinput.countrycode.trim();
                    this.phoneinput.number = this.phoneinput.number.trim();
                  }}
                  country={this.phoneinput.country}
                  defaultMask={"..............................."}
                  alwaysDefaultMask
                  autoFormat={true}
                  countryCodeEditable={false}
                />
              </div>
              </div>}

              {this.state.loginType=="email"&&
              <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                onChange={(event) => {
                  this.email = event.target.value.trim();
                }}
                aria-describedby="emailHelp"
                placeholder="Enter Email"
              />
              </div>}

              <div className="form-group">
              <div className="form-row">
                <label>
                  <input name="loginType" type="radio" value="" checked={this.state.loginType=="email"} onClick={
                      ()=>{
                        this.setState({loginType:"email"})
                      }
                  }/>
                  &nbsp;Email&nbsp;&nbsp;
                </label>
                <label>
                  <input name="loginType" type="radio" value="" checked={this.state.loginType=="phone"} onClick={
                      ()=>{
                        this.setState({loginType:"phone"})
                      }
                  }/>
                  &nbsp;Phone&nbsp;&nbsp;
                </label>
              </div>
              </div>

              <div className="form-group">
                <label className="small mb-1" htmlFor="inputPassword">
                  New Password
                </label>
                <input
                  className="form-control py-3"
                  type="password"
                  placeholder="Enter password"
                  onChange={(event) => {
                    this.passwd = event.target.value.trim();
                  }}
                />
              </div>

              <div className="form-group">
                <label className="small mb-1" htmlFor="inputConfirmPassword">
                  Confirm Password
                </label>
                <input
                  className="form-control py-3"
                  type="password"
                  placeholder="Confirm password"
                  onChange={(event) => {
                    this.passwd2 = event.target.value.trim();
                  }}
                />
              </div>

              

              <div className="form-row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="small mb-2">Captcha</label>
                    <input
                      className="form-control py-3"
                      type="text"
                      placeholder="Enter captcha"
                      onChange={(event) => {
                        this.inputCode = event.target.value.trim();
                      }}
                    ></input>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="small mb-2">click to refresh</label>
                    <div style={{ textAlign: "left" }}>
                      {/* <Captcha
                        onRef={(ref) => {this.captchaRef= ref.current}}
                        charNum={4}
                        onChange={(captcha) => {
                          this.captchaCode = captcha;
                          //captcha send to server
                        }}
                      /> */}
                      <img src={this.state.captchaBase64} alt="click to refresh" onClick={()=>{
                        this.GetCaptchaFromServer()
                      }}/>
                    </div>
                  </div>
                </div>
              </div>

              {this.state.loginType=="phone"&&
              <div className="form-row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="small mb-2">smscode</label>
                    <input
                      className="form-control py-3"
                      type="text"
                      placeholder="Enter phone code"
                      onChange={(event) => {
                        this.vcode = event.target.value.trim();
                      }}
                    ></input>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="small mb-2">send smscode</label>
                    <div style={{ textAlign: "left" }}>
                      <SendCode
                        checkphonecorrect={() => {
                          return this.checkphonenumber();
                        }}
                        click={() => {
                          this.clicksendvcode();
                        }}
                      ></SendCode>
                    </div>
                  </div>
                </div>
              </div>}


              {this.state.loginType=="email"&&
              <div className="form-row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="small mb-2">email code</label>
                    <input
                      className="form-control py-3"
                      type="text"
                      placeholder="Enter vcode"
                      onChange={(event) => {
                        this.vcode = event.target.value.trim();
                      }}
                    ></input>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="small mb-2">send email</label>
                    <div style={{ textAlign: "left" }}>
                      <SendCode
                        checkphonecorrect={() => {
                          return this.checkemail();
                        }}
                        click={() => {
                          this.clicksendemailvcode();
                        }}
                      ></SendCode>
                    </div>
                  </div>
                </div>
              </div>}


              <div className="form-group mt-4 mb-0">
                <div
                  className="btn btn-primary-rocket btn-block"
                  onClick={() => {
                    this.resetPassword();
                  }}
                  href="#"
                >
                  Reset
                </div>
              </div>
            </form>
          </div>

{UserManager.GetUserToken() == null&&
          <div className="card-footer text-center ">
              <div className="small">
                <a className="a-rocket" href="/register">
                  Need an account? Sign up!
                </a>
              </div>
            </div>}

        </div>
      </AdminLayout>
    );
  }
}

export default withAlert()(ResetPasswordPage);

//export  default  RegisterPage;