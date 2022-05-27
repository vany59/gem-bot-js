class MetaHero extends Hero {
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
  }

  useSeaSpiritSkill() {
    let arr = this.heroes.filter(hero => hero.isAlive());
    // buff for cerberus
    const cerberus = arr.find(hero => hero.id === HeroIdEnum.CERBERUS)
    if(cerberus) return cerberus

    // buff for seaSpirit
    const seaSpirit = arr.find(hero => hero.id === HeroIdEnum.SEA_SPIRIT)
    if(seaSpirit) return seaSpirit

    // buff for fireSpirit
    const fireSpirit = arr.find(hero => hero.id === HeroIdEnum.FIRE_SPIRIT)
    if(fireSpirit) return fireSpirit
  }
}