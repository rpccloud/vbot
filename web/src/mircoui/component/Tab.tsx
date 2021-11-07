import React, { ReactNode } from "react";
import {
    ColorSet,
    extendColorSet,
    getFontSize,
    ITheme,
    Theme,
    ThemeCache,
    ThemeContext,
} from "..";

interface TabConfig {
    normal?: ColorSet;
    hover?: ColorSet;
    focus?: ColorSet;
}

function getConfig(theme: Theme): TabConfig {
    const themeKey = theme.hashKey();
    let record: TabConfig = themeCache.getConfig(themeKey);
    if (record) {
        return record;
    }

    record = {
        normal: {
            font: theme.secondary.main.hsla,
            background: theme.secondary.auxiliary.hsla,
            border: "transparent",
            shadow: "transparent",
            auxiliary: "transparent",
        },
        hover: {
            font: theme.primary.main.hsla,
            background: theme.primary.auxiliary.hsla,
            border: "transparent",
            shadow: "transparent",
            auxiliary: "transparent",
        },
        focus: {
            font: theme.primary.main.lighten(5).hsla,
            background: theme.primary.auxiliary.lighten(5).hsla,
            border: "transparent",
            shadow: theme.primary.auxiliary.lighten(5).hsla,
            auxiliary: "transparent",
        },
    };

    themeCache.setConfig(themeKey, record);

    return record;
}

let themeCache = new ThemeCache();

interface TabProps {
    size: "tiny" | "small" | "medium" | "large" | "xlarge";
    fontWeight: "lighter" | "normal" | "bold" | "bolder";
    theme?: ITheme;
    config: TabConfig;
    icon?: ReactNode;
    title?: string;
    width: number;
}

interface TabState {
    hover: boolean;
    focus: boolean;
}

function makeTabPath(w: number, h: number, radius: number): Path2D {
    let path = new Path2D();
    let r = Math.min(w / 2, h / 2, radius);
    path.moveTo(0, h);
    path.lineTo(2 * r, 0);
    path.lineTo(w - 2 * r, 0);
    path.lineTo(w, h);
    return path;
}

export class Tab extends React.Component<TabProps, TabState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        fontWeight: "normal",
        config: {},
        width: 100,
    };

    private rootRef = React.createRef<HTMLDivElement>();
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private ctx?: CanvasRenderingContext2D;
    private canvasWidth: number = 0;
    private canvasHeight: number = 0;
    private color?: ColorSet;

    constructor(props: TabProps) {
        super(props);
        this.state = {
            hover: false,
            focus: false,
        };
    }

    componentDidMount() {
        this.drawBGPath();
    }

    private setCanvasSize(width: number, height: number) {
        if (width !== this.canvasWidth || height !== this.canvasHeight) {
            this.canvasWidth = width;
            this.canvasHeight = height;
            this.drawBGPath();
        }
    }

    private drawBGPath(): void {
        const canvas = this.canvasRef.current;

        if (!canvas) {
            return;
        }

        if (!this.ctx) {
            this.ctx = canvas.getContext("2d") || undefined;
        }
        const ctx = this.ctx;
        if (!ctx) {
            return;
        }

        const dpr = window.devicePixelRatio || 1;

        canvas.width = this.canvasWidth * dpr;
        canvas.height = this.canvasHeight * dpr;
        canvas.style.width = `${this.canvasWidth}px`;
        canvas.style.height = `${this.canvasHeight}px`;
        ctx.scale(dpr, dpr);

        const path = makeTabPath(
            this.canvasWidth,
            this.canvasHeight,
            Math.round(this.canvasHeight / 4)
        );

        ctx.imageSmoothingEnabled = true;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (this.color?.background) {
            ctx.fillStyle = this.color?.background;
            ctx.fill(path);
        }
        if (this.color?.border) {
            ctx.lineWidth = dpr;
            ctx.lineCap = "round";
            ctx.strokeStyle = this.color?.border;
            ctx.stroke(path);
        }
    }

    render() {
        let config: TabConfig = getConfig(
            this.context.extend(this.props.theme)
        );

        let color = extendColorSet(config.normal, this.props.config.normal);

        this.color = color;

        let fontSize = getFontSize(this.props.size);
        let height = Math.round(fontSize * 2.3);
        this.setCanvasSize(this.props.width, height);
        return (
            <div
                ref={this.rootRef}
                style={{
                    position: "absolute",
                    width: this.props.width,
                    height: height,
                    overflow: "hidden",
                }}
            >
                <canvas
                    ref={this.canvasRef}
                    style={{ transition: "opacity 0.3s ease-out" }}
                ></canvas>
            </div>
        );
    }
}
