/*
    renderList(data):
    data - dictionary to be parsed into HTML formatting

    This function takes a dictionary, either from another function or from the initial json file
    and generates the HTML for the Task List.
*/
function renderList(data){
    // get div for Task List and clear it.
    const contentDiv = document.getElementById('current-tasks');
    contentDiv.innerHTML = '';

    // headings for top row of Task List
    const HEADINGS = ['PRIO', 'TASK', 'TAG', 'DATE', 'ACTION']
    generateHeader(HEADINGS);
    genLegend();

    console.log('rendering current data');
    console.log(data);

    // iterate through items and generates rows
    data.forEach(item => {
        // array of dictionary keys
        const HEAD_ARR = ['prio', 'task', 'tag', 'date']

        // iterate through dictionary keys
        HEAD_ARR.forEach(head => {
            const newGridElement = document.createElement('div');

            // add a color coded circle depending on the tag
            if (head == 'tag'){
                newGridElement.id = `${item[head]}`
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.style.backgroundColor = dotColor(item[head]);
                newGridElement.appendChild(dot);
            }

            // add a checked or unchecked box depending on prio
            else if (head == 'prio'){
                const checkbox = document.createElement('input');
                const label = document.createElement('label');
                checkbox.type = 'checkbox';
                checkbox.className = 'checkbox-prio'
                label.htmlFor = `checkbox-${item.task}`;
                if (item.prio == 1) {
                    checkbox.checked = true;
                }
                newGridElement.appendChild(checkbox);
                newGridElement.appendChild(label);
            }

            // for others just insert text
            else {
                newGridElement.textContent = item[head];
            }

            // append row to actual HTML
            newGridElement.className = "grid-item";
            contentDiv.appendChild(newGridElement);
        })

        // adds the ACTION part of the row with action buttons
        const actionGridElement = document.createElement('div');
        actionGridElement.className = "grid-item";

        // adds the edit button
        const editButton = document.createElement('input');
        editButton.type = 'checkbox';
        editButton.className = 'checkbox-edit';
        editButton.id = item.task;

        // adds the completed button (currently also just deletes)
        const compButton = document.createElement('input');
        compButton.type = 'checkbox';
        compButton.className = 'checkbox-comp';
        compButton.id = item.task;

        // adds the delete button
        const delButton = document.createElement('input');
        delButton.type = 'checkbox';
        delButton.className = 'checkbox-del';
        delButton.id = item.task;

        // appends all elements
        actionGridElement.appendChild(editButton);
        actionGridElement.appendChild(compButton);
        actionGridElement.appendChild(delButton);

        // adds an invisible description, can use later
        const descGridElement = document.createElement('div');
        descGridElement.textContent = item.desc;
        descGridElement.id = 'task-desc';
        descGridElement.className = item.task;
        descGridElement.style.display = "none";
        contentDiv.appendChild(actionGridElement);
        contentDiv.appendChild(descGridElement);
    });

    // update all checkboxes with onClick listeners
    checkboxUpdate(); // updates prio checkboxes
    editCheckboxUpdate(); // updates edit checkboxes
    delCheckboxUpdate(); // updates delete checkboxes
    compCheckboxUpdate(); // updates complete checkboxes
    submitButtonUpdate(); // updates submit button
}

/*
    genLegend():
    Generates the HTML for the legend.
*/
function genLegend(){
    const TAGS = ['Personal', 'Work', 'School', 'Misc']     ;
    const legendDiv = document.getElementById('legend')
    legendDiv.textContent = '';

    TAGS.forEach(tag => {
        const dot = document.createElement('span');
        const tagText = document.createElement('h3');
        tagText.textContent = tag;
        dot.className = 'dot';
        dot.style.backgroundColor = dotColor(tag);
        legendDiv.appendChild(dot);
        legendDiv.appendChild(tagText);
    })
}

/*
    checkboxUpdate():
    Clicking on prio checkboxes causes the priority to be toggled and list resorted.
*/
function checkboxUpdate(){
    const checkboxArr = document.querySelectorAll('.checkbox-prio');
    checkboxArr.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // rerender list with new changes
            renderList(currentData());
        });
    });
}

/*
    editCheckboxUpdate():
    Clicking on edit checkbox causes the editing mode on a row to be active.
*/
function editCheckboxUpdate(){
    const checkboxArr = document.querySelectorAll('.checkbox-edit');
    checkboxArr.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked == true){
                // go into editing mode
                console.log(`edit mode for ${checkbox.id}`);
                // uncheck the checkbox
                checkbox.checked = false;
                // return current row
                const rowNodes = returnRowNodes(checkbox.parentNode);
                // generate submit form for editing
                genSubmissionEdit(rowNodes);
            }
        });
    });
}

