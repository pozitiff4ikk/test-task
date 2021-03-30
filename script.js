d3.text("data.csv", function(data) {
    let parsedCSV = d3.csv.parseRows(data);
    data = parseData(parsedCSV);
    //console.log(data)
    //console.log(!isNaN(data[0].age));

    let btnGet = document.querySelector('button');
    let myTable = document.querySelector('#table');

    let headers = [`ID`,`Full Name`,`Phone`,`Email`,`Age`,`Experience`,`Yearly Income`,`Has children`,`License states`,`Expiration date`,`License number`,];

    btnGet.addEventListener('click', () => {
        let table = document.createElement('table');
        let headerRow = document.createElement('tr');

        headers.forEach(headerText => {
            let header = document.createElement('th');
            let textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        });

        table.appendChild(headerRow);

        let data1 = []
        let duplicated = []
        data.forEach(val => {
            let duplicate
            if (data1.length > 0){
                duplicate = findDuplicates(data1, val.Phone)
                if(duplicate){
                    data1.push(val.Phone)
                    duplicated.push(duplicate)
                    duplicated[duplicate-1] = val.ID
                }
                else{
                    data1.push(val.Phone)
                    duplicated.push('')
                }
            }
            else{
                data1.push(val.Phone)
                duplicated.push('')
            }

            let row = document.createElement('tr');

            Object.values(val).forEach(text => {
                if(!val["Full Name"]){
                    return alert("add name");
                }else{
                    if(!val.Phone){
                        return alert("add phone");
                    }else{
                        if(!val.Email){
                            return alert("add email");
                        }
                    }
                }

                let cell = document.createElement('td');
                let textNode = document.createTextNode(text);
                cell.appendChild(textNode);
                row.appendChild(cell);
            })

            table.appendChild(row);

        });
        myTable.appendChild(table);

        appendDuplicate(table, duplicated);
        validateAge(table);
        validateExperience(table);
        validateYearlyIncome(table);
        phoneValidation(table);
        hasChildrenValidation(table);
        licenceNumValidation(table);
        validateDate(table)
        validateStates(table)


    });

});

function findDuplicates(data, value) {
    for(let i = 0;i<data.length; i++){
        if(value === data[i]){
            return i+1
        }
    }
    return 0
}

function validateStates(table) {
    for (let i = 1; i < table.rows.length; i++) {
        let validStates = ''
        let x = table.rows[i].cells[8];
        let states = x.innerHTML.split('|')
        for(let j = 0; j < states.length; j++){
            if(states[j].length <= 2){
                if(validStates){
                    validStates += '|' + states[j]
                }
                else{
                    validStates = states[j]
                }
            }
            else{
                let splitedStates = states[j].split(' ')
                if(splitedStates.length > 1){
                    if(validStates) {
                        validStates += '|' + splitedStates[0][0] + splitedStates[1][0]
                        continue
                    }
                    else {
                        validStates = splitedStates[0][0] + splitedStates[1][0]
                        continue
                    }
                }
                if(validStates){
                    validStates += '|' + splitedStates[0].slice(0, 2).toUpperCase()
                }
                else{
                    validStates = splitedStates[0].slice(0, 2).toUpperCase()
                }
            }
        }
        x.innerHTML = validStates
    }
}

function validateDate(table) {
    let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    let dateformat2 = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
    for (let i = 1; i < table.rows.length; i++) {
        let x = table.rows[i].cells[9];
        if((x.innerHTML.match(dateformat))){
            continue
        }
        else{
            if(x.innerHTML.match(dateformat2)){
                continue
            }
            else{
                x.style.backgroundColor = "yellow";
            }
        }

    }
}


function licenceNumValidation(table) {
    for (let i = 1; i < table.rows.length; i++) {
        let x = table.rows[i].cells[10];
        if(x.innerHTML.length<6 | x.innerHTML.length>6){
            x.style.backgroundColor = "yellow";
        }
    }
}

function hasChildrenValidation(table) {
    for (let i = 1; i < table.rows.length; i++) {
        let x = table.rows[i].cells[7];
        if(x.innerHTML !== "TRUE" & x.innerHTML !== "FALSE" & x.innerHTML !== ""){
            x.style.backgroundColor = "yellow";
        }
    }
}

function phoneValidation(table) {
    for (let i = 1; i < table.rows.length; i++) {
        let x = table.rows[i].cells[2];
        if(x.innerHTML.length<11){
            x.style.backgroundColor = "yellow";
        }
    }
}

function validateYearlyIncome(table) {
    for (let i = 1; i < table.rows.length; i++) {
        let x = table.rows[i].cells[6];
        if(x.innerHTML>1000000){
            x.style.backgroundColor = "yellow";
        }
    }
}

function validateExperience(table) {
    for (let i = 1; i < table.rows.length; i++) {
        let x = table.rows[i].cells[5];
        if(table.rows[i].cells[5].innerHTML>table.rows[i].cells[4].innerHTML){
            x.style.backgroundColor = "yellow";
        }
    }
}

function validateAge(table) {
    for (let i = 1; i < table.rows.length; i++) {
        let x = table.rows[i].cells[4];
        if(x.innerHTML<21 | x.innerHTML===0){
            x.style.backgroundColor = "yellow";
        }
    }
}




function parseData(data) {
    let headers;
    let result = [];
    for (i=0;i<data.length;i++){
        if (i==0){
            headers = data[i];
            continue;
        }
        let obj1 = {};
        for(j=0;j<data[i].length;j++){
            if (j==0){
                obj1['ID'] = i;
            }
            obj1[headers[j]] = data[i][j];
            //console.log(obj1);
        }
        result.push(obj1)
    }
    return result;
}

function createCell(cell, text, style) {
    let div = document.createElement('div');
    let txt = document.createTextNode(text);
    div.appendChild(txt);
    cell.appendChild(div);
}

function appendDuplicate(table, duplicated) {
    createCell(table.rows[0].insertCell(table.rows[0].cells.length), "Duplicated", );
    for(let i = 1; i < table.rows.length; i++) {
        createCell(table.rows[i].insertCell(table.rows[i].cells.length), duplicated[i-1], 'col');
    }
}

