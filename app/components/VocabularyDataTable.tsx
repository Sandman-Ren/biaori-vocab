'use client';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import {VOCABULARY} from "@/app/data/vocabulary";


export function VocabularyDataTable() {
    DataTable.use(DT);

    return <DataTable
        data={VOCABULARY}
        columns={[
            {title: "Lesson", data: "lesson", className: "dt-center"},
            {title: "Word", data: "word", className: "dt-left"},
            {title: "Type", data: "type", className: "dt-center"},
            {title: "Definition", data: "definition", className: "dt-left"},
        ]}
        options={{
            // display
            scrollCollapse: false,
            scrollY: "75vh",
            autoWidth: false,
            processing: true,

            // searching: true,
            // paging
            paging: true,
            pageLength: 50,
            lengthMenu: [5, 10, 20, 50, 100],

            // ordering
            ordering: true,
            order: [[0, "asc"]],
            info: true,

            // save state
            stateSave: true,
            stateDuration: 60 * 60 * 24 * 365,  // 365 days
        }}
    />
}