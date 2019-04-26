const database = require('./data');
const datalist = database.todos;
const readline = require('readline');
const inputReadline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


const TodoUI = function () {
    this.past = [];
    this.present = [];
    this.future = [];
};

// addTodo
TodoUI.prototype.addTodoExecutor = function (todoElement, todoTag) {
    this.addTodoList(todoElement, todoTag);
}

TodoUI.prototype.addTodoList = function (todoElement, todoTag) {
    const id = this.createNewID(datalist, 10000)

    const newTodo = {
        'name': todoElement,
        'tag': todoTag,
        'status': "todo",
        'id': id
    };
    datalist.push(newTodo);

    return this.addTodoResult(newTodo);
}


TodoUI.prototype.addTodoResult = function (newAddedObject) {
    const addlistResult = `${newAddedObject.name} 1 개가 추가됐습니다.(id : ${newAddedObject.id})`;
    return this.showAll_printResult(addlistResult);
}

// deleteTodo
TodoUI.prototype.deleteTodoExecutor = function (deleteID) {
    return this.checkID(deleteID) ? this.deleteTodoList(deleteID) : this.printError()
};

TodoUI.prototype.deleteTodoList = function (deletedID) {
    const deletedIndex = this.getIndex(deletedID);
    const [splicedData] = datalist.splice(deletedIndex, 1);
    this.undoable(splicedData);

    return this.deleteTodoResult(splicedData)
};

TodoUI.prototype.deleteTodoResult = function (splicedData) {
    const deletionResult = `${splicedData.name}가 ${splicedData.status}에서 삭제되었습니다.`
    return this.showAll_printResult(deletionResult);
};


// updateTodo
TodoUI.prototype.updateTodoExecutor = function (id, updatedStatus) {
        return this.checkID(id) ? this.updateTodoStatus(id, updatedStatus) : this.printError()
};


TodoUI.prototype.updateTodoStatus = function (id, updatedStatus) {
    const updatatingIndex = this.getIndex(id);
    if (this.checkDuplicatedStatus(updatatingIndex, updatedStatus)) {
        this.printResult('\n');
        inputReadline.prompt();
        return
    };
    datalist[updatatingIndex].status = updatedStatus;
    return this.updateTodoResult(updatatingIndex, updatedStatus)
};


TodoUI.prototype.updateTodoResult = function (updatatingIndex, updatedStatus) {
    const updateResult = `${datalist[updatatingIndex].name} 가 ${updatedStatus}로 상태가 변경됬습니다.`;
    return setTimeout(() => {
        this.showAll_printResult(updateResult);
    }, 3000);
};

TodoUI.prototype.showElementGetter = function () {
    const todoList = this.checkStatus(datalist, 'todo');
    const doingList = this.checkStatus(datalist, 'doing');
    const doneList = this.checkStatus(datalist, 'done');
    return { todoList, doingList, doneList }
}


TodoUI.prototype.showTodoList = function (status) {
    const todoElementList = this.showElementGetter()
    return this.showStatusExecutor(status, todoElementList);
}

TodoUI.prototype.showStatusExecutor = function (status, todoElementList) {
    const { todoList, doingList, doneList } = todoElementList
    switch (status) {
        case 'all':
            return `현재상태 : todo: ${todoList.length}개, doing: ${doingList.length}개, done: ${doneList.length}개 \n`
        case 'todo':
            return `todo리스트 : 총 ${todoList.length} 건 : ${todoList} \n`
        case 'doing':
            return `doing리스트 : 총 ${doingList.length} 건 : ${doingList} \n`;
        case 'done':
            return `done리스트 : 총 ${doneList.length} 건 : ${doneList} \n`
        default:
            return '입력하신 값이 존재하지않습니다. \n';
    }
}


TodoUI.prototype.showAll_printResult = function (result) {
    this.printResult(result);
    setTimeout(() => {
        this.printResult((this.showTodoList('all')));
        inputReadline.prompt();
    }, 1000);
}

