const sortObjDataByKey = function (object) {
    const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
    return orderedObject;
}

module.exports = sortObjDataByKey;