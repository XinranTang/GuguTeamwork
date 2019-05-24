var sock = null
var wsuri = "ws://localhost:9000/guguWss/online";
var OpenId = "testopenid"
window.onload = function() {
	sock = new WebSocket(wsuri)
	sock.onopen = function() {
        console.log("connected to " + wsuri);
		sock.send(OpenId)
    }
    sock.onclose = function(e) {
		console.log("connection closed (" + e.code + ")");

    }
	sock.onmessage = function(e) {
        console.log("message received: " + e.data);
    }
}


function newNode()
{
	$.post({
		url:"http://localhost:9000/gugu/newNode",
		data:nodeJson(),
		success: function(data) {
			alert("newNode SUCCESS")
			console.log(data)
		},
	});
}

function deleteNode() {
	$.post({
		url:"http://localhost:9000/gugu/deleteNode",
		data:deleteNodeJson(),
		success: function(data) {
			alert("deleteTree SUCCESS")
			console.log(data)
		},
	})
}

function newTree() {
	$.post({
		url:"http://localhost:9000/gugu/newProject",
		data:treeJson(),
		success: function(data) {
			alert("newTree SUCCESS")
			console.log(data)
		},
	})
}

function alterNode() {
	$.post({
		url:"http://localhost:9000/gugu/alterNode",
		data:alterJson(),
		success: function(data) {
			alert("alterNode SUCCESS")
			console.log(data)
		},
	})
}

function sendQR() {
	$.post({
		url:"http://localhost:9000/gugu/sendQR",
		data:sendQRJson(),
		success: function(res) {
			alert("invite SUCCESS")
			console.log(res)
		},
	})
}

function wsSend_task() {
	var json = {
		"TimeOut":new Date(),
		"TypeCode":100,
		"Sender":"testopenid",
		"Receiver":'testopenid',
		"ContentId":"testopenid_project_1;testopenid_project_1-task-1;"
	};
	sock.send(JSON.stringify(json))
}
	

function newMsg() {
	$.post({
		url:"http://localhost:9000/gugu/newMessage",
		data:newMsgJson(),
		success: function(res) {
			alert("MESSAGING SUCCESS")
			console.log(res)
		},
	})
}

function ReadMsg() {
	$.get({
		url:"http://localhost:9000/gugu/readMessage?OpenId=testopenid&MessageID=testopenid_message_1",
		success: function(res) {
			alert("ReadMsg SUCCESS")
			console.log(res)
		},
	})
}

function nodeJson() {
	var json = {
		"OpenId":"testopenid",
		"Title":"test",
		"Content":"a simple test",	
		"Deadline":"2100-01-01T00:00:00Z",
		"Urgency":"",
		"TreeID":"testopenid_project_3",
		"Parent":"testopenid_project_3",
	};
	return JSON.stringify(json)
}

function treeJson() {
	var json = {
		"OpenId":"testopenid",
		"Name":"test3",
		"Brief":"content",
		"Deadline":"2100-01-01T00:00:00Z",
		"Urgency":"3"
	};
	return JSON.stringify(json)
}

function deleteNodeJson() {
	var json = {
		"TreeID":"testopenid_project_3",
		"TaskID":"testopenid_project_3",
		"Parent":""
	};
	return JSON.stringify(json)
}

function alterJson() {
	var json = {
		"TreeID":"testopenid_project_3",
		"TaskID":"testopenid_project_3-task-5",
		"Title":"altered title",
		"Content":"altered content",
		"Deadline":"2099-01-01T00:00:00Z",
		"Urgency":"2"
	};
	return JSON.stringify(json)
}

function sendQRJson() {
	var json = {
		"Scene":"testopenid&testopenid_project_1",
		"Page":"pages/index",
		"Width":"300"
	};
	return JSON.stringify(json)
}

function newMsgJson() {
	var json = {
		"Title":"test message",
		"Pusher":"testopenid",
		"Content":"just a test",
		"NotRead":"testopenid;",
		"FinalDeleteDate":""
	};
	return JSON.stringify(json)
}