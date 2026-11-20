export interface RadioOption < T >
{
    
    label: string ;
    value: T ;
    disabled?: boolean ;
}

export class RadioButtonsGroup < T > {
    public readonly options: readonly RadioOption < T > [] ;
    private _selected: T | undefined ;

    constructor ( options: readonly RadioOption < T > [] , initialSelected?: T ) {
        this.options = options;
        this._selected = initialSelected;
    }

    public get selected (): T | undefined { return this._selected ; }

     public select ( value: T ): void {
        //  check if that value does exist in the array ------
        const match = this.options.find ( ( opt ) => opt.value === value ) ;
        if ( !match ) { throw new Error(`Invalid radio option value: ${String(value)}`); }
        if ( match.disabled ) { return ; }

        this._selected = value ;
    }

    public clearSelection(): void {
        this._selected = undefined;
    }

    public isSelected(value: T): boolean {
        return this._selected === value;
    }
}