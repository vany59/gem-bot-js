function union (sets) {
    return sets.reduce((combined, list) => {
      return new Set([...combined, ...list]);
    }, new Set());
  }

class GridDistinction {
    removedGems = [];
    matchesSize = [];
}
class Grid {
    constructor(gemsCode, gemModifiers, gemTypes) {
        this.gems = [];
        this.gemeCode = gemsCode;
        this.gemTypes = new Set();
        this.updateGems(gemsCode, gemModifiers);
        this.myHeroGemType = gemTypes;
    }

    updateGems(gemsCode, gemModifiers) {
        this.gems = [];
        this.gemeCode = gemsCode;
        this.gemTypes = new Set();

        for (let i = 0; i < gemsCode.size(); i++) {
            let gem = new Gem(i, gemsCode.getByte(i), gemModifiers != null ? gemModifiers.getByte(i) : GemModifier.NONE);
            this.gems.push(gem);

            this.gemTypes.add(gem.type);

            // console.log(i + ": " + gem.type)
        }
    }

    getPriorityGem() {
        const heroGemType = new Set();
        let aliveHeros = botPlayer.heroes.filter(hero => hero.isAlive())

        debugger
        const cerberusIdx = aliveHeros.findIndex(hero => hero.id === HeroIdEnum.CERBERUS)
        if(cerberusIdx > -1) {
            aliveHeros[cerberusIdx].gems.forEach(gem => heroGemType.add(gem))
        }

        const fireSpiritIdx = aliveHeros.findIndex(hero => hero.id === HeroIdEnum.FIRE_SPIRIT)
        if(fireSpiritIdx > -1) {
            const gems = aliveHeros[fireSpiritIdx].gems.sort((a,b) => b - a)
            gems.forEach(gem => heroGemType.add(gem))
        }

        const seaSpiritIdx = aliveHeros.findIndex(hero => hero.id === HeroIdEnum.SEA_SPIRIT)
        if(seaSpiritIdx > -1) {
            aliveHeros[seaSpiritIdx].gems.forEach(gem => heroGemType.add(gem))
        }
    
        return heroGemType
    }

    checkPossibleKillEnemy(listMatchGem) {
        const haveSword = listMatchGem.find(gemMatch => gemMatch.type == GemType.SWORD)
        const botDmg = botPlayer.getHerosAlive()[0].attack
        const botHp = botPlayer.getHerosAlive()[0].hp
        const enemyDmg = enemyPlayer.getHerosAlive()[0].attack
        const enemyHp = enemyPlayer.getHerosAlive()[0].hp
        console.log('gach ong 2: ',botDmg > enemyHp , enemyDmg > botHp)
        if( haveSword && (botDmg > enemyHp || enemyDmg > botHp)) return haveSword.getIndexSwapGem()
        return []
    }

