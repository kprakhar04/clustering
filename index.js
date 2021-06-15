const submitBtn = document.getElementById('mainBtn');
const x1 = document.getElementById('x1');
const x2 = document.getElementById('x2');
const res = document.getElementById('res');


submitBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (!x1.value && !x2.value) {
        return;
    }
    res.innerHTML = '';
    const splittedP1 = x1.value.split("\n");
    const splittedP2 = x2.value.split("\n");
    const finalMat = [];
    for (let i = 0; i < splittedP1.length; i++) {
        const obj = {};
        obj['x'] = +splittedP1[i];
        obj['y'] = +splittedP2[i];
        finalMat.push(obj);
    }
    // console.log(finalMat);
    let rowHeaders = getHeaders(finalMat.length);
    let colHeaders = getHeaders(finalMat.length);
    let distMat = constructMatrix(finalMat);
    showTableResult(distMat, colHeaders, rowHeaders);

    while (distMat.length > 2) {
        const { currRow, currCol, minEle } = findMinEle(distMat);
        createMinEle(minEle);

        // console.log(currRow, currCol, minEle);
        for (let k = 0; k < currCol; k++) {
            distMat[currCol][k] = Math.min(distMat[currRow][k], distMat[currCol][k]);
        }
        for (let i = currCol + 1; i < distMat.length; i++) {
            if (i !== currRow) {
                // console.log(distMat[i][currCol], distMat[i][currRow]);
                distMat[i][currCol] = Math.min(distMat[i][currCol], distMat[i][currRow]);
            }
        }
        // if (rowHeaders[currCol].startsWith("(")) {
        //     rowHeaders[currCol] += `(${rowHeaders[currCol]}, ${rowHeaders[currRow]})`;
        //     colHeaders[currCol] += `(${colHeaders[currCol]}, ${colHeaders[currRow]})`;
        // } else {
        rowHeaders[currCol] = `(${rowHeaders[currCol]}, ${rowHeaders[currRow]})`;
        colHeaders[currCol] = `(${colHeaders[currCol]}, ${colHeaders[currRow]})`;
        // }
        distMat.splice(currRow, 1);

        for (let i = 0; i < distMat.length; i++) {
            distMat[i].splice(currRow, 1);
        }


        rowHeaders.splice(currRow, 1);
        colHeaders.splice(currRow, 1);
        distMat = makeMatrixMirror(distMat);

        showTableResult(distMat, colHeaders, rowHeaders);

        // for (let i = 0; i < distMat.length; i++) {
        //     console.log(distMat[i]);
        // }
    }

});


const constructMatrix = (vals) => {
    const R = vals.length;
    const C = R;
    const val = -100;

    const arr = Array(R);
    for (let i = 0; i < R; i++) {
        arr[i] = Array(C).fill(val);
    }
    for (let i = 0; i < vals.length; i++) {
        const currPoint = vals[i];
        for (let j = 0; j < vals.length; j++) {
            const dist = findDist(currPoint, vals[j]);
            arr[i][j] = dist;
        }
    }
    return arr;
}

const findMinEle = (arr) => {
    let currRow = -1;
    let currCol = -1;
    let minEle = Infinity;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j <= i; j++) {
            if (arr[i][j] < minEle && i !== j) {
                minEle = arr[i][j];
                currCol = j;
                currRow = i;
            }
        }
    }
    return { minEle, currRow, currCol };
}
const makeMatrixMirror = mat => {
    for (let i = 0; i < mat.length; i++) {
        for (let j = i + 1; j < mat.length; j++) {
            mat[i][j] = mat[j][i];
        }
    }
    return mat;
}

const findDist = (p1, p2) => {
    const d = +Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)).toFixed(2);
    return d;
}

const showTableResult = (mat, colHeaders, rowHeaders) => {
    const table = document.createElement('table');
    table.className = 'table';
    const thead = document.createElement('thead');
    let row = document.createElement('tr');
    const th = document.createElement('th');
    const text = document.createTextNode('');
    th.appendChild(text);
    row.append(th);
    for (let i = 0; i < colHeaders.length; i++) {
        const th = document.createElement('th');
        const text = document.createTextNode(colHeaders[i]);
        th.appendChild(text);
        row.append(th);
    }
    thead.appendChild(row);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    let minEle = Infinity;
    let minEleRow = 0;
    let minEleCol = 0;

    for (i = 0; i < mat.length; i++) {
        row = document.createElement('tr');
        const th = document.createElement('th');
        const text = document.createTextNode(rowHeaders[i]);
        th.appendChild(text);
        row.appendChild(th);
        for (let j = 0; j < mat.length; j++) {
            if (i >= j) {
                const td = document.createElement('td');
                const text = document.createTextNode(mat[i][j]);
                td.appendChild(text);
                row.appendChild(td);
            }
            else {
                const td = document.createElement('td');
                const text = document.createTextNode('');
                td.appendChild(text);
                row.appendChild(td);
            }
            if (mat[i][j] < minEle && i > j) {
                minEle = mat[i][j];
                minEleRow = i;
                minEleCol = j;
            }
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    console.log("row", minEleRow);
    console.log("col", minEleCol);
    const cell = table.tBodies.item(0).rows.item(minEleRow).cells.item(minEleCol + 1);
    if (mat.length > 2) {
        cell.className = 'round-button';
    }

    res.append(table);
}

const createMinEle = ele => {
    const para = document.createElement("p");
    para.className = `is-size-4`;
    const text = document.createTextNode(`${ele} is the minimum value`);
    para.appendChild(text);
    res.append(para);
}

const getHeaders = len => {
    const headers = [];
    for (let i = 0; i < len; i++) {
        headers.push(String.fromCharCode(i + 65));
    }
    return headers;
}