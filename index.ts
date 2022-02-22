import { Db } from './database/db';
const readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Store
const db: Db = new Db();

// Validator
const expectedCommandLenghts = new Map<string, number>([
    ['GET', 2],
    ['SET', 3],
    ['UNSET', 2],
    ['NUMEQUALTO', 2],
    ['END', 1],
    ['BEGIN', 1],
    ['COMMIT', 1],
    ['ROLLBACK', 1],
]);
function isValidInput(splits: string[]): boolean {
    if(splits.length === 0 || !expectedCommandLenghts.has(splits[0])) {
        return false;
    }

    if(expectedCommandLenghts.get(splits[0]) !== splits.length) {
        return false;
    }
    return true;
}

// Reader
rl.on('line', (line: string) => {
    let splits = line.split(" ");
    if(!isValidInput(splits)) {
        console.log(`Invalid input recieved : ${line}`);
        process.exit(1);
    }

    const command = splits[0];
    switch(command) {
        case 'GET': {
            const result = db.getVal(splits[1]);
            console.log(`>>> ${result}`);
            break;
        }
        case 'SET': {
            db.setVal(splits[1], splits[2]);
            break;
        }
        case 'UNSET': {
            db.unsetVal(splits[1]);
            break;
        }
        case 'NUMEQUALTO': {
            const result = db.getNumOfVals(splits[1]);
            console.log(`>>> ${result}`);
            break;
        }
        case 'END': {
            console.log(`\nGOOD BYE!`);
            process.exit(0);
        }
        case 'BEGIN': {
            db.begin();
            break;
        }
        case 'COMMIT': {
            if(!db.commit()) {
                console.log(">>> NO TRANSACTION");
            }
            break;
        }
        case 'ROLLBACK': {
            if(!db.rollback()) {
                console.log(">>> NO TRANSACTION");
            }
            break;
        }
    }
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});

