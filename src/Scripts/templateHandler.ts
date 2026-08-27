//  EXTENSION FUNCTIONS
declare global { interface HTMLTemplateElement {
    getChildTemplate ( name : string ): HTMLTemplateElement ; } }
HTMLTemplateElement.prototype.getChildTemplate = getChildTemplate ;


//  FUNCTIONS
export async function loadHtmlFile ( path : string )
{
    const response = await fetch ( `${ import.meta.env.BASE_URL }${ path }` ) ;
    const html = await response.text () ;
    const parser = new DOMParser () ;
    const doc = parser.parseFromString ( html , "text/html" ) ;
    const template = doc.getElementById ( "mainTemplate" ) as HTMLTemplateElement ;
    return template ;
}
export function getChildTemplate (
    this: HTMLTemplateElement,
    name: string
): HTMLTemplateElement
{
    return this.content.querySelector(
        `#${name}`
    ) as HTMLTemplateElement;
}

export function instantiateTemplate ( template : HTMLTemplateElement ) : HTMLElement
{ return template.content.firstElementChild!.cloneNode ( true ) as HTMLElement ; }