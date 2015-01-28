console.log("%cGA Management Tool Console", "background-color:#ABABAB; color: #333; font-family:verdana; font-size:1.5em; padding:2px 5px; border-width:1px; border-style:solid; border-color:#ABABAB;");
var getData = {};
getData.account = "";
getData.webProperties = "";
getData.displayMessage = "";

var processedData = {};
var htmlBuild = {};

processedData.getAccountUsersByPermission = function(level) {
    var permission;
    switch(level) {
        case 0: 
            permission = "COLLABORATE";
            break;
        case 1:
            permission = "EDIT";
            break;
        case 2:
            permission = "MANAGE_USERS";
            break;
        case 3:
            permission = "READ_AND_ANALYZE";
            break
        default:
            return null;
    }

    var userList = [];
    for(var i=0; i<processedData.account.users.length; i++) {
        var usr = processedData.account.users[i];
        for(var i2=0; i2<usr.permissions.length;i2++) {
            if(usr.permissions[i2] == permission)
            {
                userList.push(usr);
            }    
        }
        
    }
    return userList;
}

function getPermission(level) {
    var permission = "";
        switch(level) {
        case 0: 
            permission = "COLLABORATE";
            break;
        case 1:
            permission = "EDIT";
            break;
        case 2:
            permission = "MANAGE_USERS";
            break;
        case 3:
            permission = "READ_AND_ANALYZE";
            break
        default:
            return null;
    }
    return permission;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

processedData.getPropertyUsersByPermission = function(propertyId,level) {
    var permission = getPermission(level);
    var userList = [];
    var property;

    for(var i=0; i<processedData.account.properties.length; i++) {
        if(processedData.account.properties[i].id == propertyId) {
            property = processedData.account.properties[i];
            break;
        }
    }

    for(var i=0; i<property.users.length; i++) {
        var usr = property.users[i];
        for(var i2=0; i2<usr.permissions.length;i2++) {
            if(usr.permissions[i2] == permission)
            {
                userList.push(usr);
            }    
        }
        
    }
    return userList;
}

processedData.getPropertyViews = function(propertyId) {
    var viewList = [];
    var property;

    for(var i=0; i<processedData.account.properties.length; i++) {
        if(processedData.account.properties[i].id == propertyId) {
            property = processedData.account.properties[i];
            break;
        }
    }

    for(var i=0; i<property.views.length; i++) {
        viewList.push(property.views[i]);
    }
    return viewList;
}

processedData.getAccountUsersByPermission = function(level) {
    var permission = getPermission(level);
    var userList = [];

    for(var i=0; i<processedData.account.users.length; i++) {
        var usr = processedData.account.users[i];
        for(var i2=0; i2<usr.permissions.length;i2++) {
            if(usr.permissions[i2] == permission)
            {
                userList.push(usr);
            }    
        }
        
    }
    return userList;
}

processedData.getPropertyUsersByPermissionList = function(propertyId, level) {
    var list = processedData.getPropertyUsersByPermission(propertyId,level);
    var ul = document.createElement('ul');
    for(var i=0; i<list.length;i++){
        var li = document.createElement('li');
        li.id = list[i].id;
        if(i%2!=1){li.className = "odd"};
        li.innerHTML = list[i].email;
        ul.appendChild(li);    
    }
    return ul;
}

processedData.getAccountUsersByPermissionList = function(level) {
    var list = processedData.getAccountUsersByPermission(level);
    var ul = document.createElement('ul');
    for(var i=0; i<list.length;i++){
        var li = document.createElement('li');
        li.id = list[i].id;
        if(i%2!=1){li.className = "odd"};
        li.innerHTML = list[i].email;
        ul.appendChild(li);    
    }
    return ul;
}

processedData.getPropertyViewsList = function(propertyId) {
    var list = processedData.getPropertyViews(propertyId);
    var ul = document.createElement('ul');
    for(var i=0; i<list.length;i++){
        var li = document.createElement('li');
        li.id = list[i].id;
        if(i%2!=1){li.className = "odd"};
        li.innerHTML = list[i].name;
        ul.appendChild(li);    
    }
    return ul;
}


getData.updateCustomer = function () {
    var customerUpdate = document.getElementById("customerUpdate");
    customerUpdate.innerHTML = getData.displayMessage;
}

getData.isReady = function () {
    getData.displayMessage = "Ready";
    if (getData.account.id != "" && getData.profile != "") {
        getData.displayMessage = "Report Ready";
    }
    getData.updateCustomer();
    document.getElementById('propertiesHold').appendChild(htmlBuild.propertiesList());
    document.getElementById('accountHold').appendChild(htmlBuild.accountList());
    document.getElementById('viewsHold').appendChild(htmlBuild.viewsList());

}

getData.processData = function () {
    processedData.account = {
        id : getData.account.id,
        name : getData.account.name,
        users : [],
        properties : []
    };

    for(var i=0; i<getData.accountUsers.length; i++) {
        var usr = getData.accountUsers[i];
        var permissions = [];
        for(var i2=0; i2<usr.permissions.effective.length;i2++) {
            permissions.push (usr.permissions.effective[i2]);    
        }
        processedData.account.users.push( {
            id: usr.id,
            email: usr.userRef.email,
            permissions: permissions
        });        
    }

    for(var i=0; i<getData.webProperties.length; i++) {
        var prop = getData.webProperties[i];
        var property = {
            id : prop.id,
            name : prop.name,
            url : prop.selfLink,
            users : [],
            views : []
        }
        processedData.account.properties.push(property);
    }

    for(var i=0; i<getData.webPropertyUsers.length; i++) {
        var usr = getData.webPropertyUsers[i];
        var permissions = [];
        for(var i2=0; i2<usr.permissions.effective.length;i2++) {
            permissions.push (usr.permissions.effective[i2]);    
        }
        var user = {
            id: usr.id,
            email: usr.userRef.email,
            permissions: permissions
        }
        var userPropId = usr.entity.webPropertyRef.id;
        for(i2=0; i2<processedData.account.properties.length; i2++){
            var prop = processedData.account.properties[i2];
            if(userPropId == prop.id) {
                prop.users.push(user);
            }
        }    
    }

    for(var i=0; i<getData.views.length; i++) {
        var vw = getData.views[i];
        var viewPropId = vw.webPropertyId;
        var view = {
            id : vw.id,
            name : vw.name,
            websiteUrl : vw.websiteUrl
        }
        for(i2=0; i2<processedData.account.properties.length; i2++){
            var prop = processedData.account.properties[i2];
            if(viewPropId == prop.id) {
                prop.views.push(view);
            }
        }
    }
}

htmlBuild.propertiesList = function() {
    var tableHold = document.createElement('div');
    tableHold.id = "tableHold";
    var intro = document.createElement('div');
    var introTitle = document.createElement('h2');
    introTitle.innerHTML = "Property Users";
    var introText = document.createElement('p');
    introText.innerHTML = "This table contains a list of each user that has access to a property, grouped by the property's permission levels. Each user can be assigned any or all of the four permissions."
    intro.appendChild(introTitle);
    intro.appendChild(introText);
    tableHold.appendChild(intro);

    var table = document.createElement('table');
    table.className = "propertyListHold";
    var headerRow = document.createElement('tr');
    var th = document.createElement('th');
    th.innerHTML = "Property";
    headerRow.appendChild(th);
    for(var i=0; i<4;i++) {
        var th = document.createElement('th');
        th.innerHTML = toTitleCase(getPermission(i));
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    for(var i=0; i<processedData.account.properties.length;i++) {
        var property = processedData.account.properties[i];
        var tr = document.createElement('tr');
        tr.id = property.id;
        if(i%2!=1){tr.className = "odd"};
        var divTd0 = document.createElement('td');
        var divTd0Div = document.createElement('div');
        divTd0Div.innerHTML = property.name;
        divTd0Div.className = 'color';
        divTd0.className = "viewName";
        divTd0.appendChild(divTd0Div);
        tr.appendChild(divTd0);
        for(var i2=0; i2<4; i2++) {
            var divTd = document.createElement('td');
            var countDiv = document.createElement('div');
            countDiv.className = "down color";
            countDiv.onclick = function() {toggleUserList(this)}
            var userListDiv = document.createElement('div');
            userListDiv.className = "listPropUsers";

            countDiv.innerHTML = processedData.getPropertyUsersByPermission(property.id,i2).length;
            userListDiv.appendChild(processedData.getPropertyUsersByPermissionList(property.id,i2));

            divTd.appendChild(countDiv);
            divTd.appendChild(userListDiv);
            tr.appendChild(divTd);
        }
        table.appendChild(tr);
        tableHold.appendChild(table);

    }
    return tableHold;
}

htmlBuild.accountList = function() {
    var tableHold = document.createElement('div');
    tableHold.id = "accountTableHold";
    var intro = document.createElement('div');
    var introTitle = document.createElement('h2');
    introTitle.innerHTML = "Account Users";
    var introText = document.createElement('p');
    introText.innerHTML = "This table contains a list of each user that has access to the parent DVLA Account, grouped by the account's permission levels. Each user can be assigned any or all of the four permissions."
    intro.appendChild(introTitle);
    intro.appendChild(introText);
    tableHold.appendChild(intro);

    var table = document.createElement('table');
    table.className = "propertyListHold";
    var headerRow = document.createElement('tr');
    var th = document.createElement('th');
    th.innerHTML = "Account";
    headerRow.appendChild(th);
    for(var i=0; i<4;i++) {
        var th = document.createElement('th');
        th.innerHTML = toTitleCase(getPermission(i));
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    var tr = document.createElement('tr');
    tr.id = processedData.account.id;
    if(i%2!=1){tr.className = "odd"};
    var divTd0 = document.createElement('td');
    var divTd0Div = document.createElement('div');
    divTd0Div.innerHTML = processedData.account.name;
    divTd0Div.className = 'color';
    divTd0.className = "viewName";
    divTd0.appendChild(divTd0Div);
    tr.appendChild(divTd0);
    for(var i2=0; i2<4; i2++) {
        var divTd = document.createElement('td');
        var countDiv = document.createElement('div');
        countDiv.className = "down color";
        countDiv.onclick = function() {toggleUserList(this)}
        var userListDiv = document.createElement('div');
        userListDiv.className = "listPropUsers";

        countDiv.innerHTML = processedData.getAccountUsersByPermission(i2).length;
        userListDiv.appendChild(processedData.getAccountUsersByPermissionList(i2));

        divTd.appendChild(countDiv);
        divTd.appendChild(userListDiv);
        tr.appendChild(divTd);
    }
    table.appendChild(tr);
    tableHold.appendChild(table);

    return tableHold;
}

htmlBuild.viewsList = function() {
    var tableHold = document.createElement('div');
    tableHold.id = "viewHold";
    var intro = document.createElement('div');
    var introTitle = document.createElement('h2');
    introTitle.innerHTML = "Property Views";
    var introText = document.createElement('p');
    introText.innerHTML = "This table contains a list of each view assigned to a property."
    intro.appendChild(introTitle);
    intro.appendChild(introText);
    tableHold.appendChild(intro);

    var table = document.createElement('table');
    table.className = "propertyListHold";
    var headerRow = document.createElement('tr');
    var th = document.createElement('th');
    th.innerHTML = "Property";
    headerRow.appendChild(th);
    var th = document.createElement('th');
    th.innerHTML = "View";
    headerRow.appendChild(th);
    table.appendChild(headerRow);
    for(var i=0; i<processedData.account.properties.length;i++) {
        var property = processedData.account.properties[i];
        var tr = document.createElement('tr');
        tr.id = property.id;
        if(i%2!=1){tr.className = "odd"};
        var divTd0 = document.createElement('td');
        var divTd0Div = document.createElement('div');
        divTd0Div.innerHTML = property.name;
        divTd0Div.className = 'color';
        divTd0.className = "viewName";
        divTd0.appendChild(divTd0Div);
        tr.appendChild(divTd0);
        
        var divTd = document.createElement('td');
        var countDiv = document.createElement('div');
        countDiv.className = "down color";
        countDiv.onclick = function() {toggleUserList(this)}
        var userListDiv = document.createElement('div');
        userListDiv.className = "listPropUsers";

        countDiv.innerHTML = processedData.getPropertyViews(property.id).length;
        userListDiv.appendChild(processedData.getPropertyViewsList(property.id));

        divTd.appendChild(countDiv);
        divTd.appendChild(userListDiv);
        tr.appendChild(divTd);

        table.appendChild(tr);
        tableHold.appendChild(table);

    }
    return tableHold;
}

function toggleUserList(e) {
    if(e.className == "down color" ) {
        e.parentElement.getElementsByTagName('div')[1].style.display="block";
        e.className = "up color";
    } else {
        e.parentElement.getElementsByTagName('div')[1].style.display="none";
        e.className = "down color";
    }
}
