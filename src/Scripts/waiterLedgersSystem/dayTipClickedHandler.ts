import { callApi } from "../appsScriptCall";
import { userData } from "../authorizationGuard";

interface ConfirmPaymentChange {
    dayNumber: number ,
    monthNumber:number ,
    waiterId: number ,
    originalText: string ,
}

export class DayTipClickedHandler
{
    public readonly paymentChanges: ConfirmPaymentChange[] = [];

    public toggleCell(
        dayNumber: number,
        monthNumber: number,
        waiterId: number,
        cell: HTMLTableCellElement
    )
    {
        const existingIndex = this.paymentChanges.findIndex(
            change =>
                change.dayNumber === dayNumber &&
                change.monthNumber === monthNumber &&
                change.waiterId === waiterId
        );

        // ALREADY SELECTED: REVERT
        if (existingIndex !== -1)
        {
            const previousChange = this.paymentChanges[existingIndex];

            cell.textContent = previousChange.originalText;
            cell.classList.remove("payment-day-pre-completed");

            this.paymentChanges.splice(existingIndex, 1);

            return;
        }

        // NOT SELECTED: MARK AS PAID
        this.paymentChanges.push({
            dayNumber,
            monthNumber,
            waiterId,
            originalText: cell.textContent ?? ""
        });

        cell.textContent = "";
        cell.classList.add("payment-day-pre-completed");
    }




    public async sendChanges()
    {
        console.log ( this.paymentChanges ) ;

        if (this.paymentChanges.length === 0) return;

        const changes = [...this.paymentChanges];
        

        await this.sendPaymentConfirmations(changes);

        this.paymentChanges.length = 0;

        window.location.reload();
    }

    private async sendPaymentConfirmations (
    changes: ConfirmPaymentChange[]
    )
    {
        return callApi ( {
            function: "registerDayTipPaymentsBatch",
            changes,
            username: userData.username ,
            userId: userData.userID ,
        } ) ;
    }
}