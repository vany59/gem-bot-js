class Grid {
    constructor(gemsCode, gemTypes){
        this.gems = [];
        this.gemTypes = new Set();        

        this.updateGems(gemsCode);

        this.myHeroGemType = gemTypes;
    }

    updateGems(gemsCode) {
        this.gems = [];
        this.gemTypes = new Set();

        for (let i = 0; i < gemsCode.size(); i++) {
            let gem = new Gem(i, gemsCode.getByte(i));
            this.gems.push(gem);

            this.gemTypes.add(gem.type);

            console.log(i + ": " + gem.type)
        }
    }
}