const assert = require('assert');
const vm = require('../../../index.js');
const BigNumber = require('bignumber.js');
function bufferToArrayBuffer(b ){
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

describe('App Test', function() {
    it ('could ction in context', (done) => {
        let isTriggered = false;

        function apiFunction(resolve, param) {
            isTriggered = true;
            var number = BigNumber(param);
            var expect = BigNumber(123.4567);
            assert(number.isEqualTo(expect));
            return true;
        }
        const fs = require('fs');

        var contextStr = fs.readFileSync('dist/index.js');
        var apiObject = {
            helloInHost: apiFunction
        };

        const contextAB = bufferToArrayBuffer(Buffer.from(contextStr));
        const contextU8Buf = new Uint8Array(contextAB, 0, contextAB.byteLength);
        vm.run('helloInVm("hi");', contextU8Buf, apiObject,  {cpuCount:1, memSizeKB:200}, (err, ret) => {
            assert(isTriggered);
            assert(ret === true);
            done();
        });
    });
});