/*
    returnRowNodes(lastNode):
    lastNode - final node in the row of nodes, usually the node under ACTION col.

    @return - array of nodes in a row.

    Returns the current row of nodes.
*/
function returnRowNodes(lastNode){
    const currNode = lastNode; // goes backwards from last node to get all of them.
    const dateNode = currNode.previousElementSibling;
    const tagNode = dateNode.previousElementSibling;
    const taskNode = tagNode.previousElementSibling;
    const prioNode = taskNode.previousElementSibling;
    return rowList = [prioNode, taskNode, tagNode, dateNode, currNode];
}

/*
    genSubmissionEdit(nodeArr):
    nodeArr - current row of nodes

    Generates the submission form at the top with editing capabilities rather than creating a
    new entry in the Task List.
*/
function genSubmissionEdit(nodeArr){
    // pulling current submission elements from HTML
    const taskInput = document.getElementById('textInput');
    const descInput = document.getElementById('descInput');
    const selectInput = document.getElementById('selectInput');
    const dateInput = document.getElementById('dateInput');
    console.log(nodeArr);

    // set color
    const color = document.getElementById('grid-header').backgroundColor;
    nodeArr.forEach(node => {
        node.style.backgroundColor = '#121B2E';
    })

    // adding default placeholders based on row being edited
    taskInput.value = nodeArr[1].textContent;
    descInput.placeholder = 'DESC';
    selectInput.value = nodeArr[2].id;
    dateInput.value = nodeArr[3].textContent;

    // creating a new button to remove current EventListeners
    const button = document.getElementById('submitButton');
    const parent = button.parentNode;
    parent.removeChild(button);
    const newButton = document.createElement('button');
    newButton.innerHTML = button.innerHTML;
    newButton.id = 'submitButton';
    newButton.type = 'submit';
    newButton.className = 'editButton';
    parent.appendChild(newButton);

    // adding new EventListener to new button
    document.getElementById('submitButton').addEventListener('click', function(event){
        nodeArr.forEach(node => {
            node.style.backgroundColor = color;
        })

        // updating new values to insert to Task List
        const task = taskInput.value;
        var desc = '';
        if (desc = descInput.value != null){
            desc = descInput.value;
        }
        const tag = selectInput.value;
        const date = dateInput.value;
        var prio = 0;
        const comp = 0;

        // passing new submission through error handler to catch erros
        if (submissionErrorHandler(task,desc,tag,date) > 0){
            // search for current node in dictionary and delete it
            const replacementData = searchAndDelete({'task': nodeArr[1].textContent, 'tag': nodeArr[2].id,'date':nodeArr[3].textContent})
            renderList(replacementData[0]);
            console.log({task,'prio':replacementData[2],comp,date,tag,'desc':replacementData[1]})
            // add new row, replacing description if necessary
            if (desc == ''){
                addRow([{task,'prio':replacementData[1],comp,date,tag,'desc':replacementData[2]}]);
            } else {
                addRow([{task,'prio':replacementData[1],comp,date,tag,desc}]);
            }
            // return submission fields to default state
            returnSubmission();
        } else {
            // if error handler is not passed, return to default state and escape edit mode
            returnSubmission();
        }
    })
}

/*
    searchAndDelete(row):
    row - dictionary of elements from a row

    @return - current dictionary without specified row, the priority of removed element,
    and desc of removed element.

    Looks for the current row in Task List and deletes it.
*/
function searchAndDelete(row){
    const curr = currentData(); // takes snapshot of current data
    var newData = [] // output array
    var desc = '';
    var prio = 0;
    curr.forEach(row2 => {
        if (row.task != row2.task || row.tag != row2.tag || row.date != row2.date){
            newData.push(row2); // if not the same, push to output
        } else {
            desc = row2.desc; // save the prio and descriptions
            prio = row2.prio;
        }
    })
    return [newData, prio, desc];
}

