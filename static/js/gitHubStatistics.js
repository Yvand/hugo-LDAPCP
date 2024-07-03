// /// <reference path="jquery/jquery.d.ts" />
// /// <reference path="../node_modules/@types/jquery/index.d.ts" />
// npm install --save @types/jquery
var GitHubStatistics;
(function (GitHubStatistics) {
    var RepoStats = /** @class */ (function () {
        function RepoStats() {
            this.url = "https://projects-statistics.azurewebsites.net/api/GetData";
        }
        RepoStats.prototype.getLatestStat = function () {
            // console.log("Sending query to " + this.url);
            $.ajax({
                method: "GET",
                crossDomain: true,
                data: {
                    project: "Yvand/LDAPCP",
                    code: "rdntOEXEunid9kXB5EsDriCdg6ikZq37iHS34oMNG8ycAzFuZ5Lqew==",
                },
                dataType: "jsonp",
                // mimeType: "application/javascript",
                jsonpCallback: "GitHubStatistics.RepoStats.parseGitHubStatisticsResponse",
                url: this.url,
                success: function (responseData, textStatus, jqXHR) {
                },
                error: function (responseData, textStatus, errorThrown) {
                    console.log("Request to " + this.url + " failed: " + errorThrown);
                }
            });
        };
        RepoStats.decodeJSONResponse = function (json) {
            var obj = Object.assign({}, json, {
            //created: new Date(json.DateStatCreatedUTC)
            });
            return obj;
        };
        RepoStats.parseGitHubStatisticsResponse = function (data) {
            var result = GitHubStatistics.RepoStats.decodeJSONResponse(data);
            $("#TotalDownloadCount").text(result.TotalDownloadCount.toLocaleString(undefined));
            $("#LatestReleaseDownloadCount").text(result.LatestReleaseDownloadCount.toLocaleString(undefined));
            // $("#LatestReleaseTagName").text(result.LatestReleaseTagName);
            // $("#LatestAssetUrl").attr("href", result.LatestAssetUrl)
            //$("#LatestReleaseCreationDate").text(result.LatestReleaseCreationDate);
        };
        ;
        return RepoStats;
    }());
    GitHubStatistics.RepoStats = RepoStats;
})(GitHubStatistics || (GitHubStatistics = {}));
$(document).ready(function () {
    var stats = new GitHubStatistics.RepoStats();
    var result = stats.getLatestStat();
});
