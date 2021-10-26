import * as React from "react";
import { ITerminalAddon, Terminal } from "xterm";
import "xterm/css/xterm.css";
// const className = require("classnames");
// // const debounce = require('lodash.debounce');
// // import styles from 'xterm/xterm.css';

// // require ('xterm/xterm.css');

export interface IXtermProps extends React.DOMAttributes<{}> {
    addons?: ITerminalAddon[];
    path?: string;
    value?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface IXtermState {
    isFocused: boolean;
}

export class XTerm extends React.Component<IXtermProps, IXtermState> {
    xterm?: Terminal;
    containerRef: React.RefObject<HTMLDivElement>;
    websocket?: WebSocket;
    // var websocket = new WebSocket("ws://192.168.1.61:8080/ssh");

    constructor(props: IXtermProps) {
        super(props);
        this.containerRef = React.createRef();
        this.state = {
            isFocused: false,
        };
    }

    componentDidMount() {
        if (this.containerRef.current) {
            this.xterm = new Terminal({
                cursorBlink: true,
            });
            this.websocket = new WebSocket("ws://127.0.0.1:8080/ssh");
            this.websocket.binaryType = "arraybuffer";
            this.websocket.onmessage = (evt) => {
                if (evt.data instanceof ArrayBuffer) {
                    this.xterm?.write(new TextDecoder().decode(evt.data));
                } else {
                    alert(evt.data);
                }
            };

            this.websocket.onclose = (evt) => {
                this.xterm?.write("\r\nSession terminated");
            };

            this.websocket.onerror = function (evt) {
                if (typeof console.log == "function") {
                    console.log(evt);
                }
            };
            if (this.props.addons) {
                this.props.addons.forEach((it) => {
                    this.xterm?.loadAddon(it);
                });
            }
            this.xterm.open(this.containerRef.current);
            this.xterm.onData((data) => {
                this.websocket?.send(new TextEncoder().encode("\x00" + data));
            });
            if (this.props.value) {
                this.xterm.write(this.props.value);
            }
        }
    }

    componentWillUnmount() {
        // is there a lighter-weight way to remove the cm instance?
        if (this.xterm) {
            this.xterm.dispose();
            this.xterm = undefined;
        }
    }

    focus() {
        if (this.xterm) {
            this.xterm.focus();
        }
    }

    // focusChanged(focused) {
    //     this.setState({
    //         isFocused: focused,
    //     });
    //     this.props.onFocusChange && this.props.onFocusChange(focused);
    // }
    // onInput = (data) => {
    //     this.props.onInput && this.props.onInput(data);
    // };

    resize(cols: number, rows: number) {
        this.xterm?.resize(Math.round(cols), Math.round(rows));
    }

    refresh() {
        this.xterm?.refresh(0, this.xterm.rows - 1);
    }

    render() {
        return <div ref={this.containerRef} className="ReactXTerm" />;
    }
}

// var term;
// var terminalContainer = document.getElementById("terminal");
// var websocket = new WebSocket("ws://192.168.1.61:8080/ssh");

// function ab2str(buf) {
//     return new TextDecoder().decode(buf);
// }

// term = new Terminal({
//     cursorBlink: true,
// });

// websocket.binaryType = "arraybuffer";
// websocket.onopen = function(evt){
//     term.on('data', function(data) {
//         websocket.send(new TextEncoder().encode("\x00" + data));
//     });

//     term.on('resize', function(evt) {
//         websocket.send(new TextEncoder().encode("\x01" + JSON.stringify({cols: evt.cols, rows: evt.rows})))
//     });

//     term.open(terminalContainer, true);
//     term.resize(120,30);
//     websocket.onmessage = function(evt) {
//         if (evt.data instanceof ArrayBuffer) {
//             term.write(ab2str(evt.data));
//         } else {
//             alert(evt.data)
//         }
//     }

//     websocket.onclose = function(evt) {
//         term.write("\r\nSession terminated");
//     }

//     websocket.onerror = function(evt) {
//         if (typeof console.log == "function") {
//             console.log(evt)
//         }
//     }
// }
