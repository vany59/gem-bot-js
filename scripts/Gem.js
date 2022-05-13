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


const GemColor = {
    '-1': 'gray',
    0: '#00000073',
    1: '#00800080',
    2: '#ffff0075',
    3: '#ff000075',
    4: '#80008080',
    5: '#0000ff75',
    6: '#78252570'
}

const HEIGHT = 8;
const WIDTH = 8;

class Gem {

    constructor(index, type) {
        this.index = index;
        this.type = type;

        this.x = -1;
        this.y = -1;

        this.updatePosition();
    }

    updatePosition() {
        this.y = parseInt(this.index / HEIGHT);
        this.x = parseInt(this.index - this.y * WIDTH);
    }

    sameType(other) {
        return this.type === other.type;
    }
}