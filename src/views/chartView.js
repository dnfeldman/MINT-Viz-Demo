import * as utility from './utility';
import Highcharts from 'highcharts';

let generated = false;
let chartOptions = {};
const markerSymbol = ['square', 'circle', 'diamond', 'triangle', 'triangle-down'];


const initAxises = (categories, yType, yTitle, xNum = 1, yNum = 1) => {
    const xAxis = [];
    const yAxis = [];
    const space = 5;

    const width = (100 - space * (xNum - 1)) / parseFloat(xNum);
    for(let i = 0; i < xNum; i++){
        const axis = {
            // title: {
            //     text: 'xRange'
            // },
            categories: categories,
            width: `${width}%`,
            left:`${i * (width + space)}%`,
            offset: 0
        };
        xAxis.push(axis);
    }

    const height = (100 - space * (yNum - 1)) / parseFloat(yNum);
    for(let i = 0; i < yNum; i++){
        const axis = {
            title: {
                text: yTitle
            },
            type: yType,
            height: `${height}%`,
            top:`${i * (height + space)}%`,
            offset: 0
        };
        yAxis.push(axis);
    }

    return {
        xAxis: xAxis,
        yAxis: yAxis
    };
};

const processData = (results, settings) => {
    // const series = [];
    // let categories = [];
    const axisesNum = {x: 1, y: 1};

    // if groupBy is undefined, we just put everything into one series
    const groupBy = undefined;

    // console.log("HERE");
    console.log(JSON.stringify(settings));
    const data = results[0]['data'];
    const groupedData = {};
    const domainName = settings.xAxis;
    const seriesBuilder = {};
    const rangeName = settings.yAxis[0];

    if (groupBy === undefined) {
        seriesBuilder['all'] = {}
    } else {
        console.log("BKAG");
    }

    data.forEach(row => {
        const domainValue = row[domainName];
        if (seriesBuilder['all'][domainValue] !== undefined) {
            seriesBuilder['all'][domainValue]["rawData"].push(parseFloat(row[rangeName]))
        } else {
            seriesBuilder['all'][domainValue] = {
                "name": domainValue,
                "rawData": [parseFloat(row[rangeName])]
            }
        }
    });

    const sum = (accumulator, currentValue) => {
        return accumulator + currentValue;
    };


    // TODO iterate over Object.keys(seriesBuilder) and then forEach
    Object.keys(seriesBuilder['all']).forEach(domainValue => {
        const rawData = [].concat(seriesBuilder['all'][domainValue]["rawData"]);

        seriesBuilder['all'][domainValue]["data"] = rawData.reduce(sum, 0); //seriesBuilder['all'][domainValue]["rawData"][0];
        seriesBuilder['all'][domainValue]["type"] = settings.type;
    });


    const categories = [... new Set(Object.keys(seriesBuilder['all']))];
    let d = [];
    categories.forEach((dv) => {
        d.push(seriesBuilder['all'][dv]["data"]);
    });
    const series = [{"type": settings.type, "data": d}];
    // const series = Object.values(seriesBuilder['all']['data']);
    const yType = settings.scaling;
    const yTitle = settings.yAxis.length > 1 ? 'yRange' :
        settings.stacking === "percent" ? "Percent " + settings.yAxis : "";
    const axises = initAxises(categories, yType, yTitle, axisesNum.x, axisesNum.y);

    return [series, axises];
};

export const isGenerated = () => generated;

export const initSettings = data => {
    const xAxisSp = $('#xAxisSp');
    // utility.renderSelectPicker(xAxisSp, ['name']);
    // utility.renderSelectPicker(xAxisSp, ['Name', 'Experiment']);
    utility.renderSelectPicker(xAxisSp, [].concat(data.getCategoricalOrdinalDims(), data.getCategoricalNominalDims()));
    const yAxisSp = $('#yAxisSp');

    console.log(data.getNumericDims());
    utility.renderSelectPicker(yAxisSp, data.getNumericDims());
};

export const renderChart = (results, panelId = 'customizeChart') => {
    generated = true;
    const settings = getSettings();
    const [series, axises] = processData(results, settings);
    
    chartOptions = {
        chart: {
            zoomType: 'y'
        },
        title: {
            text: ''
        },
        xAxis: axises.xAxis,
        yAxis: axises.yAxis,
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>',
        },
        legend: {
            reversed: settings.stacking == "percent" ? true : false
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                stacking: settings.stacking
            }
        },
        series: series
    };
    Highcharts.chart(panelId, chartOptions);
};

export const getSettings = () => {
    return {
        type: $('#typeSp').val(),
        xAxis: $('#xAxisSp').val(),
        yAxis: $('#yAxisSp').val(),
        stacking: $('#stackingSp').val() == 'default' ? '' : $('#stackingSp').val(),
        scaling: $('input[name=scalingOptions]:checked').val(),
        split: $('input[name=splitOptions]:checked').val(),
        splitRow: $('#splitRow').val(),
        splitCol: $('#splitCol').val()
    };
};

export const getChartOptions = () => {
    return chartOptions;
}

export const clear = () => {
    generated = false;
    chartOptions = {};
    $('#customizeChart').empty();
};