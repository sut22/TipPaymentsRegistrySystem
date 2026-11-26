export interface RadioOption < T >
{
  label: string ;
  value: T ;
  disabled?: boolean ;
}

export type SelectionChangeListener < T > = (
  selected: T ,
  previous: T | undefined ,
) => void ;


export class RadioButtonsGroup < T >
{
    public readonly options: readonly RadioOption < T > [] ;
    private _selected: T | undefined ; // currently selected

    // map between type and button
    private readonly buttonMap = new Map < T, HTMLButtonElement > () ;
    
    //  event listeners
    private readonly listeners = new Set < SelectionChangeListener < T > > () ;


    constructor (
        options: readonly RadioOption < T > [] ,
        initialSelected?: T
    ) { this.options = options ; this._selected = initialSelected ; }



    public get selected () : T | undefined { return this._selected ; }
    public isSelected ( value: T ): boolean { return this._selected === value ; }

    public bindButton ( value: T , button: HTMLButtonElement ): void
    {
        //  check if the value exist in the T enum
        const match = this.options.find ( ( opt ) => opt.value === value ) ;
        if (!match) { throw new Error ( `Cannot bind button to unknown value: ${String(value)}` ) ; }

        button.disabled = Boolean ( match.disabled ) ;
        button.setAttribute ( "role" , "radio" ) ;

        this.buttonMap.set(value, button);

        button.addEventListener ( "click" , () => { this.select ( value ) ; } ) ;

        this.syncDomState () ;
    }


    public select ( value: T ): void {
        //  check existence
        const match = this.options.find ( ( opt ) => opt.value === value ) ;
        if ( !match || match.disabled ) { return ; }

        //  if its already selected, do nothing
        if ( this._selected === value ) { return ; }

        //  select and update visuals
        const previous = this._selected ;
        this._selected = value ;
        this.syncDomState();

        //  notify every listener
        for ( const listener of this.listeners )
            { listener ( this._selected, previous ) ; }
    }


    public onChange ( listener: SelectionChangeListener < T > ): () => void
    {
        this.listeners.add ( listener ) ;
        return () => { this.listeners.delete ( listener ) ; } ;
    }


    private syncDomState (): void
    {
        //  per each entry on the map
        for ( const [ value , button ] of this.buttonMap.entries () )
        {
            const active = this._selected === value;
            button.classList.toggle ( "btn-outline-info" , active ) ;
            button.classList.toggle ( "btn-outline-light" , !active ) ;

            button.setAttribute ( "aria-checked" , String ( active ) ) ;
        }
    }
}