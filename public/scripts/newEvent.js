function addEvent() {
    var formArray= $("#new_event").serializeArray();
    var data={};
    var url="/create";
    for (index in formArray){

        data[formArray[index].name]= formArray[index].value;
    }
    console.log(data);
    event.preventDefault();
}