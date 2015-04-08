var newMessage = function(text, user) {
    return {
        mesText: text,
        user: user,
        id: uniqueId(),
        deleted: false
    };
};

var mesList = [];
var username = '';

function run() {
    if(JSON.parse(localStorage.getItem("Chat username"))) {
        username = JSON.parse(localStorage.getItem("Chat username"));
        document.getElementById('user').value = username;
        document.getElementsByClassName('check')[0].style.visibility = 'visible';
    }
    var mesContainer = document.getElementsByClassName('working_place')[0];
    mesContainer.addEventListener('click', delegateEvent);
    var allMessages = restore();
    createAllMessages(allMessages);
}

function createAllMessages(allMessages) {
    if(allMessages == null) return;
    for(var i = 0; i < allMessages.length; i++) {
        addMessage(allMessages[i]);
    }
}

var change = false;
var object = document.parentNode;
function delegateEvent(evtObj) {
    if (evtObj.type == 'click' && evtObj.target.className == 'button_send' && !change) {
        if(!document.getElementById('user').value) {
            alert('Error! Input username first!')
	    return;
        }
        document.getElementsByClassName('check')[0].style.visibility = 'visible';
        onAddButtonClick(evtObj);
    }
    if (evtObj.type == 'click' && evtObj.target.className == 'button_submit' ) {
        onSubmitButtonClick(evtObj);
    }
    if (evtObj.type == 'click' && evtObj.target.className == 'button_send' && change) {
        onEditSend(evtObj);
    }
    if (evtObj.type == 'click' && evtObj.target.nodeName == 'INPUT' && evtObj.target.id == 'user') {
        onUsernameChangeClick(evtObj);
    }
    if(evtObj.type == 'click' && evtObj.target.id == 'delete') {
        onDelete(evtObj);
    }
    if(evtObj.type == 'click' && evtObj.target.id == 'edit') {
        onMsgEdit(evtObj);
    }
}

function onDelete(obj) {
    change = false;
    obj.target.parentNode.parentNode.childNodes[1].textContent = "[deleted]";
    obj.target.parentNode.style.display = 'none';
    var id = obj.target.parentNode.parentNode.parentNode.attributes['data-mes-id'].value;
    for(var i = 0; i < mesList.length; i++) {
        if(mesList[i].id != id)
            continue;
        mesList[i].mesText = "[deleted]";
        mesList[i].deleted = true;
        store(mesList);
    }
}

function onEditSend() {
    var message = document.getElementById('message');
    if(message.value == '') return;
    var id = object.target.parentNode.parentNode.parentNode.attributes['data-mes-id'].value;
    for(var i = 0; i < mesList.length; i++) {
        if(mesList[i].id != id)
            continue;
        mesList[i].mesText = message.value;
        object.target.parentNode.parentNode.childNodes[1].textContent = message.value;
        store(mesList);
        document.getElementById('message').value = mesList[i].mesText;
    }
    change = false;
    document.getElementById('message').value = '';
}

function onMsgEdit(obj) {
    change = true;
    var message = document.getElementById('message');
    message.value = obj.target.parentNode.parentNode.childNodes[1].textContent;
    object = obj;
}

function onUsernameChangeClick() {
    var check = document.getElementsByClassName('check')[0];
    check.style.visibility = 'hidden';
}

function onSubmitButtonClick() {
    if (!document.getElementById('user').value) {
        return;
    }
    var check = document.getElementsByClassName('check')[0];
    check.style.visibility = 'visible';
    username = document.getElementById('user').value;
    localStorage.setItem("Chat username", JSON.stringify(username));
}
function onAddButtonClick() {
    var message = document.getElementById('message');
    var newMes = newMessage(message.value, username);
    addMessage(newMes);
    message.value = '';
    store(mesList);
}

function addMessage(mesObj) {
    if (!mesObj.mesText) {
        return;
    }
    var this_message = createMessage(mesObj);
    var message_box = document.getElementsByClassName('message_box')[0];
    mesList.push(mesObj);
    message_box.appendChild(this_message);
    message_box.scrollTop = 9999;
}

function createMessage(message) {
    var divMessage = document.createElement('div');
    divMessage.setAttribute('data-mes-id', message.id);
    var oImg = document.createElement('img');
    var oText = document.createElement('div');
    var oName = document.createElement('div');
    oImg.setAttribute('src', 'https://img-fotki.yandex.ru/get/6822/307516655.0/0_17d3a8_7eb4eb0e_orig.png');
    oImg.setAttribute('height', '60px');
    oImg.setAttribute('width', '60px');
    oImg.style.marginLeft = '20px';
    oImg.style.marginTop = '25px';
    oImg.style.float = 'left';
    divMessage.classList.add('this_message');
    oText.classList.add('this_name');
    oText.classList.add('this_text');
    oText.appendChild(oName);
    oName.appendChild(document.createTextNode(message.user));
    oText.appendChild(document.createTextNode(message.mesText));
    oName.style.fontWeight = 'bold';
    oName.style.fontSize = '110%';
    oText.style.padding = '13px';
    oText.style.margin = '20px';
    if(!message.deleted) {
        var editDelete = document.createElement('div');
        editDelete.classList.add('edit_delete');
        var editImg = document.createElement('img');
        var deleteImg = document.createElement('img');
        editImg.setAttribute('src', 'http://www.sombrinha.net/studiocomciencia.com/images/pencil.png');
        editImg.setAttribute('height', '20px');
        editImg.setAttribute('width', '20px');
        editImg.setAttribute('id', 'edit');
        deleteImg.setAttribute('src', 'http://www.iconpng.com/png/symbolize/trash.png');
        deleteImg.setAttribute('height', '20px');
        deleteImg.setAttribute('width', '20px');
        deleteImg.setAttribute('id', 'delete');
        deleteImg.style.marginLeft = '5px';
        editImg.style.cursor = 'pointer';
        deleteImg.style.cursor = 'pointer';
        editDelete.style.marginTop = '10px';
        editDelete.appendChild(editImg);
        editDelete.appendChild(deleteImg);
        oText.appendChild(editDelete);
    }
    divMessage.appendChild(oImg);
    divMessage.appendChild(oText);
    return divMessage;
}

var uniqueId = function() {
    var date = Date.now();
    var random = Math.random() * Math.random();

    return Math.floor(date * random).toString();
};

function store(listToSave) {

    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }
    localStorage.setItem("Chat", JSON.stringify(listToSave));
}

function restore() {
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }

    var item = localStorage.getItem("Chat");

    return item && JSON.parse(item);
}