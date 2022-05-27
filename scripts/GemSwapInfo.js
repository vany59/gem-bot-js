class GemSwapInfo {
    constructor(index1, index2, sizeMatch, type, setGems) 
    {
        this.index1 = index1;
        this.index2 = index2;
        this.sizeMatch = sizeMatch;
        this.type = type;
        this.setGems = setGems;
    }

    getIndexSwapGem() {
        return [this.index1, this.index2];
    }

    getTypeOfGem() {
        return this.type
    }

    getSetGems() {
        return Array.from(this.setGems).map(value => value.modifier).filter(e => !!e)
    }
}