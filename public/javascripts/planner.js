class Planner {
    constructor() {
        this.locationMap = null;
        this.layoutMap = null;

        this.attachListeners();
        this.initLocationMap();
        this.initLayoutMap();
    }

    attachListeners() {
        document.getElementById("campaignList")
        .addEventListener("input", this.fetchCampaign);
    }

    fetchCampaign = async (e) => {

        this.clearLocationMap();
        this.clearLayoutMap();

        const value  = document.querySelector("#campaignList").value;
        const option = document.querySelector('option[value="' + value + '"]');

        if (!option) {
            return;
        }

        let campaignResults = await (await fetch(`http://localhost:3000/planner/campaigns/${option.dataset.campaignid}`)).json();

        const campaignName = document.querySelector("#campaignName");
        campaignName.innerHTML = campaignResults.campaignInfo[0].description;

        const playerList = document.querySelector("#playerList");
        var playerNames = campaignResults.players.map(player => player.name).join(", ");
        playerList.innerHTML = `Players: ${playerNames}`;

        let gameResults = await (await fetch(`http://localhost:3000/planner/campaigns/${option.dataset.campaignid}/games`)).json();
        this.loadGames(gameResults.games);

    }

    buildGameTable(games) {

        const targetTable = document.querySelector("#gameOverviewBody");

        while (targetTable.lastElementChild) {
            targetTable.removeChild(targetTable.lastElementChild);
        }

        games.forEach((game) => {
            var date    = new Date(game.gamedate);
            var dateViz = date.toLocaleDateString('en-us', { year:"numeric", month:"short"})
    
            var row = targetTable.insertRow(0);
            var cell_a = row.insertCell(0);
            cell_a.innerHTML = game.name;
            var cell_b = row.insertCell(1);
            cell_b.innerHTML = game.description;
            var cell_c = row.insertCell(2);
            cell_c.innerHTML = dateViz;
        });

    }

    loadGames = (games) => {

        this.buildGameTable(games);

        games.forEach((game) => {
            
            var date    = new Date(game.gamedate);
            var dateViz = date.toLocaleDateString('en-us', { year:"numeric", month:"short"});

            var geoJsonGroup = L.geoJSON(JSON.parse(game.geojson), {

                onEachFeature: function(feature, layer) {

                    layer.tag = "gameLocation";
                    layer.bindPopup(
                        `<h6>${game.name}</h6>
                         <p>Description: ${game.description}</p>
                         <p>Date: ${dateViz}</p>
                        `
                    )
                },

                pointToLayer: function(feature, latlng) {
                    var icon = L.icon({
                        iconUrl: `http://localhost:3000/images/${game.image}`,
                        iconSize:     [50, 50], 
                        iconAnchor:   [25, 25], 
                        popupAnchor:  [0, 0]
                    });

                    return L.marker([latlng.lat, latlng.lng], {icon: icon});
                }
            });

            geoJsonGroup.gameId = game.id; 
            geoJsonGroup.addTo(this.locationMap);
            geoJsonGroup.on("click", this.locationMarkerClicked);
        });

    }

    initLocationMap = () => {
    
        var bounds = [[0,0], [1000, 1000]];
    
        this.locationMap = L.map('locationMap', {
            attributionControl: false,
            crs: L.CRS.Simple,
            minZoom: -2,
        });
    
        L.imageOverlay('http://localhost:3000/images/grid_a.png', bounds).addTo(this.locationMap);
    
        this.locationMap.fitBounds(bounds);
    }

    clearLayoutMap = () => {
        this.layoutMap.eachLayer((layer) => {
            if (layer.tag == "layoutObject") {
                this.layoutMap.removeLayer(layer);
            }
        });
    }

    clearLocationMap = () => {
        this.locationMap.eachLayer((layer) => {
            if (layer.tag == "gameLocation") {
                this.locationMap.removeLayer(layer);
            }
        });
    }

    locationMarkerClicked = async (e) => {

        this.clearLayoutMap();

        let layoutResults = await (await fetch(`http://localhost:3000/planner/layouts/${e.target.gameId}`)).json();

        layoutResults.layouts.forEach((layout) => {
            L.geoJSON(JSON.parse(layout.geojson), {
                onEachFeature: function(feature, layer) {
                    layer.tag = "layoutObject"
                }
            }).addTo(this.layoutMap);
        });
        
    }

    initLayoutMap = () => {
        var bounds = [[0,0], [1000, 1000]];
    
        this.layoutMap = L.map('layoutMap', {
            attributionControl: false,
            crs: L.CRS.Simple,
            minZoom: -10,
        });
    
        this.layoutMap.fitBounds(bounds);

        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: new L.FeatureGroup()
            }
        });
        this.layoutMap.addControl(drawControl);
    }
}

let planner = new Planner();