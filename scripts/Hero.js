const HeroIdEnum = {
    THUNDER_GOD : 'THUNDER_GOD', // Zues deal aoe = attack + light gems
    MONK : 'MONK', // Orthur +5 damge to all 
    AIR_SPIRIT : 'AIR_SPIRIT', // Nefia deal damge and remove selected gem type 
    SEA_GOD : 'SEA_GOD', // Magni + attack and health to 1
    MERMAID : 'MERMAID', // Poko
    SEA_SPIRIT : 'SEA_SPIRIT', // Terra 
    FIRE_SPIRIT : 'FIRE_SPIRIT', // Sigmund  deal damge base on enemy attack + red gems
    CERBERUS : 'CERBERUS', //Cerberus deal dame = attack + increase self attack
    DISPATER : 'DISPATER', //Fate
    ELIZAH : 'ELIZAH', // ELIZAH
    TALOS : 'TALOS',
    MONKEY: 'MONKEY',
    GUTS: 'GUTS',
    
    SKELETON : 'SKELETON', // Skeleton
    SPIDER: 'SPIDER',
    WOLF: 'WOLF',
    BAT: 'BAT',
    BERSERKER: 'BERSERKER',
    SNAKE: 'SNAKE',
    GIANT_SNAKE: 'GIANT_SNAKE',
};
  

class Hero {
    constructor(objHero) {
        this.objHero = objHero;
        this.playerId = objHero.getInt("playerId");
        this.id = objHero.getUtfString("id");
        //this.name = id.name();
        this.attack = objHero.getInt("attack");
        this.hp = objHero.getInt("hp");
        this.mana = objHero.getInt("mana");
        this.maxMana = objHero.getInt("maxMana");

        this.gemTypes = [];
        this.gems = [];
        let arrGemTypes = objHero.getSFSArray("gemTypes");
        for (let i = 0; i < arrGemTypes.size(); i++) {
            const gemName = arrGemTypes.getUtfString(i);
            this.gemTypes.push(gemName);
            this.gems.push(GemType[gemName]);
        }

        //hero
        this.dispaterUseSkillCount = 0
    }

    updateHero(objHero) {
        this.attack = objHero.getInt("attack");
        this.hp = objHero.getInt("hp");
        this.mana = objHero.getInt("mana");
        this.maxMana = objHero.getInt("maxMana");
    }

    isAlive() {
        return this.hp > 0;
    }

    isFullMana() {
        return this.mana >= this.maxMana;
    }

    isHeroSelfSkill() {
        return HeroIdEnum.SEA_SPIRIT == this.id;
    }

    couldTakeMana(type) {
        return this.isAcceptManaType(type) && !this.isFullMana();
    }

    isAcceptManaType(type) {
        return this.gems.includes(type);
    }

    getMaxManaCouldTake() {
        return this.maxMana - this.mana;
    }

    takeDamge(damge) {
        this.hp = this.hp - damge;
    }

    takeMana(value) {
        this.mana += value;
    }

    buffAttack(additionalAttack) {
        this.attack += additionalAttack;
    }

    buffMana(additiionalMana) {
        this.mana += additiionalMana;
        this.mana = Math.max(this.mana, this.maxMana);
    }

    buffHp(additionalHp) {
        this.hp += additionalHp;
    }

    clone() {
        const cloned = new Hero(this.objHero);
        cloned.playerId = this.playerId;
        cloned.id = this.id;
        cloned.attack = this.attack;
        cloned.hp = this.hp;
        cloned.mana = this.mana;
        cloned.maxMana = this.maxMana;
        cloned.gemTypes = this.gemTypes;
        cloned.gems = this.gems;
        cloned.metrics = this.metrics;
        return cloned;
    }

    useSeaSpiritSkill(heros) {
        // buff for cerberus
        const cerberus = heros.find(hero => hero.id === HeroIdEnum.CERBERUS)
        if(cerberus) return cerberus
    
        // buff for seaSpirit
        const seaSpirit = heros.find(hero => hero.id === HeroIdEnum.SEA_SPIRIT)
        if(seaSpirit) return seaSpirit
    
        // buff for fireSpirit
        const fireSpirit = heros.find(hero => hero.id === HeroIdEnum.FIRE_SPIRIT)
        if(fireSpirit) return fireSpirit

        return heros[0]
    }

    useDispaterSkill(enermy) {
        this.dispaterUseSkillCount++
        
        const redGems = [...grid.gems].filter(gem => gem.type === GemType.RED).length
        const newHeroesEnermy = [...enermy.getHerosAlive()].map((value) => ({...value, damageTaken: value.hp - (value.attack + redGems) }))
        const canKillHeros = newHeroesEnermy.filter(hero => hero.damageTaken <= 0)
        const cantKillHeros = newHeroesEnermy.filter(hero => hero.damageTaken > 0)
        if(!!canKillHeros.length){
            let listTarget = canKillHeros.filter(hero => hero.mana === hero.maxMana)
            let target = listTarget.reduce((prev, curr) => {
                return prev.attack > curr.attack ? prev : curr
            } ,{})
            if (Object.values(target).length) return target

            target = canKillHeros.reduce((prev, curr) => {
                return prev.damageTaken > curr.damageTaken ? prev : curr
            },{})
            if (Object.values(target).length) return target

            return canKillHeros[0]
        }
        
if(!!cantKillHeros){
    let listTarget = cantKillHeros.filter(hero => hero.mana === hero.maxMana)
    let target = listTarget.reduce((prev, curr) => {
        return prev.attack > curr.attack ? prev : curr
    } ,{})
    if (Object.values(target).length) return target

    target = cantKillHeros.reduce((prev, curr) => {
        return prev.damageTaken < curr.damageTaken ? prev : curr
    },{})
    if (target) return target

    return cantKillHeros[0]
}

        if(this.dispaterUseSkillCount < 2) {
            return enermy.getHeroMostHealth()
        } else {
            return enermy.getHeroMostDamage()
        }
    }
}