    recommendSwapGem() {
        let listMatchGem = this.suggestMatch();

        console.log("Zâza recommendSwapGem: ", listMatchGem);

        // debugger

        if (listMatchGem.length === 0) {
            return [-1, -1];
        }

        let matchGemSizeThanFour = listMatchGem.find(gemMatch => gemMatch.sizeMatch > 4 || !!gemMatch.getSetGems().includes(GemModifier.EXTRA_TURN));
        if (matchGemSizeThanFour) {
            return matchGemSizeThanFour.getIndexSwapGem();
        }

        // 4 swords
        let matchGemSword4 = listMatchGem.find(gemMatch => gemMatch.type == GemType.SWORD && gemMatch.sizeMatch > 3);
        if (matchGemSword4 && matchGemSword4.getIndexSwapGem) {
            return matchGemSword4.getIndexSwapGem();
        }

        let useSwordKillEnemy = this.checkPossibleKillEnemy(listMatchGem)
        if(!!useSwordKillEnemy.length){
            console.log('gach ong t phang')
            return useSwordKillEnemy;
        }

        // >= 6 gems
        let multiGemsFlag = []
        listMatchGem.reduce((prev, curr) => {
            if(!prev.index1) return curr

            if(curr.index1 === prev.index2 && curr.index2 === prev.index1) multiGemsFlag = [curr.index1, curr.index2]

            return curr
        },{})
        if(!!multiGemsFlag.length){
            console.log('an double ne')
            return multiGemsFlag
        }

        const listExcludeModifiers = [GemModifier.HIT_POINT, GemModifier.BUFF_ATTACK, GemModifier.POINT]
        debugger
        let matchGemModifers = listMatchGem.find(gemMatch => !!gemMatch.getSetGems().length && !gemMatch.getSetGems().some(e => listExcludeModifiers.includes(e)))
        if (matchGemModifers){
            return matchGemModifers.getIndexSwapGem();
        }

        const recommendGem = this.getPriorityGem()

        let gemType = Array.from(recommendGem).find(gemValue => listMatchGem.find(e => e.type === gemValue))
        let matchGemType = listMatchGem.filter(match => match.type === gemType).reduce(function(prev, current) {
            return (prev.sizeMatch > current.sizeMatch) ? prev : current
        },{})
        
        console.log("matchGem: ", matchGemType);
        if (matchGemType && matchGemType.getIndexSwapGem) {
            console.log("matchGemType ");
            return matchGemType.getIndexSwapGem();
        }

        let matchGemSword = listMatchGem.find(gemMatch => gemMatch.type == GemType.SWORD);
        if (matchGemSword && matchGemSword.getIndexSwapGem) {
            return matchGemSword.getIndexSwapGem();
        }

        let matchGemSizeThanThree = listMatchGem.find(gemMatch => gemMatch.sizeMatch > 3);
        const isIncludeGemsCollection = botPlayer.heroes.some(hero => hero.gems.includes(matchGemSizeThanThree?.type))
        if (matchGemSizeThanThree && isIncludeGemsCollection) {
            return matchGemSizeThanThree.getIndexSwapGem();
        }
        // console.log("myHeroGemType: ", this.myHeroGemType, "| Array.from(this.myHeroGemType)", Array.from(this.myHeroGemType));
        // const recommendGem = this.getPriorityGem()

        // let matchGemType = recommendGem.find(gemValue => listMatchGem.find(e => e.type === gemValue)) //listMatchGem.find(gemMatch => Array.from(recommendGem).includes(gemMatch.type));
        // debugger

        // console.log("matchGem: ", matchGemType);


        // if (matchGemType) {
        //     console.log("matchGemType ");
        //     return matchGemType.getIndexSwapGem();
        // }

            // console.log(listMatchGem[0].getSizeMatch())
            console.log("listMatchGem[0].getIndexSwapGem() ", listMatchGem[0].getIndexSwapGem());

        return listMatchGem[0].getIndexSwapGem();
    }

    suggestMatch() {
        let listMatchGem = [];

        const tempGems = [...this.gems];

        // console.log('suggest match gém: ', this.gems)

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

        if(currentGem.locked || swapGem.locked) {
            return;
        }

        this.swap(currentGem, swapGem);

        let matchGems = this.matchesAt(parseInt(currentGem.x), parseInt(currentGem.y));

        this.swap(currentGem, swapGem);
        

        if (matchGems.size > 0) {
            listMatchGem.push(new GemSwapInfo(currentGem.index, swapGem.index, matchGems.size, currentGem.type, matchGems));
        }
    }

