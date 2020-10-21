require('es6-promise').polyfill();
var webpack = require("webpack");
var	path	=	require('path');

module.exports = {
    entry: {
        profile: "./resources/assets/js/profile/components/profileApp.jsx",
        dashboard: "./resources/assets/js/common/components/Dashboard.jsx",
        controlbar: "./resources/assets/js/common/components/Controlbar.jsx",
        sidebar: "./resources/assets/js/common/components/Sidebar.react.jsx",
        report: "./resources/assets/js/report/components/Report.jsx",
        chart: "./resources/assets/js/report/components/Chart.jsx",
        newbuildingform: "./resources/assets/js/inventory/components/NewBuildingForm.jsx",
        modifybuildingform: "./resources/assets/js/inventory/components/ModifyBuildingForm.jsx",
        entrances: "./resources/assets/js/inventory/components/Entrances.jsx",
        buildstatusmounter: "./resources/assets/js/inventory/components/BuildStatusMounter.jsx",
        equipmentlist: "./resources/assets/js/inventory/components/EquipmentList.jsx",
        equipmentlist2: "./resources/assets/js/inventory/components/EquipmentList2.jsx",
        equipmentrevision: "./resources/assets/js/inventory/components/EquipmentRevision.jsx",
        networkcheck: "./resources/assets/js/inventory/components/NetworkCheck.jsx",
        aptemplatechange: "./resources/assets/js/inventory/components/APTemplateChange.jsx",
        buildlist: "./resources/assets/js/inventory/components/BuildList.jsx",
        streetslist: "./resources/assets/js/inventory/components/StreetsList.jsx",
        documentlist: "./resources/assets/js/financial/components/DocumentList.jsx",
        locationslist: "./resources/assets/js/inventory/components/LocationsList.jsx",
        vlanslist: "./resources/assets/js/inventory/components/VlansList.jsx",
        servicewrap: "./resources/assets/js/inventory/components/ServiceWrap.jsx",
        troubles: "./resources/assets/js/inventory/components/Troubles.jsx",
        clients: "./resources/assets/js/inventory/components/Clients.jsx",
        clientpage: "./resources/assets/js/commercial/components/ClientPage.js",
        clientlist: "./resources/assets/js/commercial/components/ClientList.js",
        nagios: "./resources/assets/js/inventory/components/NagiosPage.jsx",
        buildingfiles: "./resources/assets/js/inventory/components/BuildingFiles.jsx",
        batchdeleteap: "./resources/assets/js/inventory/components/BatchDeleteAP.jsx",
        equipmentaddbutton: "./resources/assets/js/inventory/components/EquipmentAddButton.jsx",
        cadastrallist: "./resources/assets/js/inventory/components/CadastralList.jsx",
        sessionslist: "./resources/assets/js/inventory/components/SessionsList.jsx",
        interfaceslist: "./resources/assets/js/inventory/components/InterfacesList.jsx",
        capexlist: "./resources/assets/js/financial/components/CapexList.jsx",
        tabbuilding: "./resources/assets/js/inventory/components/BuildingTab.jsx",
        configureap: "./resources/assets/js/inventory/components/ConfigureAP.jsx",
        vendor: [
            "jquery",
            "react",
            "react-dom",
            "events",
            "object-assign",
            "classnames",
            "lodash",
            "./resources/assets/js/common/dispatcher/AppDispatcher",
            "./resources/assets/js/common/actions/AppActions",
            "./resources/assets/js/inventory/actions/InventoryActions",
            "./resources/assets/js/inventory/stores/InventoryStore",
            "./resources/assets/js/report/actions/ReportActions"
        ]
    },
    output: {
        filename: "./public/js/common/[name].js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"./public/js/vendor/vendor.bundle.js")
    ],
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,  // Match both .js and .jsx
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-2', 'react']
                }
            },
            {
                test:/.css$/,loader:'style!css!'
            }
        ]
    }
};

