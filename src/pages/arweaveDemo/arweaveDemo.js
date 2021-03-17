/*
 * @Author: your name
 * @Date: 2020-12-31 13:38:15
 * @LastEditTime: 2021-03-17 20:58:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mesonweb/src/pages/arweaveDemo/arweaveDemo.js
 */

import React, { useCallback, useMemo } from "react";
import { withAlert } from "react-alert";
import Global from "../../global/global";
import axios from "axios";
import moment from "moment";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { useDropzone } from "react-dropzone";
import copy from "copy-to-clipboard";
import "./arweaveDemo.css";

class ArweaveDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputHash: "",
    };

    // document
    //     .getElementsByTagName("body")[0]
    //     .setAttribute("style", "background-color: #02233e");
  }

  render() {
    return (
      <div style={{ backgroundColor: "#02233e",paddingTop:"10px" }}>
        <div className="container">
          <div className="form-group">
            {/* <label>input file id&#40;Hash&#41; in Arweave</label> */}
            <input
              style={{ 
                backgroundColor: "#02233e", 
                color: "white",
              // opacity: "70%", 
            }}
              className="form-control arweave-hash-input"
              //value={this.state.inputurl}
              onChange={(event) => {
                this.setState({
                  inputHash: event.target.value,
                });
                //console.log(event.target.value);
              }}
              type="text"
              placeholder="Input file ID(Hash) in Arweave"
            />
          </div>

          <div style={{color:"rgb(255 255 255 / 58%)"}}>
            {/* ipfs link */}
            <div style={{ 
              
              }}>Origin Arweave link</div>
            <div
              className="input-group "
              style={{
                marginBottom: "0px",
              }}
            >
              <input
                id="ipfslink"
                value={"https://arweave.net/" + this.state.inputHash}
                className="form-control"
                type="text"
                onChange={(event)=>{

                }}
                style={{
                  background: "none",
                  color: "white",
                  paddingLeft: "5px",
                  // opacity: "70%",
                }}
              />
              <div className="input-group-append">
                <div
                  // data-clipboard-target="#mytoken"
                  className="btn   btn-light"
                  // type="button"
                  style={{
                    //backgroundColor: "#3d566b !important",
                    background:"#3d566b",
                    color: "white",
                    // opacity: "70%",
                  }}
                  onClick={() => {
                    copy("https://arweave.net/" + this.state.inputHash);
                    this.props.alert.success("arweave url Copied");
                  }}
                >
                  copy
                </div>
              </div>
            </div>

            {/* meson link */}
            <div style={{ 
              
              }}>Accelerated link by meson:</div>
            <div
              className="input-group "
            //   style={{
            //     marginBottom: "13px",
            //     marginTop: "-1px",
            //   }}
            >
              <input
                id="mesonlink"
                value={
                  Global.coldCdnApiHost +
                  "/api/cdn/bronil/" +
                  this.state.inputHash
                }
                onChange={(event)=>{

                }}
                className="form-control"
                type="text"
                style={{
                  background: "none",
                  color: "white",
                  paddingLeft: "5px",
                  // opacity: "70%",
                }}
              />
              <div className="input-group-append">
                <div
                  // data-clipboard-target="#mytoken"
                  className="btn   btn-light"
                  // type="button"
                  style={{
                    //backgroundColor: "#3d566b !important",
                    background:"#3d566b",
                    color: "white",
                    // opacity: "70%",
                  }}
                  onClick={() => {
                    copy(
                      Global.coldCdnApiHost +
                        "/api/cdn/bronil/" +
                        this.state.inputHash
                    );
                    this.props.alert.success("meson Url Copied");
                  }}
                >
                  copy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withAlert()(ArweaveDemoPage);
