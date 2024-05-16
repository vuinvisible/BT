// function getRandomCat(catsArr){
//     return catsArr[Math.floor(Math.random() * catsArr.length)]
// }

// module.exports = {
//     getRandomCat: getRandomCat,
// };

(function(exports) {
    exports.getRandomCat = function(catsArr) {
        return catsArr[Math.floor(Math.random() * catsArr.length)];
        };
    }
    (typeof exports === 'undefined' ? this.getRandomCatBrowser = {}: exports)
);