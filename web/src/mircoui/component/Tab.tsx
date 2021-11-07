import React, { ReactNode } from "react";
import { ColorSet, ResizeSensor, ScreenRect } from "..";
import { getFontSize } from "../../ui/theme/config";

interface TabProps {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    icon?: ReactNode;
    title?: string;
}

interface TabState {
    hover: boolean;
    selected: boolean;
    width: number;
    maxWidth: number;
}

class Tab extends React.Component<TabProps, TabState> {
    private rootRef = React.createRef<HTMLDivElement>();
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private ctx?: CanvasRenderingContext2D;

    constructor(props: TabProps) {
        super(props);
        this.state = {
            hover: false,
            selected: false,
            width: 0,
            maxWidth: 200,
        };
    }

    setWidth(width: number) {
        if (width !== this.state.width) {
            if (width <= this.state.maxWidth) {
                this.setState({ width: width });
            } else {
                this.setState({ maxWidth: width, width: width });
            }
        }
    }

    private getCtx(): CanvasRenderingContext2D | undefined {
        if (this.ctx) {
            return this.ctx;
        }

        const ctx = this.canvasRef.current?.getContext("2d");

        if (ctx) {
            this.ctx = ctx;
            return ctx;
        } else {
            return undefined;
        }
    }

    private drawBGPath(color: ColorSet): void {
        const dpr = window.devicePixelRatio || 1;
        const ctx = this.getCtx();
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = true;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (color.background) {
                ctx.fillStyle = color.background;
            }
            // theme.backgroundColor.lighten(1).hsla;
            // ctx.fill(this.path);
        }

        if (ctx) {
            //   if (this.isFocus) {
            //     ctx.lineWidth = dpr;
            //     ctx.lineCap = "round";
            //     ctx.strokeStyle = theme.primaryColor
            //     ctx.stroke(this.path);
            //   }
        }
    }

    render() {
        let size = getFontSize(this.props.size);
        let height = size * 2;
        const dpr = window.devicePixelRatio || 1;

        return (
            <div
                ref={this.rootRef}
                style={{
                    position: "absolute",
                    height: height,
                    overflow: "hidden",
                    top: 0,
                }}
            >
                <canvas
                    ref={this.canvasRef}
                    width={this.state.maxWidth * dpr}
                    height={height * dpr}
                    style={{ transition: "opacity 0.3s ease-out" }}
                ></canvas>
            </div>
        );
    }
}
