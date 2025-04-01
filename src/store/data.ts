import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { initialData } from "./dummy-data";

interface State {
   data: Column[];
   item: {
      modal: {
         isOpen: boolean;
         column_id: string | null;
         toggle: (column_id: string | null) => void;
         close: () => void;
         open: () => void;
      };
      add: (column_id: Column["id"], item: Omit<Item, "id" | "created_at">) => void;
      remove: (item_id: Item["id"]) => void;
      move: (prev_column_id: Column["id"], new_column_id: Column["id"], item: Item) => void;
   };
   column: {
      modal: {
         isOpen: boolean;
         toggle: () => void;
         close: () => void;
         open: () => void;
      };
      add: (column: Omit<Column, "id" | "created_at">) => void;
      remove: (column_id: Column["id"]) => void;
   };
}

const useDataStore = create<State>()(
   devtools(
      (set) => ({
         data: initialData,
         item: {
            modal: {
               isOpen: false,
               column_id: null,
               toggle: (column_id) => {
                  set(
                     (state) => ({
                        item: {
                           ...state.item,
                           modal: { ...state.item.modal, column_id, isOpen: !state.item.modal.isOpen },
                        },
                     }),
                     undefined,
                     "toggle-item-modal"
                  );
               },
               close: () => {
                  set(
                     (state) => ({
                        item: { ...state.item, modal: { ...state.item.modal, isOpen: false } },
                     }),
                     undefined,
                     "close-item-modal"
                  );
               },
               open: () => {
                  set(
                     (state) => ({
                        item: { ...state.item, modal: { ...state.item.modal, isOpen: true } },
                     }),
                     undefined,
                     "open-item-modal"
                  );
               },
            },
            add: (column_id, item) => {
               set(
                  (state) => ({
                     data: state.data.map((column) => {
                        if (column.id === column_id) {
                           const newItem: Item = {
                              id: uuidv4(),
                              ...item,
                              created_at: new Date().toISOString(),
                           };

                           return {
                              ...column,
                              items: [...column.items, newItem],
                           };
                        } else {
                           return column;
                        }
                     }),
                  }),
                  undefined,
                  "add-item"
               );
            },
            remove: (item_id) => {
               set(
                  (state) => ({
                     data: state.data.map((column) => {
                        if (column.items.some((i) => i.id === item_id)) {
                           return { ...column, items: column.items.filter((i) => i.id !== item_id) };
                        }
                        return column;
                     }),
                  }),
                  undefined,
                  "remove-item"
               );
            },
            move: (prev_column_id, new_column_id, item) => {
               if (prev_column_id === new_column_id) return;

               set(
                  (state) => {
                     return {
                        data: state.data.map((column) => {
                           if (column.id === prev_column_id) {
                              return { ...column, items: column.items.filter((i) => i.id !== item.id) };
                           } else if (column.id === new_column_id) {
                              const newItem = {
                                 ...item,
                                 id: uuidv4(),
                                 created_at: new Date().toISOString(),
                              };
                              return { ...column, items: [...column.items, newItem] };
                           } else {
                              return column;
                           }
                        }),
                     };
                  },
                  undefined,
                  "move-item"
               );
            },
         },
         column: {
            modal: {
               isOpen: false,
               toggle: () => {
                  set(
                     (state) => ({
                        column: {
                           ...state.column,
                           modal: { ...state.column.modal, isOpen: !state.column.modal.isOpen },
                        },
                     }),
                     undefined,
                     "toggle-column-modal"
                  );
               },
               close: () => {
                  set(
                     (state) => ({
                        column: { ...state.column, modal: { ...state.column.modal, isOpen: false } },
                     }),
                     undefined,
                     "close-column-modal"
                  );
               },
               open: () => {
                  set(
                     (state) => ({
                        column: { ...state.column, modal: { ...state.column.modal, isOpen: true } },
                     }),
                     undefined,
                     "open-column-modal"
                  );
               },
            },
            add: (column) => {
               const newColumn = {
                  id: uuidv4(),
                  ...column,
                  created_at: new Date().toISOString(),
               };

               set(
                  (state) => ({
                     data: [...state.data, newColumn],
                  }),
                  undefined,
                  "add-column"
               );
            },
            remove: (column_id) => {
               set(
                  (state) => ({
                     data: state.data.filter((c) => c.id !== column_id),
                  }),
                  undefined,
                  "remove-column"
               );
            },
         },
      }),
      {
         name: "data-store",
      }
   )
);

export default useDataStore;
