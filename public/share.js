(function(exports){
    exports.isJSON = function(string){
        try {
            JSON.parse(string);
        } catch (e) {
            return false;
        }
        return true;
    };
}(typeof exports === 'undefined' ? this.isJSON = {} : exports));

(function(exports){
    exports.rand = function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    };
}(typeof exports === 'undefined' ? this.rand = {} : exports));
