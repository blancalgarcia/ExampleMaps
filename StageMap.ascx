<%@ Control Language="C#" AutoEventWireup="true" CodeFile="StageMap.ascx.cs" Inherits="Controles_ControlPrices_StageMap" %>

<div class="row">
    <div class="col-md-12 map-graph" id="divMapStages">
        <div class="boxStage">
            <div class="col-md-12 stageTitle" id="stageName">Etapa #1</div>
            <div class="row">
                <div class="stageSubtitle">Liberación del precio</div>
                <div class="stageInfo" id="releaseDate"></div>
                <div class="stageSubtitle">Temporada Abierta</div>
                <div class="stageInfo" id="openStage"></div>
                <div class="stageSubtitle">Estados</div>
                <div class="stageInfo stageStates" id="statesList">
                </div>
            </div>
        </div>
        <object id="map-stages" data="../Imagenes/Maps/stages.svg" type="image/svg+xml" style="width: auto; height: auto; margin: 10px 10px;"></object>
    </div>
    </div>

<script type="text/javascript" src="../Controles/ControlPrices/Scripts/StageMap.js"></script>