TodoUI.prototype.splitInputVal = function (inputData) {
    const splitOnDollarSymbol = inputData.split("$");
    return splitOnDollarSymbol
}

TodoUI.prototype.printResult = function (result) {
    console.log(result);
}


TodoUI.prototype.printError = function () {
    console.error('입력하신 값이 존재하지않습니다. \n');
    inputReadline.prompt();
    return;
}


TodoUI.prototype.getIndex = function (inputId) {
    return datalist.map((element) => { return element["id"] }).indexOf(inputId);
}


TodoUI.prototype.checkStatus = function (objData, status) {
    return objData.filter(list => list.status === status).map(list => { return list.name });
}


TodoUI.prototype.createNewID = function (datalist, maxNumOfID) {
    const newID = Math.floor(Math.random() * maxNumOfID) + 1;
    const checkDuplicatedID = this.checkID(newID);
    if (typeof checkDuplicatedID !== 'undefined') createNewID(datalist, maxNumOfID);

    return newID;
}


TodoUI.prototype.checkID = function (inputID) {
    const [matchedListByID] = datalist.filter(list => {
        return list.id == inputID
    })
    return matchedListByID;
}

TodoUI.prototype.checkDuplicatedStatus = function (updatatingIndex, updatedStatus) {
    if (datalist[updatatingIndex].status === updatedStatus) {
        this.printResult('입력한 상태와 동일한 상태입니다')
        return true;
    }
}


TodoUI.prototype.checkCommands = function (userInput, inputReadline) {
    const splitUserInput = this.splitInputVal(userInput);
    if (userInput.split('$').length < 1 || userInput.split('$').length > 3) {
        console.log("입력값을 확인해주세요");
        inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
        inputReadline.prompt();
        return;
    }

    const [command, commandElement, TagORStatusOfcommandElement] = splitUserInput;

    if (command === 'show') {
        console.log(this.showTodoList(commandElement));
        inputReadline.prompt();
    }
    else if (command === 'add') {
        this.addTodoExecutor(commandElement, TagORStatusOfcommandElement);
    }
    else if (command === 'update') {
        this.updateTodoExecutor(Number(commandElement), TagORStatusOfcommandElement);
    }
    else if (command === 'delete') {
        this.deleteTodoExecutor(Number(commandElement));
    }
    else if (command === 'undo') {
        this.undo();
    }
    else if (command === 'redo') {
        this.redo();
    }
    else {
        this.printError();
    }
}


TodoUI.prototype.undoable = function (splicedData) {
    this.past.push(splicedData);
}

TodoUI.prototype.undo = function () {
    if (this.past.length === 0) {
        console.log('undo할 값이 없습니다!');
        inputReadline.prompt();
        return;
    }

    const popPastValue = this.past.pop();
    datalist.push(popPastValue);
    this.present.push(popPastValue);
    console.log(`${popPastValue.id}번 항목 ${popPastValue.name}가 삭제에서 ${popPastValue.status}상태로 변경되었습니다.`);
    inputReadline.prompt();
    return;
}

TodoUI.prototype.redo = function () {
    if (this.present.length === 0) {
        console.log('redo할 값이 없습니다!');
        inputReadline.prompt();
        return;
    }
    const popPresentValue = this.present.pop();
    datalist.pop();
    this.past.push(popPresentValue);
    console.log(`${popPresentValue.id}번 항목 ${popPresentValue.name}가 ${popPresentValue.status}상태에서 삭제되었습니다.`);
    inputReadline.prompt();
    return;
}


TodoUI.prototype.mainExecutor = function () {
    inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
    inputReadline.prompt();
    inputReadline.on('line', function (line) {

        if (line === "q") inputReadline.close();
        todoList.checkCommands(line, inputReadline);
    })

        .on('close', function () {
            console.log('프로그램이 종료되었습니다.');
            process.exit();
        });
}

const todoList = new TodoUI();
todoList.mainExecutor();