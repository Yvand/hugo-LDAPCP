// /// <reference path="jquery/jquery.d.ts" />
// /// <reference path="../node_modules/@types/jquery/index.d.ts" />
// npm install --save @types/jquery

namespace GitHubStatistics {    
    export interface RepoStatsJSON {
        DateStatCreatedUTC: string;
        Repository: string;
        LatestAssetUrl: string;
        LatestReleaseCreationDate: string;
        LatestReleaseTagName: string;
        LatestReleaseDownloadCount: number;
        AllReleasesDownloadCount: number;
        TotalDownloadCount: number;
    }

    export class RepoStats {
        url: string = "https://repository-statistics.azurewebsites.net/api/GetData";
        getLatestStat() {
            // console.log("Sending query to " + this.url);
            $.ajax({
                method: "GET",
                crossDomain: true,
                data: {
                    project: "Yvand/LDAPCP",
                    code: "IHZenT9YrvWCXI2YOg5HBGAXHjlAQjozAL2SFR-E53lTAzFuVYTLjw==",
                },
                dataType: "jsonp",
                // mimeType: "application/javascript",
                jsonpCallback: "GitHubStatistics.RepoStats.parseGitHubStatisticsResponse",
                url: this.url,
                success: function(responseData, textStatus, jqXHR) {
                },
                error: function (responseData, textStatus, errorThrown) {
                    console.log("Request to " + this.url + " failed: " + errorThrown);
                }
            });
        }

        static decodeJSONResponse(json: GitHubStatistics.RepoStatsJSON) {
            var obj = Object.assign({}, json, {
                //created: new Date(json.DateStatCreatedUTC)
            });
            return obj;
        }

        static parseGitHubStatisticsResponse (data) {
            var result =  GitHubStatistics.RepoStats.decodeJSONResponse(data);
            $("#TotalDownloadCount").text(result.TotalDownloadCount.toLocaleString(undefined));
            $("#LatestReleaseDownloadCount").text(result.LatestReleaseDownloadCount.toLocaleString(undefined));
            // $("#LatestReleaseTagName").text(result.LatestReleaseTagName);
            // $("#LatestAssetUrl").attr("href", result.LatestAssetUrl)
            //$("#LatestReleaseCreationDate").text(result.LatestReleaseCreationDate);
        };
    }
}

$(document).ready(function () {
    let stats = new GitHubStatistics.RepoStats();
    let result = stats.getLatestStat()
});

