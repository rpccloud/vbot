import * as React from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export interface IXtermProps extends React.DOMAttributes<{}> {
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
    fitAddon: FitAddon;
    resizeObserver: ResizeObserver;

    constructor(props: IXtermProps) {
        super(props);
        this.resizeObserver = new ResizeObserver(() => {
            this.autoFit();
        });
        this.fitAddon = new FitAddon();
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

            this.xterm.onData((data) => {
                this.websocket?.send(new TextEncoder().encode("\x00" + data));
            });

            this.websocket = new WebSocket("ws://127.0.0.1:8080/ssh");
            this.websocket.binaryType = "arraybuffer";
            this.websocket.onopen = () => {
                this.resizeObserver.observe(this.containerRef.current!!);
            };
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

            this.xterm.open(this.containerRef.current);
            this.xterm.loadAddon(this.fitAddon);
        }
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect();
        this.websocket?.close();
        this.xterm?.dispose();
        this.xterm = undefined;
    }

    focus() {
        if (this.xterm) {
            this.xterm.focus();
        }
    }

    autoFit() {
        this.fitAddon.fit();
        this.websocket?.send(
            new TextEncoder().encode(
                "\x01" +
                    JSON.stringify({
                        cols: this.xterm?.cols,
                        rows: this.xterm?.rows,
                    })
            )
        );
    }

    render() {
        return (
            <div
                ref={this.containerRef}
                className="ReactXTerm"
                style={{ ...this.props.style, overflow: "hidden" }}
            />
        );
    }
}
