export default class Data{
    constructor(url){
        this.url = url;
        this.selected = [];
    }

    async fetchInput(){
        try {
            await $.getJSON(this.url, (input) => {
                this.input = input;
            });
        } catch (error) {
            throw error;
        }
    }

    select(input){
        const output = [];
        //clone objects and store them in output
        input.forEach(i => {
            if(this.selected.includes(i['name'])){
                output.push(JSON.parse(JSON.stringify(i)));
            }
        });
        // console.log('select');
        // console.log(output);
        return output;
    }

    filter(input){
        if(!this.filterSetting){
            return input;
        }
        const filterBy = this.filterSetting.filterBy;
        
        if(filterBy !== ''){
            const gType = this.filterSetting.gType;
            const gInput = this.filterSetting.gInput;
            const lType = this.filterSetting.lType;
            const lInput = this.filterSetting.lInput;
            input.forEach(i => {
                //Greater than
                if(gType !== '' && gInput !== ''){
                    const val = parseFloat(gInput);
                    if(gType === 'gt'){
                        i['data'] = i['data'].filter(row => row[filterBy] > val);
                    }else if(gType === 'geq'){
                        i['data'] = i['data'].filter(row => row[filterBy] >= val);
                    }
                }
                //Less than
                if(lType !== '' && lInput !== ''){
                    const val = parseFloat(lInput);
                    if(lType === 'lt'){
                        i['data'] = i['data'].filter(row => row[filterBy] < val);
                    }else if(lType === 'leq'){
                        i['data'] = i['data'].filter(row => row[filterBy] <= val);
                    }
                }
            });
        }
        // console.log('filter');
        // console.log(input);
        return input;
    }

    search(input){
        if(this.searchKeyword && this.searchKeyword !== ''){
            input.forEach(i => {
                i['data'] = i['data'].filter(d => 
                    Object.values(d).some(val => {
                        let term = '';
                        if(typeof val === 'number'){
                            term = val.toFixed(2);
                        }else if(typeof val === 'string'){
                            term = val;
                        }
                        if(term.includes(this.searchKeyword)){
                            return true;
                        }
                        return false;
                    })
                );
            });
        }
        // console.log('search');
        // console.log(input);
        return input;
    }

    sort(input){
        if(!this.sortSetting){
            return input;
        }

        const sortBy = this.sortSetting.sortBy;
        const order = this.sortSetting.order;
        if(sortBy !== 'Default'){
            input.forEach(i => {
                i['data'].sort((a, b) => {
                    if(typeof a[sortBy] === 'string'){
                        return order == "ac" ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy]);
                    }else if(typeof a[sortBy] === 'number'){
                        return order == "ac" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
                    }
                });
            });
        }
        // console.log('sort');
        // console.log(input);
        return input;
    }

    assignLocInChart(x = 3, y = 2){
        const xLen = x;
        const yLen = y;
        for(let i = 0; i < yLen; i++){
            for(let j = 0; j < xLen && i * xLen + j < this.output.length; j++){
                const pos = {
                    xAxis: j,
                    yAxis: i
                };
                this.output[i * xLen + j].pos = pos;
            }
        }
    }

    setSelected(selected){
        this.selected = selected;
    }

    setFilterSetting(setting){
        this.filterSetting = setting;
    }

    setSearchKeyword(keyword){
        this.searchKeyword = keyword;
    }

    setSortSetting(setting){
        this.sortSetting = setting;
    }

    getInputNames(){
        return this.input.map(i => i['name']);
    }

    getDims(){
        return Object.keys(this.input[0]['data'][0]);
    }

    getNumericDims(){
        const data = this.input[0]['data'][0];
        return this.getDims().filter(key => !isNaN(data[key]))
    }

    getCategoricalNominalDims() {
        const data = this.input[0]['data'][0];
        return this.getDims().filter(key => isNaN(data[key]) && isNaN(Date.parse(data[key])))
    }

    getCategoricalOrdinalDims(){
        const data = this.input[0]['data'][0];
        return this.getDims().filter(key => isNaN(data[key]) && !isNaN(Date.parse(data[key])))
    }

    updateOutput(){
        this.output = this.sort(this.search(this.filter(this.select(this.input))));
        return this.output;
    }

    getOutput(settings){
        if(typeof settings.split !== 'undefined'){
            this.assignLocInChart(settings.splitRow, settings.splitCol);
        }
        return this.output;
    }

}