interface Transaction {
    key: string;
    oldVal: string;
    newVal: string;
};

class Block {
    trs: Transaction[] = [];

    addTransaction(key: string, oldVal: string, newVal: string) {
        this.trs.push({
            key: key,
            oldVal: oldVal,
            newVal: newVal,
        });
    }
}

export class Db {

    readonly NOT_DEFINED = "NULL";
    private db = new Map<string, string>();
    private activeBlocks: Block[] = [];

    begin() {
        this.activeBlocks.push(new Block());
    }

    commit(): boolean {
        if(this.activeBlocks.length == 0) {
            return false;
        }

        this.activeBlocks = [];
        return true;
    }

    rollback(): boolean {
        if(this.activeBlocks.length == 0) {
            return false;
        }

        for(const tr of (this.activeBlocks[this.activeBlocks.length - 1].trs.reverse())) {
            if(tr.newVal === this.NOT_DEFINED) { // Unset rollback
                this.db.set(tr.key, tr.oldVal);
            }
            else if(tr.oldVal !== this.NOT_DEFINED) {
                this.db.set(tr.key, tr.oldVal);
            }
            else {
                this.db.delete(tr.key);
            }
        }
        this.activeBlocks.pop();
        return true;
    }

    getVal(key: string): string {
        return this.db.get(key) || this.NOT_DEFINED;
    }

    private saveOldVal(key: string, val: string) {
        if(this.activeBlocks.length > 0) { // we are in a transaction, save old val 
            const oldVal: string = this.getVal(key);
            this.activeBlocks[this.activeBlocks.length - 1].addTransaction(key, oldVal, val);
        }
    }

    setVal(key: string, val: string) {
        this.saveOldVal(key, val);
        this.db.set(key, val);
    }

    unsetVal(key: string) {
        this.saveOldVal(key, this.NOT_DEFINED);
        this.db.delete(key);
    }

    getNumOfVals(val: string) {
        let count = 0;
        for (let value of this.db.values()) {
            if(value === val){
                count++;
            }
        }

        return count;
    }

}