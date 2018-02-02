import { BaseCollection } from './index';
export declare class BaseModel<T> {
    private _primary;
    private _items;
    private _item;
    /**
     * Return items.
     */
    /**
     * Set Items.
     */
    items: BaseCollection<T>;
    /**
     * Return selectedItem.
     */
    /**
     * Select Item by item.
     *
     * @param item Item selected.
     */
    selectedItem: T;
    /**
     * Return selectedIndex
     */
    /**
     * Select Item by index.
     *
     * @param index Number index for item to select it.
     */
    selectedIndex: number;
    /**
     * Return Primary field name.
     */
    /**
     * Set Primary field name.
     *
     * @param value Field primary key name.
     */
    primaryKey: string;
}
