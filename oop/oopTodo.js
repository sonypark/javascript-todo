const TodoUI = function() {};

TodoUI.prototype.addTodoExecutor = function(todoElement, todoTag) {
    addTodoList(todoElement, todoTag);
}

TodoUI.prototype.addTodoList = function(todoElement, todoTag) {
    let listFormat = {};
    listFormat.name = todoElement;
    list.tag = Array(`${todoTag}`);
    list.status = "todo";
    list.id = parseInt(Math.random() * 10000);
    datalist.push(format);

    return addTodoResult(listFormat);
}


TodoUI.prototype.addTodoResult = function (newAddedObject) {
    let addlistResult = `${newAddedObject["name"]} 1개가 추가됐습니다.(id : ${newAddedObject["id"]})`; 
    return setTimeoutShowAll(addlistResult);
} 

// deleteTodo

TodoUI.prototype.deleteTodoExecutor = function(deleteID) {
    return checkValidation(deleteID) ? deleteTodoResult(deleteID) : printError()
};

