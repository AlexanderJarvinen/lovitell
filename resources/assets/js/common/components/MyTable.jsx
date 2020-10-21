import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';

export default class MyTable extends React.Component {
    static props = {
        columns: PropTypes.array.required,
        data: PropTypes.array.required,

        onRow: PropTypes.func


    };
    curClass='odd-row';
    onRow = (row, rowIndex) => {
        this.curClass = this.curClass=='odd-row'?'even-row':'odd-row';
        /*
         return {
         className: classnames(
         this.isSelectedRow(rowIndex)? 'selected-row':'',
         ),
         onClick: () => this.onSelectRow(rowIndex)
         };
         */
        return {
            style: {'backgroundColor': (typeof row.tr_bg_col != "undefined" && row.tr_bg_col.trim() != '')?row.tr_bg_col:''},
            className: this.curClass
        }
    };
    render=()=>{
        const resolvedColumns = resolve.columnChildren({columns: this.props.columns});
        const resolvedRows = resolve.resolve({
            columns: resolvedColumns,
            method: resolve.nested
        })(this.props.data);
        return (
            <div className='b-table__wrap'>
                <Table.Provider
                    columns={resolvedColumns}
                    className="table table-bordered table-hover dataTable"
                    >
                    <Table.Header headerRows={resolve.headerRows({columns: this.props.columns})} />

                    <Table.Body
                        rows={resolvedRows}
                        rowKey="id"
                        onRow={this.onRow}
                        />
                </Table.Provider>
                <LoadBar />
            </div>
        )
    };
}