/**
 * Created by Praveen on 27/10/2015.
 */



function _addDataToBuffer(buffer) {
    let temp = new Uint8Array(this.dataBuffer.length, buffer.length);
    temp.set(this.dataBuffer);
    temp.set(buffer, this.dataBuffer.length);
    this.dataBuffer = temp;
}

describe('Data Buffer', () => {

    describe('when data is added ', () => {



        it('should add the data to the end ', () => {



        });

    });

} );
