import { NotificationErrosProps } from "./notification";

export default class NotificationErros extends Error {
    constructor(public errors: NotificationErrosProps[]) {
        super(errors.map((e) => `${e.context}: ${e.message}`).join(", "));
    }
}
