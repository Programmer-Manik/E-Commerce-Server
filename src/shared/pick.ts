// tikahne T type ta Object k extends kore, R object Record<> er madhome lekhte hoi
const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  // console.log(obj, key)

  const finalObj: Partial<T> = {};

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

export default pick;
