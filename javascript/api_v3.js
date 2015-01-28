// Execute this function when the 'Make API Call' button is clicked
function makeApiCall() {
    //console.log('Starting Request Process...');
    queryAccounts();
}


function queryAccounts() {
    gapi.client.analytics.management.accounts.list(
    ).execute(handleAccounts);
}

function queryWebProperties(accountId) {
    gapi.client.analytics.management.webproperties.list({
        'accountId': accountId,
        'webPropertyId': '~all'
    }).execute(handleWebProperties);
}

function queryViews(accountId) {
    gapi.client.analytics.management.profiles.list({
        'accountId': accountId,
        'webPropertyId': '~all'
    }).execute(handleViews);
}

function queryAccountUsers(accountId) {
    gapi.client.analytics.management.accountUserLinks.list({
        'accountId': accountId
    }).execute(handleAccountUsers);
}

function queryPropertyUsers(accountId) {
    gapi.client.analytics.management.webpropertyUserLinks.list({
        'accountId': accountId,
        'webPropertyId': '~all'
    }).execute(handlePropertyUsers);
}

function handleAccounts(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {
            for(i=0;i<results.items.length;i++) {
                if (results.items[i].name == 'DVLA') {
                    a = results.items[i];
                    getData.account = {
                        id : results.items[i].id,
                        name : results.items[i].name
                    };
                    queryWebProperties(getData.account.id);
                }
            }
        }
    }
}

function handleWebProperties(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {
            for (var i = 0; i < results.items.length; i++) {
                getData.webProperties = results.items;
            }
        } 
    }
    if(getData.webProperties.length >0) { 
        queryViews(getData.account.id);
    }
}

function handleViews(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {
            getData.views = results.items;
            queryAccountUsers(getData.account.id);
        } 
    } 
}

function handleAccountUsers(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {
            getData.accountUsers = results.items;
            queryPropertyUsers(getData.account.id);
        } 
    } 
}

function handlePropertyUsers(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {
            getData.webPropertyUsers = results.items;
            getData.processData();
            getData.isReady();
        } 
    } 
}