$(function () {
    function LaserheadChangedViewModel(params) {
        let self = this;
        window.mrbeam.viewModels["LaserheadChangedViewModel"] = self;

        self.settings = params[0];
        self.loginState = params[1];

        self.onUserLoggedIn = function () {
            if (
                self.loginState.currentUser?.()?.active
            ) {
                if (self.settings.settings.plugins.mrbeam.laserheadChanged()) {
                    $("#laserhead_changed").modal("show");
                }
            }
        };

        self.laserheadChangeAcknowledged = function (){
            OctoPrint.simpleApiCommand("mrbeam", "laserhead_change_acknowledged", {})
                .done(function () {
                    console.log("simpleApiCall response for saving laserhead change detection: ");
                })
                .fail(function () {
                    self.settings.requestData();
                    console.error("Unable to save laserhead change detection state: ", data);
                    new PNotify({
                        title: gettext("Error while saving laserhead change detection!"),
                        text: _.sprintf(
                            gettext(
                                "Unable to save laserhead change detection at the moment.%(br)sCheck connection to Mr Beam and try again."
                            ),
                            { br: "<br/>" }
                        ),
                        type: "error",
                        hide: true,
                    });
                });
        }
    }

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        LaserheadChangedViewModel,

        // e.g. loginStateViewModel, settingsViewModel, ...
        ["settingsViewModel", "loginStateViewModel"],

        // e.g. #settings_plugin_mrbeam, #tab_plugin_mrbeam, ...
        ["#laserhead_changed"],
    ]);
});
