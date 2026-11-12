import { loadHtmlFile } from "./templateHandler.ts" ;
import { instantiateTemplate } from "./templateHandler.ts" ;
import "../customStyles.scss" ; 
import "../style.scss" ;

export const utilitiesHTML = await loadHtmlFile ( "htmlTemplates/utilities.html" ) ;
export const sectionsHTML = await loadHtmlFile ( "htmlTemplates/sections.html" ) ;

export interface TableInstance<T>
{
    rows: HTMLTableRowElement[] ;
    cells: HTMLTableCellElement[][] ;
    data: T[] ;
}


export interface TableColumn < T >
{
    header: string | string[];
    value : ( item: T ) => string ;
    headerTextSize ? : string ;
    cellTextSize ? : string ;
    headerCellWidth ? : string ;
    cellHeight ? : string ;
    sticky ?: boolean ;
    greyedOut ?: boolean ;
    onClick ?: ( item: T ) => void ;
    emphasized ?: boolean ;
}

export function createTable<T>(
    appendIn: HTMLElement,
    data: T[],
    columns: TableColumn<T>[]
): TableInstance<T>
{
    const rows: HTMLTableRowElement[] = [];
    const cells: HTMLTableCellElement[][] = [];

    const tableComponentsTEMPLATE =
        utilitiesHTML.getChildTemplate("tableComponents");

    //  REPONSIVE DIV
    const responsiveDivTEMPLATE = tableComponentsTEMPLATE.getChildTemplate ( "responsiveDiv" ) ;
    const responsiveDivHTML = instantiateTemplate ( responsiveDivTEMPLATE ) ;
    appendIn.appendChild ( responsiveDivHTML ) ;

    // TABLE
    const tableTEMPLATE = tableComponentsTEMPLATE.getChildTemplate ( "table" ) ;
    const tableHTML = instantiateTemplate ( tableTEMPLATE ) ;
    responsiveDivHTML.appendChild(tableHTML);
    tableHTML.classList.add ( "table-hover" ) ;

    // THEAD
    const headTEMPLATE = tableComponentsTEMPLATE.getChildTemplate ( "head" ) ;
    const headHTML = instantiateTemplate ( headTEMPLATE ) ;
    tableHTML.appendChild(headHTML);


    // TBODY
    const bodyTEMPLATE =
        tableComponentsTEMPLATE.getChildTemplate("body");

    const bodyHTML =
        instantiateTemplate(bodyTEMPLATE);

    tableHTML.appendChild(bodyHTML);


    // ROW + CELLS
    const rowTEMPLATE =
        tableComponentsTEMPLATE.getChildTemplate("row");

    const headCellTEMPLATE =
        tableComponentsTEMPLATE.getChildTemplate("headCell");

    const cellTEMPLATE =
        tableComponentsTEMPLATE.getChildTemplate("cell");


    // HEADER ROW
    const headRowHTML = instantiateTemplate ( rowTEMPLATE ) ;
    headRowHTML.classList.add ( "align-middle" ) ;

    headHTML.appendChild ( headRowHTML ) ;


    for ( const column of columns )
    {
        const headCellHTML = instantiateTemplate ( headCellTEMPLATE ) ;

        headCellHTML.style.whiteSpace = "nowrap";

        if ( Array.isArray ( column.header ) )
            headCellHTML.innerHTML = column.header.join("<br>");
        else
            headCellHTML.textContent = column.header;

        if ( column.headerCellWidth ) headCellHTML.style.width = column.headerCellWidth;
        if ( column.headerTextSize ) headCellHTML.style.fontSize = column.headerTextSize ;
        if ( column.greyedOut ) headCellHTML.classList.add ( "greyed-out-text" ) ;
        if ( column.emphasized ) headCellHTML.classList.add ( "enphasisText" ) ;

        headCellHTML.classList.add("sticky-header");

        headRowHTML.appendChild(headCellHTML);
    }


    // BODY ROWS
    for (const item of data)
    {
        const newRowHTML =
    instantiateTemplate(rowTEMPLATE) as HTMLTableRowElement;

        bodyHTML.appendChild(newRowHTML);

        const rowCells: HTMLTableCellElement[] = [];

        for (const column of columns)
        {
            const newCellHTML =
    instantiateTemplate(cellTEMPLATE) as HTMLTableCellElement;


            const cellValue = column.value(item);
            newCellHTML.textContent = cellValue;

            if (column.sticky)
            newCellHTML.classList.add("sticky-column");

            if ( column.cellTextSize ) newCellHTML.style.fontSize = column.cellTextSize ;

            if (column.cellHeight ) newCellHTML.style.height = column.cellHeight;

            if (newCellHTML.textContent === "") newCellHTML.classList.add("payment-day-completed");
            if ( column.greyedOut ) newCellHTML.classList.add ( "greyed-out-text" ) ;

            if (column.onClick)
            {
                newCellHTML.addEventListener
                (
                    "click",
                    () => column.onClick!( item )
                );
            }

            if ( column.emphasized )
            {
                newCellHTML.classList.add ( "enphasisText" ) ;
            }
            
            newRowHTML.appendChild(newCellHTML);

            rowCells.push(newCellHTML);
        }

        rows.push(newRowHTML);
        cells.push(rowCells);
    }

    return {
        rows,
        cells,
        data
    };
}