/*
    returnSubmission():
    Generates a new submission form at the top.
*/
function returnSubmission(){
    const formRow = document.getElementById('form-row');
    formRow.textContent = '';
    const taskInput = document.createElement('input');
    const descInput = document.createElement('input');
    taskInput.type = 'text';
    descInput.type = 'text';
    taskInput.placeholder = 'TODO';
    descInput.placeholder = 'DESC';
    taskInput.id = 'textInput';
    descInput.id = 'descInput';
    const selectInput = document.createElement('select');
    const options = [
        {value: 'Personal', text: 'Personal'},
        {value: 'School', text: 'School'},
        {value: 'Work', text: 'Work'},
        {value: 'Misc', text: 'Misc'}
    ]
    options.forEach(function(option){
        var optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.text = option.text;
        selectInput.appendChild(optionElement);
    })
    selectInput.id = 'selectInput';
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'dateInput';
    const button = document.createElement('button');
    button.type = 'submit';
    button.id = 'submitButton';
    button.textContent = '+';
    button.className = 'defaultSubmit';

    formRow.appendChild(taskInput);
    formRow.append(descInput);
    formRow.append(selectInput);
    formRow.append(dateInput);
    formRow.append(button);
    submitButtonUpdate();
}

/*
    delCheckboxUpdate():
    Adds an EventListener to all delete action buttons that delete the entire row.
*/
function delCheckboxUpdate(){
    const checkboxArr = document.querySelectorAll('.checkbox-del');
    checkboxArr.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked == true){
                const taskName = checkbox.id;
                const descriptions = document.querySelectorAll(`#task-desc`);
                descriptions.forEach(desc => {
                    if (desc.className == taskName){
                        desc.style.display = 'none';
                    }
                })
                console.log(`delete ${checkbox.id}`);
                deleteRow(checkbox.parentNode);
            }
        });
    });
}

/*
    compCheckboxUpdate():
    Adds an EventListener to all complete action buttons that complete the task.
    (currently just deletes it)
*/
function compCheckboxUpdate(){
    const checkboxArr = document.querySelectorAll('.checkbox-comp');
    checkboxArr.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
                const taskName = checkbox.id;
                console.log(`Toggle description display for ${taskName}`);
                const descriptions = document.querySelectorAll(`#task-desc`);
                descriptions.forEach(desc => {
                    if (desc.className == taskName){
                        if (checkbox.checked == true){
                            desc.style.display = 'grid';
                        } else {
                            desc.style.display = 'none';
                        }
                    }
                })
        });
    });
}

/*
    submitButtonUpdate():
    Adds an EventListener to the submit button that adds the submitted fields if they pass
    the error handler.
*/
function submitButtonUpdate(){
    document.getElementById('submitButton').addEventListener('click', function(event){
        const task = document.getElementById('textInput').value;
        const desc = document.getElementById('descInput').value;
        const tag = document.getElementById('selectInput').value;
        const date = document.getElementById('dateInput').value;
        const prio = 0;
        const comp = 0;
        returnSubmission();
        if (submissionErrorHandler(task,desc,tag,date) > 0){
            addRow([{task,prio,comp,date,tag,desc}]);
        }
    })
}

/*
    submissionErrorHandler(task,desc,tag,date):
    task - task name
    desc - description for task
    tag - one of four tags for the task (Personal, School, Work, Misc)
    date - date in YYYY-MM-DD format

    @return - 1 for success, -1 otherwise

    Handles errors for submission form.
*/
function submissionErrorHandler(task,desc,tag,date){
    if (date == null){
        alert('Please insert valid date.');
        return -1;
    }
    if (task == null || task == ''){
        alert('Please insert a task.');
        return -1;
    }
    if (task.length > 20){
        alert('Task name too long (20 characters or less).');
        return -1;
    }
    if (desc == null){
        alert('Please insert a valid description.');
        return -1;
    }
    if (desc.length > 50){
        alert('Description name too long (50 characters or less).');
        return -1;
    }
    return 1;
}

/*
    readErrorHandler(task,desc,tag,date,prio):
    task,desc,tag,date,prio - checks each property for errors

    Helper function for cleanJSON that flags errors.
*/
function readErrorHandler(task,desc,tag,date,prio){
    if (date == null){
        return -1;
    }
    if (task == null || task == ''){
        return -1;
    }
    if (task.length > 20){
        return -1;
    }
    if (desc == null){
        return -1;
    }
    if (desc.length > 50){
        return -1;
    }
    if (tag != 'Personal' && tag != 'Work' && tag != 'School' && tag != 'Misc'){
        return -1;
    }
    if (prio != 0 && prio != 1){
        return -1;
    }
    return 1;
}

