import Modal from "bootstrap/js/dist/modal";
import { sectionsHTML } from "./contentGenerator.ts" ;
import { instantiateTemplate } from "./templateHandler.ts" ;


export function showRegisterPaymentModal ( waiterName : string)
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
}
