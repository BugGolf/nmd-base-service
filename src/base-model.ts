import { BaseCollection } from './index';

export class BaseModel<T>
{
    private _primary: string = "id";
    private _items: BaseCollection<T> = [];
    private _item: T = {} as any;

    public count()
    {
        return this._items.length || 0;
    }

    /**
     * Return items.
     */
    public get items(): BaseCollection<T> {
        return this._items;
    }
    /**
     * Set Items.
     */
    public set items(value : BaseCollection<T> )
    {
        this._items = value;
    }
    /**
     * Return selectedItem.
     */
    public get selectedItem(): T {
        return this._item;
    }

    /**
     * Select Item by item.
     * 
     * @param item Item selected.
     */
    public set selectedItem(item: T) {
        this._item = item;
    }

    /**
     * Return selectedIndex
     */
    public get selectedIndex(): number {
        return this._items.indexOf(this._item, 0);
    }

    /**
     * Select Item by index.
     * 
     * @param index Number index for item to select it.
     */
    public set selectedIndex(index: number) {
        this._item = this._items[index];
    }

    /**
     * Return Primary field name.
     */
    public get primaryKey(): string {
        return this._primary;
    }

    /**
     * Set Primary field name.
     * 
     * @param value Field primary key name.
     */
    public set primaryKey(value: string) {
        this._primary = value;
    }
}




