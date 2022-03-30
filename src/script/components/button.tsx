import "./button.scss";

import * as Preact from "preact";
import { joinClassNames } from "util/shared";
import { useInterval, useMemoAsync } from "./hooks";
import { useCallback, useRef } from "preact/hooks";
import { registerOneShotDocumentEvent } from "./util";

const imgCache = new Map<string, string>();

export interface ButtonProps {
    ["class"]?: string,
    action?: () => void,
    icon?: string,
    text?: string,
    title?: string,
    rate?: number,
    noCache?: boolean,
    noRepeat?: boolean,
    iconRotate?: number,
    refElem?: (v: HTMLButtonElement | null) => void,
}

export function ButtonGroup({["class"]: className, direction, children}: {
    ["class"]?: string,
    direction: "vertical" | "horizontal",
    children?: Preact.ComponentChild[],
}) {
    return <div 
        class={joinClassNames(`button-group ${direction}`, className)}
    >{children?.flatMap(v => [v, <ButtonSpacer/>]).splice(0, children?.length*2-1)}</div>;
}

export function Button({icon, text, title, action, rate, ["class"]: className, noCache, noRepeat, refElem, iconRotate}: ButtonProps) {
    const [,img,] = useMemoAsync(async () => {
        if (!icon) return "";
        if (!noCache) {
            const existing = imgCache.get(icon);
            if (existing) return existing;
        }

        const result = await (await fetch(icon)).text();
        if (!noCache) imgCache.set(icon, result);
        return result;
    }, [icon]);

    const repeatSources = useRef(0);
    useInterval(() => {
        if (noRepeat || repeatSources.current === 0) return;
        action?.();
    }, rate ?? 20);

    return <button 
        class={joinClassNames("button", className)}
        onMouseDown={e => {
            if (noRepeat || e.button !== 0) return;
            repeatSources.current += 1;
            registerOneShotDocumentEvent("mouseup", e => {
                if (e.button !== 0) return;
                repeatSources.current -= 1;
            });
        }}
        onKeyDown={e => {
            if ((noRepeat && e.repeat) || e.key !== " ") return;
            action?.();
        }}
        onClick={e => {
            if (e.button !== 0) return;
            action?.();
        }}
        onSelect={e => {
            e.preventDefault();
        }}
        onSubmit={action}
        title={title}
        ref={refElem}
    >
        {img && <div 
            class="button-icon"
            style={iconRotate ? {transform: `rotate(${iconRotate*90}deg)`} : undefined}
            dangerouslySetInnerHTML={{__html: img}}
        />}
        {text && <div
            class="button-text"
        >{text}</div>}
    </button>;
}

function ButtonSpacer() {
    return <div class="button-spacer"><div class="button-spacer-inner"/></div>;
}