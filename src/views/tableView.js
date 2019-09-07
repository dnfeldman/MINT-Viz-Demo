import * as utility from './utility';
import Handsontable from "handsontable";


export const initSettings = data => {
    const tableSp = $('#tableSp');
    utility.renderSelectPicker(tableSp, data.getInputNames());

    const sortSp = $('#sortSp');
    utility.renderSelectPicker(sortSp, ['Default', ...data.getDims()]);
    sortSp.selectpicker('val', 'Default');

    const filterSp = $('#filterSp');
    utility.renderSelectPicker(filterSp, data.getNumericDims());
};

export const getSeleted = () => $('#tableSp').val();

export const getFilterSetting = () => {
    return {
        filterBy: $('#filterSp').val(),
        gType: $('#gtSp').val(),
        gInput: $('#gtInput').val(),
        lType: $('#ltSp').val(),
        lInput: $('#ltInput').val()
    };
};

export const clearFilterSetting = () => {
    $('#gtSp').selectpicker('val', '');
    $('#ltSp').selectpicker('val', '');
    $('#gtInput').val('');
    $('#ltInput').val('');
    $('#filterSp').selectpicker('val', '');
};

export const getSearchKeyword = () => $('#searchInput').val();

export const getSortSetting = () => {
    return {
        sortBy: $('#sortSp').val(),
        order: $('#orderSp').val()
    };
};

export const renderTable = results => {
    const div = $('#tableDiv');
    div.empty();
    results.forEach(result => {
        const table = $('<table>').addClass('table table-hover');
        div.append($('<h5>').text(result['name']));

        //Build table header
        let row = $('<tr>');
        // row.append($('<th>').text('name'));

        const columnNames = Object.keys(result["data"][0]);
        console.log(JSON.stringify(columnNames));

        columnNames.forEach((el, idx) => {
            if (idx === 0) {
                row.append($('<th>').text(`${el}`));
            } else {
                row.append($('<th>').text(`${el}`).addClass('text-right'));
            }

        });
        table.append($("<thead>").append(row));
        
        //Insert data to table
        const tbody = $('<tbody>');
        const data = result['data'];
        table.append(tbody);
        div.append(table);

        data.forEach(ele => {
            row = $('<tr>');
            Object.keys(ele).forEach(key => {
                const td = $('<td>');
                if(typeof ele[key] === 'number'){
                    td.text(ele[key].toFixed(2));
                    td.addClass('text-right');
                }else if(typeof ele[key] === 'string'){
                    td.text(ele[key]);
                }
                row.append(td);
            });
            tbody.append(row);
        });
        
    });
};

export const clear = () => {
    clearFilterSetting();
    $('#tableDiv').empty();
};