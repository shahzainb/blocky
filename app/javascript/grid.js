export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
	}
}

export class BlockGrid {
	constructor() {
		this.grid = [];
		this.currentColour = '';
		this.coordinatesList = [];

		for (let x = 0; x < MAX_X; x++) {
			let col = [];
			for (let y = 0; y < MAX_Y; y++) {
				col.push(new Block(x, y));
			}

			this.grid.push(col);
		}

		return this;
	}

	render(el = document.querySelector('#gridEl')) {
		while (el.hasChildNodes()) {
			el.removeChild(el.lastChild);
		}
		for (let x = 0; x < MAX_X; x++) {
			let id = 'col_' + x;
			let colEl = document.createElement('div');
			colEl.className = 'col';
			colEl.id = id;
			el.appendChild(colEl);

			for (let y = MAX_Y - 1; y >= 0; y--) {
				let block = this.grid[x][y],
					id = `block_${x}x${y}`,
					blockEl = document.createElement('div');

				blockEl.id = id;
				blockEl.className = 'block';
				blockEl.style.background = block.colour;
				blockEl.addEventListener('click', (evt) => this.blockClicked(evt, block));
				colEl.appendChild(blockEl);
			}
		}

		return this;
	}

	blockClicked(e, block) {
		e.preventDefault();
		
		const {x, y} = block;
		
		if (block.colour === 'white') {
			return;
		}
		
		this.currentColour = block.colour;
		this.coordinatesList = [];
		
		this
			.findNeighbours(x, y)
			.updateGrid()
			.render();

	}

	updateGrid() {
		
		// copy of grid
		let tempGrid = JSON.parse(JSON.stringify(this.grid));

		this.coordinatesList.forEach(coordinates => {

			let blockToMove = this.grid[coordinates.x][coordinates.y];
			blockToMove.colour = 'white';

			let indexToRemove = 0;
			tempGrid[coordinates.x].forEach((block, index) => {
				if (block.y === coordinates.y) {
					indexToRemove = index;
				}
			});

			tempGrid[coordinates.x].splice(indexToRemove, 1);
			tempGrid[coordinates.x].splice(tempGrid[coordinates.x].length, 0, blockToMove);
		});

		// fixing the y indices
		this.coordinatesList.forEach(coordinates => {
			tempGrid[coordinates.x].forEach((block, index) => {
				block.y = index;
			});
		});

		this.grid = tempGrid;
		return this;
	}

	findNeighbours(x, y) {
		// neighbours can be from -1 to +1 in x or y
		this.coordinatesList.push({
			x: x,
			y: y
		});

		for (let xx = -1; xx <= 1; xx++) {
			for (let yy = -1; yy <= 1; yy++) {

				const newX = x + xx;
				const newY = y + yy;

				if (xx === 0 && yy === 0) {
					// this is the current block 
					continue;
				}
				if (Math.abs(xx) + Math.abs(yy) > 1) {
					// beyond the neighbour (it's the diagonal);
					continue;
				}
				if (this.isInArray(newX, newY)) {
					continue;
				}

				if (this.isValidNeighbour(newX, newY)) {
					this.findNeighbours(newX, newY);
				}
			}
		}

		return this;
	}

	isValidNeighbour(x, y) {
		const blockEl = document.getElementById(`block_${x}x${y}`);
		return (blockEl && blockEl.style.background === this.currentColour) ? true : false;
	}

	isInArray(x, y) {
		let isInArray = false;
		this.coordinatesList.forEach(coordinate => {
			if (coordinate.x === x && coordinate.y === y) {
				isInArray = true;
			}
		});
		return isInArray;
	}
}
