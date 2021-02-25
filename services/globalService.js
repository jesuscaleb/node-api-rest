'use strict';
const _globalService = {
	checkObjValuesTrue: (obj) => {
		for(var o in obj)
          if(!obj[o]) return false;
        
      	return true;
	},
    uniqueSuffix : () => {
	    let now = new Date();
	    let date = ("0" + now.getDate()).slice(-2);
	    let month = ("0" + (now.getMonth() + 1)).slice(-2);
	    let year = now.getFullYear();
	    let output = date + month + year;
	    return output;
	}
}

module.exports = _globalService;