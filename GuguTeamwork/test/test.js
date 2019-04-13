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
			
function nodeJson() {
	var json = {
		"OpenId":"testopenid",
		"Title":"test",
		"Content":"a simple test",			
		"Deadline":"2100-01-01T00:00:00Z",
		"Urgency":"",
		"TreeID":"testopenid_project_1",
		"Parent":"testopenid_project_1-task-1",
		"TeamMates":["testopenid"]
	};
	console.log(JSON.stringify(json))
	return JSON.stringify(json)
}

function treeJson() {
	var json = {
		"OpenId":"testopenid",
		"Name":"testappendtree",
		"Brief":"content",
		"Deadline":"2100-01-01T00:00:00Z",
		"Urgency":"3"
	};
	console.log(JSON.stringify(json))
	return JSON.stringify(json)
}