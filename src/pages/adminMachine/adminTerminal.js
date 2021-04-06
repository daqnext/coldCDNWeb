/*
 * @Author: your name
 * @Date: 2020-11-24 08:20:10
 * @LastEditTime: 2021-04-06 21:22:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mesonweb/src/pages/adminMachine/adminTerminal.js
 */

import React, { useCallback } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import Global from "../../global/global";
import axios from "axios";
import UserManager from "../../manager/usermanager";
import { withAlert } from "react-alert";
import { CSVLink, CSVDownload } from "react-csv";
import { times } from "chartist";

class AdminTerminal extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                name: "id",
                header: "ID",
                defaultWidth: 80,
            },
            {
                name: "machine_mac",
                header: "Mac Addr",
                defaultFlex: 1,
            },
            {
                name: "machine_ip",
                header: "IP",
                defaultFlex: 1,
            },
            {
                name: "port",
                header: "port",
                defaultFlex: 1,
            },
            {
                name: "continent",
                header: "continent",
                defaultFlex: 1,
            },
            {
                name: "country",
                header: "country",
                defaultFlex: 1,
            },
            {
                name: "city",
                header: "city",
                defaultFlex: 1,
            },
            {
                name: "area",
                header: "area",
                defaultFlex: 1,
            },
            {
                name: "speed",
                header: "speed",
                defaultFlex: 1,
                render: ({ value }) => {
                    let speed = value;
                    return <div>{(speed*8 / 1000).toFixed(2)} Mb/s</div>;
                },
            },
            {
                name: "cdn_disk_total",
                header: "cdn_disk_total",
                defaultFlex: 1,
                render: ({ value }) => {
                    let space = value;
                    return <div>{space/1e9} GB</div>;
                },
            },
            {
                name: "cdn_space_usage",
                header: "cdn_space_usage",
                defaultFlex: 1,
                render: ({ value }) => {
                    let percent = value;
                    let width2 = percent + "%";
                    //console.log(width2);

                    let className = "progress-bar bg-secondary";
                    if (percent < 60) {
                        className = "progress-bar bg-tertiary";
                    } else if (percent < 85) {
                        className = "progress-bar bg-primary";
                    }
                    return (
                        <div>
                            <div>{width2}</div>
                            <div className="progress mb-0">
                                <div
                                    className={className}
                                    role="progressbar"
                                    aria-valuenow={'"' + percent + '"'}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{ width: percent + "px" }}
                                ></div>
                            </div>
                        </div>
                    );
                },
            },
            // {
            //     name: "disk_usage",
            //     header: "disk_usage",
            //     defaultFlex: 1,
            //     render: ({ value }) => {
            //         let percent = value;
            //         let width2 = percent + "%";
            //         //console.log(width2);

            //         let className = "progress-bar bg-secondary";
            //         if (percent < 60) {
            //             className = "progress-bar bg-tertiary";
            //         } else if (percent < 85) {
            //             className = "progress-bar bg-primary";
            //         }
            //         return (
            //             <div>
            //                 <div>{width2}</div>
            //                 <div className="progress mb-0">
            //                     <div
            //                         className={className}
            //                         role="progressbar"
            //                         aria-valuenow={'"' + percent + '"'}
            //                         aria-valuemin="0"
            //                         aria-valuemax="100"
            //                         style={{ width: percent + "px" }}
            //                     ></div>
            //                 </div>
            //             </div>
            //         );
            //     },
            // },
            {
                name: "memory_usage",
                header: "memory_usage",
                defaultFlex: 1,
                render: ({ value }) => {
                    let percent = value;
                    let className = "progress-bar bg-secondary";
                    if (percent < 60) {
                        className = "progress-bar bg-tertiary";
                    } else if (percent < 85) {
                        className = "progress-bar bg-primary";
                    }
                    return (
                        <div>
                            <div>{percent + "%"}</div>
                            <div className="progress mb-0">
                                <div
                                    className={className}
                                    role="progressbar"
                                    aria-valuenow={'"' + percent + '"'}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{ width: percent + "px" }}
                                ></div>
                            </div>
                        </div>
                    );
                },
            },
            {
                name: "version",
                header: "version",
                defaultFlex: 1,
                render: ({ value }) => {
                    if (this.state.terminalAllowVersion != "") {
                        let allowVersionStr = this.state.terminalAllowVersion.split(
                            "."
                        );
                        let terminalVersionStr = value.split(".");
                        let disableVersion=false
                        for (let i = 0; i < allowVersionStr.length; i++) {
                            if (
                                parseInt(allowVersionStr[i]) >
                                parseInt(terminalVersionStr[i])
                            ){
                             disableVersion=true  
                             break 
                            } else if(parseInt(allowVersionStr[i]) <
                            parseInt(terminalVersionStr[i])){
                                disableVersion =false
                                break
                            }

                            if (disableVersion==true)
                            {
                                return (
                                    <td>
                                        <div>
                                            <span className="disable-version"></span>
                                            &nbsp;{value}
                                        </div>
                                        <div>Disable Version</div>
                                    </td>
                                );
                            }
                        }
                    }

                    if (this.state.terminalLatestVersion != "") {
                        if (this.state.terminalLatestVersion != value) {
                            return (
                                <div>
                                    <div>
                                        <span className="low-version"></span>
                                        &nbsp;{value}
                                    </div>
                                    <div>Low Version</div>
                                </div>
                            );
                        }
                    }

                    return (
                        <td>
                            <span className="status-on"></span>
                            &nbsp;{value}
                        </td>
                    );
                },
            },
            {
                name: "machine_status",
                header: "status",
                defaultFlex: 1,
                render: ({ value }) => {
                    if (value === "up") {
                        return (
                            <td>
                                <span className="status-on"></span> &nbsp;ON
                            </td>
                        );
                    } else {
                        return (
                            <td>
                                <span className="status-down"></span> &nbsp;DOWN
                            </td>
                        );
                    }
                },
            },
            {
                name: "action",
                header: "Action",
                defaultFlex: 1,
                render: ({ data }) => {
                    return (
                        <div style={{ display: "flex" }}>
                            <div
                                style={{ marginLeft: "5px" }}
                                className="btn btn-primary btn-sm"
                                onClick={
                                    async () => {
                                        //console.log(data);
                            let response = await axios.post(
                                Global.apiHost + "/api/v1/admin/testspeed",
                                {
                                    terminalTag: data.info.machine_tag,
                                },
                                {
                                    headers: {
                                        Authorization:
                                            "Bearer " +
                                            UserManager.GetUserToken(),
                                    },
                                }
                            );

                            if (response.data.status == 0) {
                                this.props.alert.success("Cmd Sended");                               
                                return;
                            }

                            this.props.alert.error(
                                "Cmd send error"
                            );
                                }}
                            >
                                Test Speed
                            </div>
                        </div>
                    );
                },
            },
        ];

        this.state = {
            tableData: [],
            terminalAllowVersion: "",
            terminalLatestVersion:"",
            originData:[],
        };
    }

    async componentDidMount() {
        this.GetTerminalAllowVersion();
        this.loadData();
        this.OutPutAllTerminalToCSV();
    }

    async GetTerminalAllowVersion() {
        let response = await axios.get(
            Global.apiHost + "/api/v1/common/terminalversion"
        );
        if (response.data.status == 0) {
            this.setState({
                terminalAllowVersion: response.data.data.allowVersion,
                terminalLatestVersion: response.data.data.latestVersion,
            });
        }
    }

    loadData = null;
    DataGrid = () => {
        const loadData = useCallback(() => {
            const data = ({ skip, limit, sortInfo }) => {
                console.log(skip, limit);
                return axios
                    .post(
                        Global.apiHost+"/api/v1/admin/allterminals",
                        {
                            limit: limit,
                            offset: skip,
                        },
                        {
                            headers: {
                                Authorization:
                                    "Bearer " + UserManager.GetUserToken(),
                            },
                        }
                    )
                    .then((response) => {
                        if (response.data.status != 0) {
                            return [];
                        }
                        let responseData = response.data.data;
                        console.log(responseData);

                        let terminalInfos = responseData.data;
                        let tableData = [];
                        for (
                            let index = 0;
                            index < terminalInfos.length;
                            index++
                        ) {
                            const terminalInfo = terminalInfos[index];
                            let tData = {
                                id: terminalInfo.id,
                                machine_mac: terminalInfo.machine_mac,
                                machine_ip: terminalInfo.machine_ip,
                                port: terminalInfo.port,
                                country: terminalInfo.country,
                                continent: terminalInfo.continent,
                                area: terminalInfo.area,
                                city: terminalInfo.city,
                                speed: terminalInfo.machine_net_speed,
                                cdn_space_usage: (
                                    ((terminalInfo.cdn_disk_total -
                                        terminalInfo.cdn_disk_available) /
                                        terminalInfo.cdn_disk_total) *
                                    100
                                ).toFixed(2),
                                cdn_disk_total:terminalInfo.cdn_disk_total,
                                disk_usage: (
                                    ((terminalInfo.machine_total_disk -
                                        terminalInfo.machine_available_disk) /
                                        terminalInfo.machine_total_disk) *
                                    100
                                ).toFixed(2),
                                memory_usage: (
                                    ((terminalInfo.machine_total_memory -
                                        terminalInfo.machine_free_memory) /
                                        terminalInfo.machine_total_memory) *
                                    100
                                ).toFixed(2),
                                machine_status: terminalInfo.machine_status,
                                version:
                                    terminalInfo.version == ""
                                        ? "0.1.1"
                                        : terminalInfo.version,
                                info: terminalInfo,
                            };
                            tableData.push(tData);
                        }
                        return {
                            data: tableData,
                            count: parseInt(responseData.total),
                        };
                    });
            };
            this.setState({ tableData: data });
        }, []);
        this.loadData = loadData;

        return (
            <div>
                <div></div>
                <ReactDataGrid
                    idProperty="id"
                    columns={this.columns}
                    dataSource={this.state.tableData}
                    pagination
                    defaultLimit={10}
                    style={{ minHeight: 485 }}
                ></ReactDataGrid>
            </div>
        );
    };

    OutPutAllTerminalToCSV(){
        axios.post("http://center.coldcdn.com/api/v1/admin/allterminals",
                        {
                            limit: 100000,
                            offset: 0,
                        },
                        {
                            headers: {
                                Authorization:
                                    "Bearer " + UserManager.GetUserToken(),
                            },
                        }
                    ).then((response)=>{
                        if (response.data.status != 0) {
                            return null;
                        }
                        let responseData = response.data.data;
                        console.log(responseData);
    
                        //this.setState({originData:responseData.data})
                        let terminalInfos = responseData.data;
                        let tableData = [];
                        for (
                            let index = 0;
                            index < terminalInfos.length;
                            index++
                        ) {
                            const terminalInfo = terminalInfos[index];
                            let tData = {
                                id: terminalInfo.id,
                                machine_mac: terminalInfo.machine_mac,
                                machine_ip: terminalInfo.machine_ip,
                                port: terminalInfo.port,
                                continent: terminalInfo.continent,
                                country: terminalInfo.country,
                                city: terminalInfo.city,
                                area: terminalInfo.area,
                                speed_Mbs: terminalInfo.machine_net_speed*8/1000,
                                cdn_disk_total_GB:terminalInfo.cdn_disk_total/1e9,
                                cdn_space_usage: (
                                    ((terminalInfo.cdn_disk_total -
                                        terminalInfo.cdn_disk_available) /
                                        terminalInfo.cdn_disk_total) *
                                    100
                                ).toFixed(2),
                                disk_usage: (
                                    ((terminalInfo.machine_total_disk -
                                        terminalInfo.machine_available_disk) /
                                        terminalInfo.machine_total_disk) *
                                    100
                                ).toFixed(2),
                                memory_total_GB:terminalInfo.machine_total_memory/(1024*1024*1024),
                                memory_usage: (
                                    ((terminalInfo.machine_total_memory -
                                        terminalInfo.machine_free_memory) /
                                        terminalInfo.machine_total_memory) *
                                    100
                                ).toFixed(2),
                                machine_status: terminalInfo.machine_status,
                                version:
                                    terminalInfo.version == ""
                                        ? "0.1.1"
                                        : terminalInfo.version,
                                //info: terminalInfo,
                            };
                            tableData.push(tData);
                        }
                        
                        this.setState({originData:tableData})
                    })

                    
                    
    }

    render() {
        return (
            <div className="  border-light shadow-sm">
                <this.DataGrid></this.DataGrid>
            
                <CSVLink data={this.state.originData}>
                                Download me
                            </CSVLink>
            </div>
        );
    }
}

export default withAlert()(AdminTerminal);