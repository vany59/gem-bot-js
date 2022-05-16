class Grid {
    constructor(gemsCode, gemModifiers, gemTypes) {
        this.gems = [];
        this.gemTypes = new Set();

        this.updateGems(gemsCode, gemModifiers);

        this.myHeroGemType = gemTypes;
    }

    updateGems(gemsCode, gemModifiers) {
        this.gems = [];
        this.gemTypes = new Set();

        for (let i = 0; i < gemsCode.size(); i++) {
            let gem = new Gem(i, gemsCode.getByte(i), gemModifiers != null ? gemModifiers.getByte(i) : GemModifier.NONE);
            this.gems.push(gem);

            this.gemTypes.add(gem.type);

            // console.log(i + ": " + gem.type)
        }
    }

    recommendSwapGem() {
        let listMatchGem = this.suggestMatch();

        console.log("recommendSwapGem: ", listMatchGem);

        if (listMatchGem.length === 0) {
            return [-1, -1];
        }

        let matchGemSizeThanFour = listMatchGem.find(gemMatch => gemMatch.sizeMatch > 4);

        if (matchGemSizeThanFour) {
            return matchGemSizeThanFour.getIndexSwapGem();
        }

        let matchGemSizeThanThree = listMatchGem.find(gemMatch => gemMatch.sizeMatch > 3);

        if (matchGemSizeThanThree) {
            return matchGemSizeThanThree.getIndexSwapGem();
        }

        let matchGemSword = listMatchGem.find(gemMatch => gemMatch.type == GemType.SWORD);

        if (matchGemSword) {
            return matchGemSword.getIndexSwapGem();
        }

        console.log("myHeroGemType: ", this.myHeroGemType, "| Array.from(this.myHeroGemType)", Array.from(this.myHeroGemType));

        let matchGemType = listMatchGem.find(gemMatch => Array.from(this.myHeroGemType).includes(gemMatch.type));

        console.log("matchGem: ", matchGemType);


        if (matchGemType) {
            console.log("matchGemType ");
            return matchGemType.getIndexSwapGem();
        }

        console.log("listMatchGem[0].getIndexSwapGem() ", listMatchGem[0].getIndexSwapGem());

        return listMatchGem[0].getIndexSwapGem();
    }

    suggestMatch() {
        let listMatchGem = [];

        const tempGems = [...this.gems];

        console.log("tempGems: ", tempGems);

        tempGems.forEach(currentGem => {

            let swapGem = null;
            // If x > 0 => swap left & check

            // console.log("currentGem : ", currentGem);
            if (currentGem.x > 0) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x - 1), parseInt(currentGem.y))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If x < 7 => swap right & check
            if (currentGem.x < 7) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x + 1), parseInt(currentGem.y))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If y < 7 => swap up & check
            if (currentGem.y < 7) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x), parseInt(currentGem.y + 1))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If y > 0 => swap down & check
            if (currentGem.y > 0) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x), parseInt(currentGem.y - 1))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
        })
        return listMatchGem;
    }

    checkMatchSwapGem(listMatchGem, currentGem, swapGem) {

        this.swap(currentGem, swapGem);

        let matchGems = this.matchesAt(parseInt(currentGem.x), parseInt(currentGem.y));

        this.swap(currentGem, swapGem);


        if (matchGems.size > 0) {

            console.log("GemSwapInfo currentGem.index: ", currentGem.index, "swapGem.index: ", swapGem.index);

            listMatchGem.push(new GemSwapInfo(currentGem.index, swapGem.index, matchGems.length, currentGem.type));
        }
    }

    getGemIndexAt(x, y) {
        return x + y * 8;
    }

    swap(a, b) {
        let tempIndex = a.index;
        let tempX = a.x;
        let tempY = a.y;

        // update reference
        this.gems[a.index] = b;
        this.gems[b.index] = a;

        // update data of element
        a.index = b.index;
        a.x = b.x;
        a.y = b.y;

        b.index = tempIndex;
        b.x = tempX;
        b.y = tempY;
    }

    matchesAt(x, y) {
        let res = new Set();

        let center = this.gemAt(x, y);

        if (center === undefined) {

            console.error("gem center undefined");
            return res;
        }

        // check horizontally
        let hor = [];
        hor.push(center);
        let xLeft = x - 1, xRight = x + 1;
        while (xLeft >= 0) {
            let gemLeft = this.gemAt(xLeft, y);
            if (gemLeft) {
                if (!gemLeft.sameType(center)) {
                    break;
                }
                hor.push(gemLeft);
            }
            xLeft--;
        }
        while (xRight < 8) {
            let gemRight = this.gemAt(xRight, y);
            if (gemRight) {
                if (!gemRight.sameType(center)) {
                    break;
                }
                hor.push(gemRight);
            }
            xRight++;
        }
        if (hor.length >= 3) hor.forEach(gem => res.add(gem));

        // check vertically
        let ver = [];
        ver.push(center);
        let yBelow = y - 1, yAbove = y + 1;
        while (yBelow >= 0) {
            let gemBelow = this.gemAt(x, yBelow);
            if (gemBelow) {
                if (!gemBelow.sameType(center)) {
                    break;
                }
                ver.push(gemBelow);
            }
            yBelow--;
        }
        while (yAbove < 8) {
            let gemAbove = this.gemAt(x, yAbove);
            if (gemAbove) {
                if (!gemAbove.sameType(center)) {
                    break;
                }
                ver.push(gemAbove);
            }
            yAbove++;
        }
        if (ver.length >= 3) ver.forEach(gem => res.add(gem));

        return res;
    }

    // Find Gem at Position (x, y)
    gemAt(x, y) {
        return this.gems.find(g => g.x === x && g.y === y)
    }
}