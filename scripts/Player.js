class Player
{
    constructor(playerId, name)
    {
        this.signature = Math.random();
        this.playerId = playerId;
        this.displayName = name;

        this.heroes = [];
        this.heroGemType = new Set();
    }

    getTotalHeroAlive() {
        return this.getHerosAlive().length;
    }

    getHerosAlive() {
        return this.heroes.filter(hero => hero.isAlive());
    }
    

    getCastableHeros() {
        let arr = this.heroes.filter(hero => hero.isAlive() && hero.isFullMana());
        return arr;
    }

    sameOne(other) {
        return this.signature == other.signature;
    }

    isLose() {
        return !this.firstHeroAlive();
    }

    anyHeroFullMana() {
        let arr = this.heroes.filter(hero => hero.isAlive() && hero.isFullMana());

        // if(arr.length > 1) return this.highSkillPriorityHero(arr) //delete
        // return null

        return this.highSkillPriorityHero(arr)
        // let hero = arr != null && arr != undefined && arr.length > 0 ? arr[0] : null;
        // return hero;
    }

    checkHeroBuffSkill(heros = []) {
        const ceberus = heros.find(e => e.id.toString() === HeroIdEnum.CERBERUS)
        const seaSpirit = heros.find(e => e.id.toString() === HeroIdEnum.SEA_SPIRIT)
        if(ceberus && seaSpirit) {
            return seaSpirit
        }
        return null
    }

    highSkillPriorityHero(heros = []) {
        if(!heros.length) return null

        let hero = null
        // dispater
        hero = heros.find(e => e.id.toString() === HeroIdEnum.DISPATER)
        if(hero) return hero

        hero = this.checkHeroBuffSkill(heros)
        if(hero) return hero

        // ceberus
        hero = heros.find(e => e.id.toString() === HeroIdEnum.CERBERUS)
        if(hero) return hero

        // seaSpirit
        hero = heros.find(e => e.id.toString() === HeroIdEnum.SEA_SPIRIT)
        if(hero) return hero

        return heros[0]
    }

    firstHeroAlive() {
        let arr = this.heroes.filter(hero => hero.isAlive());

        let hero = arr != null && arr != undefined && arr.length > 0 ? arr[0] : null;
        return hero;
    }

    getRecommendGemType() {
        this.heroGemType = new Set();

        for (let i = 0; i < this.heroes.length; i++){
            let hero = this.heroes[i];

            for (let j = 0; j < hero.gemTypes.length; j++){
                let gt = hero.gemTypes[j];
                this.heroGemType.add(GemType[gt]);
            }
        }        

        return this.heroGemType;
    }

    firstAliveHeroCouldReceiveMana(type) {
        const res = this.heroes.find(hero => hero.isAlive() && hero.couldTakeMana(type));
        return res;
    }

    clone() {
        const cloned = new Player(this.playerId, this.displayName);
        cloned.heroes = this.heroes.map(hero => hero.clone());
        cloned.heroGemType = new Set(Array.from(this.heroGemType));
        cloned.signature = this.signature;
        cloned.metrics = this.metrics;
        return cloned;
    }

    getHeroMostHealth() {
        const heros = this.heroes.filter(hero => hero.isAlive())
        const hps = heros.map(hero => hero.hp)
        const max = Math.max(...hps);
        const index = hps.indexOf(max);
        return heros[index]
    }

    getHeroMostDamage() {
        const heros = this.heroes.filter(hero => hero.isAlive())
        const attacks = heros.map(hero => hero.attack)
        const max = Math.max(...attacks);
        const index = attacks.indexOf(max);
        return heros[index]
    }
}