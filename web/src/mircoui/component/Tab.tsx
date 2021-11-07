import React, { ReactNode } from "react";
import {
    ColorSet,
    extendColorSet,
    getFontSize,
    HtmlChecker,
    ITheme,
    makeTransition,
    Theme,
    ThemeCache,
    ThemeContext,
} from "..";

interface TabConfig {
    normal?: ColorSet;
    hover?: ColorSet;
    selected?: ColorSet;
}

function getConfig(theme: Theme): TabConfig {
    const themeKey = theme.hashKey();
    let record: TabConfig = themeCache.getConfig(themeKey);
    if (record) {
        return record;
    }

    record = {
        normal: {
            font: theme.primary.main.hsla,
            background: "transparent",
            border: theme.primary.main.hsla,
            shadow: "transparent",
            auxiliary: "transparent",
        },
        hover: {
            font: theme.primary.main.hsla,
            background: "transparent",
            border: theme.primary.auxiliary.hsla,
            shadow: "transparent",
            auxiliary: "transparent",
        },
        selected: {
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
    selected: boolean;
}

function makeTabPath(w: number, h: number, radius: number): string {
    let r = Math.min(w / 2, h / 2, radius);
    return `M0 ${h} L${2 * r} 1 L${w - 2 * r} 1 L${w} ${h}`;
}

export class Tab extends React.Component<TabProps, TabState> {
    static contextType = ThemeContext;
    static defaultProps = {
        size: "medium",
        fontWeight: "normal",
        config: {},
        width: 100,
    };

    private bgRef = React.createRef<SVGPathElement>();
    private htmlChecker = new HtmlChecker(this.bgRef);

    constructor(props: TabProps) {
        super(props);
        this.state = {
            hover: false,
            selected: false,
        };
    }

    componentWillUnmount() {
        this.htmlChecker.depose();
    }

    render() {
        let config: TabConfig = getConfig(
            this.context.extend(this.props.theme)
        );

        let color = extendColorSet(config.normal, this.props.config.normal);

        if (this.state.hover) {
            color = extendColorSet(config.hover, this.props.config.hover);
        }

        if (this.state.selected) {
            color = extendColorSet(config.selected, this.props.config.selected);
        }

        let fontSize = getFontSize(this.props.size);
        let width = this.props.width;
        let height = Math.round(fontSize * 2.3);
        let path = makeTabPath(width, height, height / 4);

        return (
            <div
                style={{
                    position: "absolute",
                    width: this.props.width,
                    height: height,
                    overflow: "hidden",
                    top: 0,
                }}
            >
                <svg height={height} width={width}>
                    <path
                        ref={this.bgRef}
                        d={path}
                        style={{
                            fill: color.background,
                            stroke: color.border,
                            transition: makeTransition(
                                ["fill", "stroke"],
                                250,
                                "ease-in"
                            ),
                        }}
                        onMouseMove={() => {
                            if (!this.state.hover) {
                                this.setState({ hover: true });
                                this.htmlChecker.onLostHover(() => {
                                    this.setState({ hover: false });
                                });
                            }
                        }}
                        onMouseDown={(e) => {
                            if (!this.state.selected) {
                                this.setState({ selected: true });
                                this.htmlChecker.onLostActive(() => {
                                    this.setState({ selected: false });
                                });
                            }
                        }}
                    />
                </svg>
            </div>
        );
    }
}
