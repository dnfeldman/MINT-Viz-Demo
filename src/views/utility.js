export const renderSelectPicker = (sp, values) => {
    sp.empty();
    values.forEach(val => {
        const option = $('<option>');
        option.text(val);
        option.val(val);
        sp.append(option);
        sp.selectpicker('refresh');
    });
};

//Generate random string
const makeId = (length) => {
    return Math.random().toString(36).substring(2, length + 2);
};

//download object as Json file from browser
const downloadObjectAsJson = (exportObj, exportName) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

//Generate random data and download it
export const generateJsonObject = (rowNum, colNum, ObjectNum = 1) => {
    const json = [];
    const colSet = new Set();
    while(colSet.size < colNum){
        colSet.add(makeId(8));
    }
    const dims = Array.from(colSet);

    for(let i = 0; i < ObjectNum; i++){
        const object = {};
        object.name = makeId(4);

        
        object.unit = {};
        dims.forEach(d => {
            object.unit[d] = makeId(2);
        });

        const rowSet = new Set();

        object.data = [];
        while(rowSet.size < rowNum){
            const id = makeId(10);
            if(!rowSet.has(id)){
                rowSet.add(id);
                const row = {};
                row.Name = id;
                dims.forEach(d => {
                    row[d] = Math.random() * 10000;
                });
                object.data.push(row);
            }
        }
        json.push(object);
    }
    downloadObjectAsJson(json, `input_${ObjectNum}x${rowNum}x${colNum}`);
};