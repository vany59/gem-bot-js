class Visualizer {
    constructor({ el }) {
        this.element =  document.querySelector(el);
        this.init();
    }

    setGame({ game, grid, botPlayer, enemyPlayer }) {
        this.game = game;
        this.gameGrid = grid;
        this.botPlayer = botPlayer;
        this.enemyPlayer = enemyPlayer;
    } 
    
    init() {
        this.initGrid();
    }

    initGrid() {
        this.grid = this.element.querySelector('table#grid');
        this.rows = this.grid.querySelectorAll('tr');
        this.cells = this.grid.querySelectorAll('td');
        this.player1 = this.element.querySelector('#player-1');
        this.player2 = this.element.querySelector('#player-2');
    }

    render() {
        this.renderPlayer(this.player1, this.botPlayer);
        this.renderPlayer(this.player2, this.enemyPlayer);
        this.genderGrid();
    }

    genderGrid() {
        const gameGrid = this.gameGrid || {};
        const gems = gameGrid.gems || [];
        const cells = this.cells;
        for(var i = 0; i < cells.length; i++) {
            var cell = cells[i] || null;
            const gem = (gems).find((gem) => gem.index === i);
            this.renderCell(cell, gem);
        }
    }

    renderPlayer(element, player) {
        if(!player) {
            return;
        }
        const infoEl = element.querySelector('.info');
        infoEl.innerHTML = `
        <div>ID: ${player.playerId}</div>
        <div>Name: ${player.displayName}</div>
        `

        const heroEls = element.querySelectorAll('.hero');
        for(let i = 0; i <  heroEls.length; i++) {
            const heroEl = heroEls[i];
            const playerHero = player.heroes[i];
            this.renderHero(heroEl, playerHero);
        }
    }

    renderHero(element, hero) {
        const gems = hero.gems.map(gem => (`<span style="color: ${GemColor[gem]};">${gem} </span>`))
        const attributes = 
            `
            <div>ID: ${hero.id}</div>
            <div>Name: ${hero.name || ''}</div>
            <div>Hp: ${hero.hp}</div>
            <div>Mana: ${hero.mana}/${hero.maxMana}</div>
            <div>Gems: ${gems.join(', ')}</div>
            `
        element.innerHTML = attributes;
    }

    renderCell(cell, gem) {
        const type = gem ?  gem.type : '';
        cell.innerText = type;
        cell.style.color = GemColor[type];
    }

    start() {
        this.intervalId = setInterval(visualizer.render.bind(this), 500);
    }
}