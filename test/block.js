import { Block, COLOURS, BlockGrid } from '../app/javascript/grid';
import { assert } from 'chai';

describe('Block', () => {

    it('should be created with correctly', () => {
        let testCoords = [
            [1, 2],
            [4, 9],
            [0, 0]
        ];

        testCoords.forEach((testCoord) => {
            let block = new Block(...testCoord);
            assert.equal(block.x, testCoord[0], 'x is set correctly');
            assert.equal(block.y, testCoord[1], 'y is set correctly');
            assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
        });
    });

});

describe('BlockGrid', () => {
    const grid = new BlockGrid();
    
    it('should be created correctly', () => {
        assert.ok(grid.grid.length === 10, 'length is valid');
    });
});
