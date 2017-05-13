array2string = function(data) {
  var out = "";
  if (data && data.length > 0 && "url" in data) {
    out = out + " <a href=\"" + data.url + "\">" + data.title + "</a>";
  }
  for (var key in data) {
    if (key !== "title" && key !== "url" && data[key]) {
      out = out + " " + key + ':' + data[key];
    }
  };
  return out;
}

exports.arraylist2string = function(data) {
    var out = ""
    for (var i = 0; i < data.length; i++) {
	out = out + array2string(data[i]) + ",\n";
    };
    return out;
}

exports.subset = function(obj, propList) {
  return propList.reduce(function(newObj, prop) {
    obj.hasOwnProperty(prop) && (newObj[prop] = obj[prop]);
    return newObj;
  }, {});
}