    isExtraTurnBeforeCastSkill(){
        let listMatchGem = this.suggestMatch();
        let matchGemSizeThanFour = listMatchGem.find(gemMatch => gemMatch.sizeMatch > 4 || !!gemMatch.getSetGems().includes(GemModifier.EXTRA_TURN));
        if (matchGemSizeThanFour) {
            return true
        }
        return false
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

    swapIndex(index1, index2) {
        const gem1 = this.gems[index1];
        const gem2 = this.gems[index2];
        return this.swap(gem1, gem2);
    }

    matchesAt(x, y) {
        let res = new Set();

        let center = this.gemAt(x, y);

        if(center.type === -1 || center.removed || center.locked) {
            return res;
        }

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

    performSwap(index1, index2) {
        const currentGem = this.gems[index1];
        const swapGem = this.gems[index2];
        console.log(currentGem, swapGem);
        this.swap(currentGem, swapGem);
        const allMatchGems = this.getAllMatches();
        const distinction = new GridDistinction();
        const result = this.performDistinction(allMatchGems, distinction);
        return result;
    }
    
    getAllMatches() {
        const matches = [];
        for(const gem of this.gems) {
            const matchGems = this.matchesAt(parseInt(gem.x), parseInt(gem.y)); 
            if(matchGems.size > 0) {
                matches.push(matchGems);
            }
        }
        return matches.length > 0 ? matches : [];
    }
    
    performDistinction(allMatchGems, distinction) {
        for(const matchGems of allMatchGems) {
            this.distinctGemBatch(matchGems, distinction)
        }
        this.performReshape();
        const nextMatches = this.getAllMatches();
        if(nextMatches.length > 0) {
            this.performDistinction(nextMatches, distinction);
        } 
        return distinction;
    }

    performGemEffect(gem, distinction) {
        switch(gem.modifier) {
            case GemModifier.EXPLODE_HORIZONTAL: {
                this.performExplodeHorizontal(gem, distinction);
            } 
            case GemModifier.EXPLODE_VERTICAL: {
                this.performExplodeVertical(gem, distinction);
            } 
            case GemModifier.EXPLODE_SQUARE: {
                this.performExplodeSquare(gem, distinction);
            } 
        }
    }

    performExplodeHorizontal(gem, distinction) {
        for(let x = 0; x < 8; x++) {
            const targetGem = this.gemAt(x, gem.y);
            if(!targetGem.sameOne(gem)) {
                this.distinctGem(targetGem, distinction);
            }
        }
    }

    performExplodeVertical(gem, distinction) {
        for(let y = 0; y < 8; y++) {
            const targetGem = this.gemAt(gem.x, y);
            if(!targetGem.sameOne(gem)) {
                this.distinctGem(targetGem, distinction);
            }
        }
    }

    performExplodeSquare(gem, distinction) {
        for(let x = gem.x - 1; x < gem.x + 1; x++) {
            for(let y = gem.y - 1; y < gem.y + 1; y++) {
                const targetGem = this.gemAt(gem.x, y);
                if(!targetGem.sameOne(gem)) {
                    this.distinctGem(targetGem, distinction);
                }
            }
        }
    }

    distinctGemBatch(gems, distinction) {
        distinction.matchesSize.push(gems.size);
        for(const gem of gems) {
            this.distinctGem(gem, distinction);
        }
        
    }

    maxLinearMatch(gems) {
        const matchesX = {};
        const matchesY = {};

        for(const gem of gems) {
            matchesX[gem.x] = matchesX[gem.x] ? 1 : matchesX[gem.x] + 1;  
            matchesY[gem.y] = matchesY[gem.y] ? 1 : matchesY[gem.y] + 1;  
        }

        const maxX = Math.max(...Object.values(matchesX));
        const maxY = Math.max(...Object.values(matchesY));
        return Math.max(maxX, maxY);

    }

    distinctGem(gem, distinction) {
        if(gem.removed || gem.locked) {
            return;
        }
        gem.removed = true;
        this.performGemEffect(gem, distinction);
        distinction.removedGems.push(gem.clone());
    }

    performReshape() {
        for(const gem of this.gems) {
            if(gem.removed) {
                const aboveGem = this.gemAt(gem.x, gem.y + 1);
                if(!aboveGem) {
                    gem.removed = false;
                    gem.locked = true;
                    gem.type = -1;
                } else {
                    gem.type = aboveGem.type;
                    gem.locked = aboveGem.locked;
                    gem.removed = aboveGem.removed;
                    aboveGem.removed = true;
                    aboveGem.type = -1;
                }
            }
        }

        const toRemove = this.gems.find(gem => gem.removed);
        if(toRemove) {
            this.performReshape();
        }
        return false;
    }

    clone() {
        const cloned = new Grid({ size: () => 0 }, new Set());
        cloned.gems = this.gems.map(gem => gem.clone());
        cloned.gemTypes = new Set(Array.from(this.gemTypes));
        cloned.myHeroGemType = new Set(Array.from(this.myHeroGemType));
        return cloned;
    }
}