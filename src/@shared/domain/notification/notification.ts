export type NotificationErrosProps = {
    message: string;
    context: string;
};

export class Notification {
    private errors: NotificationErrosProps[] = [];

    addError(error: NotificationErrosProps): void {
        this.errors.push(error);
    }
    hasErrors(): boolean {
        return this.errors.length > 0;
    }
    getErrors(): NotificationErrosProps[] {
        return this.errors;
    }

    messages(context?: string): string {
        let messages = "";
        this.errors.forEach((error) => {
            if (context === undefined || error.context === context) {
                messages += `${error.context}: ${error.message},`;
            }
        });
        return messages;
    }

}