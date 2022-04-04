
import * as Tauri from "@tauri-apps/api";

import AtomicCardsJson from "assets/AtomicCards.json";
import SetListJson from "assets/SetList.json";
import { Card, convertFromMTGJSONAtomicCards } from "deckyard/types";

import { CardAtomicFile, SetListFile } from "./mtgjson/files";

export async function loadAtomicCards(): Promise<Card> {
    try {
        const contents = await Tauri.fs.readTextFile("data/AtomicCards.json", {dir: Tauri.fs.BaseDirectory.App});
        return JSON.parse(contents);
    } catch(_) {
        return convertFromMTGJSONAtomicCards(await (await fetch(AtomicCardsJson, { method: "GET" })).json());
    }
}

export async function loadSetLists(): Promise<SetListFile> {
    try {
        const contents = await Tauri.fs.readTextFile("data/AtomicCards.json", {dir: Tauri.fs.BaseDirectory.App});
        return JSON.parse(contents);
    } catch(_) {
        return (await fetch(SetListJson, {method: "GET"})).json();
    }
}