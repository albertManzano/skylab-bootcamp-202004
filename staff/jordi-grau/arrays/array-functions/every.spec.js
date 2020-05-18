'use strict'

describe('every', function () {
    it('should return a boolean, depending if all the elements of the array pass a specificated condition', function () {
        var array = [1,2,3,4,5,6,7];

        var result1 = every(array,function(element){
            return element < 8
        })
        var result2 = every(array,function(element){
            return element > 8
        })

        expect(result1).toBe(true)
        expect(result2).toBe(false)
       
    
    });
    it('should show the value of the last position of one array as a variable', function(){
        var array = ['hola','hola','hola','hola'];

        var result1 = every(array,function(element){
            return element === 'hola';
        })
        var result2 = every(array,function(element){
            return typeof element === 'string';
        })
       expect(result1).toBe(true)
        expect(result2).toBe(true)
     });
});
