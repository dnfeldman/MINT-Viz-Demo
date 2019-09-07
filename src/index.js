import 'jquery-ui/ui/effects/effect-slide';
import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select';
// import 'bootstrap-select/dist/bootstrap-select.min.css'
import Data from './models/Data';
import * as queryView from './views/queryView';
import * as tableView from './views/tableView';
import * as chartView from './views/chartView';
// import * as utility from './views/utility';
 

const state = {};

const slideToggle = () => {
    $('#queryCard').toggle('slide', {direction: "left"}, 500);
    $('#resultCard').toggle('slide', {direction: "right"}, 500);
};

const controlQuery = async () => {
    const url = queryView.getUrl();

    if(url){
        try {
            //Clear previous result
            tableView.clear();
            chartView.clear();


            //Get data from the given url
            state.data = new Data(url);
            await state.data.fetchInput();
            slideToggle();

            // input = state.data.input;
            tableView.initSettings(state.data);
            chartView.initSettings(state.data);

        } catch (error) {
            console.log(error);
        }
    }
};

//Refresh the tableview and redraw the chart if generated
const refresh = () => {
    tableView.renderTable(state.data.updateOutput());

    //Rebuild a new chart if chart is generated.
    if(chartView.isGenerated()){
        $("#gnrBtn").trigger("click");
    }
};


 

//Card slidetoggle event
$('#queryCard .card-header button:first').click(slideToggle);
$('#resultCard .card-header button:first').click(slideToggle);


//Page radio Button switching event
$('input[type=radio][name=pageOptions]').change(e => {
    const val = $('input[type=radio][name=pageOptions]:checked').val();
    if(val === 'Both'){
        $('#tableContainer').removeClass('col-12').addClass('col-6');
        $('#chartContainer').removeClass('col-12').addClass('col-6');
        $('#tableContainer').show();
        $('#chartContainer').show();
        if(chartView.isGenerated()){
            $("#gnrBtn").trigger("click");
        }
    }else if(val === 'Table'){
        $('#chartContainer').hide();
        $('#tableContainer').removeClass('col-6').addClass('col-12');
        $('#tableContainer').show();
    }else if(val === 'Chart'){
        $('#tableContainer').hide();
        $('#chartContainer').removeClass('col-6').addClass('col-12');
        $('#chartContainer').show();
        if(chartView.isGenerated()){
            $("#gnrBtn").trigger("click");
        }
    }
});

$('#queryBtn').click(e => {
    controlQuery();
});

//Show Button click event
$('#stBtn').click(e => {
    state.data.setSelected(tableView.getSeleted());
    refresh();
});

//Table Advanced Button click event
$('#tableAdvBtn').click(() => {
    $('#tableAdvRow').toggleClass('d-none');
});

//Sorted By SelectPicker change event
$('#sortSp').change(() => {
    state.data.setSortSetting(tableView.getSortSetting());
    refresh();
});

//Order SelectPicker change event
$('#orderSp').change(() => {
    state.data.setSortSetting(tableView.getSortSetting());
    refresh();
});

//Execute filter Button click event
$('#exefBtn').click(() => {
    state.data.setFilterSetting(tableView.getFilterSetting());
    refresh();
});

//Clear filter Button click event
$('#cfBtn').click(() => {
    tableView.clearFilterSetting();
    $('#exefBtn').trigger('click');
});

//Search Input keyup event
$('#searchInput').keyup(() => {
    state.data.setSearchKeyword(tableView.getSearchKeyword());
    refresh();
});


//Chart Advanced Button click event
$('#chartAdvBtn').click(() => {
    $('#chartAdvRow').toggleClass('d-none');
});

//Generate Button click event
$('#gnrBtn').click(() => {
    const settings = chartView.getSettings();
    chartView.renderChart(state.data.getOutput(settings));
});