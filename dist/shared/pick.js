"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tikahne T type ta Object k extends kore, R object Record<> er madhome lekhte hoi
const pick = (obj, keys) => {
    // console.log(obj, key)
    const finalObj = {};
    for (const key of keys) {
        // key and obj er key same thakle only se key gulu debe ai hasOwnProperty.call
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            //   console.log(key);
            finalObj[key] = obj[key];
        }
    }
    //   console.log(finalObj);
    return finalObj;
};
exports.default = pick;
