const GemType = {
    NONE : -1,
    SWORD : 0,
    GREEN : 1,
    YELLOW : 2,
    RED : 3,
    PURPLE : 4,
    BLUE : 5,
    BROWN : 6
}

const HEIGHT = 8;
const WIDTH = 8;

class Gem {
    
    constructor(index, type){
        this.index = index;
        this.type = type;

        this.x = -1;
        this.y = -1;

        this.updatePosition();
    }

    updatePosition() {
        this.y = this.index / HEIGHT;
        this.x = this.index - this.y * WIDTH;
    }

    sameType(other) {
        return this.type == other.type;
    }
}