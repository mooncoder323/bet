import {Match} from "./Sports/Match";

export interface Slip {
    match: Match;
    option: number;
    offering?: string
}