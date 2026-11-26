import "./radioButtonsGroup" ;
import { sectionsHTML } from "../contentGenerator.ts" ;
import { instantiateTemplate } from "../templateHandler.ts" ;
import type { RadioButtonsGroup } from "./radioButtonsGroup";

export interface ActionRadioGroupSettings < T >
{ enumMember: T ;  iconClass : string ; label1: string ; label2: string ; }

export function buildActionButton ( iconClass: string ,
                           label1:string ,
                           label2:string ) : HTMLButtonElement
{
    const genericActionButtonTEMPLATE = sectionsHTML.getChildTemplate ( "tableActionsButton" ) ;
    const genericActionButtonHTML = instantiateTemplate ( genericActionButtonTEMPLATE ) ;

    const label1TEXT = genericActionButtonHTML.querySelector < HTMLElement > ( "#label1" )! ;
    label1TEXT.textContent = label1 ;

    const label2TEXT = genericActionButtonHTML.querySelector < HTMLElement > ( "#label2" )! ;
    label2TEXT.textContent = label2 ;

    const iconI = genericActionButtonHTML.querySelector < HTMLElement > ( "#icon" )! ;
    iconI.classList.add ( iconClass ) ;

    return genericActionButtonHTML as HTMLButtonElement ;
}


export function buildActionButtonsPanel < T >(
    group: RadioButtonsGroup < T > ,
    settings: ActionRadioGroupSettings < T > []
): HTMLElement
{
    const outputHTML = document.createElement ( "div" ) ;
    outputHTML.classList.add ( "d-flex" , "my-1" ) ;

    //  create a button out of each setting and append it to the output
    for ( const e of settings ) {
        outputHTML.appendChild ( createActionRadioButton ( group , e.enumMember ,
                                         e.iconClass, e.label1 , e.label2 ) ) ;
    }

    return outputHTML;
}

//  BUILDS AND BINDS -- MAIN FUNCTION
export function createActionRadioButton < T > (
    group: RadioButtonsGroup < T >,
    enumMember: T ,
    iconClass: string ,
    label1: string ,
    label2: string
): HTMLButtonElement
{
    const button = buildActionButton ( iconClass , label1 , label2 ) ;

    group.bindButton ( enumMember, button ) ;

    return button;
}
