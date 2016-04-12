describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function (test) {
            test.equal(-1, [1, 2, 3].indexOf(5));
            test.equal(-1, [1, 2, 3].indexOf(0));
        })
    })
})