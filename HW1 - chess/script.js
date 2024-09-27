const board = document.getElementById("board");
const radio = document.getElementsByName("figures");
const result = document.getElementById("result");
let pPos;
let tPos;
let pName;

function UpdateMatrix(position, piece) {
    let matrix = [];


    matrix.push([0,1,2,3,4,5,6,7,8]);

    for (let i = 0; i < 8; i++) {
        let mrow = [];
        mrow.push(i);
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 === 0) {
                mrow.push(0);
            } else {
                mrow.push(1);
            }
        }
        matrix.push(mrow);
    }

    if (position !== undefined) {
        if (piece === 'P') {
            if (tPos !== undefined) {
                const xPos = tPos[0];
                const yPos = tPos[1];

                matrix[yPos][xPos] = pName  ;
            }

            pPos = position;
            const xPos = pPos[0];
            const yPos = pPos[1];

            matrix[yPos][xPos] = piece;
        }
        if (piece !== 'P') {

            if (pPos !== undefined) {
                const xPos = pPos[0];
                const yPos = pPos[1];

                matrix[yPos][xPos] = 'P';
            }
            pName = piece;
            tPos = position;
            const xPos = tPos[0];
            const yPos = tPos[1];

            matrix[yPos][xPos] = piece;
        }

        let posMap = []

        if (tPos !== undefined) {
            posMap.push(tPos[0]);
            posMap.push(tPos[1]);
        } else {
            posMap.push('-');
            posMap.push('-');
        }
        if (pPos !== undefined) {
            posMap.push(pPos[0]);
            posMap.push(pPos[1]);
        } else {
            posMap.push('-');
            posMap.push('-');
        }
        UpdatePosOutput(posMap[0], posMap[1], posMap[2], posMap[3], pName)
        if (tPos !== undefined && pPos !== undefined) {
            let mCells = CheckBeating(posMap[0], posMap[1], posMap[2], posMap[3], pName);
            //console.log(mCells);
            if (mCells !== undefined) {
                mCells.forEach(cell => {
                    matrix[cell[1]][cell[0]] = '·';
                })
            }


        }
    }

    return matrix;
}

function BuildBoard(matrix) {
    board.innerHTML = '';
    matrix.forEach((row, i) => {
        row.forEach((col, j) => {
            const cell = document.createElement('button');
            if (i > 0) {
                if (j > 0) {
                    cell.classList.add('cell');
                    if ((i+ j) % 2 === 0) {
                        cell.classList.add('white');
                    } else {
                        cell.classList.add('black');
                    }
                    if (col !== 0 && col !== 1) {
                        if (col === '·') {
                            cell.innerHTML = '·';
                            cell.setAttribute('dot', 'dot');
                        } else {
                            cell.textContent = col;
                        }
                    }
                } else {
                    cell.classList.add('num');
                    cell.setAttribute('disabled', 'disabled');
                    cell.textContent = i;
                }
            } else {
                cell.classList.add('num');
                cell.setAttribute('disabled', 'disabled');
                cell.textContent = j;
            }
            cell.id = `${j}${i}`;
            board.appendChild(cell);
        })
    })
}

function UpdatePosOutput(k, l, m, n, piece) {
    if (piece === 'Q') {
        piece = 'Queen';
    } else if (piece === 'R') {
        piece = 'Rook';
    } else if (piece === 'B') {
        piece = 'Bishop';
    } else {

    }
    const targetbox = document.getElementById("targetbox");
    const pawnbox = document.getElementById("pawnbox");

    targetbox.textContent = `${piece} (${k}, ${l})`;
    pawnbox.textContent = `Pawn (${m}, ${n})`;


}

BuildBoard(UpdateMatrix())

function AssingPieces(event) {
    const position = event.target.id;

    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            const selectedPiece = radio[i].id
            BuildBoard(UpdateMatrix(position, selectedPiece))
            break;
        }
    }
}

/**
 * Check if Selected piece can beat a pawn for 1 step, or if not, check the cell through which piece can beat the pawn for 2 steps.
 * @param k {number} - Piece X pos
 * @param l {number} - Piece Y pos
 * @param m {number} - Pawn X pos
 * @param n {number} - Pawn Y pos
 * @param piece {string} - Piece name
 * @return {array}
 */