/*
    cleanJSON(dict):
    dict - JSON dictionary

    Cleans the dictionary and flags errors rendering website.
*/
function cleanJSON(dict){
    var newData = [];
    var errorCount = 0;
    dict.forEach(item => {
        passFlag = readErrorHandler(item.task, item.desc, item.tag, item.date, item.prio);
        if (passFlag != -1){
            newData.push(item);
        } else {
            errorCount++;
        }
    })
    console.log(`On JSON load there were ${errorCount} total invalid entries.`);
    return newData;
}

/*
    addRow(row):
    row - row to be added

    Adds the new row to the Task List.
*/
function addRow(row){
    console.log('addRowCalled');
    renderList(sortTasks(currentData().concat(row)));
}

/*
    deleteRow(lastNode):
    lastNode - last node in row of nodes

    Delete the entire row of nodes.
*/
function deleteRow(lastNode){
    const currNode = lastNode;
    const dateNode = currNode.previousElementSibling;
    const tagNode = dateNode.previousElementSibling;
    const taskNode = tagNode.previousElementSibling;
    const prioNode = taskNode.previousElementSibling;
    const delList = [currNode, dateNode, tagNode, taskNode, prioNode];
    delList.forEach(node => {
        node.parentNode.removeChild(node);
    })
}

/*
    currentData():
    @return - current data in Task List, sorted

    Returns all the current data present in Task List and sorts by prio, then date.
*/
function currentData(){
    const childDivs = document.getElementsByClassName('grid-item');
    const taskDescs = document.querySelectorAll('#task-desc');
    const allCheckboxes = document.querySelectorAll('.checkbox-prio');
    var newData = [];
    var task = '';
    var prio = 0;
    var complete = 0;
    var date = '';
    var tag = '';
    var desc = '';
    counter = 0;
    var headCounter = 0; // keep track of Task List header and avoid those
    var loopsCounter = 0; // used to keep track of prio as workaround
    for (i=0; i < childDivs.length; i++){
        if (headCounter < 5){
            headCounter++;
            continue;
        }
        if (counter == 0){ //prio
            const checkbox = allCheckboxes[loopsCounter];
            if (checkbox.checked == true){
                prio = 1;
            } else {
                prio = 0;
            }
        }
        else if (counter == 1){ // task name
            task = childDivs[i].textContent;
        }
        else if (counter == 2){ // tag
            tag = childDivs[i].id;
        }
        else if (counter == 3){ // date
            date = childDivs[i].textContent;
        }
        else if (counter == 4){ // action div

        }
        counter++;
        if (counter == 5){
            counter = 0;
            // push to data
            newData.push({task,prio,complete,date,tag,desc});
            loopsCounter++;
        }
    }
    for (i=0; i < newData.length; i++){
        newData[i].desc = taskDescs[i].textContent;
    }
    // sort then return
    return sortTasks(newData);
}

/*
    dotColor(tag):
    tag - one of four assigned tags to tasks

    @return - tag color

    Assigns a color to each tag.
*/
function dotColor(tag){
    const TAGS = ['Personal', 'Work', 'School', 'Misc']
    if (tag == TAGS[0]){
        return '#DB897D';
    }
    else if (tag == TAGS[1]){
        return '#A79EDB';
    }
    else if (tag == TAGS[2]){
        return '#55DB9C';
    }
    else if (tag == TAGS[3]){
        return '#DBCA56';
    }
    else {
        return '#6E8A7D';
    }
}

/*
    generateHeader(heading_arr):
    heading_arr - array of header names

    Generates the top row of the Task List.
*/
function generateHeader(heading_arr){
    const headingRow = document.getElementById('current-tasks');
    heading_arr.forEach(head => {
        const newGridElement = document.createElement('div');
        newGridElement.textContent = head;
        newGridElement.className = "grid-item";
        newGridElement.id = "grid-header";
        headingRow.appendChild(newGridElement);
    })

}

/*
    sortTasks(tasks):
    tasks - dictionary of tasks to be sorted

    @return - sorted tasks

    Sorts the tasks by prio, then earliest to latest date.
*/
function sortTasks(tasks){
    tasks.sort((a, b) => {
        const priorityComparison = parseInt(b.prio) - parseInt(a.prio);
        if (priorityComparison !== 0) {
            return priorityComparison;
        }
        const dateComparison = new Date(a.date) - new Date(b.date);
        return dateComparison;
    });
    return tasks;
}

/*
    Parses json file into list and runs the initial render and load.
*/
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const startData = sortTasks(cleanJSON(data));
        console.log("Initial load");
        renderList(startData);
    })
    .catch(error => console.error('Error fetching JSON:', error));