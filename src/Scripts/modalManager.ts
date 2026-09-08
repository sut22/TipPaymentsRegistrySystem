import Modal from "bootstrap/js/dist/modal";
import { sectionsHTML } from "./contentGenerator.ts" ;
import { instantiateTemplate } from "./templateHandler.ts" ;

//  calls to APPS SCRIPT
import { callApi } from "./appsScriptCall.ts" ;

export function showRegisterPaymentModal (
    username: string ,
    userId: string ,
    waiterName: string ,
    waiterId: string ,
    previousDebt: number ,
    onPaymentRegistered: (paymentAmount: number) => Promise<void>,
)
{
    const registerPaymentModalTEMPLATE = sectionsHTML.getChildTemplate ( "registerPayementModal" ) ;
    const registerPaymentModalHTML = instantiateTemplate ( registerPaymentModalTEMPLATE ) ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "modals" )! ;
    containerHTMLELEMENT.appendChild ( registerPaymentModalHTML ) ;

    let modal = null ; if ( !registerPaymentModalHTML ) return ;
    modal = new Modal ( registerPaymentModalHTML ) ;
    modal.show () ;

    const waiterNameTEXT = registerPaymentModalHTML.querySelector < HTMLElement > ( "#waiterName" )! ;
    console.log ( waiterNameTEXT ) ;
    waiterNameTEXT.textContent = waiterName ;

    const paymentChannelHTMLINPUT : HTMLInputElement = registerPaymentModalHTML.querySelector ( "#paymentChannelInput" )! ;
    const paymentAmountHTMLINPUT : HTMLInputElement = registerPaymentModalHTML.querySelector ( "#paymentAmountInput" )! ;

    const sendButtonHMTLBUTTON : HTMLButtonElement = registerPaymentModalHTML.querySelector ( "#sendButton" )! ;
    
    sendButtonHMTLBUTTON.addEventListener("click", async () =>
{
    const paymentAmount = parseFloat(paymentAmountHTMLINPUT.value);

    await uploadDebtPayment(
        username,
        userId,
        waiterName,
        waiterId,
        paymentAmount,
        paymentChannelHTMLINPUT.value,
        previousDebt,
        previousDebt - paymentAmount,
    );

    await onPaymentRegistered(paymentAmount);
});
}

async function uploadDebtPayment (
    username: string ,
    userId: string ,
    waiterName: string ,
    waiterId: string ,
    paymentAmount: number ,
    paymentChannel: string ,
    previousDebt: number ,
    newDebt: number ,
)
{
    return await callApi({
        function: "registerDebtPayment" ,
        username: username ,
        userId: userId ,
        waiterName: waiterName ,
        waiterId: waiterId ,
        paymentAmount: paymentAmount ,
        paymentChannel: paymentChannel ,
        previousDebt: previousDebt ,
        newDebt: newDebt ,
} ) } ;
