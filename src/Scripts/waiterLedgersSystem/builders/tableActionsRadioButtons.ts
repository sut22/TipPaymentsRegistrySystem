import { buildActionButtonsPanel, type ActionRadioGroupSettings } from "../../radioButtonsGroupSystem/actionsRadioButtonsHelper";
import { RadioButtonsGroup } from "../../radioButtonsGroupSystem/radioButtonsGroup";
import { TableActionMode } from "../models";
import { setCurrentActionMode } from "../waiterLedgersSystem";

const ACTION_SETTINGS: ActionRadioGroupSettings<TableActionMode>[] = [
    {
        enumMember: TableActionMode.ConfirmPayment,
        iconClass: "bi-check-square-fill",
        label1: "Confirmar",
        label2: "pago"
    },
    /*
    {
        enumMember: TableActionMode.ModifyAmount,
        iconClass: "bi-wrench",
        label1: "Modificar",
        label2: "monto"
    },
    {
        enumMember: TableActionMode.MarkDayOff,
        iconClass: "bi-ban",
        label1: "Marcar",
        label2: "descanso"
    },
    */
    {
        enumMember: TableActionMode.PayDebt,
        iconClass: "bi-card-checklist",
        label1: "Pagar",
        label2: "deuda"
    }
];

export function initActionButtonsPanel(
    container: HTMLElement | null = document.getElementById("tipsTableContainer")
): HTMLElement | null {
    if (!container) {
        return null;
    }

    const actions = new RadioButtonsGroup<TableActionMode>(
        ACTION_SETTINGS.map(e => ({
            label: `${e.label1} ${e.label2}`,
            value: e.enumMember
        })),
        TableActionMode.ConfirmPayment
    );

    actions.onChange((selected) => {
        setCurrentActionMode(selected);
    });

    const panel = buildActionButtonsPanel(actions, ACTION_SETTINGS);
    container.appendChild(panel);

    return panel;
}