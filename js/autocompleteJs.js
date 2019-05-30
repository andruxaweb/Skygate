
  var countryCodeMap = {};
  countryCodeMap['Germany'] = 'DE';
  countryCodeMap['France'] = 'FR';
  countryCodeMap['Poland'] = 'PL';
  countryCodeMap['Spain'] = 'ES';

  var countryParamMap = {};
  countryParamMap['pm25'] = 'pm25';
  countryParamMap['pm10'] = 'pm10';
  countryParamMap['so2'] = 'so2';
  countryParamMap['no2'] = 'no2';
  countryParamMap['o3'] = 'o3';
  countryParamMap['co'] = 'co';
  countryParamMap['bc'] = 'bc';

$(function() {
var availableTags = ["Poland", "Germany", "Spain", "France"];
$("#countyAutoComplete").autocomplete({
source: availableTags
});
});

$(function() {
var availableTags = ["pm25", "pm10", "so2", "no2","o3","co","bc"];
$("#countryParameter").autocomplete({
source: availableTags
});
});
var actualCouCode ;

expireAt = new Date;<!--  www  .  j  av  a  2  s  .  c  o m-->
expireAt.setMonth(expireAt.getMonth() + 3);
username = "";

function makeCookie(actualCouCode, actualCouParam)
{

/*couname = document.form1.counrtychoose.value
document.cookie = "name=" + couname + ";expires=" + expireAt.toGMTString()*/

  console.log('localStorage');
  console.log(localStorage);
  localStorage.setItem('country', actualCouCode);
  localStorage.setItem('polution', actualCouParam);
}

function postResults()
{
  var inputElement = document.getElementById("countyAutoComplete");
   actualCouCode = countryCodeMap[inputElement.value];
  if(!actualCouCode)
  {
    alert("no country");
    return;
  }

  /*pm25, pm10, so2, no2, o3, co, bc*/
  var inputParam = document.getElementById("countryParameter");
  var actualCouParam = countryParamMap[inputParam.value];

  if(!actualCouParam)
  {
    alert("no parameter");
  }
  makeCookie(inputElement.value, inputParam.value); //country, polution

  document.getElementById('centralpart').style.cssText = 'visibility:visible;';


      const ul = document.getElementById('cities-list');
        var urlCouDesc =`https://api.openaq.org/v1/latest?country=${actualCouCode}&limit=10&parameter=${actualCouParam}`;
        fetch(urlCouDesc)
        .then(response => response.json())
        .then(data => {
          data.results.map(function(city){

          let li = document.createElement('li'),
              button = document.createElement('button');
              let cityname=city.city;
              button.setAttribute('class', 'descriptionButton');
              button.setAttribute('onclick', `descriptionCouInfo('${cityname}')`);
              button.innerText=`description`;
          //some times the service give not city but some irrelevent values (like name of meteorology station )
          for(var i=0; i<city.measurements.length; i++){
            var measurementsValue = city.measurements[i].value;
          }
          urlCouDesc+= `&sort=${measurementsValue}`;
          var ul = document.getElementById("cities-list");
          var nodelist = ul.getElementsByTagName("li");

            li.innerText = `City: ${city.city}, Location: ${city.location}, Value: ${measurementsValue}`;

            li.appendChild(button);
            ul.appendChild(li);

        });
        })
        .catch(error => console.error(error));
        document.getElementById('cities-list').style.cssText = 'border: 1px solid black;';
}
function hideDiv()
{
  document.getElementById('centralpart').style.cssText = 'visibility:hidden;';
  var myDiv = document.getElementById("cities-list");
  myDiv.innerHTML = '';
}
//

//


function descriptionCouInfo(cityname)
{
  const ulCou = document.getElementById('city-description');
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  document.getElementById('rightpart').style.cssText = 'visibility:visible;';
  const ulDesk = document.getElementById('city-description');
  if(actualCouCode=="FR" || actualCouCode=="DE" || actualCouCode=="ES" ){

    fetch(proxyurl+`https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=Paris&descprefersource=central&format=json`)
    .then(response => response.json())
    .then(data => {
        let result = data.query.pages;
        let keysOfResultObject = Object.keys(result)[0];
        if(!keysOfResultObject) return;
        console.log(result[keysOfResultObject]);
        let liCou = document.createElement('p');
        liCou.innerText = `Description: ${result[keysOfResultObject].description}, title: ${result[keysOfResultObject].title} `;
        ulCou.appendChild(liCou);
    })
  }else if(actualCouCode=="PL"){
    fetch(proxyurl+`https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=${cityname}&descprefersource=central&format=json`)
    .then(response => response.json())
    .then(data => {
        let result = data.query.pages;
        let keysOfResultObject = Object.keys(result)[0];
        if(!keysOfResultObject) return;
        console.log(result[keysOfResultObject]);
        let liCou = document.createElement('li');
        liCou.innerText = `City:${cityname},Description: ${result[keysOfResultObject].description}, title: ${result[keysOfResultObject].title} `;
        ulCou.appendChild(liCou);
  })
}
}
