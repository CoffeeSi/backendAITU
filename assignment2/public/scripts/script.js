const profileCard = document.getElementById("profile-card");
const countryCard = document.getElementById("country-card");
const newsCard = document.getElementById("news-card");

async function loadProfile() {
    const profileData = await (await fetch("/profile")).json();
    const countryData = await (await fetch(`/country/${profileData.country}`)).json();
    const currencyData = await (await fetch(`/currency/${countryData.currency.code}`)).json();
    const newsData = await (await fetch(`/news/${profileData.country}`)).json();

    const profileHtml = `
        <img class="circle-pic" id="profile-pic" src="${profileData.profilePicture}">
        <img id="country-flag" src="${countryData.flag}">
        <div class="info">
            <h2 id="name">${profileData.firstName} ${profileData.lastName}</h2>
            <div id="additional">
                <div id="gender">Gender: ${profileData.gender}</div>
                <div id="dob">Date of birth: ${profileData.dob}</div>
                <div id="age">Age: ${profileData.age}</div>
            </div>
            <div id="address">
                <div id="country">${profileData.country}, ${profileData.city}</div>
                <div id="street">Street: ${profileData.fullAddress}</div>
            </div>
        </div>
    `;
    profileCard.innerHTML = profileHtml;

    const countryHtml = `
        <div class="info">
            <h2>Country information:</h2>
            <div id="country">Country: ${countryData.name}</div>
            <div id="capital">Capital: ${countryData.capital}</div>
            <div id="languages">Languages: ${countryData.languages}</div>
            <div id="currency">Currency: ${countryData.currency.name}</div>
            <div id="currency-rate">
                1 ${countryData.currency.code} = ${currencyData.rateToUsd.toFixed(2)} USD, 
                1 ${countryData.currency.code} = ${currencyData.rateToKzt.toFixed(2)} KZT
            </div>
        </div>
    `;
    countryCard.innerHTML = countryHtml;

    let articlesHtml = "";
    for (let i = 0; i < 5; i++) {
        const article = `
            <div class="article">
                <img class="circle-pic" id="article-pic" src="${newsData[i].image}">
                <div id="address">
                    <h2 class="article-title">${newsData[i].title}</h2>
                    <p class="article-description">${newsData[i].description}</p>
                    <a class="article-link" href="${newsData[i].url}">Link</a>
                </div>
            </div>
        `;
        articlesHtml += article;
    }
    newsCard.innerHTML = articlesHtml;
}