function CheckBeating(k, l, m, n, piece) {
    //console.log(k, l, m, n, piece);
    k = Number(k);
    l = Number(l);
    m = Number(m);
    n = Number(n);
    if (piece === 'R') {
        if(k === m || l === n) {
            result.textContent = `Rook can beat the Pawn for 1 step`;
        } else {
            let mergeCell1 = [k, n];
            let mergeCell2 = [m, l];
            result.textContent = `Rook can beat the Pawn for 2 step through (${mergeCell1[0]}, ${mergeCell1[1]}) or (${mergeCell2[0]}, ${mergeCell2[1]})`;
            return [mergeCell1, mergeCell2];
        }
    } else if (piece === 'B') {
        let dif = Math.abs(k - m) - Math.abs(l - n)
        //console.log(dif)
        if (dif === 0) {
            result.textContent = `Bishop can beat the Pawn for 1 step`;
        } else {
            if ((k + l) % 2 === (m + n) % 2) {
                let mergeCellArray = [];
                // const permanentk = k;
                // const permanentl = l;
                let mergeKmain = m - n;
                let mergeLmain = 0;
                while (mergeKmain < 0) {
                    mergeKmain++;
                    mergeLmain++;
                }
                let mergeKside = 0;
                let mergeLside = n + m;
                while (mergeLside > 9) {
                    mergeKside++;
                    mergeLside--;
                }
                console.log([mergeKmain, mergeLmain]);

                while (dif !== 0) {
                    console.log([mergeKmain, mergeLmain]);

                    mergeKmain++;
                    mergeLmain++;
                    if (mergeKmain > 8 || mergeLmain > 8) {
                        break;
                    }
                    dif = Math.abs(k - mergeKmain) - Math.abs(l - mergeLmain);
                }
                if (dif === 0) {
                    mergeCellArray.push([mergeKmain, mergeLmain])
                }
                dif = 1;
                console.log('----------')
                while (dif !== 0) {
                    mergeKside++;
                    mergeLside--;
                    if (mergeKside > 8 || mergeLside < 1) {
                        break;
                    }
                    dif = Math.abs(k - mergeKside) - Math.abs(l - mergeLside);

                }

                if ([mergeKside, mergeLside] !== [mergeKmain, mergeLmain] && dif === 0) {
                    mergeCellArray.push([mergeKside, mergeLside])
                }

                result.textContent = `Bishop can beat the Pawn for 2 step through:`;
                mergeCellArray.forEach(cell => result.textContent += ` (${cell}),`);
                result.textContent = result.textContent.slice(0, -1);

                return mergeCellArray;
            } else {
                result.textContent = `Bishop can not beat the Pawn because they are on different color cells`;
            }
        }
    } else if (piece === 'Q') {
        let dif = Math.abs(k - m) - Math.abs(l - n)
        if (k === m || l === n || dif === 0) {
            result.textContent = `Queen can beat the Pawn for 1 step`;
        } else {
            let mergeCellArray = [];
            let mergeCell1 = [k, n];
            let mergeCell2 = [m, l];
            mergeCellArray.push(mergeCell1);
            mergeCellArray.push(mergeCell2);
            if ((k + l) % 2 === (m + n) % 2) {

                // const permanentk = k;
                // const permanentl = l;
                let mergeKmain = m - n;
                let mergeLmain = 0;
                while (mergeKmain < 0) {
                    mergeKmain++;
                    mergeLmain++;
                }
                let mergeKside = 0;
                let mergeLside = n + m;
                while (mergeLside > 9) {
                    mergeKside++;
                    mergeLside--;
                }
                console.log([mergeKmain, mergeLmain]);

                while (dif !== 0) {
                    console.log([mergeKmain, mergeLmain]);

                    mergeKmain++;
                    mergeLmain++;
                    if (mergeKmain > 8 || mergeLmain > 8) {
                        break;
                    }
                    dif = Math.abs(k - mergeKmain) - Math.abs(l - mergeLmain);
                }
                if (dif === 0) {
                    mergeCellArray.push([mergeKmain, mergeLmain])
                }
                dif = 1;
                console.log('----------')
                while (dif !== 0) {
                    mergeKside++;
                    mergeLside--;
                    if (mergeKside > 8 || mergeLside < 1) {
                        break;
                    }
                    dif = Math.abs(k - mergeKside) - Math.abs(l - mergeLside);

                }

                if ([mergeKside, mergeLside] !== [mergeKmain, mergeLmain] && dif === 0) {
                    mergeCellArray.push([mergeKside, mergeLside])
                }
            }
            result.textContent = `Queen can beat the Pawn for 2 step through:`;
            mergeCellArray.forEach(cell => result.textContent += ` (${cell}),`);
            result.textContent = result.textContent.slice(0, -1);
            return mergeCellArray;
        }
    }
}

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        AssingPieces(event)
    }
});