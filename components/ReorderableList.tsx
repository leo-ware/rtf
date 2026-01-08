"use client";

import React, { useRef, createContext, useEffect, useState, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical } from "lucide-react";
import { Card } from "./ui/card";

type ReorderableListContextType = { moveItem: (dragIndex: number, hoverIndex: number) => void }
const ReorderableListContext = createContext<ReorderableListContextType | null>(null);

type ReorderableListItemType<T extends string> = {
    id: T
    widget: React.ReactNode
}

type ReorderableListProps<T extends string> = {
    items: ReorderableListItemType<T>[];
    onReorder: (newOrder: T[]) => void;
    disabled?: boolean
}

const ReorderableList = <T extends string>({ items, onReorder, disabled = false }: ReorderableListProps<T>) => {
    const [itemOrder, setItemOrder] = useState<string[]>([]);
    const itemTypeRef = useRef(`drag_${Math.round(Math.random() * 10000)}`)
    const itemType = itemTypeRef.current

    const prevItemOrderRef = useRef<string[]>([]);

    useEffect(() => {
        // Only call onReorder if the order has actually changed
        if (itemOrder.length > 0 &&
            (prevItemOrderRef.current.length !== itemOrder.length ||
            prevItemOrderRef.current.some((id, index) => id !== itemOrder[index]))) {
            onReorder(itemOrder as T[]);
            prevItemOrderRef.current = itemOrder;
        }
    }, [itemOrder, onReorder])

    useEffect(() => {
        setItemOrder(prev => {
            const newOrder = prev.filter(id => items.some(item => item.id === id));
            items.forEach(item => {
                if (!newOrder.includes(item.id)) {
                    newOrder.push(item.id);
                }
            })
            return newOrder;
        })
    }, [items])

    const moveItem = (dragIndex: number, hoverIndex: number) => {
        setItemOrder(prev => {
            const newOrder = [...prev];
            const draggedItem = newOrder[dragIndex];
            newOrder.splice(dragIndex, 1);
            newOrder.splice(hoverIndex, 0, draggedItem);
            return newOrder;
        })
    }

    const orderedItems = useMemo(() => {
        return itemOrder
            .map(id => items.find(item => item.id === id))
            .filter(x => !!x);
    }, [itemOrder, items])

    return (
        <ReorderableListContext.Provider value={{ moveItem }}>
            <div className="flex flex-col gap-2">
                {orderedItems.map((item, index) => (
                    <ReorderableListItemWithIndex
                        key={item.id}
                        id={item.id}
                        index={index}
                        moveItem={moveItem}
                        itemType={itemType}
                        disabled={disabled}
                    >
                        {item.widget}
                    </ReorderableListItemWithIndex>
                ))}
            </div>
        </ReorderableListContext.Provider>
    );
};

type DragItem = {
    index: number;
    id: string;
}

type ReorderableListItemProps = {
    id: string;
    children: React.ReactNode;
    className?: string;
    index?: number
    moveItem: (fromIndex: number, toIndex: number) => void
    itemType: string
    disabled?: boolean
}

const ReorderableListItemWithIndex = ({ id, children, className = "", index = 0, moveItem, itemType, disabled = false }: ReorderableListItemProps) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop({
        accept: itemType,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        drop: (item: DragItem) => {
            moveItem(item.index, index);
        },
    }, [index]);

    const [{ isDragging }, drag, preview] = useDrag({
        type: itemType,
        item: (): DragItem => ({ id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: !disabled,
    }, [disabled, itemType, id, index]);

    // Connect the preview ref to show full item when dragging
    useEffect(() => {
        if (previewRef.current) {
            preview(previewRef.current);
        }
    }, [preview]);
    useEffect(() => {
        if (itemRef.current) {
            drag(itemRef.current);
        }
    }, [drag]);
    useEffect(() => {
        if (itemRef.current) {
            drop(itemRef.current);
        }
    }, [drop]);

    return (
        <div ref={itemRef} className="relative">
            {isOver && !isDragging && (
                <div className="absolute inset-0 bg-gray-300 opacity-50 rounded-lg border-2 border-gray-400 pointer-events-none z-10" />
            )}

            <div
                ref={previewRef}
                style={{ opacity: isDragging ? 0.4 : 1 }}
                className={className}
            >
                <Card className="p-2 flex flex-row items-center gap-2">
                    <div
                        ref={dragHandleRef}
                        className={`
                            cursor-grab active:cursor-grabbing
                            ${className}
                            ${disabled && "invisible"}
                        `}
                        style={{
                            opacity: isDragging ? 0.5 : 1,
                        }}
                    >
                        <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>
                    {children}
                </Card>
            </div>
        </div>

    );
}

export default ReorderableList