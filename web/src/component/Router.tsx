import React from "react";

export class RouteParam {
    public readonly key: string
    public readonly kind: string
    public readonly path: string

    private constructor(key: string, kind: string, path: string) {
        this.key = key
        this.kind = kind
        this.path = path
    }

    encode(): string {
        return encodeURIComponent(JSON.stringify({
            key: this.key,
            kind: this.kind,
            path: this.path,
        }))
    }

    public static decode(v: string): RouteParam | undefined {
        const json = JSON.parse(decodeURIComponent(v))
        if (json) {
            return new RouteParam(json.key, json.kind, json.path)
        }
    }
}

// class RouterProps {

// }

// const Router = (props: RouterProps) => {

// }


// export class Router {

// }
