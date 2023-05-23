import {Transaction} from "./AccountHistoryResponse";

export interface AccountTransactions {
    deposits: Array<Transaction>
}