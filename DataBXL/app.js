let localisation=document.getElementById("localisation");
let main=document.getElementById("main");
let search=document.getElementById("search");
let latitude;
let longitude;



search.addEventListener("click", ()=>{
    if(localisation.checked){
        getLocation();
    }
    else{
        latitude=document.getElementById("lat").value;
        longitude=document.getElementById("long").value;
        let radius=document.getElementById("rayon").value;
        let api_adress=`https://opendata.bruxelles.be/api/records/1.0/search/?dataset=wifi&q=&facet=latitude&geofilter.distance=${latitude}%2C+${longitude}%2C+${radius}`
        fetchData(api_adress)
        
    }
})

function fetchData(API_ADRESS){
    fetch(API_ADRESS)
    .then((result)=>result.json())
    .then((data)=>{
        if(document.getElementById("results")!== null){
            document.getElementById("results").remove();
        }

        const resultWrapper=document.createElement("section");
        resultWrapper.setAttribute("id", "results")
        resultWrapper.classList.add("result-wrapper");

        const resultH3= document.createElement("h3");
        resultH3.innerText="Résultat(s) - "+data.records.length;

        resultWrapper.appendChild(resultH3);

        if(data.records.length==0){
            const noResult = document.createElement("div");
            noResult.innerText="Oops aucun résultat !"

            resultWrapper.appendChild(noResult)
        }
        else{
            for(const key in data.records){
                console.log(data.records[key])
                let cardResult=createResult(data.records[key].fields.nom_site_nl,data.records[key].fields.lieu_installation,data.records[key].fields.dist,data.records[key].fields.statut,data.records[key].fields.latitude,data.records[key].fields.longitude,latitude,longitude);
                resultWrapper.appendChild(cardResult);
            }
        }

        main.appendChild(resultWrapper);
    })

}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoordinate);
    } else {
     console.log("error")
      //modal
    }
}

function getCoordinate(position){
    let lat=document.getElementById("lat").value=position.coords.latitude;
    let lon=document.getElementById("long").value=position.coords.longitude;
    let radius=document.getElementById("rayon").value;

    let api_adress=`https://opendata.bruxelles.be/api/records/1.0/search/?dataset=wifi&q=&facet=latitude&geofilter.distance=${lat}%2C+${lon}%2C+${radius}`

    fetchData(api_adress)

}



  //let api_adress=`https://opendata.bruxelles.be/api/records/1.0/search/?dataset=wifi&q=&facet=latitude&geofilter.distance=${LAT_1}%2C+${LON_1}%2C+${radius}`


  
    //let map=`https://maps.googleapis.com/maps/api/staticmap?center=${center_coord}&zoom=16&size=400x400&key=${KEY}`;

    
let createResult =(resultTitle,resultAddress, resultDistance, resultStatus, latitudeWifi, longitudeWifi, latitudeA, longitudeA)=>{
    let jawgMap=`https://api.jawg.io/static?marker=color:EB4034,size:small,label:A%7C${latitudeA},${longitudeA}&marker=color:32A852,size:small,label:B%7C${latitudeWifi},${longitudeWifi}&size=600x400&layer=jawg-terrain&format=png&access-token=sJfOOW2O1TuFq5Xgnbsx2axwKS302wOnsotZBmXe0gyoiadyvlJ4aTSqQIbe82tX`

    const card=document.createElement("div");
    card.classList.add("result");
    
    const title= document.createElement("h4");
    title.innerText=resultTitle;

    const img= document.createElement("img");
    img.setAttribute("src",jawgMap);
    img.setAttribute("alt", "Static map image");

    const address= document.createElement("div");
    if(resultAddress===undefined){
        resultAddress="Non renseignée"
    }
    address.innerText="Adresse: "+resultAddress;

    const crowDistance= document.createElement("div");
    crowDistance.innerText="Distance: "+Math.round(resultDistance)+"m";

    const status = document.createElement("div");
    const statusColor=document.createElement("span");
    statusColor.innerText=resultStatus;

    resultStatus="OPERATIONNEL" ? statusColor.classList.add("green") : statusColor.classList.add("red");
    
    status.innerText="Statut: ";
    status.appendChild(statusColor);
    
    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(address);
    card.appendChild(crowDistance); 
    card.appendChild(status);

    return card;
}