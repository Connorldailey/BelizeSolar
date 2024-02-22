const Url="http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999";
const Sites="&Query=SolarNames()";
const Watts="&Query=SolarWatts(";
const AllWatts="&Query=SolarWatts(*)";
const siteDayWatts="&Query=SolarHistory(%SITE%,qWattsmin1,%DATE%*)";
const siteInfo="&Query=SolarInfo(%SITE%)"
const allSitesDayWatts="&Query=SolarHistorySummary(*,qHistoryWattsHour1,%DATE%*)";
const SolarWattsAverageDay="&Query=SolarWattsAverageDay(8B0C4C,%DATE%"
const SolarWattsAllDayAllSites="&Query=SolarWattsAllDayAllSites(%DATE%*)";
// &Query=SolarHistory(8B0AB1,qWattsmin1,2023-02-02*)
// &Query=SolarHistory(SITE,qWattsmin1,DATE*)

function outputSomething(){
	document.getElementById("#schoolOutput").innerHTML = "School Name";
}
document.getElementById("#schoolOutput").innerHTML = "School Name";