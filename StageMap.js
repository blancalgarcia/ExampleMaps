
var stageMap, regionMap;
var configDate = {
    year: "numeric",
    month: "long",
    day: "numeric"
};

var stageColors = new Array();
var stageList = Array();
var regionList = Array();

stageColors["stage1"] = "#cbcac9";
stageColors["stage2"] = "#dbdbdb";
stageColors["stage3"] = "#838383";
stageColors["stage4"] = "#a1a1a2";
stageColors["stage5"] = "#616161";

var lightColor = "#1b1464";

function setupMapStages(stageList) {
    $.each(stageList, function () {
        var item = this;
        //setStageStates(item);
        var idStage = "Stage" + item.Identification
        stageMap.getElementById(idStage).addEventListener('mouseover', function (event) {
            showStage(event, item);
        });
    });
}




function showStage(evt, item) {
    $("#stageName").html(item.Name);

    $("#releaseDate").html(formatDate(item.ReleaseDate));
    $("#openStage").html(formatDate(item.OpenStage));
    var states = "";
    $.each(item.StateList, function () {
        states += this.Name + "<br>";
    });
    $("#statesList").html(states);
    $(".boxStage").css({ top: evt.clientY, left: evt.clientX }).fadeIn(1000);
    highLightStageStates("stage" + item.Identification, 0.4);
}

function hideStage() {
    resetColors();
    $(".boxStage").fadeOut(1000);
}

function loadStagesCatalog() {
    $.ajax({
        url: "../Servicios/MerchandiseService.svc/PriceStageGetList",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (res) {
            if (res != null && res.d != null && res.d.List != null && res.d.List.length > 0) {
                stageList = res.d.List;
                setupMapStages(res.d.List);
            }
            else {

            }

        },
        error: function (xhr, status) {
        }
    });
}

function highLightStageStates(stage, opacity) {
    resetColors();
    lowOpacityStates();
    var listStates = stageMap.querySelectorAll('path.' + stage);

    $.each(listStates, function () {
        $("#" + this.id, stageMap).css("fill", lightColor);
        $("#" + this.id, stageMap).css("fill-opacity", opacity);
    });

}

function lowOpacityStates() {
    $("[id^='state']", stageMap).css("fill-opacity", 0.25);
}


function resetColors() {
    for (var key in stageColors) {
        $.each(stageMap.querySelectorAll('path.' + key), function () {
            $("#" + this.id, stageMap).css("fill", stageColors[key]);
            $("#" + this.id, stageMap).css("fill-opacity", 0.7);
        });
    }
}


function setStageStates(stage) {
    $.each(stage.StateList, function () {
        $("#state" + this.Identification, stageMap).attr("class", "stage" + stage.Identification);
    });
}




$(window).load(function () {
    stageMap = $("#map-stages")[0].contentDocument;
    loadStagesCatalog();
});

$(document).ready(function () {

    $(".boxStage").click(hideStage).hide();
    $(".markRegion").hide();
    $(".boxRegion").hide();
    $("#btnStage").removeClass('btn-default').addClass('btn-primary');
    $("#btnRegion").removeClass('btn-primary').addClass('btn-default');
    $(".buttonsbar").show(1000);

});